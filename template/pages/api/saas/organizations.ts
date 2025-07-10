import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const createOrganizationSchema = z.object({
  name: z.string().min(1, 'Organization name is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().optional(),
  domain: z.string().optional(),
  planId: z.string().optional()
});

const updateOrganizationSchema = createOrganizationSchema.partial();

const inviteMemberSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['ADMIN', 'MEMBER', 'VIEWER']).default('MEMBER')
});

async function getUserMembership(userId: string, organizationId: string) {
  return await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId,
        userId
      }
    },
    include: {
      organization: true,
      user: true
    }
  });
}

async function hasPermission(userId: string, organizationId: string, requiredRole: string[] = ['OWNER', 'ADMIN']) {
  const membership = await getUserMembership(userId, organizationId);
  return membership && requiredRole.includes(membership.role);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession({ req });
    
    if (!session?.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { method, query } = req;
    const { id } = query;

    switch (method) {
      case 'GET':
        if (id) {
          return await getOrganization(req, res);
        } else {
          return await getUserOrganizations(req, res);
        }

      case 'POST':
        return await createOrganization(req, res);

      case 'PUT':
        return await updateOrganization(req, res);

      case 'DELETE':
        return await deleteOrganization(req, res);

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end('Method Not Allowed');
    }
  } catch (error) {
    console.error('Organizations API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}

async function getUserOrganizations(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  
  try {
    const memberships = await prisma.organizationMember.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        organization: {
          include: {
            plan: true,
            subscription: true,
            _count: {
              select: {
                members: true,
                activities: true
              }
            }
          }
        }
      },
      orderBy: {
        joinedAt: 'desc'
      }
    });

    const organizations = memberships.map(membership => ({
      ...membership.organization,
      role: membership.role,
      joinedAt: membership.joinedAt,
      memberCount: membership.organization._count.members,
      activityCount: membership.organization._count.activities
    }));

    res.status(200).json({ organizations });
  } catch (error) {
    console.error('Error fetching user organizations:', error);
    res.status(500).json({ error: 'Failed to fetch organizations' });
  }
}

async function getOrganization(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Organization ID is required' });
  }

  try {
    // Check if user has access to this organization
    const membership = await getUserMembership(session.user.id, id);
    
    if (!membership) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const organization = await prisma.organization.findUnique({
      where: { id },
      include: {
        plan: true,
        subscription: true,
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true
              }
            }
          },
          orderBy: {
            joinedAt: 'desc'
          }
        },
        invitations: {
          where: {
            status: 'PENDING'
          },
          include: {
            inviter: {
              select: {
                name: true,
                email: true
              }
            }
          }
        },
        usage: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 12 // Last 12 months
        },
        activities: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 50
        },
        _count: {
          select: {
            members: true,
            invitations: true,
            activities: true
          }
        }
      }
    });

    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    // Add user's role to response
    const response = {
      ...organization,
      userRole: membership.role,
      userPermissions: membership.permissions
    };

    res.status(200).json({ organization: response });
  } catch (error) {
    console.error('Error fetching organization:', error);
    res.status(500).json({ error: 'Failed to fetch organization' });
  }
}

async function createOrganization(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  try {
    const validatedData = createOrganizationSchema.parse(req.body);

    // Check if slug is already taken
    const existingOrg = await prisma.organization.findUnique({
      where: { slug: validatedData.slug }
    });

    if (existingOrg) {
      return res.status(400).json({ error: 'Slug is already taken' });
    }

    // Get default plan (free tier)
    const defaultPlan = await prisma.plan.findFirst({
      where: { slug: 'starter' },
      orderBy: { price: 'asc' }
    });

    // Create organization
    const organization = await prisma.organization.create({
      data: {
        ...validatedData,
        planId: validatedData.planId || defaultPlan?.id,
        status: 'ACTIVE',
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days trial
      }
    });

    // Add creator as owner
    await prisma.organizationMember.create({
      data: {
        organizationId: organization.id,
        userId: session.user.id,
        role: 'OWNER',
        permissions: ['*'] // Full permissions
      }
    });

    // Create initial usage record
    const now = new Date();
    await prisma.usage.create({
      data: {
        organizationId: organization.id,
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        users: 1
      }
    });

    // Log activity
    await prisma.activity.create({
      data: {
        organizationId: organization.id,
        userId: session.user.id,
        action: 'organization_created',
        metadata: {
          organizationName: organization.name
        }
      }
    });

    res.status(201).json({ 
      organization,
      message: 'Organization created successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: error.errors
      });
    }
    
    console.error('Error creating organization:', error);
    res.status(500).json({ error: 'Failed to create organization' });
  }
}

async function updateOrganization(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Organization ID is required' });
  }

  try {
    // Check permissions
    const hasAccess = await hasPermission(session.user.id, id, ['OWNER', 'ADMIN']);
    
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const validatedData = updateOrganizationSchema.parse(req.body);

    // If updating slug, check if it's available
    if (validatedData.slug) {
      const existingOrg = await prisma.organization.findFirst({
        where: {
          slug: validatedData.slug,
          NOT: { id }
        }
      });

      if (existingOrg) {
        return res.status(400).json({ error: 'Slug is already taken' });
      }
    }

    const organization = await prisma.organization.update({
      where: { id },
      data: validatedData,
      include: {
        plan: true,
        subscription: true,
        _count: {
          select: {
            members: true
          }
        }
      }
    });

    // Log activity
    await prisma.activity.create({
      data: {
        organizationId: id,
        userId: session.user.id,
        action: 'organization_updated',
        metadata: {
          changes: validatedData
        }
      }
    });

    res.status(200).json({ 
      organization,
      message: 'Organization updated successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: error.errors
      });
    }
    
    console.error('Error updating organization:', error);
    res.status(500).json({ error: 'Failed to update organization' });
  }
}

async function deleteOrganization(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Organization ID is required' });
  }

  try {
    // Check if user is owner
    const hasAccess = await hasPermission(session.user.id, id, ['OWNER']);
    
    if (!hasAccess) {
      return res.status(403).json({ error: 'Only organization owners can delete organizations' });
    }

    // Check if organization has active subscription
    const organization = await prisma.organization.findUnique({
      where: { id },
      include: {
        subscription: true
      }
    });

    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    if (organization.subscription?.status === 'ACTIVE') {
      return res.status(400).json({ 
        error: 'Cannot delete organization with active subscription. Please cancel subscription first.' 
      });
    }

    // Soft delete - mark as cancelled
    await prisma.organization.update({
      where: { id },
      data: {
        status: 'CANCELLED'
      }
    });

    // Log activity
    await prisma.activity.create({
      data: {
        organizationId: id,
        userId: session.user.id,
        action: 'organization_deleted',
        metadata: {
          organizationName: organization.name
        }
      }
    });

    res.status(200).json({ 
      message: 'Organization deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting organization:', error);
    res.status(500).json({ error: 'Failed to delete organization' });
  }
}