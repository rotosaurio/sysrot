import * as React from 'react';
import { useState } from 'react';
import { useTranslation } from '@/components/providers/intl-provider';

// Interfaces para tipado fuerte
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  createdAt: Date;
  preferences: UserPreferences;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
}

// Tipos personalizados
type Status = 'loading' | 'success' | 'error' | 'idle';
type APIResponse<T> = {
  data: T;
  message: string;
  status: number;
};

// Generic types
interface DataTable<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

// Union types y discriminated unions
type NotificationType = 
  | { type: 'info'; message: string; }
  | { type: 'success'; message: string; duration?: number; }
  | { type: 'error'; message: string; retry?: () => void; };

// Utility types
type PartialUser = Partial<User>;
type UserEmail = Pick<User, 'email'>;
type UserWithoutId = Omit<User, 'id'>;

export default function TypeScriptExample(): React.ReactElement {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Función con tipos explícitos
  const createUser = (userData: UserWithoutId): User => {
    return {
      id: Math.random(),
      ...userData
    };
  };

  // Función genérica
  const fetchData = async <T>(url: string): Promise<APIResponse<T>> => {
    try {
      setStatus('loading');
      const response = await fetch(url);
      const data = await response.json();
      setStatus('success');
      return {
        data,
        message: 'Success',
        status: response.status
      };
    } catch (error) {
      setStatus('error');
      throw error;
    }
  };

  // Función con discriminated unions
  const showNotification = (notification: NotificationType): void => {
    switch (notification.type) {
      case 'info':
        console.log(`Info: ${notification.message}`);
        break;
      case 'success':
        console.log(`Success: ${notification.message}`);
        setTimeout(() => {}, notification.duration || 3000);
        break;
      case 'error':
        console.log(`Error: ${notification.message}`);
        if (notification.retry) {
          notification.retry();
        }
        break;
    }
  };

  // Array de datos mock con tipado
  const mockUsers: User[] = [
    {
      id: 1,
      name: 'Juan Pérez',
      email: 'juan@example.com',
      role: 'admin',
      createdAt: new Date('2023-01-15'),
      preferences: {
        theme: 'dark',
        notifications: true,
        language: 'es'
      }
    },
    {
      id: 2,
      name: 'María García',
      email: 'maria@example.com',
      role: 'user',
      createdAt: new Date('2023-02-20'),
      preferences: {
        theme: 'light',
        notifications: false,
        language: 'es'
      }
    },
    {
      id: 3,
      name: 'Carlos López',
      email: 'carlos@example.com',
      role: 'moderator',
      createdAt: new Date('2023-03-10'),
      preferences: {
        theme: 'auto',
        notifications: true,
        language: 'en'
      }
    }
  ];

  // Función para demostrar type guards
  const isAdmin = (user: User): boolean => {
    return user.role === 'admin';
  };

  // Función con computed properties
  const getUserDisplayInfo = (user: User): { displayName: string; roleLabel: string; } => {
    const roleLabels = {
      admin: 'Administrador',
      user: 'Usuario',
      moderator: 'Moderador'
    } as const;

    return {
      displayName: `${user.name} (${user.email})`,
      roleLabel: roleLabels[user.role]
    };
  };

  React.useEffect(() => {
    setUsers(mockUsers);
  }, []);

  return (
    <div className="container mx-auto py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">{t('pages.typescript.title')}</h1>
        <p className="text-muted-foreground text-lg">
          {t('pages.typescript.description')}
        </p>
      </div>

      {/* Sección 1: Tipos Básicos y Interfaces */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">1. {t('pages.typescript.interfaces')}</h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Definición de Interfaces</h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <pre>{`interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  createdAt: Date;
  preferences: UserPreferences;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
}

// Utility Types
type PartialUser = Partial<User>;
type UserEmail = Pick<User, 'email'>;
type UserWithoutId = Omit<User, 'id'>;`}</pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Tipos Personalizados</h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <pre>{`type Status = 'loading' | 'success' | 'error' | 'idle';

type NotificationType = 
  | { type: 'info'; message: string; }
  | { type: 'success'; message: string; duration?: number; }
  | { type: 'error'; message: string; retry?: () => void; };

// Generic types
interface APIResponse<T> {
  data: T;
  message: string;
  status: number;
}

interface DataTable<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}`}</pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 2: Datos con Tipado */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">2. Estado con Tipos ({status})</h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="space-y-4">
            {users.map((user) => {
              const { displayName, roleLabel } = getUserDisplayInfo(user);
              return (
                <div
                  key={user.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedUser?.id === user.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{displayName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {roleLabel} {isAdmin(user) && '👑'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        Tema: {user.preferences.theme}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Creado: {user.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sección 3: Usuario Seleccionado */}
      {selectedUser && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">3. Detalles del Usuario (Type Safety)</h2>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Información Personal</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">ID:</span> {selectedUser.id}</p>
                  <p><span className="font-medium">Nombre:</span> {selectedUser.name}</p>
                  <p><span className="font-medium">Email:</span> {selectedUser.email}</p>
                  <p><span className="font-medium">Rol:</span> {selectedUser.role}</p>
                  <p><span className="font-medium">Creado:</span> {selectedUser.createdAt.toLocaleString()}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Preferencias</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Tema:</span> {selectedUser.preferences.theme}</p>
                  <p><span className="font-medium">Notificaciones:</span> {selectedUser.preferences.notifications ? 'Sí' : 'No'}</p>
                  <p><span className="font-medium">Idioma:</span> {selectedUser.preferences.language}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold mb-2">Validaciones TypeScript:</h4>
              <ul className="text-sm space-y-1">
                <li>✅ Autocomplete en propiedades del usuario</li>
                <li>✅ Verificación de tipos en tiempo de compilación</li>
                <li>✅ IntelliSense completo en el IDE</li>
                <li>✅ Detección de errores antes de runtime</li>
                <li>✅ Refactoring seguro</li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Sección 4: Funciones con Tipos */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">4. Funciones con Tipado Fuerte</h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Función Genérica</h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <pre>{`const fetchData = async <T>(url: string): Promise<APIResponse<T>> => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return {
      data,
      message: 'Success',
      status: response.status
    };
  } catch (error) {
    throw error;
  }
};

