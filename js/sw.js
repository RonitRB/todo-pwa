const CACHE = 'todo-pwa-v1';
const ASSETS = [
  './',
  './index.html',
  './js/app.js',
  './css/styles.css',
  './images/icon-192.png',
  './images/icon-512.png'
];

self.addEventListener('install', e => 
    e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)))
);

self.addEventListener('fetch', e =>
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)))
);
