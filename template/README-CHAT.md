# 💬 Real-time Chat System

A complete real-time chat platform with multi-room support, file attachments, reactions, threading, and advanced messaging features.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- NextAuth.js configured

### Setup

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment variables**
```bash
# Add to your .env.local
DATABASE_URL="postgresql://user:password@localhost:5432/chatdb"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Optional: File upload service (Cloudinary)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"  
CLOUDINARY_API_SECRET="your-api-secret"
```

3. **Setup database**
```bash
npm run setup:chat
```

4. **Start development server**
```bash
npm run dev
```

5. **Access the chat**
Navigate to `http://localhost:3000/ejemplos/chat`

## 🔑 Test Credentials

| Email | Password | Role |
|-------|----------|------|
| alice@team.com | chat123 | Team Lead |
| bob@team.com | chat123 | Senior Developer |
| carol@team.com | chat123 | Lead Designer |
| david@team.com | chat123 | DevOps Engineer |
| eva@team.com | chat123 | QA Engineer |
| frank@team.com | chat123 | Product Manager |

## ✨ Features

### 🏠 **Multi-Room Support**
- **Direct Messages**: 1:1 private conversations
- **Group Chats**: Team collaboration spaces
- **Channels**: Public discussion forums
- **Support Rooms**: Customer service tickets

### 💬 **Advanced Messaging**
- Real-time message delivery
- Message editing (24h window)
- Message deletion (soft delete)
- Message threading/replies
- Rich text content support
- Emoji reactions
- File attachments
- Message search

### 👥 **User Management**
- Role-based permissions (Owner, Admin, Moderator, Member, Guest)
- User presence indicators (online, away, offline)
- Typing indicators
- Read receipts
- User blocking/muting

### 🔔 **Notifications**
- Real-time push notifications
- Desktop notifications
- Email notifications (configurable)
- Mention notifications
- Custom notification settings per room

### 📊 **Room Management**
- Create/edit/delete rooms
- Invite/remove participants
- Room settings and permissions
- Member limits
- Private/public room types

## 🏗️ Architecture

### Database Models

```prisma
// Core chat models
model ChatRoom {
  id            String   @id @default(cuid())
  name          String
  description   String?
  type          ChatRoomType @default(GROUP)
  isPrivate     Boolean  @default(false)
  avatar        String?
  createdBy     String
  maxMembers    Int?     @default(100)
  settings      Json?
  
  participants  ChatParticipant[]
  messages      ChatMessage[]
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model ChatMessage {
  id            String   @id @default(cuid())
  roomId        String
  userId        String?
  content       String?
  type          MessageType @default(TEXT)
  
  attachments   ChatAttachment[]
  reactions     ChatReaction[]
  readReceipts  ChatReadReceipt[]
  
  parentId      String?
  parent        ChatMessage? @relation("MessageThread", fields: [parentId], references: [id])
  replies       ChatMessage[] @relation("MessageThread")
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  editedAt      DateTime?
  deletedAt     DateTime?
}
```

### API Structure

```
/api/chat/
├── rooms.ts          # Room CRUD operations
├── messages.ts       # Message management
├── attachments.ts    # File upload handling
└── notifications.ts  # Notification system
```

## 📡 API Reference

### Rooms API (`/api/chat/rooms`)

#### Get User Rooms
```javascript
GET /api/chat/rooms?type=GROUP&limit=20

Response:
{
  "rooms": [
    {
      "id": "room-id",
      "name": "Development",
      "type": "GROUP",
      "participants": [...],
      "lastMessage": {...},
      "unreadCount": 3,
      "userRole": "MEMBER"
    }
  ]
}
```

#### Create Room
```javascript
POST /api/chat/rooms
{
  "name": "New Project",
  "description": "Project discussion",
  "type": "GROUP",
  "isPrivate": false,
  "participants": ["user-id-1", "user-id-2"]
}
```

#### Join Room
```javascript
POST /api/chat/rooms/[roomId]?action=join
```

#### Room Participants
```javascript
GET /api/chat/rooms/[roomId]?action=participants
POST /api/chat/rooms/[roomId]?action=participants
{
  "userId": "user-id",
  "role": "MEMBER"
}
```

### Messages API (`/api/chat/messages`)

#### Get Room Messages
```javascript
GET /api/chat/messages?roomId=room-id&limit=50&before=2024-01-01

Response:
{
  "messages": [
    {
      "id": "msg-id",
      "content": "Hello world!",
      "user": {...},
      "reactions": [...],
      "readReceipts": [...],
      "createdAt": "2024-01-01T12:00:00Z"
    }
  ],
  "hasMore": true
}
```

