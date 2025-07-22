import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const createRoomSchema = z.object({
  name: z.string().min(1, 'Room name is required').max(100, 'Room name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  type: z.enum(['DIRECT', 'GROUP', 'CHANNEL', 'SUPPORT']).default('GROUP'),
  isPrivate: z.boolean().default(false),
  avatar: z.string().url().optional(),
  maxMembers: z.number().min(2).max(1000).optional(),
  participants: z.array(z.string()).optional(), // User IDs to invite
  settings: z.record(z.any()).optional()
});

const updateRoomSchema = createRoomSchema.partial().omit({ participants: true });

const addParticipantSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  role: z.enum(['OWNER', 'ADMIN', 'MODERATOR', 'MEMBER', 'GUEST']).default('MEMBER'),
  permissions: z.array(z.string()).optional()
});

async function hasRoomPermission(userId: string, roomId: string, requiredRoles: string[] = ['OWNER', 'ADMIN']) {
  const participant = await prisma.chatParticipant.findUnique({
    where: {
      roomId_userId: {
        roomId,
        userId
      }
    },
    include: {
      room: true
    }
  });

  if (!participant) return false;
  if (participant.isBlocked) return false;
  
  return requiredRoles.includes(participant.role) || participant.room.createdBy === userId;
}

async function getUserParticipation(userId: string, roomId: string) {
  return await prisma.chatParticipant.findUnique({
    where: {
      roomId_userId: {
        roomId,
        userId
      }
    },
    include: {
      room: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      }
    }
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession({ req });
    
    if (!session?.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { method, query } = req;
    const { id, action } = query;

    if (action === 'join' && method === 'POST') {
      return await joinRoom(req, res);
    } else if (action === 'leave' && method === 'POST') {
      return await leaveRoom(req, res);
    } else if (action === 'participants' && method === 'GET') {
      return await getRoomParticipants(req, res);
    } else if (action === 'participants' && method === 'POST') {
      return await addParticipant(req, res);
    } else if (action === 'participants' && method === 'DELETE') {
      return await removeParticipant(req, res);
    }

    switch (method) {
      case 'GET':
        if (id) {
          return await getRoom(req, res);
        } else {
          return await getUserRooms(req, res);
        }

      case 'POST':
        return await createRoom(req, res);

      case 'PUT':
        return await updateRoom(req, res);

      case 'DELETE':
        return await deleteRoom(req, res);

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end('Method Not Allowed');
    }
  } catch (error) {
    console.error('Chat rooms API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}

async function getUserRooms(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const { type, limit = '20' } = req.query;

  try {
    const whereClause: any = {
      participants: {
        some: {
          userId: session.user.id,
          isBlocked: false
        }
      }
    };

    if (type && typeof type === 'string') {
      whereClause.type = type.toUpperCase();
    }

    const rooms = await prisma.chatRoom.findMany({
      where: whereClause,
      include: {
        participants: {
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
            joinedAt: 'asc'
          }
        },
        messages: {
          take: 1,
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true
              }
            },
            readReceipts: {
              where: {
                userId: session.user.id
              }
            }
          }
        },
        _count: {
          select: {
            messages: true,
            participants: true
          }
        }
      },
      orderBy: [
        {
          messages: {
            _count: 'desc'
          }
        },
        {
          updatedAt: 'desc'
        }
      ],
      take: parseInt(limit as string)
    });

    // Enrich rooms with user-specific data
    const enrichedRooms = rooms.map(room => {
      const userParticipation = room.participants.find(p => p.userId === session.user.id);
      const lastMessage = room.messages[0];
      const hasUnread = lastMessage && userParticipation?.lastSeenAt && 
        lastMessage.createdAt > userParticipation.lastSeenAt;

      return {
        ...room,
        userRole: userParticipation?.role,
        lastSeenAt: userParticipation?.lastSeenAt,
        isMuted: userParticipation?.isMuted,
        hasUnread,
        unreadCount: hasUnread ? 1 : 0, // Simplified, could be more accurate
        lastMessage: lastMessage || null
      };
    });

    res.status(200).json({ rooms: enrichedRooms });
  } catch (error) {
    console.error('Error fetching user rooms:', error);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
}

async function getRoom(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Room ID is required' });
  }

  try {
    // Check if user has access to this room
    const participation = await getUserParticipation(session.user.id, id);
    
    if (!participation || participation.isBlocked) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const room = await prisma.chatRoom.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        participants: {
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
          orderBy: [
            { role: 'asc' },
            { joinedAt: 'asc' }
          ]
        },
        _count: {
          select: {
            messages: true,
            participants: true
          }
        }
      }
    });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Update user's last seen timestamp
    await prisma.chatParticipant.update({
      where: {
        roomId_userId: {
          roomId: id,
          userId: session.user.id
        }
      },
      data: {
        lastSeenAt: new Date()
      }
    });

    res.status(200).json({ 
      room: {
        ...room,
        userRole: participation.role,
        userPermissions: participation.permissions
      }
    });
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({ error: 'Failed to fetch room' });
  }
}

