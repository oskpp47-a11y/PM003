// Pensionados MX — Service Worker v23
const CACHE_NAME = 'pensionados-v23';
const ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Fira+Code:wght@400;500;600&display=swap'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
  )).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  try { new URL(e.request.url); } catch { return; }
  const isNav = e.request.mode === 'navigate';
  if(isNav){
    e.respondWith(fetch(e.request).then(r=>{
      if(r&&r.status===200) caches.open(CACHE_NAME).then(c=>c.put(e.request,r.clone()));
      return r;
    }).catch(()=>caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(e.request).then(cached => cached || fetch(e.request).then(r => {
    if(r&&r.status===200&&r.type!=='opaque') caches.open(CACHE_NAME).then(c=>c.put(e.request,r.clone()));
    return r;
  }).catch(()=>caches.match('./index.html'))));
});
self.addEventListener('message', e => { if(e.data?.type==='SKIP_WAITING') self.skipWaiting(); });
