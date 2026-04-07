// Pensionados MX — Service Worker v36
// Estrategia: Cache First para assets, Network First para datos
const CACHE_NAME   = 'pensionados-v36';
const CACHE_STATIC = 'pensionados-static-v36';

// Assets que siempre se cachean (incluyendo librerías críticas para modo offline)
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  // FIX: jsQR precacheado — necesario para escanear QR sin internet
  'https://cdnjs.cloudflare.com/ajax/libs/jsqr/1.4.0/jsQR.min.js',
  // FIX: EmailJS precacheado — necesario para OTP cuando hay red
  'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Fira+Code:wght@400;500;600&display=swap',
  'https://fonts.gstatic.com',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_STATIC)
      .then(c => c.addAll(STATIC_ASSETS).catch(err => {
        console.warn('SW install partial:', err);
      }))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(k => k !== CACHE_NAME && k !== CACHE_STATIC)
          .map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  let url;
  try { url = new URL(e.request.url); } catch { return; }

  if(url.hostname.includes('anthropic.com') || url.hostname.includes('api.anthropic.com')) return;
  if(url.hostname.includes('firebaseio.com') || url.hostname.includes('firestore.googleapis.com')) return;
  if(url.hostname.includes('api.emailjs.com')) return;

  if(e.request.mode === 'navigate'){
    e.respondWith(
      fetch(e.request)
        .then(r => {
          if(r && r.status === 200){ const clone=r.clone(); caches.open(CACHE_STATIC).then(c=>c.put(e.request,clone)); }
          return r;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  const isCDN = url.hostname.includes('fonts.googleapis.com') ||
                url.hostname.includes('fonts.gstatic.com')    ||
                url.hostname.includes('cdnjs.cloudflare.com') ||
                url.hostname.includes('jsdelivr.net');
  if(isCDN){
    e.respondWith(
      caches.match(e.request)
        .then(cached => cached || fetch(e.request).then(r => {
          if(r && r.status === 200){ const clone=r.clone(); caches.open(CACHE_STATIC).then(c=>c.put(e.request,clone)); }
          return r;
        }).catch(() => new Response('',{status:408})))
    );
    return;
  }

  if(url.origin === self.location.origin){
    e.respondWith(
      caches.open(CACHE_STATIC).then(cache =>
        cache.match(e.request).then(cached => {
          const net = fetch(e.request).then(r => { if(r&&r.status===200) cache.put(e.request,r.clone()); return r; }).catch(()=>null);
          return cached || net;
        })
      )
    );
    return;
  }
});

self.addEventListener('message', e => {
  if(e.data?.type === 'SKIP_WAITING') self.skipWaiting();
  if(e.data?.type === 'GET_VERSION') e.ports[0]?.postMessage({version: CACHE_NAME});
});
