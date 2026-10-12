/* MathSprint — service worker.
   Pour publier une nouvelle version : changer CACHE_VERSION ci-dessous. */
const CACHE_VERSION = 'mathsprint-v20';
const SHELL = [
  './', './index.html', './manifest.webmanifest',
  './icon-192.png', './icon-512.png', './icon-maskable-512.png',
  './apple-touch-icon.png', './favicon-32.png',
  './Inter-Regular.woff', './Inter-Medium.woff', './Inter-SemiBold.woff', './Inter-Bold.woff',
  './JetBrainsMono-Regular.woff', './JetBrainsMono-Bold.woff'
];

// Installation : on récupère les fichiers directement sur le serveur ('reload'), sans passer par le cache HTTP
// (GitHub Pages garde les fichiers ~10 min : sans cela, l'ancienne version serait recopiée dans le nouveau cache).
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => Promise.all(SHELL.map(url =>
        fetch(new Request(url, { cache: 'reload' })).then(res => { if (!res.ok) throw new Error(url); return cache.put(url, res); })
      )))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Pages : réseau d'abord (toujours la dernière version si on est en ligne), cache en secours hors ligne.
// Autres fichiers (polices, icônes) : cache d'abord, mis à jour en arrière-plan.
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    event.respondWith(
      new Promise(resolve => {
        const timer = setTimeout(() => caches.match('./index.html', { ignoreSearch: true }).then(c => c && resolve(c)), 3500);
        fetch(req, { cache: 'no-cache' }).then(res => {
          clearTimeout(timer);
          if (res && res.ok) { const copy = res.clone(); caches.open(CACHE_VERSION).then(c => c.put('./index.html', copy)); resolve(res); }
          else caches.match('./index.html', { ignoreSearch: true }).then(c => resolve(c || res));
        }).catch(() => { clearTimeout(timer); caches.match('./index.html', { ignoreSearch: true }).then(c => resolve(c || Response.error())); });
      })
    );
    return;
  }
  event.respondWith(
    caches.open(CACHE_VERSION).then(cache =>
      cache.match(req, { ignoreSearch: true }).then(cached => {
        const network = fetch(req).then(res => { if (res && res.ok) cache.put(req, res.clone()); return res; }).catch(() => cached);
        return cached || network;
      })
    )
  );
});
