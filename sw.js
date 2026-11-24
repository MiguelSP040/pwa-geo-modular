const CACHE_NAME = 'geo-modular-v1';
const ARCHIVOS = ['./', './index.html', './styles.css', './geo-helper.js', './app.js', './manifest.json', './icon.svg'];
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((claves) => Promise.all(claves.filter((clave) => clave.startsWith('geo-modular-') && clave !== CACHE_NAME).map((clave) => caches.delete(clave)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(caches.match(event.request).then((respuesta) => respuesta || fetch(event.request)));
});
