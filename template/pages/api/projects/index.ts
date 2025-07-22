import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Name too long'),
  description: z.string().max(2000, 'Description too long').optional(),
  key: z.string().min(2, 'Project key too short').max(10, 'Project key too long').regex(/^[A-Z][A-Z0-9]*$/, 'Key must be uppercase letters and numbers'),
  avatar: z.string().url().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format').optional(),
  
  // Project settings
  projectType: z.enum(['SOFTWARE', 'MARKETING', 'DESIGN', 'RESEARCH', 'BUSINESS', 'PERSONAL', 'OTHER']).default('SOFTWARE'),
  methodology: z.enum(['AGILE', 'SCRUM', 'KANBAN', 'WATERFALL', 'HYBRID', 'CUSTOM']).default('AGILE'),
  visibility: z.enum(['PRIVATE', 'TEAM', 'ORGANIZATION', 'PUBLIC']).default('PRIVATE'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
  
  // Timeline
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  estimatedHours: z.number().min(0).optional(),
  
  // Business
  budget: z.number().min(0).optional(),
  client: z.string().max(100).optional(),
  
  // Organization
  organizationId: z.string().optional(),
  
  // Project template
  template: z.record(z.any()).optional(),
  settings: z.record(z.any()).optional()
});

const updateProjectSchema = createProjectSchema.partial();

