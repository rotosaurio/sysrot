import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  comparePrice: z.number().positive().optional(),
  sku: z.string().optional(),
  weight: z.number().positive().optional(),
  dimensions: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  stock: z.number().int().min(0, 'Stock must be non-negative').default(0),
  lowStockAlert: z.number().int().min(0).default(5),
  status: z.enum(['ACTIVE', 'DRAFT', 'ARCHIVED']).default('ACTIVE'),
  featured: z.boolean().default(false),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  images: z.array(z.object({
    url: z.string().url(),
    alt: z.string().optional(),
    position: z.number().int().min(0).default(0)
  })).optional(),
  tags: z.array(z.string()).optional(),
  variants: z.array(z.object({
    name: z.string(),
    value: z.string(),
    price: z.number().optional(),
    sku: z.string().optional(),
    stock: z.number().int().min(0).default(0)
  })).optional()
});

const updateProductSchema = createProductSchema.partial();

async function isAdmin(req: NextApiRequest): Promise<boolean> {
  const session = await getSession({ req });
  return session?.user?.role === 'admin';
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
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { 
    page = '1', 
    limit = '10', 
    category, 
    search, 
    status, 
    featured,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;

  const where: any = {};

  if (category) {
    where.category = { slug: category };
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } }
    ];
  }

  if (status) {
    where.status = status;
  }

  if (featured !== undefined) {
    where.featured = featured === 'true';
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        images: {
          orderBy: { position: 'asc' }
        },
        tags: true,
        variants: true,
        _count: {
          select: {
            reviews: true,
            orderItems: true
          }
        }
      },
      orderBy: { [sortBy as string]: sortOrder },
      skip,
      take: limitNum
    }),
    prisma.product.count({ where })
  ]);

  // Calculate average rating for each product
  const productsWithRating = await Promise.all(
    products.map(async (product) => {
      const avgRating = await prisma.review.aggregate({
        where: { productId: product.id, status: 'APPROVED' },
        _avg: { rating: true }
      });

      return {
        ...product,
        avgRating: avgRating._avg.rating || 0,
        reviewCount: product._count.reviews
      };
    })
  );

  return res.status(200).json({
    products: productsWithRating,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    }
  });
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  if (!(await isAdmin(req))) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const validatedData = createProductSchema.parse(req.body);
  
  // Check if slug is unique
  const existingProduct = await prisma.product.findUnique({
    where: { slug: validatedData.slug }
  });

  if (existingProduct) {
    return res.status(400).json({ error: 'Product slug already exists' });
  }

  // Check if SKU is unique (if provided)
  if (validatedData.sku) {
    const existingSku = await prisma.product.findUnique({
      where: { sku: validatedData.sku }
    });

    if (existingSku) {
      return res.status(400).json({ error: 'SKU already exists' });
    }
  }

  const { images, tags, variants, ...productData } = validatedData;

  const product = await prisma.product.create({
    data: {
      ...productData,
      images: {
        create: images || []
      },
      tags: {
        connectOrCreate: tags?.map(tagName => ({
          where: { name: tagName },
          create: { 
            name: tagName, 
            slug: tagName.toLowerCase().replace(/\s+/g, '-') 
          }
        })) || []
      },
      variants: {
        create: variants || []
      }
    },
    include: {
      category: true,
      images: { orderBy: { position: 'asc' } },
      tags: true,
      variants: true
    }
  });

  return res.status(201).json(product);
}

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  if (!(await isAdmin(req))) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  const validatedData = updateProductSchema.parse(req.body);

  // Check if product exists
  const existingProduct = await prisma.product.findUnique({
    where: { id }
  });

  if (!existingProduct) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // Check slug uniqueness if being updated
  if (validatedData.slug && validatedData.slug !== existingProduct.slug) {
    const slugExists = await prisma.product.findUnique({
      where: { slug: validatedData.slug }
    });

    if (slugExists) {
      return res.status(400).json({ error: 'Product slug already exists' });
    }
  }

  // Check SKU uniqueness if being updated
  if (validatedData.sku && validatedData.sku !== existingProduct.sku) {
    const skuExists = await prisma.product.findUnique({
      where: { sku: validatedData.sku }
    });

    if (skuExists) {
      return res.status(400).json({ error: 'SKU already exists' });
    }
  }

  const { images, tags, variants, ...productData } = validatedData;

  // Update product with related data
  const product = await prisma.product.update({
    where: { id },
    data: {
      ...productData,
      ...(images && {
        images: {
          deleteMany: {},
          create: images
        }
      }),
      ...(tags && {
        tags: {
          set: [],
          connectOrCreate: tags.map(tagName => ({
            where: { name: tagName },
            create: { 
              name: tagName, 
              slug: tagName.toLowerCase().replace(/\s+/g, '-') 
            }
          }))
        }
      }),
      ...(variants && {
        variants: {
          deleteMany: {},
          create: variants
        }
      })
    },
    include: {
      category: true,
      images: { orderBy: { position: 'asc' } },
      tags: true,
      variants: true
    }
  });

  return res.status(200).json(product);
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  if (!(await isAdmin(req))) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  // Check if product exists
  const existingProduct = await prisma.product.findUnique({
    where: { id },
    include: { orderItems: true }
  });

  if (!existingProduct) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // Check if product has associated orders
  if (existingProduct.orderItems.length > 0) {
    return res.status(400).json({ 
      error: 'Cannot delete product with existing orders. Archive it instead.' 
    });
  }

  await prisma.product.delete({
    where: { id }
  });

  return res.status(200).json({ message: 'Product deleted successfully' });
}