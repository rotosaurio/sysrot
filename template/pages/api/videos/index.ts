import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const createVideoSchema = z.object({
  title: z.string().min(1, 'Video title is required').max(200, 'Title too long'),
  description: z.string().max(5000, 'Description too long').optional(),
  channelId: z.string(),
  
  // Video file details
  videoUrl: z.string().url('Invalid video URL'),
  duration: z.number().min(1, 'Duration must be positive'),
  fileSize: z.number().min(1, 'File size must be positive'),
  resolution: z.string().optional(),
  fps: z.number().optional(),
  bitrate: z.number().optional(),
  
  // Metadata
  category: z.enum(['GENERAL', 'GAMING', 'MUSIC', 'SPORTS', 'ENTERTAINMENT', 'NEWS', 'EDUCATION', 'SCIENCE_TECH', 'TRAVEL', 'LIFESTYLE', 'COOKING', 'FITNESS', 'BUSINESS', 'COMEDY', 'DOCUMENTARY', 'KIDS', 'LIVE', 'ANIMATION', 'TUTORIAL', 'REVIEW', 'VLOG']).default('GENERAL'),
  tags: z.array(z.string()).max(20, 'Too many tags').optional(),
  language: z.string().default('en'),
  
  // Privacy and settings
  visibility: z.enum(['PUBLIC', 'UNLISTED', 'PRIVATE', 'SCHEDULED']).default('PRIVATE'),
  isAgeRestricted: z.boolean().default(false),
  isMonetized: z.boolean().default(false),
  
  // Scheduling
  publishedAt: z.string().datetime().optional(),
  
  // SEO
  slug: z.string().optional(),
  thumbnail: z.string().url().optional(),
  customThumbnails: z.array(z.string().url()).optional()
});

const updateVideoSchema = createVideoSchema.partial();

const likeVideoSchema = z.object({
  videoId: z.string(),
  isLike: z.boolean() // true for like, false for dislike
});

const commentSchema = z.object({
  videoId: z.string(),
  content: z.string().min(1, 'Comment cannot be empty').max(1000, 'Comment too long'),
  parentId: z.string().optional() // For replies
});

