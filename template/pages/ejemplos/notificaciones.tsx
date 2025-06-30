import * as React from 'react';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import { useTranslation } from '@/components/providers/intl-provider';

export default function NotificacionesExample(): React.ReactElement {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  // Notificaciones básicas
  const showSuccess = () => {
    toast.success('¡Operación exitosa!');
  };

  const showError = () => {
    toast.error('¡Ups! Algo salió mal');
  };

  const showInfo = () => {
    toast('Información importante', {
      icon: 'ℹ️',
    });
  };

  const showWarning = () => {
    toast('Advertencia: Revisa esto', {
      icon: '⚠️',
      style: {
        border: '1px solid #f59e0b',
        background: '#fef3c7',
        color: '#92400e',
      },
    });
  };

  // Notificación personalizada
  const showCustom = () => {
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                Notificación Personalizada
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Esta es una notificación completamente personalizada con JSX.
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Cerrar
          </button>
        </div>
      </div>
    ));
  };

  // Notificación de loading
  const showLoading = async () => {
    setLoading(true);
    const toastId = toast.loading('Procesando...');
    
    // Simular operación asíncrona
    setTimeout(() => {
      setLoading(false);
      toast.success('¡Proceso completado!', {
        id: toastId,
      });
    }, 3000);
  };

  // Promise toast
  const showPromise = () => {
    const myPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.5) {
          resolve('¡Datos guardados!');
        } else {
          reject('Error al guardar');
        }
      }, 2000);
    });

    toast.promise(
      myPromise,
      {
        loading: 'Guardando datos...',
        success: (data) => `${data}`,
        error: (err) => `${err}`,
      }
    );
  };

  // Notificación con acción
  const showWithAction = () => {
    toast.success('Archivo eliminado', {
      duration: 6000,
      action: {
        label: 'Deshacer',
        onClick: () => {
          toast.success('Archivo restaurado');
        },
      },
    });
  };

  // Notificación con posición personalizada
  const showPositioned = () => {
    toast.success('Notificación en esquina superior izquierda', {
      position: 'top-left',
    });
  };

  return (
    <div className="container mx-auto py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">{t('pages.notifications.title')}</h1>
        <p className="text-muted-foreground text-lg">
          {t('pages.notifications.description')}
        </p>
      </div>

      {/* Sección 1: Notificaciones básicas */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">1. {t('pages.notifications.basic')}</h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={showSuccess}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
            >
              {t('pages.notifications.success')}
            </button>
            <button
              onClick={showError}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
            >
              {t('pages.notifications.error')}
            </button>
            <button
              onClick={showInfo}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              {t('pages.notifications.info')}
            </button>
            <button
              onClick={showWarning}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors"
            >
              {t('pages.notifications.warning')}
            </button>
          </div>
        </div>
      </section>

      {/* Sección 2: Notificaciones avanzadas */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">2. Notificaciones Avanzadas</h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={showLoading}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg font-medium transition-colors"
            >
              {loading ? 'Procesando...' : 'Loading Toast'}
            </button>
            <button
              onClick={showPromise}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
            >
              Promise Toast
            </button>
            <button
              onClick={showWithAction}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors"
            >
              Con Acción
            </button>
          </div>
        </div>
      </section>

      {/* Sección 3: Personalización */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">3. Personalización</h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={showCustom}
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-lg font-medium transition-colors"
            >
              Notificación Personalizada
            </button>
            <button
              onClick={showPositioned}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              Posición Personalizada
            </button>
          </div>
        </div>
      </section>

      {/* Sección 4: Configuración avanzada */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">4. Configuración Avanzada</h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Duración Personalizada</h3>
              <button
                onClick={() => toast.success('Mensaje de 10 segundos', { duration: 10000 })}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors w-full"
              >
                Toast de 10 segundos
              </button>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Sin Auto-dismiss</h3>
              <button
                onClick={() => toast.error('Este mensaje no se cierra automáticamente', { duration: Infinity })}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors w-full"
              >
                Toast Persistente
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 5: Controles */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">5. Controles de Notificaciones</h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => {
                toast.success('Notificación 1');
                toast.success('Notificación 2');
                toast.success('Notificación 3');
              }}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              Crear Múltiples
            </button>
            <button
              onClick={() => toast.dismiss()}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            >
              Cerrar Todas
            </button>
            <button
              onClick={() => {
                const id = toast.loading('Eliminando...');
                setTimeout(() => {
                  toast.dismiss(id);
                  toast.success('¡Eliminado!');
                }, 2000);
              }}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
            >
              Controlar por ID
            </button>
          </div>
        </div>
      </section>

      {/* Sección 6: Integración con formularios */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">6. Integración con Formularios</h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const email = formData.get('email') as string;
              
              if (!email) {
                toast.error('El email es requerido');
                return;
              }
              
              if (!email.includes('@')) {
                toast.error('Formato de email inválido');
                return;
              }
              
              toast.success(`¡Suscripción exitosa para ${email}!`);
              e.currentTarget.reset();
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email para suscripción
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="tu@email.com"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors"
            >
              Suscribirse
            </button>
          </form>
        </div>
      </section>

      {/* Información adicional */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
        <h3 className="font-semibold mb-4">Características de React Hot Toast:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div>
            <ul className="space-y-2">
              <li>✅ Lightweight (~3kb gzipped)</li>
              <li>✅ Totalmente personalizable</li>
              <li>✅ Promise-based notifications</li>
              <li>✅ Accessible por defecto</li>
            </ul>
          </div>
          <div>
            <ul className="space-y-2">
              <li>✅ Animaciones suaves</li>
              <li>✅ Posicionamiento flexible</li>
              <li>✅ Soporte para dark mode</li>
              <li>✅ TypeScript support</li>
            </ul>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes enter {
          0% {
            transform: translate3d(0, -200%, 0) scale(0.6);
            opacity: 0.5;
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 1;
          }
        }
        @keyframes leave {
          0% {
            transform: translate3d(0, 0, -1px) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate3d(0, -150%, -1px) scale(0.6);
            opacity: 0;
          }
        }
        .animate-enter {
          animation: enter 0.35s ease-out;
        }
        .animate-leave {
          animation: leave 0.4s ease-in forwards;
        }
      `}</style>
    </div>
  );
} 