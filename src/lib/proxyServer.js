// Serveur proxy pour gérer les liens non-compatibles iframe
import { createProxyMiddleware } from 'http-proxy-middleware';

// Configuration du proxy pour contourner les restrictions CORS et X-Frame-Options
export const proxyConfig = {
  // Endpoints de proxy
  endpoints: {
    '/api/proxy': {
      target: 'https://cors-anywhere.herokuapp.com/',
      changeOrigin: true,
      pathRewrite: {
        '^/api/proxy': ''
      },
      onProxyReq: (proxyReq, req, res) => {
        // Ajouter des headers pour contourner les restrictions
        proxyReq.setHeader('X-Requested-With', 'XMLHttpRequest');
        proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (compatible; ThemaLinks/1.0)');
      },
      onProxyRes: (proxyRes, req, res) => {
        // Supprimer les headers qui bloquent l'iframe
        delete proxyRes.headers['x-frame-options'];
        delete proxyRes.headers['content-security-policy'];
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
      }
    }
  }
};

// Service de proxy côté client
export class ProxyService {
  constructor() {
    this.proxyEndpoints = [
      'https://cors-anywhere.herokuapp.com/',
      'https://api.allorigins.win/get?url=',
      'https://thingproxy.freeboard.io/fetch/'
    ];
    this.currentEndpointIndex = 0;
  }

  // Génération d'URL proxy
  generateProxyUrl(targetUrl) {
    try {
      const url = new URL(targetUrl);
      
      // Vérifier si l'URL nécessite un proxy
      if (this.needsProxy(url)) {
        return this.getProxyUrl(targetUrl);
      }
      
      return targetUrl;
    } catch (error) {
      console.error('URL invalide:', targetUrl);
      return null;
    }
  }

  // Vérifier si l'URL nécessite un proxy
  needsProxy(url) {
    const hostname = url.hostname.toLowerCase();
    
    // Domaines connus pour bloquer les iframes
    const blockedDomains = [
      'youtube.com',
      'facebook.com',
      'twitter.com',
      'instagram.com',
      'linkedin.com',
      'github.com',
      'stackoverflow.com',
      'reddit.com',
      'medium.com',
      'wikipedia.org'
    ];

    return blockedDomains.some(domain => 
      hostname === domain || hostname.endsWith('.' + domain)
    );
  }

  // Obtenir l'URL du proxy
  getProxyUrl(targetUrl) {
    const endpoint = this.proxyEndpoints[this.currentEndpointIndex];
    
    switch (this.currentEndpointIndex) {
      case 0: // cors-anywhere
        return `${endpoint}${targetUrl}`;
      case 1: // allorigins
        return `${endpoint}${encodeURIComponent(targetUrl)}`;
      case 2: // thingproxy
        return `${endpoint}${targetUrl}`;
      default:
        return targetUrl;
    }
  }

  // Basculer vers le prochain endpoint en cas d'erreur
  switchToNextEndpoint() {
    this.currentEndpointIndex = (this.currentEndpointIndex + 1) % this.proxyEndpoints.length;
    console.log(`Basculement vers l'endpoint proxy ${this.currentEndpointIndex + 1}`);
  }

  // Test de connectivité d'un endpoint
  async testEndpoint(endpointIndex, testUrl = 'https://httpbin.org/get') {
    const originalIndex = this.currentEndpointIndex;
    this.currentEndpointIndex = endpointIndex;
    
    try {
      const proxyUrl = this.getProxyUrl(testUrl);
      const response = await fetch(proxyUrl, {
        method: 'GET',
        timeout: 5000
      });
      
      this.currentEndpointIndex = originalIndex;
      return response.ok;
    } catch (error) {
      this.currentEndpointIndex = originalIndex;
      return false;
    }
  }

