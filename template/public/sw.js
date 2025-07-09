// Service Worker for SysRot Hub
// Version 1.0.0

const CACHE_NAME = 'sysrot-hub-v1';
const STATIC_CACHE_NAME = 'sysrot-hub-static-v1';
const DYNAMIC_CACHE_NAME = 'sysrot-hub-dynamic-v1';

// Cache strategies
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
};

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/ejemplos',
  '/blog',
  '/offline',
  '/manifest.json',
  '/icons/favicon-32x32.png',
  '/icons/favicon-16x16.png',
  '/icons/apple-touch-icon.png',
  '/_next/static/css/',
  '/_next/static/js/',
];

// Routes and their cache strategies
const ROUTE_CACHE_STRATEGIES = {
  '/api/': CACHE_STRATEGIES.NETWORK_FIRST,
  '/_next/static/': CACHE_STRATEGIES.CACHE_FIRST,
  '/_next/image': CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
  '/icons/': CACHE_STRATEGIES.CACHE_FIRST,
  '/images/': CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Error caching static assets', error);
      })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE_NAME && 
              cacheName !== DYNAMIC_CACHE_NAME && 
              cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Claiming clients');
      return self.clients.claim();
    })
  );
});

// Fetch event - handle requests with caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // Determine cache strategy based on URL
  const strategy = getCacheStrategy(url.pathname);
  
  event.respondWith(
    handleRequest(request, strategy)
      .catch(() => {
        // Fallback to offline page for navigation requests
        if (request.destination === 'document') {
          return caches.match('/offline');
        }
        // Return a simple offline response for other requests
        return new Response('Offline', { 
          status: 503, 
          statusText: 'Service Unavailable' 
        });
      })
  );
});

// Determine cache strategy for a given path
function getCacheStrategy(pathname) {
  for (const [route, strategy] of Object.entries(ROUTE_CACHE_STRATEGIES)) {
    if (pathname.startsWith(route)) {
      return strategy;
    }
  }
  return CACHE_STRATEGIES.STALE_WHILE_REVALIDATE; // Default strategy
}

// Handle request based on cache strategy
async function handleRequest(request, strategy) {
  switch (strategy) {
    case CACHE_STRATEGIES.CACHE_FIRST:
      return cacheFirst(request);
    case CACHE_STRATEGIES.NETWORK_FIRST:
      return networkFirst(request);
    case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
      return staleWhileRevalidate(request);
    default:
      return staleWhileRevalidate(request);
  }
}

// Cache First Strategy
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  const networkResponse = await fetch(request);
  await addToCache(request, networkResponse.clone());
  return networkResponse;
}

// Network First Strategy
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    await addToCache(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  
  const networkResponsePromise = fetch(request).then((networkResponse) => {
    addToCache(request, networkResponse.clone());
    return networkResponse;
  });
  
  return cachedResponse || networkResponsePromise;
}

// Add response to appropriate cache
async function addToCache(request, response) {
  // Only cache successful responses
  if (!response || response.status !== 200 || response.type !== 'basic') {
    return;
  }
  
  const url = new URL(request.url);
  const cacheName = url.pathname.startsWith('/_next/static/') 
    ? STATIC_CACHE_NAME 
    : DYNAMIC_CACHE_NAME;
  
  const cache = await caches.open(cacheName);
  await cache.put(request, response);
}

// Background sync for form submissions (if supported)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Background sync triggered');
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Handle queued form submissions or API calls
  const pendingRequests = await getPendingRequests();
  
  for (const request of pendingRequests) {
    try {
      await fetch(request);
      await removePendingRequest(request);
    } catch (error) {
      console.error('Service Worker: Background sync failed for request', error);
    }
  }
}

// Utility functions for background sync
async function getPendingRequests() {
  // In a real implementation, you'd store these in IndexedDB
  return [];
}

async function removePendingRequest(request) {
  // Remove from IndexedDB storage
}

// Push notification handling
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/icons/android-chrome-192x192.png',
    badge: '/icons/android-chrome-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/xmark.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('SysRot Hub', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Share target handling (for PWA share functionality)
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  if (url.pathname === '/share-target' && event.request.method === 'POST') {
    event.respondWith(handleShareTarget(event.request));
  }
});

async function handleShareTarget(request) {
  const formData = await request.formData();
  const title = formData.get('title') || '';
  const text = formData.get('text') || '';
  const url = formData.get('url') || '';
  
  // Store the shared content in IndexedDB or send to server
  console.log('Shared content:', { title, text, url });
  
  // Redirect to the main app
  return Response.redirect('/?shared=true', 302);
}

// Performance monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PERFORMANCE_MEASURE') {
    console.log('Performance measure:', event.data.measure);
    // Send to analytics service
  }
});

console.log('Service Worker: Loaded and ready');