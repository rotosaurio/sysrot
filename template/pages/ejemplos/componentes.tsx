import * as React from 'react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function ComponentesExample(): React.ReactElement {
  const [activeTab, setActiveTab] = useState('basicos');
  const [showModal, setShowModal] = useState(false);
  const [count, setCount] = useState(0);

  return (
    <div className="container mx-auto py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Biblioteca de Componentes</h1>
        <p className="text-muted-foreground text-lg">
          Colección completa de componentes reutilizables listos para usar y personalizar en tus proyectos.
        </p>
      </div>

      {/* Navegación de tabs */}
      <div className="mb-8 border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'basicos', label: 'Básicos' },
            { id: 'formularios', label: 'Formularios' },
            { id: 'navegacion', label: 'Navegación' },
            { id: 'feedback', label: 'Feedback' },
            { id: 'layout', label: 'Layout' },
            { id: 'datos', label: 'Datos' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Componentes Básicos */}
      {activeTab === 'basicos' && (
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-6">Botones</h2>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4">
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
                  <button 
                    disabled 
                    className="px-4 py-2 bg-gray-400 text-white rounded-lg font-medium cursor-not-allowed"
                  >
                    Disabled
                  </button>
                </div>
                <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                  <code>{`<button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
  Primary
</button>`}</code>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-2">Card Simple</h3>
                <p className="text-muted-foreground mb-4">Descripción de la card simple con contenido básico.</p>
                <button className="text-blue-600 hover:text-blue-700 font-medium">Ver más →</button>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-lg text-white">
                <h3 className="text-lg font-semibold mb-2">Card Gradiente</h3>
                <p className="text-purple-100 mb-4">Card con fondo degradado y estilo moderno.</p>
                <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded font-medium transition-colors">
                  Acción
                </button>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-green-500">
                <h3 className="text-lg font-semibold mb-2">Card Destacada</h3>
                <p className="text-muted-foreground mb-4">Card con borde lateral colorido para destacar.</p>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs rounded">
                    Nuevo
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Badges y Tags</h2>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Estados</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-sm rounded-full">
                      ✅ Activo
                    </span>
                    <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-sm rounded-full">
                      ⏳ Pendiente
                    </span>
                    <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 text-sm rounded-full">
                      ❌ Error
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Categorías</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-500 text-white text-sm rounded">Frontend</span>
                    <span className="px-3 py-1 bg-purple-500 text-white text-sm rounded">Backend</span>
                    <span className="px-3 py-1 bg-green-500 text-white text-sm rounded">DevOps</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Componentes de Formularios */}
      {activeTab === 'formularios' && (
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-6">Inputs</h2>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Input Básico</label>
                  <input
                    type="text"
                    placeholder="Escribe aquí..."
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Input con Icono</label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="tu@email.com"
                      className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Selectores</h2>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Select Simple</label>
                  <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Opción 1</option>
                    <option>Opción 2</option>
                    <option>Opción 3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Checkbox y Radio</label>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <label className="text-sm">Opción con checkbox</label>
                    </div>
                    <div className="flex items-center">
                      <input type="radio" name="radio" className="mr-2" />
                      <label className="text-sm">Radio opción 1</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Componentes de Navegación */}
      {activeTab === 'navegacion' && (
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-6">Breadcrumbs</h2>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <nav className="flex">
                <ol className="flex items-center space-x-2">
                  <li><a href="#" className="text-blue-600 hover:text-blue-700">Inicio</a></li>
                  <li><span className="text-gray-400">/</span></li>
                  <li><a href="#" className="text-blue-600 hover:text-blue-700">Ejemplos</a></li>
                  <li><span className="text-gray-400">/</span></li>
                  <li><span className="text-gray-600">Componentes</span></li>
                </ol>
              </nav>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Pagination</h2>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <nav className="flex items-center justify-center space-x-2">
                <button className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                  Anterior
                </button>
                <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md">1</button>
                <button className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">2</button>
                <button className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">3</button>
                <button className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                  Siguiente
                </button>
              </nav>
            </div>
          </section>
        </div>
      )}

      {/* Componentes de Feedback */}
      {activeTab === 'feedback' && (
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-6">Alertas</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Información</h3>
                    <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">Este es un mensaje informativo.</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800 dark:text-green-200">Éxito</h3>
                    <p className="mt-1 text-sm text-green-700 dark:text-green-300">La operación se completó exitosamente.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Modal</h2>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Abrir Modal
              </button>

              {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
                    <h3 className="text-lg font-semibold mb-4">Modal de Ejemplo</h3>
                    <p className="text-muted-foreground mb-6">
                      Este es un modal funcional que puedes personalizar según tus necesidades.
                    </p>
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => {
                          setShowModal(false);
                          toast.success('¡Acción confirmada!');
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                      >
                        Confirmar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      )}

      {/* Componentes de Layout */}
      {activeTab === 'layout' && (
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-6">Grid System</h2>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded text-center">
                    Col {i}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-green-100 dark:bg-green-900/20 p-4 rounded text-center">
                    Col {i}/3
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Container Responsive</h2>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="container mx-auto">
                <div className="bg-purple-100 dark:bg-purple-900/20 p-4 rounded text-center">
                  Container que se adapta al tamaño de pantalla
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Componentes de Datos */}
      {activeTab === 'datos' && (
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-6">Contadores</h2>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCount(count - 1)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                >
                  -
                </button>
                <span className="text-2xl font-bold w-16 text-center">{count}</span>
                <button
                  onClick={() => setCount(count + 1)}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                >
                  +
                </button>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Progress Bar</h2>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progreso</span>
                    <span>75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Completado</span>
                    <span>100%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Información de uso */}
      <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
        <h3 className="font-semibold mb-4">🛠️ Cómo usar estos componentes:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div>
            <h4 className="font-medium mb-2">1. Copia el código</h4>
            <p>Cada componente incluye el código HTML/JSX que puedes copiar directamente.</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">2. Personaliza los estilos</h4>
            <p>Modifica las clases de Tailwind para adaptar los componentes a tu diseño.</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">3. Añade funcionalidad</h4>
            <p>Integra React hooks y lógica de negocio según tus necesidades.</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">4. Reutiliza</h4>
            <p>Crea componentes reutilizables en la carpeta `components/ui/`.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 