  // Trouver le meilleur endpoint disponible
  async findBestEndpoint() {
    const testPromises = this.proxyEndpoints.map((_, index) => 
      this.testEndpoint(index)
    );
    
    const results = await Promise.allSettled(testPromises);
    
    for (let i = 0; i < results.length; i++) {
      if (results[i].status === 'fulfilled' && results[i].value) {
        this.currentEndpointIndex = i;
        console.log(`Meilleur endpoint trouvé: ${i + 1}`);
        return;
      }
    }
    
    console.warn('Aucun endpoint proxy disponible');
  }

  // Chargement d'une page via proxy avec fallback
  async loadPageViaProxy(url, options = {}) {
    const maxRetries = this.proxyEndpoints.length;
    let lastError = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const proxyUrl = this.generateProxyUrl(url);
        if (!proxyUrl) {
          throw new Error('Impossible de générer l\'URL proxy');
        }

        const response = await fetch(proxyUrl, {
          method: 'GET',
          headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
            'Cache-Control': 'no-cache',
            ...options.headers
          },
          timeout: options.timeout || 10000
        });

        if (response.ok) {
          return {
            success: true,
            data: await response.text(),
            url: proxyUrl,
            originalUrl: url
          };
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        lastError = error;
        console.warn(`Tentative ${attempt + 1} échouée:`, error.message);
        
        if (attempt < maxRetries - 1) {
          this.switchToNextEndpoint();
          await new Promise(resolve => setTimeout(resolve, 1000)); // Délai avant retry
        }
      }
    }

    return {
      success: false,
      error: lastError?.message || 'Tous les endpoints proxy ont échoué',
      originalUrl: url
    };
  }

  // Nettoyage du HTML pour l'affichage sécurisé
  sanitizeHtml(html, baseUrl) {
    try {
      // Créer un document temporaire
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Supprimer les scripts potentiellement dangereux
      const scripts = doc.querySelectorAll('script');
      scripts.forEach(script => script.remove());
      
      // Supprimer les iframes imbriquées
      const iframes = doc.querySelectorAll('iframe');
      iframes.forEach(iframe => iframe.remove());
      
      // Corriger les liens relatifs
      const links = doc.querySelectorAll('a[href]');
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('http') && !href.startsWith('//')) {
          try {
            const absoluteUrl = new URL(href, baseUrl).href;
            link.setAttribute('href', absoluteUrl);
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
          } catch (e) {
            // Ignorer les liens invalides
          }
        }
      });
      
      // Corriger les images relatives
      const images = doc.querySelectorAll('img[src]');
      images.forEach(img => {
        const src = img.getAttribute('src');
        if (src && !src.startsWith('http') && !src.startsWith('//')) {
          try {
            const absoluteUrl = new URL(src, baseUrl).href;
            img.setAttribute('src', absoluteUrl);
          } catch (e) {
            // Ignorer les images invalides
          }
        }
      });
      
      // Ajouter des styles pour l'intégration
      const style = doc.createElement('style');
      style.textContent = `
        body {
          margin: 0;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          background: #fff;
        }
        
        a {
          color: #007bff;
          text-decoration: none;
        }
        
        a:hover {
          text-decoration: underline;
        }
        
        img {
          max-width: 100%;
          height: auto;
        }
        
        .themalinks-proxy-notice {
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 4px;
          padding: 10px;
          margin-bottom: 20px;
          font-size: 14px;
          color: #6c757d;
        }
      `;
      doc.head.appendChild(style);
      
      // Ajouter un avis de proxy
      const notice = doc.createElement('div');
      notice.className = 'themalinks-proxy-notice';
      notice.innerHTML = `
        <strong>📡 Contenu chargé via proxy ThemaLinks</strong><br>
        Source originale: <a href="${baseUrl}" target="_blank" rel="noopener noreferrer">${baseUrl}</a>
      `;
      doc.body.insertBefore(notice, doc.body.firstChild);
      
      return doc.documentElement.outerHTML;
    } catch (error) {
      console.error('Erreur lors du nettoyage HTML:', error);
      return html; // Retourner le HTML original en cas d'erreur
    }
  }
}

// Instance globale du service proxy
export const proxyService = new ProxyService();

// Initialisation automatique
proxyService.findBestEndpoint().catch(console.error);
