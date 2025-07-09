import { useState, useRef, useEffect } from 'react';
import { AIPrompt } from '@/components/ai/openai-prompt';
import { useTranslation } from '@/components/providers/intl-provider';
import { 
  SparklesIcon, 
  PaperAirplaneIcon, 
  TrashIcon, 
  DocumentDuplicateIcon,
  AdjustmentsHorizontalIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  ClockIcon,
  BookOpenIcon,
  LanguageIcon,
  CodeBracketIcon,
  LightBulbIcon,
  CpuChipIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  model?: string;
  timestamp: Date;
  tokens?: number;
}

interface AIModel {
  id: string;
  name: string;
  provider: string;
  icon: string;
  description: string;
  strengths: string[];
  maxTokens: number;
  color: string;
}

const aiModels: AIModel[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    icon: '🟢',
    description: 'Most advanced reasoning and multimodal capabilities',
    strengths: ['Reasoning', 'Code', 'Analysis', 'Multimodal'],
    maxTokens: 4096,
    color: 'green'
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    icon: '🟣',
    description: 'Superior reasoning and safety-focused responses',
    strengths: ['Reasoning', 'Safety', 'Writing', 'Analysis'],
    maxTokens: 4096,
    color: 'purple'
  },
  {
    id: 'gemini-flash-pro',
    name: 'Gemini Flash Pro',
    provider: 'Google',
    icon: '🔵',
    description: 'Fast responses with excellent multimodal support',
    strengths: ['Speed', 'Multimodal', 'Efficiency', 'Scale'],
    maxTokens: 2048,
    color: 'blue'
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1',
    provider: 'DeepSeek',
    icon: '🟠',
    description: 'Open-source model with strong mathematical reasoning',
    strengths: ['Math', 'Science', 'Open Source', 'Research'],
    maxTokens: 2048,
    color: 'orange'
  }
];

const promptExamples = [
  {
    category: 'creative',
    title: 'Creative Writing',
    prompts: [
      'Write a short story about a time traveler who meets their future self',
      'Create a poem about artificial intelligence and human creativity',
      'Design a character for a sci-fi novel with unique abilities'
    ]
  },
  {
    category: 'technical',
    title: 'Technical Assistance',
    prompts: [
      'Explain the difference between REST and GraphQL APIs',
      'Help me debug this React component that won\'t re-render',
      'Write a Python function to calculate fibonacci numbers efficiently'
    ]
  },
  {
    category: 'analysis',
    title: 'Data Analysis',
    prompts: [
      'Analyze the pros and cons of remote work in tech companies',
      'Compare different machine learning algorithms for classification',
      'Summarize the key trends in web development for 2024'
    ]
  },
  {
    category: 'translation',
    title: 'Translation & Languages',
    prompts: [
      'Translate this text to Spanish and explain cultural nuances',
      'Help me learn Japanese: basic conversation phrases',
      'Explain the etymology of common programming terms'
    ]
  }
];

