const CACHE_NAME = 'click-counter-v1';
const urlsToCache = [
  '/JonaStars/',
  '/JonaStars/index.html',
  '/JonaStars/static/js/main.js',
  '/JonaStars/static/css/main.css',
  '/JonaStars/images/logo/jonastars.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});
