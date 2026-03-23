/* WaveCheck Service Worker v8 — force cache bust */
const V      = 'wc-v8';
const STATIC = ['/', '/index.html', '/css/app.css', '/js/app.js', '/manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(V)
      .then(c => c.addAll(STATIC).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.hostname !== self.location.hostname) {
    e.respondWith(fetch(e.request).catch(() => new Response('', { status: 503 })));
    return;
  }
  e.respondWith(
    caches.open(V).then(async cache => {
      const cached = await cache.match(e.request);
      const net = fetch(e.request)
        .then(res => { if (res.ok) cache.put(e.request, res.clone()); return res; })
        .catch(() => null);
      if (cached) { e.waitUntil(net); return cached; }
      const r = await net;
      if (r) return r;
      if (e.request.mode === 'navigate') return cache.match('/index.html');
      return new Response('', { status: 503 });
    })
  );
});