async function hasProjectPermission(userId: string, projectId?: string, organizationId?: string, action: string = 'read') {
  // If creating a new project
  if (!projectId && organizationId) {
    const membership = await prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId
        }
      }
    });
    return membership && ['OWNER', 'ADMIN', 'MANAGER'].includes(membership.role);
  }

  // If accessing existing project
  if (projectId) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        members: {
          where: { userId }
        },
        organization: {
          include: {
            members: {
              where: { userId }
            }
          }
        }
      }
    });

    if (!project) return false;

    // Project owner has all permissions
    if (project.ownerId === userId) return true;

    // Check project membership
    const projectMember = project.members[0];
    if (projectMember) {
      switch (action) {
        case 'read':
          return true;
        case 'update':
          return ['OWNER', 'ADMIN', 'MANAGER'].includes(projectMember.role);
        case 'delete':
          return ['OWNER', 'ADMIN'].includes(projectMember.role);
        case 'manage_members':
          return ['OWNER', 'ADMIN', 'MANAGER'].includes(projectMember.role);
        default:
          return false;
      }
    }

    // Check organization membership for organization projects
    if (project.organizationId && project.organization?.members[0]) {
      const orgMember = project.organization.members[0];
      switch (action) {
        case 'read':
          return project.visibility === 'ORGANIZATION' || project.visibility === 'PUBLIC';
        case 'update':
        case 'delete':
          return ['OWNER', 'ADMIN'].includes(orgMember.role);
        default:
          return false;
      }
    }

    // Public projects are readable by everyone
    if (project.visibility === 'PUBLIC' && action === 'read') {
      return true;
    }
  }

  return false;
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
        return await getProjects(req, res);

      case 'POST':
        return await createProject(req, res);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end('Method Not Allowed');
    }
  } catch (error) {
    console.error('Projects API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}

async function getProjects(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const { 
    organizationId, 
    status = 'ACTIVE',
    type,
    visibility,
    limit = '20', 
    page = '1',
    search,
    sortBy = 'updatedAt',
    sortOrder = 'desc'
  } = req.query;

  try {
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    // Build where clause
    const whereClause: any = {
      OR: [
        // User's own projects
        { ownerId: session.user.id },
        // Projects where user is a member
        { 
          members: {
            some: {
              userId: session.user.id,
              isActive: true
            }
          }
        }
      ]
    };

    // Add filters
    if (status && status !== 'ALL') {
      whereClause.status = status;
    }

    if (type) {
      whereClause.projectType = type;
    }

    if (visibility) {
      whereClause.visibility = visibility;
    }

    if (organizationId && typeof organizationId === 'string') {
      whereClause.organizationId = organizationId;
    }

    if (search && typeof search === 'string') {
      whereClause.OR = [
        ...whereClause.OR,
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { key: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get projects with comprehensive data
    const projects = await prisma.project.findMany({
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
        organization: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        members: {
          where: { isActive: true },
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
          take: 10
        },
        _count: {
          select: {
            tasks: true,
            sprints: true,
            milestones: true,
            timeEntries: true
          }
        }
      },
      orderBy: {
        [sortBy as string]: sortOrder
      },
      skip: offset,
      take: limitNum
    });

    // Calculate project statistics
    const enrichedProjects = await Promise.all(
      projects.map(async (project) => {
        // Get task statistics
        const taskStats = await prisma.task.groupBy({
          by: ['status'],
          where: { projectId: project.id },
          _count: true
        });

        const tasksByStatus = taskStats.reduce((acc: any, stat) => {
          acc[stat.status.toLowerCase()] = stat._count;
          return acc;
        }, {});

        // Get recent activity count
        const recentActivityCount = await prisma.projectActivity.count({
          where: {
            projectId: project.id,
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
            }
          }
        });

        // Calculate progress
        const totalTasks = Object.values(tasksByStatus).reduce((sum: number, count: any) => sum + count, 0);
        const completedTasks = tasksByStatus.done || 0;
        const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        return {
          ...project,
          stats: {
            totalTasks,
            completedTasks,
            progress,
            tasksByStatus,
            totalMembers: project.members.length,
            recentActivity: recentActivityCount,
            totalSprints: project._count.sprints,
            totalMilestones: project._count.milestones,
            totalTimeEntries: project._count.timeEntries
          }
        };
      })
    );

    // Get total count for pagination
    const total = await prisma.project.count({
      where: whereClause
    });

    res.status(200).json({
      projects: enrichedProjects,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
}

async function createProject(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  try {
    const validatedData = createProjectSchema.parse(req.body);
    
    // Check organization permissions if specified
    if (validatedData.organizationId) {
      const hasAccess = await hasProjectPermission(session.user.id, undefined, validatedData.organizationId, 'create');
      if (!hasAccess) {
        return res.status(403).json({ error: 'Insufficient permissions to create project in this organization' });
      }
    }

    // Check if project key is unique
    const existingProject = await prisma.project.findUnique({
      where: { key: validatedData.key }
    });

    if (existingProject) {
      return res.status(400).json({ error: 'Project key already exists' });
    }

    // Check user project limits
    const userProjectCount = await prisma.project.count({
      where: {
        ownerId: session.user.id,
        status: { not: 'ARCHIVED' }
      }
    });

    const maxProjects = validatedData.organizationId ? 100 : 10; // Higher limit for organizations
    if (userProjectCount >= maxProjects) {
      return res.status(400).json({ 
        error: `Maximum project limit reached (${maxProjects})` 
      });
    }

    // Create the project
    const project = await prisma.project.create({
      data: {
        ...validatedData,
        ownerId: session.user.id,
        startDate: validatedData.startDate ? new Date(validatedData.startDate) : undefined,
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : undefined
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        organization: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    });

    // Add creator as project owner
    await prisma.projectMember.create({
      data: {
        projectId: project.id,
        userId: session.user.id,
        role: 'OWNER'
      }
    });

    // Create default workflow if methodology is specified
    if (validatedData.methodology) {
      await createDefaultWorkflow(project.id, validatedData.methodology);
    }

    // Create default categories and labels
    await createDefaultProjectStructure(project.id, validatedData.projectType);

    // Log project creation activity
    await prisma.projectActivity.create({
      data: {
        projectId: project.id,
        userId: session.user.id,
        action: 'project_created',
        entityType: 'project',
        entityId: project.id,
        description: `Project "${project.name}" was created`
      }
    });

    res.status(201).json({
      project,
      message: 'Project created successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    }

    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
}

// Helper function to create default workflow
async function createDefaultWorkflow(projectId: string, methodology: string) {
  const workflowConfigs: Record<string, any> = {
    AGILE: {
      steps: ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'TESTING', 'DONE'],
      transitions: [
        { from: 'TODO', to: 'IN_PROGRESS' },
        { from: 'IN_PROGRESS', to: 'IN_REVIEW' },
        { from: 'IN_REVIEW', to: 'TESTING' },
        { from: 'TESTING', to: 'DONE' },
        { from: 'IN_REVIEW', to: 'IN_PROGRESS' },
        { from: 'TESTING', to: 'IN_REVIEW' }
      ]
    },
    KANBAN: {
      steps: ['TODO', 'IN_PROGRESS', 'DONE'],
      transitions: [
        { from: 'TODO', to: 'IN_PROGRESS' },
        { from: 'IN_PROGRESS', to: 'DONE' },
        { from: 'IN_PROGRESS', to: 'TODO' }
      ]
    },
    SCRUM: {
      steps: ['BACKLOG', 'SPRINT_PLANNING', 'IN_PROGRESS', 'IN_REVIEW', 'TESTING', 'DONE'],
      transitions: [
        { from: 'BACKLOG', to: 'SPRINT_PLANNING' },
        { from: 'SPRINT_PLANNING', to: 'IN_PROGRESS' },
        { from: 'IN_PROGRESS', to: 'IN_REVIEW' },
        { from: 'IN_REVIEW', to: 'TESTING' },
        { from: 'TESTING', to: 'DONE' }
      ]
    }
  };

  const config = workflowConfigs[methodology] || workflowConfigs.AGILE;

  await prisma.workflow.create({
    data: {
      projectId,
      name: `${methodology} Workflow`,
      description: `Default ${methodology.toLowerCase()} workflow`,
      config,
      isDefault: true,
      isActive: true
    }
  });
}

// Helper function to create default project structure
async function createDefaultProjectStructure(projectId: string, projectType: string) {
  const categoryConfigs: Record<string, any[]> = {
    SOFTWARE: [
      { name: 'Frontend', description: 'Frontend development tasks', color: '#3B82F6', icon: '🎨' },
      { name: 'Backend', description: 'Backend development tasks', color: '#10B981', icon: '⚙️' },
      { name: 'DevOps', description: 'DevOps and infrastructure tasks', color: '#F59E0B', icon: '🚀' },
      { name: 'Testing', description: 'Testing and QA tasks', color: '#EF4444', icon: '🧪' },
      { name: 'Documentation', description: 'Documentation tasks', color: '#8B5CF6', icon: '📚' }
    ],
    MARKETING: [
      { name: 'Content', description: 'Content creation and marketing', color: '#EC4899', icon: '✍️' },
      { name: 'Social Media', description: 'Social media management', color: '#3B82F6', icon: '📱' },
      { name: 'SEO', description: 'Search engine optimization', color: '#10B981', icon: '🔍' },
      { name: 'Analytics', description: 'Marketing analytics and reporting', color: '#F59E0B', icon: '📊' }
    ],
    DESIGN: [
      { name: 'UI Design', description: 'User interface design', color: '#3B82F6', icon: '🎨' },
      { name: 'UX Research', description: 'User experience research', color: '#10B981', icon: '🔬' },
      { name: 'Prototyping', description: 'Prototyping and wireframing', color: '#F59E0B', icon: '🖼️' },
      { name: 'Branding', description: 'Brand identity and guidelines', color: '#EF4444', icon: '🎯' }
    ]
  };

  const categories = categoryConfigs[projectType] || categoryConfigs.SOFTWARE;
  
  for (const category of categories) {
    await prisma.taskCategory.create({
      data: {
        projectId,
        ...category
      }
    });
  }

  // Create default labels
  const defaultLabels = [
    { name: 'urgent', color: '#EF4444' },
    { name: 'bug', color: '#F59E0B' },
    { name: 'feature', color: '#10B981' },
    { name: 'enhancement', color: '#3B82F6' },
    { name: 'research', color: '#8B5CF6' }
  ];

  for (const label of defaultLabels) {
    await prisma.taskLabel.create({
      data: {
        projectId,
        ...label
      }
    });
  }
}