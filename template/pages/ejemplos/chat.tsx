import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeftIcon, PaperAirplaneIcon, UserIcon, EllipsisVerticalIcon } from '@/components/ui/icons';
import { io, Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: Date;
  type: 'message' | 'system';
  avatar?: string;
  reactions?: { emoji: string; count: number; users: string[] }[];
}

interface User {
  id: string;
  username: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: Date;
  role?: 'admin' | 'moderator' | 'user';
}

const mockUsers: User[] = [
  { id: '1', username: 'Ana García', avatar: '👩‍💻', status: 'online', role: 'admin' },
  { id: '2', username: 'Carlos López', avatar: '👨‍🎨', status: 'online', role: 'moderator' },
  { id: '3', username: 'María Rodríguez', avatar: '👩‍🔬', status: 'away', role: 'user' },
  { id: '4', username: 'José Martín', avatar: '👨‍💼', status: 'online', role: 'user' },
  { id: '5', username: 'Laura Sánchez', avatar: '👩‍🚀', status: 'offline', role: 'user', lastSeen: new Date(Date.now() - 30 * 60 * 1000) },
  { id: '6', username: 'David Chen', avatar: '👨‍🔬', status: 'online', role: 'user' },
  { id: '7', username: 'Sophie Martin', avatar: '👩‍🎨', status: 'away', role: 'user' }
];

const initialMessages: Message[] = [
  {
    id: '1',
    userId: '1',
    username: 'Ana García',
    content: '¡Hola equipo! 🚀 ¿Listos para nuestra daily standup?',
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
    type: 'message',
    avatar: '👩‍💻',
    reactions: [{ emoji: '👍', count: 3, users: ['2', '4', '6'] }]
  },
  {
    id: '2',
    userId: '2',
    username: 'Carlos López',
    content: 'Terminé el redesign de la homepage. Los nuevos componentes están listos para review 🎨',
    timestamp: new Date(Date.now() - 7 * 60 * 1000),
    type: 'message',
    avatar: '👨‍🎨',
    reactions: [
      { emoji: '🔥', count: 2, users: ['1', '4'] },
      { emoji: '✨', count: 1, users: ['6'] }
    ]
  },
  {
    id: '3',
    userId: 'system',
    username: 'Sistema',
    content: 'María Rodríguez se ha unido al canal #desarrollo',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    type: 'system'
  },
  {
    id: '4',
    userId: '3',
    username: 'María Rodríguez',
    content: '¡Perfecto timing! 💻 Necesito revisar las APIs antes del deploy. ¿Alguien puede hacer pair programming?',
    timestamp: new Date(Date.now() - 4 * 60 * 1000),
    type: 'message',
    avatar: '👩‍🔬'
  },
  {
    id: '5',
    userId: '4',
    username: 'José Martín',
    content: 'Yo puedo ayudarte con las APIs María! 🤝 Tengo tiempo libre en 30 minutos',
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    type: 'message',
    avatar: '👨‍💼'
  }
];

// Mock Socket.IO client for demonstration
class MockSocket {
  private listeners: { [event: string]: Function[] } = {};
  
  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }
  
  emit(event: string, data: any) {
    // Simulate server response delay
    setTimeout(() => {
      if (event === 'send_message') {
        const message: Message = {
          id: uuidv4(),
          userId: 'current-user',
          username: 'Tú',
          content: data.content,
          timestamp: new Date(),
          type: 'message',
          avatar: '😊'
        };
        
        // Trigger message received event
        if (this.listeners['message_received']) {
          this.listeners['message_received'].forEach(callback => callback(message));
        }
        
        // Simulate other users responding occasionally
        if (Math.random() > 0.6) {
          setTimeout(() => {
            const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
            const responses = [
              '¡Excelente punto! 💡',
              'Totalmente de acuerdo 👍',
              'Interesante perspectiva 🤔',
              '¿Podríamos hacer una videollamada para discutir esto? 📹',
              'Me parece una gran idea 🚀',
              'Voy a revisar eso ahora mismo ⚡',
              'Sounds good! Let\'s sync up later 🤝',
              'Perfect! I\'ll update the docs 📚'
            ];
            
            const response: Message = {
              id: uuidv4(),
              userId: randomUser.id,
              username: randomUser.username,
              content: responses[Math.floor(Math.random() * responses.length)],
              timestamp: new Date(),
              type: 'message',
              avatar: randomUser.avatar
            };
            
            if (this.listeners['message_received']) {
              this.listeners['message_received'].forEach(callback => callback(response));
            }
          }, 1000 + Math.random() * 4000);
        }
      }
    }, 100);
  }
  
  disconnect() {
    this.listeners = {};
  }
}

