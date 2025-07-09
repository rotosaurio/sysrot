import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Building, CreditCard, Settings, BarChart3, 
  Shield, Globe, Zap, DollarSign, UserPlus, Key,
  Eye, EyeOff, Plus, Edit, Trash, Search, Filter,
  Download, Upload, Calendar, Bell, Mail, Phone
} from 'lucide-react';

interface Tenant {
  id: string;
  name: string;
  domain: string;
  plan: string;
  status: 'active' | 'suspended' | 'pending';
  users: number;
  storage: number;
  lastActive: string;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  tenant: string;
  lastLogin: string;
  status: 'active' | 'inactive';
}

interface BillingInfo {
  plan: string;
  amount: number;
  nextBilling: string;
  usage: {
    users: number;
    storage: number;
    apiCalls: number;
  };
}

const MultiTenantSaaS: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);
  const [showAddTenant, setShowAddTenant] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);

  // Sample data
  const tenants: Tenant[] = [
    {
      id: '1',
      name: 'TechCorp Solutions',
      domain: 'techcorp.sysrot.com',
      plan: 'Enterprise',
      status: 'active',
      users: 45,
      storage: 2.5,
      lastActive: '2025-01-15T10:30:00Z',
      createdAt: '2024-06-15T00:00:00Z'
    },
    {
      id: '2',
      name: 'StartupXYZ',
      domain: 'startupxyz.sysrot.com',
      plan: 'Professional',
      status: 'active',
      users: 12,
      storage: 0.8,
      lastActive: '2025-01-15T09:15:00Z',
      createdAt: '2024-08-20T00:00:00Z'
    },
    {
      id: '3',
      name: 'Global Industries',
      domain: 'global.sysrot.com',
      plan: 'Enterprise',
      status: 'suspended',
      users: 89,
      storage: 5.2,
      lastActive: '2025-01-10T14:20:00Z',
      createdAt: '2024-03-10T00:00:00Z'
    }
  ];

  const users: User[] = [
    {
      id: '1',
      name: 'María García',
      email: 'maria@techcorp.com',
      role: 'admin',
      tenant: 'TechCorp Solutions',
      lastLogin: '2025-01-15T10:30:00Z',
      status: 'active'
    },
    {
      id: '2',
      name: 'Carlos López',
      email: 'carlos@techcorp.com',
      role: 'user',
      tenant: 'TechCorp Solutions',
      lastLogin: '2025-01-15T09:15:00Z',
      status: 'active'
    },
    {
      id: '3',
      name: 'Ana Martínez',
      email: 'ana@startupxyz.com',
      role: 'admin',
      tenant: 'StartupXYZ',
      lastLogin: '2025-01-15T08:45:00Z',
      status: 'active'
    }
  ];

  const billingInfo: BillingInfo = {
    plan: 'Enterprise',
    amount: 299,
    nextBilling: '2025-02-15T00:00:00Z',
    usage: {
      users: 45,
      storage: 2.5,
      apiCalls: 15000
    }
  };

  const tabs = [
    { id: 'overview', label: 'Vista General', icon: BarChart3 },
    { id: 'tenants', label: 'Tenants', icon: Building },
    { id: 'users', label: 'Usuarios', icon: Users },
    { id: 'billing', label: 'Facturación', icon: CreditCard },
    { id: 'settings', label: 'Configuración', icon: Settings }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-400';
      case 'suspended': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-400';
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-purple-600 bg-purple-100 dark:bg-purple-900 dark:text-purple-400';
      case 'moderator': return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-400';
      case 'user': return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Multi-Tenant SaaS Platform
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona múltiples organizaciones en una sola plataforma
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tenants</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{tenants.length}</p>
              </div>
              <Building className="w-8 h-8 text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Usuarios Activos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ingresos Mensuales</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">$12,450</p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Uptime</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">99.9%</p>
              </div>
              <Zap className="w-8 h-8 text-purple-500" />
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Activity */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Actividad Reciente
                    </h3>
                    <div className="space-y-3">
                      {[
                        { action: 'Nuevo tenant registrado', tenant: 'StartupXYZ', time: 'hace 2 horas' },
                        { action: 'Usuario agregado', tenant: 'TechCorp', time: 'hace 4 horas' },
                        { action: 'Plan actualizado', tenant: 'Global Industries', time: 'hace 6 horas' },
                        { action: 'Facturación procesada', tenant: 'TechCorp', time: 'hace 1 día' }
                      ].map((activity, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {activity.action}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {activity.tenant}
                            </p>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {activity.time}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* System Health */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Estado del Sistema
                    </h3>
                    <div className="space-y-4">
                      {[
                        { service: 'API Gateway', status: 'Operativo', color: 'text-green-600' },
                        { service: 'Base de Datos', status: 'Operativo', color: 'text-green-600' },
                        { service: 'Almacenamiento', status: 'Operativo', color: 'text-green-600' },
                        { service: 'Autenticación', status: 'Operativo', color: 'text-green-600' }
                      ].map((service, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {service.service}
                          </span>
                          <span className={`text-sm font-medium ${service.color}`}>
                            {service.status}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tenants' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Gestión de Tenants
                  </h3>
                  <button
                    onClick={() => setShowAddTenant(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Tenant
                  </button>
                </div>

                <div className="bg-white dark:bg-gray-700 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Tenant
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Plan
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Estado
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Usuarios
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Última Actividad
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                        {tenants.map((tenant, index) => (
                          <motion.tr
                            key={tenant.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="hover:bg-gray-50 dark:hover:bg-gray-600"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {tenant.name}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {tenant.domain}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-900 dark:text-white">
                                {tenant.plan}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(tenant.status)}`}>
                                {tenant.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {tenant.users}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {new Date(tenant.lastActive).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                                  <Trash className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Gestión de Usuarios
                  </h3>
                  <button
                    onClick={() => setShowAddUser(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Agregar Usuario
                  </button>
                </div>

                <div className="bg-white dark:bg-gray-700 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Usuario
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Tenant
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Rol
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Estado
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Último Login
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                        {users.map((user, index) => (
                          <motion.tr
                            key={user.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="hover:bg-gray-50 dark:hover:bg-gray-600"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {user.name}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {user.email}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {user.tenant}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {new Date(user.lastLogin).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                                  <Trash className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Current Plan */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Plan Actual
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Plan:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{billingInfo.plan}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Precio:</span>
                        <span className="font-medium text-gray-900 dark:text-white">${billingInfo.amount}/mes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Próxima facturación:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {new Date(billingInfo.nextBilling).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Usage */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Uso Actual
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Usuarios</span>
                          <span className="text-sm text-gray-900 dark:text-white">
                            {billingInfo.usage.users}/100
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(billingInfo.usage.users / 100) * 100}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Almacenamiento</span>
                          <span className="text-sm text-gray-900 dark:text-white">
                            {billingInfo.usage.storage}GB/10GB
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(billingInfo.usage.storage / 10) * 100}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600 dark:text-gray-400">API Calls</span>
                          <span className="text-sm text-gray-900 dark:text-white">
                            {billingInfo.usage.apiCalls.toLocaleString()}/50,000
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${(billingInfo.usage.apiCalls / 50000) * 100}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Security Settings */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Configuración de Seguridad
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Autenticación 2FA</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Requerir autenticación de dos factores</p>
                        </div>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                          Habilitar
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">SSO</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Configurar Single Sign-On</p>
                        </div>
                        <button className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-1 rounded text-sm">
                          Configurar
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Auditoría</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Registrar todas las actividades</p>
                        </div>
                        <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm">
                          Activo
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* API Settings */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Configuración de API
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          API Key
                        </label>
                        <div className="flex">
                          <input
                            type="password"
                            value="sk-1234567890abcdef"
                            readOnly
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                          <button className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-r-md">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Rate Limit
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                          <option>1000 requests/hour</option>
                          <option>5000 requests/hour</option>
                          <option>10000 requests/hour</option>
                        </select>
                      </div>
                      <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md font-medium">
                        Regenerar API Key
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiTenantSaaS;