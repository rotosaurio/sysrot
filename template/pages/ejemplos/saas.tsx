import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  CheckIcon,
  XMarkIcon,
  ChartBarIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ArrowLeftIcon,
  TrendingUpIcon,
  StarIcon
} from '@/components/ui/icons';

// Mock data for tenants and subscriptions
const mockTenants = [
  {
    id: 1,
    name: 'Acme Corp',
    plan: 'Pro',
    users: 45,
    storage: '80%',
    revenue: 2400,
    status: 'active'
  },
  {
    id: 2,
    name: 'Tech Solutions',
    plan: 'Enterprise',
    users: 120,
    storage: '65%',
    revenue: 9800,
    status: 'active'
  },
  {
    id: 3,
    name: 'StartupXYZ',
    plan: 'Basic',
    users: 8,
    storage: '30%',
    revenue: 290,
    status: 'trial'
  }
];

const subscriptionPlans = [
  {
    name: 'Basic',
    price: 29,
    features: ['5 Users', '10GB Storage', 'Email Support'],
    color: 'blue'
  },
  {
    name: 'Pro',
    price: 99,
    features: ['50 Users', '100GB Storage', 'Priority Support', 'Analytics'],
    color: 'purple'
  },
  {
    name: 'Enterprise',
    price: 299,
    features: ['Unlimited Users', '1TB Storage', '24/7 Support', 'Custom Integrations'],
    color: 'emerald'
  }
];

function TenantCard({ tenant }: { tenant: any }) {
  const statusColor = tenant.status === 'active' ? 'green' : 'yellow';
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
            {/* BuildingOfficeIcon */}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {tenant.name}
            </h3>
            <span className={`text-sm px-2 py-1 rounded-full ${
              statusColor === 'green' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            }`}>
              {tenant.status === 'active' ? 'Activo' : 'Prueba'}
            </span>
          </div>
        </div>
        <span className="text-lg font-bold text-gray-900 dark:text-white">
          {tenant.plan}
        </span>
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-blue-600">{tenant.users}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Usuarios</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-purple-600">{tenant.storage}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Almacenamiento</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-600">${tenant.revenue}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Facturación</div>
        </div>
      </div>
      
      <div className="mt-4 flex space-x-2">
        <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm">
          Administrar
        </button>
        <button className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
          Configurar
        </button>
      </div>
    </div>
  );
}

