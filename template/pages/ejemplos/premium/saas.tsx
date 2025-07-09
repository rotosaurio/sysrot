import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  CreditCard, 
  Users, 
  Settings, 
  Crown, 
  TrendingUp,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  Trash2
} from '@/components/ui/icons';
import { useTranslation } from '@/components/providers/intl-provider';
import toast from 'react-hot-toast';

interface Tenant {
  id: string;
  name: string;
  domain: string;
  plan: 'starter' | 'pro' | 'enterprise';
  status: 'active' | 'suspended' | 'trial';
  users: number;
  createdAt: string;
  subscription: {
    renewsAt: string;
    amount: number;
    currency: string;
  };
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  maxUsers: number;
  maxTenants: number;
  support: string;
}

export default function SaaSExample() {
  const { data: session, status } = useSession();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateTenant, setShowCreateTenant] = useState(false);
  const [newTenant, setNewTenant] = useState({ name: '', domain: '', plan: 'starter' });

  // Mock data initialization
  useEffect(() => {
    const mockTenants: Tenant[] = [
      {
        id: '1',
        name: 'Acme Corp',
        domain: 'acme.saas.com',
        plan: 'pro',
        status: 'active',
        users: 25,
        createdAt: '2024-01-15',
        subscription: {
          renewsAt: '2024-12-15',
          amount: 99,
          currency: 'USD'
        }
      },
      {
        id: '2',
        name: 'Tech Startup',
        domain: 'techstartup.saas.com',
        plan: 'starter',
        status: 'trial',
        users: 5,
        createdAt: '2024-03-01',
        subscription: {
          renewsAt: '2024-04-01',
          amount: 29,
          currency: 'USD'
        }
      },
      {
        id: '3',
        name: 'Enterprise Co',
        domain: 'enterprise.saas.com',
        plan: 'enterprise',
        status: 'active',
        users: 150,
        createdAt: '2023-06-10',
        subscription: {
          renewsAt: '2024-06-10',
          amount: 299,
          currency: 'USD'
        }
      }
    ];

    const mockPlans: SubscriptionPlan[] = [
      {
        id: 'starter',
        name: 'Starter',
        price: 29,
        currency: 'USD',
        interval: 'month',
        features: [
          'Up to 10 users',
          '1 tenant',
          'Basic support',
          '10GB storage',
          'Standard integrations'
        ],
        maxUsers: 10,
        maxTenants: 1,
        support: 'Email'
      },
      {
        id: 'pro',
        name: 'Professional',
        price: 99,
        currency: 'USD',
        interval: 'month',
        features: [
          'Up to 50 users',
          '5 tenants',
          'Priority support',
          '100GB storage',
          'Advanced integrations',
          'Custom branding',
          'API access'
        ],
        maxUsers: 50,
        maxTenants: 5,
        support: 'Email + Chat'
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 299,
        currency: 'USD',
        interval: 'month',
        features: [
          'Unlimited users',
          'Unlimited tenants',
          'Dedicated support',
          '1TB storage',
          'Custom integrations',
          'White-label solution',
          'Advanced API',
          'SLA guarantee',
          'Custom domains'
        ],
        maxUsers: -1,
        maxTenants: -1,
        support: '24/7 Phone + Chat'
      }
    ];

    setTenants(mockTenants);
    setPlans(mockPlans);
  }, []);

  const createTenant = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const tenant: Tenant = {
        id: Date.now().toString(),
        name: newTenant.name,
        domain: `${newTenant.domain}.saas.com`,
        plan: newTenant.plan as any,
        status: 'trial',
        users: 1,
        createdAt: new Date().toISOString().split('T')[0],
        subscription: {
          renewsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          amount: plans.find(p => p.id === newTenant.plan)?.price || 0,
          currency: 'USD'
        }
      };
      
      setTenants([...tenants, tenant]);
      setNewTenant({ name: '', domain: '', plan: 'starter' });
      setShowCreateTenant(false);
      setLoading(false);
      toast.success('Tenant created successfully!');
    }, 1000);
  };

  const updateTenantStatus = (tenantId: string, status: Tenant['status']) => {
    setTenants(tenants.map(t => t.id === tenantId ? { ...t, status } : t));
    toast.success(`Tenant status updated to ${status}`);
  };

  const upgradePlan = (tenantId: string, newPlan: string) => {
    const plan = plans.find(p => p.id === newPlan);
    if (plan) {
      setTenants(tenants.map(t => 
        t.id === tenantId 
          ? { 
              ...t, 
              plan: newPlan as any,
              subscription: { ...t.subscription, amount: plan.price }
            } 
          : t
      ));
      toast.success(`Plan upgraded to ${plan.name}`);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900 dark:to-indigo-900">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Crown className="h-16 w-16 mx-auto mb-4 text-blue-600" />
          <h1 className="text-3xl font-bold mb-4">Multi-tenant SaaS Platform</h1>
          <p className="text-muted-foreground mb-8">Sign in to access your SaaS dashboard</p>
          <button
            onClick={() => signIn()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In to Continue
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Crown className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  SaaS Platform
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Multi-tenant Management Dashboard
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Welcome, {session.user?.name}
              </span>
              <img
                src={session.user?.image || '/placeholder-avatar.jpg'}
                alt="Profile"
                className="h-10 w-10 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: TrendingUp },
              { id: 'tenants', name: 'Tenants', icon: Building2 },
              { id: 'billing', name: 'Billing', icon: CreditCard },
              { id: 'users', name: 'Users', icon: Users },
              { id: 'settings', name: 'Settings', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {activeTab === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <Building2 className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Tenants
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {tenants.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Users
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {tenants.reduce((sum, t) => sum + t.users, 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Monthly Revenue
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${tenants.reduce((sum, t) => sum + t.subscription.amount, 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Active Tenants
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {tenants.filter(t => t.status === 'active').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Recent Activity
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {tenants.slice(0, 5).map((tenant) => (
                    <div key={tenant.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Building2 className="h-6 w-6 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {tenant.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {tenant.domain}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          tenant.status === 'active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : tenant.status === 'trial'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {tenant.status}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {tenant.plan}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'tenants' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Tenant Management
              </h2>
              <button
                onClick={() => setShowCreateTenant(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Tenant
              </button>
            </div>

            {/* Tenants Table */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Tenant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Users
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {tenants.map((tenant) => (
                    <tr key={tenant.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Building2 className="h-6 w-6 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {tenant.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {tenant.domain}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {tenant.plan}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          tenant.status === 'active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : tenant.status === 'trial'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {tenant.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {tenant.users}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        ${tenant.subscription.amount}/mo
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => updateTenantStatus(tenant.id, 'active')}
                            className="text-green-600 hover:text-green-900"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => updateTenantStatus(tenant.id, 'suspended')}
                            className="text-red-600 hover:text-red-900"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                          <button className="text-blue-600 hover:text-blue-900">
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Create Tenant Modal */}
            {showCreateTenant && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md"
                >
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Create New Tenant
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Tenant Name
                      </label>
                      <input
                        type="text"
                        value={newTenant.name}
                        onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Enter tenant name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Domain
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          type="text"
                          value={newTenant.domain}
                          onChange={(e) => setNewTenant({ ...newTenant, domain: e.target.value })}
                          className="flex-1 rounded-l-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          placeholder="subdomain"
                        />
                        <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm dark:bg-gray-600 dark:border-gray-600 dark:text-gray-300">
                          .saas.com
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Plan
                      </label>
                      <select
                        value={newTenant.plan}
                        onChange={(e) => setNewTenant({ ...newTenant, plan: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        {plans.map((plan) => (
                          <option key={plan.id} value={plan.id}>
                            {plan.name} - ${plan.price}/month
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => setShowCreateTenant(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={createTenant}
                      disabled={loading || !newTenant.name || !newTenant.domain}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {loading ? 'Creating...' : 'Create Tenant'}
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'billing' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Subscription Plans
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative rounded-lg shadow-lg overflow-hidden ${
                    plan.id === 'pro' 
                      ? 'ring-2 ring-blue-500 bg-white dark:bg-gray-800' 
                      : 'bg-white dark:bg-gray-800'
                  }`}
                >
                  {plan.id === 'pro' && (
                    <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {plan.name}
                    </h3>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        ${plan.price}
                      </span>
                      <span className="text-base font-medium text-gray-500 dark:text-gray-400">
                        /{plan.interval}
                      </span>
                    </div>
                    
                    <ul className="mt-6 space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="mt-6">
                      <button className={`w-full py-2 px-4 rounded-md font-medium ${
                        plan.id === 'pro'
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                      }`}>
                        {plan.id === 'enterprise' ? 'Contact Sales' : 'Choose Plan'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}