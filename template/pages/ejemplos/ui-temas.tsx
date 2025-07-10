import * as React from 'react';
import { useState } from 'react';
import { useTheme } from 'next-themes';
import { useTranslation } from '@/components/providers/intl-provider';

export default function UITemasExample(): React.ReactElement {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [activeTab, setActiveTab] = useState('componentes');
  const [showModal, setShowModal] = useState(false);
  const [progress, setProgress] = useState(65);
  const [showCode, setShowCode] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<string[]>([]);
  const { t } = useTranslation();

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

  // Evitar hidration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="container mx-auto py-12">
        <div className="animate-pulse">Cargando...</div>
      </div>
    );
  }

  return (
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

      <div className="container mx-auto py-12 space-y-12">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span>🎨</span>
            Temas y Componentes UI
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            {t('pages.themes.title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {t('pages.themes.description')}
          </p>
        </div>

      {/* Control de Tema Avanzado */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-8 rounded-2xl">
        <div className="absolute inset-0 bg-grid opacity-5"></div>
        <div className="relative">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <span className="animate-spin">��</span>
            {t('pages.themes.themeControls')}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4">{t('pages.themes.currentTheme')}: {resolvedTheme}</h3>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setTheme('light')}
                    className={`group p-4 rounded-xl transition-all duration-300 ${
                      theme === 'light'
                        ? 'bg-yellow-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 dark:bg-gray-700 hover:scale-105 hover:shadow-md'
                    }`}
                  >
                    <div className="text-2xl mb-2 group-hover:animate-bounce">🌞</div>
                    <div className="text-sm font-medium">{t('pages.themes.lightMode')}</div>
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`group p-4 rounded-xl transition-all duration-300 ${
                      theme === 'dark'
                        ? 'bg-blue-600 text-white shadow-lg scale-105'
                        : 'bg-gray-100 dark:bg-gray-700 hover:scale-105 hover:shadow-md'
                    }`}
                  >
                    <div className="text-2xl mb-2 group-hover:animate-pulse">🌙</div>
                    <div className="text-sm font-medium">{t('pages.themes.darkMode')}</div>
                  </button>
                  <button
                    onClick={() => setTheme('system')}
                    className={`group p-4 rounded-xl transition-all duration-300 ${
                      theme === 'system'
                        ? 'bg-purple-600 text-white shadow-lg scale-105'
                        : 'bg-gray-100 dark:bg-gray-700 hover:scale-105 hover:shadow-md'
                    }`}
                  >
                    <div className="text-2xl mb-2 group-hover:animate-spin">💻</div>
                    <div className="text-sm font-medium">{t('pages.themes.systemMode')}</div>
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-gray-900 p-6 rounded-xl overflow-hidden">
              <div className="text-green-400 text-sm mb-2">// next-themes implementation</div>
              <pre className="text-gray-300 text-sm leading-relaxed">{`import { useTheme } from 'next-themes';

const { theme, setTheme } = useTheme();

// Auto theme switching
setTheme('system'); // follows OS
setTheme('light');  // force light
setTheme('dark');   // force dark`}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs de Navegación */}
      <section>
        <div className="flex flex-wrap gap-2 mb-8 p-2 bg-gray-100 dark:bg-gray-800 rounded-xl">
          {[
            { id: 'componentes', label: '🧩 Componentes', icon: '🧩' },
            { id: 'animaciones', label: '✨ Animaciones', icon: '✨' },
            { id: 'colores', label: '🎨 Colores', icon: '🎨' },
            { id: 'layouts', label: '📱 Layouts', icon: '📱' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-700 shadow-lg scale-105 text-blue-600 dark:text-blue-400'
                  : 'hover:bg-white/50 dark:hover:bg-gray-700/50'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenido de Tabs */}
        {activeTab === 'componentes' && (
          <div className="space-y-8 animate-in slide-in-from-right duration-500">
            {/* Botones Avanzados */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold mb-6">Botones Interactivos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button className="group px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <span className="group-hover:animate-pulse">🚀 Gradiente</span>
                </button>
                <button className="px-6 py-3 bg-transparent border-2 border-green-500 text-green-500 rounded-xl hover:bg-green-500 hover:text-white transition-all duration-300 hover:shadow-lg">
                  ✅ Outline
                </button>
                <button className="group px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-300 relative overflow-hidden">
                  <span className="relative z-10">❌ Danger</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                </button>
                <button 
                  onClick={() => setShowModal(true)}
                  className="px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  🎭 Modal
                </button>
              </div>
            </div>

            {/* Cards Avanzadas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-gray-200 dark:border-gray-700">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white text-xl mb-4 group-hover:rotate-12 transition-transform duration-300">
                  📊
                </div>
                <h4 className="text-xl font-semibold mb-2">Analytics Card</h4>
                <p className="text-muted-foreground mb-4">Tarjeta con animaciones hover y efectos de profundidad.</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">+24%</span>
                  <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-6 rounded-2xl text-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="text-3xl mb-4">🎨</div>
                <h4 className="text-xl font-semibold mb-2">Gradient Card</h4>
                <p className="text-purple-100 mb-4">Efectos visuales con gradientes dinámicos.</p>
                <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg transition-all duration-300">
                  Explorar
                </button>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 border-l-4 border-green-500">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-xl">✅</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{progress}%</div>
                    <div className="text-sm text-muted-foreground">Progreso</div>
                  </div>
                </div>
                <h4 className="text-xl font-semibold mb-2">Progress Card</h4>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <button 
                  onClick={() => setProgress(Math.min(100, progress + 10))}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Incrementar →
                </button>
              </div>
            </div>

            {/* Inputs Modernos */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold mb-6">Inputs Modernos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder=" "
                      className="peer w-full p-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-transparent focus:border-blue-500 focus:outline-none transition-colors duration-300"
                    />
                    <label className="absolute left-4 -top-2.5 bg-white dark:bg-gray-800 px-2 text-sm font-medium text-gray-600 dark:text-gray-400 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500">
                      Floating Label
                    </label>
                  </div>
                  
                  <div className="relative">
                    <select className="w-full p-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:border-purple-500 focus:outline-none transition-colors duration-300 appearance-none">
                      <option>🚀 Opción Completa</option>
                      <option>Opción Estándar</option>
                      <option>Opción Básica</option>
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <textarea
                      rows={4}
                      placeholder="Escribe tu mensaje aquí..."
                      className="w-full p-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-transparent focus:border-green-500 focus:outline-none transition-colors duration-300 resize-none"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      <span className="ml-3 text-sm font-medium">Toggle Switch</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'animaciones' && (
          <div className="space-y-8 animate-in slide-in-from-left duration-500">
            {/* Animaciones CSS */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold mb-6">Animaciones CSS</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto animate-bounce"></div>
                  <p className="font-medium">Bounce</p>
                  <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">animate-bounce</code>
                </div>
                
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-purple-500 rounded-full mx-auto animate-spin"></div>
                  <p className="font-medium">Spin</p>
                  <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">animate-spin</code>
                </div>
                
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-500 rounded-full mx-auto animate-ping"></div>
                  <p className="font-medium">Ping</p>
                  <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">animate-ping</code>
                </div>
                
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-red-500 rounded-full mx-auto animate-pulse"></div>
                  <p className="font-medium">Pulse</p>
                  <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">animate-pulse</code>
                </div>
              </div>
            </div>

            {/* Hover Effects */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold mb-6">Efectos Hover</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="group p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 cursor-pointer">
                  <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">🎯</div>
                  <h4 className="font-semibold mb-2">Scale Effect</h4>
                  <p className="text-sm text-muted-foreground">Hover para escalar</p>
                </div>
                
                <div className="group p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 cursor-pointer">
                  <div className="text-4xl mb-4 group-hover:rotate-12 transition-transform duration-300">🔄</div>
                  <h4 className="font-semibold mb-2">Rotate Effect</h4>
                  <p className="text-sm text-muted-foreground">Hover para rotar</p>
                </div>
                
                <div className="group p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300 cursor-pointer overflow-hidden relative">
                  <div className="text-4xl mb-4 group-hover:animate-bounce">⚡</div>
                  <h4 className="font-semibold mb-2">Slide Effect</h4>
                  <p className="text-sm text-muted-foreground">Hover para deslizar</p>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'colores' && (
          <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
            {/* Paleta de Colores */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold mb-6">Paleta de Colores</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { name: 'Primary', colors: ['bg-blue-100', 'bg-blue-300', 'bg-blue-500', 'bg-blue-700', 'bg-blue-900'] },
                  { name: 'Success', colors: ['bg-green-100', 'bg-green-300', 'bg-green-500', 'bg-green-700', 'bg-green-900'] },
                  { name: 'Warning', colors: ['bg-yellow-100', 'bg-yellow-300', 'bg-yellow-500', 'bg-yellow-700', 'bg-yellow-900'] },
                  { name: 'Danger', colors: ['bg-red-100', 'bg-red-300', 'bg-red-500', 'bg-red-700', 'bg-red-900'] }
                ].map((palette) => (
                  <div key={palette.name} className="space-y-3">
                    <h4 className="font-semibold">{palette.name}</h4>
                    <div className="space-y-2">
                      {palette.colors.map((color, index) => (
                        <div key={index} className={`${color} h-10 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer group relative`}>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="text-white font-medium text-sm">
                              {color.replace('bg-', '')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'layouts' && (
          <div className="space-y-8 animate-in slide-in-from-top duration-500">
            {/* Layouts Responsivos */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold mb-6">Layouts Responsivos</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }, (_, i) => (
                    <div key={i} className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 p-6 rounded-xl text-center hover:scale-105 transition-transform duration-300">
                      <div className="text-2xl mb-2">📱</div>
                      <div className="font-medium">Grid {i + 1}</div>
                      <div className="text-sm text-muted-foreground">Responsive</div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-gray-900 text-white p-6 rounded-xl overflow-x-auto">
                  <pre className="text-sm">{`<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Responsive: 1 col mobile, 2 tablet, 4 desktop */}
</div>`}</pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in duration-300">
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold mb-4">¡Modal Animado!</h3>
              <p className="text-muted-foreground mb-6">
                Este modal aparece con animaciones suaves y backdrop blur.
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-300"
              >
                Cerrar Modal
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
} 