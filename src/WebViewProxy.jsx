import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  RefreshCw, 
  ExternalLink, 
  AlertTriangle, 
  Loader2,
  Shield,
  Globe,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { clientProxy } from '../lib/clientProxy';

const WebViewProxy = ({ link, onBack, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [content, setContent] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [proxyMode, setProxyMode] = useState('auto'); // 'auto', 'direct', 'proxy'
  const [loadAttempts, setLoadAttempts] = useState(0);
  const iframeRef = useRef(null);
  const containerRef = useRef(null);

  // Détection automatique du mode d'intégration
  useEffect(() => {
    if (link) {
      detectIntegrationMode();
    }
  }, [link]);

  const detectIntegrationMode = async () => {
    setLoading(true);
    setError(null);
    setLoadAttempts(prev => prev + 1);

    try {
      const url = new URL(link.url);
      
      // Vérifier si le lien nécessite un proxy
      if (clientProxy.needsProxy(link.url)) {
        await loadViaProxy();
      } else {
        // Essayer d'abord le mode direct (iframe)
        const canEmbed = await testDirectEmbed(link.url);
        if (canEmbed) {
          setProxyMode('direct');
          setLoading(false);
          return;
        } else {
          // Fallback vers le mode proxy même pour les liens "sûrs"
          await loadViaProxy();
        }
      }
    } catch (err) {
      setError(`Erreur lors du chargement: ${err.message}`);
      setLoading(false);
    }
  };

  const testDirectEmbed = (url) => {
    return new Promise((resolve) => {
      const testFrame = document.createElement('iframe');
      testFrame.style.display = 'none';
      testFrame.src = url;
      
      const timeout = setTimeout(() => {
        document.body.removeChild(testFrame);
        resolve(false);
      }, 3000);

      testFrame.onload = () => {
        clearTimeout(timeout);
        try {
          // Test d'accès au contenu de l'iframe
          const doc = testFrame.contentDocument || testFrame.contentWindow.document;
          if (doc && doc.body) {
            document.body.removeChild(testFrame);
            resolve(true);
          } else {
            document.body.removeChild(testFrame);
            resolve(false);
          }
        } catch (e) {
          document.body.removeChild(testFrame);
          resolve(false);
        }
      };

      testFrame.onerror = () => {
        clearTimeout(timeout);
        document.body.removeChild(testFrame);
        resolve(false);
      };

      document.body.appendChild(testFrame);
    });
  };

  const loadViaProxy = async () => {
    try {
      setProxyMode('proxy');
      const result = await clientProxy.loadPageViaProxy(link.url);
      
      if (result.success) {
        const sanitizedHtml = clientProxy.sanitizeHtml(result.data, link.url);
        setContent(sanitizedHtml);
        setLoading(false);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(`Impossible de charger via proxy: ${err.message}`);
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setLoadAttempts(0);
    detectIntegrationMode();
  };

  const handleOpenExternal = () => {
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleIframeLoad = () => {
    if (proxyMode === 'direct') {
      setLoading(false);
    }
  };

  const handleIframeError = () => {
    if (proxyMode === 'direct' && loadAttempts < 2) {
      // Basculer vers le mode proxy en cas d'erreur
      setProxyMode('proxy');
      loadViaProxy();
    } else {
      setError('Impossible de charger le contenu');
      setLoading(false);
    }
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col ${
        isFullscreen ? 'p-0' : 'p-4'
      }`}
    >
      {/* Header avec contrôles */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white truncate max-w-xs">
                {link.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                {link.url}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Indicateur de mode */}
          <div className="flex items-center space-x-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs">
            {proxyMode === 'direct' ? (
              <>
                <Shield className="w-3 h-3 text-green-500" />
                <span className="text-gray-600 dark:text-gray-300">Direct</span>
              </>
            ) : (
              <>
                <Globe className="w-3 h-3 text-blue-500" />
                <span className="text-gray-600 dark:text-gray-300">Proxy</span>
              </>
            )}
          </div>

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
            title="Actualiser"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleOpenExternal}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Ouvrir dans un nouvel onglet"
          >
            <ExternalLink className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 relative overflow-hidden">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Chargement en cours...
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                Mode: {proxyMode === 'direct' ? 'Direct' : 'Proxy'} • Tentative {loadAttempts}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900">
            <div className="text-center max-w-md mx-auto p-6">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Erreur de chargement
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {error}
              </p>
              <div className="space-y-2">
                <button
                  onClick={handleRefresh}
                  className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Réessayer
                </button>
                <button
                  onClick={handleOpenExternal}
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
                >
                  Ouvrir dans un nouvel onglet
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Iframe pour mode direct */}
        {proxyMode === 'direct' && !error && (
          <iframe
            ref={iframeRef}
            src={link.url}
            className="w-full h-full border-0"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            title={link.title}
          />
        )}

        {/* Contenu HTML pour mode proxy */}
        {proxyMode === 'proxy' && content && !error && (
          <div className="w-full h-full overflow-auto">
            <div
              className="w-full h-full"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        )}
      </div>

      {/* Footer avec informations */}
      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <span>Catégorie: {link.category?.name || 'Non classé'}</span>
            <span>•</span>
            <span>Mode: {proxyMode === 'direct' ? 'Intégration directe' : 'Proxy sécurisé'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="w-3 h-3" />
            <span>Contenu sécurisé par ThemaLinks</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WebViewProxy;