async function createRoom(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  try {
    const validatedData = createRoomSchema.parse(req.body);
    const { participants, ...roomData } = validatedData;

    // For direct messages, ensure only 2 participants
    if (roomData.type === 'DIRECT') {
      if (!participants || participants.length !== 1) {
        return res.status(400).json({ error: 'Direct messages require exactly one other participant' });
      }

      // Check if direct room already exists
      const existingDirectRoom = await prisma.chatRoom.findFirst({
        where: {
          type: 'DIRECT',
          participants: {
            every: {
              userId: {
                in: [session.user.id, participants[0]]
              }
            }
          }
        },
        include: {
          participants: true
        }
      });

      if (existingDirectRoom && existingDirectRoom.participants.length === 2) {
        return res.status(200).json({ 
          room: existingDirectRoom,
          message: 'Direct room already exists'
        });
      }
    }

    // Create the room
    const room = await prisma.chatRoom.create({
      data: {
        ...roomData,
        createdBy: session.user.id
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    });

    // Add creator as owner
    await prisma.chatParticipant.create({
      data: {
        roomId: room.id,
        userId: session.user.id,
        role: 'OWNER',
        permissions: ['*'] // Full permissions
      }
    });

    // Add other participants
    if (participants && participants.length > 0) {
      const participantData = participants.map(userId => ({
        roomId: room.id,
        userId,
        role: roomData.type === 'DIRECT' ? 'MEMBER' : 'MEMBER',
        permissions: []
      }));

      await prisma.chatParticipant.createMany({
        data: participantData,
        skipDuplicates: true
      });

      // Send system message
      await prisma.chatMessage.create({
        data: {
          roomId: room.id,
          content: `${session.user.name} created the ${roomData.type.toLowerCase()} "${room.name}"`,
          type: 'SYSTEM'
        }
      });
    }

    res.status(201).json({ 
      room,
      message: 'Room created successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: error.errors
      });
    }
    
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Failed to create room' });
  }
}

async function updateRoom(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Room ID is required' });
  }

  try {
    // Check permissions
    const hasAccess = await hasRoomPermission(session.user.id, id, ['OWNER', 'ADMIN']);
    
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const validatedData = updateRoomSchema.parse(req.body);

    const room = await prisma.chatRoom.update({
      where: { id },
      data: validatedData,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        _count: {
          select: {
            participants: true,
            messages: true
          }
        }
      }
    });

    // Log system message for significant changes
    if (validatedData.name || validatedData.description) {
      await prisma.chatMessage.create({
        data: {
          roomId: id,
          content: `${session.user.name} updated the room settings`,
          type: 'SYSTEM'
        }
      });
    }

    res.status(200).json({ 
      room,
      message: 'Room updated successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: error.errors
      });
    }
    
    console.error('Error updating room:', error);
    res.status(500).json({ error: 'Failed to update room' });
  }
}

async function deleteRoom(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Room ID is required' });
  }

  try {
    // Check if user is owner or has permission
    const hasAccess = await hasRoomPermission(session.user.id, id, ['OWNER']);
    
    if (!hasAccess) {
      return res.status(403).json({ error: 'Only room owners can delete rooms' });
    }

    // Get room info for logging
    const room = await prisma.chatRoom.findUnique({
      where: { id },
      select: { name: true, type: true }
    });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Delete room (cascade will handle related records)
    await prisma.chatRoom.delete({
      where: { id }
    });

    res.status(200).json({ 
      message: 'Room deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ error: 'Failed to delete room' });
  }
}

async function joinRoom(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Room ID is required' });
  }

  try {
    const room = await prisma.chatRoom.findUnique({
      where: { id },
      include: {
        participants: true,
        _count: {
          select: {
            participants: true
          }
        }
      }
    });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Check if room is private
    if (room.isPrivate) {
      return res.status(403).json({ error: 'Cannot join private room without invitation' });
    }

    // Check member limit
    if (room.maxMembers && room._count.participants >= room.maxMembers) {
      return res.status(400).json({ error: 'Room has reached maximum capacity' });
    }

    // Check if already a participant
    const existingParticipant = room.participants.find(p => p.userId === session.user.id);
    if (existingParticipant) {
      if (existingParticipant.isBlocked) {
        return res.status(403).json({ error: 'You are blocked from this room' });
      }
      return res.status(200).json({ message: 'Already a member of this room' });
    }

    // Add user as participant
    const participant = await prisma.chatParticipant.create({
      data: {
        roomId: id,
        userId: session.user.id,
        role: 'MEMBER',
        permissions: []
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    });

    // Send system message
    await prisma.chatMessage.create({
      data: {
        roomId: id,
        content: `${session.user.name} joined the ${room.type.toLowerCase()}`,
        type: 'SYSTEM'
      }
    });

    res.status(200).json({ 
      participant,
      message: 'Successfully joined room'
    });
  } catch (error) {
    console.error('Error joining room:', error);
    res.status(500).json({ error: 'Failed to join room' });
  }
}

async function leaveRoom(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Room ID is required' });
  }

  try {
    const participant = await prisma.chatParticipant.findUnique({
      where: {
        roomId_userId: {
          roomId: id,
          userId: session.user.id
        }
      },
      include: {
        room: true
      }
    });

    if (!participant) {
      return res.status(404).json({ error: 'Not a member of this room' });
    }

    // Owners cannot leave their own rooms - they must transfer ownership or delete
    if (participant.role === 'OWNER') {
      return res.status(400).json({ error: 'Owners cannot leave their rooms. Transfer ownership or delete the room.' });
    }

    // Remove participant
    await prisma.chatParticipant.delete({
      where: {
        roomId_userId: {
          roomId: id,
          userId: session.user.id
        }
      }
    });

    // Send system message
    await prisma.chatMessage.create({
      data: {
        roomId: id,
        content: `${session.user.name} left the ${participant.room.type.toLowerCase()}`,
        type: 'SYSTEM'
      }
    });

    res.status(200).json({ 
      message: 'Successfully left room'
    });
  } catch (error) {
    console.error('Error leaving room:', error);
    res.status(500).json({ error: 'Failed to leave room' });
  }
}

