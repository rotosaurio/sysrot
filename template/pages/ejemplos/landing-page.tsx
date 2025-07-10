import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowLeftIcon, ChevronRightIcon, CheckIcon, StarIcon } from '@/components/ui/icons';
import { useInView } from 'react-intersection-observer';

const features = [
  {
    icon: '🚀',
    title: 'Ultra Rápido',
    description: 'Optimizado para velocidad y rendimiento excepcional'
  },
  {
    icon: '🎨',
    title: 'Diseño Moderno',
    description: 'Interface elegante y responsive que se adapta a cualquier dispositivo'
  },
  {
    icon: '🔒',
    title: 'Seguro',
    description: 'Máxima seguridad con las mejores prácticas de la industria'
  },
  {
    icon: '⚡',
    title: 'Fácil de Usar',
    description: 'Interface intuitiva que no requiere entrenamiento'
  }
];

const testimonials = [
  {
    name: 'María González',
    role: 'CEO, TechCorp',
    avatar: '👩‍💼',
    rating: 5,
    content: 'Esta plataforma ha transformado completamente nuestro flujo de trabajo. Increíble!'
  },
  {
    name: 'Carlos Rodríguez',
    role: 'Desarrollador Senior',
    avatar: '👨‍💻',
    rating: 5,
    content: 'La mejor herramienta que he usado. Muy recomendada para equipos de desarrollo.'
  },
  {
    name: 'Ana Martínez',
    role: 'Directora de Producto',
    avatar: '👩‍🚀',
    rating: 5,
    content: 'Excelente soporte y funcionalidades. Ha superado todas nuestras expectativas.'
  }
];

const pricingPlans = [
  {
    name: 'Básico',
    price: '$9',
    period: '/mes',
    features: [
      'Hasta 5 proyectos',
      'Soporte por email',
      '10GB de almacenamiento',
      'Actualizaciones básicas'
    ],
    popular: false
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/mes',
    features: [
      'Proyectos ilimitados',
      'Soporte prioritario',
      '100GB de almacenamiento',
      'Todas las funcionalidades',
      'Analytics avanzados'
    ],
    popular: true
  },
  {
    name: 'Enterprise',
    price: '$99',
    period: '/mes',
    features: [
      'Todo de Pro',
      'Soporte dedicado',
      'Almacenamiento ilimitado',
      'Integración personalizada',
      'SLA garantizado'
    ],
    popular: false
  }
];

