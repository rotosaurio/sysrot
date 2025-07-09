import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
  isOwn: boolean;
}

interface User {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
}

export default function ChatExample() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Alice Johnson', avatar: '👩‍💼', isOnline: true },
    { id: '2', name: 'Bob Smith', avatar: '👨‍💻', isOnline: true },
    { id: '3', name: 'Carol Davis', avatar: '👩‍🎨', isOnline: false },
    { id: '4', name: 'David Wilson', avatar: '👨‍🔬', isOnline: true },
  ]);
  const [currentUser] = useState({ id: 'me', name: 'You', avatar: '😊' });
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate WebSocket connection and incoming messages
  useEffect(() => {
    const simulateIncomingMessages = () => {
      const sampleMessages = [
        "Hey! How's the project going?",
        "I just finished the new feature!",
        "Can we schedule a meeting for tomorrow?",
        "The design looks great!",
        "I'm working on the backend integration",
        "Let's catch up later this week",
      ];

      const randomMessage = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
      const randomUser = users[Math.floor(Math.random() * users.length)];

      const newMessage: Message = {
        id: Date.now().toString(),
        text: randomMessage,
        sender: randomUser.name,
        timestamp: new Date(),
        isOwn: false,
      };

      setMessages(prev => [...prev, newMessage]);
    };

    // Simulate incoming messages every 5-15 seconds
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of new message
        simulateIncomingMessages();
      }
    }, Math.random() * 10000 + 5000);

    return () => clearInterval(interval);
  }, [users]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: currentUser.name,
      timestamp: new Date(),
      isOwn: true,
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    toast.success('Message sent!');

    // Simulate typing indicator from other users
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const MessageBubble = ({ message }: { message: Message }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`max-w-xs lg:max-w-md ${message.isOwn ? 'order-2' : 'order-1'}`}>
        {!message.isOwn && (
          <div className="flex items-center mb-1">
            <span className="text-lg mr-2">{users.find(u => u.name === message.sender)?.avatar || '👤'}</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {message.sender}
            </span>
          </div>
        )}
        <div
          className={`px-4 py-2 rounded-lg ${
            message.isOwn
              ? 'bg-blue-600 text-white rounded-br-none'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
          }`}
        >
          <p className="text-sm">{message.text}</p>
          <p className={`text-xs mt-1 ${
            message.isOwn ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
          }`}>
            {formatTime(message.timestamp)}
          </p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                💬 Real-time Chat
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                WebSocket-powered messaging
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Online</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex">
          {/* Users Sidebar */}
          <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Online Users ({users.filter(u => u.isOnline).length})
            </h2>
            <div className="space-y-3">
              {users.map(user => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <div className="relative">
                    <span className="text-2xl">{user.avatar}</span>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
                      user.isOnline ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.isOnline ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              <AnimatePresence>
                {messages.map(message => (
                  <MessageBubble key={message.id} message={message} />
                ))}
              </AnimatePresence>

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start mb-4"
                >
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-lg px-4 py-2 rounded-bl-none">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}