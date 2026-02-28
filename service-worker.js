const CACHE_NAME = 'spruce-lodge-v8';

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
  'icons/icon-192.png',
  'icons/icon-512.png',
  'assets/hero-cabin.jpg',
];

// --- Install: precache the app shell and assets ---
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// --- Activate: delete old cache versions ---
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// --- Stale-While-Revalidate: serve cache instantly, refresh in background ---
function staleWhileRevalidate(request) {
  const networkUpdate = fetch(request).then(response => {
    if (response.ok) {
      caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
    }
    return response;
  });
  return caches.match(request).then(cached => {
    if (cached) {
      networkUpdate.catch(() => {}); // background update, ignore network errors
      return cached;
    }
    return networkUpdate; // first visit: wait for network
  });
}

// --- Cache-First: serve from cache, fall back to network ---
function cacheFirst(request) {
  return caches.match(request).then(cached => cached || fetch(request));
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