#### Send Message
```javascript
POST /api/chat/messages
{
  "roomId": "room-id",
  "content": "Hello everyone!",
  "type": "TEXT",
  "parentId": "parent-msg-id" // Optional for threading
}
```

#### Edit Message
```javascript
PUT /api/chat/messages/[messageId]
{
  "content": "Updated message content"
}
```

#### Add Reaction
```javascript
POST /api/chat/messages/[messageId]?action=reaction
{
  "emoji": "👍"
}
```

#### Mark as Read
```javascript
POST /api/chat/messages/[messageId]?action=read
```

#### Update Typing Status
```javascript
POST /api/chat/messages?action=typing
{
  "roomId": "room-id",
  "isTyping": true
}
```

## 🔧 Frontend Integration

### Basic Chat Component

```jsx
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

function ChatRoom({ roomId }) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Fetch messages
  useEffect(() => {
    async function fetchMessages() {
      const response = await fetch(`/api/chat/messages?roomId=${roomId}`);
      const data = await response.json();
      setMessages(data.messages);
    }
    
    if (roomId) {
      fetchMessages();
    }
  }, [roomId]);

  // Send message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const response = await fetch('/api/chat/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomId,
        content: newMessage,
        type: 'TEXT'
      })
    });

    if (response.ok) {
      const data = await response.json();
      setMessages(prev => [...prev, data.message]);
      setNewMessage('');
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map(message => (
          <div key={message.id} className="message">
            <strong>{message.user?.name}:</strong>
            <span>{message.content}</span>
          </div>
        ))}
      </div>
      
      <form onSubmit={sendMessage}>
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
```

### Real-time Updates with Socket.IO

```jsx
import { useEffect } from 'react';
import io from 'socket.io-client';

function useRealTimeChat(roomId) {
  const [socket, setSocket] = useState(null);
  
  useEffect(() => {
    const socketInstance = io();
    setSocket(socketInstance);
    
    // Join room
    socketInstance.emit('join-room', roomId);
    
    // Listen for new messages
    socketInstance.on('new-message', (message) => {
      setMessages(prev => [...prev, message]);
    });
    
    // Listen for typing indicators
    socketInstance.on('user-typing', (data) => {
      setTypingUsers(data.users);
    });
    
    return () => socketInstance.close();
  }, [roomId]);
  
  return socket;
}
```

## 🎨 UI Components

### Message Bubble
```jsx
function MessageBubble({ message, isOwn }) {
  return (
    <div className={`message-bubble ${isOwn ? 'own' : 'other'}`}>
      {!isOwn && (
        <div className="message-header">
          <img src={message.user.image} alt="" className="avatar" />
          <span className="username">{message.user.name}</span>
          <time className="timestamp">
            {formatTime(message.createdAt)}
          </time>
        </div>
      )}
      
      <div className="message-content">
        {message.content}
        {message.editedAt && (
          <span className="edited">(edited)</span>
        )}
      </div>
      
      {message.reactions.length > 0 && (
        <div className="reactions">
          {message.reactions.map(reaction => (
            <button
              key={reaction.emoji}
              className="reaction"
              onClick={() => toggleReaction(message.id, reaction.emoji)}
            >
              {reaction.emoji} {reaction.count}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Typing Indicator
```jsx
function TypingIndicator({ users }) {
  if (users.length === 0) return null;
  
  return (
    <div className="typing-indicator">
      <div className="typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <span>
        {users.length === 1 
          ? `${users[0].name} is typing...`
          : `${users.length} people are typing...`
        }
      </span>
    </div>
  );
}
```

## 🔒 Security Features

### Permission System
```javascript
// Room permissions
const PERMISSIONS = {
  OWNER: ['*'],
  ADMIN: ['moderate', 'invite', 'manage_messages', 'manage_members'],
  MODERATOR: ['moderate', 'manage_messages'],
  MEMBER: ['send_messages', 'react'],
  GUEST: ['send_messages']
};

// Check permissions
function hasPermission(userRole, action) {
  const permissions = PERMISSIONS[userRole] || [];
  return permissions.includes('*') || permissions.includes(action);
}
```

### Rate Limiting
- Message sending: 10 messages per minute
- File uploads: 5 files per minute
- Room creation: 3 rooms per hour

### Content Filtering
- Automatic spam detection
- Profanity filtering (configurable)
- File type validation
- Maximum file size limits

## 📱 Mobile Support

The chat system is fully responsive and includes:
- Touch-friendly interface
- Swipe gestures for message actions
- Mobile push notifications
- Optimized virtual scrolling
- Offline message queuing

## 🔧 Customization

### Themes
```css
/* Custom chat theme */
.chat-container {
  --primary-color: #3b82f6;
  --background-color: #ffffff;
  --message-bubble-own: #3b82f6;
  --message-bubble-other: #f3f4f6;
  --text-color: #1f2937;
}