export default function RealtimeChat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [socket, setSocket] = useState<MockSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [users] = useState<User[]>(mockUsers);
  const [showCode, setShowCode] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const addNotification = (message: string) => {
    setNotifications((prev: string[]) => [...prev, message]);
    setTimeout(() => {
      setNotifications((prev: string[]) => prev.slice(1));
    }, 3000);
  };

  const CodeBlock = ({ title, code }: { title: string; code: string }) => (
    <div className="bg-gray-900 rounded-xl p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-green-400 font-mono text-sm">{title}</h4>
        <button
          onClick={() => {
            navigator.clipboard.writeText(code);
            addNotification('Código copiado al portapapeles! 💻');
          }}
          className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
        >
          Copiar
        </button>
      </div>
      <pre className="text-gray-300 text-sm overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );

  function MessageBubble({ message, isOwn }: { message: Message; isOwn: boolean }) {
    const formatTime = (date: Date) => {
      return date.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    };

    if (message.type === 'system') {
      return (
        <div className="flex justify-center my-6">
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 text-sm px-6 py-3 rounded-full border border-blue-200 dark:border-blue-800 backdrop-blur-sm">
            <span className="mr-2">🔔</span>
            {message.content}
          </div>
        </div>
      );
    }

    return (
      <div className={`flex mb-6 ${isOwn ? 'justify-end' : 'justify-start'} group`}>
        <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
          {!isOwn && (
            <div className="flex items-center space-x-2 mb-2">
              <div className="text-lg">{message.avatar}</div>
              <span className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                {message.username}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatTime(message.timestamp)}
              </span>
            </div>
          )}
          
          <div className={`relative px-4 py-3 rounded-2xl shadow-sm transition-all duration-300 group-hover:shadow-md ${
            isOwn 
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white ml-8' 
              : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600'
          }`}>
            <div className="text-sm leading-relaxed">
              {message.content}
            </div>
            
            {isOwn && (
              <div className="text-xs mt-2 text-blue-100">
                {formatTime(message.timestamp)}
              </div>
            )}
            
            {/* Message reactions */}
            {message.reactions && message.reactions.length > 0 && (
              <div className="flex space-x-1 mt-3">
                {message.reactions.map((reaction, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center space-x-1 bg-gray-100 dark:bg-gray-600 rounded-full px-2 py-1 text-xs cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                  >
                    <span>{reaction.emoji}</span>
                    <span className="text-gray-600 dark:text-gray-300">{reaction.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  function UserList({ users }: { users: User[] }) {
    const statusColors = {
      online: 'bg-green-400',
      away: 'bg-yellow-400',
      offline: 'bg-gray-400'
    };

    const statusText = {
      online: 'En línea',
      away: 'Ausente',
      offline: 'Desconectado'
    };

    const roleColors = {
      admin: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
      moderator: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      user: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    };

    const roleIcons = {
      admin: '👑',
      moderator: '⚡',
      user: '👤'
    };

    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-r border-gray-200/50 dark:border-gray-700/50 w-80 hidden lg:block">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">
              Team Chat
            </h3>
            <button
              onClick={() => setShowCode(showCode === 'users' ? null : 'users')}
              className="p-2 text-purple-600 hover:text-purple-700 dark:text-purple-400 transition-colors"
            >
              <span className="text-sm">📝</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-700 dark:text-green-300 font-medium text-sm">
              {users.filter(u => u.status === 'online').length} usuarios activos
            </span>
          </div>
        </div>
        
        <div className="overflow-y-auto h-full p-2">
          {users.map((user) => (
            <div 
              key={user.id} 
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 rounded-xl mx-2 mb-2 group cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
                    {user.avatar}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${statusColors[user.status]}`}></div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <div className="font-semibold text-gray-900 dark:text-white truncate">
                      {user.username}
                    </div>
                    {user.role && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                        {roleIcons[user.role]}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 text-xs">
                    <span className={`${
                      user.status === 'online' ? 'text-green-600 dark:text-green-400' :
                      user.status === 'away' ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-gray-500 dark:text-gray-400'
                    }`}>
                      {statusText[user.status]}
                    </span>
                    
                    {user.status === 'offline' && user.lastSeen && (
                      <span className="text-gray-400">
                        • {new Date(user.lastSeen).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {showCode === 'users' && (
            <div className="mx-2">
              <CodeBlock
                title="UserList Component"
                code={`// Componente de lista de usuarios
function UserList({ users }) {
  const statusColors = {
    online: 'bg-green-400',
    away: 'bg-yellow-400', 
    offline: 'bg-gray-400'
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm border-r w-80">
      <div className="p-6 border-b">
        <h3 className="font-bold text-gray-900">Team Chat</h3>
        <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-700 font-medium">
            {users.filter(u => u.status === 'online').length} usuarios activos
          </span>
        </div>
      </div>
      
      <div className="overflow-y-auto p-2">
        {users.map((user) => (
          <div key={user.id} className="p-4 hover:bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="text-2xl">{user.avatar}</div>
                <div className={\`absolute -bottom-1 -right-1 w-4 h-4 rounded-full \${statusColors[user.status]}\`}></div>
              </div>
              <div className="flex-1">
                <div className="font-semibold">{user.username}</div>
                <div className="text-xs text-gray-500">{user.status}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}`}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  function ChatInput({ onSendMessage }: { onSendMessage: (content: string) => void }) {
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (message.trim()) {
        onSendMessage(message.trim());
        setMessage('');
        setIsTyping(false);
      }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setMessage(e.target.value);
      if (!isTyping && e.target.value) {
        setIsTyping(true);
      } else if (isTyping && !e.target.value) {
        setIsTyping(false);
      }
    };

    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200/50 dark:border-gray-700/50 p-6">
        {typingUsers.length > 0 && (
          <div className="flex items-center space-x-2 mb-3 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span>
              {typingUsers.join(', ')} {typingUsers.length === 1 ? 'está' : 'están'} escribiendo...
            </span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Escribe un mensaje... 💬"
              className="w-full px-6 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 text-sm"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              <button
                type="button"
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                onClick={() => addNotification('Feature de emojis coming soon! 😊')}
              >
                <span className="text-lg">😊</span>
              </button>
              <button
                type="button"
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                onClick={() => addNotification('Feature de archivos coming soon! 📎')}
              >
                <span className="text-lg">📎</span>
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={!message.trim()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    );
  }

  useEffect(() => {
    // Initialize mock socket
    const mockSocket = new MockSocket();
    setSocket(mockSocket);
    setIsConnected(true);

    // Listen for incoming messages
    mockSocket.on('message_received', (message: Message) => {
      setMessages(prev => [...prev, message]);
      if (message.userId !== 'current-user') {
        setTypingUsers(prev => [...prev, message.username]);
        setTimeout(() => {
          setTypingUsers(prev => prev.filter(u => u !== message.username));
        }, 3000); // Clear typing indicator after 3 seconds
      }
    });

    // Simulate connection events
    setTimeout(() => {
      const systemMessage: Message = {
        id: uuidv4(),
        userId: 'system',
        username: 'Sistema',
        content: 'Te has conectado al chat',
        timestamp: new Date(),
        type: 'system'
      };
      setMessages(prev => [...prev, systemMessage]);
    }, 1000);

    return () => {
      mockSocket.disconnect();
      setIsConnected(false);
    };
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (content: string) => {
    if (socket && isConnected) {
      socket.emit('send_message', { content });
    }
  };

  return (
    <>
      <Head>
        <title>Real-time Chat - Full Integration Examples</title>
        <meta name="description" content="Chat en tiempo real con WebSockets" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/30">
        {/* Notificaciones */}
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map((notification, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl shadow-xl backdrop-blur-sm border border-white/20 animate-in slide-in-from-right duration-300"
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                {notification}
              </div>
            </div>
          ))}
        </div>

        {/* Header */}
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <Link href="/ejemplos" className="text-blue-600 hover:text-blue-800 mr-4 transition-colors">
                  <ArrowLeftIcon className="w-5 h-5" />
                </Link>
                <div>
                  <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium mb-2">
                    <span>💬</span>
                    Chat en Tiempo Real
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Team Communication
                  </h1>
                  <div className="flex items-center space-x-3 mt-1">
                    <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                    <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                      {isConnected ? 'Conectado' : 'Desconectado'}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600 dark:text-gray-300 text-sm">
                      {users.filter(u => u.status === 'online').length} activos
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-4">
                  <button
                    onClick={() => setShowCode(showCode === 'socket' ? null : 'socket')}
                    className="flex items-center space-x-2 px-4 py-2 border-2 border-purple-300 dark:border-purple-600 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 text-sm font-medium"
                  >
                    <span>📝</span>
                    <span>{showCode === 'socket' ? 'Ocultar' : 'Ver'} Código</span>
                  </button>
                </div>
                
                <button 
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  onClick={() => addNotification('Configuración próximamente! ⚙️')}
                >
                  <EllipsisVerticalIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl overflow-hidden">
          {showCode === 'socket' && (
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <CodeBlock
                title="Socket.IO Integration - Real-time Chat"
                code={`// Socket.IO Client Setup
import { io, Socket } from 'socket.io-client';

class ChatClient {
  private socket: Socket;
  
  constructor(serverUrl: string) {
    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      autoConnect: true
    });
    
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    // Connection events
    this.socket.on('connect', () => {
      console.log('🟢 Connected to chat server');
      this.updateConnectionStatus(true);
    });
    
    this.socket.on('disconnect', () => {
      console.log('🔴 Disconnected from chat server');
      this.updateConnectionStatus(false);
    });
    
    // Message events
    this.socket.on('message_received', (message) => {
      this.handleNewMessage(message);
      this.playNotificationSound();
    });
    
    // User events
    this.socket.on('user_joined', (user) => {
      this.addUserToList(user);
      this.showSystemMessage(\`\${user.username} se ha unido al chat\`);
    });
    
    this.socket.on('user_left', (user) => {
      this.removeUserFromList(user);
      this.showSystemMessage(\`\${user.username} ha dejado el chat\`);
    });
    
    // Typing indicators
    this.socket.on('user_typing', ({ username, isTyping }) => {
      this.updateTypingIndicator(username, isTyping);
    });
  }
  
  // Send message
  sendMessage(content: string) {
    const message = {
      content,
      timestamp: new Date(),
      userId: this.getCurrentUserId()
    };
    
    this.socket.emit('send_message', message);
  }
  
  // Typing indicator
  sendTypingIndicator(isTyping: boolean) {
    this.socket.emit('typing', {
      userId: this.getCurrentUserId(),
      isTyping
    });
  }
  
  // Join room/channel
  joinRoom(roomId: string) {
    this.socket.emit('join_room', { roomId });
  }
  
  // Leave room/channel
  leaveRoom(roomId: string) {
    this.socket.emit('leave_room', { roomId });
  }
}

// Server Implementation (Node.js + Socket.IO)
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Store connected users
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  // Handle user joining
  socket.on('join_room', ({ roomId, user }) => {
    socket.join(roomId);
    connectedUsers.set(socket.id, { ...user, roomId });
    
    // Notify room about new user
    socket.to(roomId).emit('user_joined', user);
    
    // Send current users list
    const roomUsers = Array.from(connectedUsers.values())
      .filter(u => u.roomId === roomId);
    socket.emit('users_list', roomUsers);
  });
  
  // Handle messages
  socket.on('send_message', (data) => {
    const user = connectedUsers.get(socket.id);
    
    const message = {
      id: generateId(),
      userId: socket.id,
      username: user.username,
      avatar: user.avatar,
      content: data.content,
      timestamp: new Date(),
      type: 'message'
    };
    
    // Broadcast to room
    io.to(user.roomId).emit('message_received', message);
    
    // Store message in database
    saveMessageToDatabase(message);
  });
  
  // Handle typing indicators
  socket.on('typing', ({ isTyping }) => {
    const user = connectedUsers.get(socket.id);
    
    socket.to(user.roomId).emit('user_typing', {
      username: user.username,
      isTyping
    });
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    const user = connectedUsers.get(socket.id);
    
    if (user) {
      socket.to(user.roomId).emit('user_left', user);
      connectedUsers.delete(socket.id);
    }
    
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(4000, () => {
  console.log('Chat server running on port 4000');
});`}
              />
            </div>
          )}
          
          <div className="flex h-[600px] lg:h-[700px]">
            {/* User List */}
            <UserList users={users} />
            
            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white/50 dark:bg-gray-900/50">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">🏢</div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">#desarrollo</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Canal principal del equipo de desarrollo
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button 
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => addNotification('Llamada de voz próximamente! 📞')}
                    >
                      <span className="text-lg">📞</span>
                    </button>
                    <button 
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => addNotification('Video llamada próximamente! 📹')}
                    >
                      <span className="text-lg">📹</span>
                    </button>
                    <button 
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => addNotification('Información del canal próximamente! ℹ️')}
                    >
                      <span className="text-lg">ℹ️</span>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-transparent to-gray-50/30 dark:to-gray-900/30">
                {messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isOwn={message.userId === 'current-user'}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Chat Input */}
              <ChatInput onSendMessage={sendMessage} />
            </div>
          </div>
        </div>

        {/* Documentation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                🚀 Chat en Tiempo Real - Funcionalidades
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl mx-auto">
                Sistema de chat profesional con WebSockets, estados de usuario y experiencia optimizada
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-200/50 dark:border-blue-800/50">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white text-xl">
                    🔌
                  </div>
                  <h3 className="font-bold text-blue-900 dark:text-blue-100 ml-3">
                    WebSocket Real-time
                  </h3>
                </div>
                <ul className="text-blue-800 dark:text-blue-200 space-y-2 text-sm">
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Socket.IO integration</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Instant message delivery</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Connection monitoring</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Auto-reconnection</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Room management</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200/50 dark:border-purple-800/50">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-xl">
                    👥
                  </div>
                  <h3 className="font-bold text-purple-900 dark:text-purple-100 ml-3">
                    User Management
                  </h3>
                </div>
                <ul className="text-purple-800 dark:text-purple-200 space-y-2 text-sm">
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Online status indicators</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>User roles & permissions</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Avatar system</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Last seen timestamps</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Typing indicators</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200/50 dark:border-green-800/50">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white text-xl">
                    ✨
                  </div>
                  <h3 className="font-bold text-green-900 dark:text-green-100 ml-3">
                    UX Features
                  </h3>
                </div>
                <ul className="text-green-800 dark:text-green-200 space-y-2 text-sm">
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Message reactions</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Emoji & file support</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Auto-scroll to bottom</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Responsive design</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Dark mode support</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-xl p-6 border border-orange-200/50 dark:border-orange-800/50">
                <h3 className="font-bold text-orange-900 dark:text-orange-100 mb-4 flex items-center">
                  <span className="text-2xl mr-3">⚡</span>
                  Performance & Scalability
                </h3>
                <ul className="text-orange-800 dark:text-orange-200 space-y-2 text-sm">
                  <li>• Message throttling & rate limiting</li>
                  <li>• Efficient WebSocket connection pooling</li>
                  <li>• Message persistence & history</li>
                  <li>• Optimized for thousands of concurrent users</li>
                  <li>• Redis integration for horizontal scaling</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-indigo-200/50 dark:border-indigo-800/50">
                <h3 className="font-bold text-indigo-900 dark:text-indigo-100 mb-4 flex items-center">
                  <span className="text-2xl mr-3">🔒</span>
                  Security & Moderation
                </h3>
                <ul className="text-indigo-800 dark:text-indigo-200 space-y-2 text-sm">
                  <li>• JWT authentication & authorization</li>
                  <li>• Message encryption in transit</li>
                  <li>• Spam detection & auto-moderation</li>
                  <li>• User blocking & reporting system</li>
                  <li>• Admin tools & monitoring dashboard</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
