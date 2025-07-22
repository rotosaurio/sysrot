import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const sendMessageSchema = z.object({
  roomId: z.string().min(1, 'Room ID is required'),
  content: z.string().min(1, 'Message content is required').max(4000, 'Message too long'),
  type: z.enum(['TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'FILE', 'STICKER', 'GIF']).default('TEXT'),
  parentId: z.string().optional(), // For threading
  metadata: z.record(z.any()).optional() // For mentions, formatting, etc.
});

const editMessageSchema = z.object({
  content: z.string().min(1, 'Message content is required').max(4000, 'Message too long')
});

const reactionSchema = z.object({
  emoji: z.string().min(1, 'Emoji is required').max(50, 'Emoji too long')
});

const typingSchema = z.object({
  roomId: z.string().min(1, 'Room ID is required'),
  isTyping: z.boolean()
});

async function hasRoomAccess(userId: string, roomId: string) {
  const participant = await prisma.chatParticipant.findUnique({
    where: {
      roomId_userId: {
        roomId,
        userId
      }
    }
  });

  return participant && !participant.isBlocked;
}

async function canModifyMessage(userId: string, messageId: string) {
  const message = await prisma.chatMessage.findUnique({
    where: { id: messageId },
    include: {
      room: {
        include: {
          participants: {
            where: { userId }
          }
        }
      }
    }
  });

  if (!message || !message.userId) return false;
  
  const participant = message.room.participants[0];
  if (!participant || participant.isBlocked) return false;

  // User can modify their own messages or admins can modify any message
  return message.userId === userId || ['OWNER', 'ADMIN', 'MODERATOR'].includes(participant.role);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession({ req });
    
    if (!session?.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { method, query } = req;
    const { id, action } = query;

    // Handle specific actions
    if (action === 'reaction' && method === 'POST') {
      return await addReaction(req, res);
    } else if (action === 'reaction' && method === 'DELETE') {
      return await removeReaction(req, res);
    } else if (action === 'read' && method === 'POST') {
      return await markAsRead(req, res);
    } else if (action === 'typing' && method === 'POST') {
      return await updateTypingStatus(req, res);
    }

    switch (method) {
      case 'GET':
        if (id) {
          return await getMessage(req, res);
        } else {
          return await getRoomMessages(req, res);
        }

      case 'POST':
        return await sendMessage(req, res);

      case 'PUT':
        return await editMessage(req, res);

      case 'DELETE':
        return await deleteMessage(req, res);

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end('Method Not Allowed');
    }
  } catch (error) {
    console.error('Chat messages API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}

async function getRoomMessages(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const { roomId, limit = '50', before, after } = req.query;

  if (!roomId || typeof roomId !== 'string') {
    return res.status(400).json({ error: 'Room ID is required' });
  }

  try {
    // Check room access
    const hasAccess = await hasRoomAccess(session.user.id, roomId);
    
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Build pagination where clause
    const whereClause: any = {
      roomId,
      deletedAt: null
    };

    if (before && typeof before === 'string') {
      whereClause.createdAt = { lt: new Date(before) };
    } else if (after && typeof after === 'string') {
      whereClause.createdAt = { gt: new Date(after) };
    }

    const messages = await prisma.chatMessage.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        attachments: true,
        reactions: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        },
        readReceipts: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          },
          orderBy: {
            readAt: 'desc'
          }
        },
        parent: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        },
        _count: {
          select: {
            replies: true
          }
        }
      },
      orderBy: {
        createdAt: before ? 'desc' : 'asc'
      },
      take: parseInt(limit as string)
    });

    // If using 'before' pagination, reverse the results to maintain chronological order
    if (before) {
      messages.reverse();
    }

    // Group reactions by emoji
    const messagesWithGroupedReactions = messages.map(message => ({
      ...message,
      reactions: groupReactionsByEmoji(message.reactions)
    }));

    res.status(200).json({ 
      messages: messagesWithGroupedReactions,
      hasMore: messages.length === parseInt(limit as string)
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
}

async function getMessage(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Message ID is required' });
  }

  try {
    const message = await prisma.chatMessage.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        room: {
          select: {
            id: true,
            name: true,
            type: true
          }
        },
        attachments: true,
        reactions: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        },
        readReceipts: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        },
        parent: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true
              }
            },
            reactions: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    image: true
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Check room access
    const hasAccess = await hasRoomAccess(session.user.id, message.roomId);
    
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Group reactions by emoji
    const messageWithGroupedReactions = {
      ...message,
      reactions: groupReactionsByEmoji(message.reactions),
      replies: message.replies.map(reply => ({
        ...reply,
        reactions: groupReactionsByEmoji(reply.reactions)
      }))
    };

    res.status(200).json({ message: messageWithGroupedReactions });
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({ error: 'Failed to fetch message' });
  }
}

