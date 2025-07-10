import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();

async function isAdmin(req: NextApiRequest): Promise<boolean> {
  const session = await getSession({ req });
  return session?.user?.role === 'admin';
}

interface AnalyticsData {
  totalRevenue: number;
  revenueChange: number;
  totalOrders: number;
  ordersChange: number;
  totalCustomers: number;
  customersChange: number;
  averageOrderValue: number;
  aovChange: number;
  salesByMonth: Array<{ month: string; sales: number; previousYear: number }>;
  salesByCategory: Array<{ name: string; value: number; percentage: number }>;
  ordersByStatus: Array<{ status: string; count: number; percentage: number }>;
  topProducts: Array<{ 
    id: string; 
    name: string; 
    sales: number; 
    revenue: number; 
    image?: string;
  }>;
  lowStockProducts: Array<{
    id: string;
    name: string;
    stock: number;
    lowStockAlert: number;
  }>;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customer: { name: string; email: string };
    total: number;
    status: string;
    paymentStatus: string;
    createdAt: string;
  }>;
}

function getDateRange(period: string) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  
  switch (period) {
    case 'thisMonth':
      return {
        start: new Date(currentYear, currentMonth, 1),
        end: new Date(currentYear, currentMonth + 1, 0)
      };
    case 'lastMonth':
      return {
        start: new Date(currentYear, currentMonth - 1, 1),
        end: new Date(currentYear, currentMonth, 0)
      };
    case 'thisYear':
      return {
        start: new Date(currentYear, 0, 1),
        end: new Date(currentYear + 1, 0, 0)
      };
    case 'lastYear':
      return {
        start: new Date(currentYear - 1, 0, 1),
        end: new Date(currentYear, 0, 0)
      };
    default:
      return {
        start: new Date(currentYear, currentMonth, 1),
        end: new Date(currentYear, currentMonth + 1, 0)
      };
  }
}

async function calculateRevenueMetrics() {
  const thisMonth = getDateRange('thisMonth');
  const lastMonth = getDateRange('lastMonth');

  const [thisMonthRevenue, lastMonthRevenue] = await Promise.all([
    prisma.order.aggregate({
      where: {
        createdAt: { gte: thisMonth.start, lte: thisMonth.end },
        paymentStatus: 'PAID'
      },
      _sum: { total: true },
      _count: true
    }),
    prisma.order.aggregate({
      where: {
        createdAt: { gte: lastMonth.start, lte: lastMonth.end },
        paymentStatus: 'PAID'
      },
      _sum: { total: true },
      _count: true
    })
  ]);

  const totalRevenue = thisMonthRevenue._sum.total || 0;
  const lastMonthTotal = lastMonthRevenue._sum.total || 0;
  const revenueChange = lastMonthTotal > 0 
    ? ((totalRevenue - lastMonthTotal) / lastMonthTotal) * 100 
    : 0;

  const totalOrders = thisMonthRevenue._count;
  const lastMonthOrders = lastMonthRevenue._count;
  const ordersChange = lastMonthOrders > 0 
    ? ((totalOrders - lastMonthOrders) / lastMonthOrders) * 100 
    : 0;

  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const lastMonthAOV = lastMonthOrders > 0 ? lastMonthTotal / lastMonthOrders : 0;
  const aovChange = lastMonthAOV > 0 
    ? ((averageOrderValue - lastMonthAOV) / lastMonthAOV) * 100 
    : 0;

  return {
    totalRevenue,
    revenueChange,
    totalOrders,
    ordersChange,
    averageOrderValue,
    aovChange
  };
}

async function calculateCustomerMetrics() {
  const thisMonth = getDateRange('thisMonth');
  const lastMonth = getDateRange('lastMonth');

  const [thisMonthCustomers, lastMonthCustomers] = await Promise.all([
    prisma.user.count({
      where: {
        createdAt: { gte: thisMonth.start, lte: thisMonth.end },
        role: 'user'
      }
    }),
    prisma.user.count({
      where: {
        createdAt: { gte: lastMonth.start, lte: lastMonth.end },
        role: 'user'
      }
    })
  ]);

  const customersChange = lastMonthCustomers > 0 
    ? ((thisMonthCustomers - lastMonthCustomers) / lastMonthCustomers) * 100 
    : 0;

  const totalCustomers = await prisma.user.count({
    where: { role: 'user' }
  });

  return {
    totalCustomers,
    customersChange
  };
}

