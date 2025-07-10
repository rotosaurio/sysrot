import { useState, useEffect } from 'react';
import { useSession, signIn, signOut, getProviders } from 'next-auth/react';
import { AuthForm } from '@/components/auth/auth-form';
import { useTranslation } from '@/components/providers/intl-provider';
import { 
  UserCircleIcon, 
  CogIcon, 
  ShieldCheckIcon, 
  CalendarIcon,
  KeyIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  UserGroupIcon,
  ChartBarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

interface Provider {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
}

export default function AuthPage() {
  const { t } = useTranslation();
  const { data: session, status } = useSession();
  const [providers, setProviders] = useState<Record<string, Provider>>({});
  const [activeTab, setActiveTab] = useState('overview');
  const [sessionHistory, setSessionHistory] = useState([
    { date: '2024-01-15', action: 'Login', ip: '192.168.1.100', device: 'Chrome Desktop' },
    { date: '2024-01-14', action: 'Login', ip: '192.168.1.100', device: 'Mobile Safari' },
    { date: '2024-01-13', action: 'Logout', ip: '192.168.1.100', device: 'Chrome Desktop' },
  ]);
  const [userRole] = useState('user'); // admin, moderator, user
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res || {});
    };
    fetchProviders();
  }, []);

  const handleSignIn = async (providerId: string) => {
    setIsLoading(true);
    try {
      await signIn(providerId);
      toast.success(t('auth.loginSuccess'));
    } catch (error) {
      toast.error(t('auth.loginError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      toast.success(t('auth.logoutSuccess'));
    } catch (error) {
      toast.error(t('auth.logoutError'));
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'moderator': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
    }
  };

  const tabs = [
    { id: 'overview', name: t('auth.tabs.overview'), icon: ChartBarIcon },
    { id: 'profile', name: t('auth.tabs.profile'), icon: UserCircleIcon },
    { id: 'security', name: t('auth.tabs.security'), icon: ShieldCheckIcon },
    { id: 'sessions', name: t('auth.tabs.sessions'), icon: DevicePhoneMobileIcon },
    { id: 'providers', name: t('auth.tabs.providers'), icon: GlobeAltIcon },
  ];

  // Loading state
  if (status === 'loading') {
    return (
      <div className="container mx-auto max-w-6xl py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // Not authenticated view
  if (!session) {
    return (
      <div className="container mx-auto max-w-6xl py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('pages.auth.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('pages.auth.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Login Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <KeyIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">{t('auth.signIn')}</h2>
              <p className="text-muted-foreground">{t('auth.signInDescription')}</p>
            </div>
            <AuthForm />
          </div>

          {/* OAuth Providers */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border">
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <GlobeAltIcon className="w-6 h-6 mr-3 text-blue-600" />
                {t('auth.oauthProviders')}
              </h3>
              <div className="space-y-4">
                {Object.values(providers).map((provider) => (
                  <button
                    key={provider.name}
                    onClick={() => handleSignIn(provider.id)}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                  >
                    <span className="text-lg mr-3">
                      {provider.name === 'Google' && '🟢'}
                      {provider.name === 'GitHub' && '⚫'}
                      {provider.name === 'Discord' && '🟣'}
                    </span>
                    {t('auth.continueWith')} {provider.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Features Preview */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 border">
              <h3 className="text-xl font-bold mb-6">{t('auth.features')}</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <ShieldCheckIcon className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">{t('auth.features.secure')}</h4>
                    <p className="text-sm text-muted-foreground">{t('auth.features.secureDesc')}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <UserGroupIcon className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">{t('auth.features.roles')}</h4>
                    <p className="text-sm text-muted-foreground">{t('auth.features.rolesDesc')}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CalendarIcon className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">{t('auth.features.sessions')}</h4>
                    <p className="text-sm text-muted-foreground">{t('auth.features.sessionsDesc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Implementation Info */}
        <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold mb-6">{t('pages.auth.howItWorks')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border">
              <h3 className="font-semibold mb-3">{t('auth.implementation.nextauth')}</h3>
              <p className="text-sm text-muted-foreground mb-4">{t('auth.implementation.nextauthDesc')}</p>
              <code className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded block">
                pages/api/auth/[...nextauth].ts
              </code>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border">
              <h3 className="font-semibold mb-3">{t('auth.implementation.providers')}</h3>
              <p className="text-sm text-muted-foreground mb-4">{t('auth.implementation.providersDesc')}</p>
              <code className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded block">
                GoogleProvider, GitHubProvider
              </code>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border">
              <h3 className="font-semibold mb-3">{t('auth.implementation.protection')}</h3>
              <p className="text-sm text-muted-foreground mb-4">{t('auth.implementation.protectionDesc')}</p>
              <code className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded block">
                middleware.ts
              </code>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated dashboard view
  return (
    <div className="container mx-auto max-w-6xl py-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <img 
                src={session.user?.image || '/default-avatar.png'} 
                alt={session.user?.name || 'User'}
                className="w-14 h-14 rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';
                }}
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{t('auth.welcome')}, {session.user?.name}</h1>
              <p className="text-blue-100">{session.user?.email}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(userRole)}`}>
                  {t(`auth.roles.${userRole}`)}
                </span>
                <span className="text-green-300 text-xs">● {t('auth.status.online')}</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            disabled={isLoading}
            className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? t('common.loading') : t('auth.signOut')}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
              activeTab === tab.id 
                ? 'bg-white dark:bg-gray-700 text-blue-600 shadow' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span className="font-medium">{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{t('auth.stats.totalSessions')}</h3>
                <CalendarIcon className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-600">156</p>
              <p className="text-sm text-muted-foreground">{t('auth.stats.thisMonth')}</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{t('auth.stats.loginStreak')}</h3>
                <ChartBarIcon className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600">7</p>
              <p className="text-sm text-muted-foreground">{t('auth.stats.days')}</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{t('auth.stats.securityScore')}</h3>
                <ShieldCheckIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <p className="text-3xl font-bold text-yellow-600">85%</p>
              <p className="text-sm text-muted-foreground">{t('auth.stats.good')}</p>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border">
              <h3 className="text-lg font-semibold mb-6">{t('auth.profile.information')}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t('auth.profile.name')}</label>
                  <input 
                    type="text" 
                    defaultValue={session.user?.name || ''} 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t('auth.profile.email')}</label>
                  <input 
                    type="email" 
                    defaultValue={session.user?.email || ''} 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t('auth.profile.role')}</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(userRole)}`}>
                    {t(`auth.roles.${userRole}`)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border">
              <h3 className="text-lg font-semibold mb-6">{t('auth.profile.preferences')}</h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <span>{t('auth.profile.emailNotifications')}</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
                </label>
                <label className="flex items-center justify-between">
                  <span>{t('auth.profile.pushNotifications')}</span>
                  <input type="checkbox" className="w-4 h-4 text-blue-600" />
                </label>
                <label className="flex items-center justify-between">
                  <span>{t('auth.profile.twoFactor')}</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">{t('auth.security.recommendations')}</h3>
                  <ul className="mt-2 text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                    <li>• {t('auth.security.enableTwoFactor')}</li>
                    <li>• {t('auth.security.updatePassword')}</li>
                    <li>• {t('auth.security.reviewDevices')}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border">
                <h3 className="text-lg font-semibold mb-4">{t('auth.security.password')}</h3>
                <p className="text-sm text-muted-foreground mb-4">{t('auth.security.passwordDesc')}</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  {t('auth.security.changePassword')}
                </button>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border">
                <h3 className="text-lg font-semibold mb-4">{t('auth.security.twoFactorAuth')}</h3>
                <p className="text-sm text-muted-foreground mb-4">{t('auth.security.twoFactorDesc')}</p>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  {t('auth.security.enable')}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold">{t('auth.sessions.recent')}</h3>
              <p className="text-sm text-muted-foreground">{t('auth.sessions.recentDesc')}</p>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {sessionHistory.map((session, index) => (
                <div key={index} className="p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                      <DevicePhoneMobileIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{session.device}</p>
                      <p className="text-sm text-muted-foreground">{session.ip} • {session.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      session.action === 'Login' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' : 
                      'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
                    }`}>
                      {session.action}
                    </span>
                    {index === 0 && (
                      <span className="text-xs text-green-600 font-medium">{t('auth.sessions.current')}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'providers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.values(providers).map((provider) => (
              <div key={provider.name} className="bg-white dark:bg-gray-800 rounded-xl p-6 border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-lg">
                        {provider.name === 'Google' && '🟢'}
                        {provider.name === 'GitHub' && '⚫'}
                        {provider.name === 'Discord' && '🟣'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{provider.name}</h3>
                      <p className="text-sm text-muted-foreground">{provider.type}</p>
                    </div>
                  </div>
                  <span className="text-xs text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-300 px-2 py-1 rounded-full">
                    {t('auth.providers.connected')}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('auth.providers.description', { provider: provider.name })}
                </p>
                <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                  {t('auth.providers.disconnect')}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
