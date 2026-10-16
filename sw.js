/* Service worker: coba ambil versi terbaru dari internet dulu; bila offline, pakai salinan tersimpan.
   Saat mengubah file situs dan ingin memaksa cache baru, naikkan angka versi di bawah (lt-v3 -> lt-v2). */
const CACHE = 'lt-v3';
const ASSETS = ['./', 'app.js', 'belajar.js', 'chart.umd.js', 'data-harian.js', 'data-modul.js', 'data-pajak.js', 'icon-180.png', 'icon-192.png', 'icon-512.png', 'index.html', 'keuangan.js', 'main.js', 'manifest.webmanifest', 'plus-jakarta-sans-latin-400-normal.woff2', 'plus-jakarta-sans-latin-500-normal.woff2', 'plus-jakarta-sans-latin-600-normal.woff2', 'plus-jakarta-sans-latin-700-normal.woff2', 'produktif.js', 'sora-latin-500-normal.woff2', 'sora-latin-600-normal.woff2', 'sora-latin-700-normal.woff2', 'storage.js', 'style.css'];

self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return res; })
    .catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
});
