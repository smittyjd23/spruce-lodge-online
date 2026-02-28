const CACHE_NAME = 'spruce-lodge-v13';

const PRECACHE_URLS = [
  './',
  'index.html',
  'house.html',
  'activities.html',
  'contact.html',
  'food.html',
  'rental.html',
  'styles.css',
  'favicon.svg',
  'manifest.json',
  'service-worker.js',
  'nav.js',
  'analytics.js',
  'install-prompt.js',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'assets/hero-cabin.jpg',
];

// --- Install: precache the app shell and assets ---
self.addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(PRECACHE_URLS);
      await self.skipWaiting();
    })()
  );
});

// --- Activate: delete old cache versions ---
self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

// --- Stale-While-Revalidate: serve cache instantly, refresh in background ---
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await caches.match(request);

  const networkPromise = fetch(request).then(async response => {
    if (response.ok) {
      await cache.put(request, response.clone());
    }
    return response;
  }).catch(err => {
    console.warn('[SW] Network update failed for', request.url, err);
    return null;
  });

  if (cached) {
    // Return the cached response immediately; network update runs in background
    return cached;
  }

  // No cached version: wait for network (first visit)
  const networkResponse = await networkPromise;
  if (!networkResponse) {
    throw new Error(`[SW] Network failed and no cache for: ${request.url}`);
  }
  return networkResponse;
}

// --- Cache-First: serve from cache, fall back to network ---
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    return await fetch(request);
  } catch (err) {
    console.warn('[SW] Cache miss and network failed for', request.url, err);
    throw err;
  }
}

// --- Fetch: HTML navigation uses SWR; everything else is Cache-First ---
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    event.request.mode === 'navigate'
      ? staleWhileRevalidate(event.request)
      : cacheFirst(event.request)
  );
});
