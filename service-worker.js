// Service Worker – Language App
// GitHub Pages serves the site inside a subfolder, e.g. /language_app/
// BASE_PATH must match the repo name in your GitHub Pages URL.
// If your repo is called "language_app", set BASE_PATH = "/language_app".
// If you rename the repo, update this value.
// For local dev (python -m http.server) set BASE_PATH = "".

const BASE_PATH  = "/language_app";
const CACHE_NAME = "language_app-v3";

// All paths are relative to BASE_PATH
const STATIC_ASSETS = [
  BASE_PATH + "/",                  // index.html (served as directory root)
  BASE_PATH + "/index.html",
  BASE_PATH + "/styles.css",
  BASE_PATH + "/app.js",
  BASE_PATH + "/manifest.json",
  // New separate JSON files
  BASE_PATH + "/questions_en.json",
  BASE_PATH + "/questions_es_presente.json",
  BASE_PATH + "/questions_es_perfecto.json",
  BASE_PATH + "/questions_es_indefinido.json",
  BASE_PATH + "/questions_es_imperfecto.json",
  BASE_PATH + "/questions_es_imperativo.json",
  BASE_PATH + "/questions_es_condicional.json"
];

// --- INSTALL: pre-cache the app shell ---
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Caching app shell…");
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// --- ACTIVATE: purge old caches ---
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  event.clients.claim();
});

// --- FETCH: cache-first, network fallback ---
self.addEventListener("fetch", (event) => {
  // Only intercept requests that start with our base path
  if (!event.request.url.includes(BASE_PATH)) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type === "error") {
          return response;
        }
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      });
    })
  );
});
