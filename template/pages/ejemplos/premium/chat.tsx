import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeftIcon, PaperAirplaneIcon, UserIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { io, Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: Date;
  type: 'message' | 'system';
}

interface User {
  id: string;
  username: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
}

const mockUsers: User[] = [
  { id: '1', username: 'Ana García', avatar: '👩‍💻', status: 'online' },
  { id: '2', username: 'Carlos López', avatar: '👨‍🎨', status: 'online' },
  { id: '3', username: 'María Rodríguez', avatar: '👩‍🔬', status: 'away' },
  { id: '4', username: 'José Martín', avatar: '👨‍💼', status: 'online' },
  { id: '5', username: 'Laura Sánchez', avatar: '👩‍🚀', status: 'offline' }
];

const initialMessages: Message[] = [
  {
    id: '1',
    userId: '1',
    username: 'Ana García',
    content: '¡Hola a todos! ¿Cómo va el proyecto?',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    type: 'message'
  },
  {
    id: '2',
    userId: '2',
    username: 'Carlos López',
    content: 'Todo bien por aquí. Terminé el diseño de la nueva interfaz.',
    timestamp: new Date(Date.now() - 4 * 60 * 1000),
    type: 'message'
  },
  {
    id: '3',
    userId: 'system',
    username: 'Sistema',
    content: 'María Rodríguez se ha unido al chat',
    timestamp: new Date(Date.now() - 3 * 60 * 1000),
    type: 'system'
  },
  {
    id: '4',
    userId: '3',
    username: 'María Rodríguez',
    content: '¡Perfecto! Cuando tengas tiempo, me gustaría revisar los mockups.',
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    type: 'message'
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
          type: 'message'
        };
        
        // Trigger message received event
        if (this.listeners['message_received']) {
          this.listeners['message_received'].forEach(callback => callback(message));
        }
        
        // Simulate other users responding occasionally
        if (Math.random() > 0.7) {
          setTimeout(() => {
            const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
            const responses = [
              '¡Excelente punto!',
              'Totalmente de acuerdo',
              'Interesante perspectiva',
              '¿Podríamos discutir esto en más detalle?',
              'Me parece una buena idea',
              'Voy a revisar eso ahora mismo'
            ];
            
            const response: Message = {
              id: uuidv4(),
              userId: randomUser.id,
              username: randomUser.username,
              content: responses[Math.floor(Math.random() * responses.length)],
              timestamp: new Date(),
              type: 'message'
            };
            
            if (this.listeners['message_received']) {
              this.listeners['message_received'].forEach(callback => callback(response));
            }
          }, 1000 + Math.random() * 3000);
        }
      }
    }, 100);
  }
  
  disconnect() {
    this.listeners = {};
  }
}

function MessageBubble({ message, isOwn }: { message: Message; isOwn: boolean }) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (message.type === 'system') {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm px-4 py-2 rounded-full">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex mb-4 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
        <div className={`px-4 py-2 rounded-lg ${
          isOwn 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
        }`}>
          {!isOwn && (
            <div className="font-semibold text-sm mb-1">
              {message.username}
            </div>
          )}
          <div className="text-sm">
            {message.content}
          </div>
          <div className={`text-xs mt-1 ${
            isOwn ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
          }`}>
            {formatTime(message.timestamp)}
          </div>
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

  return (
    <div className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 w-64 hidden lg:block">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Usuarios en línea ({users.filter(u => u.status === 'online').length})
        </h3>
      </div>
      
      <div className="overflow-y-auto h-full">
        {users.map((user) => (
          <div key={user.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="text-2xl">{user.avatar}</div>
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${statusColors[user.status]}`}></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 dark:text-white truncate">
                  {user.username}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {statusText[user.status]}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatInput({ onSendMessage }: { onSendMessage: (content: string) => void }) {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
      {isTyping && (
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          Alguien está escribiendo...
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Escribe un mensaje..."
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
        <button
          type="submit"
          disabled={!message.trim()}
          className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <PaperAirplaneIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}

export default function RealtimeChat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [socket, setSocket] = useState<MockSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [users] = useState<User[]>(mockUsers);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize mock socket
    const mockSocket = new MockSocket();
    setSocket(mockSocket);
    setIsConnected(true);

    // Listen for incoming messages
    mockSocket.on('message_received', (message: Message) => {
      setMessages(prev => [...prev, message]);
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
        <title>Real-time Chat - Premium Examples</title>
        <meta name="description" content="Chat en tiempo real con WebSockets" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <Link href="/ejemplos/premium" className="text-blue-600 hover:text-blue-800 mr-4">
                  <ArrowLeftIcon className="w-5 h-5" />
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    💬 Real-time Chat
                  </h1>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <span className="text-gray-600 dark:text-gray-300 text-sm">
                      {isConnected ? 'Conectado' : 'Desconectado'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {users.filter(u => u.status === 'online').length} usuarios en línea
                </div>
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <EllipsisVerticalIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 shadow-lg">
          <div className="flex h-96 lg:h-[600px]">
            {/* User List */}
            <UserList users={users} />
            
            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
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
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
              📚 Características del Chat en Tiempo Real
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  WebSocket Integration
                </h3>
                <ul className="text-blue-700 dark:text-blue-300 space-y-1 text-sm">
                  <li>• Socket.IO client implementation</li>
                  <li>• Real-time message delivery</li>
                  <li>• Connection status monitoring</li>
                  <li>• Automatic reconnection</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Chat Features
                </h3>
                <ul className="text-blue-700 dark:text-blue-300 space-y-1 text-sm">
                  <li>• Mensajes en tiempo real</li>
                  <li>• Lista de usuarios en línea</li>
                  <li>• Estados de conexión</li>
                  <li>• Scroll automático</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  UI/UX Elements
                </h3>
                <ul className="text-blue-700 dark:text-blue-300 space-y-1 text-sm">
                  <li>• Burbujas de mensajes</li>
                  <li>• Indicadores de estado</li>
                  <li>• Responsive sidebar</li>
                  <li>• Typing indicators</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                🔧 Implementación del Backend
              </h3>
              <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 text-sm">
                <code className="text-green-600 dark:text-green-400">
                  {`// Ejemplo de servidor Socket.IO
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  socket.on('send_message', (data) => {
    io.emit('message_received', {
      id: generateId(),
      ...data,
      timestamp: new Date()
    });
  });
});`}
                </code>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-3">
                Este ejemplo utiliza un mock client para demostración. En producción, necesitarías un servidor Socket.IO real.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}