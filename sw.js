const CACHE = 'vloer-v1';
const ASSETS = ['/', '/index.html', '/icon-192.png', '/manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Network first for HTML/API, cache fallback for assets
  if (e.request.url.includes('firebasedatabase') || e.request.url.includes('gstatic')) {
    return; // Don't cache Firebase or SDK requests
  }
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
