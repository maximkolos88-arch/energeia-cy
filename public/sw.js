/**
 * Energeia - Service Worker for PWA Offline Caching & Push Notifications
 */
try {
  importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");
} catch (e) {
  // Ignore if offline or blocked
}

const CACHE_NAME = 'energeia-cache-v12';
const ASSETS_TO_CACHE = [
  '/manifest.json',
  '/apple-touch-icon.png?v=4',
  '/icon-192.png?v=4',
  '/icon-512.png?v=4'
];

// Install Event: Activate immediately with skipWaiting()
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate Event: Clear all old caches and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch Event: Network-First for HTML/navigation, Cache-First for static assets
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Only handle same-origin requests; ignore loopback, API, or external origins
  if (url.origin !== self.location.origin) return;

  // Network-First for HTML navigation / index.html to guarantee latest deployment assets
  if (event.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname === '/') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return response;
        })
        .catch(() => {
          // Offline fallback to cached HTML page
          return caches.match(event.request).then((cached) => cached || caches.match('/index.html'));
        })
    );
    return;
  }

  // Cache-First with Network fallback for static assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // Graceful offline fallback: avoid uncaught promise rejections
        return new Response(null, { status: 504, statusText: 'Network Unavailable' });
      });
    })
  );
});
