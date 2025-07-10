# 🤖 AI Chatbot Platform

A complete enterprise AI chatbot platform with multi-model support, conversation management, knowledge base, analytics, and advanced integrations.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- AI API keys (OpenAI, Anthropic, Google, DeepSeek)
- NextAuth.js configured

### Setup

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment variables**
```bash
# Add to your .env.local
DATABASE_URL="postgresql://user:password@localhost:5432/chatbotdb"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# AI Model API Keys
OPENAI_API_KEY="sk-your-openai-key"
ANTHROPIC_API_KEY="sk-ant-your-anthropic-key"
GOOGLE_API_KEY="your-google-ai-key"
DEEPSEEK_API_KEY="sk-your-deepseek-key"

# Optional: File uploads
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

3. **Setup database and seed**
```bash
npm run setup:chatbot
```

4. **Start development server**
```bash
npm run dev
```

5. **Access the chatbot admin**
Navigate to `http://localhost:3000/admin/chatbots`

## 🔑 Test Credentials

| Email | Password | Role | Chatbot |
|-------|----------|------|---------|
| sarah@company.com | bot123 | Owner | Customer Support Assistant |
| mike@company.com | bot123 | Owner | Sales Assistant |
| lisa@company.com | bot123 | Owner | Technical Support Guru |
| david@startup.io | bot123 | Owner | Shopping Assistant |
| anna@tech.com | bot123 | Owner | HR Helper |

## ✨ Features

### 🤖 **Multi-Bot Management**
- **Multiple Chatbots**: Create specialized bots for different purposes
- **Role-Based Access**: Organization-level permissions and ownership
- **Bot Configurations**: Custom AI models, prompts, and behavior settings
- **Public/Private Bots**: Control access and embeddability

### 🧠 **Advanced AI Integration**
- **Multi-Model Support**: GPT-4o, Claude 3.5, Gemini Pro, DeepSeek R1
- **Dynamic Model Selection**: Choose optimal AI model per chatbot
- **Custom Prompts**: Tailored system prompts for specific use cases
- **Fallback Handling**: Graceful degradation when AI services are unavailable

### 💬 **Conversation Management**
- **Real-time Conversations**: Instant AI responses with conversation history
- **Intent Recognition**: Pattern matching and example-based intent detection
- **Context Awareness**: Maintain conversation context across messages
- **Multi-Channel Support**: Web, mobile, email, Slack, Discord integrations

### 📚 **Knowledge Base**
- **Smart Knowledge Management**: Searchable knowledge base per chatbot
- **Full-Text Search**: Advanced search with keyword matching
- **Content Categories**: Organize knowledge by topics and tags
- **Usage Analytics**: Track knowledge item access and effectiveness

### 📊 **Advanced Analytics**
- **Real-Time Metrics**: Live conversation and performance monitoring
- **Conversation Analytics**: Success rates, response times, user satisfaction
- **Intent Performance**: Track intent matching accuracy and confidence
- **Cost Tracking**: Monitor AI token usage and estimated costs

### 🔗 **Enterprise Integrations**
- **Embeddable Widgets**: Drop-in chat widgets for websites
- **Slack/Discord**: Team collaboration platform integrations
- **Webhook Support**: Custom integrations via webhooks
- **API Access**: Full REST API for custom implementations

## 🏗️ Architecture

### Database Models

```prisma
// Core chatbot management
model Chatbot {
  id              String   @id @default(cuid())
  name            String
  description     String?
  avatar          String?
  model           String   @default("gpt-4o")
  temperature     Float    @default(0.7)
  maxTokens       Int      @default(1000)
  systemPrompt    String
  personality     Json?
  capabilities    String[]
  languages       String[] @default(["en"])
  isPublic        Boolean  @default(false)
  isEmbeddable    Boolean  @default(true)
  
  conversations   BotConversation[]
  knowledgeItems  KnowledgeItem[]
  intents         BotIntent[]
  analytics       BotAnalytics[]
  integrations    BotIntegration[]
}

// Conversation management
model BotConversation {
  id              String   @id @default(cuid())
  chatbotId       String
  userId          String?
  visitorId       String?
  title           String?
  status          ConversationStatus @default(ACTIVE)
  priority        ConversationPriority @default(MEDIUM)
  channel         ConversationChannel @default(WEB)
  
  messages        BotMessage[]
  ratings         BotRating[]
  handoffs        BotHandoff[]
}

// Message handling
model BotMessage {
  id              String   @id @default(cuid())
  conversationId  String
  role            BotRole  @default(USER)
  content         String
  contentType     BotMessageType @default(TEXT)
  intent          String?
  confidence      Float?
  tokensUsed      Int?
  responseTime    Int?
  wasHelpful      Boolean?
}
```