export default function AIPage() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedModel, setSelectedModel] = useState(aiModels[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'examples' | 'settings'>('chat');
  const [showConfig, setShowConfig] = useState(false);
  
  // AI Parameters
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1000);
  const [systemPrompt, setSystemPrompt] = useState('You are a helpful AI assistant that provides accurate and thoughtful responses.');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Simulate AI response (replace with actual API call)
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
          model: selectedModel.id,
          temperature,
          max_tokens: maxTokens,
          system: systemPrompt
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'I apologize, but I couldn\'t generate a response. Please try again.',
        model: selectedModel.name,
        timestamp: new Date(),
        tokens: data.tokens || 0
      };

      setMessages(prev => [...prev, assistantMessage]);
      toast.success(t('components.ai.success', { model: selectedModel.name }));
    } catch (error) {
      console.error('AI Error:', error);
      toast.error(t('components.ai.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearConversation = () => {
    setMessages([]);
    toast.success(t('components.ai.clearHistory'));
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success(t('common.copied'));
  };

  const usePromptExample = (prompt: string) => {
    setInputMessage(prompt);
    setActiveTab('chat');
    inputRef.current?.focus();
  };

  const regenerateResponse = async (messageIndex: number) => {
    if (messageIndex === 0 || messages[messageIndex].role !== 'assistant') return;
    
    const userMessage = messages[messageIndex - 1];
    const conversationUntilUser = messages.slice(0, messageIndex - 1);
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...conversationUntilUser, userMessage].map(m => ({ role: m.role, content: m.content })),
          model: selectedModel.id,
          temperature,
          max_tokens: maxTokens,
          system: systemPrompt
        })
      });

      if (!response.ok) throw new Error('Failed to regenerate response');

      const data = await response.json();
      
      const newMessages = [...messages];
      newMessages[messageIndex] = {
        ...newMessages[messageIndex],
        content: data.response || 'I apologize, but I couldn\'t generate a response. Please try again.',
        timestamp: new Date(),
        tokens: data.tokens || 0
      };
      
      setMessages(newMessages);
      toast.success(t('components.ai.regenerate'));
    } catch (error) {
      toast.error(t('components.ai.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const getModelColor = (model: AIModel) => {
    const colors = {
      green: 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-300',
      purple: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20 dark:text-purple-300',
      blue: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300',
      orange: 'text-orange-600 bg-orange-100 dark:bg-orange-900/20 dark:text-orange-300'
    };
    return colors[model.color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="container mx-auto max-w-7xl py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          {t('pages.ai.title')}
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {t('pages.ai.description')}
        </p>
      </div>

      {/* Model Selection */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <CpuChipIcon className="w-5 h-5 mr-2" />
          {t('pages.ai.availableModels')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {aiModels.map((model) => (
            <button
              key={model.id}
              onClick={() => setSelectedModel(model)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                selectedModel.id === model.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">{model.icon}</span>
                <div>
                  <h3 className="font-semibold text-sm">{model.name}</h3>
                  <p className="text-xs text-muted-foreground">{model.provider}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{model.description}</p>
              <div className="flex flex-wrap gap-1">
                {model.strengths.slice(0, 2).map((strength) => (
                  <span key={strength} className={`px-2 py-0.5 rounded-full text-xs font-medium ${getModelColor(model)}`}>
                    {strength}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-8">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
            activeTab === 'chat' 
              ? 'bg-white dark:bg-gray-700 text-blue-600 shadow' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <ChatBubbleLeftRightIcon className="w-5 h-5" />
          <span className="font-medium">{t('pages.ai.chat.title')}</span>
        </button>
        <button
          onClick={() => setActiveTab('examples')}
          className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
            activeTab === 'examples' 
              ? 'bg-white dark:bg-gray-700 text-blue-600 shadow' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <BookOpenIcon className="w-5 h-5" />
          <span className="font-medium">{t('pages.ai.examples.title')}</span>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
            activeTab === 'settings' 
              ? 'bg-white dark:bg-gray-700 text-blue-600 shadow' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <AdjustmentsHorizontalIcon className="w-5 h-5" />
          <span className="font-medium">{t('pages.ai.configuration')}</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl border shadow-lg h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{selectedModel.icon}</span>
                  <div>
                    <h3 className="font-semibold">{t('pages.ai.chat.title')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('pages.ai.chat.subtitle')} - {selectedModel.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    {messages.length} messages
                  </span>
                  <button
                    onClick={clearConversation}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title={t('pages.ai.chat.clear')}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <SparklesIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 mb-2">
                      {t('pages.ai.chat.subtitle')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Try asking something or use the examples in the sidebar
                    </p>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {message.role === 'assistant' && (
                              <span className="text-sm">{selectedModel.icon}</span>
                            )}
                            <span className="text-sm font-medium">
                              {message.role === 'user' ? 'You' : message.model}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 ml-4">
                            <button
                              onClick={() => copyMessage(message.content)}
                              className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-opacity"
                              title={t('components.ai.copyResponse')}
                            >
                              <DocumentDuplicateIcon className="w-3 h-3" />
                            </button>
                            {message.role === 'assistant' && (
                              <button
                                onClick={() => regenerateResponse(index)}
                                disabled={isLoading}
                                className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-opacity disabled:opacity-50"
                                title={t('components.ai.regenerate')}
                              >
                                <ArrowPathIcon className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                          <span>{message.timestamp.toLocaleTimeString()}</span>
                          {message.tokens && (
                            <span>{message.tokens} tokens</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-end space-x-3">
                  <div className="flex-1">
                    <textarea
                      ref={inputRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={t('pages.ai.chat.placeholder')}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl resize-none bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <PaperAirplaneIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Examples */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border">
              <h3 className="font-semibold mb-4 flex items-center">
                <LightBulbIcon className="w-5 h-5 mr-2 text-yellow-500" />
                Quick Examples
              </h3>
              <div className="space-y-2">
                {[
                  'Explain quantum computing in simple terms',
                  'Write a haiku about programming',
                  'Help me debug a React component',
                  'Compare Python vs JavaScript'
                ].map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => usePromptExample(prompt)}
                    className="w-full text-left p-3 text-sm bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Model Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border">
              <h3 className="font-semibold mb-4 flex items-center">
                <ChartBarIcon className="w-5 h-5 mr-2 text-blue-500" />
                Current Model
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{selectedModel.icon}</span>
                  <div>
                    <p className="font-medium">{selectedModel.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedModel.provider}</p>
                  </div>
                </div>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Max Tokens:</span> {selectedModel.maxTokens}</p>
                  <p><span className="font-medium">Temperature:</span> {temperature}</p>
                  <p><span className="font-medium">Response Length:</span> {maxTokens}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedModel.strengths.map((strength) => (
                    <span key={strength} className={`px-2 py-1 rounded-full text-xs font-medium ${getModelColor(selectedModel)}`}>
                      {strength}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Conversation Stats */}
            {messages.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border">
                <h3 className="font-semibold mb-4 flex items-center">
                  <ClockIcon className="w-5 h-5 mr-2 text-green-500" />
                  Session Stats
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Messages:</span>
                    <span className="font-medium">{messages.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>User:</span>
                    <span className="font-medium">{messages.filter(m => m.role === 'user').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Assistant:</span>
                    <span className="font-medium">{messages.filter(m => m.role === 'assistant').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Tokens:</span>
                    <span className="font-medium">
                      {messages.reduce((acc, m) => acc + (m.tokens || 0), 0)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'examples' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {promptExamples.map((category) => (
            <div key={category.category} className="bg-white dark:bg-gray-800 rounded-xl p-6 border">
              <div className="flex items-center mb-4">
                {category.category === 'creative' && <LightBulbIcon className="w-6 h-6 mr-3 text-yellow-500" />}
                {category.category === 'technical' && <CodeBracketIcon className="w-6 h-6 mr-3 text-blue-500" />}
                {category.category === 'analysis' && <ChartBarIcon className="w-6 h-6 mr-3 text-green-500" />}
                {category.category === 'translation' && <LanguageIcon className="w-6 h-6 mr-3 text-purple-500" />}
                <h3 className="text-xl font-semibold">{t(`pages.ai.examples.${category.category}`)}</h3>
              </div>
              <div className="space-y-3">
                {category.prompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => usePromptExample(prompt)}
                    className="w-full text-left p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
                  >
                    <p className="text-sm">{prompt}</p>
                    <span className="text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to use this prompt →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* AI Parameters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border">
              <h3 className="text-xl font-semibold mb-6">AI Parameters</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('pages.ai.chat.temperature')}: {temperature}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Controls randomness. Lower = more focused, Higher = more creative
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('pages.ai.chat.maxTokens')}: {maxTokens}
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="4000"
                    step="100"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Maximum length of AI responses
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('pages.ai.chat.systemPrompt')}
                  </label>
                  <textarea
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
                    rows={4}
                    placeholder="System prompt to guide AI behavior..."
                  />
                </div>
              </div>
            </div>

            {/* Features & Info */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border">
                <h3 className="text-xl font-semibold mb-4">{t('pages.ai.features')}</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">{t('pages.ai.features.streaming')}</h4>
                      <p className="text-sm text-muted-foreground">{t('pages.ai.features.streamingDesc')}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">{t('pages.ai.features.context')}</h4>
                      <p className="text-sm text-muted-foreground">{t('pages.ai.features.contextDesc')}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">{t('pages.ai.features.multimodel')}</h4>
                      <p className="text-sm text-muted-foreground">{t('pages.ai.features.multimodelDesc')}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border">
                <h3 className="text-lg font-semibold mb-4">{t('pages.ai.configuration')}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('pages.ai.configDescription')}
                </p>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded font-mono text-sm space-y-1">
                  <div>OPENAI_API_KEY=your_openai_key</div>
                  <div>GOOGLE_API_KEY=your_google_key</div>
                  <div>ANTHROPIC_API_KEY=your_anthropic_key</div>
                  <div>DEEPSEEK_API_KEY=your_deepseek_key</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Implementation Info */}
      <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-8">
        <h2 className="text-2xl font-semibold mb-6">{t('pages.ai.implementation')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border">
            <h3 className="font-semibold mb-3">Multi-Provider Support</h3>
            <p className="text-sm text-muted-foreground mb-4">{t('pages.ai.implementationDescription')}</p>
            <code className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded block">
              pages/api/ai.ts
            </code>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border">
            <h3 className="font-semibold mb-3">Chat Interface</h3>
            <p className="text-sm text-muted-foreground mb-4">Real-time chat with conversation history</p>
            <code className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded block">
              components/ai/chat-interface.tsx
            </code>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border">
            <h3 className="font-semibold mb-3">Parameter Controls</h3>
            <p className="text-sm text-muted-foreground mb-4">Fine-tune AI behavior with advanced settings</p>
            <code className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded block">
              Temperature, Max Tokens, System Prompts
            </code>
          </div>
        </div>
      </div>
    </div>
  );
} 