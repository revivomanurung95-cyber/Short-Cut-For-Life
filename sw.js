/* Service worker: coba ambil versi terbaru dari internet dulu; bila offline, pakai salinan tersimpan.
   Saat mengubah file situs dan ingin memaksa cache baru, naikkan angka versi di bawah (lt-v1 -> lt-v2). */
const CACHE = 'lt-v1';
const ASSETS = ['./', 'index.html', 'manifest.webmanifest', 'style.css',
  'data-modul.js', 'data-harian.js', 'data-pajak.js', 'storage.js', 'app.js', 'belajar.js', 'main.js',
  'chart.umd.js', 'icon-192.png', 'icon-512.png', 'icon-180.png',
  'plus-jakarta-sans-latin-400-normal.woff2', 'plus-jakarta-sans-latin-500-normal.woff2',
  'plus-jakarta-sans-latin-600-normal.woff2', 'plus-jakarta-sans-latin-700-normal.woff2',
  'sora-latin-500-normal.woff2', 'sora-latin-600-normal.woff2', 'sora-latin-700-normal.woff2'];

self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return res; })
    .catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
});
