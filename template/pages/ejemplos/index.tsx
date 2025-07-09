import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Code, Rocket, Terminal, Star, Zap, Shield, Palette } from '@/components/ui/icons';
import { useTranslation } from '@/components/providers/intl-provider';

export default function EjemplosPage() {
  const { t } = useTranslation();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const ejemplos = [
    {
      title: t('examples.auth.title'),
      description: t('examples.auth.description'),
      href: "/ejemplos/auth",
      icon: <Shield className="h-8 w-8" />,
      color: "from-blue-500 to-cyan-500",
      category: "Seguridad"
    },
    {
      title: t('examples.ai.title'),
      description: t('examples.ai.description'),
      href: "/ejemplos/ai",
      icon: <Zap className="h-8 w-8" />,
      color: "from-purple-500 to-pink-500",
      category: "IA & ML"
    },
    {
      title: t('examples.components.title'),
      description: t('examples.components.description'),
      href: "/ejemplos/componentes",
      icon: <Code className="h-8 w-8" />,
      color: "from-emerald-500 to-teal-500",
      category: "UI/UX"
    },
    {
      title: t('examples.upload.title'),
      description: t('examples.upload.description'),
      href: "/ejemplos/upload",
      icon: <BookOpen className="h-8 w-8" />,
      color: "from-green-500 to-lime-500",
      category: "Archivos"
    },
    {
      title: t('examples.forms.title'),
      description: t('examples.forms.description'),
      href: "/ejemplos/formularios",
      icon: <Terminal className="h-8 w-8" />,
      color: "from-orange-500 to-red-500",
      category: "Formularios"
    },
    {
      title: t('examples.animations.title'),
      description: t('examples.animations.description'),
      href: "/ejemplos/animaciones",
      icon: <Rocket className="h-8 w-8" />,
      color: "from-pink-500 to-rose-500",
      category: "Animaciones"
    },
    {
      title: t('examples.notifications.title'),
      description: t('examples.notifications.description'),
      href: "/ejemplos/notificaciones",
      icon: <Star className="h-8 w-8" />,
      color: "from-indigo-500 to-purple-500",
      category: "Feedback"
    },
    {
      title: t('examples.database.title'),
      description: t('examples.database.description'),
      href: "/ejemplos/database",
      icon: <Terminal className="h-8 w-8" />,
      color: "from-teal-500 to-cyan-500",
      category: "Datos"
    },
    {
      title: t('examples.themes.title'),
      description: t('examples.themes.description'),
      href: "/ejemplos/ui-temas",
      icon: <Palette className="h-8 w-8" />,
      color: "from-cyan-500 to-blue-500",
      category: "Temas"
    },
    {
      title: t('examples.blog.title'),
      description: t('examples.blog.description'),
      href: "/blog",
      icon: <BookOpen className="h-8 w-8" />,
      color: "from-violet-500 to-purple-500",
      category: "Blog"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative container mx-auto px-6 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              ¡Explora y Aprende!
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent mb-6">
              {t('examples.title')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Descubre ejemplos prácticos y modernos para acelerar tu desarrollo. Desde componentes básicos hasta integraciones avanzadas.
            </p>
          </div>
        </div>
      </div>
      
      {/* Examples Grid */}
      <div className="container mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ejemplos.map((ejemplo, index) => (
            <Link href={ejemplo.href} key={index} className="group">
              <div 
                className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-200/50 dark:border-gray-700/50"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${ejemplo.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                {/* Category Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="px-3 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-xs font-medium text-gray-600 dark:text-gray-300 rounded-full border border-gray-200 dark:border-gray-600">
                    {ejemplo.category}
                  </span>
                </div>

                <div className="relative p-8">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${ejemplo.color} rounded-2xl text-white mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                    {ejemplo.icon}
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {ejemplo.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                      {ejemplo.description}
                    </p>
                    
                    {/* Action */}
                    <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium">
                      <span>Explorar ejemplo</span>
                      <ArrowRight className={`ml-2 h-4 w-4 transition-transform duration-300 ${hoveredCard === index ? 'translate-x-2' : ''}`} />
                    </div>
                  </div>
                </div>

                {/* Hover Effect Line */}
                <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${ejemplo.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Premium Examples Section */}
      <div className="container mx-auto px-6 pb-16">
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-3xl shadow-2xl">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px)`,
              backgroundSize: '50px 50px'
            }}></div>
          </div>
          
          <div className="relative p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Star className="h-4 w-4" />
                Premium Content
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                ✨ Ejemplos de Integración Completa
              </h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Ejemplos avanzados con funcionalidades completas, librerías especializadas y patrones de diseño profesionales
              </p>
            </div>
            
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {[
                { icon: '📊', title: 'Analytics Dashboard', desc: 'Chart.js + D3.js', gradient: 'from-cyan-400 to-blue-500' },
                { icon: '🏢', title: 'Multi-tenant SaaS', desc: 'Gestión de suscripciones', gradient: 'from-green-400 to-emerald-500' },
                { icon: '🏪', title: 'Marketplace', desc: 'Reseñas + vendedores', gradient: 'from-orange-400 to-red-500' },
                { icon: '👨‍💼', title: 'Portfolio', desc: 'Responsive + animaciones', gradient: 'from-purple-400 to-pink-500' },
                { icon: '🛍️', title: 'E-commerce', desc: 'Zustand + carrito', gradient: 'from-indigo-400 to-purple-500' },
                { icon: '📋', title: 'Task Management', desc: 'Drag & drop + storage', gradient: 'from-teal-400 to-cyan-500' },
                { icon: '💬', title: 'Real-time Chat', desc: 'WebSockets + salas', gradient: 'from-pink-400 to-rose-500' },
                { icon: '🚀', title: 'Landing Page', desc: 'Scroll + parallax', gradient: 'from-yellow-400 to-orange-500' },
              ].map((feature, index) => (
                <div key={index} className="group cursor-pointer">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40">
                    <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-blue-100 text-sm">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Call to Action */}
            <div className="text-center">
              <Link 
                href="/ejemplos/premium" 
                className="group inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-50 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                <span className="text-2xl">�</span>
                <span>Explorar Ejemplos Premium</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <div className="mt-6 text-blue-100 text-sm">
                * Incluye funcionalidades avanzadas y librerías especializadas
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="container mx-auto px-6 pb-16">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('examples.about.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                {t('examples.about.description')}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                {t('examples.about.docs')}
                <code className="mx-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400 rounded-lg font-mono text-sm">
                  DOCUMENTACION.md
                </code>
                {t('examples.about.docsPath')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 