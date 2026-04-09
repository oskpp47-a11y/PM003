// Service Worker Configuration
// Modify this file to customize caching behavior

const SW_VERSION = 'v39';
const CACHE_NAME = `pensionados-mx-${SW_VERSION}`;

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/app.js',
  '/manifest.json',
  '/assets/icon-192.png',
  '/assets/icon-512.png',
  'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&family=Syne:wght@700;800&display=swap',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
];

// Export for sw.js
if (typeof module !== 'undefined') module.exports = { SW_VERSION, CACHE_NAME, ASSETS_TO_CACHE };