async function getRoomParticipants(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Room ID is required' });
  }

  try {
    // Check if user has access to this room
    const userParticipation = await getUserParticipation(session.user.id, id);
    
    if (!userParticipation || userParticipation.isBlocked) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const participants = await prisma.chatParticipant.findMany({
      where: { 
        roomId: id,
        isBlocked: false
      },
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
      orderBy: [
        { role: 'asc' },
        { joinedAt: 'asc' }
      ]
    });

    res.status(200).json({ participants });
  } catch (error) {
    console.error('Error fetching participants:', error);
    res.status(500).json({ error: 'Failed to fetch participants' });
  }
}

async function addParticipant(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Room ID is required' });
  }

  try {
    const validatedData = addParticipantSchema.parse(req.body);
    const { userId, role, permissions } = validatedData;

    // Check permissions
    const hasAccess = await hasRoomPermission(session.user.id, id, ['OWNER', 'ADMIN', 'MODERATOR']);
    
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, image: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already a participant
    const existingParticipant = await prisma.chatParticipant.findUnique({
      where: {
        roomId_userId: {
          roomId: id,
          userId
        }
      }
    });

    if (existingParticipant) {
      return res.status(400).json({ error: 'User is already a participant' });
    }

    // Check room capacity
    const room = await prisma.chatRoom.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            participants: true
          }
        }
      }
    });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (room.maxMembers && room._count.participants >= room.maxMembers) {
      return res.status(400).json({ error: 'Room has reached maximum capacity' });
    }

    // Add participant
    const participant = await prisma.chatParticipant.create({
      data: {
        roomId: id,
        userId,
        role,
        permissions: permissions || []
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    });

    // Send system message
    await prisma.chatMessage.create({
      data: {
        roomId: id,
        content: `${session.user.name} added ${user.name} to the ${room.type.toLowerCase()}`,
        type: 'SYSTEM'
      }
    });

    res.status(201).json({ 
      participant,
      message: 'Participant added successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: error.errors
      });
    }
    
    console.error('Error adding participant:', error);
    res.status(500).json({ error: 'Failed to add participant' });
  }
}

async function removeParticipant(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const { id, userId } = req.query;

  if (!id || typeof id !== 'string' || !userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'Room ID and User ID are required' });
  }

  try {
    // Check permissions
    const hasAccess = await hasRoomPermission(session.user.id, id, ['OWNER', 'ADMIN', 'MODERATOR']);
    
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const participant = await prisma.chatParticipant.findUnique({
      where: {
        roomId_userId: {
          roomId: id,
          userId
        }
      },
      include: {
        user: {
          select: {
            name: true
          }
        },
        room: {
          select: {
            type: true
          }
        }
      }
    });

    if (!participant) {
      return res.status(404).json({ error: 'Participant not found' });
    }

    // Cannot remove room owner
    if (participant.role === 'OWNER') {
      return res.status(400).json({ error: 'Cannot remove room owner' });
    }

    // Remove participant
    await prisma.chatParticipant.delete({
      where: {
        roomId_userId: {
          roomId: id,
          userId
        }
      }
    });

    // Send system message
    await prisma.chatMessage.create({
      data: {
        roomId: id,
        content: `${session.user.name} removed ${participant.user.name} from the ${participant.room.type.toLowerCase()}`,
        type: 'SYSTEM'
      }
    });

    res.status(200).json({ 
      message: 'Participant removed successfully'
    });
  } catch (error) {
    console.error('Error removing participant:', error);
    res.status(500).json({ error: 'Failed to remove participant' });
  }
}