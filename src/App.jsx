import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Moon, Sun, Sparkles, Home, User, LogIn, BarChart3 } from 'lucide-react';
import './App.css';

// Composants
import Background3D from './components/Background3D';
import CategoryCard from './components/CategoryCard';
import LinkCard from './components/LinkCard';
import SearchBar from './components/SearchBar';
import WebViewProxy from './components/WebViewProxy';
import AuthModal from './components/AuthModal';
import UserProfile from './components/UserProfile';
import BackOffice from './components/BackOffice';
import LegalPages from './components/LegalPages';
import ScrollToTop from './components/ScrollToTop';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';

// Données
import { categories, searchLinks } from './data/categories';

// Hooks et services
import { useAuth } from './hooks/useAuth';
import { useFavorites } from './hooks/useFavorites';
import { useHistory } from './hooks/useHistory';
import { useAnalytics } from './hooks/useAnalytics';
import { useLinkChecker } from './utils/linkChecker';
import { useNotifications } from './utils/notifications';
import { useAnalytics as useGoogleAnalytics } from './utils/analytics';

function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home', 'category', 'viewer', 'page'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLink, setSelectedLink] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [show3D, setShow3D] = useState(true);
  
  // États pour les nouvelles fonctionnalités
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showBackOffice, setShowBackOffice] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [currentPage, setCurrentPage] = useState(null);

  // Hooks d'authentification et données
  const { user, isAuthenticated, signIn, signOut, loading } = useAuth();
  const { favorites, addToFavorites, removeFromFavorites, getFavorites } = useFavorites();
  const { history, addToHistory, getHistory, clearHistory } = useHistory();
  const { trackClick, getAnalytics, getTopLinks } = useAnalytics();
  
  // Hooks utilitaires
  const { 
    checkLinks,
    getLastCheck 
  } = useLinkChecker();
  
  const { 
    permission, 
    isSupported, 
    requestPermission,
    notifyNewLinks,
    notifyFavoriteUpdate 
  } = useNotifications();

  // Google Analytics
  const {
    trackPageView,
    trackLinkClick: trackGALinkClick,
    trackCategoryView,
    trackSearch: trackGASearch,
    trackAuth,
    trackFeatureUsage
  } = useGoogleAnalytics();

  // Résultats de recherche
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchLinks(searchQuery);
  }, [searchQuery]);

  // Gestionnaire pour ouvrir les pages légales
  const handlePageOpen = (page) => {
    setCurrentPage(page);
    setCurrentView('page');
  };

  // Gestion du thème
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
    trackFeatureUsage('theme_toggle', isDarkMode ? 'light' : 'dark');
  };

  // Navigation vers une catégorie
  const handleCategoryClick = (category) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      trackFeatureUsage('auth_required', 'category_access');
      return;
    }
    
    // Tracking Google Analytics
    trackCategoryView(category);
    trackFeatureUsage('category_navigation', 'open');
    
    setSelectedCategory(category);
    setCurrentView('category');
    setSearchQuery('');
  };

  // Ouverture d'un lien
  const handleLinkOpen = async (link) => {
    try {
      const categoryName = selectedCategory?.name || 'Recherche';
      
      // Ajouter à l'historique
      await addToHistory({
        ...link,
        category: categoryName
      });

      // Tracker le clic pour les analytics internes
      await trackClick(link, categoryName);

      // Tracker le clic pour Google Analytics
      trackGALinkClick(link, categoryName);

      // Ouvrir le lien
      if (link.integration_mode === 'webview') {
        setSelectedLink(link);
        setCurrentView('viewer');
        trackFeatureUsage('webview', 'open');
      } else {
        // Redirection externe
        window.open(link.url, '_blank', 'noopener,noreferrer');
        trackFeatureUsage('external_link', 'open');
      }
    } catch (error) {
      console.error('Erreur ouverture lien:', error);
      trackFeatureUsage('link_error', 'open_failed');
    }
  };

  // Retour à l'accueil
  const goHome = () => {
    setCurrentView('home');
    setSelectedCategory(null);
    setSelectedLink(null);
    setSearchQuery('');
    setCurrentPage(null);
    trackFeatureUsage('navigation', 'home');
  };

  // Retour à la catégorie
  const goBack = () => {
    if (currentView === 'viewer') {
      setCurrentView('category');
      setSelectedLink(null);
    } else if (currentView === 'category') {
      goHome();
    } else if (currentView === 'page') {
      goHome();
    }
  };

  // Initialisation du thème
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'dark' : ''}`}>
      {/* Arrière-plan 3D */}
      {show3D && <Background3D />}
      
      {/* Header */}
      <header className="relative z-20 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo et titre */}
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {currentView !== 'home' && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={goBack}
                className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors text-white"
              >
                <ArrowLeft size={20} />
              </motion.button>
            )}
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles size={18} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">ThemaLinks</h1>
            </div>
          </motion.div>

          {/* Contrôles */}
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Bouton Dashboard */}
            {isAuthenticated && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowDashboard(true)}
                className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors text-white"
                title="Dashboard"
              >
                <BarChart3 size={20} />
              </motion.button>
            )}

            {/* Bouton Home */}
            {currentView !== 'home' && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={goHome}
                className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors text-white"
                title="Accueil"
              >
                <Home size={20} />
              </motion.button>
            )}

            {/* Toggle 3D */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShow3D(!show3D)}
              className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors text-white"
              title="Toggle 3D Background"
            >
              <Sparkles size={20} className={show3D ? 'text-yellow-400' : 'text-white'} />
            </motion.button>

            {/* Toggle thème */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors text-white"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>

            {/* Bouton utilisateur */}
            {isAuthenticated ? (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowUserProfile(true)}
                className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors text-white"
              >
                <User size={20} />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowAuthModal(true)}
                className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors text-white"
              >
                <LogIn size={20} />
              </motion.button>
            )}
          </motion.div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="relative z-10 px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {/* Vue accueil */}
            {currentView === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {/* Hero Section */}
                <div className="text-center mb-16">
                  <motion.h2 
                    className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                  >
                    Découvrez le Web
                  </motion.h2>
                  <motion.p 
                    className="text-xl text-white/80 mb-8 max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                  >
                    Une collection organisée de liens thématiques pour explorer le meilleur du web
                  </motion.p>
                  
                  {/* Barre de recherche */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.6 }}
                  >
                    <SearchBar 
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      onSearch={(query) => trackGASearch(query, searchResults.length)}
                    />
                  </motion.div>
                </div>

                {/* Résultats de recherche */}
                {searchQuery && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16"
                  >
                    <h3 className="text-2xl font-bold text-white mb-6">
                      Résultats de recherche ({searchResults.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {searchResults.map((link, index) => (
                        <LinkCard
                          key={link.id}
                          link={link}
                          index={index}
                          onOpen={handleLinkOpen}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Grille des catégories */}
                {!searchQuery && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.8 }}
                  >
                    <h3 className="text-3xl font-bold text-white mb-8 text-center">
                      Explorez par catégorie
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {categories.map((category, index) => (
                        <CategoryCard
                          key={category.id}
                          category={category}
                          index={index}
                          onClick={handleCategoryClick}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Vue catégorie */}
            {currentView === 'category' && selectedCategory && (
              <motion.div
                key="category"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Header de la catégorie */}
                <div className="text-center mb-12">
                  <motion.h2 
                    className={`text-4xl font-bold mb-4 bg-gradient-to-r ${selectedCategory.gradient} bg-clip-text text-transparent`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {selectedCategory.name}
                  </motion.h2>
                  <motion.p 
                    className="text-xl text-white/80 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    {selectedCategory.description}
                  </motion.p>
                  <motion.div
                    className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <span className="text-sm font-medium text-white">
                      {selectedCategory.links.length} liens disponibles
                    </span>
                  </motion.div>
                </div>

                {/* Liste des liens */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedCategory.links.map((link, index) => (
                    <LinkCard
                      key={link.id}
                      link={link}
                      index={index}
                      onOpen={handleLinkOpen}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Vue WebView */}
            {currentView === 'viewer' && selectedLink && (
              <motion.div
                key="viewer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="h-[80vh]"
              >
                <WebViewProxy
                  link={selectedLink}
                  onBack={goBack}
                />
              </motion.div>
            )}

            {/* Vue pages légales */}
            {currentView === 'page' && currentPage && (
              <motion.div
                key="page"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <LegalPages
                  page={currentPage}
                  onBack={goBack}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <Footer onPageOpen={handlePageOpen} />

      {/* Modales */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false);
            trackAuth('login', 'modal');
          }}
        />
      )}

      {showUserProfile && (
        <UserProfile
          user={user}
          onClose={() => setShowUserProfile(false)}
          onBackOffice={() => {
            setShowUserProfile(false);
            setShowBackOffice(true);
          }}
          onSignOut={() => {
            signOut();
            setShowUserProfile(false);
            trackAuth('logout', 'profile');
          }}
        />
      )}

      {showBackOffice && (
        <BackOffice
          user={user}
          favorites={favorites}
          history={history}
          onClose={() => setShowBackOffice(false)}
          onBack={() => {
            setShowBackOffice(false);
            setShowUserProfile(true);
          }}
        />
      )}

      {showDashboard && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card/90 backdrop-blur-sm border border-border/50 rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <button
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
              onClick={() => setShowDashboard(false)}
            >
              ✕
            </button>
            <Dashboard
              user={user}
              favorites={favorites}
              history={history}
              analytics={getAnalytics()}
              onClose={() => setShowDashboard(false)}
            />
          </div>
        </div>
      )}

      {/* Bouton remonter */}
      <ScrollToTop />
    </div>
  );
}

export default App;
