import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';
import { z } from 'zod';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Validation schemas
const inviteMemberSchema = z.object({
  organizationId: z.string().min(1, 'Organization ID is required'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['ADMIN', 'MEMBER', 'VIEWER']).default('MEMBER')
});

const updateMemberSchema = z.object({
  role: z.enum(['ADMIN', 'MEMBER', 'VIEWER']),
  permissions: z.array(z.string()).optional()
});

const acceptInvitationSchema = z.object({
  token: z.string().min(1, 'Token is required')
});

async function hasPermission(userId: string, organizationId: string, requiredRole: string[] = ['OWNER', 'ADMIN']) {
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

async function getUserMembership(userId: string, organizationId: string) {
  return await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId,
        userId
      }
    },
    include: {
      organization: true,
      user: true
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
    const { organizationId, action } = query;

    // Handle different actions
    if (action === 'invite') {
      if (method === 'POST') return await inviteMember(req, res);
    } else if (action === 'accept') {
      if (method === 'POST') return await acceptInvitation(req, res);
    } else if (action === 'invitations') {
      if (method === 'GET') return await getInvitations(req, res);
      if (method === 'DELETE') return await cancelInvitation(req, res);
    } else {
      // Default member operations
      switch (method) {
        case 'GET':
          return await getMembers(req, res);
        case 'PUT':
          return await updateMember(req, res);
        case 'DELETE':
          return await removeMember(req, res);
        default:
          res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
          return res.status(405).end('Method Not Allowed');
      }
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    return res.status(405).end('Method Not Allowed');
  } catch (error) {
    console.error('Members API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}

async function getMembers(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const { organizationId } = req.query;

  if (!organizationId || typeof organizationId !== 'string') {
    return res.status(400).json({ error: 'Organization ID is required' });
  }

  try {
    // Check permissions
    const hasAccess = await hasPermission(session.user.id, organizationId, ['OWNER', 'ADMIN', 'MEMBER', 'VIEWER']);
    
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const members = await prisma.organizationMember.findMany({
      where: { organizationId },
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
      orderBy: [
        { role: 'asc' }, // Owners first
        { joinedAt: 'asc' }
      ]
    });

    res.status(200).json({ members });
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
}

async function inviteMember(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  try {
    const validatedData = inviteMemberSchema.parse(req.body);
    const { organizationId, email, role } = validatedData;

    // Check permissions
    const hasAccess = await hasPermission(session.user.id, organizationId, ['OWNER', 'ADMIN']);
    
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get organization details
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        members: true,
        plan: true
      }
    });

    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    // Check if user is already a member
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      const existingMember = await prisma.organizationMember.findUnique({
        where: {
          organizationId_userId: {
            organizationId,
            userId: existingUser.id
          }
        }
      });

      if (existingMember) {
        return res.status(400).json({ error: 'User is already a member of this organization' });
      }
    }

    // Check if invitation already exists
    const existingInvitation = await prisma.organizationInvitation.findUnique({
      where: {
        organizationId_email: {
          organizationId,
          email
        }
      }
    });

    if (existingInvitation && existingInvitation.status === 'PENDING') {
      return res.status(400).json({ error: 'Invitation already sent to this email' });
    }

    // Check user limit
    if (organization.members.length >= organization.userLimit) {
      return res.status(400).json({ 
        error: `Organization has reached its user limit of ${organization.userLimit}. Please upgrade your plan.` 
      });
    }

    // Generate invitation token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    // Create or update invitation
    const invitation = await prisma.organizationInvitation.upsert({
      where: {
        organizationId_email: {
          organizationId,
          email
        }
      },
      update: {
        role,
        token,
        invitedBy: session.user.id,
        status: 'PENDING',
        expiresAt
      },
      create: {
        organizationId,
        email,
        role,
        token,
        invitedBy: session.user.id,
        status: 'PENDING',
        expiresAt
      },
      include: {
        organization: {
          select: {
            name: true
          }
        },
        inviter: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    // Log activity
    await prisma.activity.create({
      data: {
        organizationId,
        userId: session.user.id,
        action: 'member_invited',
        metadata: {
          email,
          role,
          invitationId: invitation.id
        }
      }
    });

    // TODO: Send invitation email here
    const invitationUrl = `${process.env.NEXTAUTH_URL}/saas/accept-invitation?token=${token}`;

    res.status(201).json({ 
      invitation: {
        ...invitation,
        invitationUrl
      },
      message: 'Invitation sent successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: error.errors
      });
    }
    
    console.error('Error inviting member:', error);
    res.status(500).json({ error: 'Failed to send invitation' });
  }
}

async function acceptInvitation(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  try {
    const validatedData = acceptInvitationSchema.parse(req.body);
    const { token } = validatedData;

    // Find invitation
    const invitation = await prisma.organizationInvitation.findUnique({
      where: { token },
      include: {
        organization: {
          include: {
            members: true,
            plan: true
          }
        }
      }
    });

    if (!invitation) {
      return res.status(404).json({ error: 'Invalid invitation token' });
    }

    if (invitation.status !== 'PENDING') {
      return res.status(400).json({ error: 'Invitation has already been processed' });
    }

    if (invitation.expiresAt < new Date()) {
      await prisma.organizationInvitation.update({
        where: { id: invitation.id },
        data: { status: 'EXPIRED' }
      });
      return res.status(400).json({ error: 'Invitation has expired' });
    }

    // Check if user email matches invitation email
    if (session.user.email !== invitation.email) {
      return res.status(403).json({ error: 'This invitation is for a different email address' });
    }

    // Check user limit
    if (invitation.organization.members.length >= invitation.organization.userLimit) {
      return res.status(400).json({ 
        error: `Organization has reached its user limit of ${invitation.organization.userLimit}` 
      });
    }

    // Check if user is already a member
    const existingMember = await prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId: invitation.organizationId,
          userId: session.user.id
        }
      }
    });

    if (existingMember) {
      return res.status(400).json({ error: 'You are already a member of this organization' });
    }

    // Create membership and update invitation
    const [member] = await Promise.all([
      prisma.organizationMember.create({
        data: {
          organizationId: invitation.organizationId,
          userId: session.user.id,
          role: invitation.role,
          permissions: []
        },
        include: {
          organization: {
            select: {
              name: true,
              slug: true
            }
          },
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      }),
      prisma.organizationInvitation.update({
        where: { id: invitation.id },
        data: {
          status: 'ACCEPTED',
          acceptedAt: new Date()
        }
      }),
      // Update usage
      prisma.usage.upsert({
        where: {
          organizationId_month_year: {
            organizationId: invitation.organizationId,
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear()
          }
        },
        update: {
          users: {
            increment: 1
          }
        },
        create: {
          organizationId: invitation.organizationId,
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
          users: 1
        }
      })
    ]);

    // Log activity
    await prisma.activity.create({
      data: {
        organizationId: invitation.organizationId,
        userId: session.user.id,
        action: 'member_joined',
        metadata: {
          role: invitation.role,
          invitationId: invitation.id
        }
      }
    });

    res.status(200).json({ 
      member,
      message: 'Successfully joined organization'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: error.errors
      });
    }
    
    console.error('Error accepting invitation:', error);
    res.status(500).json({ error: 'Failed to accept invitation' });
  }
}

