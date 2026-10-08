// Offline support. Bump VERSION with every release so visitors pick up the new files.
const VERSION = 'kbcs-2026-10-08';

const PRECACHE = [
  './',
  'index.html',
  'audit.html',
  'accessibility.html',
  'services.html',
  'work.html',
  'about.html',
  'contact.html',
  'offline.html',
  'styles.css',
  'script.js',
  'images/logo.png',
  'images/kevin.jpg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== VERSION).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;
  if (!sameOrigin && !FONT_HOSTS.includes(url.hostname)) return;

  // Pages: the network first, so content is always current; the cache when offline
  if (request.mode === 'navigate') {
    const key = url.origin + url.pathname;
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(VERSION).then((cache) => cache.put(key, copy));
          }
          return response;
        })
        .catch(() => caches.match(key).then((cached) => cached || caches.match('offline.html'))),
    );
    return;
  }

  // Styles, scripts, images, and fonts: answer from the cache, refresh in the background
  event.respondWith(
    caches.open(VERSION).then((cache) => cache.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response.ok) cache.put(request, response.clone());
          return response;
        })
        .catch(() => cached);
      if (cached) {
        event.waitUntil(network);
        return cached;
      }
      return network;
    })),
  );
});