function FadeInSection({ children, delay = 0 }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${
        inView 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function ModernLandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [showCode, setShowCode] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<string[]>([]);

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
            addNotification('Código copiado al portapapeles! 🚀');
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

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Head>
        <title>Página de Aterrizaje Moderna Pro - Ejemplos de Integración Completa</title>
        <meta name="description" content="Página de aterrizaje profesional con animaciones avanzadas, scroll parallax y componentes interactivos" />
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

        {/* Navigation */}
        <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-40 border-b border-gray-200/50 dark:border-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link href="/ejemplos" className="text-blue-600 hover:text-blue-800 mr-4 transition-colors">
                  <ArrowLeftIcon className="w-5 h-5" />
                </Link>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  🚀 ModernApp Pro
                </div>
              </div>
              <div className="hidden md:flex space-x-8">
                <a href="#features" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
                  Características
                </a>
                <a href="#testimonials" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
                  Testimonios
                </a>
                <a href="#pricing" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
                  Precios
                </a>
                <button
                  onClick={() => setShowCode(showCode === 'landing' ? null : 'landing')}
                  className="flex items-center space-x-2 px-3 py-1 border border-purple-300 dark:border-purple-600 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 text-sm"
                >
                  <span>📝</span>
                  <span>{showCode === 'landing' ? 'Ocultar' : 'Ver'} Código</span>
                </button>
              </div>
              <button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                onClick={() => addNotification('🎉 ¡Registro iniciado! Bienvenido a ModernApp Pro')}
              >
                Comenzar Gratis
              </button>
            </div>
          </div>
        </nav>

        {showCode === 'landing' && (
          <div className="pt-24 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <CodeBlock
                title="Landing Page con Animaciones y Scroll Parallax"
                code={`// Modern Landing Page Implementation
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

function ModernLandingPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation with Backdrop Blur */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              🚀 ModernApp Pro
            </div>
            
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Características
              </a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">
                Testimonios
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                Precios
              </a>
            </div>
            
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              Comenzar Gratis
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Parallax */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FadeInSection>
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
                El Futuro es
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  {' '}Ahora
                </span>
              </h1>
            </FadeInSection>
            
            <FadeInSection delay={200}>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Revoluciona tu forma de trabajar con nuestra plataforma de última generación.
              </p>
            </FadeInSection>

            <FadeInSection delay={400}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-200">
                  Comenzar Ahora
                </button>
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-gray-400 transition-colors">
                  Ver Demo
                </button>
              </div>
            </FadeInSection>

            {/* Parallax Demo Interface */}
            <FadeInSection delay={600}>
              <div className="mt-16 relative">
                <div 
                  className="relative mx-auto max-w-4xl"
                  style={{
                    transform: \`translateY(\${scrollY * 0.1}px)\`,
                  }}
                >
                  <div className="bg-white rounded-2xl shadow-2xl p-8 transform perspective-1000 rotate-x-12">
                    <div className="space-y-4">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-blue-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>
    </div>
  );
}

// Fade In Animation Component
function FadeInSection({ children, delay = 0 }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div
      ref={ref}
      className={\`transition-all duration-1000 \${
        inView 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-10'
      }\`}
      style={{ transitionDelay: \`\${delay}ms\` }}
    >
      {children}
    </div>
  );
}`}
              />
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className="pt-24 pb-20 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <FadeInSection>
                <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
                  El Futuro es
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    {' '}Ahora
                  </span>
                </h1>
              </FadeInSection>
              
              <FadeInSection delay={200}>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                  Revoluciona tu forma de trabajar con nuestra plataforma de última generación. 
                  Diseñada para equipos modernos que buscan eficiencia y resultados extraordinarios.
                </p>
              </FadeInSection>

              <FadeInSection delay={400}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 flex items-center shadow-lg hover:shadow-xl"
                    onClick={() => addNotification('🚀 ¡Excelente elección! Prepárate para el futuro')}
                  >
                    Comenzar Ahora
                    <ChevronRightIcon className="w-5 h-5 ml-2" />
                  </button>
                  <button 
                    className="border-2 border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600 px-8 py-4 rounded-xl text-lg font-semibold hover:border-blue-400 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400 transition-all duration-300"
                    onClick={() => addNotification('🎬 Demo próximamente disponible!')}
                  >
                    Ver Demo
                  </button>
                </div>
              </FadeInSection>

              <FadeInSection delay={600}>
                <div className="mt-16 relative">
                  <div 
                    className="relative mx-auto max-w-4xl"
                    style={{
                      transform: `translateY(${scrollY * 0.1}px)`,
                    }}
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 transform perspective-1000 rotate-x-12">
                      <div className="space-y-4">
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <div className="space-y-3">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                          <div className="h-4 bg-blue-200 dark:bg-blue-800 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeInSection>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  ¿Por qué elegirnos?
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Características que marcan la diferencia y te ayudan a destacar en tu industria
                </p>
              </div>
            </FadeInSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <FadeInSection key={index} delay={index * 100}>
                  <div className="text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-800 hover:shadow-lg transition-shadow duration-300">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Lo que dicen nuestros clientes
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Miles de equipos confían en nosotros para transformar su productividad
                </p>
              </div>
            </FadeInSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <FadeInSection key={index} delay={index * 200}>
                  <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg">
                    <div className="flex items-center mb-4">
                      <div className="text-3xl mr-3">{testimonial.avatar}</div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {testimonial.name}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                    <div className="flex mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 italic">
                      "{testimonial.content}"
                    </p>
                  </div>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Planes que se adaptan a ti
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Elige el plan perfecto para tu equipo y comienza tu transformación digital
                </p>
              </div>
            </FadeInSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingPlans.map((plan, index) => (
                <FadeInSection key={index} delay={index * 200}>
                  <div className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 ${
                    plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
                  }`}>
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                          Más Popular
                        </span>
                      </div>
                    )}
                    
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {plan.name}
                      </h3>
                      <div className="flex items-baseline justify-center">
                        <span className="text-5xl font-bold text-gray-900 dark:text-white">
                          {plan.price}
                        </span>
                        <span className="text-gray-600 dark:text-gray-300 ml-1">
                          {plan.period}
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                          <span className="text-gray-600 dark:text-gray-300">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                      plan.popular 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                    }`}>
                      Comenzar con {plan.name}
                    </button>
                  </div>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <FadeInSection>
              <h2 className="text-4xl font-bold text-white mb-4">
                ¿Listo para transformar tu negocio?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Únete a miles de empresas que ya han dado el salto hacia el futuro
              </p>
              <button className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-200">
                Comenzar Gratis Hoy
              </button>
            </FadeInSection>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="text-2xl font-bold mb-4">🚀 ModernApp</div>
                <p className="text-gray-400">
                  Transformando el futuro del trabajo, una empresa a la vez.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Producto</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white">Características</a></li>
                  <li><a href="#" className="hover:text-white">Precios</a></li>
                  <li><a href="#" className="hover:text-white">Documentación</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Empresa</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white">Sobre nosotros</a></li>
                  <li><a href="#" className="hover:text-white">Blog</a></li>
                  <li><a href="#" className="hover:text-white">Carreras</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Soporte</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white">Centro de ayuda</a></li>
                  <li><a href="#" className="hover:text-white">Contacto</a></li>
                  <li><a href="#" className="hover:text-white">Status</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2025 ModernApp. Todos los derechos reservados.</p>
            </div>
          </div>
        </footer>

        {/* Documentation */}
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-blue-600 text-white p-4 rounded-lg shadow-lg max-w-sm">
            <h3 className="font-semibold mb-2">💡 Características Técnicas</h3>
            <ul className="text-sm space-y-1">
              <li>• Scroll parallax effects</li>
              <li>• Intersection Observer animations</li>
              <li>• Responsive design patterns</li>
              <li>• Smooth transitions</li>
              <li>• Modern CSS gradients</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}