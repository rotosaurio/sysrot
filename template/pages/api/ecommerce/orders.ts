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
const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
    variantId: z.string().optional()
  })).min(1, 'At least one item is required'),
  shippingAddress: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    company: z.string().optional(),
    address1: z.string().min(1),
    address2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().min(1),
    phone: z.string().optional()
  }),
  billingAddress: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    company: z.string().optional(),
    address1: z.string().min(1),
    address2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().min(1),
    phone: z.string().optional()
  }).optional(),
  couponCode: z.string().optional(),
  notes: z.string().optional()
});

const updateOrderSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']).optional(),
  paymentStatus: z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED']).optional(),
  trackingNumber: z.string().optional(),
  notes: z.string().optional()
});

async function isAdmin(req: NextApiRequest): Promise<boolean> {
  const session = await getSession({ req });
  return session?.user?.role === 'admin';
}

async function isOrderOwner(req: NextApiRequest, orderId: string): Promise<boolean> {
  const session = await getSession({ req });
  if (!session?.user?.id) return false;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { userId: true }
  });

  return order?.userId === session.user.id;
}

function generateOrderNumber(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp.slice(-6)}-${random}`;
}

async function calculateOrderTotals(items: any[], couponCode?: string) {
  let subtotal = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
      include: { variants: true }
    });

    if (!product) {
      throw new Error(`Product not found: ${item.productId}`);
    }

    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for product: ${product.name}`);
    }

    let price = product.price;
    
    // Add variant price if applicable
    if (item.variantId) {
      const variant = product.variants.find(v => v.id === item.variantId);
      if (variant && variant.price) {
        price += variant.price;
      }
    }

    const total = price * item.quantity;
    subtotal += total;

    orderItems.push({
      productId: item.productId,
      quantity: item.quantity,
      price,
      total,
      variantId: item.variantId
    });
  }

  let discount = 0;
  let coupon = null;

  // Apply coupon if provided
  if (couponCode) {
    coupon = await prisma.coupon.findUnique({
      where: { code: couponCode, status: 'ACTIVE' }
    });

    if (coupon) {
      const now = new Date();
      if (now >= coupon.startDate && now <= coupon.endDate) {
        if (!coupon.usageLimit || coupon.usageCount < coupon.usageLimit) {
          if (!coupon.minAmount || subtotal >= coupon.minAmount) {
            if (coupon.type === 'PERCENTAGE') {
              discount = Math.min(
                subtotal * (coupon.value / 100),
                coupon.maxAmount || Infinity
              );
            } else {
              discount = Math.min(coupon.value, subtotal);
            }
          }
        }
      }
    }
  }

  const tax = subtotal * 0.1; // 10% tax rate
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const total = subtotal + tax + shipping - discount;

  return {
    orderItems,
    subtotal,
    tax,
    shipping,
    discount,
    total,
    coupon
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        return await handleGet(req, res);
      case 'POST':
        return await handlePost(req, res);
      case 'PUT':
        return await handlePut(req, res);
      case 'DELETE':
        return await handleDelete(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  } finally {
    await prisma.$disconnect();
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  
  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const { 
    page = '1', 
    limit = '10', 
    status, 
    paymentStatus,
    userId,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;

  const isAdminUser = await isAdmin(req);
  const where: any = {};

  // Regular users can only see their own orders
  if (!isAdminUser) {
    where.userId = session.user.id;
  } else if (userId) {
    where.userId = userId;
  }

  if (status) {
    where.status = status;
  }

  if (paymentStatus) {
    where.paymentStatus = paymentStatus;
  }

  if (search) {
    where.OR = [
      { orderNumber: { contains: search, mode: 'insensitive' } },
      { user: { name: { contains: search, mode: 'insensitive' } } },
      { user: { email: { contains: search, mode: 'insensitive' } } }
    ];
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true }
        },
        items: {
          include: {
            product: {
              select: { 
                id: true, 
                name: true, 
                images: { 
                  select: { url: true, alt: true },
                  orderBy: { position: 'asc' },
                  take: 1
                }
              }
            }
          }
        }
      },
      orderBy: { [sortBy as string]: sortOrder },
      skip,
      take: limitNum
    }),
    prisma.order.count({ where })
  ]);

  return res.status(200).json({
    orders,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    }
  });
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  
  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const validatedData = createOrderSchema.parse(req.body);
  
  try {
    // Calculate order totals
    const {
      orderItems,
      subtotal,
      tax,
      shipping,
      discount,
      total,
      coupon
    } = await calculateOrderTotals(validatedData.items, validatedData.couponCode);

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        userId: session.user.id,
        orderItems: JSON.stringify(validatedData.items)
      }
    });

    // Create order in database
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: session.user.id,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        paymentId: paymentIntent.id,
        subtotal,
        tax,
        shipping,
        discount,
        total,
        shippingAddress: validatedData.shippingAddress,
        billingAddress: validatedData.billingAddress || validatedData.shippingAddress,
        couponCode: validatedData.couponCode,
        notes: validatedData.notes,
        items: {
          create: orderItems
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    // Update coupon usage if applied
    if (coupon) {
      await prisma.coupon.update({
        where: { id: coupon.id },
        data: { usageCount: { increment: 1 } }
      });
    }

    // Update product stock
    for (const item of orderItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } }
      });
    }

    return res.status(201).json({
      order,
      paymentIntent: {
        id: paymentIntent.id,
        client_secret: paymentIntent.client_secret
      }
    });

  } catch (error) {
    console.error('Order creation error:', error);
    return res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Failed to create order' 
    });
  }
}

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Order ID is required' });
  }

  const session = await getSession({ req });
  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const isAdminUser = await isAdmin(req);
  const isOwner = await isOrderOwner(req, id);

  if (!isAdminUser && !isOwner) {
    return res.status(403).json({ error: 'Access denied' });
  }

  const validatedData = updateOrderSchema.parse(req.body);

  // Regular users can only cancel their pending orders
  if (!isAdminUser) {
    const order = await prisma.order.findUnique({
      where: { id },
      select: { status: true, paymentStatus: true }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Only allow cancellation of pending orders
    if (validatedData.status && validatedData.status !== 'CANCELLED') {
      return res.status(403).json({ error: 'You can only cancel pending orders' });
    }

    if (order.status !== 'PENDING') {
      return res.status(400).json({ error: 'Only pending orders can be cancelled' });
    }
  }

  const updateData: any = { ...validatedData };

  // Set timestamps based on status changes
  if (validatedData.status === 'SHIPPED' && !updateData.shippedAt) {
    updateData.shippedAt = new Date();
  }

  if (validatedData.status === 'DELIVERED' && !updateData.deliveredAt) {
    updateData.deliveredAt = new Date();
  }

  const order = await prisma.order.update({
    where: { id },
    data: updateData,
    include: {
      user: {
        select: { id: true, name: true, email: true }
      },
      items: {
        include: {
          product: true
        }
      }
    }
  });

  return res.status(200).json(order);
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  if (!(await isAdmin(req))) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Order ID is required' });
  }

  const order = await prisma.order.findUnique({
    where: { id },
    select: { status: true, paymentStatus: true }
  });

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  // Only allow deletion of cancelled or refunded orders
  if (!['CANCELLED', 'REFUNDED'].includes(order.status)) {
    return res.status(400).json({ 
      error: 'Only cancelled or refunded orders can be deleted' 
    });
  }

  await prisma.order.delete({
    where: { id }
  });

  return res.status(200).json({ message: 'Order deleted successfully' });
}