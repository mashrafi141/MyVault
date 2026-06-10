const CACHE_NAME = "vault-v1";

const FILES = [
  "/",
  "/index.html",
  "/manifest.json",
  "/assets/css/style.css",
  "/assets/js/app.js",
  "/assets/js/auth.js",
  "/assets/js/gallery.js",
  "/assets/js/player.js",
  "/assets/js/scanner.js",
  "/assets/js/storage.js"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES))
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request)
      .then(res => res || fetch(e.request))
  );
});
