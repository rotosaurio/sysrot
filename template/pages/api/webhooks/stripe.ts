import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

const prisma = new PrismaClient();

// Disable body parsing for webhook verification
export const config = {
  api: {
    bodyParser: false,
  },
};

async function sendOrderConfirmationEmail(order: any) {
  // TODO: Implement email sending logic using your preferred service
  // Examples: SendGrid, AWS SES, Nodemailer, etc.
  console.log(`📧 Sending order confirmation email for order ${order.orderNumber}`);
  
  // Example implementation using a hypothetical email service
  /*
  await emailService.send({
    to: order.user.email,
    template: 'order-confirmation',
    data: {
      orderNumber: order.orderNumber,
      customerName: order.user.name,
      items: order.items,
      total: order.total,
      shippingAddress: order.shippingAddress
    }
  });
  */
}

async function updateInventory(orderId: string) {
  try {
    // Get order items
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true }
    });

    if (!order) {
      console.error('Order not found for inventory update:', orderId);
      return;
    }

    // Update stock for each item
    for (const item of order.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      });

      console.log(`📦 Updated inventory for product ${item.productId}: -${item.quantity}`);
    }
  } catch (error) {
    console.error('Error updating inventory:', error);
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('💳 Payment succeeded:', paymentIntent.id);

    // Find the order by payment intent ID
    const order = await prisma.order.findFirst({
      where: { paymentId: paymentIntent.id },
      include: { 
        user: true,
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      console.error('Order not found for payment intent:', paymentIntent.id);
      return;
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: 'PAID',
        status: order.status === 'PENDING' ? 'CONFIRMED' : order.status,
        paidAt: new Date()
      },
      include: {
        user: true,
        items: {
          include: {
            product: true
          }
        }
      }
    });

    console.log(`✅ Order ${order.orderNumber} marked as paid`);

    // Update inventory
    await updateInventory(order.id);

    // Send confirmation email
    await sendOrderConfirmationEmail(updatedOrder);

    // Log analytics event
    console.log(`📊 Analytics: Order completed - ${order.orderNumber}, Amount: $${order.total}`);

  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

async function handlePaymentIntentPaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('❌ Payment failed:', paymentIntent.id);

    // Find the order by payment intent ID
    const order = await prisma.order.findFirst({
      where: { paymentId: paymentIntent.id }
    });

    if (!order) {
      console.error('Order not found for failed payment:', paymentIntent.id);
      return;
    }

    // Update order status
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: 'FAILED',
        status: 'CANCELLED'
      }
    });

    console.log(`❌ Order ${order.orderNumber} marked as failed`);

    // TODO: Send payment failure notification email
    // TODO: Log analytics event for failed payment

  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

async function handleChargeDispute(charge: Stripe.Charge) {
  try {
    console.log('⚠️ Charge dispute created:', charge.id);

    // Find the order by charge ID
    const paymentIntent = await stripe.paymentIntents.retrieve(charge.payment_intent as string);
    const order = await prisma.order.findFirst({
      where: { paymentId: paymentIntent.id }
    });

    if (!order) {
      console.error('Order not found for disputed charge:', charge.id);
      return;
    }

    // Update order status
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: 'DISPUTED',
        notes: `${order.notes || ''}\n\nDispute created on ${new Date().toISOString()}`
      }
    });

    console.log(`⚠️ Order ${order.orderNumber} marked as disputed`);

    // TODO: Send notification to admin about dispute
    // TODO: Log analytics event for dispute

  } catch (error) {
    console.error('Error handling charge dispute:', error);
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    console.log('💰 Invoice payment succeeded:', invoice.id);

    // Handle subscription payments or recurring billing
    if (invoice.subscription) {
      console.log(`📅 Subscription payment: ${invoice.subscription}`);
      
      // TODO: Update subscription status in database
      // TODO: Send subscription renewal confirmation
    }

  } catch (error) {
    console.error('Error handling invoice payment:', error);
  }
}

async function handleCustomerSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    console.log('📅 Subscription updated:', subscription.id);

    // TODO: Update subscription status in database
    // Handle subscription changes, cancellations, etc.

  } catch (error) {
    console.error('Error handling subscription update:', error);
  }
}

async function handleRefund(refund: Stripe.Refund) {
  try {
    console.log('💸 Refund processed:', refund.id);

    // Get the charge and payment intent
    const charge = await stripe.charges.retrieve(refund.charge as string);
    const paymentIntent = await stripe.paymentIntents.retrieve(charge.payment_intent as string);

    // Find the order
    const order = await prisma.order.findFirst({
      where: { paymentId: paymentIntent.id },
      include: { items: true }
    });

    if (!order) {
      console.error('Order not found for refund:', refund.id);
      return;
    }

    // Determine refund status
    const isFullRefund = refund.amount === order.total * 100; // Stripe uses cents
    const newPaymentStatus = isFullRefund ? 'REFUNDED' : 'PARTIALLY_REFUNDED';
    const newOrderStatus = isFullRefund ? 'REFUNDED' : order.status;

    // Update order
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: newPaymentStatus,
        status: newOrderStatus,
        refundedAt: new Date(),
        refundAmount: (order.refundAmount || 0) + (refund.amount / 100)
      }
    });

    console.log(`💸 Order ${order.orderNumber} refund processed: $${refund.amount / 100}`);

    // If full refund, restore inventory
    if (isFullRefund) {
      for (const item of order.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity
            }
          }
        });
      }
      console.log(`📦 Inventory restored for order ${order.orderNumber}`);
    }

    // TODO: Send refund confirmation email
    // TODO: Log analytics event

  } catch (error) {
    console.error('Error handling refund:', error);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const signature = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('Missing STRIPE_WEBHOOK_SECRET environment variable');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  let event: Stripe.Event;

  try {
    // Get raw body as buffer
    const rawBody = await buffer(req);
    
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  console.log(`🔔 Received webhook: ${event.type}`);

  try {
    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentPaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'charge.dispute.created':
        await handleChargeDispute(event.data.object as Stripe.Charge);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'customer.subscription.updated':
        await handleCustomerSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'charge.refunded':
        // Get the refund from the charge object
        const charge = event.data.object as Stripe.Charge;
        if (charge.refunds?.data?.[0]) {
          await handleRefund(charge.refunds.data[0]);
        }
        break;

      // Handle other important events
      case 'payment_method.attached':
        console.log('💳 Payment method attached');
        break;

      case 'customer.created':
        console.log('👤 Customer created');
        break;

      case 'checkout.session.completed':
        console.log('🛒 Checkout session completed');
        // TODO: Handle checkout session completion if using Stripe Checkout
        break;

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    // Respond with success
    res.status(200).json({ received: true, type: event.type });

  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ 
      error: 'Webhook processing failed',
      type: event.type 
    });
  } finally {
    await prisma.$disconnect();
  }
}