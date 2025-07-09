import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export default function PremiumExamplesIndex() {
  const fullIntegrationExamples = [
    {
      title: '📊 Analytics Dashboard',
      description: 'Dashboard interactivo con Chart.js y D3.js para visualizaciones avanzadas',
      href: '/ejemplos/premium/analytics-dashboard',
      technologies: ['Chart.js', 'D3.js', 'React', 'TypeScript'],
      difficulty: 'Intermedio',
      category: 'Data Visualization'
    },
    {
      title: '🚀 Modern Landing Page',
      description: 'Página de aterrizaje profesional con scroll animations y paralax effects',
      href: '/ejemplos/premium/landing-page',
      technologies: ['Framer Motion', 'GSAP', 'TailwindCSS', 'React'],
      difficulty: 'Intermedio',
      category: 'UI/UX'
    },
    {
      title: '🛍️ E-commerce with Cart',
      description: 'Tienda en línea completa con carrito de compras y gestión de estado',
      href: '/ejemplos/premium/ecommerce',
      technologies: ['Zustand', 'Local Storage', 'React', 'TypeScript'],
      difficulty: 'Intermedio',
      category: 'E-commerce'
    },
    {
      title: '📋 Task Management App',
      description: 'Aplicación de gestión de tareas con drag & drop y persistencia local',
      href: '/ejemplos/premium/task-app',
      technologies: ['React DnD', 'Local Storage', 'Context API'],
      difficulty: 'Intermedio',
      category: 'Productivity'
    },
    {
      title: '💬 Real-time Chat',
      description: 'Chat en tiempo real con WebSockets y múltiples salas',
      href: '/ejemplos/premium/chat',
      technologies: ['WebSockets', 'Socket.io', 'React', 'Node.js'],
      difficulty: 'Avanzado',
      category: 'Real-time'
    },
    {
      title: '🏢 Multi-tenant SaaS',
      description: 'Plataforma SaaS multi-tenant con gestión de suscripciones y tenants',
      href: '/ejemplos/premium/saas',
      technologies: ['Multi-tenancy', 'Subscription Management', 'Dashboard'],
      difficulty: 'Avanzado',
      category: 'SaaS'
    },
    {
      title: '🏪 Marketplace Platform',
      description: 'Marketplace completo con sistema de reseñas y gestión de vendedores',
      href: '/ejemplos/premium/marketplace',
      technologies: ['Rating System', 'Search & Filters', 'Vendor Management'],
      difficulty: 'Avanzado',
      category: 'Marketplace'
    },
    {
      title: '👨‍💼 Personal Portfolio',
      description: 'Portfolio profesional responsive con animaciones y formulario de contacto',
      href: '/ejemplos/premium/portfolio',
      technologies: ['Framer Motion', 'Contact Forms', 'Responsive Design'],
      difficulty: 'Intermedio',
      category: 'Portfolio'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Básico':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Intermedio':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Avanzado':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Data Visualization': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'UI/UX': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      'E-commerce': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Productivity': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      'Real-time': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
      'SaaS': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Marketplace': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
      'Portfolio': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  return (
    <>
      <Head>
        <title>Ejemplos de Integración Completa - sysrot-hub</title>
        <meta name="description" content="Ejemplos avanzados con integraciones completas y librerías especializadas" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              <div className="flex items-center">
                <Link href="/ejemplos" className="text-blue-600 hover:text-blue-800 mr-4">
                  <ArrowLeftIcon className="w-5 h-5" />
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    ✨ Ejemplos de Integración Completa
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    Ejemplos avanzados con funcionalidades completas y librerías especializadas
                  </p>
                </div>
              </div>
              <div className="text-4xl">🚀</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Introduction */}
          <div className="mb-12 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Descubre Integraciones Avanzadas
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Estos ejemplos van más allá de lo básico e incluyen integraciones completas con librerías 
                especializadas, patrones de diseño avanzados y funcionalidades listas para producción.
              </p>
            </div>
          </div>

          {/* Examples Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {fullIntegrationExamples.map((example, index) => (
              <Link href={example.href} key={index} className="group">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  {/* Header */}
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(example.category)}`}>
                        {example.category}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(example.difficulty)}`}>
                        {example.difficulty}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                      {example.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {example.description}
                    </p>
                  </div>

                  {/* Technologies */}
                  <div className="p-6">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                      Tecnologías Integradas:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {example.technologies.map((tech, techIndex) => (
                        <span 
                          key={techIndex}
                          className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    {/* Call to Action */}
                    <div className="mt-4 flex items-center text-blue-600 group-hover:text-blue-700 transition-colors">
                      <span className="text-sm font-medium">Ver ejemplo</span>
                      <ArrowRightIcon className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Information Section */}
          <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                🎯 ¿Por qué Ejemplos de Integración Completa?
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🔧</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Funcionalidades Completas
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Cada ejemplo incluye funcionalidades completas y listas para usar en proyectos reales.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📚</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Librerías Especializadas
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Integración con las mejores librerías y herramientas del ecosistema React/Next.js.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Rendimiento Optimizado
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Implementaciones optimizadas siguiendo las mejores prácticas de la industria.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Learning Path */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              📈 Ruta de Aprendizaje Recomendada
            </h2>
            
            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-300 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Comienza con lo Básico</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Explora primero los <Link href="/ejemplos" className="text-blue-600 hover:text-blue-700">ejemplos básicos</Link> para dominar los fundamentos.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 dark:text-yellow-300 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Experimenta con Integraciones</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Prueba los ejemplos de nivel intermedio como el Dashboard de Analytics o el E-commerce.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                    <span className="text-red-600 dark:text-red-300 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Desafíate con Proyectos Avanzados</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Implementa soluciones complejas como el SaaS multi-tenant o el sistema de chat en tiempo real.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                🚀 ¿Listo para el siguiente nivel?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Estos ejemplos te ayudarán a crear aplicaciones profesionales con funcionalidades avanzadas.
                ¡Elige uno y comienza a explorar!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/ejemplos/premium/analytics-dashboard"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Comenzar con Analytics
                </Link>
                <Link 
                  href="/ejemplos"
                  className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  Ver Ejemplos Básicos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}