async function getSalesByMonth() {
  const currentYear = new Date().getFullYear();
  const salesData = [];

  for (let month = 0; month < 12; month++) {
    const start = new Date(currentYear, month, 1);
    const end = new Date(currentYear, month + 1, 0);
    
    const [currentYearSales, previousYearSales] = await Promise.all([
      prisma.order.aggregate({
        where: {
          createdAt: { gte: start, lte: end },
          paymentStatus: 'PAID'
        },
        _sum: { total: true }
      }),
      prisma.order.aggregate({
        where: {
          createdAt: { 
            gte: new Date(currentYear - 1, month, 1), 
            lte: new Date(currentYear - 1, month + 1, 0) 
          },
          paymentStatus: 'PAID'
        },
        _sum: { total: true }
      })
    ]);

    salesData.push({
      month: new Date(currentYear, month).toLocaleDateString('es', { month: 'short' }),
      sales: currentYearSales._sum.total || 0,
      previousYear: previousYearSales._sum.total || 0
    });
  }

  return salesData;
}

async function getSalesByCategory() {
  const categoryData = await prisma.category.findMany({
    include: {
      products: {
        include: {
          orderItems: {
            include: {
              order: {
                where: { paymentStatus: 'PAID' }
              }
            }
          }
        }
      }
    }
  });

  let totalSales = 0;
  const categoryStats = categoryData.map(category => {
    const sales = category.products.reduce((sum, product) => {
      return sum + product.orderItems.reduce((itemSum, orderItem) => {
        return itemSum + (orderItem.order ? orderItem.total : 0);
      }, 0);
    }, 0);
    
    totalSales += sales;
    return { name: category.name, value: sales };
  }).filter(cat => cat.value > 0);

  return categoryStats.map(cat => ({
    ...cat,
    percentage: totalSales > 0 ? (cat.value / totalSales) * 100 : 0
  }));
}

async function getOrdersByStatus() {
  const statusCounts = await prisma.order.groupBy({
    by: ['status'],
    _count: { status: true }
  });

  const totalOrders = statusCounts.reduce((sum, item) => sum + item._count.status, 0);

  return statusCounts.map(item => ({
    status: item.status,
    count: item._count.status,
    percentage: totalOrders > 0 ? (item._count.status / totalOrders) * 100 : 0
  }));
}

async function getTopProducts() {
  const productStats = await prisma.product.findMany({
    include: {
      orderItems: {
        include: {
          order: {
            where: { paymentStatus: 'PAID' }
          }
        }
      },
      images: {
        take: 1,
        orderBy: { position: 'asc' }
      }
    }
  });

  const topProducts = productStats
    .map(product => {
      const sales = product.orderItems.reduce((sum, item) => {
        return sum + (item.order ? item.quantity : 0);
      }, 0);
      
      const revenue = product.orderItems.reduce((sum, item) => {
        return sum + (item.order ? item.total : 0);
      }, 0);

      return {
        id: product.id,
        name: product.name,
        sales,
        revenue,
        image: product.images[0]?.url
      };
    })
    .filter(product => product.sales > 0)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return topProducts;
}

async function getLowStockProducts() {
  const lowStockProducts = await prisma.product.findMany({
    where: {
      stock: { lte: prisma.product.fields.lowStockAlert }
    },
    select: {
      id: true,
      name: true,
      stock: true,
      lowStockAlert: true
    },
    orderBy: { stock: 'asc' }
  });

  return lowStockProducts;
}

async function getRecentOrders() {
  const recentOrders = await prisma.order.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { name: true, email: true }
      }
    }
  });

  return recentOrders.map(order => ({
    id: order.id,
    orderNumber: order.orderNumber,
    customer: {
      name: order.user.name || 'Usuario',
      email: order.user.email
    },
    total: order.total,
    status: order.status,
    paymentStatus: order.paymentStatus,
    createdAt: order.createdAt.toISOString()
  }));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!(await isAdmin(req))) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Run all analytics queries in parallel
    const [
      revenueMetrics,
      customerMetrics,
      salesByMonth,
      salesByCategory,
      ordersByStatus,
      topProducts,
      lowStockProducts,
      recentOrders
    ] = await Promise.all([
      calculateRevenueMetrics(),
      calculateCustomerMetrics(),
      getSalesByMonth(),
      getSalesByCategory(),
      getOrdersByStatus(),
      getTopProducts(),
      getLowStockProducts(),
      getRecentOrders()
    ]);

    const analyticsData: AnalyticsData = {
      ...revenueMetrics,
      ...customerMetrics,
      salesByMonth,
      salesByCategory,
      ordersByStatus,
      topProducts,
      lowStockProducts,
      recentOrders
    };

    return res.status(200).json(analyticsData);

  } catch (error) {
    console.error('Analytics API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    await prisma.$disconnect();
  }
}