// Uso con tipos específicos
const users = await fetchData<User[]>('/api/users');
const user = await fetchData<User>('/api/user/1');`}</pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Discriminated Unions</h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <pre>{`const showNotification = (notification: NotificationType): void => {
  switch (notification.type) {
    case 'info':
      console.log(\`Info: \${notification.message}\`);
      break;
    case 'success':
      console.log(\`Success: \${notification.message}\`, notification.duration);
      break;
    case 'error':
      console.log(\`Error: \${notification.message}\`);
      notification.retry?.(); // Optional chaining
      break;
  }
};`}</pre>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => showNotification({ type: 'info', message: 'Información general' })}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Probar Info
              </button>
              <button
                onClick={() => showNotification({ type: 'success', message: 'Operación exitosa', duration: 3000 })}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                Probar Success
              </button>
              <button
                onClick={() => showNotification({ 
                  type: 'error', 
                  message: 'Error encontrado',
                  retry: () => console.log('Reintentando...')
                })}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Probar Error
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Información adicional */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
        <h3 className="font-semibold mb-4">Beneficios de TypeScript en el Proyecto:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div>
            <ul className="space-y-2">
              <li>✅ Detección temprana de errores</li>
              <li>✅ Autocomplete inteligente</li>
              <li>✅ Refactoring seguro</li>
              <li>✅ Mejor documentación del código</li>
            </ul>
          </div>
          <div>
            <ul className="space-y-2">
              <li>✅ IntelliSense completo</li>
              <li>✅ Tipos automáticos para APIs</li>
              <li>✅ Validación en tiempo de compilación</li>
              <li>✅ Mejor experiencia de desarrollo</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 