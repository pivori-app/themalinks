// Service Worker optimisé pour ThemaLinks
// Version: 1.0.0

const CACHE_NAME = 'themalinks-v1.0.0';
const STATIC_CACHE = 'themalinks-static-v1.0.0';
const DYNAMIC_CACHE = 'themalinks-dynamic-v1.0.0';
const IMAGE_CACHE = 'themalinks-images-v1.0.0';

// Ressources à mettre en cache immédiatement
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Ressources à exclure du cache
const CACHE_BLACKLIST = [
  /\/api\//,
  /\/auth\//,
  /analytics/,
  /gtag/,
  /google-analytics/
];

// Configuration du cache
const CACHE_CONFIG = {
  // Durée de vie des caches (en millisecondes)
  staticTTL: 7 * 24 * 60 * 60 * 1000, // 7 jours
  dynamicTTL: 24 * 60 * 60 * 1000,    // 1 jour
  imageTTL: 30 * 24 * 60 * 60 * 1000, // 30 jours
  
  // Taille maximale des caches
  maxStaticEntries: 100,
  maxDynamicEntries: 50,
  maxImageEntries: 200
};

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installation');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('📦 Service Worker: Mise en cache des ressources statiques');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('✅ Service Worker: Installation terminée');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Service Worker: Erreur installation:', error);
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activation');
  
  event.waitUntil(
    Promise.all([
      // Nettoyer les anciens caches
      cleanupOldCaches(),
      // Prendre le contrôle immédiatement
      self.clients.claim()
    ]).then(() => {
      console.log('✅ Service Worker: Activation terminée');
    })
  );
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorer les requêtes non-HTTP
  if (!request.url.startsWith('http')) {
    return;
  }
  
  // Ignorer les requêtes blacklistées
  if (CACHE_BLACKLIST.some(pattern => pattern.test(request.url))) {
    return;
  }
  
  // Stratégie de cache selon le type de ressource
  if (request.destination === 'image') {
    event.respondWith(handleImageRequest(request));
  } else if (request.destination === 'document') {
    event.respondWith(handleDocumentRequest(request));
  } else if (request.destination === 'script' || request.destination === 'style') {
    event.respondWith(handleStaticRequest(request));
  } else {
    event.respondWith(handleDynamicRequest(request));
  }
});

