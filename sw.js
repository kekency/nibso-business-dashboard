// A name for our cache
const CACHE_NAME = 'nibso-cache-v2';

// The essential files to cache for the app shell to work offline
const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/manifest.json'
];

// Service Worker installation
self.addEventListener('install', (event) => {
  // Perform install steps
  self.skipWaiting(); // Force the waiting service worker to become the active one.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache and caching app shell');
        return cache.addAll(urlsToCache);
      })
  );
});

// Service Worker activation
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // If the cache name is not in our whitelist, delete it
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      ).then(() => {
        // Tell the active service worker to take control of the page immediately.
        return self.clients.claim();
      });
    })
  );
});

// Service Worker fetch event
self.addEventListener('fetch', (event) => {
  // We only want to cache GET requests.
  // We also don't want to cache requests to the Gemini API.
  if (event.request.method !== 'GET' || event.request.url.includes('generativelanguage.googleapis.com')) {
    // For non-GET requests, just do the default browser action.
    return;
  }

  event.respondWith(
    // We're using a Network First strategy.
    fetch(event.request)
      .then((networkResponse) => {
        // If we got a valid response, we should cache it and return it.
        // This keeps the cache up-to-date.
        if (networkResponse && networkResponse.ok) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
        }
        return networkResponse;
      })
      .catch(() => {
        // If the network request fails (e.g., user is offline),
        // we try to serve the response from the cache.
        return caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }

            // If the request is for navigation and it's not in the cache,
            // return the cached index.html as a fallback.
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            
            // If the request is for an asset and not in cache, it will fail,
            // which is the expected behavior for an asset that was never cached.
            return undefined;
          });
      })
  );
});
