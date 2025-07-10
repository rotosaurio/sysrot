import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

// Validation schemas
const startConversationSchema = z.object({
  visitorId: z.string().optional(),
  visitorInfo: z.record(z.any()).optional(),
  source: z.string().optional(),
  referrer: z.string().optional(),
  userAgent: z.string().optional(),
  ipAddress: z.string().optional(),
  location: z.record(z.any()).optional(),
  customFields: z.record(z.any()).optional()
});

const sendMessageSchema = z.object({
  content: z.string().min(1, 'Message content is required').max(4000, 'Message too long'),
  contentType: z.enum(['TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'FILE']).default('TEXT'),
  metadata: z.record(z.any()).optional(),
  visitorId: z.string().optional()
});

const rateConversationSchema = z.object({
  rating: z.number().min(1).max(5),
  feedback: z.string().max(1000).optional(),
  categories: z.record(z.any()).optional(),
  messageId: z.string().optional()
});

async function getChatbotAccess(chatbotId: string, userId?: string) {
  const chatbot = await prisma.chatbot.findUnique({
    where: { id: chatbotId },
    include: {
      organization: true
    }
  });

  if (!chatbot || !chatbot.isActive) {
    return { hasAccess: false, chatbot: null };
  }

  // Public chatbots are accessible to everyone
  if (chatbot.isPublic) {
    return { hasAccess: true, chatbot };
  }

  // Check if user has access to this chatbot
  if (!userId) {
    return { hasAccess: false, chatbot: null };
  }

  // Owner has access
  if (chatbot.createdBy === userId) {
    return { hasAccess: true, chatbot };
  }

  // Organization members have access
  if (chatbot.organizationId) {
    const membership = await prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId: chatbot.organizationId,
          userId
        }
      }
    });

    if (membership) {
      return { hasAccess: true, chatbot };
    }
  }

  return { hasAccess: false, chatbot: null };
}

// Simple intent matching function
async function matchIntent(chatbotId: string, userMessage: string) {
  const intents = await prisma.botIntent.findMany({
    where: {
      chatbotId,
      isEnabled: true
    },
    include: {
      responses: {
        where: { isEnabled: true },
        orderBy: { weight: 'desc' }
      }
    }
  });

  const normalizedMessage = userMessage.toLowerCase().trim();
  
  // Try to match with examples
  for (const intent of intents) {
    for (const example of intent.examples) {
      if (normalizedMessage.includes(example.toLowerCase())) {
        return {
          intent: intent.name,
          confidence: 0.8,
          response: intent.responses[0]?.content || null
        };
      }
    }

    // Try to match with patterns (simple regex)
    for (const pattern of intent.patterns) {
      try {
        const regex = new RegExp(pattern, 'i');
        if (regex.test(normalizedMessage)) {
          return {
            intent: intent.name,
            confidence: 0.9,
            response: intent.responses[0]?.content || null
          };
        }
      } catch (error) {
        console.warn('Invalid regex pattern:', pattern);
      }
    }
  }

  // Fallback to unknown intent
  const unknownIntent = intents.find(i => i.name === 'unknown');
  return {
    intent: 'unknown',
    confidence: 0.1,
    response: unknownIntent?.responses[0]?.content || "I'm not sure how to help with that."
  };
}