async function hasVideoPermission(userId: string, videoId: string, action: string = 'read') {
  const video = await prisma.video.findUnique({
    where: { id: videoId },
    include: {
      channel: {
        include: {
          collaborators: {
            where: { userId, isActive: true }
          }
        }
      }
    }
  });

  if (!video) return false;

  // Video owner or channel owner has all permissions
  if (video.uploadedById === userId || video.channel.ownerId === userId) return true;

  // Check channel collaborator permissions
  const collaborator = video.channel.collaborators[0];
  if (!collaborator) {
    // Public videos are readable by everyone
    return action === 'read' && video.visibility === 'PUBLIC' && video.status === 'READY';
  }

  switch (action) {
    case 'read':
      return true;
    case 'update':
      return ['ADMIN', 'MODERATOR', 'EDITOR'].includes(collaborator.role);
    case 'delete':
      return ['ADMIN', 'MODERATOR'].includes(collaborator.role);
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
    const { action } = req.query;

    switch (method) {
      case 'GET':
        return await getVideos(req, res);

      case 'POST':
        if (action === 'like') {
          return await likeVideo(req, res);
        } else if (action === 'comment') {
          return await addComment(req, res);
        } else if (action === 'watch') {
          return await recordWatch(req, res);
        }
        return await createVideo(req, res);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end('Method Not Allowed');
    }
  } catch (error) {
    console.error('Videos API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}

async function getVideos(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const { 
    channelId,
    category,
    search,
    sortBy = 'publishedAt',
    sortOrder = 'desc',
    limit = '20',
    page = '1',
    visibility = 'PUBLIC',
    status = 'READY'
  } = req.query;

  try {
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    // Build where clause
    const whereClause: any = {
      status: status === 'ALL' ? undefined : status
    };

    if (channelId && typeof channelId === 'string') {
      whereClause.channelId = channelId;
    }

    if (category && category !== 'ALL') {
      whereClause.category = category;
    }

    if (visibility && visibility !== 'ALL') {
      whereClause.visibility = visibility;
    }

    if (search && typeof search === 'string') {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search] } }
      ];
    }

    // Only show published videos unless user owns the channel
    if (!channelId || visibility === 'PUBLIC') {
      whereClause.publishedAt = { lte: new Date() };
    }

    // Get videos with comprehensive data
    const videos = await prisma.video.findMany({
      where: whereClause,
      include: {
        channel: {
          select: {
            id: true,
            name: true,
            handle: true,
            avatar: true,
            isVerified: true,
            subscriberCount: true
          }
        },
        uploadedBy: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        qualities: {
          where: {
            processingStatus: 'completed'
          },
          orderBy: {
            quality: 'desc'
          }
        },
        _count: {
          select: {
            comments: true,
            likes: true,
            playlistItems: true
          }
        }
      },
      orderBy: {
        [sortBy as string]: sortOrder
      },
      skip: offset,
      take: limitNum
    });

    // Enrich videos with user interaction data
    const enrichedVideos = await Promise.all(
      videos.map(async (video) => {
        // Check if user has liked/disliked the video
        const userLike = await prisma.videoLike.findUnique({
          where: {
            videoId_userId: {
              videoId: video.id,
              userId: session.user.id
            }
          }
        });

        // Check watch history
        const watchHistory = await prisma.watchHistory.findUnique({
          where: {
            userId_videoId: {
              userId: session.user.id,
              videoId: video.id
            }
          }
        });

        // Calculate engagement rate
        const totalEngagement = video.likeCount + video.dislikeCount + video.commentCount;
        const engagementRate = video.viewCount > 0 ? (totalEngagement / video.viewCount) * 100 : 0;

        return {
          ...video,
          userInteraction: {
            hasLiked: userLike?.isLike === true,
            hasDisliked: userLike?.isLike === false,
            watchProgress: watchHistory?.lastPosition || 0,
            isCompleted: watchHistory?.isCompleted || false
          },
          stats: {
            engagementRate: Math.round(engagementRate * 100) / 100,
            avgViewDuration: watchHistory?.watchDuration || 0,
            totalComments: video._count.comments,
            totalLikes: video._count.likes,
            inPlaylists: video._count.playlistItems
          }
        };
      })
    );

    // Get total count for pagination
    const total = await prisma.video.count({
      where: whereClause
    });

    res.status(200).json({
      videos: enrichedVideos,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
}

async function createVideo(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  try {
    const validatedData = createVideoSchema.parse(req.body);

    // Verify user has permission to upload to this channel
    const channel = await prisma.videoChannel.findUnique({
      where: { id: validatedData.channelId },
      include: {
        collaborators: {
          where: { userId: session.user.id, isActive: true }
        }
      }
    });

    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    const hasPermission = channel.ownerId === session.user.id || 
      channel.collaborators.some(c => ['ADMIN', 'MODERATOR', 'EDITOR'].includes(c.role));

    if (!hasPermission) {
      return res.status(403).json({ error: 'No permission to upload to this channel' });
    }

    // Generate slug if not provided
    let slug = validatedData.slug;
    if (!slug) {
      slug = validatedData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      // Ensure slug uniqueness
      const existingVideo = await prisma.video.findUnique({ where: { slug } });
      if (existingVideo) {
        slug = `${slug}-${Date.now()}`;
      }
    }

    // Create the video
    const video = await prisma.video.create({
      data: {
        ...validatedData,
        slug,
        uploadedById: session.user.id,
        uploadedAt: new Date(),
        publishedAt: validatedData.publishedAt ? new Date(validatedData.publishedAt) : 
          (validatedData.visibility === 'PUBLIC' ? new Date() : undefined),
        tags: validatedData.tags || []
      },
      include: {
        channel: {
          select: {
            id: true,
            name: true,
            handle: true,
            avatar: true
          }
        },
        uploadedBy: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });

    // Update channel video count
    await prisma.videoChannel.update({
      where: { id: validatedData.channelId },
      data: {
        videoCount: {
          increment: 1
        }
      }
    });

    // Create initial analytics entry if published
    if (video.publishedAt) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      await prisma.videoAnalytics.create({
        data: {
          videoId: video.id,
          date: today,
          views: 0,
          uniqueViews: 0,
          watchTime: 0,
          averageViewDuration: 0
        }
      });

      // Update channel analytics
      await prisma.channelAnalytics.upsert({
        where: {
          channelId_date: {
            channelId: validatedData.channelId,
            date: today
          }
        },
        update: {
          videoPublished: {
            increment: 1
          }
        },
        create: {
          channelId: validatedData.channelId,
          date: today,
          subscriberCount: channel.subscriberCount,
          totalViews: 0,
          totalWatchTime: 0,
          videoPublished: 1
        }
      });
    }

    res.status(201).json({
      video,
      message: 'Video uploaded successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    }

    console.error('Error creating video:', error);
    res.status(500).json({ error: 'Failed to create video' });
  }
}

async function likeVideo(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  try {
    const validatedData = likeVideoSchema.parse(req.body);

    // Check if video exists and is accessible
    const video = await prisma.video.findUnique({
      where: { id: validatedData.videoId }
    });

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Check existing like/dislike
    const existingLike = await prisma.videoLike.findUnique({
      where: {
        videoId_userId: {
          videoId: validatedData.videoId,
          userId: session.user.id
        }
      }
    });

    if (existingLike) {
      if (existingLike.isLike === validatedData.isLike) {
        // Remove like/dislike if clicking same button
        await prisma.videoLike.delete({
          where: { id: existingLike.id }
        });

        // Update video counts
        await prisma.video.update({
          where: { id: validatedData.videoId },
          data: {
            [validatedData.isLike ? 'likeCount' : 'dislikeCount']: {
              decrement: 1
            }
          }
        });

        return res.status(200).json({ 
          action: 'removed',
          message: validatedData.isLike ? 'Like removed' : 'Dislike removed' 
        });
      } else {
        // Switch between like and dislike
        await prisma.videoLike.update({
          where: { id: existingLike.id },
          data: { isLike: validatedData.isLike }
        });

        // Update video counts
        await prisma.video.update({
          where: { id: validatedData.videoId },
          data: {
            likeCount: {
              [validatedData.isLike ? 'increment' : 'decrement']: 1
            },
            dislikeCount: {
              [validatedData.isLike ? 'decrement' : 'increment']: 1
            }
          }
        });

        return res.status(200).json({ 
          action: 'updated',
          message: validatedData.isLike ? 'Video liked' : 'Video disliked' 
        });
      }
    }

    // Create new like/dislike
    await prisma.videoLike.create({
      data: {
        videoId: validatedData.videoId,
        userId: session.user.id,
        isLike: validatedData.isLike
      }
    });

    // Update video counts
    await prisma.video.update({
      where: { id: validatedData.videoId },
      data: {
        [validatedData.isLike ? 'likeCount' : 'dislikeCount']: {
          increment: 1
        }
      }
    });

    res.status(201).json({
      action: 'created',
      message: validatedData.isLike ? 'Video liked' : 'Video disliked'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    }

    console.error('Error liking video:', error);
    res.status(500).json({ error: 'Failed to like video' });
  }
}

async function addComment(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  try {
    const validatedData = commentSchema.parse(req.body);

    // Verify video exists and is accessible
    const video = await prisma.video.findUnique({
      where: { id: validatedData.videoId }
    });

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Verify parent comment if replying
    if (validatedData.parentId) {
      const parentComment = await prisma.videoComment.findFirst({
        where: {
          id: validatedData.parentId,
          videoId: validatedData.videoId
        }
      });

      if (!parentComment) {
        return res.status(400).json({ error: 'Parent comment not found' });
      }
    }

    // Create comment
    const comment = await prisma.videoComment.create({
      data: {
        videoId: validatedData.videoId,
        authorId: session.user.id,
        content: validatedData.content,
        parentId: validatedData.parentId
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        _count: {
          select: {
            replies: true,
            likes: true
          }
        }
      }
    });

    // Update video comment count
    await prisma.video.update({
      where: { id: validatedData.videoId },
      data: {
        commentCount: {
          increment: 1
        }
      }
    });

    res.status(201).json({
      comment,
      message: 'Comment added successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    }

    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
}

async function recordWatch(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const { videoId, watchDuration, lastPosition, quality, deviceType } = req.body;

  try {
    // Update or create watch history
    const watchHistory = await prisma.watchHistory.upsert({
      where: {
        userId_videoId: {
          userId: session.user.id,
          videoId
        }
      },
      update: {
        watchedAt: new Date(),
        watchDuration: Math.max(watchDuration, 0),
        lastPosition: Math.max(lastPosition, 0),
        isCompleted: lastPosition >= (await prisma.video.findUnique({ where: { id: videoId }, select: { duration: true } }))?.duration! * 0.9,
        quality,
        deviceType
      },
      create: {
        userId: session.user.id,
        videoId,
        watchDuration: Math.max(watchDuration, 0),
        lastPosition: Math.max(lastPosition, 0),
        quality,
        deviceType
      }
    });

    // Update video view count (only count as view if watched > 30 seconds)
    if (watchDuration >= 30) {
      await prisma.video.update({
        where: { id: videoId },
        data: {
          viewCount: {
            increment: 1
          }
        }
      });

      // Update analytics
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      await prisma.videoAnalytics.upsert({
        where: {
          videoId_date: {
            videoId,
            date: today
          }
        },
        update: {
          views: {
            increment: 1
          },
          watchTime: {
            increment: watchDuration
          }
        },
        create: {
          videoId,
          date: today,
          views: 1,
          uniqueViews: 1,
          watchTime: watchDuration,
          averageViewDuration: watchDuration
        }
      });
    }

    res.status(200).json({
      watchHistory,
      message: 'Watch progress recorded'
    });
  } catch (error) {
    console.error('Error recording watch:', error);
    res.status(500).json({ error: 'Failed to record watch progress' });
  }
}