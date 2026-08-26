/**
 * Energeia - Service Worker for PWA Offline Caching & Push Notifications
 */

const CACHE_NAME = 'energeia-cache-v2';
const ASSETS_TO_CACHE = [
  '/manifest.json',
  '/apple-touch-icon.png?v=4',
  '/icon-192.png?v=4',
  '/icon-512.png?v=4'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Network-First for HTML documents, Cache-First for static assets
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Network-First for HTML navigation / index.html to guarantee latest build chunks
  if (event.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname === '/') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          return response;
        })
        .catch(() => {
          // Offline fallback to cached page
          return caches.match(event.request).then((cached) => cached || caches.match('/index.html'));
        })
    );
    return;
  }

  // Cache-First for static assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});

// Push notification event listener
self.addEventListener('push', (event) => {
  let data = { 
    title: 'Energeia Cyprus', 
    body: 'New Cyprus energy market updates are available!',
    unread_count: 1 
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { 
        title: 'Energeia Cyprus', 
        body: event.data.text(),
        unread_count: 1 
      };
    }
  }

  // App Badging API synchronization
  if (self.navigator && 'setAppBadge' in self.navigator) {
    self.navigator.setAppBadge(data.unread_count || 1);
  }

  const options = {
    body: data.body,
    icon: '/icon-192.png?v=4',
    badge: '/icon-192.png?v=4',
    vibrate: [100, 50, 100],
    data: {
      url: '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow('/');
      }
    })
  );
});