### API Structure

```
/api/chatbots/
├── index.ts                    # Chatbot CRUD operations
├── [chatbotId]/
│   ├── conversations.ts        # Conversation management
│   ├── knowledge.ts           # Knowledge base management
│   ├── intents.ts             # Intent and response management
│   ├── analytics.ts           # Analytics and reporting
│   └── integrations.ts        # External integrations
└── public/
    ├── chat.ts                # Public chat interface
    └── widget.js              # Embeddable widget
```

## 📡 API Reference

### Chatbots API (`/api/chatbots`)

#### List Chatbots
```javascript
GET /api/chatbots?organizationId=org-id&includePublic=true&limit=20

Response:
{
  "chatbots": [
    {
      "id": "chatbot-id",
      "name": "Customer Support Assistant",
      "description": "Helpful customer support chatbot",
      "model": "gpt-4o",
      "isPublic": true,
      "stats": {
        "totalConversations": 150,
        "averageRating": 4.8,
        "totalMessages": 1250
      }
    }
  ],
  "pagination": { "page": 1, "total": 5, "pages": 1 }
}
```

#### Create Chatbot
```javascript
POST /api/chatbots
{
  "name": "Support Bot",
  "description": "Customer support assistant",
  "model": "gpt-4o",
  "systemPrompt": "You are a helpful customer support assistant...",
  "capabilities": ["answer_faq", "escalate_issues"],
  "languages": ["en", "es"],
  "isPublic": true,
  "organizationId": "org-id"
}
```

### Conversations API (`/api/chatbots/[chatbotId]/conversations`)

#### Start Conversation
```javascript
POST /api/chatbots/chat-bot-id/conversations?action=start
{
  "visitorId": "visitor-123",
  "source": "https://company.com/support",
  "userAgent": "Mozilla/5.0...",
  "customFields": { "department": "billing" }
}

Response:
{
  "conversation": {
    "id": "conv-id",
    "chatbotId": "chat-bot-id",
    "sessionId": "session-123",
    "messages": [
      {
        "role": "ASSISTANT",
        "content": "Hello! How can I help you today?",
        "sender": "Support Bot"
      }
    ]
  }
}
```

#### Send Message
```javascript
POST /api/chatbots/chat-bot-id/conversations?action=message&conversationId=conv-id
{
  "content": "I need help with my order",
  "contentType": "TEXT",
  "visitorId": "visitor-123"
}

Response:
{
  "userMessage": {
    "id": "msg-1",
    "role": "USER",
    "content": "I need help with my order",
    "createdAt": "2024-01-01T12:00:00Z"
  },
  "assistantMessage": {
    "id": "msg-2",
    "role": "ASSISTANT",
    "content": "I can help you with your order! Please provide your order number.",
    "intent": "order_inquiry",
    "confidence": 0.95,
    "responseTime": 1200,
    "tokensUsed": 45
  }
}
```

#### Rate Conversation
```javascript
POST /api/chatbots/chat-bot-id/conversations?action=rate&conversationId=conv-id
{
  "rating": 5,
  "feedback": "Very helpful!",
  "categories": {
    "helpfulness": 5,
    "accuracy": 5,
    "speed": 4
  }
}
```

### Knowledge Base API (`/api/chatbots/[chatbotId]/knowledge`)

#### Add Knowledge Item
```javascript
POST /api/chatbots/chat-bot-id/knowledge
{
  "title": "Return Policy",
  "content": "We accept returns within 30 days...",
  "category": "Policies",
  "tags": ["returns", "refunds"],
  "keywords": ["return", "refund", "exchange"],
  "priority": 10
}
```

