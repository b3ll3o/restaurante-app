/**
 * MenuLink Service Worker
 * Implementa cache offline-first conforme regras em .openspec/specs/menulink-rules.md
 */

const STATIC_CACHE_NAME = "menulink-static-v1";
const DYNAMIC_CACHE_NAME = "menulink-dynamic-v1";

// URLs para cachear imediatamente na instalação
const PRECACHE_URLS = [
  "/manifest.json",
  "/favicon.ico",
];

// Install event - precache URLs críticas
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - limpa caches antigos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== STATIC_CACHE_NAME && key !== DYNAMIC_CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Fetch event - estratégias de cache conforme tipo de recurso
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith("http")) {
    return;
  }

  // Estratégia para imagens de produtos - Cache First (7 dias)
  if (request.destination === "image") {
    event.respondWith(cacheFirstStrategy(request, DYNAMIC_CACHE_NAME));
    return;
  }

  // Estratégia para rotas de API - Network First com fallback para cache
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE_NAME));
    return;
  }

  // Estratégia para navegação (rotas do Next.js) - Network First
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone e cacheia a resposta
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Fallback: tenta encontrar no cache
          return caches.match(request).then((cached) => {
            if (cached) {
              return cached;
            }
            // Retorna página offline genérica se disponível
            return caches.match("/");
          });
        })
    );
    return;
  }

  // Estratégia para assets estáticos - Cache First
  event.respondWith(cacheFirstStrategy(request, STATIC_CACHE_NAME));
});

/**
 * Estratégia Cache First
 * Tenta cache primeiro, senão busca na rede
 */
async function cacheFirstStrategy(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.warn("Cache First - Network error:", error);
    return new Response("Offline", { status: 503, statusText: "Service Unavailable" });
  }
}

/**
 * Estratégia Network First com fallback para cache
 * Tenta rede primeiro, senão usa cache
 */
async function networkFirstStrategy(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    // Network failed, try cache
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    // Return empty response for API calls when offline
    return new Response(JSON.stringify({ error: "offline", cached: false }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Handle messages from the main thread
self.addEventListener("message", (event) => {
  if (event.data === "skipWaiting") {
    self.skipWaiting();
  }
});