async function getInvitations(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const { organizationId } = req.query;

  if (!organizationId || typeof organizationId !== 'string') {
    return res.status(400).json({ error: 'Organization ID is required' });
  }

  try {
    // Check permissions
    const hasAccess = await hasPermission(session.user.id, organizationId, ['OWNER', 'ADMIN']);
    
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const invitations = await prisma.organizationInvitation.findMany({
      where: { 
        organizationId,
        status: 'PENDING'
      },
      include: {
        inviter: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({ invitations });
  } catch (error) {
    console.error('Error fetching invitations:', error);
    res.status(500).json({ error: 'Failed to fetch invitations' });
  }
}

async function updateMember(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const { organizationId, memberId } = req.query;

  if (!organizationId || typeof organizationId !== 'string') {
    return res.status(400).json({ error: 'Organization ID is required' });
  }

  if (!memberId || typeof memberId !== 'string') {
    return res.status(400).json({ error: 'Member ID is required' });
  }

  try {
    const validatedData = updateMemberSchema.parse(req.body);
    const { role, permissions } = validatedData;

    // Check permissions
    const hasAccess = await hasPermission(session.user.id, organizationId, ['OWNER', 'ADMIN']);
    
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get current member
    const member = await prisma.organizationMember.findUnique({
      where: { id: memberId },
      include: {
        user: true
      }
    });

    if (!member || member.organizationId !== organizationId) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // Prevent changing owner role
    if (member.role === 'OWNER') {
      return res.status(400).json({ error: 'Cannot change role of organization owner' });
    }

    // Check if user is trying to assign owner role
    if (role === 'OWNER') {
      const userMembership = await getUserMembership(session.user.id, organizationId);
      if (userMembership?.role !== 'OWNER') {
        return res.status(403).json({ error: 'Only owners can assign owner role' });
      }
    }

    // Update member
    const updatedMember = await prisma.organizationMember.update({
      where: { id: memberId },
      data: {
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

    // Log activity
    await prisma.activity.create({
      data: {
        organizationId,
        userId: session.user.id,
        action: 'member_updated',
        target: 'user',
        targetId: member.userId,
        metadata: {
          oldRole: member.role,
          newRole: role,
          memberName: member.user.name,
          memberEmail: member.user.email
        }
      }
    });

    res.status(200).json({ 
      member: updatedMember,
      message: 'Member updated successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: error.errors
      });
    }
    
    console.error('Error updating member:', error);
    res.status(500).json({ error: 'Failed to update member' });
  }
}

async function removeMember(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const { organizationId, memberId } = req.query;

  if (!organizationId || typeof organizationId !== 'string') {
    return res.status(400).json({ error: 'Organization ID is required' });
  }

  if (!memberId || typeof memberId !== 'string') {
    return res.status(400).json({ error: 'Member ID is required' });
  }

  try {
    // Check permissions
    const hasAccess = await hasPermission(session.user.id, organizationId, ['OWNER', 'ADMIN']);
    
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get member to remove
    const member = await prisma.organizationMember.findUnique({
      where: { id: memberId },
      include: {
        user: true
      }
    });

    if (!member || member.organizationId !== organizationId) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // Prevent removing owner
    if (member.role === 'OWNER') {
      return res.status(400).json({ error: 'Cannot remove organization owner' });
    }

    // Prevent removing self unless owner
    const userMembership = await getUserMembership(session.user.id, organizationId);
    if (member.userId === session.user.id && userMembership?.role !== 'OWNER') {
      return res.status(400).json({ error: 'Cannot remove yourself unless you are the owner' });
    }

    // Remove member
    await prisma.organizationMember.delete({
      where: { id: memberId }
    });

    // Update usage
    await prisma.usage.updateMany({
      where: {
        organizationId,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
      },
      data: {
        users: {
          decrement: 1
        }
      }
    });

    // Log activity
    await prisma.activity.create({
      data: {
        organizationId,
        userId: session.user.id,
        action: 'member_removed',
        target: 'user',
        targetId: member.userId,
        metadata: {
          memberName: member.user.name,
          memberEmail: member.user.email,
          role: member.role
        }
      }
    });

    res.status(200).json({ 
      message: 'Member removed successfully'
    });
  } catch (error) {
    console.error('Error removing member:', error);
    res.status(500).json({ error: 'Failed to remove member' });
  }
}

async function cancelInvitation(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const { organizationId, invitationId } = req.query;

  if (!organizationId || typeof organizationId !== 'string') {
    return res.status(400).json({ error: 'Organization ID is required' });
  }

  if (!invitationId || typeof invitationId !== 'string') {
    return res.status(400).json({ error: 'Invitation ID is required' });
  }

  try {
    // Check permissions
    const hasAccess = await hasPermission(session.user.id, organizationId, ['OWNER', 'ADMIN']);
    
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get invitation
    const invitation = await prisma.organizationInvitation.findUnique({
      where: { id: invitationId }
    });

    if (!invitation || invitation.organizationId !== organizationId) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    if (invitation.status !== 'PENDING') {
      return res.status(400).json({ error: 'Invitation is not pending' });
    }

    // Cancel invitation
    await prisma.organizationInvitation.update({
      where: { id: invitationId },
      data: {
        status: 'CANCELLED'
      }
    });

    // Log activity
    await prisma.activity.create({
      data: {
        organizationId,
        userId: session.user.id,
        action: 'invitation_cancelled',
        metadata: {
          email: invitation.email,
          invitationId
        }
      }
    });

    res.status(200).json({ 
      message: 'Invitation cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling invitation:', error);
    res.status(500).json({ error: 'Failed to cancel invitation' });
  }
}