function PlanCard({ plan }: { plan: any }) {
  const colorClasses = {
    blue: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
    purple: 'border-purple-500 bg-purple-50 dark:bg-purple-900/20',
    emerald: 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
  };

  return (
    <div className={`rounded-lg border-2 p-6 ${colorClasses[plan.color as keyof typeof colorClasses]}`}>
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {plan.name}
        </h3>
        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          ${plan.price}
          <span className="text-sm font-normal text-gray-600 dark:text-gray-300">/mes</span>
        </div>
        <ul className="space-y-2 mb-6">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center justify-center text-gray-700 dark:text-gray-300">
              <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
              {feature}
            </li>
          ))}
        </ul>
        <button className={`w-full py-2 px-4 rounded-lg transition-colors ${
          plan.color === 'purple' 
            ? 'bg-purple-600 hover:bg-purple-700 text-white'
            : plan.color === 'emerald'
            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}>
          Seleccionar Plan
        </button>
      </div>
    </div>
  );
}

export default function SaaSDemo() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'success', message: 'Nuevo tenant registrado: Tech Solutions' },
    { id: 2, type: 'warning', message: 'StartupXYZ está próximo a vencer su trial' },
    { id: 3, type: 'info', message: 'Facturación del mes: $12,490' }
  ]);
  const [showCode, setShowCode] = useState<string | null>(null);
  const [toastNotifications, setToastNotifications] = useState<string[]>([]);

  const addNotification = (message: string) => {
    setToastNotifications((prev: string[]) => [...prev, message]);
    setTimeout(() => {
      setToastNotifications((prev: string[]) => prev.slice(1));
    }, 3000);
  };

  const CodeBlock = ({ title, code }: { title: string; code: string }) => (
    <div className="bg-gray-900 rounded-xl p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-green-400 font-mono text-sm">{title}</h4>
        <button
          onClick={() => {
            navigator.clipboard.writeText(code);
            addNotification('Código copiado al portapapeles! 🏢');
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

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: ChartBarIcon },
    { id: 'tenants', name: 'Tenants', icon: UsersIcon },
    { id: 'users', name: 'Usuarios', icon: UsersIcon },
    { id: 'billing', name: 'Facturación', icon: CurrencyDollarIcon },
    { id: 'settings', name: 'Configuración', icon: TrendingUpIcon }
  ];

  const metrics = [
    { label: 'Total Tenants', value: '3', change: '+2 este mes', color: 'blue' },
    { label: 'Usuarios Activos', value: '173', change: '+12%', color: 'green' },
    { label: 'Ingresos MRR', value: '$12,490', change: '+8.5%', color: 'purple' },
    { label: 'Churn Rate', value: '2.1%', change: '-0.5%', color: 'red' }
  ];

  return (
    <>
      <Head>
        <title>Multi-tenant SaaS Pro - Full Integration Examples</title>
        <meta name="description" content="Plataforma SaaS profesional multi-tenant con gestión avanzada de suscripciones y analytics" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/30">
        {/* Notificaciones Toast */}
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {toastNotifications.map((notification, index) => (
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

        {/* Header */}
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <Link href="/ejemplos" className="text-blue-600 hover:text-blue-800 mr-4 transition-colors">
                  <ArrowLeftIcon className="w-5 h-5" />
                </Link>
                <div>
                  <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium mb-2">
                    <span>🏢</span>
                    SaaS Multi-tenant Pro
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Panel Empresarial
                  </h1>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-gray-600 dark:text-gray-300 text-sm">
                      {mockTenants.length} tenants activos
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                      $12,490 MRR
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowCode(showCode === 'saas' ? null : 'saas')}
                  className="hidden md:flex items-center space-x-2 px-4 py-2 border-2 border-purple-300 dark:border-purple-600 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 text-sm font-medium"
                >
                  <span>📝</span>
                  <span>{showCode === 'saas' ? 'Ocultar' : 'Ver'} Código</span>
                </button>

                <div className="relative">
                  <button 
                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors"
                    onClick={() => addNotification('📬 Tienes 3 notificaciones nuevas')}
                  >
                    <span className="text-xl">🔔</span>
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                      {notifications.length}
                    </span>
                  </button>
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {showCode === 'saas' && (
            <div className="mb-8">
              <CodeBlock
                title="Multi-tenant SaaS con Dashboard y Suscripciones"
                code={`// SaaS Multi-tenant Implementation
import { useState } from 'react';

interface Tenant {
  id: number;
  name: string;
  plan: string;
  users: number;
  storage: string;
  revenue: number;
  status: 'active' | 'trial';
}

interface Subscription {
  name: string;
  price: number;
  features: string[];
  color: 'blue' | 'purple' | 'emerald';
}

function SaaSPlatform() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tenants, setTenants] = useState<Tenant[]>([]);

  const metrics = [
    { label: 'Total Tenants', value: '3', change: '+2 este mes', color: 'blue' },
    { label: 'Usuarios Activos', value: '173', change: '+12%', color: 'green' },
    { label: 'Ingresos MRR', value: '$12,490', change: '+8.5%', color: 'purple' },
    { label: 'Churn Rate', value: '2.1%', change: '-0.5%', color: 'red' }
  ];

  return (
    <div className="saas-platform">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                                 Panel Empresarial
              </h1>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-gray-600 text-sm">
                  {tenants.length} tenants activos
                </span>
                <span className="text-green-600 text-sm font-medium">
                  $12,490 MRR
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {['dashboard', 'tenants', 'billing'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={\`py-4 border-b-2 transition-colors \${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }\`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {metrics.map((metric, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{metric.label}</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {metric.value}
                      </p>
                      <p className="text-sm text-green-600">
                        {metric.change}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <ChartBarIcon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tenant Management */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tenants.map((tenant) => (
                <TenantCard key={tenant.id} tenant={tenant} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Tenant Card Component
function TenantCard({ tenant }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            🏢
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {tenant.name}
            </h3>
            <span className="text-sm px-2 py-1 rounded-full bg-green-100 text-green-800">
              {tenant.status}
            </span>
          </div>
        </div>
        <span className="text-lg font-bold text-gray-900">
          {tenant.plan}
        </span>
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-blue-600">{tenant.users}</div>
          <div className="text-sm text-gray-600">Usuarios</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-purple-600">{tenant.storage}</div>
          <div className="text-sm text-gray-600">Almacenamiento</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-600">\${tenant.revenue}</div>
          <div className="text-sm text-gray-600">Facturación</div>
        </div>
      </div>
    </div>
  );
}`}
              />
            </div>
          )}

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric, index) => (
                  <div key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{metric.label}</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {metric.value}
                        </p>
                        <p className={`text-sm font-medium ${
                          metric.color === 'green' ? 'text-green-600 dark:text-green-400' :
                          metric.color === 'red' ? 'text-red-600 dark:text-red-400' :
                          metric.color === 'purple' ? 'text-purple-600 dark:text-purple-400' : 'text-blue-600 dark:text-blue-400'
                        }`}>
                          {metric.change}
                        </p>
                      </div>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r ${
                        metric.color === 'green' ? 'from-green-500 to-emerald-500' :
                        metric.color === 'red' ? 'from-red-500 to-pink-500' :
                        metric.color === 'purple' ? 'from-purple-500 to-indigo-500' : 'from-blue-500 to-cyan-500'
                      }`}>
                        <ChartBarIcon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Notifications */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Notificaciones Recientes
                </h3>
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                      {notification.type === 'success' && <CheckIcon className="w-5 h-5 text-green-500" />}
                      {notification.type === 'warning' && <XMarkIcon className="w-5 h-5 text-yellow-500" />}
                      {notification.type === 'info' && <ChartBarIcon className="w-5 h-5 text-blue-500" />}
                      <span className="text-gray-900 dark:text-white">{notification.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tenants Tab */}
          {activeTab === 'tenants' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Gestión de Tenants
                </h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Agregar Tenant
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockTenants.map((tenant) => (
                  <TenantCard key={tenant.id} tenant={tenant} />
                ))}
              </div>
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === 'billing' && (
            <div className="space-y-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Planes de Suscripción
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {subscriptionPlans.map((plan, index) => (
                  <PlanCard key={index} plan={plan} />
                ))}
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Resumen de Facturación
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">$12,490</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Ingresos este mes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">$148,200</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Ingresos anuales</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">95.2%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Tasa de retención</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs content placeholder */}
          {['users', 'settings'].includes(activeTab) && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {activeTab === 'users' ? 'Gestión de Usuarios' : 'Configuración'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Contenido de {activeTab} en desarrollo...
              </p>
            </div>
          )}
        </div>

        {/* Documentation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
              📚 Características del SaaS Multi-tenant
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Multi-tenancy
                </h3>
                <ul className="text-blue-700 dark:text-blue-300 space-y-1 text-sm">
                  <li>• Aislamiento de datos por tenant</li>
                  <li>• Gestión de organizaciones</li>
                  <li>• Configuración personalizada</li>
                  <li>• Facturación separada</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Suscripciones
                </h3>
                <ul className="text-blue-700 dark:text-blue-300 space-y-1 text-sm">
                  <li>• Múltiples planes de precio</li>
                  <li>• Facturación recurrente</li>
                  <li>• Períodos de prueba</li>
                  <li>• Upgrades/downgrades</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Dashboard Admin
                </h3>
                <ul className="text-blue-700 dark:text-blue-300 space-y-1 text-sm">
                  <li>• Métricas en tiempo real</li>
                  <li>• Gestión de usuarios</li>
                  <li>• Sistema de notificaciones</li>
                  <li>• Reportes de facturación</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}