import * as React from 'react';
import { useState, useEffect } from 'react';
import { useTranslation } from '@/components/providers/intl-provider';

export default function AnimacionesExample(): React.ReactElement {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('basicas');
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showFloatingElements, setShowFloatingElements] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const tabs = [
    { id: 'basicas', name: `🎯 ${t('pages.animations.basic')}`, icon: '🎯' },
    { id: 'hover', name: `✨ ${t('pages.animations.hover')}`, icon: '✨' },
    { id: 'scroll', name: `📜 ${t('pages.animations.scroll')}`, icon: '📜' },
    { id: 'micro', name: `🔮 ${t('pages.animations.micro')}`, icon: '🔮' },
    { id: 'avanzadas', name: `🚀 ${t('pages.animations.advanced')}`, icon: '🚀' },
    { id: 'loading', name: `⏳ ${t('pages.animations.loading')}`, icon: '⏳' }
  ];

  return (
    <div className="container mx-auto py-12 space-y-8">
      {/* Header con animación de entrada */}
      <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent animate-gradient">
          {t('pages.animations.title')}
        </h1>
        <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
          {t('pages.animations.description')}
        </p>
      </div>

      {/* Floating Mouse Follower - ARREGLADO */}
      <div 
        className="fixed w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full pointer-events-none z-50 mix-blend-difference transition-transform duration-75 ease-out"
        style={{
          left: mousePosition.x - 8,  // Centrado: width/2 = 4/2 = 2, pero usamos 8 para mejor centrado visual
          top: mousePosition.y - 8,   // Centrado: height/2 = 4/2 = 2, pero usamos 8 para mejor centrado visual
          transform: `scale(${showFloatingElements ? 1 : 0})`,
          transition: 'transform 0.2s ease-out'
        }}
      />

      {/* Navegación con tabs animados */}
      <div className="flex flex-wrap gap-3 justify-center p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            onMouseEnter={() => setShowFloatingElements(true)}
            onMouseLeave={() => setShowFloatingElements(false)}
            className={`group relative px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                : 'hover:bg-white/80 dark:hover:bg-gray-700/80 hover:shadow-md'
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <span className="relative z-10 flex items-center gap-2">
              <span className="text-lg">{tab.icon}</span>
              {tab.name}
            </span>
            
            {/* Efecto de shimmer */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </div>
          </button>
        ))}
      </div>

      {/* Contenido por tabs */}
      {activeTab === 'basicas' && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom duration-700">
          {/* Fade & Slide Animations */}
          <section className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <span className="animate-bounce">🎯</span> 
              Animaciones Básicas
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              
              {/* Fade In */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Fade In</h3>
                <div className="h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl animate-fade-in flex items-center justify-center text-white font-bold text-xl">
                  Fade In
                </div>
                <code className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded block">
                  .animate-fade-in
                </code>
              </div>

              {/* Slide Up */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Slide Up</h3>
                <div className="h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-xl animate-slide-up flex items-center justify-center text-white font-bold text-xl">
                  Slide Up
                </div>
                <code className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded block">
                  .animate-slide-up
                </code>
              </div>

              {/* Scale In */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Scale In</h3>
                <div className="h-32 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl animate-scale-in flex items-center justify-center text-white font-bold text-xl">
                  Scale In
                </div>
                <code className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded block">
                  .animate-scale-in
                </code>
              </div>

              {/* Rotate In */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Rotate In</h3>
                <div className="h-32 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl animate-rotate-in flex items-center justify-center text-white font-bold text-xl">
                  Rotate In
                </div>
                <code className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded block">
                  .animate-rotate-in
                </code>
              </div>
            </div>
          </section>

          {/* CSS Keyframes Demo */}
          <section className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <span className="animate-spin">⚡</span> 
              Animaciones CSS Keyframes
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Pulse Effect */}
              <div className="text-center space-y-4">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-red-400 to-red-600 rounded-full animate-pulse-custom shadow-lg"></div>
                <h3 className="font-semibold">Pulse Custom</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Efecto de latido suave</p>
              </div>

              {/* Bounce Effect */}
              <div className="text-center space-y-4">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full animate-bounce-custom shadow-lg"></div>
                <h3 className="font-semibold">Bounce Custom</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Rebote realista</p>
              </div>

              {/* Shake Effect */}
              <div className="text-center space-y-4">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-teal-400 to-cyan-600 rounded-full animate-shake shadow-lg"></div>
                <h3 className="font-semibold">Shake</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Vibración sutil</p>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Hover Effects Tab */}
      {activeTab === 'hover' && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom duration-700">
          
          {/* Cards con Hover Effects */}
          <section className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <span>✨</span> Hover Effects Avanzados
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Hover Lift */}
              <div className="group cursor-pointer">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-xl shadow-lg transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:-translate-y-2">
                  <h3 className="text-white font-bold text-xl mb-2">Hover Lift</h3>
                  <p className="text-blue-100">Elevación suave con sombra</p>
                </div>
              </div>

              {/* Glow Effect */}
              <div className="group cursor-pointer">
                <div className="bg-gradient-to-br from-green-500 to-teal-600 p-6 rounded-xl shadow-lg transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-green-500/50 group-hover:shadow-2xl">
                  <h3 className="text-white font-bold text-xl mb-2">Glow Effect</h3>
                  <p className="text-green-100">Resplandor de color al hover</p>
                </div>
              </div>

              {/* Slide Content */}
              <div className="group cursor-pointer overflow-hidden">
                <div className="bg-gradient-to-br from-pink-500 to-red-600 p-6 rounded-xl shadow-lg h-32 relative">
                  <div className="absolute inset-0 p-6 transform translate-y-0 group-hover:-translate-y-full transition-transform duration-500">
                    <h3 className="text-white font-bold text-xl">Slide Content</h3>
                  </div>
                  <div className="absolute inset-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-br from-purple-500 to-pink-600">
                    <h3 className="text-white font-bold text-xl">¡Contenido oculto!</h3>
                    <p className="text-pink-100 text-sm">Desliza para revelar</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Botones con efectos avanzados */}
          <section className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl font-bold mb-8">Botones Interactivos</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Ripple Effect */}
              <button className="group relative px-6 py-3 bg-blue-600 text-white rounded-lg overflow-hidden transition-all duration-300 hover:bg-blue-700 active:scale-95">
                <span className="relative z-10">Ripple Effect</span>
                <div className="absolute inset-0 bg-white opacity-0 group-active:opacity-30 rounded-full scale-0 group-active:scale-110 transition-all duration-300"></div>
              </button>

              {/* Magnetic Effect */}
              <button className="group px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg transition-all duration-300 hover:scale-110 hover:rotate-2 active:scale-95">
                Magnetic
              </button>

              {/* Loading Transform */}
              <button className="group px-6 py-3 bg-green-600 text-white rounded-lg transition-all duration-300 hover:bg-green-700 active:scale-95 flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-spin transition-opacity"></div>
                <span className="group-hover:ml-1 transition-all">Loading</span>
              </button>

              {/* Neon Glow */}
              <button className="px-6 py-3 bg-black text-cyan-400 border border-cyan-400 rounded-lg transition-all duration-300 hover:shadow-cyan-400/50 hover:shadow-lg hover:bg-cyan-400/10">
                Neon Glow
              </button>
            </div>
          </section>
        </div>
      )}

      {/* Scroll Animations Tab */}
      {activeTab === 'scroll' && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom duration-700">
          
          <section className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <span>📜</span> Scroll Triggered Animations
            </h2>
            
            <div className="space-y-16">
              {/* Elementos que aparecen en scroll */}
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-8 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl shadow-lg animate-on-scroll"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${
                      index % 6 === 0 ? 'from-red-400 to-red-600' :
                      index % 6 === 1 ? 'from-blue-400 to-blue-600' :
                      index % 6 === 2 ? 'from-green-400 to-green-600' :
                      index % 6 === 3 ? 'from-purple-400 to-purple-600' :
                      index % 6 === 4 ? 'from-yellow-400 to-yellow-600' :
                      'from-pink-400 to-pink-600'
                    } flex items-center justify-center text-white font-bold`}>
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Elemento #{index + 1}</h3>
                      <p className="text-gray-600 dark:text-gray-400">Aparece al hacer scroll</p>
                    </div>
                  </div>
                  
                  <div className="hidden md:block">
                    <div className="w-24 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-fill-bar"
                        style={{ animationDelay: `${index * 300 + 500}ms` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Loading States Tab */}
      {activeTab === 'loading' && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom duration-700">
          
          <section className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <span>⏳</span> Loading States Modernos
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Spinner */}
              <div className="text-center space-y-4">
                <div className="w-12 h-12 mx-auto border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <h3 className="font-semibold">Spinner Clásico</h3>
              </div>

              {/* Dots */}
              <div className="text-center space-y-4">
                <div className="flex justify-center gap-1">
                  <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce-dots" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce-dots" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce-dots" style={{ animationDelay: '300ms' }}></div>
                </div>
                <h3 className="font-semibold">Dots Animados</h3>
              </div>

              {/* Progress Bar */}
              <div className="text-center space-y-4">
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full animate-progress-bar"></div>
                </div>
                <h3 className="font-semibold">Progress Bar</h3>
              </div>

              {/* Skeleton */}
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
                <h3 className="font-semibold text-center">Skeleton Loading</h3>
              </div>

              {/* Gradient Shift */}
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-lg animate-gradient-shift"></div>
                <h3 className="font-semibold">Gradient Shift</h3>
              </div>

              {/* Pulse Ring */}
              <div className="text-center space-y-4">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-75"></div>
                  <div className="relative w-16 h-16 bg-red-500 rounded-full"></div>
                </div>
                <h3 className="font-semibold">Pulse Ring</h3>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Micro-interacciones Tab */}
      {activeTab === 'micro' && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom duration-700">
          
          {/* Micro-interacciones Avanzadas */}
          <section className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <span>🔮</span> Micro-interacciones Avanzadas
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Button Ripple Effect */}
              <div className="text-center space-y-4">
                <h3 className="font-semibold">Ripple Effect</h3>
                <button className="group relative px-8 py-4 bg-blue-600 text-white rounded-lg overflow-hidden transition-all duration-300 hover:bg-blue-700 active:scale-95">
                  <span className="relative z-10">Click Me</span>
                  <div className="absolute inset-0 bg-white opacity-0 group-active:opacity-20 rounded-full scale-0 group-active:scale-150 transition-all duration-500 origin-center"></div>
                </button>
              </div>

              {/* Magnetic Button */}
              <div className="text-center space-y-4">
                <h3 className="font-semibold">Magnetic Effect</h3>
                <button className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg transition-all duration-300 hover:scale-110 hover:rotate-3 active:scale-95 hover:shadow-2xl hover:shadow-purple-500/50">
                  Magnetic
                </button>
              </div>

              {/* Morphing Icon */}
              <div className="text-center space-y-4">
                <h3 className="font-semibold">Morphing Icon</h3>
                <button className="group w-16 h-16 bg-green-600 text-white rounded-full transition-all duration-300 hover:bg-green-700 hover:rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 transition-transform duration-300 group-hover:rotate-90">
                    ⚙️
                  </div>
                </button>
              </div>

              {/* Floating Labels */}
              <div className="space-y-4">
                <h3 className="font-semibold text-center">Floating Input</h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder=" "
                    className="peer w-full p-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-transparent focus:border-blue-500 focus:outline-none transition-all duration-300 placeholder-transparent"
                  />
                  <label className="absolute left-4 -top-2.5 bg-white dark:bg-gray-800 px-2 text-sm font-medium text-gray-600 dark:text-gray-400 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500 cursor-text">
                    Email Address
                  </label>
                </div>
              </div>

              {/* Toggle Switch */}
              <div className="text-center space-y-4">
                <h3 className="font-semibold">Toggle Moderno</h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-16 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all dark:border-gray-600 peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
                  <span className="ml-3 text-sm font-medium">Enable Features</span>
                </label>
              </div>

              {/* Heart Like */}
              <div className="text-center space-y-4">
                <h3 className="font-semibold">Heart Animation</h3>
                <button className="group text-4xl transition-all duration-300 hover:scale-125 active:scale-150">
                  <span className="inline-block transition-all duration-300 group-hover:text-red-500 group-active:animate-pulse">
                    🤍
                  </span>
                </button>
              </div>
            </div>
          </section>

          {/* Interactive Cards */}
          <section className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl font-bold mb-8">Interactive Cards</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Tilt Card */}
              <div className="group perspective-1000">
                <div className="relative w-full h-48 transition-all duration-300 transform-style-preserve-3d group-hover:rotate-y-12 group-hover:rotate-x-12">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg group-hover:shadow-2xl transition-shadow duration-300">
                    <div className="p-6 text-white">
                      <h3 className="text-xl font-bold mb-2">Tilt Card</h3>
                      <p className="text-blue-100">Hover para ver el efecto 3D</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Flip Card */}
              <div className="group perspective-1000 h-48">
                <div className="relative w-full h-full transition-all duration-700 transform-style-preserve-3d group-hover:rotate-y-180">
                  {/* Front */}
                  <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-green-500 to-teal-600 rounded-xl p-6 text-white flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl mb-2">🎨</div>
                      <h3 className="text-xl font-bold">Front Side</h3>
                    </div>
                  </div>
                  {/* Back */}
                  <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white flex items-center justify-center rotate-y-180">
                    <div className="text-center">
                      <div className="text-3xl mb-2">✨</div>
                      <h3 className="text-xl font-bold">Back Side</h3>
                      <p className="text-purple-100 text-sm mt-2">Hidden content revealed!</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Glassmorphism Card */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-pink-400 to-purple-600 p-[1px]">
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white hover:bg-white/20 transition-all duration-300">
                  <div className="text-2xl mb-4">🌟</div>
                  <h3 className="text-xl font-bold mb-2">Glassmorphism</h3>
                  <p className="text-purple-100 text-sm">Efecto de cristal moderno</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Animaciones Avanzadas Tab */}
      {activeTab === 'avanzadas' && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom duration-700">
          
          {/* Animaciones 3D y Complejas */}
          <section className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <span>🚀</span> Animaciones Avanzadas y 3D
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Floating Elements */}
              <div className="text-center space-y-4">
                <h3 className="font-semibold">Floating Elements</h3>
                <div className="relative h-32 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-xl overflow-hidden">
                  <div className="absolute top-4 left-4 w-4 h-4 bg-blue-500 rounded-full animate-floating-1"></div>
                  <div className="absolute top-8 right-6 w-3 h-3 bg-purple-500 rounded-full animate-floating-2"></div>
                  <div className="absolute bottom-6 left-8 w-5 h-5 bg-pink-500 rounded-full animate-floating-3"></div>
                  <div className="absolute bottom-4 right-4 w-2 h-2 bg-green-500 rounded-full animate-floating-1"></div>
                </div>
              </div>

              {/* Morphing Shapes */}
              <div className="text-center space-y-4">
                <h3 className="font-semibold">Morphing Shapes</h3>
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-yellow-500 animate-morph-shape"></div>
                </div>
              </div>

              {/* Particle System */}
              <div className="text-center space-y-4">
                <h3 className="font-semibold">Particle Effect</h3>
                <div className="relative h-32 bg-black rounded-xl overflow-hidden">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full animate-particle"
                      style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${2 + Math.random() * 3}s`
                      }}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Matrix Rain */}
              <div className="text-center space-y-4">
                <h3 className="font-semibold">Matrix Rain</h3>
                <div className="relative h-32 bg-black rounded-xl overflow-hidden">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute top-0 text-green-400 text-xs font-mono animate-matrix-rain"
                      style={{
                        left: `${i * 10}%`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    >
                      {Array.from({ length: 8 }).map((_, j) => (
                        <div key={j}>{String.fromCharCode(0x30A0 + Math.random() * 96)}</div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Holographic Effect */}
              <div className="text-center space-y-4">
                <h3 className="font-semibold">Holographic</h3>
                <div className="relative">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-xl animate-holographic"></div>
                </div>
              </div>

              {/* DNA Helix */}
              <div className="text-center space-y-4">
                <h3 className="font-semibold">DNA Helix</h3>
                <div className="relative h-32 flex items-center justify-center">
                  <div className="relative w-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-8 h-1 bg-gradient-to-r from-blue-500 to-red-500 animate-dna-helix"
                        style={{
                          top: `${i * 15}px`,
                          left: '-14px',
                          animationDelay: `${i * 0.1}s`
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Physics-based Animations */}
          <section className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl font-bold mb-8">Physics-based Animations</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Pendulum */}
              <div className="text-center space-y-4">
                <h3 className="font-semibold">Pendulum</h3>
                <div className="relative h-48 flex justify-center">
                  <div className="absolute top-0 w-1 h-32 bg-gray-400 origin-top animate-pendulum"></div>
                  <div className="absolute top-32 w-6 h-6 bg-blue-600 rounded-full animate-pendulum-ball"></div>
                </div>
              </div>

              {/* Spring Physics */}
              <div className="text-center space-y-4">
                <h3 className="font-semibold">Spring Physics</h3>
                <div className="relative h-48 flex items-end justify-center">
                  <div className="w-8 h-8 bg-green-600 rounded-full animate-spring-bounce"></div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Estilos CSS embebidos - EXPANDIDOS Y ARREGLADOS */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes scale-in {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes rotate-in {
          from { transform: rotate(-180deg) scale(0.8); opacity: 0; }
          to { transform: rotate(0deg) scale(1); opacity: 1; }
        }
        
        @keyframes pulse-custom {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes bounce-custom {
          0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
          40%, 43% { transform: translateY(-15px); }
          70% { transform: translateY(-7px); }
          90% { transform: translateY(-3px); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }
        
        @keyframes bounce-dots {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1.2); opacity: 1; }
        }
        
        @keyframes progress-bar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes fill-bar {
          from { width: 0%; }
          to { width: 100%; }
        }
        
        @keyframes on-scroll {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Micro-interacciones */
        @keyframes floating-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        
        @keyframes floating-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-8deg); }
        }
        
        @keyframes floating-3 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(15deg); }
        }

        @keyframes morph-shape {
          0% { border-radius: 50%; transform: rotate(0deg); }
          25% { border-radius: 0%; transform: rotate(90deg); }
          50% { border-radius: 50% 0%; transform: rotate(180deg); }
          75% { border-radius: 0% 50%; transform: rotate(270deg); }
          100% { border-radius: 50%; transform: rotate(360deg); }
        }

        @keyframes particle {
          0% { transform: translateY(100%) scale(0); opacity: 1; }
          50% { opacity: 1; }
          100% { transform: translateY(-100%) scale(1); opacity: 0; }
        }

        @keyframes matrix-rain {
          0% { transform: translateY(-100%); opacity: 1; }
          100% { transform: translateY(400%); opacity: 0; }
        }

        @keyframes holographic {
          0% { 
            background: linear-gradient(45deg, #00f5ff, #ff00f5, #f5ff00, #00ff5f);
            transform: rotateY(0deg);
          }
          25% { transform: rotateY(90deg); }
          50% { 
            background: linear-gradient(45deg, #ff00f5, #f5ff00, #00ff5f, #00f5ff);
            transform: rotateY(180deg);
          }
          75% { transform: rotateY(270deg); }
          100% { 
            background: linear-gradient(45deg, #00f5ff, #ff00f5, #f5ff00, #00ff5f);
            transform: rotateY(360deg);
          }
        }

        @keyframes dna-helix {
          0% { transform: rotateX(0deg) rotateY(0deg); }
          25% { transform: rotateX(90deg) rotateY(90deg); }
          50% { transform: rotateX(180deg) rotateY(180deg); }
          75% { transform: rotateX(270deg) rotateY(270deg); }
          100% { transform: rotateX(360deg) rotateY(360deg); }
        }

        @keyframes pendulum {
          0% { transform: rotate(45deg); }
          50% { transform: rotate(-45deg); }
          100% { transform: rotate(45deg); }
        }

        @keyframes pendulum-ball {
          0% { transform: translateX(22px) translateY(0px); }
          50% { transform: translateX(-22px) translateY(0px); }
          100% { transform: translateX(22px) translateY(0px); }
        }

        @keyframes spring-bounce {
          0% { transform: translateY(0) scaleY(1); }
          15% { transform: translateY(-40px) scaleY(1.1); }
          30% { transform: translateY(0) scaleY(0.9); }
          45% { transform: translateY(-20px) scaleY(1.05); }
          60% { transform: translateY(0) scaleY(0.95); }
          75% { transform: translateY(-10px) scaleY(1.02); }
          90% { transform: translateY(0) scaleY(0.98); }
          100% { transform: translateY(0) scaleY(1); }
        }
        
        /* Classes */
        .animate-fade-in { animation: fade-in 1s ease-out; }
        .animate-slide-up { animation: slide-up 0.8s ease-out; }
        .animate-scale-in { animation: scale-in 0.6s ease-out; }
        .animate-rotate-in { animation: rotate-in 0.8s ease-out; }
        .animate-pulse-custom { animation: pulse-custom 2s infinite; }
        .animate-bounce-custom { animation: bounce-custom 2s infinite; }
        .animate-shake { animation: shake 0.5s infinite; }
        .animate-bounce-dots { animation: bounce-dots 1.4s infinite ease-in-out; }
        .animate-progress-bar { animation: progress-bar 2s ease-in-out infinite; }
        .animate-gradient-shift { 
          background-size: 400% 400%;
          animation: gradient-shift 3s ease infinite;
        }
        .animate-fill-bar { animation: fill-bar 1.5s ease-out forwards; }
        .animate-on-scroll { animation: on-scroll 0.8s ease-out forwards; }
        .animate-gradient {
          background-size: 400% 400%;
          animation: gradient 3s ease infinite;
        }
        
        /* Micro-interacciones */
        .animate-floating-1 { animation: floating-1 3s ease-in-out infinite; }
        .animate-floating-2 { animation: floating-2 4s ease-in-out infinite; }
        .animate-floating-3 { animation: floating-3 5s ease-in-out infinite; }
        .animate-morph-shape { animation: morph-shape 4s ease-in-out infinite; }
        .animate-particle { animation: particle linear infinite; }
        .animate-matrix-rain { animation: matrix-rain 3s linear infinite; }
        .animate-holographic { animation: holographic 3s ease-in-out infinite; }
        .animate-dna-helix { animation: dna-helix 2s ease-in-out infinite; }
        .animate-pendulum { 
          animation: pendulum 2s ease-in-out infinite; 
          transform-origin: top center;
        }
        .animate-pendulum-ball { animation: pendulum-ball 2s ease-in-out infinite; }
        .animate-spring-bounce { animation: spring-bounce 2s ease-in-out infinite; }
        
        /* 3D Effects */
        .perspective-1000 { perspective: 1000px; }
        .transform-style-preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .rotate-y-12 { transform: rotateY(12deg); }
        .rotate-x-12 { transform: rotateX(12deg); }
        
        .animate-in {
          animation-fill-mode: both;
        }
        
        .fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        .slide-in-from-bottom {
          animation: slide-up 0.5s ease-out;
        }
      `}</style>
    </div>
  );
} 