async function sendMessage(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  try {
    const validatedData = sendMessageSchema.parse(req.body);
    const { roomId, content, type, parentId, metadata } = validatedData;

    // Check room access
    const hasAccess = await hasRoomAccess(session.user.id, roomId);
    
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied to this room' });
    }

    // If replying to a message, verify parent exists and is in same room
    if (parentId) {
      const parentMessage = await prisma.chatMessage.findUnique({
        where: { id: parentId },
        select: { roomId: true }
      });

      if (!parentMessage || parentMessage.roomId !== roomId) {
        return res.status(400).json({ error: 'Invalid parent message' });
      }
    }

    // Create the message
    const message = await prisma.chatMessage.create({
      data: {
        roomId,
        userId: session.user.id,
        content,
        type,
        parentId,
        metadata
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        parent: parentId ? {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        } : false,
        attachments: true,
        reactions: true,
        readReceipts: true
      }
    });

    // Update room's updatedAt timestamp
    await prisma.chatRoom.update({
      where: { id: roomId },
      data: { updatedAt: new Date() }
    });

    // Clear typing indicator for this user
    await prisma.chatTypingIndicator.deleteMany({
      where: {
        roomId,
        userId: session.user.id
      }
    });

    // Auto-mark as read for sender
    await prisma.chatReadReceipt.create({
      data: {
        messageId: message.id,
        userId: session.user.id
      }
    });

    // TODO: Send real-time notification to room participants
    // This would be handled by WebSocket server

    res.status(201).json({ 
      message: {
        ...message,
        reactions: []
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: error.errors
      });
    }
    
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
}

async function editMessage(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Message ID is required' });
  }

  try {
    const validatedData = editMessageSchema.parse(req.body);
    const { content } = validatedData;

    // Check if user can modify this message
    const canModify = await canModifyMessage(session.user.id, id);
    
    if (!canModify) {
      return res.status(403).json({ error: 'Cannot edit this message' });
    }

    // Check message age (can only edit messages within 24 hours)
    const message = await prisma.chatMessage.findUnique({
      where: { id },
      select: { createdAt: true, type: true }
    });

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    const hoursSinceCreated = (Date.now() - message.createdAt.getTime()) / (1000 * 60 * 60);
    if (hoursSinceCreated > 24) {
      return res.status(400).json({ error: 'Cannot edit messages older than 24 hours' });
    }

    // Cannot edit system messages
    if (message.type === 'SYSTEM') {
      return res.status(400).json({ error: 'Cannot edit system messages' });
    }

    // Update the message
    const updatedMessage = await prisma.chatMessage.update({
      where: { id },
      data: {
        content,
        editedAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        attachments: true,
        reactions: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        }
      }
    });

    res.status(200).json({ 
      message: {
        ...updatedMessage,
        reactions: groupReactionsByEmoji(updatedMessage.reactions)
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: error.errors
      });
    }
    
    console.error('Error editing message:', error);
    res.status(500).json({ error: 'Failed to edit message' });
  }
}

