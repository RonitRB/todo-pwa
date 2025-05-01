const STATIC_CACHE    = 'todo-pwa-static-v2';
const DYNAMIC_CACHE   = 'todo-pwa-dynamic-v1';

const STATIC_ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './js/app.js',
  './images/icon-192.png',
  './images/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener('activate', event => {
  const whitelist = [STATIC_CACHE, DYNAMIC_CACHE];
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (!whitelist.includes(key)) return caches.delete(key);
        })
      )
    )
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  event.respondWith(cacheFirst(request));
});

async function networkFirst(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  try {
    const response = await fetch(request);
    // put a clone in the dynamic cache
    cache.put(request, response.clone());
    return response;
  } catch (err) {
    // if network fails, try cache
    const cached = await cache.match(request);
    return cached || new Response(null, { status: 504, statusText: 'Offline' });
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  return fetch(request);
}