.dark .chat-container {
  --background-color: #1f2937;
  --message-bubble-other: #374151;
  --text-color: #f9fafb;
}
```

### Room Settings
```javascript
// Room configuration options
const roomSettings = {
  allowFileUploads: true,
  allowReactions: true,
  allowThreads: true,
  maxMessageLength: 4000,
  messageRetention: 90, // days
  muteNotifications: false,
  requireApproval: false,
  allowGuestAccess: true
};
```

## 📊 Analytics & Monitoring

### Message Analytics
- Messages per day/hour
- Most active users
- Popular reactions
- Response times
- File sharing statistics

### Performance Metrics
- Real-time connection stability
- Message delivery latency
- File upload success rates
- Error rates by endpoint

## 🔄 WebSocket Events

### Client → Server
```javascript
// Join a room
socket.emit('join-room', { roomId: 'room-id' });

// Send message
socket.emit('send-message', {
  roomId: 'room-id',
  content: 'Hello!',
  type: 'TEXT'
});

// Typing indicator
socket.emit('typing', {
  roomId: 'room-id',
  isTyping: true
});

// Leave room
socket.emit('leave-room', { roomId: 'room-id' });
```

### Server → Client
```javascript
// New message received
socket.on('new-message', (message) => {
  // Handle new message
});

// User joined/left
socket.on('user-presence', (data) => {
  // Update user list
});

// Typing indicator update
socket.on('typing-update', (data) => {
  // Show/hide typing indicator
});

// Message reactions
socket.on('message-reaction', (data) => {
  // Update message reactions
});
```

## 🚀 Deployment

### Environment Variables
```bash
# Production settings
NODE_ENV=production
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="secure-secret"
NEXTAUTH_URL="https://yourdomain.com"

# File storage
CLOUDINARY_CLOUD_NAME="production-cloud"
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."

# Optional: Redis for scaling
REDIS_URL="redis://..."

# Socket.IO settings
SOCKET_CORS_ORIGIN="https://yourdomain.com"
```

### Scaling Considerations
- Use Redis adapter for multi-server Socket.IO
- Implement message queuing for reliability
- CDN for file attachments
- Database read replicas for message history
- Horizontal pod autoscaling

### Performance Optimization
- Message pagination and virtual scrolling
- Image/video compression
- Connection pooling
- Caching frequently accessed rooms
- Background jobs for notifications

## 🛠️ Development

### Adding New Message Types
```javascript
// 1. Add to enum in schema.prisma
enum MessageType {
  TEXT
  IMAGE
  VIDEO
  AUDIO
  FILE
  STICKER
  GIF
  LOCATION  // New type
  POLL      // New type
}

// 2. Handle in API
function handleMessage(messageData) {
  switch(messageData.type) {
    case 'LOCATION':
      return processLocationMessage(messageData);
    case 'POLL':
      return processPollMessage(messageData);
    default:
      return processTextMessage(messageData);
  }
}

// 3. Update UI components
function MessageContent({ message }) {
  switch(message.type) {
    case 'LOCATION':
      return <LocationMessage data={message.metadata} />;
    case 'POLL':
      return <PollMessage data={message.metadata} />;
    default:
      return <TextMessage content={message.content} />;
  }
}
```

### Custom Integrations
- Slack/Discord bot integration
- Email notifications
- Calendar integration for meeting scheduling
- AI-powered message suggestions
- Translation services
- Voice/video calling integration

## 📚 Additional Resources

- [Socket.IO Documentation](https://socket.io/docs/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [NextAuth.js Guide](https://next-auth.js.org/getting-started/introduction)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request with detailed description

## 📄 License

This chat system is part of the sysrot-hub template and follows the same license terms.

---

## 🎯 Next Steps

After setting up the basic chat system, consider implementing:

1. **Voice/Video Calling** with WebRTC
2. **Screen Sharing** for collaboration
3. **Message Encryption** for enhanced security
4. **Bot Framework** for automated responses
5. **Advanced Search** with full-text indexing
6. **Message Templates** for common responses
7. **Workflow Integration** with project management tools
8. **AI Moderation** for content filtering

The chat system provides a solid foundation that can be extended with additional features based on your specific requirements.