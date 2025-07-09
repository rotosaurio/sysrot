import { useState, useEffect } from 'react';
import { useTranslation } from '@/components/providers/intl-provider';

export default function OfflinePage() {
  const { t } = useTranslation();
  const [isOnline, setIsOnline] = useState(true);
  const [cacheInfo, setCacheInfo] = useState<{
    cacheSize: string;
    lastUpdated: string;
    availablePages: string[];
  } | null>(null);

  useEffect(() => {
    // Check initial online status
    setIsOnline(navigator.onLine);

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Get cache information
    getCacheInfo();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getCacheInfo = async () => {
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        let totalSize = 0;
        const availablePages = [];

        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName);
          const keys = await cache.keys();
          
          for (const request of keys) {
            const response = await cache.match(request);
            if (response) {
              const blob = await response.blob();
              totalSize += blob.size;
              
              // Extract page URLs
              const url = new URL(request.url);
              if (url.pathname !== '/' && !url.pathname.includes('_next')) {
                availablePages.push(url.pathname);
              }
            }
          }
        }

        setCacheInfo({
          cacheSize: formatBytes(totalSize),
          lastUpdated: localStorage.getItem('lastCacheUpdate') || 'Unknown',
          availablePages: [...new Set(availablePages)].slice(0, 10)
        });
      }
    } catch (error) {
      console.error('Error getting cache info:', error);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const retryConnection = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          {/* Offline Icon */}
          <div className="w-24 h-24 mx-auto mb-6 relative">
            <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636l-12.728 12.728m0-12.728l12.728 12.728M8 12l4 4 4-4M12 8v8"
                />
              </svg>
            </div>
            {!isOnline && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">!</span>
              </div>
            )}
          </div>

          {/* Status Message */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {isOnline ? 'Back Online!' : 'You\'re Offline'}
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {isOnline 
              ? 'Your connection has been restored. You can now access all features.'
              : 'No internet connection detected. Don\'t worry, you can still browse cached content.'
            }
          </p>

          {/* Connection Status */}
          <div className="flex items-center justify-center mb-6">
            <div className={`w-3 h-3 rounded-full mr-2 ${
              isOnline ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {isOnline ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          {/* Cache Information */}
          {cacheInfo && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                📦 Cached Content
              </h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Cache Size:</span>
                  <span className="font-medium">{cacheInfo.cacheSize}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Last Updated:</span>
                  <span className="font-medium">{cacheInfo.lastUpdated}</span>
                </div>
              </div>

              {cacheInfo.availablePages.length > 0 && (
                <div className="mt-4">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">
                    Available Pages:
                  </p>
                  <div className="space-y-1">
                    {cacheInfo.availablePages.map((page, index) => (
                      <a
                        key={index}
                        href={page}
                        className="block text-blue-600 dark:text-blue-400 hover:underline text-sm"
                      >
                        {page}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {isOnline ? (
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Return to App
              </button>
            ) : (
              <>
                <button
                  onClick={retryConnection}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  🔄 Retry Connection
                </button>
                
                <button
                  onClick={() => window.location.href = '/'}
                  className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Browse Offline Content
                </button>
              </>
            )}
          </div>

          {/* Tips */}
          {!isOnline && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                💡 Offline Tips
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 text-left">
                <li>• Previously visited pages are still available</li>
                <li>• Your data is automatically saved locally</li>
                <li>• Changes will sync when you're back online</li>
                <li>• Check your network settings if this persists</li>
              </ul>
            </div>
          )}

          {/* Technical Info */}
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
              Technical Information
            </summary>
            <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">
              <div>User Agent: {navigator.userAgent.substring(0, 50)}...</div>
              <div>Platform: {navigator.platform}</div>
              <div>Language: {navigator.language}</div>
              <div>Online: {navigator.onLine ? 'Yes' : 'No'}</div>
              <div>Service Worker: {'serviceWorker' in navigator ? 'Supported' : 'Not Supported'}</div>
              <div>Cache API: {'caches' in window ? 'Supported' : 'Not Supported'}</div>
            </div>
          </details>
        </div>

        {/* PWA Notice */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            This is a Progressive Web App (PWA) designed to work offline
          </p>
        </div>
      </div>
    </div>
  );
}