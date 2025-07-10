import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  ArrowLeftIcon,
  CheckIcon,
  StarIcon,
  UserIcon,
  ChevronRightIcon,
  HeartIcon,
  TagIcon,
  TrendingUpIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ChartBarIcon,
  PlusIcon,
  XMarkIcon
} from '@/components/ui/icons';
// Removed framer-motion import to avoid dependency issues

// Portfolio data
const personalInfo = {
  name: 'Alex Rodriguez',
  title: 'Full Stack Developer',
  location: 'Madrid, España',
  email: 'alex.rodriguez@email.com',
  phone: '+34 123 456 789',
  website: 'www.alexdev.com',
  avatar: '👨‍💻',
  bio: 'Desarrollador Full Stack apasionado por crear soluciones web innovadoras. Con más de 5 años de experiencia en React, Node.js y tecnologías modernas.',
  stats: {
    experience: '5+',
    projects: '50+',
    clients: '30+',
    awards: '10+'
  },
  skills: [
    { name: 'React/Next.js', level: 95, category: 'Frontend', color: 'from-blue-500 to-cyan-500' },
    { name: 'Node.js/Express', level: 90, category: 'Backend', color: 'from-green-500 to-emerald-500' },
    { name: 'TypeScript', level: 88, category: 'Language', color: 'from-indigo-500 to-purple-500' },
    { name: 'MongoDB/PostgreSQL', level: 85, category: 'Database', color: 'from-orange-500 to-red-500' },
    { name: 'AWS/Docker', level: 80, category: 'DevOps', color: 'from-yellow-500 to-orange-500' },
    { name: 'Python', level: 75, category: 'Language', color: 'from-teal-500 to-green-500' },
    { name: 'GraphQL', level: 78, category: 'Backend', color: 'from-pink-500 to-rose-500' },
    { name: 'TailwindCSS', level: 92, category: 'Frontend', color: 'from-cyan-500 to-blue-500' }
  ]
};

const projects = [
  {
    id: 1,
    title: 'E-commerce Platform',
    description: 'Plataforma de e-commerce completa con carrito de compras, pagos y panel de administración.',
    image: '🛒',
    tech: ['Next.js', 'Stripe', 'MongoDB', 'TailwindCSS'],
    category: 'Full Stack',
    status: 'Completado',
    demoUrl: 'https://demo.ecommerce.com',
    codeUrl: 'https://github.com/alex/ecommerce',
    featured: true,
    year: 2024,
    metrics: {
      users: '10K+',
      revenue: '$500K+',
      uptime: '99.9%'
    }
  },
  {
    id: 2,
    title: 'Task Management App',
    description: 'Aplicación de gestión de tareas con colaboración en tiempo real y notificaciones.',
    image: '📋',
    tech: ['React', 'Node.js', 'Socket.io', 'PostgreSQL'],
    category: 'Full Stack',
    status: 'Completado',
    demoUrl: 'https://demo.taskapp.com',
    codeUrl: 'https://github.com/alex/taskapp',
    featured: true,
    year: 2023,
    metrics: {
      users: '5K+',
      tasks: '1M+',
      teams: '500+'
    }
  },
  {
    id: 3,
    title: 'Analytics Dashboard',
    description: 'Dashboard de analíticas interactivo con visualizaciones de datos en tiempo real.',
    image: '📊',
    tech: ['Vue.js', 'D3.js', 'Python', 'Redis'],
    category: 'Frontend',
    status: 'En desarrollo',
    demoUrl: 'https://demo.analytics.com',
    codeUrl: 'https://github.com/alex/analytics',
    featured: false,
    year: 2024,
    metrics: {
      dataPoints: '10M+',
      dashboards: '100+',
      exports: '1K+'
    }
  },
  {
    id: 4,
    title: 'Mobile Banking App',
    description: 'Aplicación móvil para banca digital con autenticación biométrica.',
    image: '🏦',
    tech: ['React Native', 'Node.js', 'JWT', 'MySQL'],
    category: 'Mobile',
    status: 'Completado',
    demoUrl: 'https://demo.banking.com',
    codeUrl: null,
    featured: true,
    year: 2023,
    metrics: {
      downloads: '50K+',
      transactions: '$10M+',
      rating: '4.8/5'
    }
  },
  {
    id: 5,
    title: 'AI Content Generator',
    description: 'Herramienta de generación de contenido usando IA y procesamiento de lenguaje natural.',
    image: '🤖',
    tech: ['Python', 'FastAPI', 'OpenAI', 'React'],
    category: 'AI/ML',
    status: 'Completado',
    demoUrl: 'https://demo.aicontent.com',
    codeUrl: 'https://github.com/alex/ai-content',
    featured: false,
    year: 2024,
    metrics: {
      content: '100K+',
      accuracy: '95%',
      speed: '2s'
    }
  },
  {
    id: 6,
    title: 'Social Media Platform',
    description: 'Red social con funciones de chat, posts, stories y transmisiones en vivo.',
    image: '📱',
    tech: ['Next.js', 'GraphQL', 'WebRTC', 'MongoDB'],
    category: 'Full Stack',
    status: 'En desarrollo',
    demoUrl: null,
    codeUrl: 'https://github.com/alex/social-platform',
    featured: false,
    year: 2024,
    metrics: {
      users: '2K+',
      posts: '50K+',
      engagement: '85%'
    }
  }
];