// Gestion des requêtes d'images (Cache First)
async function handleImageRequest(request) {
  try {
    const cache = await caches.open(IMAGE_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse && !isExpired(cachedResponse, CACHE_CONFIG.imageTTL)) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Limiter la taille du cache
      await limitCacheSize(IMAGE_CACHE, CACHE_CONFIG.maxImageEntries);
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Erreur requête image:', error);
    
    // Fallback vers le cache même expiré
    const cache = await caches.open(IMAGE_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Image de fallback
    return new Response(
      '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f3f4f6"/><text x="100" y="100" text-anchor="middle" dy=".3em" fill="#9ca3af">Image non disponible</text></svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
}

// Gestion des requêtes de documents (Network First avec fallback)
async function handleDocumentRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Erreur requête document:', error);
    
    // Fallback vers le cache
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Page hors-ligne
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>ThemaLinks - Hors ligne</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { 
              font-family: system-ui, sans-serif; 
              text-align: center; 
              padding: 50px; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              min-height: 100vh;
              margin: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-direction: column;
            }
            .offline-icon { font-size: 64px; margin-bottom: 20px; }
            h1 { margin-bottom: 10px; }
            p { opacity: 0.8; margin-bottom: 30px; }
            button { 
              background: rgba(255,255,255,0.2); 
              border: 2px solid rgba(255,255,255,0.3);
              color: white; 
              padding: 12px 24px; 
              border-radius: 25px; 
              cursor: pointer;
              font-size: 16px;
              transition: all 0.3s ease;
            }
            button:hover { 
              background: rgba(255,255,255,0.3);
              transform: translateY(-2px);
            }
          </style>
        </head>
        <body>
          <div class="offline-icon">📡</div>
          <h1>Vous êtes hors ligne</h1>
          <p>Vérifiez votre connexion internet et réessayez</p>
          <button onclick="window.location.reload()">Réessayer</button>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// Gestion des requêtes statiques (Cache First)
async function handleStaticRequest(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse && !isExpired(cachedResponse, CACHE_CONFIG.staticTTL)) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      await limitCacheSize(STATIC_CACHE, CACHE_CONFIG.maxStaticEntries);
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Erreur requête statique:', error);
    
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Gestion des requêtes dynamiques (Network First)
async function handleDynamicRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      await limitCacheSize(DYNAMIC_CACHE, CACHE_CONFIG.maxDynamicEntries);
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Erreur requête dynamique:', error);
    
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse && !isExpired(cachedResponse, CACHE_CONFIG.dynamicTTL)) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Vérifier si une réponse en cache est expirée
function isExpired(response, ttl) {
  const cachedDate = response.headers.get('sw-cached-date');
  if (!cachedDate) return false;
  
  const cacheTime = new Date(cachedDate).getTime();
  const now = Date.now();
  
  return (now - cacheTime) > ttl;
}

// Limiter la taille d'un cache
async function limitCacheSize(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > maxEntries) {
    const keysToDelete = keys.slice(0, keys.length - maxEntries);
    await Promise.all(keysToDelete.map(key => cache.delete(key)));
  }
}

// Nettoyer les anciens caches
async function cleanupOldCaches() {
  const cacheNames = await caches.keys();
  const currentCaches = [CACHE_NAME, STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE];
  
  const oldCaches = cacheNames.filter(name => !currentCaches.includes(name));
  
  await Promise.all(
    oldCaches.map(cacheName => {
      console.log('🗑️ Suppression ancien cache:', cacheName);
      return caches.delete(cacheName);
    })
  );
}

// Gestion des messages du client
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_CACHE_INFO':
      getCacheInfo().then(info => {
        event.ports[0].postMessage({ type: 'CACHE_INFO', payload: info });
      });
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ type: 'CACHE_CLEARED' });
      });
      break;
      
    case 'PREFETCH_URLS':
      prefetchUrls(payload.urls);
      break;
  }
});

// Obtenir les informations de cache
async function getCacheInfo() {
  const cacheNames = await caches.keys();
  const info = {};
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    info[cacheName] = {
      size: keys.length,
      urls: keys.map(key => key.url)
    };
  }
  
  return info;
}

// Vider tous les caches
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map(name => caches.delete(name)));
}

// Précharger des URLs
async function prefetchUrls(urls) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  await Promise.all(
    urls.map(async (url) => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          await cache.put(url, response);
        }
      } catch (error) {
        console.error('Erreur préchargement:', url, error);
      }
    })
  );
}

// Gestion des notifications push
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  try {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: data.data || {},
      actions: data.actions || [],
      requireInteraction: data.requireInteraction || false,
      silent: data.silent || false
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  } catch (error) {
    console.error('Erreur notification push:', error);
  }
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const data = event.notification.data;
  let url = '/';
  
  // Déterminer l'URL selon le type de notification
  if (data.type === 'new-links' && data.category) {
    url = `/#category-${data.category}`;
  } else if (data.type === 'weekly-stats') {
    url = '/#profile-stats';
  } else if (event.action === 'view-broken') {
    url = '/#admin-broken-links';
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Chercher une fenêtre existante
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      
      // Ouvrir une nouvelle fenêtre
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Synchronisation en arrière-plan
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Fonction de synchronisation
async function doBackgroundSync() {
  try {
    // Synchroniser les données en attente
    console.log('🔄 Synchronisation en arrière-plan');
    
    // Ici, vous pouvez ajouter la logique de synchronisation
    // Par exemple, envoyer les analytics en attente, synchroniser les favoris, etc.
    
  } catch (error) {
    console.error('Erreur synchronisation:', error);
  }
}

console.log('🚀 Service Worker ThemaLinks chargé et prêt');
