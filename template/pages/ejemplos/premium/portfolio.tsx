import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  ArrowLeftIcon, 
  EnvelopeIcon, 
  PhoneIcon,
  MapPinIcon,
  CodeBracketIcon,
  GlobeAltIcon,
  DocumentArrowDownIcon,
  UserIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  StarIcon,
  EyeIcon,
  ArrowUpRightIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

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
  skills: [
    { name: 'React/Next.js', level: 95, category: 'Frontend' },
    { name: 'Node.js/Express', level: 90, category: 'Backend' },
    { name: 'TypeScript', level: 88, category: 'Language' },
    { name: 'MongoDB/PostgreSQL', level: 85, category: 'Database' },
    { name: 'AWS/Docker', level: 80, category: 'DevOps' },
    { name: 'Python', level: 75, category: 'Language' },
    { name: 'GraphQL', level: 78, category: 'Backend' },
    { name: 'TailwindCSS', level: 92, category: 'Frontend' }
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
    year: 2024
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
    year: 2023
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
    year: 2024
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
    codeUrl: null, // Private project
    featured: true,
    year: 2023
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
    year: 2024
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
    year: 2024
  }
];

const experience = [
  {
    company: 'TechCorp Solutions',
    position: 'Senior Full Stack Developer',
    period: '2022 - Presente',
    description: 'Liderazgo técnico en proyectos de gran escala, mentorización de desarrolladores junior.',
    achievements: [
      'Desarrollé una aplicación que aumentó la productividad en 40%',
      'Lideré un equipo de 5 desarrolladores',
      'Implementé arquitectura microservicios'
    ]
  },
  {
    company: 'StartupXYZ',
    position: 'Full Stack Developer',
    period: '2020 - 2022',
    description: 'Desarrollo de productos desde cero, implementación de mejores prácticas y CI/CD.',
    achievements: [
      'Construí el MVP que atrajo 10k usuarios',
      'Reduje el tiempo de carga en 60%',
      'Implementé sistema de autenticación OAuth'
    ]
  },
  {
    company: 'DigitalAgency',
    position: 'Frontend Developer',
    period: '2019 - 2020',
    description: 'Desarrollo de sitios web responsivos y aplicaciones web para diversos clientes.',
    achievements: [
      'Desarrollé 20+ sitios web responsivos',
      'Mejoré SEO resultando en 50% más tráfico',
      'Implementé animaciones y microinteracciones'
    ]
  }
];

const testimonials = [
  {
    name: 'María González',
    company: 'CEO, TechCorp',
    message: 'Alex es un desarrollador excepcional. Su capacidad para resolver problemas complejos y entregar soluciones de alta calidad es impresionante.',
    rating: 5
  },
  {
    name: 'Carlos Mendez',
    company: 'CTO, StartupXYZ',
    message: 'Trabajar con Alex fue una experiencia fantástica. Su conocimiento técnico y profesionalismo son de primer nivel.',
    rating: 5
  },
  {
    name: 'Ana López',
    company: 'Project Manager, DigitalAgency',
    message: 'Alex siempre entrega a tiempo y supera las expectativas. Es un verdadero profesional.',
    rating: 5
  }
];

function ProjectCard({ project, index }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${
        project.featured ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      {project.featured && (
        <div className="bg-blue-500 text-white px-3 py-1 text-sm font-medium">
          ⭐ Proyecto Destacado
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{project.image}</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {project.title}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <span>{project.category}</span>
                <span>•</span>
                <span>{project.year}</span>
              </div>
            </div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs ${
            project.status === 'Completado' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
          }`}>
            {project.status}
          </span>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech.map((tech, i) => (
            <span key={i} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
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
              className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <EyeIcon className="w-4 h-4" />
              <span>Demo</span>
              <ArrowUpRightIcon className="w-3 h-3" />
            </a>
          )}
          {project.codeUrl && (
            <a
              href={project.codeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
            >
              <CodeBracketIcon className="w-4 h-4" />
              <span>Código</span>
              <ArrowUpRightIcon className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function SkillBar({ skill, index }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="mb-4"
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-gray-900 dark:text-white">{skill.name}</span>
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs">
            {skill.category}
          </span>
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-300">{skill.level}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${skill.level}%` }}
          transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
          className="bg-blue-600 h-2 rounded-full"
        />
      </div>
    </motion.div>
  );
}