const experience = [
  {
    company: 'TechCorp Solutions',
    position: 'Senior Full Stack Developer',
    period: '2022 - Presente',
    duration: '2 años',
    description: 'Liderazgo técnico en proyectos de gran escala, mentorización de desarrolladores junior.',
    achievements: [
      'Desarrollé una aplicación que aumentó la productividad en 40%',
      'Lideré un equipo de 5 desarrolladores',
      'Implementé arquitectura microservicios'
    ],
    technologies: ['React', 'Node.js', 'AWS', 'Docker'],
    type: 'Tiempo completo'
  },
  {
    company: 'StartupXYZ',
    position: 'Full Stack Developer',
    period: '2020 - 2022',
    duration: '2 años',
    description: 'Desarrollo de productos desde cero, implementación de mejores prácticas y CI/CD.',
    achievements: [
      'Construí el MVP que atrajo 10k usuarios',
      'Reduje el tiempo de carga en 60%',
      'Implementé sistema de autenticación OAuth'
    ],
    technologies: ['Vue.js', 'Python', 'PostgreSQL', 'Redis'],
    type: 'Tiempo completo'
  },
  {
    company: 'DigitalAgency',
    position: 'Frontend Developer',
    period: '2019 - 2020',
    duration: '1 año',
    description: 'Desarrollo de sitios web responsivos y aplicaciones web para diversos clientes.',
    achievements: [
      'Desarrollé 20+ sitios web responsivos',
      'Mejoré SEO resultando en 50% más tráfico',
      'Implementé animaciones y microinteracciones'
    ],
    technologies: ['HTML', 'CSS', 'JavaScript', 'WordPress'],
    type: 'Tiempo completo'
  }
];

const testimonials = [
  {
    name: 'María González',
    company: 'CEO, TechCorp',
    message: 'Alex es un desarrollador excepcional. Su capacidad para resolver problemas complejos y entregar soluciones de alta calidad es impresionante.',
    rating: 5,
    avatar: '👩‍💼',
    role: 'CEO'
  },
  {
    name: 'Carlos Mendez',
    company: 'CTO, StartupXYZ',
    message: 'Trabajar con Alex fue una experiencia fantástica. Su conocimiento técnico y profesionalismo son de primer nivel.',
    rating: 5,
    avatar: '👨‍💻',
    role: 'CTO'
  },
  {
    name: 'Ana López',
    company: 'Project Manager, DigitalAgency',
    message: 'Alex siempre entrega a tiempo y supera las expectativas. Es un verdadero profesional.',
    rating: 5,
    avatar: '👩‍🎨',
    role: 'PM'
  }
];

