import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const createTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(200, 'Title too long'),
  description: z.string().max(5000, 'Description too long').optional(),
  
  // Classification
  type: z.enum(['EPIC', 'STORY', 'TASK', 'BUG', 'IMPROVEMENT', 'RESEARCH', 'SPIKE', 'SUB_TASK']).default('TASK'),
  priority: z.enum(['LOWEST', 'LOW', 'MEDIUM', 'HIGH', 'HIGHEST']).default('MEDIUM'),
  
  // Assignment
  assigneeId: z.string().optional(),
  categoryId: z.string().optional(),
  labelIds: z.array(z.string()).optional(),
  
  // Planning
  sprintId: z.string().optional(),
  epicId: z.string().optional(),
  
  // Time tracking
  estimatedHours: z.number().min(0).optional(),
  storyPoints: z.number().min(0).optional(),
  
  // Dates
  startDate: z.string().datetime().optional(),
  dueDate: z.string().datetime().optional(),
  
  // Business fields
  businessValue: z.number().min(0).optional(),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('LOW'),
  
  // Technical fields
  environment: z.string().optional(),
  version: z.string().optional(),
  
  // Custom fields
  customFields: z.record(z.any()).optional()
});

const updateTaskSchema = createTaskSchema.partial().extend({
  status: z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'TESTING', 'DONE', 'CANCELLED', 'BLOCKED']).optional(),
  resolution: z.enum(['FIXED', 'WONT_FIX', 'DUPLICATE', 'INCOMPLETE', 'CANNOT_REPRODUCE', 'DONE']).optional()
});

const assignTaskSchema = z.object({
  assigneeId: z.string(),
  reason: z.string().optional()
});

const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(2000, 'Comment too long'),
  isInternal: z.boolean().default(false),
  parentId: z.string().optional()
});

async function hasTaskPermission(userId: string, projectId: string, action: string = 'read') {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      members: {
        where: { userId, isActive: true }
      }
    }
  });

  if (!project) return false;

  // Project owner has all permissions
  if (project.ownerId === userId) return true;

  // Check project membership
  const member = project.members[0];
  if (!member) return false;

  switch (action) {
    case 'read':
      return true;
    case 'create':
    case 'update':
      return ['OWNER', 'ADMIN', 'MANAGER', 'DEVELOPER'].includes(member.role);
    case 'delete':
      return ['OWNER', 'ADMIN', 'MANAGER'].includes(member.role);
    case 'assign':
      return ['OWNER', 'ADMIN', 'MANAGER'].includes(member.role);
    default:
      return false;
  }
}

