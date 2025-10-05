// Service de proxy côté client compatible navigateur
export class ClientProxyService {
  constructor() {
    this.proxyEndpoints = [
      {
        name: 'AllOrigins',
        url: 'https://api.allorigins.win/get?url=',
        format: (url) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
      },
      {
        name: 'CORS Anywhere (Public)',
        url: 'https://cors-anywhere.herokuapp.com/',
        format: (url) => `https://cors-anywhere.herokuapp.com/${url}`
      },
      {
        name: 'ThingProxy',
        url: 'https://thingproxy.freeboard.io/fetch/',
        format: (url) => `https://thingproxy.freeboard.io/fetch/${url}`
      }
    ];
    this.currentEndpointIndex = 0;
  }

  // Vérifier si l'URL nécessite un proxy
  needsProxy(url) {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();
      
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
        'wikipedia.org',
        'google.com',
        'amazon.com',
        'netflix.com',
        'discord.com',
        'slack.com'
      ];

      return blockedDomains.some(domain => 
        hostname === domain || hostname.endsWith('.' + domain)
      );
    } catch (error) {
      return false;
    }
  }

  // Générer l'URL proxy
  generateProxyUrl(targetUrl) {
    try {
      const url = new URL(targetUrl);
      
      if (this.needsProxy(targetUrl)) {
        const endpoint = this.proxyEndpoints[this.currentEndpointIndex];
        return endpoint.format(targetUrl);
      }
      
      return targetUrl;
    } catch (error) {
      console.error('URL invalide:', targetUrl);
      return null;
    }
  }

  // Basculer vers le prochain endpoint
  switchToNextEndpoint() {
    this.currentEndpointIndex = (this.currentEndpointIndex + 1) % this.proxyEndpoints.length;
    console.log(`Basculement vers ${this.proxyEndpoints[this.currentEndpointIndex].name}`);
  }

  // Test de connectivité d'un endpoint
  async testEndpoint(endpointIndex, testUrl = 'https://httpbin.org/get') {
    const originalIndex = this.currentEndpointIndex;
    this.currentEndpointIndex = endpointIndex;
    
    try {
      const proxyUrl = this.generateProxyUrl(testUrl);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(proxyUrl, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Accept': 'application/json, text/plain, */*'
        }
      });
      
      clearTimeout(timeoutId);
      this.currentEndpointIndex = originalIndex;
      return response.ok;
    } catch (error) {
      this.currentEndpointIndex = originalIndex;
      return false;
    }
  }

  // Trouver le meilleur endpoint disponible
  async findBestEndpoint() {
    console.log('🔍 Recherche du meilleur endpoint proxy...');
    
    for (let i = 0; i < this.proxyEndpoints.length; i++) {
      const isWorking = await this.testEndpoint(i);
      if (isWorking) {
        this.currentEndpointIndex = i;
        console.log(`✅ Endpoint trouvé: ${this.proxyEndpoints[i].name}`);
        return this.proxyEndpoints[i];
      }
    }
    
    console.warn('⚠️ Aucun endpoint proxy disponible');
    return null;
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

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), options.timeout || 15000);

        const response = await fetch(proxyUrl, {
          method: 'GET',
          signal: controller.signal,
          headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
            'User-Agent': 'Mozilla/5.0 (compatible; ThemaLinks/1.0)',
            ...options.headers
          }
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          let data;
          const contentType = response.headers.get('content-type') || '';
          
          if (contentType.includes('application/json')) {
            const json = await response.json();
            data = json.contents || json.data || json;
          } else {
            data = await response.text();
          }

          return {
            success: true,
            data: data,
            url: proxyUrl,
            originalUrl: url,
            endpoint: this.proxyEndpoints[this.currentEndpointIndex].name
          };
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        lastError = error;
        console.warn(`❌ Tentative ${attempt + 1} échouée (${this.proxyEndpoints[this.currentEndpointIndex].name}):`, error.message);
        
        if (attempt < maxRetries - 1) {
          this.switchToNextEndpoint();
          await new Promise(resolve => setTimeout(resolve, 1000));
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
      
      // Supprimer les éléments potentiellement dangereux
      const dangerousElements = doc.querySelectorAll('object, embed, applet, form');
      dangerousElements.forEach(element => element.remove());
      
      // Corriger les liens relatifs
      const links = doc.querySelectorAll('a[href]');
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('http') && !href.startsWith('//') && !href.startsWith('#')) {
          try {
            const absoluteUrl = new URL(href, baseUrl).href;
            link.setAttribute('href', absoluteUrl);
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
          } catch (e) {
            link.removeAttribute('href');
          }
        } else if (href && (href.startsWith('http') || href.startsWith('//'))) {
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
        }
      });
      
      // Corriger les images relatives
      const images = doc.querySelectorAll('img[src]');
      images.forEach(img => {
        const src = img.getAttribute('src');
        if (src && !src.startsWith('http') && !src.startsWith('//') && !src.startsWith('data:')) {
          try {
            const absoluteUrl = new URL(src, baseUrl).href;
            img.setAttribute('src', absoluteUrl);
          } catch (e) {
            img.removeAttribute('src');
          }
        }
      });
      
      // Corriger les CSS relatives
      const stylesheets = doc.querySelectorAll('link[rel="stylesheet"][href]');
      stylesheets.forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('http') && !href.startsWith('//')) {
          try {
            const absoluteUrl = new URL(href, baseUrl).href;
            link.setAttribute('href', absoluteUrl);
          } catch (e) {
            link.remove();
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
          overflow-x: hidden;
        }
        
        * {
          max-width: 100%;
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
          display: block;
        }
        
        .themalinks-proxy-notice {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 20px;
          font-size: 14px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .themalinks-proxy-notice a {
          color: #fff;
          text-decoration: underline;
        }
        
        .themalinks-proxy-notice strong {
          display: block;
          margin-bottom: 5px;
        }
      `;
      doc.head.appendChild(style);
      
      // Ajouter un avis de proxy
      const notice = doc.createElement('div');
      notice.className = 'themalinks-proxy-notice';
      notice.innerHTML = `
        <strong>🌐 Contenu chargé via ThemaLinks Proxy</strong>
        Source: <a href="${baseUrl}" target="_blank" rel="noopener noreferrer">${baseUrl}</a>
      `;
      
      if (doc.body.firstChild) {
        doc.body.insertBefore(notice, doc.body.firstChild);
      } else {
        doc.body.appendChild(notice);
      }
      
      return doc.documentElement.outerHTML;
    } catch (error) {
      console.error('Erreur lors du nettoyage HTML:', error);
      return `
        <html>
          <head>
            <title>Erreur de traitement</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .error { background: #fee; border: 1px solid #fcc; padding: 15px; border-radius: 5px; }
            </style>
          </head>
          <body>
            <div class="error">
              <h3>Erreur lors du traitement du contenu</h3>
              <p>Le contenu n'a pas pu être traité correctement.</p>
              <p><a href="${baseUrl}" target="_blank">Ouvrir la source originale</a></p>
            </div>
          </body>
        </html>
      `;
    }
  }
}

// Instance globale du service proxy
export const clientProxy = new ClientProxyService();

// Initialisation automatique
if (typeof window !== 'undefined') {
  clientProxy.findBestEndpoint().catch(console.error);
}
