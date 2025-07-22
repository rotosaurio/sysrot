import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();

async function hasPermission(userId: string, organizationId: string, requiredRole: string[] = ['OWNER', 'ADMIN', 'MEMBER', 'VIEWER']) {
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
    const { organizationId, type } = query;

    if (!organizationId || typeof organizationId !== 'string') {
      return res.status(400).json({ error: 'Organization ID is required' });
    }

    // Check permissions
    const hasAccess = await hasPermission(session.user.id, organizationId);
    
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (method !== 'GET') {
      res.setHeader('Allow', ['GET']);
      return res.status(405).end('Method Not Allowed');
    }

    switch (type) {
      case 'overview':
        return await getOverviewMetrics(req, res);
      case 'usage':
        return await getUsageMetrics(req, res);
      case 'members':
        return await getMemberMetrics(req, res);
      case 'activities':
        return await getActivityMetrics(req, res);
      case 'billing':
        return await getBillingMetrics(req, res);
      default:
        return await getDashboardMetrics(req, res);
    }
  } catch (error) {
    console.error('Analytics API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}

async function getDashboardMetrics(req: NextApiRequest, res: NextApiResponse) {
  const { organizationId } = req.query;

  try {
    const now = new Date();
    const thisMonth = now.getMonth() + 1;
    const thisYear = now.getFullYear();
    const lastMonth = thisMonth === 1 ? 12 : thisMonth - 1;
    const lastMonthYear = thisMonth === 1 ? thisYear - 1 : thisYear;

    // Get organization with subscription and plan
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId as string },
      include: {
        plan: true,
        subscription: true,
        members: {
          select: {
            id: true,
            role: true,
            joinedAt: true,
            lastActiveAt: true
          }
        }
      }
    });

    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    // Get current and previous month usage
    const [currentUsage, previousUsage] = await Promise.all([
      prisma.usage.findUnique({
        where: {
          organizationId_month_year: {
            organizationId: organizationId as string,
            month: thisMonth,
            year: thisYear
          }
        }
      }),
      prisma.usage.findUnique({
        where: {
          organizationId_month_year: {
            organizationId: organizationId as string,
            month: lastMonth,
            year: lastMonthYear
          }
        }
      })
    ]);

    // Get recent activities
    const recentActivities = await prisma.activity.findMany({
      where: { organizationId: organizationId as string },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    // Calculate metrics
    const totalMembers = organization.members.length;
    const activeMembers = organization.members.filter(m => {
      if (!m.lastActiveAt) return false;
      const daysSinceActive = (now.getTime() - m.lastActiveAt.getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceActive <= 30; // Active in last 30 days
    }).length;

    const currentMonthUsers = currentUsage?.users || 0;
    const previousMonthUsers = previousUsage?.users || 0;
    const userGrowth = previousMonthUsers > 0 
      ? ((currentMonthUsers - previousMonthUsers) / previousMonthUsers) * 100 
      : 0;

    const currentApiUsage = currentUsage?.apiRequests || 0;
    const apiLimit = organization.apiLimit;
    const apiUsagePercentage = (currentApiUsage / apiLimit) * 100;

    const currentStorage = currentUsage?.storage || 0;
    const storageLimit = organization.storageLimit;
    const storageUsagePercentage = (currentStorage / storageLimit) * 100;

    // Plan utilization
    const planUtilization = {
      users: {
        current: totalMembers,
        limit: organization.userLimit,
        percentage: (totalMembers / organization.userLimit) * 100
      },
      storage: {
        current: currentStorage,
        limit: storageLimit,
        percentage: storageUsagePercentage
      },
      api: {
        current: currentApiUsage,
        limit: apiLimit,
        percentage: apiUsagePercentage
      }
    };

    // Trial status
    let trialStatus = null;
    if (organization.trialEndsAt && organization.trialEndsAt > now) {
      const daysLeft = Math.ceil((organization.trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      trialStatus = {
        isActive: true,
        daysLeft,
        endsAt: organization.trialEndsAt
      };
    }

    const metrics = {
      organization: {
        id: organization.id,
        name: organization.name,
        status: organization.status,
        plan: organization.plan,
        subscription: organization.subscription,
        trialStatus
      },
      overview: {
        totalMembers,
        activeMembers,
        userGrowth: Math.round(userGrowth * 100) / 100,
        planUtilization,
        healthScore: calculateHealthScore(planUtilization, activeMembers, totalMembers)
      },
      usage: {
        current: currentUsage,
        previous: previousUsage,
        growth: {
          users: userGrowth,
          apiRequests: previousUsage?.apiRequests 
            ? ((currentApiUsage - previousUsage.apiRequests) / previousUsage.apiRequests) * 100 
            : 0,
          storage: previousUsage?.storage 
            ? ((currentStorage - previousUsage.storage) / previousUsage.storage) * 100 
            : 0
        }
      },
      recentActivities: recentActivities.slice(0, 5) // Top 5 for dashboard
    };

    res.status(200).json({ metrics });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
  }
}

async function getOverviewMetrics(req: NextApiRequest, res: NextApiResponse) {
  const { organizationId } = req.query;

  try {
    // Get 12 months of usage data
    const usageData = await prisma.usage.findMany({
      where: { organizationId: organizationId as string },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
      take: 12
    });

    // Get member growth over time
    const memberGrowth = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "joinedAt") as month,
        COUNT(*) as new_members
      FROM "OrganizationMember" 
      WHERE "organizationId" = ${organizationId}
      GROUP BY DATE_TRUNC('month', "joinedAt")
      ORDER BY month DESC
      LIMIT 12
    `;

    // Activity trends
    const activityTrends = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('day', "createdAt") as day,
        COUNT(*) as activities
      FROM "Activity" 
      WHERE "organizationId" = ${organizationId}
        AND "createdAt" >= NOW() - INTERVAL '30 days'
      GROUP BY DATE_TRUNC('day', "createdAt")
      ORDER BY day DESC
    `;

    res.status(200).json({
      usageData: usageData.reverse(), // Oldest first for charts
      memberGrowth,
      activityTrends
    });
  } catch (error) {
    console.error('Error fetching overview metrics:', error);
    res.status(500).json({ error: 'Failed to fetch overview metrics' });
  }
}

async function getUsageMetrics(req: NextApiRequest, res: NextApiResponse) {
  const { organizationId, period = '12' } = req.query;

  try {
    const months = parseInt(period as string) || 12;
    
    const usageData = await prisma.usage.findMany({
      where: { organizationId: organizationId as string },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
      take: months
    });

    // Calculate usage trends
    const trends = usageData.reverse().map((usage, index, arr) => {
      const previous = index > 0 ? arr[index - 1] : null;
      return {
        ...usage,
        trends: previous ? {
          users: previous.users > 0 ? ((usage.users - previous.users) / previous.users) * 100 : 0,
          apiRequests: previous.apiRequests > 0 ? ((usage.apiRequests - previous.apiRequests) / previous.apiRequests) * 100 : 0,
          storage: previous.storage > 0 ? ((usage.storage - previous.storage) / previous.storage) * 100 : 0,
          bandwidth: previous.bandwidth > 0 ? ((usage.bandwidth - previous.bandwidth) / previous.bandwidth) * 100 : 0
        } : null
      };
    });

    res.status(200).json({ usageData: trends });
  } catch (error) {
    console.error('Error fetching usage metrics:', error);
    res.status(500).json({ error: 'Failed to fetch usage metrics' });
  }
}

async function getMemberMetrics(req: NextApiRequest, res: NextApiResponse) {
  const { organizationId } = req.query;

  try {
    const members = await prisma.organizationMember.findMany({
      where: { organizationId: organizationId as string },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true
          }
        }
      },
      orderBy: { joinedAt: 'desc' }
    });

    // Role distribution
    const roleDistribution = members.reduce((acc, member) => {
      acc[member.role] = (acc[member.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Activity levels
    const now = new Date();
    const activityLevels = {
      active: 0, // Last 7 days
      recent: 0, // Last 30 days
      inactive: 0 // 30+ days or never
    };

    members.forEach(member => {
      if (!member.lastActiveAt) {
        activityLevels.inactive++;
      } else {
        const daysSinceActive = (now.getTime() - member.lastActiveAt.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceActive <= 7) {
          activityLevels.active++;
        } else if (daysSinceActive <= 30) {
          activityLevels.recent++;
        } else {
          activityLevels.inactive++;
        }
      }
    });

    // Member growth by month
    const membersByMonth = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "joinedAt") as month,
        COUNT(*) as count
      FROM "OrganizationMember" 
      WHERE "organizationId" = ${organizationId}
      GROUP BY DATE_TRUNC('month', "joinedAt")
      ORDER BY month DESC
      LIMIT 12
    `;

    res.status(200).json({
      members,
      roleDistribution,
      activityLevels,
      membersByMonth,
      totalMembers: members.length
    });
  } catch (error) {
    console.error('Error fetching member metrics:', error);
    res.status(500).json({ error: 'Failed to fetch member metrics' });
  }
}

async function getActivityMetrics(req: NextApiRequest, res: NextApiResponse) {
  const { organizationId, days = '30' } = req.query;

  try {
    const daysBack = parseInt(days as string) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    const activities = await prisma.activity.findMany({
      where: {
        organizationId: organizationId as string,
        createdAt: { gte: startDate }
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Activity types distribution
    const actionDistribution = activities.reduce((acc, activity) => {
      acc[activity.action] = (acc[activity.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Daily activity
    const dailyActivity = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('day', "createdAt") as day,
        COUNT(*) as count
      FROM "Activity" 
      WHERE "organizationId" = ${organizationId}
        AND "createdAt" >= ${startDate}
      GROUP BY DATE_TRUNC('day', "createdAt")
      ORDER BY day DESC
    `;

    // Most active users
    const userActivity = await prisma.$queryRaw`
      SELECT 
        u.name,
        u.email,
        u.image,
        COUNT(a.id) as activity_count
      FROM "Activity" a
      JOIN "User" u ON a."userId" = u.id
      WHERE a."organizationId" = ${organizationId}
        AND a."createdAt" >= ${startDate}
      GROUP BY u.id, u.name, u.email, u.image
      ORDER BY activity_count DESC
      LIMIT 10
    `;

    res.status(200).json({
      activities: activities.slice(0, 50), // Recent 50 activities
      actionDistribution,
      dailyActivity,
      userActivity,
      totalActivities: activities.length
    });
  } catch (error) {
    console.error('Error fetching activity metrics:', error);
    res.status(500).json({ error: 'Failed to fetch activity metrics' });
  }
}

async function getBillingMetrics(req: NextApiRequest, res: NextApiResponse) {
  const { organizationId } = req.query;

  try {
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId as string },
      include: {
        plan: true,
        subscription: true
      }
    });

    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    // Calculate MRR (Monthly Recurring Revenue)
    const mrr = organization.plan?.price || 0;

    // Usage costs (if any overages)
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    
    const currentUsage = await prisma.usage.findUnique({
      where: {
        organizationId_month_year: {
          organizationId: organizationId as string,
          month: currentMonth,
          year: currentYear
        }
      }
    });

    // Calculate overages
    const overages = {
      users: Math.max(0, (currentUsage?.users || 0) - organization.userLimit),
      storage: Math.max(0, (currentUsage?.storage || 0) - organization.storageLimit),
      api: Math.max(0, (currentUsage?.apiRequests || 0) - organization.apiLimit)
    };

    // Subscription status
    let subscriptionStatus = 'unknown';
    let nextBillingDate = null;
    
    if (organization.subscription) {
      subscriptionStatus = organization.subscription.status.toLowerCase();
      nextBillingDate = organization.subscription.currentPeriodEnd;
    }

    const billingMetrics = {
      plan: organization.plan,
      subscription: organization.subscription,
      mrr,
      overages,
      subscriptionStatus,
      nextBillingDate,
      trialEndsAt: organization.trialEndsAt,
      isTrialing: organization.trialEndsAt && organization.trialEndsAt > new Date()
    };

    res.status(200).json({ billingMetrics });
  } catch (error) {
    console.error('Error fetching billing metrics:', error);
    res.status(500).json({ error: 'Failed to fetch billing metrics' });
  }
}

// Helper function to calculate organization health score
function calculateHealthScore(planUtilization: any, activeMembers: number, totalMembers: number): number {
  let score = 100;

  // Deduct points for high utilization (risk of hitting limits)
  if (planUtilization.users.percentage > 90) score -= 20;
  else if (planUtilization.users.percentage > 75) score -= 10;

  if (planUtilization.storage.percentage > 90) score -= 15;
  else if (planUtilization.storage.percentage > 75) score -= 8;

  if (planUtilization.api.percentage > 90) score -= 15;
  else if (planUtilization.api.percentage > 75) score -= 8;

  // Deduct points for low member activity
  const activityRate = totalMembers > 0 ? (activeMembers / totalMembers) * 100 : 0;
  if (activityRate < 30) score -= 25;
  else if (activityRate < 60) score -= 15;
  else if (activityRate < 80) score -= 5;

  return Math.max(0, Math.min(100, score));
}