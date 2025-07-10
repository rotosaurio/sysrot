import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeftIcon, CheckIcon, XMarkIcon } from '@/components/ui/icons';

// Mock data for SaaS plans
const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 9,
    description: 'Perfecto para empezar',
    features: [
      '5 proyectos',
      '10GB almacenamiento',
      'Soporte por email',
      'Dashboard básico'
    ],
    limitations: [
      'Sin API access',
      'Sin exportación de datos',
      'Sin integraciones'
    ],
    popular: false
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 29,
    description: 'Para equipos en crecimiento',
    features: [
      '25 proyectos',
      '100GB almacenamiento',
      'Soporte prioritario',
      'Dashboard avanzado',
      'API access',
      'Exportación de datos',
      '5 integraciones'
    ],
    limitations: [
      'Sin white-label',
      'Sin usuarios ilimitados'
    ],
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    description: 'Para organizaciones grandes',
    features: [
      'Proyectos ilimitados',
      '1TB almacenamiento',
      'Soporte 24/7',
      'Dashboard personalizado',
      'API completa',
      'Exportación avanzada',
      'Integraciones ilimitadas',
      'White-label',
      'Usuarios ilimitados',
      'SSO y SAML'
    ],
    limitations: [],
    popular: false
  }
];

// Mock tenants data
const tenants = [
  { id: 1, name: 'Acme Corp', plan: 'professional', users: 15, active: true },
  { id: 2, name: 'TechStart Inc', plan: 'starter', users: 5, active: true },
  { id: 3, name: 'Global Enterprises', plan: 'enterprise', users: 150, active: true },
  { id: 4, name: 'Innovation Labs', plan: 'professional', users: 8, active: false }
];

export default function SaaSPage() {
  const [selectedPlan, setSelectedPlan] = useState('professional');
  const [billingCycle, setBillingCycle] = useState('monthly');

  const getPrice = (basePrice) => {
    return billingCycle === 'annual' ? Math.floor(basePrice * 10) : basePrice;
  };

  const getDiscount = () => {
    return billingCycle === 'annual' ? '2 meses gratis' : '';
  };

  return (
    <>
      <Head>
        <title>Multi-tenant SaaS Demo - Integración Completa</title>
        <meta name="description" content="Ejemplo de SaaS multi-tenant con gestión de suscripciones" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <Link href="/ejemplos" className="text-blue-600 hover:text-blue-800 mr-4">
                  <ArrowLeftIcon className="w-5 h-5" />
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    🏢 Multi-tenant SaaS
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    Demo de SaaS multi-tenant con gestión de suscripciones
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Plans Section */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Planes de Suscripción
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Elige el plan perfecto para tu organización
                  </p>
                  
                  {/* Billing Toggle */}
                  <div className="mt-6 flex justify-center">
                    <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                      <button
                        onClick={() => setBillingCycle('monthly')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          billingCycle === 'monthly'
                            ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        Mensual
                      </button>
                      <button
                        onClick={() => setBillingCycle('annual')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          billingCycle === 'annual'
                            ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        Anual
                        <span className="ml-1 text-xs text-green-600">-20%</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {plans.map(plan => (
                    <div
                      key={plan.id}
                      className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 ${
                        selectedPlan === plan.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      } ${
                        plan.popular ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                            Más Popular
                          </span>
                        </div>
                      )}
                      
                      <div className="text-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {plan.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                          {plan.description}
                        </p>
                        <div className="mt-4">
                          <span className="text-3xl font-bold text-gray-900 dark:text-white">
                            ${getPrice(plan.price)}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            /{billingCycle === 'monthly' ? 'mes' : 'año'}
                          </span>
                          {billingCycle === 'annual' && (
                            <div className="text-xs text-green-600 mt-1">
                              {getDiscount()}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Features */}
                      <ul className="space-y-2 mb-4">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm">
                            <CheckIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                          </li>
                        ))}
                        {plan.limitations.map((limitation, index) => (
                          <li key={index} className="flex items-center text-sm">
                            <XMarkIcon className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                            <span className="text-gray-500 dark:text-gray-400">{limitation}</span>
                          </li>
                        ))}
                      </ul>

                      <button
                        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                          selectedPlan === plan.id
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {selectedPlan === plan.id ? 'Plan Seleccionado' : 'Seleccionar Plan'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tenants Management */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Gestión de Tenants
                </h3>
                
                <div className="space-y-4">
                  {tenants.map(tenant => (
                    <div
                      key={tenant.id}
                      className="border dark:border-gray-600 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {tenant.name}
                        </h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            tenant.active
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                          }`}
                        >
                          {tenant.active ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <p>Plan: <span className="capitalize font-medium">{tenant.plan}</span></p>
                        <p>Usuarios: {tenant.users}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Agregar Tenant
                </button>
              </div>

              {/* Summary Stats */}
              <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Estadísticas
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Tenants:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{tenants.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Activos:</span>
                    <span className="font-medium text-green-600">
                      {tenants.filter(t => t.active).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Usuarios:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {tenants.reduce((sum, t) => sum + t.users, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">MRR Estimado:</span>
                    <span className="font-medium text-green-600">$167</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
              🏢 Características Multi-tenant SaaS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Gestión de Planes</h3>
                <ul className="text-blue-700 dark:text-blue-300 space-y-1 text-sm">
                  <li>• Múltiples planes de suscripción</li>
                  <li>• Facturación mensual/anual</li>
                  <li>• Upgrades y downgrades</li>
                  <li>• Períodos de prueba</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Multi-tenancy</h3>
                <ul className="text-blue-700 dark:text-blue-300 space-y-1 text-sm">
                  <li>• Aislamiento de datos por tenant</li>
                  <li>• Gestión de usuarios por organización</li>
                  <li>• Configuraciones personalizadas</li>
                  <li>• Métricas por tenant</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Administración</h3>
                <ul className="text-blue-700 dark:text-blue-300 space-y-1 text-sm">
                  <li>• Dashboard administrativo</li>
                  <li>• Métricas de negocio</li>
                  <li>• Gestión de facturación</li>
                  <li>• Soporte integrado</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 