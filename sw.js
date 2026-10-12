/* MathSprint — service worker.
   Pour publier une nouvelle version : changer CACHE_VERSION ci-dessous. */
const CACHE_VERSION = 'mathsprint-v18';
const SHELL = [
  './', './index.html', './manifest.webmanifest',
  './icon-192.png', './icon-512.png', './icon-maskable-512.png',
  './apple-touch-icon.png', './favicon-32.png',
  './Inter-Regular.woff', './Inter-Medium.woff', './Inter-SemiBold.woff', './Inter-Bold.woff',
  './JetBrainsMono-Regular.woff', './JetBrainsMono-Bold.woff'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Cache d'abord (démarrage instantané, même sans réseau), mise à jour en arrière-plan.
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(
    caches.open(CACHE_VERSION).then(cache =>
      cache.match(req, { ignoreSearch: true }).then(cached => {
        const network = fetch(req).then(res => {
          if (res && res.ok) cache.put(req, res.clone());
          return res;
        }).catch(() => cached || (req.mode === 'navigate' ? cache.match('./index.html') : undefined));
        return cached || network;
      })
    )
  );
});
