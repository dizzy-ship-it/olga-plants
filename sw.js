const CACHE = 'plants-v18';
const STATIC = ['/icon.png', '/icon-512.png', '/manifest.json'];

// Cache static assets only (icons, manifest)
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)));
  self.skipWaiting();
});

// Clear old caches on activate
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => clients.claim())
  );
});

// Network-first for HTML/JS — always get fresh content
// Cache-first for static assets (icons etc)
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  const isStatic = STATIC.some(s => url.pathname.endsWith(s));

  if (isStatic) {
    // Cache-first for icons/manifest
    e.respondWith(
      caches.match(e.request).then(r => r || fetch(e.request))
    );
  } else {
    // Network-first for everything else — always fresh
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
  }
});
