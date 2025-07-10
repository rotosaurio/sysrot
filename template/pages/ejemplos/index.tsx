import Link from 'next/link';
import { ArrowRight, BookOpen, Code, Rocket, Terminal } from '@/components/ui/icons';
import { useTranslation } from '@/components/providers/intl-provider';

export default function EjemplosPage() {
  const { t } = useTranslation();

  const ejemplos = [
    // Ejemplos básicos
    {
      title: t('examples.auth.title'),
      description: t('examples.auth.description'),
      href: "/ejemplos/auth",
      icon: <Terminal className="h-10 w-10 text-blue-600" />,
      category: "básico"
    },
    {
      title: t('examples.ai.title'),
      description: t('examples.ai.description'),
      href: "/ejemplos/ai",
      icon: <Rocket className="h-10 w-10 text-purple-600" />,
      category: "básico"
    },
    {
      title: t('examples.components.title'),
      description: t('examples.components.description'),
      href: "/ejemplos/componentes",
      icon: <Code className="h-10 w-10 text-emerald-600" />,
      category: "básico"
    },
    {
      title: t('examples.upload.title'),
      description: t('examples.upload.description'),
      href: "/ejemplos/upload",
      icon: <BookOpen className="h-10 w-10 text-green-600" />,
      category: "básico"
    },
    {
      title: t('examples.forms.title'),
      description: t('examples.forms.description'),
      href: "/ejemplos/formularios",
      icon: <Terminal className="h-10 w-10 text-orange-600" />,
      category: "básico"
    },
    {
      title: t('examples.animations.title'),
      description: t('examples.animations.description'),
      href: "/ejemplos/animaciones",
      icon: <Rocket className="h-10 w-10 text-pink-600" />,
      category: "básico"
    },
    {
      title: t('examples.notifications.title'),
      description: t('examples.notifications.description'),
      href: "/ejemplos/notificaciones",
      icon: <Code className="h-10 w-10 text-indigo-600" />,
      category: "básico"
    },
    {
      title: t('examples.database.title'),
      description: t('examples.database.description'),
      href: "/ejemplos/database",
      icon: <Terminal className="h-10 w-10 text-teal-600" />,
      category: "básico"
    },
    {
      title: t('examples.themes.title'),
      description: t('examples.themes.description'),
      href: "/ejemplos/ui-temas",
      icon: <BookOpen className="h-10 w-10 text-cyan-600" />,
      category: "básico"
    },
    {
      title: t('examples.blog.title'),
      description: t('examples.blog.description'),
      href: "/blog",
      icon: <BookOpen className="h-10 w-10 text-blue-600" />,
      category: "básico"
    },
    
    // Ejemplos de integración completa
    {
      title: "📊 Analytics Dashboard",
      description: "Dashboard interactivo con Chart.js y D3.js para visualizaciones avanzadas",
      href: "/ejemplos/analytics-dashboard",
      icon: <Code className="h-10 w-10 text-blue-500" />,
      category: "integración-completa"
    },
    {
      title: "🛍️ E-commerce Demo",
      description: "Tienda en línea completa con carrito de compras y gestión de estado",
      href: "/ejemplos/ecommerce",
      icon: <Terminal className="h-10 w-10 text-green-500" />,
      category: "integración-completa"
    },
    {
      title: "🏢 Multi-tenant SaaS",
      description: "Ejemplo de SaaS multi-tenant con gestión de suscripciones",
      href: "/ejemplos/saas",
      icon: <Rocket className="h-10 w-10 text-purple-500" />,
      category: "integración-completa"
    },
    {
      title: "👨‍💼 Personal Portfolio",
      description: "Portfolio personal responsivo y profesional con animaciones",
      href: "/ejemplos/portfolio",
      icon: <BookOpen className="h-10 w-10 text-indigo-500" />,
      category: "integración-completa"
    },
    {
      title: "💬 Real-time Chat",
      description: "Chat en tiempo real con WebSockets y múltiples salas",
      href: "/ejemplos/chat",
      icon: <Code className="h-10 w-10 text-pink-500" />,
      category: "integración-completa"
    },
    {
      title: "📋 Task Management",
      description: "Aplicación de gestión de tareas con drag & drop y persistencia",
      href: "/ejemplos/task-app",
      icon: <Terminal className="h-10 w-10 text-orange-500" />,
      category: "integración-completa"
    },
    {
      title: "🏪 Marketplace Platform",
      description: "Marketplace con sistema de calificaciones y reseñas",
      href: "/ejemplos/marketplace",
      icon: <Rocket className="h-10 w-10 text-red-500" />,
      category: "integración-completa"
    },
    {
      title: "🚀 Modern Landing Page",
      description: "Página de aterrizaje profesional con scroll animations",
      href: "/ejemplos/landing-page",
      icon: <BookOpen className="h-10 w-10 text-yellow-500" />,
      category: "integración-completa"
    }
  ];

  const ejemplosBasicos = ejemplos.filter(ejemplo => ejemplo.category === "básico");
  const ejemplosIntegracionCompleta = ejemplos.filter(ejemplo => ejemplo.category === "integración-completa");

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold text-center mb-12">{t('examples.title')}</h1>
      
      {/* Ejemplos Básicos */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
          🏗️ Ejemplos Básicos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ejemplosBasicos.map((ejemplo, index) => (
            <Link href={ejemplo.href} key={index} className="group">
              <div className="border rounded-lg p-6 shadow-md transition-all duration-200 hover:shadow-lg hover:border-blue-300 h-full">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {ejemplo.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
                      {ejemplo.title}
                      <ArrowRight className="ml-2 h-4 w-4 inline-block transition-transform group-hover:translate-x-1" />
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                      {ejemplo.description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Ejemplos de Integración Completa */}
      <div className="mb-12">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            🚀 Ejemplos de Integración Completa
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Ejemplos avanzados con funcionalidades completas y librerías especializadas
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ejemplosIntegracionCompleta.map((ejemplo, index) => (
            <Link href={ejemplo.href} key={index} className="group">
              <div className="border-2 border-blue-200 dark:border-blue-800 rounded-lg p-6 shadow-md transition-all duration-200 hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-600 h-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {ejemplo.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
                      {ejemplo.title}
                      <ArrowRight className="ml-2 h-4 w-4 inline-block transition-transform group-hover:translate-x-1" />
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                      {ejemplo.description}
                    </p>
                    <div className="mt-3">
                      <span className="inline-block bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
                        Integración Completa
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-12 p-6 border rounded-lg shadow-md bg-blue-50 dark:bg-blue-900/20">
        <h2 className="text-2xl font-semibold mb-4">{t('examples.about.title')}</h2>
        <p className="text-muted-foreground mb-4">
          {t('examples.about.description')}
        </p>
        <p className="text-muted-foreground">
          {t('examples.about.docs')}
          <code className="mx-1 px-1 py-0.5 bg-muted rounded">DOCUMENTACION.md</code>
          {t('examples.about.docsPath')}
        </p>
      </div>
    </div>
  );
} 