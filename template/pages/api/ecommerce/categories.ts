import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';
import { z } from 'zod';

const prisma = new PrismaClient();

const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  image: z.string().url().optional(),
  parentId: z.string().optional()
});

const updateCategorySchema = createCategorySchema.partial();

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
  const { includeProducts, hierarchy } = req.query;

  if (hierarchy === 'true') {
    // Return hierarchical structure
    const categories = await prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: {
            children: true,
            _count: { select: { products: true } }
          }
        },
        _count: { select: { products: true } }
      },
      orderBy: { name: 'asc' }
    });

    return res.status(200).json(categories);
  }

  // Return flat list
  const categories = await prisma.category.findMany({
    include: {
      parent: true,
      _count: { select: { products: true } },
      ...(includeProducts === 'true' && {
        products: {
          include: {
            images: { take: 1, orderBy: { position: 'asc' } }
          }
        }
      })
    },
    orderBy: { name: 'asc' }
  });

  return res.status(200).json(categories);
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  if (!(await isAdmin(req))) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const validatedData = createCategorySchema.parse(req.body);
  
  // Check if slug is unique
  const existingCategory = await prisma.category.findUnique({
    where: { slug: validatedData.slug }
  });

  if (existingCategory) {
    return res.status(400).json({ error: 'Category slug already exists' });
  }

  // Validate parent category exists if parentId provided
  if (validatedData.parentId) {
    const parentCategory = await prisma.category.findUnique({
      where: { id: validatedData.parentId }
    });

    if (!parentCategory) {
      return res.status(400).json({ error: 'Parent category not found' });
    }
  }

  const category = await prisma.category.create({
    data: validatedData,
    include: {
      parent: true,
      children: true,
      _count: { select: { products: true } }
    }
  });

  return res.status(201).json(category);
}

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  if (!(await isAdmin(req))) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Category ID is required' });
  }

  const validatedData = updateCategorySchema.parse(req.body);

  // Check if category exists
  const existingCategory = await prisma.category.findUnique({
    where: { id }
  });

  if (!existingCategory) {
    return res.status(404).json({ error: 'Category not found' });
  }

  // Check slug uniqueness if being updated
  if (validatedData.slug && validatedData.slug !== existingCategory.slug) {
    const slugExists = await prisma.category.findUnique({
      where: { slug: validatedData.slug }
    });

    if (slugExists) {
      return res.status(400).json({ error: 'Category slug already exists' });
    }
  }

  // Prevent circular hierarchy
  if (validatedData.parentId) {
    if (validatedData.parentId === id) {
      return res.status(400).json({ error: 'Category cannot be its own parent' });
    }

    // Check if the new parent would create a circular reference
    let currentParent = await prisma.category.findUnique({
      where: { id: validatedData.parentId }
    });

    while (currentParent?.parentId) {
      if (currentParent.parentId === id) {
        return res.status(400).json({ error: 'Circular hierarchy detected' });
      }
      currentParent = await prisma.category.findUnique({
        where: { id: currentParent.parentId }
      });
    }
  }

  const category = await prisma.category.update({
    where: { id },
    data: validatedData,
    include: {
      parent: true,
      children: true,
      _count: { select: { products: true } }
    }
  });

  return res.status(200).json(category);
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  if (!(await isAdmin(req))) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Category ID is required' });
  }

  // Check if category exists and has products or children
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      products: true,
      children: true
    }
  });

  if (!category) {
    return res.status(404).json({ error: 'Category not found' });
  }

  if (category.products.length > 0) {
    return res.status(400).json({ 
      error: 'Cannot delete category with products. Move products to another category first.' 
    });
  }

  if (category.children.length > 0) {
    return res.status(400).json({ 
      error: 'Cannot delete category with subcategories. Delete or move subcategories first.' 
    });
  }

  await prisma.category.delete({
    where: { id }
  });

  return res.status(200).json({ message: 'Category deleted successfully' });
}