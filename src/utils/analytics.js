// Google Analytics 4 Integration pour ThemaLinks
class GoogleAnalytics {
  constructor() {
    this.measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    this.isEnabled = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
    this.isDebug = import.meta.env.VITE_DEBUG_MODE === 'true';
    this.initialized = false;
    
    if (this.isEnabled && this.measurementId && this.measurementId !== 'G-XXXXXXXXXX') {
      this.initialize();
    } else {
      console.warn('📊 Google Analytics non configuré - Mode développement');
    }
  }

  // Initialisation de Google Analytics
  async initialize() {
    try {
      // Charger le script Google Analytics
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
      document.head.appendChild(script);

      // Attendre le chargement du script
      await new Promise((resolve) => {
        script.onload = resolve;
      });

      // Initialiser gtag
      window.dataLayer = window.dataLayer || [];
      window.gtag = function() {
        window.dataLayer.push(arguments);
      };

      // Configuration initiale
      window.gtag('js', new Date());
      window.gtag('config', this.measurementId, {
        // Configuration de base
        page_title: document.title,
        page_location: window.location.href,
        
        // Configuration de la vie privée
        anonymize_ip: true,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        
        // Configuration des cookies
        cookie_flags: 'SameSite=Lax;Secure',
        cookie_expires: 60 * 60 * 24 * 30, // 30 jours
        
        // Configuration du debug
        debug_mode: this.isDebug,
        
        // Configuration personnalisée
        custom_map: {
          'custom_parameter_1': 'user_type',
          'custom_parameter_2': 'app_version'
        }
      });

      this.initialized = true;
      
      if (this.isDebug) {
        console.log('📊 Google Analytics initialisé:', this.measurementId);
      }

      // Envoyer l'événement d'initialisation
      this.trackEvent('app_initialized', {
        app_name: 'ThemaLinks',
        app_version: import.meta.env.VITE_APP_VERSION || '1.0.0',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Erreur initialisation Google Analytics:', error);
    }
  }

  // Vérifier si Analytics est disponible
  isAvailable() {
    return this.initialized && typeof window.gtag === 'function';
  }

  // Suivre une page vue
  trackPageView(pagePath, pageTitle) {
    if (!this.isAvailable()) return;

    try {
      window.gtag('config', this.measurementId, {
        page_path: pagePath || window.location.pathname,
        page_title: pageTitle || document.title,
        page_location: window.location.href
      });

      if (this.isDebug) {
        console.log('📊 Page vue trackée:', pagePath || window.location.pathname);
      }
    } catch (error) {
      console.error('Erreur tracking page vue:', error);
    }
  }

  // Suivre un événement personnalisé
  trackEvent(eventName, parameters = {}) {
    if (!this.isAvailable()) return;

    try {
      // Ajouter des métadonnées par défaut
      const enrichedParameters = {
        ...parameters,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        screen_resolution: `${screen.width}x${screen.height}`,
        viewport_size: `${window.innerWidth}x${window.innerHeight}`,
        connection_type: navigator.connection?.effectiveType || 'unknown'
      };

      window.gtag('event', eventName, enrichedParameters);

      if (this.isDebug) {
        console.log('📊 Événement tracké:', eventName, enrichedParameters);
      }
    } catch (error) {
      console.error('Erreur tracking événement:', error);
    }
  }

  // Événements spécifiques à ThemaLinks
  
  // Suivi des clics sur les liens
  trackLinkClick(link, category) {
    this.trackEvent('link_click', {
      event_category: 'engagement',
      event_label: link.title,
      link_id: link.id,
      link_url: link.url,
      link_category: category,
      integration_mode: link.integration_mode || 'redirect',
      value: 1
    });
  }

  // Suivi de l'ouverture des catégories
  trackCategoryView(category) {
    this.trackEvent('category_view', {
      event_category: 'navigation',
      event_label: category.name,
      category_id: category.id,
      category_links_count: category.links?.length || 0,
      value: 1
    });
  }

  // Suivi des recherches
  trackSearch(query, resultsCount) {
    this.trackEvent('search', {
      event_category: 'engagement',
      search_term: query,
      results_count: resultsCount,
      value: resultsCount > 0 ? 1 : 0
    });
  }

  // Suivi de l'authentification
  trackAuth(action, method) {
    this.trackEvent('auth_action', {
      event_category: 'user',
      event_label: action, // 'login', 'logout', 'signup'
      auth_method: method, // 'google', 'magic_link'
      value: 1
    });
  }

  // Suivi des favoris
  trackFavorite(action, link) {
    this.trackEvent('favorite_action', {
      event_category: 'engagement',
      event_label: action, // 'add', 'remove'
      link_id: link.id,
      link_title: link.title,
      link_category: link.category,
      value: action === 'add' ? 1 : -1
    });
  }

  // Suivi des erreurs
  trackError(error, context) {
    this.trackEvent('app_error', {
      event_category: 'error',
      error_message: error.message || error,
      error_context: context,
      error_stack: error.stack || 'N/A',
      fatal: false
    });
  }

  // Suivi des performances
  trackPerformance(metric, value, context) {
    this.trackEvent('performance_metric', {
      event_category: 'performance',
      metric_name: metric,
      metric_value: value,
      metric_context: context,
      value: Math.round(value)
    });
  }

  // Suivi de l'engagement utilisateur
  trackEngagement(action, duration) {
    this.trackEvent('user_engagement', {
      event_category: 'engagement',
      engagement_action: action,
      engagement_duration: duration,
      value: Math.round(duration / 1000) // en secondes
    });
  }

  // Suivi des fonctionnalités
  trackFeatureUsage(feature, action) {
    this.trackEvent('feature_usage', {
      event_category: 'feature',
      feature_name: feature,
      feature_action: action,
      value: 1
    });
  }

  // Configuration des propriétés utilisateur
  setUserProperties(properties) {
    if (!this.isAvailable()) return;

    try {
      window.gtag('config', this.measurementId, {
        user_properties: properties
      });

      if (this.isDebug) {
        console.log('📊 Propriétés utilisateur définies:', properties);
      }
    } catch (error) {
      console.error('Erreur définition propriétés utilisateur:', error);
    }
  }

  // Définir l'ID utilisateur
  setUserId(userId) {
    if (!this.isAvailable()) return;

    try {
      window.gtag('config', this.measurementId, {
        user_id: userId
      });

      if (this.isDebug) {
        console.log('📊 ID utilisateur défini:', userId);
      }
    } catch (error) {
      console.error('Erreur définition ID utilisateur:', error);
    }
  }

  // Consentement RGPD
  setConsentMode(consentSettings) {
    if (!this.isAvailable()) return;

    try {
      window.gtag('consent', 'update', {
        analytics_storage: consentSettings.analytics ? 'granted' : 'denied',
        ad_storage: consentSettings.advertising ? 'granted' : 'denied',
        ad_user_data: consentSettings.adUserData ? 'granted' : 'denied',
        ad_personalization: consentSettings.adPersonalization ? 'granted' : 'denied'
      });

      if (this.isDebug) {
        console.log('📊 Consentement mis à jour:', consentSettings);
      }
    } catch (error) {
      console.error('Erreur mise à jour consentement:', error);
    }
  }

  // Désactiver le tracking
  disable() {
    if (typeof window !== 'undefined') {
      window[`ga-disable-${this.measurementId}`] = true;
      
      if (this.isDebug) {
        console.log('📊 Google Analytics désactivé');
      }
    }
  }

  // Réactiver le tracking
  enable() {
    if (typeof window !== 'undefined') {
      window[`ga-disable-${this.measurementId}`] = false;
      
      if (this.isDebug) {
        console.log('📊 Google Analytics réactivé');
      }
    }
  }
}

// Instance globale
export const analytics = new GoogleAnalytics();

// Hook React pour utiliser Analytics
export const useAnalytics = () => {
  const trackPageView = (pagePath, pageTitle) => {
    analytics.trackPageView(pagePath, pageTitle);
  };

  const trackEvent = (eventName, parameters) => {
    analytics.trackEvent(eventName, parameters);
  };

  const trackLinkClick = (link, category) => {
    analytics.trackLinkClick(link, category);
  };

  const trackCategoryView = (category) => {
    analytics.trackCategoryView(category);
  };

  const trackSearch = (query, resultsCount) => {
    analytics.trackSearch(query, resultsCount);
  };

  const trackAuth = (action, method) => {
    analytics.trackAuth(action, method);
  };

  const trackFavorite = (action, link) => {
    analytics.trackFavorite(action, link);
  };

  const trackError = (error, context) => {
    analytics.trackError(error, context);
  };

  const trackFeatureUsage = (feature, action) => {
    analytics.trackFeatureUsage(feature, action);
  };

  return {
    trackPageView,
    trackEvent,
    trackLinkClick,
    trackCategoryView,
    trackSearch,
    trackAuth,
    trackFavorite,
    trackError,
    trackFeatureUsage,
    setUserProperties: analytics.setUserProperties.bind(analytics),
    setUserId: analytics.setUserId.bind(analytics),
    setConsentMode: analytics.setConsentMode.bind(analytics)
  };
};

// Export par défaut
export default analytics;
