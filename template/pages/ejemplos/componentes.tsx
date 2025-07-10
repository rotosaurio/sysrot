import * as React from 'react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from '@/components/providers/intl-provider';

export default function ComponentesExample(): React.ReactElement {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('basicos');
  const [showCode, setShowCode] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<string[]>([]);

  const addNotification = (message: string) => {
    setNotifications(prev => [...prev, message]);
    setTimeout(() => {
      setNotifications(prev => prev.slice(1));
    }, 3000);
  };

  const categories = [
    { id: 'basicos', name: `🎯 ${t('pages.components.basic')}`, icon: '🎯' },
    { id: 'formularios', name: `📝 ${t('pages.components.forms')}`, icon: '📝' },
    { id: 'navegacion', name: `🧭 ${t('pages.components.navigation')}`, icon: '🧭' },
    { id: 'feedback', name: `💬 ${t('pages.components.feedback')}`, icon: '💬' },
    { id: 'datos', name: `📊 ${t('pages.components.data')}`, icon: '📊' },
    { id: 'layout', name: `📐 ${t('pages.components.layout')}`, icon: '📐' },
    { id: 'avanzados', name: `🚀 ${t('pages.components.advanced')}`, icon: '🚀' }
  ];

  const CodeBlock = ({ title, code }: { title: string; code: string }) => (
    <div className="bg-gray-900 rounded-xl p-6 mt-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-green-400 font-mono text-sm">{title}</h4>
        <button
          onClick={() => {
            navigator.clipboard.writeText(code);
            addNotification(t('pages.components.copied'));
          }}
          className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
        >
          {t('common.copy')}
        </button>
      </div>
      <pre className="text-gray-300 text-sm overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-cyan-600/10 py-16">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.05),transparent)]"></div>
        </div>
        
        <div className="relative container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span>🎨</span>
              Galería de Componentes
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-6">
              {t('pages.components.title')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {t('pages.components.description')}
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-2xl mx-auto">
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 dark:border-gray-700/20">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">50+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Componentes</div>
              </div>
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 dark:border-gray-700/20">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">7</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Categorías</div>
              </div>
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 dark:border-gray-700/20">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">100%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Responsive</div>
              </div>
            </div>
          </div>
        </div>
      </div>

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

      {/* Navigation Categories */}
      <div className="container mx-auto px-6 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Explora por Categorías
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Selecciona una categoría para ver los componentes disponibles
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`group relative p-6 rounded-xl font-medium transition-all duration-300 text-center ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 hover:scale-105'
                }`}
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <div className="text-sm font-semibold leading-tight">
                  {category.name.replace(/🎯|📝|🧭|💬|📊|📐|🚀/g, '').trim()}
                </div>
                
                {/* Active indicator */}
                {activeCategory === category.id && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-yellow-900" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="container mx-auto px-6 pb-12">

      {/* Contenido por Categorías */}
      {activeCategory === 'basicos' && (
        <div className="space-y-12 animate-in slide-in-from-bottom duration-500">
          {/* Botones Avanzados */}
          <section className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <span>🎯</span> Botones Interactivos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              
              {/* Botón Primario con Gradiente */}
              <div className="space-y-4">
                <button className="w-full group relative px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
                  <span className="relative z-10 font-medium">Gradiente</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </button>
                
                {showCode === 'gradient-btn' && (
                  <CodeBlock
                    title="Botón Gradiente"
                    code={`<button className="group relative px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
  <span className="relative z-10 font-medium">Gradiente</span>
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
</button>`}
                  />
                )}
                
                <button
                  onClick={() => setShowCode(showCode === 'gradient-btn' ? null : 'gradient-btn')}
                  className="w-full text-xs text-blue-600 hover:text-blue-700"
                >
                  {showCode === 'gradient-btn' ? 'Ocultar código' : 'Ver código'}
                </button>
              </div>

              {/* Botón Neumórfico */}
              <div className="space-y-4">
                <button className="w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-medium shadow-inner hover:shadow-lg active:shadow-inner transition-all duration-300 border border-gray-300 dark:border-gray-600">
                  Neumórfico
                </button>
                
                {showCode === 'neuro-btn' && (
                  <CodeBlock
                    title="Botón Neumórfico"
                    code={`<button className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-medium shadow-inner hover:shadow-lg active:shadow-inner transition-all duration-300 border border-gray-300 dark:border-gray-600">
  Neumórfico
</button>`}
                  />
                )}
                
                <button
                  onClick={() => setShowCode(showCode === 'neuro-btn' ? null : 'neuro-btn')}
                  className="w-full text-xs text-blue-600 hover:text-blue-700"
                >
                  {showCode === 'neuro-btn' ? 'Ocultar código' : 'Ver código'}
                </button>
              </div>

              {/* Botón con Loading */}
              <div className="space-y-4">
                <button className="w-full group px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="group-hover:ml-2 transition-all">Loading</span>
                </button>
                
                {showCode === 'loading-btn' && (
                  <CodeBlock
                    title="Botón Loading"
                    code={`<button className="group px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2">
  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin opacity-0 group-hover:opacity-100 transition-opacity"></div>
  <span className="group-hover:ml-2 transition-all">Loading</span>
</button>`}
                  />
                )}
                
                <button
                  onClick={() => setShowCode(showCode === 'loading-btn' ? null : 'loading-btn')}
                  className="w-full text-xs text-blue-600 hover:text-blue-700"
                >
                  {showCode === 'loading-btn' ? 'Ocultar código' : 'Ver código'}
                </button>
              </div>

              {/* Botón Floating Action */}
              <div className="space-y-4">
                <button className="w-16 h-16 mx-auto block bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg hover:shadow-2xl transform hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center text-2xl">
                  +
                </button>
                
                {showCode === 'fab-btn' && (
                  <CodeBlock
                    title="Floating Action Button"
                    code={`<button className="w-16 h-16 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg hover:shadow-2xl transform hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center text-2xl">
  +
</button>`}
                  />
                )}
                
                <button
                  onClick={() => setShowCode(showCode === 'fab-btn' ? null : 'fab-btn')}
                  className="w-full text-xs text-blue-600 hover:text-blue-700"
                >
                  {showCode === 'fab-btn' ? 'Ocultar código' : 'Ver código'}
                </button>
              </div>
            </div>
          </section>

          {/* Cards Modernas */}
          <section className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <span>📄</span> Cards Modernas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Cards Modernas */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Cards Modernas</h3>
                
                {/* Pricing Card */}
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Plan Standard</h3>
                      <div className="text-3xl font-bold">$29<span className="text-lg font-normal">/mes</span></div>
                      <p className="text-blue-100">Para equipos profesionales</p>
                    </div>
                    <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                      Recomendado
                    </div>
                  </div>
                  {['✅ Usuarios ilimitados', '✅ Storage 1TB', '✅ Soporte 24/7', '✅ Analytics avanzados'].map((feature, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                  <button className="w-full bg-white text-blue-600 font-bold py-3 rounded-lg hover:bg-blue-50 transition-colors mt-4">
                    Empezar Plan
                  </button>
                </div>

                {/* Stats Card */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Ventas Totales</h4>
                      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">$45,678</div>
                      <div className="text-sm text-green-600 font-medium">+12% este mes</div>
                    </div>
                    <div className="text-3xl text-green-500">📈</div>
                  </div>
                </div>
                
                {/* Interactive Card */}
                <div className="group cursor-pointer">
                  <div className="bg-gradient-to-r from-green-400 to-blue-500 p-6 rounded-xl shadow-lg group-hover:shadow-xl transform group-hover:scale-105 transition-all duration-300">
                    <h3 className="text-white text-xl font-bold mb-2">Proyecto Alpha</h3>
                    <p className="text-green-100 mb-4">Aplicación web moderna con React y Node.js</p>
                    <div className="flex items-center justify-between">
                      <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">En progreso</span>
                      <div className="text-white">85%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Badges y Tags */}
          <section className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <span>🏷️</span> Badges y Tags
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Estados</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-sm rounded-full font-medium flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Activo
                  </span>
                  <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-sm rounded-full font-medium">
                    ⏳ Pendiente
                  </span>
                  <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 text-sm rounded-full font-medium">
                    ❌ Inactivo
                  </span>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm rounded-full font-medium">
                    🔄 Procesando
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Tecnologías</h3>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Next.js', 'TypeScript', 'TailwindCSS', 'MongoDB'].map((tech, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm rounded-full font-medium hover:scale-105 transition-transform duration-200 cursor-pointer"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Niveles</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gray-800 text-white text-sm rounded font-bold border border-gold">
                    🥇 Básico
                  </span>
                  <span className="px-3 py-1 bg-gray-600 text-white text-sm rounded font-bold">
                    🥈 Pro
                  </span>
                  <span className="px-3 py-1 bg-orange-600 text-white text-sm rounded font-bold">
                    🥉 Basic
                  </span>
                  <span className="px-3 py-1 bg-green-600 text-white text-sm rounded font-bold">
                    🆓 Free
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Formularios Category */}
      {activeCategory === 'formularios' && (
        <div className="space-y-12 animate-in slide-in-from-bottom duration-500">
          <section className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <span>📝</span> Inputs Modernos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Floating Label Input */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Floating Label</h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder=" "
                    className="peer w-full p-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-transparent focus:border-blue-500 focus:outline-none transition-all duration-300"
                  />
                  <label className="absolute left-4 -top-2.5 bg-white dark:bg-gray-800 px-2 text-sm font-medium text-gray-600 dark:text-gray-400 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500">
                    Nombre completo
                  </label>
                </div>
              </div>

              {/* Input con Icono */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Input con Icono</h3>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-300"
                  />
                </div>
              </div>

              {/* Select Customizado */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Select Moderno</h3>
                <div className="relative">
                  <select className="w-full p-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:border-purple-500 focus:outline-none transition-colors duration-300 appearance-none cursor-pointer">
                    <option>Selecciona una opción</option>
                    <option>🚀 Opción Completa</option>
                    <option>⭐ Opción Estándar</option>
                    <option>✨ Opción Básica</option>
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Toggle Switch */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Toggle Switch</h3>
                <div className="flex items-center space-x-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium">Notificaciones</span>
                  </label>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Navegación Category */}
      {activeCategory === 'navegacion' && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom duration-500">
          
          {/* Breadcrumbs Avanzados */}
          <section className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <span>🧭</span> Navegación Avanzada
            </h2>
            
            <div className="space-y-8">
              
              {/* Breadcrumbs Modernos */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Breadcrumbs Interactivos</h3>
                <nav className="flex items-center space-x-2 text-sm">
                  <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                    </svg>
                    Inicio
                  </a>
                  <span className="text-gray-400">›</span>
                  <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors">Productos</a>
                  <span className="text-gray-400">›</span>
                  <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors">Categoría</a>
                  <span className="text-gray-400">›</span>
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Producto Actual</span>
                </nav>
              </div>

              {/* Sidebar Navigation */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Sidebar Moderno</h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 max-w-xs">
                  <nav className="space-y-2">
                    {[
                      { icon: '📊', name: 'Dashboard', active: true },
                      { icon: '👥', name: 'Usuarios', active: false },
                      { icon: '📈', name: 'Análisis', active: false },
                      { icon: '⚙️', name: 'Configuración', active: false },
                    ].map((item, index) => (
                      <a
                        key={index}
                        href="#"
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                          item.active
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md'
                        }`}
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span className="font-medium">{item.name}</span>
                        {item.active && <span className="ml-auto w-2 h-2 bg-white rounded-full"></span>}
                      </a>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Tabs Interactivos */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Tabs Animados</h3>
                <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded-xl inline-flex">
                  {['General', 'Seguridad', 'Notificaciones'].map((tab, index) => (
                    <button
                      key={index}
                      className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                        index === 0
                          ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Feedback Category */}
      {activeCategory === 'feedback' && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom duration-500">
          
          {/* Modales y Alertas */}
          <section className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <span>💬</span> Feedback y Modales
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Alertas de Estado */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Alertas de Estado</h3>
                <div className="space-y-3">
                  
                  {/* Success Alert */}
                  <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-green-800 dark:text-green-200">Éxito</h4>
                      <p className="text-sm text-green-600 dark:text-green-300">Operación completada correctamente</p>
                    </div>
                  </div>

                  {/* Warning Alert */}
                  <div className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Advertencia</h4>
                      <p className="text-sm text-yellow-600 dark:text-yellow-300">Revisa la configuración antes de continuar</p>
                    </div>
                  </div>

                  {/* Error Alert */}
                  <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-red-800 dark:text-red-200">Error</h4>
                      <p className="text-sm text-red-600 dark:text-red-300">No se pudo completar la operación</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Preview */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Vista Previa Modal</h3>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 relative overflow-hidden">
                  {/* Backdrop simulado */}
                  <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
                  
                  {/* Modal content */}
                  <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-sm mx-auto">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-semibold">Confirmar Acción</h4>
                      <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                        </svg>
                      </button>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                      ¿Estás seguro de que quieres eliminar este elemento? Esta acción no se puede deshacer.
                    </p>
                    <div className="flex gap-3">
                      <button className="flex-1 px-4 py-2 text-sm bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                        Cancelar
                      </button>
                      <button className="flex-1 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Progress Indicators */}
          <section className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl font-bold mb-8">Progress Indicators</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Progress Bars */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Progress Bars</h3>
                
                {[
                  { label: 'HTML/CSS', value: 90, color: 'bg-blue-500' },
                  { label: 'JavaScript', value: 85, color: 'bg-yellow-500' },
                  { label: 'React', value: 80, color: 'bg-cyan-500' },
                  { label: 'Node.js', value: 70, color: 'bg-green-500' },
                ].map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{skill.label}</span>
                      <span className="text-gray-600 dark:text-gray-400">{skill.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${skill.color} transition-all duration-1000 ease-out`}
                        style={{ width: `${skill.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Circular Progress */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Circular Progress</h3>
                <div className="flex justify-center items-center space-x-8">
                  
                  {[75, 60, 90].map((percentage, index) => (
                    <div key={index} className="relative w-20 h-20">
                      <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-gray-200 dark:text-gray-700"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeDasharray={`${percentage}, 100`}
                          className={`${
                            index === 0 ? 'text-blue-500' :
                            index === 1 ? 'text-green-500' : 'text-purple-500'
                          }`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-semibold">{percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Datos Category */}
      {activeCategory === 'datos' && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom duration-500">
          
          {/* Tables y Data Display */}
          <section className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <span>📊</span> Visualización de Datos
            </h2>
            
            {/* Tabla Premium */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Tabla Interactiva</h3>
              <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-xl">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Usuario
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Rol
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {[
                      { name: 'Ana García', email: 'ana@ejemplo.com', status: 'Activo', role: 'Admin' },
                      { name: 'Carlos López', email: 'carlos@ejemplo.com', status: 'Inactivo', role: 'Usuario' },
                      { name: 'María Rodríguez', email: 'maria@ejemplo.com', status: 'Activo', role: 'Editor' },
                    ].map((user, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                              {user.name.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                            user.status === 'Activo' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {user.role}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                            Editar
                          </button>
                          <button className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
              {[
                { title: 'Usuarios Totales', value: '2,543', change: '+12%', color: 'text-blue-600' },
                { title: 'Ventas', value: '$45,678', change: '+8%', color: 'text-green-600' },
                { title: 'Conversiones', value: '23.4%', change: '-2%', color: 'text-red-600' },
                { title: 'Satisfacción', value: '4.8/5', change: '+0.2', color: 'text-purple-600' },
              ].map((stat, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{stat.title}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</span>
                    <span className={`text-sm font-medium ${stat.color}`}>{stat.change}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Layout Category */}
      {activeCategory === 'layout' && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom duration-500">
          
          {/* Grid Systems */}
          <section className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <span>📐</span> Sistemas de Layout
            </h2>
            
            <div className="space-y-8">
              
              {/* Grid Responsive */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Grid Responsive</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div 
                      key={index}
                      className="bg-gradient-to-br from-blue-400 to-purple-500 h-20 rounded-lg flex items-center justify-center text-white font-bold"
                    >
                      {index + 1}
                    </div>
                  ))}
                </div>
              </div>

              {/* Flexbox Layouts */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Flexbox Layouts</h3>
                
                {/* Center Layout */}
                <div className="bg-gray-100 dark:bg-gray-700 h-32 rounded-lg flex items-center justify-center">
                  <div className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium">
                    Centrado Perfecto
                  </div>
                </div>

                {/* Space Between */}
                <div className="bg-gray-100 dark:bg-gray-700 h-20 rounded-lg flex items-center justify-between px-6">
                  <div className="bg-red-500 text-white px-4 py-2 rounded">Izquierda</div>
                  <div className="bg-blue-500 text-white px-4 py-2 rounded">Centro</div>
                  <div className="bg-purple-500 text-white px-4 py-2 rounded">Derecha</div>
                </div>
              </div>

              {/* Container Sizes */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Container Sizes</h3>
                <div className="space-y-3">
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="max-w-sm mx-auto bg-blue-500 text-white p-3 rounded text-center">
                      Small Container (max-w-sm)
                    </div>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="max-w-4xl mx-auto bg-green-500 text-white p-3 rounded text-center">
                      Large Container (max-w-4xl)
                    </div>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="max-w-full mx-auto bg-purple-500 text-white p-3 rounded text-center">
                      Full Width Container
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Avanzados Category */}
      {activeCategory === 'avanzados' && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom duration-500">
          
          {/* Componentes Complejos */}
          <section className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <span>🚀</span> Componentes Avanzados
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Calendar Component */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Calendario Interactivo</h3>
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold">Junio 2025</h4>
                    <div className="flex gap-2">
                      <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">‹</button>
                      <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">›</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-sm">
                    {['D', 'L', 'M', 'X', 'J', 'V', 'S'].map(day => (
                      <div key={day} className="p-2 font-medium text-gray-500 dark:text-gray-400">
                        {day}
                      </div>
                    ))}
                    {Array.from({ length: 30 }).map((_, index) => (
                      <button
                        key={index}
                        className={`p-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors ${
                          index + 1 === 17 ? 'bg-blue-600 text-white' : ''
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* File Upload Advanced */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Upload Avanzado</h3>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer">
                  <div className="text-4xl mb-4">📁</div>
                  <p className="text-lg font-medium mb-2">Arrastra archivos aquí</p>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">o haz clic para seleccionar</p>
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Seleccionar Archivos
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                    Máximo 10MB • JPG, PNG, PDF
                  </p>
                </div>
              </div>

              {/* Rich Text Editor Preview */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Editor de Texto</h3>
                <div className="border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">
                  {/* Toolbar */}
                  <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex gap-2">
                      {['B', 'I', 'U'].map(btn => (
                        <button key={btn} className="w-8 h-8 rounded hover:bg-gray-200 dark:hover:bg-gray-600 font-bold text-sm">
                          {btn}
                        </button>
                      ))}
                      <div className="w-px bg-gray-300 dark:bg-gray-600 mx-2"></div>
                      {['🔗', '📷', '📋'].map(icon => (
                        <button key={icon} className="w-8 h-8 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-sm">
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Content Area */}
                  <div className="p-4 min-h-32 bg-white dark:bg-gray-800">
                    <p className="text-gray-600 dark:text-gray-400">
                      Escribe tu contenido aquí...
                    </p>
                  </div>
                </div>
              </div>

              {/* Media Player */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Reproductor de Media</h3>
                <div className="bg-black rounded-xl overflow-hidden">
                  {/* Video Area */}
                  <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-l-6 border-l-white border-y-4 border-y-transparent ml-1"></div>
                    </div>
                  </div>
                  {/* Controls */}
                  <div className="bg-gray-900 p-4">
                    <div className="flex items-center gap-4">
                      <button className="text-white hover:text-blue-400">▶️</button>
                      <div className="flex-1 bg-gray-700 h-1 rounded-full">
                        <div className="w-1/3 bg-blue-500 h-1 rounded-full"></div>
                      </div>
                      <span className="text-white text-sm">1:23 / 4:56</span>
                      <button className="text-white hover:text-blue-400">🔊</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
      </div>
    </div>
  );
} 