async function deleteMessage(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Message ID is required' });
  }

  try {
    // Check if user can modify this message
    const canModify = await canModifyMessage(session.user.id, id);
    
    if (!canModify) {
      return res.status(403).json({ error: 'Cannot delete this message' });
    }

    const message = await prisma.chatMessage.findUnique({
      where: { id },
      select: { type: true, createdAt: true }
    });

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Cannot delete system messages
    if (message.type === 'SYSTEM') {
      return res.status(400).json({ error: 'Cannot delete system messages' });
    }

    // Soft delete - mark as deleted instead of actually deleting
    await prisma.chatMessage.update({
      where: { id },
      data: {
        content: '[Message deleted]',
        deletedAt: new Date(),
        metadata: { deleted: true, deletedBy: session.user.id }
      }
    });

    res.status(200).json({ 
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
}

async function addReaction(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const { id } = req.query; // message ID

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Message ID is required' });
  }

  try {
    const validatedData = reactionSchema.parse(req.body);
    const { emoji } = validatedData;

    // Get message and check room access
    const message = await prisma.chatMessage.findUnique({
      where: { id },
      select: { roomId: true }
    });

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    const hasAccess = await hasRoomAccess(session.user.id, message.roomId);
    
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Add or update reaction
    const reaction = await prisma.chatReaction.upsert({
      where: {
        messageId_userId_emoji: {
          messageId: id,
          userId: session.user.id,
          emoji
        }
      },
      update: {
        createdAt: new Date() // Update timestamp if re-reacting
      },
      create: {
        messageId: id,
        userId: session.user.id,
        emoji
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });

    res.status(200).json({ reaction });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: error.errors
      });
    }
    
    console.error('Error adding reaction:', error);
    res.status(500).json({ error: 'Failed to add reaction' });
  }
}

async function removeReaction(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const { id, emoji } = req.query; // message ID and emoji

  if (!id || typeof id !== 'string' || !emoji || typeof emoji !== 'string') {
    return res.status(400).json({ error: 'Message ID and emoji are required' });
  }

  try {
    // Get message and check room access
    const message = await prisma.chatMessage.findUnique({
      where: { id },
      select: { roomId: true }
    });

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    const hasAccess = await hasRoomAccess(session.user.id, message.roomId);
    
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Remove reaction
    await prisma.chatReaction.delete({
      where: {
        messageId_userId_emoji: {
          messageId: id,
          userId: session.user.id,
          emoji
        }
      }
    });

    res.status(200).json({ message: 'Reaction removed' });
  } catch (error) {
    console.error('Error removing reaction:', error);
    res.status(500).json({ error: 'Failed to remove reaction' });
  }
}

async function markAsRead(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const { id } = req.query; // message ID

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Message ID is required' });
  }

  try {
    // Get message and check room access
    const message = await prisma.chatMessage.findUnique({
      where: { id },
      select: { roomId: true, userId: true }
    });

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    const hasAccess = await hasRoomAccess(session.user.id, message.roomId);
    
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Don't create read receipt for own messages
    if (message.userId === session.user.id) {
      return res.status(200).json({ message: 'Cannot mark own message as read' });
    }

    // Create read receipt
    const readReceipt = await prisma.chatReadReceipt.upsert({
      where: {
        messageId_userId: {
          messageId: id,
          userId: session.user.id
        }
      },
      update: {
        readAt: new Date()
      },
      create: {
        messageId: id,
        userId: session.user.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });

    res.status(200).json({ readReceipt });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ error: 'Failed to mark message as read' });
  }
}

async function updateTypingStatus(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  try {
    const validatedData = typingSchema.parse(req.body);
    const { roomId, isTyping } = validatedData;

    // Check room access
    const hasAccess = await hasRoomAccess(session.user.id, roomId);
    
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (isTyping) {
      // Create or update typing indicator
      await prisma.chatTypingIndicator.upsert({
        where: {
          roomId_userId: {
            roomId,
            userId: session.user.id
          }
        },
        update: {
          lastTypedAt: new Date(),
          isTyping: true
        },
        create: {
          roomId,
          userId: session.user.id,
          isTyping: true
        }
      });
    } else {
      // Remove typing indicator
      await prisma.chatTypingIndicator.deleteMany({
        where: {
          roomId,
          userId: session.user.id
        }
      });
    }

    res.status(200).json({ message: 'Typing status updated' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: error.errors
      });
    }
    
    console.error('Error updating typing status:', error);
    res.status(500).json({ error: 'Failed to update typing status' });
  }
}

// Helper function to group reactions by emoji
function groupReactionsByEmoji(reactions: any[]) {
  const grouped = reactions.reduce((acc, reaction) => {
    const emoji = reaction.emoji;
    if (!acc[emoji]) {
      acc[emoji] = {
        emoji,
        count: 0,
        users: [],
        hasReacted: false
      };
    }
    acc[emoji].count++;
    acc[emoji].users.push(reaction.user);
    return acc;
  }, {});

  return Object.values(grouped);
}