async function generateTaskKey(projectId: string): Promise<string> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { key: true }
  });

  if (!project) throw new Error('Project not found');

  // Get the next task number for this project
  const lastTask = await prisma.task.findFirst({
    where: {
      projectId,
      key: {
        startsWith: project.key + '-'
      }
    },
    orderBy: {
      key: 'desc'
    }
  });

  let nextNumber = 1;
  if (lastTask) {
    const lastNumber = parseInt(lastTask.key.split('-')[1] || '0');
    nextNumber = lastNumber + 1;
  }

  return `${project.key}-${nextNumber}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession({ req });
    
    if (!session?.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { projectId, action } = req.query;

    if (!projectId || typeof projectId !== 'string') {
      return res.status(400).json({ error: 'Project ID is required' });
    }

    const { method } = req;

    // Handle specific actions
    if (action === 'assign' && method === 'POST') {
      return await assignTask(req, res, projectId);
    } else if (action === 'comment' && method === 'POST') {
      return await addComment(req, res, projectId);
    } else if (action === 'watch' && method === 'POST') {
      return await watchTask(req, res, projectId);
    }

    switch (method) {
      case 'GET':
        return await getTasks(req, res, projectId);

      case 'POST':
        return await createTask(req, res, projectId);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end('Method Not Allowed');
    }
  } catch (error) {
    console.error('Tasks API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}

async function getTasks(req: NextApiRequest, res: NextApiResponse, projectId: string) {
  const session = await getSession({ req });
  const { 
    status,
    type,
    priority,
    assigneeId,
    sprintId,
    categoryId,
    search,
    limit = '50',
    page = '1',
    sortBy = 'createdAt',
    sortOrder = 'desc',
    includeSubtasks = 'false'
  } = req.query;

  try {
    // Check permissions
    const hasAccess = await hasTaskPermission(session.user.id, projectId, 'read');
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    // Build where clause
    const whereClause: any = {
      projectId
    };

    if (includeSubtasks === 'false') {
      whereClause.type = { not: 'SUB_TASK' };
    }

    if (status && status !== 'ALL') {
      whereClause.status = status;
    }

    if (type) {
      whereClause.type = type;
    }

    if (priority) {
      whereClause.priority = priority;
    }

    if (assigneeId) {
      whereClause.assigneeId = assigneeId === 'unassigned' ? null : assigneeId;
    }

    if (sprintId) {
      whereClause.sprintId = sprintId === 'backlog' ? null : sprintId;
    }

    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    if (search && typeof search === 'string') {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { key: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get tasks with comprehensive data
    const tasks = await prisma.task.findMany({
      where: whereClause,
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        reporter: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        category: true,
        labels: true,
        sprint: {
          select: {
            id: true,
            name: true,
            status: true,
            startDate: true,
            endDate: true
          }
        },
        epic: {
          select: {
            id: true,
            key: true,
            title: true,
            status: true
          }
        },
        subtasks: {
          select: {
            id: true,
            key: true,
            title: true,
            status: true,
            priority: true,
            assignee: {
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
            comments: true,
            attachments: true,
            watchers: true,
            subtasks: true
          }
        }
      },
      orderBy: {
        [sortBy as string]: sortOrder
      },
      skip: offset,
      take: limitNum
    });

    // Get total count
    const total = await prisma.task.count({
      where: whereClause
    });

    res.status(200).json({
      tasks,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
}

async function createTask(req: NextApiRequest, res: NextApiResponse, projectId: string) {
  const session = await getSession({ req });

  try {
    // Check permissions
    const hasAccess = await hasTaskPermission(session.user.id, projectId, 'create');
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const validatedData = createTaskSchema.parse(req.body);

    // Generate unique task key
    const taskKey = await generateTaskKey(projectId);

    // Validate assignee if provided
    if (validatedData.assigneeId) {
      const assignee = await prisma.projectMember.findFirst({
        where: {
          projectId,
          userId: validatedData.assigneeId,
          isActive: true
        }
      });

      if (!assignee) {
        return res.status(400).json({ error: 'Assignee is not a project member' });
      }
    }

    // Validate category if provided
    if (validatedData.categoryId) {
      const category = await prisma.taskCategory.findFirst({
        where: {
          id: validatedData.categoryId,
          projectId
        }
      });

      if (!category) {
        return res.status(400).json({ error: 'Invalid category' });
      }
    }

    // Validate epic if provided
    if (validatedData.epicId) {
      const epic = await prisma.task.findFirst({
        where: {
          id: validatedData.epicId,
          projectId,
          type: 'EPIC'
        }
      });

      if (!epic) {
        return res.status(400).json({ error: 'Invalid epic' });
      }
    }

    // Create the task
    const task = await prisma.task.create({
      data: {
        ...validatedData,
        key: taskKey,
        projectId,
        reporterId: session.user.id,
        startDate: validatedData.startDate ? new Date(validatedData.startDate) : undefined,
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : undefined
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        reporter: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        category: true,
        labels: true,
        sprint: true,
        epic: {
          select: {
            id: true,
            key: true,
            title: true
          }
        }
      }
    });

    // Add labels if provided
    if (validatedData.labelIds && validatedData.labelIds.length > 0) {
      await prisma.task.update({
        where: { id: task.id },
        data: {
          labels: {
            connect: validatedData.labelIds.map(id => ({ id }))
          }
        }
      });
    }

    // Add creator as watcher
    await prisma.taskWatcher.create({
      data: {
        taskId: task.id,
        userId: session.user.id
      }
    });

    // Add assignee as watcher if different from creator
    if (validatedData.assigneeId && validatedData.assigneeId !== session.user.id) {
      await prisma.taskWatcher.create({
        data: {
          taskId: task.id,
          userId: validatedData.assigneeId
        }
      });
    }

    // Log task creation activity
    await prisma.projectActivity.create({
      data: {
        projectId,
        userId: session.user.id,
        action: 'task_created',
        entityType: 'task',
        entityId: task.id,
        description: `Task "${task.title}" (${task.key}) was created`,
        metadata: {
          taskId: task.id,
          taskKey: task.key,
          taskType: task.type
        }
      }
    });

    // Log task history
    await prisma.taskHistory.create({
      data: {
        taskId: task.id,
        changedById: session.user.id,
        field: 'created',
        newValue: 'Task created',
        description: `Task ${task.key} was created`
      }
    });

    res.status(201).json({
      task,
      message: 'Task created successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    }

    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
}

async function assignTask(req: NextApiRequest, res: NextApiResponse, projectId: string) {
  const session = await getSession({ req });
  const { taskId } = req.query;

  if (!taskId || typeof taskId !== 'string') {
    return res.status(400).json({ error: 'Task ID is required' });
  }

  try {
    // Check permissions
    const hasAccess = await hasTaskPermission(session.user.id, projectId, 'assign');
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const validatedData = assignTaskSchema.parse(req.body);

    // Verify task belongs to project
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        projectId
      },
      include: {
        assignee: {
          select: { id: true, name: true }
        }
      }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Verify assignee is project member
    const assignee = await prisma.projectMember.findFirst({
      where: {
        projectId,
        userId: validatedData.assigneeId,
        isActive: true
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

    if (!assignee) {
      return res.status(400).json({ error: 'Assignee is not a project member' });
    }

    const previousAssigneeId = task.assigneeId;

    // Update task assignment
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        assigneeId: validatedData.assigneeId
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    });

    // Add assignee as watcher
    await prisma.taskWatcher.upsert({
      where: {
        taskId_userId: {
          taskId,
          userId: validatedData.assigneeId
        }
      },
      update: {},
      create: {
        taskId,
        userId: validatedData.assigneeId
      }
    });

    // Log assignment change
    await prisma.taskHistory.create({
      data: {
        taskId,
        changedById: session.user.id,
        field: 'assignee',
        oldValue: previousAssigneeId || 'Unassigned',
        newValue: validatedData.assigneeId,
        description: `Task assigned to ${assignee.user.name}`
      }
    });

    // Log activity
    await prisma.projectActivity.create({
      data: {
        projectId,
        userId: session.user.id,
        action: 'task_assigned',
        entityType: 'task',
        entityId: taskId,
        description: `Task ${task.key} assigned to ${assignee.user.name}`,
        metadata: {
          taskId,
          taskKey: task.key,
          assigneeId: validatedData.assigneeId,
          assigneeName: assignee.user.name,
          reason: validatedData.reason
        }
      }
    });

    res.status(200).json({
      task: updatedTask,
      message: 'Task assigned successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    }

    console.error('Error assigning task:', error);
    res.status(500).json({ error: 'Failed to assign task' });
  }
}

async function addComment(req: NextApiRequest, res: NextApiResponse, projectId: string) {
  const session = await getSession({ req });
  const { taskId } = req.query;

  if (!taskId || typeof taskId !== 'string') {
    return res.status(400).json({ error: 'Task ID is required' });
  }

  try {
    // Check permissions
    const hasAccess = await hasTaskPermission(session.user.id, projectId, 'read');
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const validatedData = commentSchema.parse(req.body);

    // Verify task exists
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        projectId
      }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Verify parent comment if specified
    if (validatedData.parentId) {
      const parentComment = await prisma.taskComment.findFirst({
        where: {
          id: validatedData.parentId,
          taskId
        }
      });

      if (!parentComment) {
        return res.status(400).json({ error: 'Parent comment not found' });
      }
    }

    // Create comment
    const comment = await prisma.taskComment.create({
      data: {
        taskId,
        authorId: session.user.id,
        content: validatedData.content,
        isInternal: validatedData.isInternal,
        parentId: validatedData.parentId
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        replies: {
          include: {
            author: {
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

    // Add commenter as watcher
    await prisma.taskWatcher.upsert({
      where: {
        taskId_userId: {
          taskId,
          userId: session.user.id
        }
      },
      update: {},
      create: {
        taskId,
        userId: session.user.id
      }
    });

    // Log activity
    await prisma.projectActivity.create({
      data: {
        projectId,
        userId: session.user.id,
        action: 'comment_added',
        entityType: 'task',
        entityId: taskId,
        description: `Comment added to task ${task.key}`,
        metadata: {
          taskId,
          taskKey: task.key,
          commentId: comment.id,
          isInternal: validatedData.isInternal
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

async function watchTask(req: NextApiRequest, res: NextApiResponse, projectId: string) {
  const session = await getSession({ req });
  const { taskId, action: watchAction } = req.query;

  if (!taskId || typeof taskId !== 'string') {
    return res.status(400).json({ error: 'Task ID is required' });
  }

  try {
    // Check permissions
    const hasAccess = await hasTaskPermission(session.user.id, projectId, 'read');
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Verify task exists
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        projectId
      }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (watchAction === 'unwatch') {
      // Remove watcher
      await prisma.taskWatcher.deleteMany({
        where: {
          taskId,
          userId: session.user.id
        }
      });

      res.status(200).json({ message: 'Successfully unwatched task' });
    } else {
      // Add watcher
      await prisma.taskWatcher.upsert({
        where: {
          taskId_userId: {
            taskId,
            userId: session.user.id
          }
        },
        update: {},
        create: {
          taskId,
          userId: session.user.id
        }
      });

      res.status(200).json({ message: 'Successfully watching task' });
    }
  } catch (error) {
    console.error('Error watching task:', error);
    res.status(500).json({ error: 'Failed to watch task' });
  }
}