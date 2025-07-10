import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const createChannelSchema = z.object({
  name: z.string().min(1, 'Channel name is required').max(100, 'Name too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  handle: z.string().min(3, 'Handle too short').max(30, 'Handle too long').regex(/^[a-zA-Z0-9_-]+$/, 'Handle can only contain letters, numbers, hyphens, and underscores'),
  avatar: z.string().url().optional(),
  banner: z.string().url().optional(),
  category: z.enum(['GENERAL', 'GAMING', 'MUSIC', 'SPORTS', 'ENTERTAINMENT', 'NEWS', 'EDUCATION', 'SCIENCE_TECH', 'TRAVEL', 'LIFESTYLE', 'COOKING', 'FITNESS', 'BUSINESS', 'COMEDY', 'DOCUMENTARY', 'KIDS', 'LIVE']).default('GENERAL'),
  socialLinks: z.record(z.string().url()).optional()
});

const updateChannelSchema = createChannelSchema.partial();

const subscribeSchema = z.object({
  channelId: z.string(),
  enableNotifications: z.boolean().default(true)
});

async function hasChannelPermission(userId: string, channelId: string, action: string = 'read') {
  const channel = await prisma.videoChannel.findUnique({
    where: { id: channelId },
    include: {
      collaborators: {
        where: { userId, isActive: true }
      }
    }
  });

  if (!channel) return false;

  // Channel owner has all permissions
  if (channel.ownerId === userId) return true;

  // Check collaborator permissions
  const collaborator = channel.collaborators[0];
  if (!collaborator) return false;

  switch (action) {
    case 'read':
      return true;
    case 'update':
      return ['ADMIN', 'MODERATOR', 'EDITOR'].includes(collaborator.role);
    case 'delete':
      return ['ADMIN'].includes(collaborator.role);
    case 'upload':
      return ['ADMIN', 'MODERATOR', 'EDITOR'].includes(collaborator.role);
    case 'moderate':
      return ['ADMIN', 'MODERATOR'].includes(collaborator.role);
    default:
      return false;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession({ req });
    
    if (!session?.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { method } = req;

    switch (method) {
      case 'GET':
        return await getChannels(req, res);

      case 'POST':
        const { action } = req.query;
        if (action === 'subscribe') {
          return await subscribeToChannel(req, res);
        }
        return await createChannel(req, res);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end('Method Not Allowed');
    }
  } catch (error) {
    console.error('Channels API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}

async function getChannels(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const { 
    category,
    search,
    sortBy = 'subscriberCount',
    sortOrder = 'desc',
    limit = '20',
    page = '1',
    featured = 'false',
    verified = 'false'
  } = req.query;

  try {
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    // Build where clause
    const whereClause: any = {};

    if (category && category !== 'ALL') {
      whereClause.category = category;
    }

    if (verified === 'true') {
      whereClause.isVerified = true;
    }

    if (search && typeof search === 'string') {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { handle: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get channels with comprehensive data
    const channels = await prisma.videoChannel.findMany({
      where: whereClause,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        _count: {
          select: {
            videos: true,
            subscribers: true,
            playlists: true
          }
        }
      },
      orderBy: {
        [sortBy as string]: sortOrder
      },
      skip: offset,
      take: limitNum
    });

    // Enrich channels with user subscription status
    const enrichedChannels = await Promise.all(
      channels.map(async (channel) => {
        // Check if current user is subscribed
        const subscription = await prisma.channelSubscription.findUnique({
          where: {
            channelId_userId: {
              channelId: channel.id,
              userId: session.user.id
            }
          }
        });

        // Get recent video count (last 30 days)
        const recentVideoCount = await prisma.video.count({
          where: {
            channelId: channel.id,
            publishedAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            },
            status: 'READY',
            visibility: 'PUBLIC'
          }
        });

        return {
          ...channel,
          isSubscribed: !!subscription,
          recentVideoCount,
          stats: {
            totalSubscribers: channel._count.subscribers,
            totalVideos: channel._count.videos,
            totalPlaylists: channel._count.playlists,
            recentVideos: recentVideoCount
          }
        };
      })
    );

    // Get total count for pagination
    const total = await prisma.videoChannel.count({
      where: whereClause
    });

    res.status(200).json({
      channels: enrichedChannels,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching channels:', error);
    res.status(500).json({ error: 'Failed to fetch channels' });
  }
}

async function createChannel(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  try {
    const validatedData = createChannelSchema.parse(req.body);

    // Check if handle is unique
    const existingChannel = await prisma.videoChannel.findUnique({
      where: { handle: validatedData.handle }
    });

    if (existingChannel) {
      return res.status(400).json({ error: 'Handle already exists' });
    }

    // Check user channel limits (max 3 channels per user for non-verified users)
    const userChannelCount = await prisma.videoChannel.count({
      where: { ownerId: session.user.id }
    });

    if (userChannelCount >= 3) {
      return res.status(400).json({ 
        error: 'Maximum channel limit reached (3 channels)' 
      });
    }

    // Create the channel
    const channel = await prisma.videoChannel.create({
      data: {
        ...validatedData,
        ownerId: session.user.id,
        socialLinks: validatedData.socialLinks ? JSON.stringify(validatedData.socialLinks) : undefined
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    });

    // Auto-subscribe owner to their own channel
    await prisma.channelSubscription.create({
      data: {
        channelId: channel.id,
        userId: session.user.id,
        isNotificationsEnabled: true
      }
    });

    // Create initial analytics entry
    await prisma.channelAnalytics.create({
      data: {
        channelId: channel.id,
        date: new Date(),
        subscriberCount: 1, // Owner subscription
        totalViews: 0,
        totalWatchTime: 0,
        videoPublished: 0
      }
    });

    res.status(201).json({
      channel,
      message: 'Channel created successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    }

    console.error('Error creating channel:', error);
    res.status(500).json({ error: 'Failed to create channel' });
  }
}

async function subscribeToChannel(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  try {
    const validatedData = subscribeSchema.parse(req.body);

    // Check if channel exists
    const channel = await prisma.videoChannel.findUnique({
      where: { id: validatedData.channelId }
    });

    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    // Check if user is trying to subscribe to their own channel
    if (channel.ownerId === session.user.id) {
      return res.status(400).json({ error: 'Cannot subscribe to your own channel' });
    }

    // Check current subscription status
    const existingSubscription = await prisma.channelSubscription.findUnique({
      where: {
        channelId_userId: {
          channelId: validatedData.channelId,
          userId: session.user.id
        }
      }
    });

    if (existingSubscription) {
      // Update notification settings if already subscribed
      const updatedSubscription = await prisma.channelSubscription.update({
        where: { id: existingSubscription.id },
        data: {
          isNotificationsEnabled: validatedData.enableNotifications
        }
      });

      return res.status(200).json({
        subscription: updatedSubscription,
        message: 'Subscription settings updated'
      });
    }

    // Create new subscription
    const subscription = await prisma.channelSubscription.create({
      data: {
        channelId: validatedData.channelId,
        userId: session.user.id,
        isNotificationsEnabled: validatedData.enableNotifications
      },
      include: {
        channel: {
          select: {
            id: true,
            name: true,
            handle: true,
            avatar: true
          }
        }
      }
    });

    // Update channel subscriber count
    await prisma.videoChannel.update({
      where: { id: validatedData.channelId },
      data: {
        subscriberCount: {
          increment: 1
        }
      }
    });

    // Update today's analytics
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.channelAnalytics.upsert({
      where: {
        channelId_date: {
          channelId: validatedData.channelId,
          date: today
        }
      },
      update: {
        subscriberCount: channel.subscriberCount + 1
      },
      create: {
        channelId: validatedData.channelId,
        date: today,
        subscriberCount: channel.subscriberCount + 1,
        totalViews: 0,
        totalWatchTime: 0,
        videoPublished: 0
      }
    });

    res.status(201).json({
      subscription,
      message: 'Successfully subscribed to channel'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    }

    console.error('Error subscribing to channel:', error);
    res.status(500).json({ error: 'Failed to subscribe to channel' });
  }
}