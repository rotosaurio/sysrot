import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
  maxUsers: number;
  maxProjects: number;
  storage: string;
}

interface Tenant {
  id: string;
  name: string;
  plan: string;
  users: number;
  projects: number;
  storage: number;
  status: 'active' | 'suspended' | 'trial';
  createdAt: string;
}

const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    features: [
      'Up to 5 team members',
      '10 projects',
      '5GB storage',
      'Basic analytics',
      'Email support'
    ],
    maxUsers: 5,
    maxProjects: 10,
    storage: '5GB'
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 99,
    features: [
      'Up to 25 team members',
      'Unlimited projects',
      '50GB storage',
      'Advanced analytics',
      'Priority support',
      'Custom integrations'
    ],
    popular: true,
    maxUsers: 25,
    maxProjects: -1,
    storage: '50GB'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 299,
    features: [
      'Unlimited team members',
      'Unlimited projects',
      '500GB storage',
      'Advanced analytics',
      '24/7 phone support',
      'Custom integrations',
      'SSO & SAML',
      'Advanced security'
    ],
    maxUsers: -1,
    maxProjects: -1,
    storage: '500GB'
  }
];

const sampleTenants: Tenant[] = [
  {
    id: '1',
    name: 'TechCorp Inc',
    plan: 'pro',
    users: 12,
    projects: 8,
    storage: 15.2,
    status: 'active',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'StartupXYZ',
    plan: 'starter',
    users: 3,
    projects: 5,
    storage: 2.1,
    status: 'trial',
    createdAt: '2024-01-20'
  },
  {
    id: '3',
    name: 'Enterprise Solutions',
    plan: 'enterprise',
    users: 45,
    projects: 25,
    storage: 89.7,
    status: 'active',
    createdAt: '2024-01-10'
  }
];

export default function SaaSExample() {
  const [tenants, setTenants] = useState<Tenant[]>(sampleTenants);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showBilling, setShowBilling] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'tenants' | 'billing' | 'settings'>('overview');

  const getPlanById = (planId: string) => plans.find(plan => plan.id === planId);

  const upgradeTenant = (tenantId: string, newPlan: string) => {
    setTenants(prev => prev.map(tenant =>
      tenant.id === tenantId ? { ...tenant, plan: newPlan } : tenant
    ));
    toast.success('Plan upgraded successfully!');
  };

  const suspendTenant = (tenantId: string) => {
    setTenants(prev => prev.map(tenant =>
      tenant.id === tenantId ? { ...tenant, status: 'suspended' as const } : tenant
    ));
    toast.success('Tenant suspended!');
  };

  const activateTenant = (tenantId: string) => {
    setTenants(prev => prev.map(tenant =>
      tenant.id === tenantId ? { ...tenant, status: 'active' as const } : tenant
    ));
    toast.success('Tenant activated!');
  };

  const PlanCard = ({ plan }: { plan: Plan }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 ${
        plan.popular 
          ? 'border-blue-500 dark:border-blue-400' 
          : 'border-gray-200 dark:border-gray-700'
      } p-6`}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}
      
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {plan.name}
        </h3>
        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          ${plan.price}
        </div>
        <div className="text-gray-600 dark:text-gray-400">per month</div>
      </div>

      <ul className="space-y-3 mb-6">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => setSelectedPlan(plan.id)}
        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
          plan.popular
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
        }`}
      >
        Select Plan
      </button>
    </motion.div>
  );

  const TenantCard = ({ tenant }: { tenant: Tenant }) => {
    const plan = getPlanById(tenant.plan);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {tenant.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Plan: {plan?.name}
            </p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            tenant.status === 'active' ? 'bg-green-100 text-green-800' :
            tenant.status === 'suspended' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {tenant.status}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{tenant.users}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{tenant.projects}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Projects</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{tenant.storage}GB</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Storage</div>
          </div>
        </div>

        <div className="flex space-x-2">
          {tenant.status === 'active' ? (
            <button
              onClick={() => suspendTenant(tenant.id)}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
            >
              Suspend
            </button>
          ) : (
            <button
              onClick={() => activateTenant(tenant.id)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
            >
              Activate
            </button>
          )}
          <button
            onClick={() => setShowBilling(true)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
          >
            Manage
          </button>
        </div>
      </motion.div>
    );
  };

  const BillingModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={() => setShowBilling(false)}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Billing & Subscription
            </h2>
            <button
              onClick={() => setShowBilling(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Current Plan: Professional
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 dark:text-gray-300">Monthly subscription</span>
                  <span className="font-semibold text-gray-900 dark:text-white">$99.00</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 dark:text-gray-300">Tax</span>
                  <span className="font-semibold text-gray-900 dark:text-white">$8.91</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                    <span className="font-bold text-gray-900 dark:text-white">$107.91</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Usage This Month
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">Team Members</span>
                  <span className="font-semibold text-gray-900 dark:text-white">12 / 25</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">Projects</span>
                  <span className="font-semibold text-gray-900 dark:text-white">8 / Unlimited</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">Storage</span>
                  <span className="font-semibold text-gray-900 dark:text-white">15.2GB / 50GB</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => toast.success('Payment method updated!')}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Update Payment Method
              </button>
              <button
                onClick={() => toast.success('Invoice downloaded!')}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Download Invoice
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              🏢 SaaS Platform
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {tenants.length} tenants
              </span>
              <button
                onClick={() => setShowBilling(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                💳 Billing
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8">
          {(['overview', 'tenants', 'billing', 'settings'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Pricing Plans
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map(plan => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Tenants Tab */}
        {activeTab === 'tenants' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Tenant Management
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tenants.map(tenant => (
                <TenantCard key={tenant.id} tenant={tenant} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Platform Settings
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    General Settings
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Platform Name
                      </label>
                      <input
                        type="text"
                        defaultValue="My SaaS Platform"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Support Email
                      </label>
                      <input
                        type="email"
                        defaultValue="support@mysaas.com"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Security Settings
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Require 2FA for all users</p>
                      </div>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                        Enable
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">SSO Integration</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Allow single sign-on</p>
                      </div>
                      <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
                        Configure
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => toast.success('Settings saved!')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Save Settings
                  </button>
                  <button
                    onClick={() => toast.success('Backup created!')}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Create Backup
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Billing Modal */}
      {showBilling && <BillingModal />}
    </div>
  );
}