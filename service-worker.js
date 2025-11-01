// ===================================
// Service Worker for Sky Learning Platform
// Offline functionality and caching
// ===================================

'use strict';

const CACHE_NAME = 'sky-learning-v1.0.0';
const RUNTIME_CACHE = 'sky-learning-runtime';

// Assets to cache on install
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/css/style.css',
  '/assets/css/enhancements.css',
  '/assets/js/app.js',
  '/assets/js/utils.js',
  '/assets/js/toast.js',
  '/assets/js/theme-manager.js',
  '/assets/js/analytics.js',
  '/assets/js/achievements.js',
  '/pages/characters.html',
  '/pages/journeys/london.html',
  '/pages/games/word-building.html',
  '/blog/article-1.html'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[ServiceWorker] Skip waiting');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[ServiceWorker] Install failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[ServiceWorker] Claiming clients');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          console.log('[ServiceWorker] Serving from cache:', event.request.url);
          return response;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          // Cache the fetched response
          caches.open(RUNTIME_CACHE)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch((error) => {
          console.error('[ServiceWorker] Fetch failed:', error);

          // Return offline page if available
          return caches.match('/offline.html').then((offlineResponse) => {
            return offlineResponse || new Response(
              'محتوى غير متوفر حالياً. يرجى التحقق من اتصال الإنترنت.',
              {
                status: 503,
                statusText: 'Service Unavailable',
                headers: new Headers({
                  'Content-Type': 'text/html; charset=utf-8'
                })
              }
            );
          });
        });
      })
  );
});

// Background sync for analytics
self.addEventListener('sync', (event) => {
  console.log('[ServiceWorker] Background sync:', event.tag);

  if (event.tag === 'sync-analytics') {
    event.waitUntil(syncAnalytics());
  }
});

// Sync analytics data
async function syncAnalytics() {
  try {
    const cache = await caches.open('analytics-queue');
    const requests = await cache.keys();

    await Promise.all(
      requests.map(async (request) => {
        try {
          await fetch(request);
          await cache.delete(request);
        } catch (error) {
          console.error('[ServiceWorker] Failed to sync:', error);
        }
      })
    );
  } catch (error) {
    console.error('[ServiceWorker] Sync analytics failed:', error);
  }
}

// Push notification handler
self.addEventListener('push', (event) => {
  console.log('[ServiceWorker] Push received');

  const options = {
    body: event.data ? event.data.text() : 'رسالة جديدة من Sky Learning',
    icon: '/assets/images/icon-192.png',
    badge: '/assets/images/badge-72.png',
    vibrate: [200, 100, 200],
    tag: 'sky-learning-notification',
    requireInteraction: false,
    actions: [
      { action: 'open', title: 'فتح', icon: '/assets/images/checkmark.png' },
      { action: 'close', title: 'إغلاق', icon: '/assets/images/close.png' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Sky Learning', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[ServiceWorker] Notification clicked:', event.action);

  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handler for communication with main thread
self.addEventListener('message', (event) => {
  console.log('[ServiceWorker] Message received:', event.data);

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      }).then(() => {
        event.ports[0].postMessage({ type: 'CACHE_CLEARED' });
      })
    );
  }

  if (event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      type: 'VERSION',
      version: CACHE_NAME
    });
  }
});

console.log('[ServiceWorker] Loaded');
