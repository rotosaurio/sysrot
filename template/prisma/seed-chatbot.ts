import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedChatbot() {
  console.log('🤖 Starting AI Chatbot seed...');

  try {
    // Create chatbot users if they don't exist
    console.log('👥 Creating chatbot users...');
    
    const passwordHash = await bcrypt.hash('bot123', 10);

    const users = [
      {
        email: 'sarah@company.com',
        name: 'Sarah Williams',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      },
      {
        email: 'mike@company.com',
        name: 'Mike Johnson',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      {
        email: 'lisa@company.com',
        name: 'Lisa Chen',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      },
      {
        email: 'david@startup.io',
        name: 'David Rodriguez',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      {
        email: 'anna@tech.com',
        name: 'Anna Thompson',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face'
      }
    ];

    const createdUsers = [];
    for (const userData of users) {
      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: {
          ...userData,
          password: passwordHash,
          role: 'user',
          emailVerified: new Date()
        }
      });
      createdUsers.push(user);
    }

    console.log('✅ Created chatbot users');

    // Create sample organizations for chatbots
    console.log('🏢 Creating organizations...');

    const organizations = [
      {
        id: 'tech-solutions-bot',
        name: 'TechSolutions Inc',
        slug: 'tech-solutions-bot',
        description: 'Leading technology solutions provider',
        userLimit: 25,
        status: 'ACTIVE'
      },
      {
        id: 'ecommerce-support',
        name: 'E-Commerce Support',
        slug: 'ecommerce-support',
        description: 'Customer support for online stores',
        userLimit: 50,
        status: 'ACTIVE'
      }
    ];

    const createdOrgs = [];
    for (const orgData of organizations) {
      const org = await prisma.organization.upsert({
        where: { slug: orgData.slug },
        update: {},
        create: orgData
      });
      createdOrgs.push(org);

      // Add organization membership
      await prisma.organizationMember.upsert({
        where: {
          organizationId_userId: {
            organizationId: org.id,
            userId: createdUsers[0].id
          }
        },
        update: {},
        create: {
          organizationId: org.id,
          userId: createdUsers[0].id,
          role: 'OWNER'
        }
      });
    }

    console.log('✅ Created organizations');

    // Create chatbots
    console.log('🤖 Creating chatbots...');

    const chatbots = [
      {
        id: 'customer-support-bot',
        name: 'Customer Support Assistant',
        description: 'Intelligent customer support chatbot that handles common inquiries and provides instant help',
        avatar: '🤖',
        model: 'gpt-4o',
        temperature: 0.7,
        maxTokens: 1500,
        systemPrompt: 'You are a helpful customer support assistant. Be friendly, professional, and always try to solve customer problems. If you cannot help with something, politely escalate to human support.',
        personality: JSON.stringify({
          tone: 'friendly',
          style: 'professional',
          traits: ['helpful', 'patient', 'solution-oriented']
        }),
        capabilities: ['answer_faq', 'process_orders', 'handle_complaints', 'provide_product_info'],
        restrictions: ['no_refunds_without_manager', 'no_personal_data_requests'],
        languages: ['en', 'es'],
        isPublic: true,
        isEmbeddable: true,
        fallbackMessage: 'I apologize, but I need to connect you with a human agent for this inquiry.',
        businessHours: JSON.stringify({
          monday: { start: '09:00', end: '17:00' },
          tuesday: { start: '09:00', end: '17:00' },
          wednesday: { start: '09:00', end: '17:00' },
          thursday: { start: '09:00', end: '17:00' },
          friday: { start: '09:00', end: '17:00' },
          timezone: 'America/New_York'
        }),
        autoAssign: true,
        maxConversations: 100,
        organizationId: createdOrgs[0].id,
        createdBy: createdUsers[0].id
      },
      {
        id: 'sales-assistant-bot',
        name: 'Sales Assistant',
        description: 'AI-powered sales assistant that helps prospects learn about products and services',
        avatar: '💼',
        model: 'claude-3-5-sonnet',
        temperature: 0.8,
        maxTokens: 1200,
        systemPrompt: 'You are an expert sales assistant. Help potential customers understand our products and services. Be persuasive but not pushy, and always focus on solving their needs.',
        personality: JSON.stringify({
          tone: 'enthusiastic',
          style: 'consultative',
          traits: ['knowledgeable', 'persuasive', 'trustworthy']
        }),
        capabilities: ['product_demos', 'pricing_info', 'lead_qualification', 'schedule_meetings'],
        restrictions: ['no_discounts_without_approval', 'no_false_claims'],
        languages: ['en'],
        isPublic: false,
        isEmbeddable: true,
        fallbackMessage: 'Let me connect you with one of our sales specialists who can provide more detailed information.',
        autoAssign: false,
        maxConversations: 50,
        organizationId: createdOrgs[0].id,
        createdBy: createdUsers[1].id
      },
      {
        id: 'technical-support-bot',
        name: 'Technical Support Guru',
        description: 'Advanced technical support chatbot for software and hardware troubleshooting',
        avatar: '🔧',
        model: 'gpt-4o',
        temperature: 0.5,
        maxTokens: 2000,
        systemPrompt: 'You are a technical support expert. Provide step-by-step troubleshooting guides, explain technical concepts clearly, and help users resolve their technical issues.',
        personality: JSON.stringify({
          tone: 'technical',
          style: 'methodical',
          traits: ['precise', 'analytical', 'thorough']
        }),
        capabilities: ['troubleshooting', 'code_debugging', 'system_diagnosis', 'performance_optimization'],
        restrictions: ['no_system_access', 'no_password_resets'],
        languages: ['en'],
        isPublic: true,
        isEmbeddable: true,
        fallbackMessage: 'This issue requires specialized technical assistance. I\'ll create a support ticket for you.',
        autoAssign: true,
        maxConversations: 75,
        organizationId: createdOrgs[1].id,
        createdBy: createdUsers[2].id
      },
      {
        id: 'ecommerce-helper-bot',
        name: 'Shopping Assistant',
        description: 'E-commerce chatbot that helps customers find products and complete purchases',
        avatar: '🛍️',
        model: 'gemini-flash-pro',
        temperature: 0.6,
        maxTokens: 1000,
        systemPrompt: 'You are a helpful shopping assistant. Help customers find the perfect products, answer questions about shipping and returns, and guide them through the purchase process.',
        personality: JSON.stringify({
          tone: 'cheerful',
          style: 'helpful',
          traits: ['enthusiastic', 'detail-oriented', 'customer-focused']
        }),
        capabilities: ['product_search', 'order_tracking', 'shipping_info', 'return_policies'],
        restrictions: ['no_price_changes', 'no_order_cancellations'],
        languages: ['en', 'es', 'fr'],
        isPublic: true,
        isEmbeddable: true,
        fallbackMessage: 'Let me connect you with our customer service team for personalized assistance.',
        autoAssign: false,
        maxConversations: 200,
        organizationId: createdOrgs[1].id,
        createdBy: createdUsers[3].id
      },
      {
        id: 'hr-assistant-bot',
        name: 'HR Helper',
        description: 'Internal HR chatbot for employee questions about policies, benefits, and procedures',
        avatar: '👥',
        model: 'deepseek-r1',
        temperature: 0.4,
        maxTokens: 1500,
        systemPrompt: 'You are an HR assistant helping employees with questions about company policies, benefits, time off, and procedures. Be confidential and professional.',
        personality: JSON.stringify({
          tone: 'professional',
          style: 'confidential',
          traits: ['discreet', 'informative', 'supportive']
        }),
        capabilities: ['policy_info', 'benefits_explanation', 'timeoff_requests', 'procedure_guidance'],
        restrictions: ['no_salary_discussions', 'no_disciplinary_actions'],
        languages: ['en'],
        isPublic: false,
        isEmbeddable: false,
        fallbackMessage: 'For sensitive HR matters, please contact the HR department directly.',
        autoAssign: true,
        maxConversations: 25,
        createdBy: createdUsers[4].id
      }
    ];

    const createdChatbots = [];
    for (const botData of chatbots) {
      const chatbot = await prisma.chatbot.upsert({
        where: { id: botData.id },
        update: {},
        create: botData
      });
      createdChatbots.push(chatbot);
    }

    console.log('✅ Created chatbots');

    // Create knowledge base items
    console.log('📚 Creating knowledge base...');

    const knowledgeItems = [
      // Customer Support Bot Knowledge
      {
        chatbotId: createdChatbots[0].id,
        title: 'Order Tracking Guide',
        content: 'To track your order, you can use your order number or email address. Orders typically ship within 1-2 business days and delivery takes 3-5 business days for standard shipping.',
        summary: 'How to track orders and shipping information',
        category: 'Orders',
        tags: ['tracking', 'shipping', 'orders'],
        keywords: ['track order', 'where is my order', 'shipping status', 'delivery'],
        contentType: 'FAQ',
        priority: 10,
        createdBy: createdUsers[0].id
      },
      {
        chatbotId: createdChatbots[0].id,
        title: 'Return Policy',
        content: 'We accept returns within 30 days of purchase. Items must be in original condition with tags attached. Refunds are processed within 5-7 business days after we receive the returned item.',
        summary: 'Return policy and refund process',
        category: 'Returns',
        tags: ['returns', 'refunds', 'policy'],
        keywords: ['return item', 'refund', 'exchange', 'send back'],
        contentType: 'FAQ',
        priority: 10,
        createdBy: createdUsers[0].id
      },
      {
        chatbotId: createdChatbots[0].id,
        title: 'Payment Methods',
        content: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, and Google Pay. All transactions are secure and encrypted.',
        summary: 'Accepted payment methods',
        category: 'Payments',
        tags: ['payment', 'credit card', 'paypal'],
        keywords: ['pay', 'payment methods', 'credit card', 'paypal'],
        contentType: 'FAQ',
        priority: 8,
        createdBy: createdUsers[0].id
      },

      // Technical Support Bot Knowledge
      {
        chatbotId: createdChatbots[2].id,
        title: 'Login Issues Troubleshooting',
        content: '1. Check your internet connection\n2. Clear browser cache and cookies\n3. Try incognito/private mode\n4. Reset your password\n5. Check if caps lock is on\n6. Contact support if issues persist',
        summary: 'Step-by-step guide for login problems',
        category: 'Authentication',
        tags: ['login', 'password', 'troubleshooting'],
        keywords: ['cannot login', 'forgot password', 'login error', 'sign in problem'],
        contentType: 'DOCUMENT',
        priority: 10,
        createdBy: createdUsers[2].id
      },
      {
        chatbotId: createdChatbots[2].id,
        title: 'Software Installation Guide',
        content: 'System Requirements:\n- Windows 10 or later / macOS 10.15+\n- 4GB RAM minimum\n- 2GB free disk space\n\nInstallation Steps:\n1. Download installer\n2. Run as administrator\n3. Follow setup wizard\n4. Restart computer\n5. Launch application',
        summary: 'How to install our software',
        category: 'Installation',
        tags: ['installation', 'setup', 'software'],
        keywords: ['install software', 'setup', 'download', 'system requirements'],
        contentType: 'DOCUMENT',
        priority: 9,
        createdBy: createdUsers[2].id
      },

      // E-commerce Bot Knowledge
      {
        chatbotId: createdChatbots[3].id,
        title: 'Size Guide',
        content: 'Size Chart:\nSmall: Chest 34-36", Waist 28-30"\nMedium: Chest 38-40", Waist 32-34"\nLarge: Chest 42-44", Waist 36-38"\nX-Large: Chest 46-48", Waist 40-42"\n\nIf you\'re between sizes, we recommend sizing up for comfort.',
        summary: 'Clothing size chart and fitting guide',
        category: 'Products',
        tags: ['sizing', 'fit', 'measurements'],
        keywords: ['size chart', 'what size', 'measurements', 'fit guide'],
        contentType: 'FAQ',
        priority: 8,
        createdBy: createdUsers[3].id
      }
    ];

    for (const knowledgeData of knowledgeItems) {
      await prisma.knowledgeItem.create({
        data: knowledgeData
      });
    }

    console.log('✅ Created knowledge base');

    // Create intents and responses for chatbots
    console.log('🎯 Creating intents and responses...');

    const intentsData = [
      // Customer Support Bot Intents
      {
        chatbotId: createdChatbots[0].id,
        name: 'order_status',
        description: 'User asking about their order status',
        examples: [
          'where is my order',
          'order status',
          'track my order',
          'shipping update',
          'when will my order arrive'
        ],
        patterns: ['order.*status', 'track.*order', 'shipping.*status'],
        responses: [
          'I can help you track your order! Please provide your order number or the email address used for the purchase.',
          'To check your order status, I\'ll need your order number. You can find it in your confirmation email.',
          'Let me help you track that order. Can you share your order number with me?'
        ]
      },
      {
        chatbotId: createdChatbots[0].id,
        name: 'return_request',
        description: 'User wants to return an item',
        examples: [
          'i want to return this',
          'how do i return',
          'return policy',
          'send back item',
          'refund request'
        ],
        patterns: ['return.*item', 'refund.*request', 'send.*back'],
        responses: [
          'I can help you with returns! We accept returns within 30 days. What item would you like to return?',
          'Our return process is simple. Items must be in original condition. Which product needs to be returned?',
          'I\'ll guide you through the return process. What\'s the reason for the return?'
        ]
      },

      // Sales Assistant Bot Intents
      {
        chatbotId: createdChatbots[1].id,
        name: 'product_inquiry',
        description: 'User asking about products or services',
        examples: [
          'tell me about your products',
          'what do you sell',
          'product information',
          'features',
          'specifications'
        ],
        patterns: ['product.*info', 'what.*sell', 'features.*specs'],
        responses: [
          'I\'d love to tell you about our products! What specific area are you interested in?',
          'We offer a range of solutions. What type of product or service are you looking for?',
          'Great question! Let me share information about our offerings. What\'s your main need?'
        ]
      },
      {
        chatbotId: createdChatbots[1].id,
        name: 'pricing_inquiry',
        description: 'User asking about pricing',
        examples: [
          'how much does it cost',
          'pricing information',
          'what are your rates',
          'cost estimate',
          'price quote'
        ],
        patterns: ['how.*much', 'pricing.*info', 'cost.*estimate'],
        responses: [
          'I can provide pricing information! Which product or service are you interested in?',
          'Our pricing varies by solution. What specific package are you considering?',
          'I\'d be happy to discuss pricing. What\'s your budget range and requirements?'
        ]
      },

      // Technical Support Bot Intents
      {
        chatbotId: createdChatbots[2].id,
        name: 'login_problem',
        description: 'User having login issues',
        examples: [
          'cannot login',
          'forgot password',
          'login error',
          'sign in problem',
          'account locked'
        ],
        patterns: ['cannot.*login', 'forgot.*password', 'login.*error'],
        responses: [
          'I can help with login issues! Let\'s start with some basic troubleshooting steps.',
          'Login problems are common and usually easy to fix. Are you getting a specific error message?',
          'Let me guide you through resolving this login issue. What exactly happens when you try to sign in?'
        ]
      }
    ];

    for (const intentData of intentsData) {
      const { responses, ...intentInfo } = intentData;
      
      const intent = await prisma.botIntent.create({
        data: intentInfo
      });

      // Create responses for this intent
      for (const responseText of responses) {
        await prisma.botResponse.create({
          data: {
            chatbotId: intentData.chatbotId,
            intentId: intent.id,
            content: responseText,
            contentType: 'TEXT',
            weight: 100
          }
        });
      }
    }

    console.log('✅ Created intents and responses');

    // Create sample conversations
    console.log('💬 Creating sample conversations...');

    const conversations = [
      {
        id: 'conv-customer-support-1',
        chatbotId: createdChatbots[0].id,
        userId: createdUsers[1].id,
        title: 'Order Status Inquiry',
        summary: 'Customer asking about delayed order',
        category: 'Orders',
        priority: 'MEDIUM',
        status: 'RESOLVED',
        channel: 'WEB',
        source: 'https://company.com/support',
        tags: ['order-tracking', 'shipping-delay'],
        startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        lastMessageAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000),
        endedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000)
      },
      {
        id: 'conv-sales-1',
        chatbotId: createdChatbots[1].id,
        visitorId: 'visitor-sales-001',
        visitorInfo: JSON.stringify({
          location: 'New York, NY',
          device: 'desktop',
          browser: 'Chrome'
        }),
        title: 'Product Demo Request',
        summary: 'Prospect interested in enterprise solution',
        category: 'Sales',
        priority: 'HIGH',
        status: 'ACTIVE',
        channel: 'WEB',
        source: 'https://company.com/products',
        tags: ['enterprise', 'demo-request'],
        startedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        lastMessageAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
      },
      {
        id: 'conv-tech-support-1',
        chatbotId: createdChatbots[2].id,
        userId: createdUsers[2].id,
        title: 'Login Issues',
        summary: 'User cannot access their account',
        category: 'Technical',
        priority: 'HIGH',
        status: 'RESOLVED',
        channel: 'WEB',
        source: 'https://app.company.com/login',
        tags: ['authentication', 'account-access'],
        startedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        lastMessageAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 25 * 60 * 1000),
        endedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000)
      }
    ];

    const createdConversations = [];
    for (const convData of conversations) {
      const conversation = await prisma.botConversation.create({
        data: convData
      });
      createdConversations.push(conversation);
    }

    console.log('✅ Created sample conversations');

    // Create sample messages
    console.log('💭 Creating sample messages...');

    const messages = [
      // Customer Support Conversation
      {
        conversationId: createdConversations[0].id,
        role: 'ASSISTANT',
        content: 'Hello! I\'m your customer support assistant. How can I help you today?',
        sender: 'Customer Support Assistant',
        contentType: 'TEXT',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        conversationId: createdConversations[0].id,
        role: 'USER',
        content: 'Hi, I placed an order 3 days ago but haven\'t received any shipping updates. Order #12345',
        sender: 'Mike Johnson',
        contentType: 'TEXT',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 1000)
      },
      {
        conversationId: createdConversations[0].id,
        role: 'ASSISTANT',
        content: 'I can help you track order #12345! Let me check the status for you. Your order is currently being prepared for shipment and should ship within the next 24 hours. You\'ll receive a tracking number via email once it\'s dispatched.',
        sender: 'Customer Support Assistant',
        contentType: 'TEXT',
        intent: 'order_status',
        confidence: 0.95,
        modelUsed: 'gpt-4o',
        tokensUsed: 85,
        responseTime: 1200,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 1000)
      },
      {
        conversationId: createdConversations[0].id,
        role: 'USER',
        content: 'Great! Thank you for the quick response. Will I be able to track it online?',
        sender: 'Mike Johnson',
        contentType: 'TEXT',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 6 * 60 * 1000)
      },
      {
        conversationId: createdConversations[0].id,
        role: 'ASSISTANT',
        content: 'Absolutely! Once you receive the tracking number, you can track your package on our website or directly on the carrier\'s site. You\'ll get real-time updates on its location and estimated delivery time.',
        sender: 'Customer Support Assistant',
        contentType: 'TEXT',
        modelUsed: 'gpt-4o',
        tokensUsed: 62,
        responseTime: 800,
        wasHelpful: true,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 8 * 60 * 1000)
      },

      // Sales Conversation
      {
        conversationId: createdConversations[1].id,
        role: 'ASSISTANT',
        content: 'Hi there! I\'m your sales assistant. I see you\'re interested in our solutions. What can I help you discover today?',
        sender: 'Sales Assistant',
        contentType: 'TEXT',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
      },
      {
        conversationId: createdConversations[1].id,
        role: 'USER',
        content: 'We\'re looking for an enterprise solution for our team of 200+ people. Can you tell me about your enterprise packages?',
        sender: 'Anonymous',
        contentType: 'TEXT',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000 + 5 * 60 * 1000)
      },
      {
        conversationId: createdConversations[1].id,
        role: 'ASSISTANT',
        content: 'Perfect! Our Enterprise solution is designed exactly for teams like yours. It includes advanced analytics, priority support, custom integrations, and unlimited users. Would you like to schedule a personalized demo to see how it works with your specific needs?',
        sender: 'Sales Assistant',
        contentType: 'TEXT',
        intent: 'product_inquiry',
        confidence: 0.92,
        modelUsed: 'claude-3-5-sonnet',
        tokensUsed: 95,
        responseTime: 1500,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000 + 7 * 60 * 1000)
      },

      // Technical Support Conversation  
      {
        conversationId: createdConversations[2].id,
        role: 'ASSISTANT',
        content: 'Hello! I\'m your technical support assistant. I\'m here to help resolve any technical issues you\'re experiencing.',
        sender: 'Technical Support Guru',
        contentType: 'TEXT',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        conversationId: createdConversations[2].id,
        role: 'USER',
        content: 'I can\'t log into my account. It keeps saying "invalid credentials" even though I\'m sure my password is correct.',
        sender: 'Lisa Chen',
        contentType: 'TEXT',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 3 * 60 * 1000)
      },
      {
        conversationId: createdConversations[2].id,
        role: 'ASSISTANT',
        content: 'I can help with login issues! Let\'s troubleshoot this step by step:\n\n1. First, try clearing your browser cache and cookies\n2. Make sure Caps Lock is off\n3. Try using an incognito/private window\n4. Check if there are any browser extensions blocking the login\n\nHave you tried any of these steps already?',
        sender: 'Technical Support Guru',
        contentType: 'TEXT',
        intent: 'login_problem',
        confidence: 0.98,
        modelUsed: 'gpt-4o',
        tokensUsed: 124,
        responseTime: 1800,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000)
      }
    ];

    for (const messageData of messages) {
      await prisma.botMessage.create({
        data: messageData
      });
    }

    console.log('✅ Created sample messages');

    // Create conversation ratings
    console.log('⭐ Creating conversation ratings...');

    const ratings = [
      {
        conversationId: createdConversations[0].id,
        rating: 5,
        feedback: 'Very helpful and quick response! Exactly what I needed.',
        categories: JSON.stringify({
          helpfulness: 5,
          accuracy: 5,
          speed: 5
        })
      },
      {
        conversationId: createdConversations[1].id,
        rating: 4,
        feedback: 'Good information, would like to see pricing details.',
        categories: JSON.stringify({
          helpfulness: 4,
          accuracy: 4,
          completeness: 3
        })
      },
      {
        conversationId: createdConversations[2].id,
        rating: 5,
        feedback: 'Excellent troubleshooting steps. Solved my problem quickly!',
        categories: JSON.stringify({
          helpfulness: 5,
          accuracy: 5,
          clarity: 5
        })
      }
    ];

    for (const ratingData of ratings) {
      await prisma.botRating.create({
        data: ratingData
      });
    }

    console.log('✅ Created conversation ratings');

    // Create analytics data
    console.log('📊 Creating analytics data...');

    for (let i = 0; i < createdChatbots.length; i++) {
      const chatbot = createdChatbots[i];
      
      // Create daily analytics for the last 7 days
      for (let days = 6; days >= 0; days--) {
        const date = new Date();
        date.setDate(date.getDate() - days);
        date.setHours(0, 0, 0, 0);

        const baseMetrics = {
          chatbotId: chatbot.id,
          date: date,
          period: 'DAY',
          conversationsStarted: Math.floor(Math.random() * 20) + 5,
          conversationsCompleted: Math.floor(Math.random() * 15) + 3,
          averageSessionLength: Math.floor(Math.random() * 300) + 120, // 2-7 minutes
          messagesReceived: Math.floor(Math.random() * 100) + 20,
          messagesSent: Math.floor(Math.random() * 100) + 20,
          averageResponseTime: Math.floor(Math.random() * 2000) + 500, // 0.5-2.5 seconds
          intentMatches: Math.floor(Math.random() * 80) + 15,
          intentMisses: Math.floor(Math.random() * 10) + 2,
          averageConfidence: 0.7 + Math.random() * 0.25, // 0.7-0.95
          ratingsReceived: Math.floor(Math.random() * 8) + 1,
          averageRating: 3.5 + Math.random() * 1.5, // 3.5-5.0
          positiveRatings: Math.floor(Math.random() * 6) + 2,
          negativeRatings: Math.floor(Math.random() * 2),
          handoffsRequested: Math.floor(Math.random() * 3),
          handoffsCompleted: Math.floor(Math.random() * 2),
          totalTokensUsed: Math.floor(Math.random() * 10000) + 2000,
          estimatedCost: (Math.floor(Math.random() * 50) + 10) / 100 // $0.10-$0.60
        };

        await prisma.botAnalytics.create({
          data: baseMetrics
        });
      }
    }

    console.log('✅ Created analytics data');

    // Create bot integrations
    console.log('🔗 Creating bot integrations...');

    const integrations = [
      {
        chatbotId: createdChatbots[0].id,
        type: 'WIDGET',
        name: 'Website Widget',
        description: 'Embedded chat widget for main website',
        config: JSON.stringify({
          position: 'bottom-right',
          theme: 'light',
          welcomeMessage: 'Hello! How can I help you today?',
          placeholder: 'Type your message...',
          showAvatar: true,
          allowFileUpload: false
        }),
        isActive: true,
        requestCount: 1250,
        successCount: 1198,
        errorCount: 52
      },
      {
        chatbotId: createdChatbots[1].id,
        type: 'SLACK',
        name: 'Sales Team Slack',
        description: 'Integration with sales team Slack workspace',
        config: JSON.stringify({
          workspace: 'sales-team',
          channel: '#leads',
          notifyOnLead: true,
          escalationChannel: '#urgent'
        }),
        webhookUrl: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX',
        isActive: true,
        requestCount: 450,
        successCount: 442,
        errorCount: 8
      },
      {
        chatbotId: createdChatbots[2].id,
        type: 'EMAIL',
        name: 'Support Email Integration',
        description: 'Email notifications for technical support escalations',
        config: JSON.stringify({
          emailTemplate: 'support-escalation',
          recipients: ['support@company.com'],
          priority: 'high'
        }),
        isActive: true,
        requestCount: 85,
        successCount: 83,
        errorCount: 2
      }
    ];

    for (const integrationData of integrations) {
      await prisma.botIntegration.create({
        data: integrationData
      });
    }

    console.log('✅ Created bot integrations');

    console.log('\n🎉 AI Chatbot seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • 5 chatbot users created`);
    console.log(`   • 2 organizations created`);
    console.log(`   • 5 AI chatbots created with different specializations`);
    console.log(`   • 7 knowledge base items added`);
    console.log(`   • 8 intents with 24 responses created`);
    console.log(`   • 3 sample conversations with realistic messages`);
    console.log(`   • 3 conversation ratings added`);
    console.log(`   • 7 days of analytics data per chatbot`);
    console.log(`   • 3 integrations configured`);
    
    console.log('\n🔑 Test Login Credentials:');
    console.log('   sarah@company.com:bot123 (Customer Support Bot Owner)');
    console.log('   mike@company.com:bot123 (Sales Assistant Bot Owner)');
    console.log('   lisa@company.com:bot123 (Technical Support Bot Owner)');
    console.log('   david@startup.io:bot123 (E-commerce Bot Owner)');
    console.log('   anna@tech.com:bot123 (HR Assistant Bot Owner)');

    console.log('\n🤖 Chatbots Ready:');
    console.log('   ✅ Customer Support Assistant (Public, Embeddable)');
    console.log('   ✅ Sales Assistant (Private, Organization)');
    console.log('   ✅ Technical Support Guru (Public, Advanced)');
    console.log('   ✅ Shopping Assistant (E-commerce, Multi-language)');
    console.log('   ✅ HR Helper (Internal, Confidential)');

    console.log('\n🚀 Features Ready:');
    console.log('   ✅ Multi-AI model support (GPT-4o, Claude, Gemini, DeepSeek)');
    console.log('   ✅ Intent recognition and response matching');
    console.log('   ✅ Knowledge base with full-text search');
    console.log('   ✅ Conversation management and analytics');
    console.log('   ✅ Real-time metrics and reporting');
    console.log('   ✅ Organization multi-tenancy');
    console.log('   ✅ Embeddable widgets and integrations');
    console.log('   ✅ Rating and feedback system');

  } catch (error) {
    console.error('❌ Error seeding chatbot data:', error);
    throw error;
  }
}

export default seedChatbot;

// Run the seed if this file is executed directly
if (require.main === module) {
  seedChatbot()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}