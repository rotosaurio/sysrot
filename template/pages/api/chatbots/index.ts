import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const createChatbotSchema = z.object({
  name: z.string().min(1, 'Chatbot name is required').max(100, 'Name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  avatar: z.string().url().optional(),
  
  // AI Configuration
  model: z.enum(['gpt-4o', 'claude-3-5-sonnet', 'gemini-flash-pro', 'deepseek-r1']).default('gpt-4o'),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().min(50).max(4000).default(1000),
  systemPrompt: z.string().min(10, 'System prompt is required').max(2000, 'System prompt too long'),
  
  // Behavior settings
  personality: z.record(z.any()).optional(),
  capabilities: z.array(z.string()).default([]),
  restrictions: z.array(z.string()).default([]),
  languages: z.array(z.string()).default(['en']),
  
  // Integration settings
  isPublic: z.boolean().default(false),
  isEmbeddable: z.boolean().default(true),
  webhookUrl: z.string().url().optional(),
  fallbackMessage: z.string().optional(),
  
  // Business settings
  businessHours: z.record(z.any()).optional(),
  autoAssign: z.boolean().default(false),
  maxConversations: z.number().min(1).max(1000).optional(),
  
  organizationId: z.string().optional()
});

const updateChatbotSchema = createChatbotSchema.partial();

async function hasPermission(userId: string, organizationId?: string, action: string = 'read') {
  if (!organizationId) return true; // Public chatbots

  const membership = await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId,
        userId
      }
    }
  });

  if (!membership) return false;

  // Permission logic based on role and action
  switch (action) {
    case 'create':
    case 'update':
    case 'delete':
      return ['OWNER', 'ADMIN'].includes(membership.role);
    case 'read':
      return true; // All members can read
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
        return await getChatbots(req, res);

      case 'POST':
        return await createChatbot(req, res);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end('Method Not Allowed');
    }
  } catch (error) {
    console.error('Chatbots API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}

async function getChatbots(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const { organizationId, includePublic = 'false', limit = '20', page = '1' } = req.query;

  try {
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    // Build where clause
    const whereClause: any = {
      OR: []
    };

    // User's own chatbots
    whereClause.OR.push({
      createdBy: session.user.id
    });

    // Organization chatbots if user has access
    if (organizationId && typeof organizationId === 'string') {
      const hasAccess = await hasPermission(session.user.id, organizationId, 'read');
      if (hasAccess) {
        whereClause.OR.push({
          organizationId
        });
      }
    }

    // Public chatbots if requested
    if (includePublic === 'true') {
      whereClause.OR.push({
        isPublic: true,
        isActive: true
      });
    }

    // Get chatbots with analytics
    const chatbots = await prisma.chatbot.findMany({
      where: whereClause,
      include: {
        creator: {
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
        _count: {
          select: {
            conversations: true,
            knowledgeItems: true,
            intents: true
          }
        },
        analytics: {
          where: {
            date: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
            },
            period: 'DAY'
          },
          orderBy: {
            date: 'desc'
          },
          take: 7 // Last 7 days
        }
      },
      orderBy: [
        { isActive: 'desc' },
        { updatedAt: 'desc' }
      ],
      skip: offset,
      take: limitNum
    });

    // Calculate summary stats for each chatbot
    const enrichedChatbots = chatbots.map(chatbot => {
      const recentAnalytics = chatbot.analytics;
      const totalConversations = recentAnalytics.reduce((sum, a) => sum + a.conversationsStarted, 0);
      const totalMessages = recentAnalytics.reduce((sum, a) => sum + a.messagesReceived, 0);
      const avgRating = recentAnalytics.length > 0 
        ? recentAnalytics.reduce((sum, a) => sum + a.averageRating, 0) / recentAnalytics.length 
        : 0;

      return {
        ...chatbot,
        analytics: undefined, // Remove from response
        stats: {
          totalConversations,
          totalMessages,
          averageRating: avgRating,
          knowledgeItems: chatbot._count.knowledgeItems,
          intents: chatbot._count.intents,
          isTraining: chatbot.isTraining
        }
      };
    });

    // Get total count for pagination
    const total = await prisma.chatbot.count({
      where: whereClause
    });

    res.status(200).json({
      chatbots: enrichedChatbots,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching chatbots:', error);
    res.status(500).json({ error: 'Failed to fetch chatbots' });
  }
}

async function createChatbot(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  try {
    const validatedData = createChatbotSchema.parse(req.body);
    
    // Check organization permissions if specified
    if (validatedData.organizationId) {
      const hasAccess = await hasPermission(session.user.id, validatedData.organizationId, 'create');
      if (!hasAccess) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
    }

    // Check if user has reached chatbot limits
    const userChatbotCount = await prisma.chatbot.count({
      where: {
        createdBy: session.user.id,
        isActive: true
      }
    });

    const maxChatbots = validatedData.organizationId ? 50 : 5; // Higher limit for organizations
    if (userChatbotCount >= maxChatbots) {
      return res.status(400).json({ 
        error: `Maximum chatbot limit reached (${maxChatbots})` 
      });
    }

    // Create the chatbot
    const chatbot = await prisma.chatbot.create({
      data: {
        ...validatedData,
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

    // Create default intents and responses
    await createDefaultIntents(chatbot.id);

    // Initialize analytics
    await prisma.botAnalytics.create({
      data: {
        chatbotId: chatbot.id,
        date: new Date(),
        period: 'DAY'
      }
    });

    res.status(201).json({
      chatbot,
      message: 'Chatbot created successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    }

    console.error('Error creating chatbot:', error);
    res.status(500).json({ error: 'Failed to create chatbot' });
  }
}

// Helper function to create default intents
async function createDefaultIntents(chatbotId: string) {
  const defaultIntents = [
    {
      name: 'greeting',
      description: 'User greetings and hello messages',
      examples: [
        'hello',
        'hi',
        'hey there',
        'good morning',
        'good afternoon',
        'greetings'
      ],
      responses: [
        'Hello! How can I help you today?',
        'Hi there! What can I do for you?',
        'Greetings! I\'m here to assist you.'
      ]
    },
    {
      name: 'goodbye',
      description: 'User farewells and goodbye messages',
      examples: [
        'bye',
        'goodbye',
        'see you later',
        'farewell',
        'talk to you later',
        'have a good day'
      ],
      responses: [
        'Goodbye! Have a great day!',
        'See you later! Feel free to come back anytime.',
        'Take care! I\'ll be here if you need anything.'
      ]
    },
    {
      name: 'help',
      description: 'User requests for help or assistance',
      examples: [
        'help',
        'i need help',
        'can you help me',
        'what can you do',
        'how does this work',
        'assistance needed'
      ],
      responses: [
        'I\'m here to help! You can ask me questions and I\'ll do my best to assist you.',
        'Of course! What would you like help with?',
        'I\'d be happy to help. What do you need assistance with?'
      ]
    },
    {
      name: 'unknown',
      description: 'Fallback for unrecognized inputs',
      examples: [],
      responses: [
        'I\'m not sure I understand. Could you please rephrase that?',
        'I didn\'t quite get that. Can you ask in a different way?',
        'I\'m still learning! Could you clarify what you mean?'
      ]
    }
  ];

  for (const intentData of defaultIntents) {
    // Create intent
    const intent = await prisma.botIntent.create({
      data: {
        chatbotId,
        name: intentData.name,
        description: intentData.description,
        examples: intentData.examples,
        patterns: []
      }
    });

    // Create responses for this intent
    for (const responseText of intentData.responses) {
      await prisma.botResponse.create({
        data: {
          chatbotId,
          intentId: intent.id,
          content: responseText,
          contentType: 'TEXT'
        }
      });
    }
  }
}