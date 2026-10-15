/* Titik awal: jalankan aplikasi, lalu daftarkan service worker agar bisa dipasang dan dibuka tanpa internet. */
LT.start();
if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
  window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
}