#### Search Knowledge
```javascript
GET /api/chatbots/chat-bot-id/knowledge?q=return+policy&category=Policies

Response:
{
  "items": [
    {
      "id": "knowledge-id",
      "title": "Return Policy",
      "content": "We accept returns...",
      "relevanceScore": 0.95,
      "accessCount": 45
    }
  ]
}
```

## 🔧 Frontend Integration

### Basic Chat Widget

```jsx
import { useState, useEffect } from 'react';

function ChatWidget({ chatbotId, visitorId }) {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Start conversation
  useEffect(() => {
    async function startChat() {
      const response = await fetch(`/api/chatbots/${chatbotId}/conversations?action=start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          visitorId,
          source: window.location.href,
          userAgent: navigator.userAgent
        })
      });
      
      const data = await response.json();
      setConversation(data.conversation);
      setMessages(data.conversation.messages || []);
    }
    
    startChat();
  }, [chatbotId, visitorId]);

  // Send message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversation) return;

    setIsLoading(true);
    
    try {
      const response = await fetch(
        `/api/chatbots/${chatbotId}/conversations?action=message&conversationId=${conversation.id}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: newMessage,
            visitorId
          })
        }
      );

      const data = await response.json();
      setMessages(prev => [...prev, data.userMessage, data.assistantMessage]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-widget">
      <div className="messages">
        {messages.map(message => (
          <div key={message.id} className={`message ${message.role.toLowerCase()}`}>
            <strong>{message.sender}:</strong>
            <span>{message.content}</span>
            {message.intent && (
              <small>Intent: {message.intent} ({(message.confidence * 100).toFixed(1)}%)</small>
            )}
          </div>
        ))}
      </div>
      
      <form onSubmit={sendMessage}>
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !newMessage.trim()}>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
```

### Embeddable Script

```html
<!-- Add to any website -->
<script>
(function() {
  window.ChatbotConfig = {
    chatbotId: 'your-chatbot-id',
    position: 'bottom-right',
    theme: 'light',
    welcomeMessage: 'Hello! How can I help you?'
  };
  
  var script = document.createElement('script');
  script.src = 'https://yourapp.com/api/chatbots/public/widget.js';
  script.async = true;
  document.head.appendChild(script);
})();
</script>
```

## 🎨 Admin Dashboard

### Chatbot Management

```jsx
function ChatbotDashboard() {
  const [chatbots, setChatbots] = useState([]);
  const [selectedBot, setSelectedBot] = useState(null);

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>My Chatbots</h2>
        {chatbots.map(bot => (
          <div key={bot.id} className="bot-card" onClick={() => setSelectedBot(bot)}>
            <span className="avatar">{bot.avatar}</span>
            <div>
              <h3>{bot.name}</h3>
              <p>{bot.stats.totalConversations} conversations</p>
              <p>Rating: {bot.stats.averageRating}/5</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="main-content">
        {selectedBot && (
          <div>
            <BotConfiguration bot={selectedBot} />
            <ConversationList botId={selectedBot.id} />
            <AnalyticsDashboard botId={selectedBot.id} />
          </div>
        )}
      </div>
    </div>
  );
}
```

### Analytics Dashboard

```jsx
function AnalyticsDashboard({ botId }) {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetch(`/api/chatbots/${botId}/analytics?period=7d`)
      .then(res => res.json())
      .then(setAnalytics);
  }, [botId]);

  if (!analytics) return <div>Loading...</div>;

  return (
    <div className="analytics">
      <div className="metrics-grid">
        <MetricCard 
          title="Conversations" 
          value={analytics.totalConversations}
          trend={analytics.conversationsTrend}
        />
        <MetricCard 
          title="Avg Response Time" 
          value={`${analytics.avgResponseTime}ms`}
          trend={analytics.responseTimeTrend}
        />
        <MetricCard 
          title="User Satisfaction" 
          value={`${analytics.avgRating}/5`}
          trend={analytics.ratingTrend}
        />
        <MetricCard 
          title="Intent Accuracy" 
          value={`${analytics.intentAccuracy}%`}
          trend={analytics.intentTrend}
        />
      </div>
      
      <div className="charts">
        <ConversationChart data={analytics.dailyConversations} />
        <IntentChart data={analytics.topIntents} />
        <SatisfactionChart data={analytics.ratingDistribution} />
      </div>
    </div>
  );
}
```

## 🧠 AI Model Configuration

### Model Selection

```javascript
const AI_MODELS = {
  'gpt-4o': {
    provider: 'OpenAI',
    strengths: ['reasoning', 'code', 'analysis'],
    costPer1kTokens: 0.03,
    maxTokens: 4096,
    bestFor: ['customer support', 'technical help']
  },
  'claude-3-5-sonnet': {
    provider: 'Anthropic',
    strengths: ['safety', 'reasoning', 'writing'],
    costPer1kTokens: 0.025,
    maxTokens: 4096,
    bestFor: ['sales', 'content creation']
  },
  'gemini-flash-pro': {
    provider: 'Google',
    strengths: ['speed', 'multimodal', 'efficiency'],
    costPer1kTokens: 0.01,
    maxTokens: 2048,
    bestFor: ['quick responses', 'basic support']
  },
  'deepseek-r1': {
    provider: 'DeepSeek',
    strengths: ['math', 'reasoning', 'cost-effective'],
    costPer1kTokens: 0.002,
    maxTokens: 2048,
    bestFor: ['research', 'technical analysis']
  }
};
```

### Custom Prompts

```javascript
const PROMPT_TEMPLATES = {
  customerSupport: `You are a helpful customer support assistant for {{company}}. 
    Follow these guidelines:
    - Be friendly and professional
    - Solve problems when possible
    - Escalate complex issues to human agents
    - Always ask for clarification if unsure
    
    Company Information:
    {{companyInfo}}
    
    Available Actions:
    {{capabilities}}`,
    
  sales: `You are an expert sales consultant for {{company}}.
    Your goal is to help prospects understand our value proposition.
    
    Guidelines:
    - Ask qualifying questions
    - Understand customer needs first
    - Present relevant solutions
    - Build trust and credibility
    - Guide toward next steps
    
    Products/Services:
    {{products}}`,
    
  technical: `You are a technical support specialist.
    Provide step-by-step troubleshooting help.
    
    Guidelines:
    - Ask diagnostic questions
    - Provide clear instructions
    - Use simple language
    - Offer alternative solutions
    - Know when to escalate
    
    System Information:
    {{systemInfo}}`
};
```

## 🔒 Security & Privacy

### Data Protection
- **Conversation Encryption**: All conversations encrypted at rest
- **PII Handling**: Automatic detection and masking of sensitive data
- **Access Controls**: Role-based access to conversations and analytics
- **Data Retention**: Configurable conversation retention policies

### Rate Limiting
```javascript
const RATE_LIMITS = {
  conversation_start: { requests: 10, window: '1h' },
  message_send: { requests: 60, window: '1m' },
  api_access: { requests: 1000, window: '1h' }
};
```

### Content Filtering
- Automatic spam detection
- Profanity filtering
- Inappropriate content blocking
- Custom content moderation rules

## 📱 Mobile & Responsive

### Mobile Optimization
- Touch-friendly chat interface
- Responsive design for all screen sizes
- Mobile push notifications
- Offline message queuing
- Progressive Web App support

### Native Integration
```javascript
// React Native integration
import { ChatbotSDK } from '@yourapp/chatbot-react-native';

function App() {
  return (
    <ChatbotSDK
      chatbotId="your-bot-id"
      userId={user.id}
      theme="light"
      position="floating"
    />
  );
}
```

## 🔧 Advanced Configuration

### Intent Recognition

```javascript
// Custom intent patterns
const INTENT_CONFIG = {
  greeting: {
    examples: ['hello', 'hi', 'hey'],
    patterns: [/^(hi|hello|hey).*$/i],
    responses: ['Hello! How can I help?'],
    confidence_threshold: 0.8
  },
  order_status: {
    examples: ['where is my order', 'track order'],
    patterns: [/order.*status/i, /track.*order/i],
    entities: ['order_number'],
    responses: ['I can help track your order. Please provide the order number.'],
    confidence_threshold: 0.9
  }
};
```

### Knowledge Base RAG

```javascript
// Retrieval-Augmented Generation
async function searchKnowledge(query, chatbotId) {
  const results = await prisma.knowledgeItem.findMany({
    where: {
      chatbotId,
      isEnabled: true,
      OR: [
        { title: { search: query } },
        { content: { search: query } },
        { keywords: { hasSome: query.split(' ') } }
      ]
    },
    orderBy: { priority: 'desc' },
    take: 5
  });
  
  return results.map(item => ({
    ...item,
    relevanceScore: calculateRelevance(query, item)
  }));
}
```

## 🚀 Deployment

### Environment Variables

```bash
# Production settings
NODE_ENV=production
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="secure-secret"
NEXTAUTH_URL="https://yourdomain.com"

# AI Models
OPENAI_API_KEY="sk-..."
ANTHROPIC_API_KEY="sk-ant-..."
GOOGLE_API_KEY="..."
DEEPSEEK_API_KEY="sk-..."

# Optional services
REDIS_URL="redis://..."
CLOUDINARY_URL="cloudinary://..."

# Security
ENCRYPTION_KEY="32-byte-key"
CORS_ORIGIN="https://yourdomain.com"
```

### Scaling Considerations

- **Database Optimization**: Index optimization for conversation queries
- **Caching Strategy**: Redis for session management and frequent queries
- **AI Model Load Balancing**: Distribute requests across multiple providers
- **CDN Integration**: Static assets and widget distribution
- **Monitoring**: Application performance and AI model usage tracking

### Performance Optimization

```javascript
// Conversation caching
const conversationCache = new Map();

async function getCachedConversation(conversationId) {
  if (conversationCache.has(conversationId)) {
    return conversationCache.get(conversationId);
  }
  
  const conversation = await prisma.botConversation.findUnique({
    where: { id: conversationId },
    include: { messages: { take: 10, orderBy: { createdAt: 'desc' } } }
  });
  
  conversationCache.set(conversationId, conversation);
  return conversation;
}
```

## 📊 Analytics & Reporting

### Real-Time Metrics
```javascript
// WebSocket for real-time analytics
io.on('connection', (socket) => {
  socket.on('subscribe-analytics', (chatbotId) => {
    socket.join(`analytics-${chatbotId}`);
  });
});

// Broadcast metrics updates
function broadcastMetrics(chatbotId, metrics) {
  io.to(`analytics-${chatbotId}`).emit('metrics-update', metrics);
}
```

### Custom Reports
- Conversation volume trends
- Intent accuracy over time
- User satisfaction metrics
- Cost analysis and optimization
- Performance benchmarking

## 🛠️ Development

### Adding New Features

1. **New Message Types**
```javascript
// Add to schema.prisma
enum BotMessageType {
  TEXT
  IMAGE
  CARD      // New type
  CAROUSEL  // New type
}

// Update message handler
function handleMessage(message) {
  switch(message.contentType) {
    case 'CARD':
      return renderCard(message.metadata);
    case 'CAROUSEL':
      return renderCarousel(message.metadata);
  }
}
```

2. **Custom Integrations**
```javascript
// New integration type
class CustomIntegration {
  async handleWebhook(data) {
    // Process webhook data
    const conversation = await this.findConversation(data.conversationId);
    await this.sendMessage(conversation, data.message);
  }
  
  async syncData() {
    // Sync external data
  }
}
```

## 📚 Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Anthropic Claude API](https://docs.anthropic.com/)
- [Google AI Studio](https://ai.google.dev/)
- [DeepSeek API](https://platform.deepseek.com/)
- [Prisma Documentation](https://www.prisma.io/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add comprehensive tests
4. Update documentation
5. Submit a pull request

## 📄 License

This AI chatbot platform is part of the sysrot-hub template and follows the same license terms.

---

## 🎯 Next Steps

Consider implementing these advanced features:

1. **Voice Integration** with speech-to-text and text-to-speech
2. **Video Chat** for face-to-face support escalation
3. **Advanced NLP** with custom entity recognition
4. **Sentiment Analysis** for conversation mood tracking
5. **A/B Testing** for response optimization
6. **Multi-language Support** with automatic translation
7. **Workflow Automation** with complex conversation flows
8. **Enterprise SSO** integration
9. **Advanced Analytics** with machine learning insights
10. **White-label Solutions** for reseller partners

The chatbot platform provides a robust foundation that can be extended with additional AI capabilities and enterprise features based on your specific requirements.