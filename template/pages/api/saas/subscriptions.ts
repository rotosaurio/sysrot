import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';
import { z } from 'zod';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

// Validation schemas
const createSubscriptionSchema = z.object({
  organizationId: z.string().min(1, 'Organization ID is required'),
  planId: z.string().min(1, 'Plan ID is required'),
  billingInterval: z.enum(['month', 'year']).default('month')
});

const updateSubscriptionSchema = z.object({
  planId: z.string().min(1, 'Plan ID is required'),
  billingInterval: z.enum(['month', 'year']).optional()
});

async function hasPermission(userId: string, organizationId: string, requiredRole: string[] = ['OWNER', 'ADMIN']) {
  const membership = await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId,
        userId
      }
    }
  });
  return membership && requiredRole.includes(membership.role);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession({ req });
    
    if (!session?.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { method, query } = req;
    const { organizationId } = query;

    switch (method) {
      case 'GET':
        return await getSubscription(req, res);

      case 'POST':
        return await createSubscription(req, res);

      case 'PUT':
        return await updateSubscription(req, res);

      case 'DELETE':
        return await cancelSubscription(req, res);

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end('Method Not Allowed');
    }
  } catch (error) {
    console.error('Subscriptions API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}

async function getSubscription(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const { organizationId } = req.query;

  if (!organizationId || typeof organizationId !== 'string') {
    return res.status(400).json({ error: 'Organization ID is required' });
  }

  try {
    // Check permissions
    const hasAccess = await hasPermission(session.user.id, organizationId);
    
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const subscription = await prisma.subscription.findUnique({
      where: { organizationId },
      include: {
        plan: true,
        organization: {
          select: {
            name: true,
            status: true
          }
        }
      }
    });

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    // Get Stripe subscription details if available
    let stripeSubscription = null;
    if (subscription.stripeSubscriptionId) {
      try {
        stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId);
      } catch (error) {
        console.warn('Failed to fetch Stripe subscription:', error);
      }
    }

    res.status(200).json({ 
      subscription: {
        ...subscription,
        stripeDetails: stripeSubscription
      }
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
}

async function createSubscription(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  try {
    const validatedData = createSubscriptionSchema.parse(req.body);
    const { organizationId, planId, billingInterval } = validatedData;

    // Check permissions
    const hasAccess = await hasPermission(session.user.id, organizationId, ['OWNER']);
    
    if (!hasAccess) {
      return res.status(403).json({ error: 'Only organization owners can manage subscriptions' });
    }

    // Check if organization already has a subscription
    const existingSubscription = await prisma.subscription.findUnique({
      where: { organizationId }
    });

    if (existingSubscription) {
      return res.status(400).json({ error: 'Organization already has a subscription' });
    }

    // Get organization and plan details
    const [organization, plan] = await Promise.all([
      prisma.organization.findUnique({
        where: { id: organizationId },
        include: {
          members: {
            where: { role: 'OWNER' },
            include: { user: true }
          }
        }
      }),
      prisma.plan.findUnique({
        where: { id: planId }
      })
    ]);

    if (!organization || !plan) {
      return res.status(404).json({ error: 'Organization or plan not found' });
    }

    const owner = organization.members[0]?.user;
    if (!owner) {
      return res.status(400).json({ error: 'Organization owner not found' });
    }

    // Create or retrieve Stripe customer
    let stripeCustomer;
    const existingCustomers = await stripe.customers.list({
      email: owner.email,
      limit: 1
    });

    if (existingCustomers.data.length > 0) {
      stripeCustomer = existingCustomers.data[0];
    } else {
      stripeCustomer = await stripe.customers.create({
        email: owner.email,
        name: owner.name || undefined,
        metadata: {
          organizationId: organization.id,
          organizationName: organization.name
        }
      });
    }

    // Determine the price based on billing interval
    const stripePriceId = billingInterval === 'year' && plan.stripePriceId 
      ? plan.stripePriceId // Assume yearly price ID is stored differently or calculated
      : plan.stripePriceId;

    if (!stripePriceId) {
      return res.status(400).json({ error: 'Plan does not have a valid Stripe price ID' });
    }

    // Create Stripe subscription
    const stripeSubscription = await stripe.subscriptions.create({
      customer: stripeCustomer.id,
      items: [{ price: stripePriceId }],
      trial_period_days: organization.trialEndsAt && organization.trialEndsAt > new Date() ? 14 : undefined,
      metadata: {
        organizationId: organization.id,
        planId: plan.id
      }
    });

    // Create subscription in database
    const subscription = await prisma.subscription.create({
      data: {
        organizationId,
        planId,
        stripeCustomerId: stripeCustomer.id,
        stripeSubscriptionId: stripeSubscription.id,
        stripePriceId,
        status: stripeSubscription.status === 'active' ? 'ACTIVE' : 
                stripeSubscription.status === 'trialing' ? 'TRIALING' : 'ACTIVE',
        currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
        trialStart: stripeSubscription.trial_start ? new Date(stripeSubscription.trial_start * 1000) : null,
        trialEnd: stripeSubscription.trial_end ? new Date(stripeSubscription.trial_end * 1000) : null,
        stripeCurrentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000)
      },
      include: {
        plan: true
      }
    });

    // Update organization with new plan
    await prisma.organization.update({
      where: { id: organizationId },
      data: {
        planId,
        userLimit: plan.userLimit,
        storageLimit: plan.storageLimit,
        apiLimit: plan.apiLimit
      }
    });

    // Log activity
    await prisma.activity.create({
      data: {
        organizationId,
        userId: session.user.id,
        action: 'subscription_created',
        metadata: {
          planName: plan.name,
          stripeSubscriptionId: stripeSubscription.id
        }
      }
    });

    res.status(201).json({ 
      subscription,
      checkoutUrl: null, // Could add checkout session URL if needed
      message: 'Subscription created successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: error.errors
      });
    }
    
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
}

async function updateSubscription(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const { organizationId } = req.query;

  if (!organizationId || typeof organizationId !== 'string') {
    return res.status(400).json({ error: 'Organization ID is required' });
  }

  try {
    const validatedData = updateSubscriptionSchema.parse(req.body);
    const { planId } = validatedData;

    // Check permissions
    const hasAccess = await hasPermission(session.user.id, organizationId, ['OWNER']);
    
    if (!hasAccess) {
      return res.status(403).json({ error: 'Only organization owners can manage subscriptions' });
    }

    // Get current subscription and new plan
    const [currentSubscription, newPlan] = await Promise.all([
      prisma.subscription.findUnique({
        where: { organizationId },
        include: { plan: true }
      }),
      prisma.plan.findUnique({
        where: { id: planId }
      })
    ]);

    if (!currentSubscription || !newPlan) {
      return res.status(404).json({ error: 'Subscription or plan not found' });
    }

    if (currentSubscription.planId === planId) {
      return res.status(400).json({ error: 'Already subscribed to this plan' });
    }

    // Update Stripe subscription
    if (currentSubscription.stripeSubscriptionId && newPlan.stripePriceId) {
      const stripeSubscription = await stripe.subscriptions.retrieve(
        currentSubscription.stripeSubscriptionId
      );

      await stripe.subscriptions.update(currentSubscription.stripeSubscriptionId, {
        items: [{
          id: stripeSubscription.items.data[0].id,
          price: newPlan.stripePriceId
        }],
        proration_behavior: 'create_prorations'
      });
    }

    // Update subscription in database
    const updatedSubscription = await prisma.subscription.update({
      where: { organizationId },
      data: {
        planId,
        stripePriceId: newPlan.stripePriceId
      },
      include: {
        plan: true
      }
    });

    // Update organization limits
    await prisma.organization.update({
      where: { id: organizationId },
      data: {
        planId,
        userLimit: newPlan.userLimit,
        storageLimit: newPlan.storageLimit,
        apiLimit: newPlan.apiLimit
      }
    });

    // Log activity
    await prisma.activity.create({
      data: {
        organizationId,
        userId: session.user.id,
        action: 'subscription_updated',
        metadata: {
          oldPlan: currentSubscription.plan.name,
          newPlan: newPlan.name
        }
      }
    });

    res.status(200).json({ 
      subscription: updatedSubscription,
      message: 'Subscription updated successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: error.errors
      });
    }
    
    console.error('Error updating subscription:', error);
    res.status(500).json({ error: 'Failed to update subscription' });
  }
}

async function cancelSubscription(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const { organizationId } = req.query;

  if (!organizationId || typeof organizationId !== 'string') {
    return res.status(400).json({ error: 'Organization ID is required' });
  }

  try {
    // Check permissions
    const hasAccess = await hasPermission(session.user.id, organizationId, ['OWNER']);
    
    if (!hasAccess) {
      return res.status(403).json({ error: 'Only organization owners can cancel subscriptions' });
    }

    const subscription = await prisma.subscription.findUnique({
      where: { organizationId },
      include: { plan: true }
    });

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    // Cancel Stripe subscription at period end
    if (subscription.stripeSubscriptionId) {
      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: true
      });
    }

    // Update subscription in database
    const updatedSubscription = await prisma.subscription.update({
      where: { organizationId },
      data: {
        cancelAtPeriodEnd: true,
        canceledAt: new Date()
      },
      include: {
        plan: true
      }
    });

    // Log activity
    await prisma.activity.create({
      data: {
        organizationId,
        userId: session.user.id,
        action: 'subscription_cancelled',
        metadata: {
          planName: subscription.plan.name,
          cancelAtPeriodEnd: true
        }
      }
    });

    res.status(200).json({ 
      subscription: updatedSubscription,
      message: 'Subscription will be cancelled at the end of the current billing period'
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
}