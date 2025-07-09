import Link from 'next/link';
import { ArrowRight, BookOpen, Code, Rocket, Terminal } from '@/components/ui/icons';
import { useTranslation } from '@/components/providers/intl-provider';

export default function EjemplosPage() {
  const { t } = useTranslation();

  const ejemplos = [
    {
      title: t('examples.auth.title'),
      description: t('examples.auth.description'),
      href: "/ejemplos/auth",
      icon: <Terminal className="h-10 w-10 text-blue-600" />
    },
    {
      title: t('examples.ai.title'),
      description: t('examples.ai.description'),
      href: "/ejemplos/ai",
      icon: <Rocket className="h-10 w-10 text-purple-600" />
    },
    {
      title: t('examples.components.title'),
      description: t('examples.components.description'),
      href: "/ejemplos/componentes",
      icon: <Code className="h-10 w-10 text-emerald-600" />
    },
    {
      title: t('examples.upload.title'),
      description: t('examples.upload.description'),
      href: "/ejemplos/upload",
      icon: <BookOpen className="h-10 w-10 text-green-600" />
    },
    {
      title: t('examples.forms.title'),
      description: t('examples.forms.description'),
      href: "/ejemplos/formularios",
      icon: <Terminal className="h-10 w-10 text-orange-600" />
    },
    {
      title: t('examples.animations.title'),
      description: t('examples.animations.description'),
      href: "/ejemplos/animaciones",
      icon: <Rocket className="h-10 w-10 text-pink-600" />
    },
    {
      title: t('examples.notifications.title'),
      description: t('examples.notifications.description'),
      href: "/ejemplos/notificaciones",
      icon: <Code className="h-10 w-10 text-indigo-600" />
    },
    {
      title: t('examples.database.title'),
      description: t('examples.database.description'),
      href: "/ejemplos/database",
      icon: <Terminal className="h-10 w-10 text-teal-600" />
    },
    {
      title: t('examples.themes.title'),
      description: t('examples.themes.description'),
      href: "/ejemplos/ui-temas",
      icon: <BookOpen className="h-10 w-10 text-cyan-600" />
    },
    {
      title: t('examples.blog.title'),
      description: t('examples.blog.description'),
      href: "/blog",
      icon: <BookOpen className="h-10 w-10 text-blue-600" />
    },
  ];

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold text-center mb-12">{t('examples.title')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ejemplos.map((ejemplo, index) => (
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
      
      {/* Premium Examples Section */}
      <div className="mt-12 p-8 border-2 border-yellow-400 rounded-lg shadow-lg bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-yellow-800 dark:text-yellow-200 mb-2">
              🎨 Ejemplos Premium
            </h2>
            <p className="text-yellow-700 dark:text-yellow-300">
              Ejemplos avanzados con funcionalidades premium y librerías especializadas
            </p>
          </div>
          <div className="text-6xl">✨</div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">📊 Analytics Dashboard</h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">Chart.js + D3.js visualizations</p>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">🚀 Modern Landing Page</h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">Scroll animations + parallax</p>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">🛍️ E-commerce Demo</h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">Zustand state management</p>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">📋 Task Management</h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">Drag & drop + local storage</p>
          </div>
        </div>
        
        <div className="text-center">
          <Link 
            href="/ejemplos/premium" 
            className="inline-flex items-center px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            <span className="mr-2">🌟</span>
            Ver Ejemplos Premium
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
        
        <div className="mt-4 text-center text-xs text-yellow-600 dark:text-yellow-400">
          * Los ejemplos premium se instalan opcionalmente durante la creación del proyecto
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