import Link from 'next/link'
import { motion } from 'framer-motion'
import Layout from '../../components/ui/layout'

interface ExampleCard {
  title: string
  description: string
  icon: string
  href: string
  category: 'core' | 'business' | 'productivity' | 'showcase'
  tags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

const EXAMPLES: ExampleCard[] = [
  // Core Examples
  {
    title: "AI Integration",
    description: "Multi-model AI integration with GPT-4o, Claude 3.5 Sonnet, and Gemini Flash Pro",
    icon: "🤖",
    href: "/ejemplos/ai",
    category: "core",
    tags: ["OpenAI", "Anthropic", "Google", "Streaming"],
    difficulty: "intermediate"
  },
  {
    title: "Authentication",
    description: "Complete authentication system with NextAuth.js and multiple providers",
    icon: "🔐",
    href: "/ejemplos/auth",
    category: "core",
    tags: ["NextAuth", "OAuth", "Sessions", "Security"],
    difficulty: "intermediate"
  },
  {
    title: "File Upload",
    description: "Drag & drop file upload with Cloudinary integration and image optimization",
    icon: "📤",
    href: "/ejemplos/upload",
    category: "core",
    tags: ["Cloudinary", "Drag & Drop", "Images", "CDN"],
    difficulty: "beginner"
  },
  {
    title: "Form Validation",
    description: "Advanced form validation with React Hook Form, Zod, and real-time feedback",
    icon: "📋",
    href: "/ejemplos/formularios",
    category: "core",
    tags: ["React Hook Form", "Zod", "Validation", "TypeScript"],
    difficulty: "intermediate"
  },
  {
    title: "Animations",
    description: "60+ smooth animations with Framer Motion, CSS3, and micro-interactions",
    icon: "🎬",
    href: "/ejemplos/animaciones",
    category: "showcase",
    tags: ["Framer Motion", "CSS3", "Micro-interactions", "Performance"],
    difficulty: "advanced"
  },
  {
    title: "Component Library",
    description: "50+ production-ready UI components organized in 6 categories",
    icon: "🎨",
    href: "/ejemplos/componentes",
    category: "showcase",
    tags: ["UI Components", "Design System", "TailwindCSS", "Responsive"],
    difficulty: "beginner"
  },
  {
    title: "Notifications",
    description: "Advanced notification system with toast messages and custom alerts",
    icon: "🔔",
    href: "/ejemplos/notificaciones",
    category: "core",
    tags: ["React Hot Toast", "Notifications", "Alerts", "UX"],
    difficulty: "beginner"
  },
  {
    title: "Database Integration",
    description: "Multi-database support with MongoDB, Supabase, and Firebase examples",
    icon: "🗄️",
    href: "/ejemplos/database",
    category: "core",
    tags: ["MongoDB", "Supabase", "Firebase", "Prisma"],
    difficulty: "advanced"
  },
  {
    title: "Theme System",
    description: "Complete theme system with dark/light modes and custom color schemes",
    icon: "🌓",
    href: "/ejemplos/ui-temas",
    category: "showcase",
    tags: ["Next Themes", "Dark Mode", "CSS Variables", "Customization"],
    difficulty: "intermediate"
  },
  {
    title: "TypeScript Features",
    description: "Advanced TypeScript patterns, types, and best practices demonstration",
    icon: "⚡",
    href: "/ejemplos/typescript",
    category: "showcase",
    tags: ["TypeScript", "Generics", "Type Safety", "Best Practices"],
    difficulty: "advanced"
  },

  // New Business & Productivity Examples
  {
    title: "Analytics Dashboard",
    description: "Comprehensive analytics dashboard with Chart.js, real-time data, and KPI tracking",
    icon: "📊",
    href: "/ejemplos/dashboard-analytics",
    category: "business",
    tags: ["Chart.js", "Analytics", "KPIs", "Real-time"],
    difficulty: "advanced"
  },
  {
    title: "E-commerce Store",
    description: "Complete e-commerce solution with shopping cart, product filtering, and checkout",
    icon: "🛍️",
    href: "/ejemplos/ecommerce",
    category: "business",
    tags: ["Shopping Cart", "Products", "Filters", "Local Storage"],
    difficulty: "intermediate"
  },
  {
    title: "Personal Portfolio",
    description: "Modern responsive portfolio with smooth scrolling, animations, and contact forms",
    icon: "👨‍💻",
    href: "/ejemplos/portfolio",
    category: "showcase",
    tags: ["Portfolio", "Parallax", "Scroll Animations", "Contact"],
    difficulty: "intermediate"
  },
  {
    title: "Task Manager",
    description: "Full-featured task management app with local storage, categories, and priorities",
    icon: "📝",
    href: "/ejemplos/task-app",
    category: "productivity",
    tags: ["Tasks", "Local Storage", "Filters", "Categories"],
    difficulty: "intermediate"
  },
  {
    title: "Real-time Chat",
    description: "Modern chat interface with WebSocket support, typing indicators, and emoji reactions",
    icon: "💬",
    href: "/ejemplos/chat-app",
    category: "productivity",
    tags: ["WebSocket", "Real-time", "Chat", "Emoji"],
    difficulty: "advanced"
  },
  {
    title: "SaaS Landing Page",
    description: "Professional SaaS landing page with pricing tables, testimonials, and CTA sections",
    icon: "🚀",
    href: "/ejemplos/saas-landing",
    category: "business",
    tags: ["SaaS", "Landing Page", "Pricing", "Marketing"],
    difficulty: "intermediate"
  },
  {
    title: "Marketplace Platform",
    description: "Multi-vendor marketplace with ratings, reviews, seller profiles, and product search",
    icon: "🏪",
    href: "/ejemplos/marketplace",
    category: "business",
    tags: ["Marketplace", "Ratings", "Reviews", "Multi-vendor"],
    difficulty: "advanced"
  },
  {
    title: "Modern Landing Page",
    description: "Stunning landing page with hero sections, feature highlights, and responsive design",
    icon: "🌟",
    href: "/ejemplos/landing-page",
    category: "showcase",
    tags: ["Landing Page", "Hero Section", "Features", "CTA"],
    difficulty: "beginner"
  }
]

const CATEGORIES = [
  { key: 'core', name: 'Core Features', description: 'Essential functionality and integrations' },
  { key: 'business', name: 'Business Applications', description: 'E-commerce, analytics, and SaaS examples' },
  { key: 'productivity', name: 'Productivity Tools', description: 'Task management and collaboration apps' },
  { key: 'showcase', name: 'UI Showcase', description: 'Beautiful interfaces and design systems' }
]

const DIFFICULTY_COLORS = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
}