export default function PortfolioDemo() {
  const [activeSection, setActiveSection] = useState('about');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  const sections = [
    { id: 'about', name: 'Sobre Mí', icon: UserIcon },
    { id: 'projects', name: 'Proyectos', icon: BriefcaseIcon },
    { id: 'experience', name: 'Experiencia', icon: AcademicCapIcon },
    { id: 'contact', name: 'Contacto', icon: EnvelopeIcon }
  ];

  const categories = ['All', 'Full Stack', 'Frontend', 'Mobile', 'AI/ML'];
  
  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    alert('¡Mensaje enviado! Te responderé pronto.');
    setContactForm({ name: '', email: '', message: '' });
  };

  return (
    <>
      <Head>
        <title>Portfolio Personal - Full Integration Examples</title>
        <meta name="description" content="Portfolio personal responsivo y moderno" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <Link href="/ejemplos/premium" className="text-blue-600 hover:text-blue-800 mr-4">
                  <ArrowLeftIcon className="w-5 h-5" />
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    👨‍💼 Portfolio Personal
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    Showcase profesional responsive
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <a
                  href="/cv.pdf"
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <DocumentArrowDownIcon className="w-4 h-4" />
                  <span>Descargar CV</span>
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                      activeSection === section.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* Profile Header */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
                  <div className="text-8xl">{personalInfo.avatar}</div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {personalInfo.name}
                    </h2>
                    <p className="text-xl text-blue-600 mb-4">{personalInfo.title}</p>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">{personalInfo.bio}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                        <MapPinIcon className="w-4 h-4" />
                        <span>{personalInfo.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                        <EnvelopeIcon className="w-4 h-4" />
                        <span>{personalInfo.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                        <GlobeAltIcon className="w-4 h-4" />
                        <span>{personalInfo.website}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Habilidades Técnicas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                  {personalInfo.skills.map((skill, index) => (
                    <SkillBar key={skill.name} skill={skill} index={index} />
                  ))}
                </div>
              </div>

              {/* Testimonials */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Testimonios
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {testimonials.map((testimonial, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6"
                    >
                      <div className="flex items-center mb-3">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <StarIcon key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 italic">
                        "{testimonial.message}"
                      </p>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-gray-500">{testimonial.company}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Projects Section */}
          {activeSection === 'projects' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {category} ({category === 'All' ? projects.length : projects.filter(p => p.category === category).length})
                  </button>
                ))}
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Experience Section */}
          {activeSection === 'experience' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {experience.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {exp.position}
                      </h3>
                      <p className="text-blue-600 font-medium">{exp.company}</p>
                    </div>
                    <span className="text-gray-500 dark:text-gray-400 mt-2 md:mt-0">
                      {exp.period}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{exp.description}</p>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Logros principales:
                    </h4>
                    <ul className="space-y-1">
                      {exp.achievements.map((achievement, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <span className="text-green-500 mt-1">✓</span>
                          <span className="text-gray-600 dark:text-gray-300">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Contact Section */}
          {activeSection === 'contact' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {/* Contact Info */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Información de Contacto
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <EnvelopeIcon className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Email</p>
                      <p className="text-gray-600 dark:text-gray-300">{personalInfo.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <PhoneIcon className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Teléfono</p>
                      <p className="text-gray-600 dark:text-gray-300">{personalInfo.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPinIcon className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Ubicación</p>
                      <p className="text-gray-600 dark:text-gray-300">{personalInfo.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <GlobeAltIcon className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Website</p>
                      <p className="text-gray-600 dark:text-gray-300">{personalInfo.website}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Envíame un Mensaje
                </h3>
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Mensaje
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Enviar Mensaje
                  </button>
                </form>
              </div>
            </motion.div>
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
      </div>
    </>
  );
}