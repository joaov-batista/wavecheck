/* WaveCheck Service Worker v9 */
const V = 'wc-v9';

// CORRIGIDO: paths corretos dos assets (css/ e js/ em subpastas, icons/ para ícones)
const STATIC = [
  '/',
  '/index.html',
  '/css/app.css',
  '/js/app.js',
  '/manifest.json',
];

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

  // Requisições externas (APIs, fontes): network-only com fallback silencioso
  if (url.hostname !== self.location.hostname) {
    e.respondWith(
      fetch(e.request).catch(() => new Response('', { status: 503 }))
    );
    return;
  }

  // Assets locais: stale-while-revalidate
  e.respondWith(
    caches.open(V).then(async cache => {
      const cached = await cache.match(e.request);

      const net = fetch(e.request)
        .then(res => {
          if (res.ok) cache.put(e.request, res.clone());
          return res;
        })
        .catch(() => null);

      if (cached) {
        // Serve do cache imediatamente, atualiza em background
        e.waitUntil(net);
        return cached;
      }

      // Sem cache: aguarda network
      const fresh = await net;
      if (fresh) return fresh;

      // Fallback final: serve index.html para navegação
      if (e.request.mode === 'navigate') {
        return cache.match('/index.html');
      }

      return new Response('', { status: 503 });
    })
  );
});