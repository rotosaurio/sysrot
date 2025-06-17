import * as React from 'react';
import { useState } from 'react';
import { useTheme } from 'next-themes';

export default function UITemasExample(): React.ReactElement {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

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
    <div className="container mx-auto py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Sistema de Temas y UI</h1>
        <p className="text-muted-foreground text-lg">
          Demostración del sistema de temas claro/oscuro y componentes UI reutilizables con <strong>TailwindCSS</strong>.
        </p>
      </div>

      {/* Sección 1: Control de Tema */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">1. Control de Tema</h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Tema Actual: {theme}</h3>
              <p className="text-muted-foreground">Tema resuelto: {resolvedTheme}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setTheme('light')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  theme === 'light'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                🌞 Claro
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  theme === 'dark'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                🌙 Oscuro
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  theme === 'system'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                💻 Sistema
              </button>
            </div>
          </div>
          
          {/* Código del toggle */}
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <pre>{`// components/theme-toggle.tsx
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <button 
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-lg transition-colors"
    >
      {theme === 'dark' ? '🌞' : '🌙'}
    </button>
  );
}`}</pre>
          </div>
        </div>
      </section>

      {/* Sección 2: Paleta de Colores */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">2. Paleta de Colores</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Primarios */}
          <div className="space-y-3">
            <h3 className="font-semibold">Primarios</h3>
            <div className="space-y-2">
              <div className="bg-blue-500 h-12 rounded flex items-center justify-center text-white font-medium">
                Blue 500
              </div>
              <div className="bg-purple-500 h-12 rounded flex items-center justify-center text-white font-medium">
                Purple 500
              </div>
              <div className="bg-indigo-500 h-12 rounded flex items-center justify-center text-white font-medium">
                Indigo 500
              </div>
            </div>
          </div>

          {/* Secundarios */}
          <div className="space-y-3">
            <h3 className="font-semibold">Secundarios</h3>
            <div className="space-y-2">
              <div className="bg-green-500 h-12 rounded flex items-center justify-center text-white font-medium">
                Green 500
              </div>
              <div className="bg-yellow-500 h-12 rounded flex items-center justify-center text-white font-medium">
                Yellow 500
              </div>
              <div className="bg-orange-500 h-12 rounded flex items-center justify-center text-white font-medium">
                Orange 500
              </div>
            </div>
          </div>

          {/* Estados */}
          <div className="space-y-3">
            <h3 className="font-semibold">Estados</h3>
            <div className="space-y-2">
              <div className="bg-red-500 h-12 rounded flex items-center justify-center text-white font-medium">
                Error
              </div>
              <div className="bg-green-500 h-12 rounded flex items-center justify-center text-white font-medium">
                Success
              </div>
              <div className="bg-yellow-500 h-12 rounded flex items-center justify-center text-white font-medium">
                Warning
              </div>
            </div>
          </div>

          {/* Grises */}
          <div className="space-y-3">
            <h3 className="font-semibold">Grises</h3>
            <div className="space-y-2">
              <div className="bg-gray-200 dark:bg-gray-700 h-12 rounded flex items-center justify-center font-medium">
                Background
              </div>
              <div className="bg-gray-300 dark:bg-gray-600 h-12 rounded flex items-center justify-center font-medium">
                Border
              </div>
              <div className="bg-gray-800 dark:bg-gray-200 h-12 rounded flex items-center justify-center text-white dark:text-gray-800 font-medium">
                Text
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 3: Componentes UI */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">3. Componentes UI</h2>
        
        {/* Botones */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Botones</h3>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                Primary
              </button>
              <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors">
                Secondary
              </button>
              <button className="px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg font-medium transition-colors">
                Outline
              </button>
              <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg font-medium transition-colors">
                Ghost
              </button>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Cards</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-semibold mb-2">Card Básica</h4>
              <p className="text-muted-foreground mb-4">
                Una card simple con bordes y sombra sutil.
              </p>
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                Leer más →
              </button>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-lg text-white">
              <h4 className="text-lg font-semibold mb-2">Card Gradiente</h4>
              <p className="text-blue-100 mb-4">
                Card con fondo degradado colorido.
              </p>
              <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded font-medium transition-colors">
                Acción
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
              <h4 className="text-lg font-semibold mb-2">Card Destacada</h4>
              <p className="text-muted-foreground mb-4">
                Card con borde lateral de color.
              </p>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded">
                  Tag 1
                </span>
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs rounded">
                  Tag 2
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Inputs</h3>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Input Básico</label>
                <input
                  type="text"
                  placeholder="Escribe aquí..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Select</label>
                <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                  <option>Opción 1</option>
                  <option>Opción 2</option>
                  <option>Opción 3</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Textarea</label>
                <textarea
                  rows={3}
                  placeholder="Mensaje más largo..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Checkbox y Radio</label>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input type="checkbox" id="check1" className="mr-2" />
                    <label htmlFor="check1" className="text-sm">Opción con checkbox</label>
                  </div>
                  <div className="flex items-center">
                    <input type="radio" id="radio1" name="radio" className="mr-2" />
                    <label htmlFor="radio1" className="text-sm">Opción radio 1</label>
                  </div>
                  <div className="flex items-center">
                    <input type="radio" id="radio2" name="radio" className="mr-2" />
                    <label htmlFor="radio2" className="text-sm">Opción radio 2</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Badges y Tags */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Badges y Tags</h3>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Estados</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-sm rounded-full">
                    ✅ Activo
                  </span>
                  <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-sm rounded-full">
                    ⏳ Pendiente
                  </span>
                  <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 text-sm rounded-full">
                    ❌ Inactivo
                  </span>
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm rounded-full">
                    ⚪ Neutral
                  </span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Categorías</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-500 text-white text-sm rounded">
                    Frontend
                  </span>
                  <span className="px-3 py-1 bg-purple-500 text-white text-sm rounded">
                    Backend
                  </span>
                  <span className="px-3 py-1 bg-indigo-500 text-white text-sm rounded">
                    DevOps
                  </span>
                  <span className="px-3 py-1 bg-pink-500 text-white text-sm rounded">
                    Design
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 4: Layout Responsivo */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">4. Layout Responsivo</h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded text-center">
              <div className="text-red-600 font-semibold">Mobile</div>
              <div className="text-sm text-muted-foreground">< 768px</div>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900/20 p-4 rounded text-center">
              <div className="text-yellow-600 font-semibold">Tablet</div>
              <div className="text-sm text-muted-foreground">768px - 1024px</div>
            </div>
            <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded text-center">
              <div className="text-green-600 font-semibold">Desktop</div>
              <div className="text-sm text-muted-foreground">1024px - 1280px</div>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded text-center">
              <div className="text-blue-600 font-semibold">Large</div>
              <div className="text-sm text-muted-foreground">> 1280px</div>
            </div>
          </div>
          
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <pre>{`// Clases responsivas de Tailwind
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <div className="p-4">Mobile: 1 columna</div>
  <div className="p-4">Tablet: 2 columnas</div>
  <div className="p-4">Desktop: 4 columnas</div>
  <div className="p-4">Responsive automático</div>
</div>

// Breakpoints personalizados en tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    }
  }
}`}</pre>
          </div>
        </div>
      </section>

      {/* Información adicional */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
        <h3 className="font-semibold mb-4">Características del Sistema de Temas:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div>
            <ul className="space-y-2">
              <li>✅ Cambio automático según preferencia del sistema</li>
              <li>✅ Persistencia en localStorage</li>
              <li>✅ Sin flash de contenido sin estilo (FOUC)</li>
              <li>✅ Soporte para múltiples temas</li>
            </ul>
          </div>
          <div>
            <ul className="space-y-2">
              <li>✅ Clases CSS automáticas (dark:)</li>
              <li>✅ Componentes totalmente responsivos</li>
              <li>✅ Paleta de colores consistente</li>
              <li>✅ Accesibilidad completa</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 