export default function PortfolioDemo() {
  const [activeSection, setActiveSection] = useState('about');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCode, setShowCode] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  const addNotification = (message: string) => {
    setNotifications((prev: string[]) => [...prev, message]);
    setTimeout(() => {
      setNotifications((prev: string[]) => prev.slice(1));
    }, 3000);
  };

  const CodeBlock = ({ title, code }: { title: string; code: string }) => (
    <div className="bg-gray-900 rounded-xl p-6 mt-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-green-400 font-mono text-sm">{title}</h4>
        <button
          onClick={() => {
            navigator.clipboard.writeText(code);
            addNotification('Código copiado al portapapeles!');
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

  const sections = [
    { id: 'about', name: 'Sobre Mí', icon: UserIcon },
    { id: 'projects', name: 'Proyectos', icon: ChevronRightIcon },
    { id: 'experience', name: 'Experiencia', icon: TrendingUpIcon },
    { id: 'contact', name: 'Contacto', icon: HeartIcon }
  ];

  const categories = ['All', 'Full Stack', 'Frontend', 'Mobile', 'AI/ML'];
  
  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addNotification('¡Mensaje enviado! Te responderé pronto.');
    setContactForm({ name: '', email: '', message: '' });
  };

  // Project Card Component
  function ProjectCard({ project, index }: { project: any; index: number }) {
    return (
      <div
        className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105 ${
          project.featured ? 'ring-2 ring-blue-500' : ''
        }`}
        style={{ animationDelay: `${index * 100}ms` }}
      >
        {project.featured && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 text-sm font-medium flex items-center gap-2">
            <span>⭐</span>
            Proyecto Destacado
          </div>
        )}
        
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="text-4xl p-3 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl">
                {project.image}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {project.title}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                    {project.category}
                  </span>
                  <span>•</span>
                  <span>{project.year}</span>
                </div>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              project.status === 'Completado' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            }`}>
              {project.status}
            </span>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{project.description}</p>
          
          {/* Project Metrics */}
          <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            {Object.entries(project.metrics).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className="font-bold text-gray-900 dark:text-white">{value as string}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 capitalize">{key}</div>
              </div>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tech.map((tech: string, i: number) => (
              <span key={i} className="px-3 py-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium border border-blue-200 dark:border-blue-800">
                {tech}
              </span>
            ))}
          </div>
          
          <div className="flex space-x-3">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-sm font-medium"
              >
                <span>👁️</span>
                <span>Demo</span>
                <span>↗️</span>
              </a>
            )}
            {project.codeUrl && (
              <a
                href={project.codeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 text-sm font-medium"
              >
                <span>💻</span>
                <span>Código</span>
                <span>↗️</span>
              </a>
            )}
            <button
              onClick={() => setShowCode(showCode === `project-${project.id}` ? null : `project-${project.id}`)}
              className="flex items-center space-x-2 px-4 py-2 border-2 border-purple-300 dark:border-purple-600 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 text-sm font-medium"
            >
              <span>📝</span>
              <span>{showCode === `project-${project.id}` ? 'Ocultar' : 'Ver'} Código</span>
            </button>
          </div>

          {showCode === `project-${project.id}` && (
            <CodeBlock
              title={`Componente ProjectCard - ${project.title}`}
              code={`// Componente de tarjeta de proyecto
function ProjectCard({ project }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="text-4xl p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
            {project.image}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {project.title}
            </h3>
            <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
              {project.category}
            </span>
          </div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {project.description}
        </p>
        
        {/* Métricas del proyecto */}
        <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
          {Object.entries(project.metrics).map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="font-bold">{value}</div>
              <div className="text-xs text-gray-600">{key}</div>
            </div>
          ))}
        </div>
        
        {/* Tecnologías */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tech.map((tech, i) => (
            <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
              {tech}
            </span>
          ))}
        </div>
        
        {/* Enlaces */}
        <div className="flex space-x-3">
          <a href={project.demoUrl} className="btn-primary">
            Demo
          </a>
          <a href={project.codeUrl} className="btn-secondary">
            Código
          </a>
        </div>
      </div>
    </div>
  );
}`}
            />
          )}
        </div>
      </div>
    );
  }

  // Skill Bar Component
  function SkillBar({ skill, index }: { skill: any; index: number }) {
    return (
      <div
        className="mb-6 animate-in slide-in-from-left"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-3">
            <span className="font-semibold text-gray-900 dark:text-white">{skill.name}</span>
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs">
              {skill.category}
            </span>
          </div>
          <span className="text-sm font-bold text-gray-600 dark:text-gray-300">{skill.level}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-1000 ease-out animate-fill-bar`}
            style={{ width: `${skill.level}%`, animationDelay: `${index * 100 + 300}ms` }}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Portfolio Personal - Full Integration Examples</title>
        <meta name="description" content="Portfolio personal responsivo y moderno" />
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
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm sticky top-0 z-40 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <Link href="/ejemplos/premium" className="text-blue-600 hover:text-blue-800 mr-4 transition-colors">
                  <ArrowLeftIcon className="w-5 h-5" />
                </Link>
                <div>
                  <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium mb-2">
                    <span>👨‍💼</span>
                    Portfolio Profesional
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Portfolio Personal
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    Showcase profesional interactivo
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Disponible para proyectos</span>
                  </div>
                </div>
                <a
                  href="/cv.pdf"
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span>📄</span>
                  <span>Descargar CV</span>
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`group flex items-center space-x-2 py-4 border-b-2 font-medium transition-all duration-300 ${
                      activeSection === section.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:scale-105'
                    }`}
                  >
                    <Icon className={`w-4 h-4 transition-transform duration-300 ${
                      activeSection === section.id ? 'scale-110' : 'group-hover:scale-110'
                    }`} />
                    <span>{section.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* About Section */}
          {activeSection === 'about' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-500">
              {/* Profile Header */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
                  <div className="relative">
                    <div className="text-8xl p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl shadow-inner">
                      {personalInfo.avatar}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-gray-800 animate-pulse"></div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-3">
                      {personalInfo.name}
                    </h2>
                    <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4">{personalInfo.title}</p>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed text-lg">{personalInfo.bio}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <span className="text-xl">📍</span>
                        <span>{personalInfo.location}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <span className="text-xl">📧</span>
                        <span>{personalInfo.email}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <span className="text-xl">🌐</span>
                        <span>{personalInfo.website}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {Object.entries(personalInfo.stats).map(([key, value], index) => (
                  <div
                    key={key}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 text-center hover:scale-105 transition-transform duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                      {value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 capitalize font-medium">
                      {key === 'experience' ? 'Años Experiencia' : 
                       key === 'projects' ? 'Proyectos' :
                       key === 'clients' ? 'Clientes' : 'Premios'}
                    </div>
                  </div>
                ))}
              </div>

              {/* Skills */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Habilidades Técnicas
                  </h3>
                  <button
                    onClick={() => setShowCode(showCode === 'skills' ? null : 'skills')}
                    className="flex items-center space-x-2 px-4 py-2 border-2 border-purple-300 dark:border-purple-600 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 text-sm font-medium"
                  >
                    <span>📝</span>
                    <span>{showCode === 'skills' ? 'Ocultar' : 'Ver'} Código</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                  {personalInfo.skills.map((skill, index) => (
                    <SkillBar key={skill.name} skill={skill} index={index} />
                  ))}
                </div>

                {showCode === 'skills' && (
                  <CodeBlock
                    title="Componente SkillBar con Gradientes"
                    code={`// Componente de barra de habilidades animada
function SkillBar({ skill, index }) {
  return (
    <div 
      className="mb-6 animate-in slide-in-from-left"
      style={{ animationDelay: \`\${index * 100}ms\` }}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-gray-900 dark:text-white">
            {skill.name}
          </span>
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs">
            {skill.category}
          </span>
        </div>
        <span className="text-sm font-bold text-gray-600 dark:text-gray-300">
          {skill.level}%
        </span>
      </div>
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className={\`h-full bg-gradient-to-r \${skill.color} rounded-full transition-all duration-1000 ease-out animate-fill-bar\`}
          style={{ 
            width: \`\${skill.level}%\`, 
            animationDelay: \`\${index * 100 + 300}ms\` 
          }}
        />
      </div>
    </div>
  );
}

// CSS para animaciones
@keyframes fill-bar {
  from { width: 0%; }
  to { width: var(--skill-width); }
}

.animate-fill-bar {
  animation: fill-bar 1s ease-out forwards;
}`}
                  />
                )}
              </div>

              {/* Testimonials */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                  Testimonios
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {testimonials.map((testimonial, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      style={{ animationDelay: `${index * 200}ms` }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-3xl">{testimonial.avatar}</div>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">
                              {testimonial.name}
                            </p>
                            <p className="text-sm text-blue-600 dark:text-blue-400">
                              {testimonial.role}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <StarIcon key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-4 italic leading-relaxed">
                        "{testimonial.message}"
                      </p>
                      
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.company}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Projects Section */}
          {activeSection === 'projects' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-500">
              {/* Header */}
              <div className="text-center">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
                  Mis Proyectos
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Una selección de proyectos que demuestran mis habilidades y experiencia en desarrollo.
                </p>
              </div>

              {/* Category Filter */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Filtrar por Categoría
                </h3>
                <div className="flex flex-wrap gap-3">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                        selectedCategory === category
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-sm'
                      }`}
                    >
                      {category} 
                      <span className="ml-2 px-2 py-1 bg-black/10 dark:bg-white/10 rounded-full text-xs">
                        {category === 'All' ? projects.length : projects.filter(p => p.category === category).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
              </div>

              {filteredProjects.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No se encontraron proyectos
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    No hay proyectos disponibles en esta categoría.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Experience Section */}
          {activeSection === 'experience' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-500">
              {/* Header */}
              <div className="text-center">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
                  Experiencia Profesional
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Mi trayectoria profesional y los logros más importantes en cada posición.
                </p>
              </div>

              {/* Timeline */}
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500"></div>
                
                <div className="space-y-8">
                  {experience.map((exp, index) => (
                    <div
                      key={index}
                      className="relative flex items-start space-x-6"
                      style={{ animationDelay: `${index * 200}ms` }}
                    >
                      {/* Timeline Dot */}
                      <div className="relative z-10 flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-xl">
                            {index + 1}
                          </span>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                              {exp.position}
                            </h3>
                            <p className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">
                              {exp.company}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                              <span className="flex items-center">
                                <span className="mr-2">📅</span>
                                {exp.period}
                              </span>
                              <span className="flex items-center">
                                <span className="mr-2">⏱️</span>
                                {exp.duration}
                              </span>
                              <span className="flex items-center">
                                <span className="mr-2">💼</span>
                                {exp.type}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                          {exp.description}
                        </p>
                        
                        {/* Technologies */}
                        <div className="mb-6">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                            Tecnologías utilizadas:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {exp.technologies.map((tech, i) => (
                              <span key={i} className="px-3 py-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium border border-blue-200 dark:border-blue-800">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {/* Achievements */}
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                            Logros principales:
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {exp.achievements.map((achievement, i) => (
                              <div key={i} className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <span className="text-green-500 text-lg flex-shrink-0 mt-0.5">✓</span>
                                <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                  {achievement}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Contact Section */}
          {activeSection === 'contact' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-500">
              {/* Header */}
              <div className="text-center">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
                  ¡Hablemos!
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  ¿Tienes un proyecto en mente? Me encantaría escuchar sobre él y ver cómo puedo ayudarte.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Contact Info */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                    Información de Contacto
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:scale-105 transition-transform duration-300">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xl">📧</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Email</p>
                        <p className="text-blue-600 dark:text-blue-400">{personalInfo.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl hover:scale-105 transition-transform duration-300">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xl">📱</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Teléfono</p>
                        <p className="text-green-600 dark:text-green-400">{personalInfo.phone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl hover:scale-105 transition-transform duration-300">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xl">📍</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Ubicación</p>
                        <p className="text-purple-600 dark:text-purple-400">{personalInfo.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl hover:scale-105 transition-transform duration-300">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xl">🌐</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Website</p>
                        <p className="text-orange-600 dark:text-orange-400">{personalInfo.website}</p>
                      </div>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                      También puedes encontrarme en:
                    </h4>
                    <div className="flex space-x-4">
                      {[
                        { name: 'LinkedIn', icon: '💼', color: 'from-blue-600 to-blue-700' },
                        { name: 'GitHub', icon: '💻', color: 'from-gray-600 to-gray-700' },
                        { name: 'Twitter', icon: '🐦', color: 'from-blue-400 to-blue-500' },
                        { name: 'Dribbble', icon: '🎨', color: 'from-pink-500 to-pink-600' }
                      ].map((social) => (
                        <a
                          key={social.name}
                          href="#"
                          className={`w-12 h-12 bg-gradient-to-r ${social.color} rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 shadow-lg`}
                        >
                          <span className="text-xl">{social.icon}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                    Envíame un Mensaje
                  </h3>
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Nombre Completo
                      </label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                        placeholder="Tu nombre completo"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                        placeholder="tu@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Mensaje
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 resize-none"
                        placeholder="Cuéntame sobre tu proyecto..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Enviar Mensaje 🚀
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Documentation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
              📚 Características del Portfolio
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Diseño Responsive
                </h3>
                <ul className="text-blue-700 dark:text-blue-300 space-y-1 text-sm">
                  <li>• Adaptable a todos los dispositivos</li>
                  <li>• Navegación intuitiva</li>
                  <li>• Animaciones con Framer Motion</li>
                  <li>• Modo oscuro integrado</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Showcase Profesional
                </h3>
                <ul className="text-blue-700 dark:text-blue-300 space-y-1 text-sm">
                  <li>• Galería de proyectos filtrable</li>
                  <li>• Barras de habilidades animadas</li>
                  <li>• Testimonios de clientes</li>
                  <li>• Historial de experiencia</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Funcionalidades
                </h3>
                <ul className="text-blue-700 dark:text-blue-300 space-y-1 text-sm">
                  <li>• Formulario de contacto funcional</li>
                  <li>• Descarga de CV</li>
                  <li>• Enlaces a demos y código</li>
                  <li>• SEO optimizado</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CSS Styles for Animations */}
        <style jsx>{`
          @keyframes fill-bar {
            from { width: 0%; }
            to { width: 100%; }
          }
          
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slide-in-from-bottom {
            from { 
              opacity: 0; 
              transform: translateY(20px); 
            }
            to { 
              opacity: 1; 
              transform: translateY(0); 
            }
          }
          
          @keyframes slide-in-from-left {
            from { 
              opacity: 0; 
              transform: translateX(-20px); 
            }
            to { 
              opacity: 1; 
              transform: translateX(0); 
            }
          }
          
          @keyframes slide-in-from-right {
            from { 
              opacity: 0; 
              transform: translateX(20px); 
            }
            to { 
              opacity: 1; 
              transform: translateX(0); 
            }
          }
          
          .animate-fill-bar {
            animation: fill-bar 1s ease-out forwards;
          }
          
          .animate-in {
            animation-fill-mode: both;
          }
          
          .fade-in {
            animation: fade-in 0.5s ease-out;
          }
          
          .slide-in-from-bottom {
            animation: slide-in-from-bottom 0.5s ease-out;
          }
          
          .slide-in-from-left {
            animation: slide-in-from-left 0.5s ease-out;
          }
          
          .slide-in-from-right {
            animation: slide-in-from-right 0.3s ease-out;
          }
          
          .duration-300 {
            animation-duration: 300ms;
          }
          
          .duration-500 {
            animation-duration: 500ms;
          }
        `}</style>
      </div>
    </>
  );
}