export default function ExamplesIndex() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              🎯 Interactive Examples
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Explore our comprehensive collection of functional examples. Each example includes 
              complete source code, step-by-step documentation, and best practices.
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">📚</span>
                <span><strong>{EXAMPLES.length}</strong> Examples</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🎨</span>
                <span><strong>50+</strong> Components</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🔧</span>
                <span><strong>10+</strong> Integrations</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">📖</span>
                <span><strong>100%</strong> Documented</span>
              </div>
            </div>
          </motion.div>

          {/* Categories */}
          {CATEGORIES.map((category, categoryIndex) => {
            const categoryExamples = EXAMPLES.filter(example => example.category === category.key)
            
            return (
              <motion.section
                key={category.key}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
                className="mb-16"
              >
                {/* Category Header */}
                <div className="mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {category.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    {category.description}
                  </p>
                </div>

                {/* Examples Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryExamples.map((example, index) => (
                    <ExampleCard
                      key={example.href}
                      example={example}
                      index={index}
                    />
                  ))}
                </div>
              </motion.section>
            )
          })}

          {/* Footer CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-20 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              🚀 Ready to Build Something Amazing?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              All examples include complete source code, detailed documentation, and can be 
              easily customized for your projects. Start exploring and building today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/docs"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                         transition-colors font-medium"
              >
                📖 View Documentation
              </Link>
              <Link
                href="https://github.com/rotosaurio/sysrotcore"
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 
                         text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 
                         dark:hover:bg-gray-700 transition-colors font-medium"
              >
                🐙 GitHub Repository
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}

// Example Card Component
interface ExampleCardProps {
  example: ExampleCard
  index: number
}

function ExampleCard({ example, index }: ExampleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Link href={example.href}>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl 
                        transition-all duration-300 overflow-hidden border border-gray-200 
                        dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600">
          {/* Header */}
          <div className="p-6 pb-4">
            <div className="flex items-start justify-between mb-3">
              <div className="text-3xl">{example.icon}</div>
              <span className={`px-2 py-1 text-xs font-medium rounded ${DIFFICULTY_COLORS[example.difficulty]}`}>
                {example.difficulty}
              </span>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 
                           group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {example.title}
            </h3>
            
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {example.description}
            </p>
          </div>

          {/* Tags */}
          <div className="px-6 pb-6">
            <div className="flex flex-wrap gap-2">
              {example.tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 
                           text-gray-600 dark:text-gray-300 rounded"
                >
                  {tag}
                </span>
              ))}
              {example.tags.length > 3 && (
                <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 
                               text-gray-500 dark:text-gray-400 rounded">
                  +{example.tags.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 
                          group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">
                View Example
              </span>
              <span className="text-blue-600 dark:text-blue-400 group-hover:translate-x-1 
                             transition-transform">
                →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
} 