// Generate AI response using existing AI API
async function generateAIResponse(chatbot: any, conversationHistory: any[], userMessage: string) {
  try {
    // Build conversation context
    const contextMessages = conversationHistory.slice(-10).map(msg => ({
      role: msg.role === 'USER' ? 'user' : 'assistant',
      content: msg.content
    }));

    // Add current user message
    contextMessages.push({
      role: 'user',
      content: userMessage
    });

    // Call the AI API
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/ai`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: contextMessages,
        model: chatbot.model,
        temperature: chatbot.temperature,
        max_tokens: chatbot.maxTokens,
        system: chatbot.systemPrompt
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get AI response');
    }

    const data = await response.json();
    return {
      content: data.response || data.text || "I apologize, but I couldn't process your request right now.",
      tokensUsed: data.usage?.total_tokens || 0,
      model: chatbot.model
    };
  } catch (error) {
    console.error('AI Response error:', error);
    
    // Fallback to intent-based response
    const intentMatch = await matchIntent(chatbot.id, userMessage);
    return {
      content: intentMatch.response || "I'm having trouble right now. Please try again later.",
      tokensUsed: 0,
      model: 'fallback',
      intent: intentMatch.intent,
      confidence: intentMatch.confidence
    };
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { chatbotId, action } = req.query;
    const session = await getSession({ req });

    if (!chatbotId || typeof chatbotId !== 'string') {
      return res.status(400).json({ error: 'Chatbot ID is required' });
    }

    // Check chatbot access
    const { hasAccess, chatbot } = await getChatbotAccess(chatbotId, session?.user?.id);
    
    if (!hasAccess || !chatbot) {
      return res.status(403).json({ error: 'Access denied or chatbot not found' });
    }

    const { method } = req;

    if (action === 'start' && method === 'POST') {
      return await startConversation(req, res, chatbot);
    } else if (action === 'message' && method === 'POST') {
      return await sendMessage(req, res, chatbot);
    } else if (action === 'rate' && method === 'POST') {
      return await rateConversation(req, res);
    }

    switch (method) {
      case 'GET':
        return await getConversations(req, res, chatbot);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end('Method Not Allowed');
    }
  } catch (error) {
    console.error('Chatbot conversations API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}

async function getConversations(req: NextApiRequest, res: NextApiResponse, chatbot: any) {
  const session = await getSession({ req });
  const { limit = '20', page = '1', status, userId } = req.query;

  try {
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    const whereClause: any = {
      chatbotId: chatbot.id
    };

    if (status && typeof status === 'string') {
      whereClause.status = status.toUpperCase();
    }

    if (userId && typeof userId === 'string') {
      whereClause.userId = userId;
    }

    const conversations = await prisma.botConversation.findMany({
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
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            conversation: false
          }
        },
        ratings: {
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        _count: {
          select: {
            messages: true
          }
        }
      },
      orderBy: {
        lastMessageAt: 'desc'
      },
      skip: offset,
      take: limitNum
    });

    const total = await prisma.botConversation.count({
      where: whereClause
    });

    res.status(200).json({
      conversations,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
}

async function startConversation(req: NextApiRequest, res: NextApiResponse, chatbot: any) {
  const session = await getSession({ req });

  try {
    const validatedData = startConversationSchema.parse(req.body);

    // Check conversation limits
    if (chatbot.maxConversations) {
      const activeConversations = await prisma.botConversation.count({
        where: {
          chatbotId: chatbot.id,
          status: 'ACTIVE'
        }
      });

      if (activeConversations >= chatbot.maxConversations) {
        return res.status(429).json({ 
          error: 'Maximum active conversations reached',
          fallbackMessage: chatbot.fallbackMessage
        });
      }
    }

    // Create conversation
    const conversation = await prisma.botConversation.create({
      data: {
        chatbotId: chatbot.id,
        userId: session?.user?.id,
        visitorId: validatedData.visitorId || uuidv4(),
        visitorInfo: validatedData.visitorInfo,
        source: validatedData.source,
        referrer: validatedData.referrer,
        userAgent: validatedData.userAgent,
        ipAddress: validatedData.ipAddress,
        location: validatedData.location,
        customFields: validatedData.customFields,
        sessionId: uuidv4()
      },
      include: {
        chatbot: {
          select: {
            id: true,
            name: true,
            avatar: true,
            fallbackMessage: true
          }
        }
      }
    });

    // Send welcome message if configured
    let welcomeMessage = null;
    if (chatbot.systemPrompt.includes('welcome') || chatbot.fallbackMessage) {
      const welcomeContent = chatbot.fallbackMessage || 
        `Hello! I'm ${chatbot.name}. How can I help you today?`;

      welcomeMessage = await prisma.botMessage.create({
        data: {
          conversationId: conversation.id,
          role: 'ASSISTANT',
          content: welcomeContent,
          sender: chatbot.name,
          contentType: 'TEXT'
        }
      });
    }

    res.status(201).json({
      conversation: {
        ...conversation,
        messages: welcomeMessage ? [welcomeMessage] : []
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    }

    console.error('Error starting conversation:', error);
    res.status(500).json({ error: 'Failed to start conversation' });
  }
}

async function sendMessage(req: NextApiRequest, res: NextApiResponse, chatbot: any) {
  const session = await getSession({ req });
  const { conversationId } = req.query;

  if (!conversationId || typeof conversationId !== 'string') {
    return res.status(400).json({ error: 'Conversation ID is required' });
  }

  try {
    const validatedData = sendMessageSchema.parse(req.body);

    // Get conversation
    const conversation = await prisma.botConversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Check if user can send messages to this conversation
    const canSendMessage = conversation.userId === session?.user?.id || 
                          conversation.visitorId === validatedData.visitorId ||
                          !session?.user; // Allow anonymous messages

    if (!canSendMessage) {
      return res.status(403).json({ error: 'Cannot send message to this conversation' });
    }

    const startTime = Date.now();

    // Create user message
    const userMessage = await prisma.botMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'USER',
        content: validatedData.content,
        contentType: validatedData.contentType,
        metadata: validatedData.metadata,
        sender: session?.user?.name || 'Anonymous'
      }
    });

    // Generate AI response
    const aiResponse = await generateAIResponse(chatbot, conversation.messages, validatedData.content);
    const responseTime = Date.now() - startTime;

    // Create assistant message
    const assistantMessage = await prisma.botMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'ASSISTANT',
        content: aiResponse.content,
        contentType: 'TEXT',
        sender: chatbot.name,
        intent: aiResponse.intent,
        confidence: aiResponse.confidence,
        prompt: chatbot.systemPrompt,
        modelUsed: aiResponse.model,
        tokensUsed: aiResponse.tokensUsed,
        responseTime
      }
    });

    // Update conversation timestamp
    await prisma.botConversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: new Date() }
    });

    // Update analytics
    await updateAnalytics(chatbot.id, {
      messagesReceived: 1,
      messagesSent: 1,
      averageResponseTime: responseTime,
      tokensUsed: aiResponse.tokensUsed
    });

    res.status(201).json({
      userMessage,
      assistantMessage,
      conversationId: conversation.id
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

async function rateConversation(req: NextApiRequest, res: NextApiResponse) {
  const { conversationId } = req.query;

  if (!conversationId || typeof conversationId !== 'string') {
    return res.status(400).json({ error: 'Conversation ID is required' });
  }

  try {
    const validatedData = rateConversationSchema.parse(req.body);

    // Check if conversation exists
    const conversation = await prisma.botConversation.findUnique({
      where: { id: conversationId }
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Create rating
    const rating = await prisma.botRating.create({
      data: {
        conversationId,
        rating: validatedData.rating,
        feedback: validatedData.feedback,
        categories: validatedData.categories,
        messageId: validatedData.messageId
      }
    });

    // Update analytics
    await updateAnalytics(conversation.chatbotId, {
      ratingsReceived: 1,
      averageRating: validatedData.rating,
      positiveRatings: validatedData.rating >= 4 ? 1 : 0,
      negativeRatings: validatedData.rating <= 2 ? 1 : 0
    });

    res.status(201).json({
      rating,
      message: 'Rating submitted successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    }

    console.error('Error rating conversation:', error);
    res.status(500).json({ error: 'Failed to submit rating' });
  }
}

// Helper function to update analytics
async function updateAnalytics(chatbotId: string, metrics: any) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    await prisma.botAnalytics.upsert({
      where: {
        chatbotId_date_period: {
          chatbotId,
          date: today,
          period: 'DAY'
        }
      },
      update: {
        messagesReceived: { increment: metrics.messagesReceived || 0 },
        messagesSent: { increment: metrics.messagesSent || 0 },
        ratingsReceived: { increment: metrics.ratingsReceived || 0 },
        positiveRatings: { increment: metrics.positiveRatings || 0 },
        negativeRatings: { increment: metrics.negativeRatings || 0 },
        totalTokensUsed: { increment: metrics.tokensUsed || 0 },
        averageResponseTime: metrics.averageResponseTime || undefined,
        averageRating: metrics.averageRating || undefined
      },
      create: {
        chatbotId,
        date: today,
        period: 'DAY',
        messagesReceived: metrics.messagesReceived || 0,
        messagesSent: metrics.messagesSent || 0,
        ratingsReceived: metrics.ratingsReceived || 0,
        positiveRatings: metrics.positiveRatings || 0,
        negativeRatings: metrics.negativeRatings || 0,
        totalTokensUsed: metrics.tokensUsed || 0,
        averageResponseTime: metrics.averageResponseTime || 0,
        averageRating: metrics.averageRating || 0
      }
    });
  } catch (error) {
    console.error('Error updating analytics:', error);
  }
}