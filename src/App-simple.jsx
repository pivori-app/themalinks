import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Home, Moon, Sun, Sparkles, User, LogIn, LogOut, Settings, Heart, History } from 'lucide-react';

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
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Données
import { categories, searchLinks } from './data/categories';

// Hooks simplifiés
import { useAuth } from './hooks/useAuth';

function App() {
  // États de base
  const [currentView, setCurrentView] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLink, setSelectedLink] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [show3D, setShow3D] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showBackOffice, setShowBackOffice] = useState(false);
  const [currentPage, setCurrentPage] = useState(null);

  // Hook d'authentification
  const { user, isAuthenticated, signInWithGoogle, signOut, loading } = useAuth();

  // Résultats de recherche
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    const results = [];
    
    categories.forEach(category => {
      category.links.forEach(link => {
        if (
          link.title.toLowerCase().includes(query) ||
          link.description.toLowerCase().includes(query) ||
          category.name.toLowerCase().includes(query)
        ) {
          results.push({
            ...link,
            category: category.name,
            categoryId: category.id
          });
        }
      });
    });
    
    return results.slice(0, 20);
  }, [searchQuery]);

  // Gestion du thème
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Navigation vers une catégorie
  const handleCategoryClick = (category) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    setSelectedCategory(category);
    setCurrentView('category');
    setSearchQuery('');
  };

  // Ouverture d'un lien
  const handleLinkOpen = async (link) => {
    try {
      // Ouvrir le lien
      if (link.integration_mode === 'webview') {
        setSelectedLink(link);
        setCurrentView('viewer');
      } else {
        window.open(link.url, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Erreur ouverture lien:', error);
    }
  };

  // Retour à l'accueil
  const goHome = () => {
    setCurrentView('home');
    setSelectedCategory(null);
    setSelectedLink(null);
    setSearchQuery('');
    setCurrentPage(null);
  };

  // Retour à la catégorie
  const goBack = () => {
    if (currentView === 'viewer') {
      setCurrentView('category');
      setSelectedLink(null);
    } else if (currentView === 'category') {
      setCurrentView('home');
      setSelectedCategory(null);
    } else if (currentView === 'page') {
      setCurrentView('home');
      setCurrentPage(null);
    }
  };

  // Gestion des pages
  const handlePageOpen = (page) => {
    setCurrentPage(page);
    setCurrentView('page');
  };

  // Gestion de l'authentification
  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setShowUserProfile(false);
    setShowBackOffice(false);
  };

  // Initialisation du thème
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Fond 3D */}
      {show3D && <Background3D />}
      
      {/* Header */}
      <header className="relative z-20 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Logo et titre */}
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ThemaLinks
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Bibliothèque de liens thématiques
                </p>
              </div>
            </motion.div>

            {/* Contrôles */}
            <div className="flex items-center space-x-4">
              {/* Bouton Home */}
              {currentView !== 'home' && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={goHome}
                  className="p-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white hover:bg-white/20 transition-colors"
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
                className={`p-3 backdrop-blur-sm rounded-full border transition-colors ${
                  show3D 
                    ? 'bg-blue-500/20 border-blue-400/30 text-blue-400' 
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                }`}
                title={show3D ? 'Désactiver 3D' : 'Activer 3D'}
              >
                <Sparkles size={20} />
              </motion.button>

              {/* Toggle thème */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="p-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white hover:bg-white/20 transition-colors"
                title={isDarkMode ? 'Mode clair' : 'Mode sombre'}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </motion.button>

              {/* Authentification */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowUserProfile(true)}
                    className="p-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white hover:bg-white/20 transition-colors"
                    title="Profil"
                  >
                    <User size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowBackOffice(true)}
                    className="p-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white hover:bg-white/20 transition-colors"
                    title="Dashboard"
                  >
                    <Settings size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSignOut}
                    className="p-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white hover:bg-white/20 transition-colors"
                    title="Déconnexion"
                  >
                    <LogOut size={20} />
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowAuthModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                >
                  <LogIn size={18} />
                  <span>Connexion</span>
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="relative z-10 px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {/* Vue Accueil */}
            {currentView === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Barre de recherche */}
                <div className="mb-12">
                  <SearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    searchResults={searchResults}
                    onLinkClick={handleLinkOpen}
                  />
                </div>

                {/* Grille des catégories */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {categories.map((category, index) => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      index={index}
                      onClick={() => handleCategoryClick(category)}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Vue Catégorie */}
            {currentView === 'category' && selectedCategory && (
              <motion.div
                key="category"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Header de catégorie */}
                <div className="mb-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={goBack}
                    className="mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white hover:bg-white/20 transition-colors flex items-center space-x-2"
                  >
                    <Home size={16} />
                    <span>Retour</span>
                  </motion.button>

                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl ${selectedCategory.gradient}`}>
                      {selectedCategory.icon}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">
                        {selectedCategory.name}
                      </h2>
                      <p className="text-white/70">
                        {selectedCategory.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Liste des liens */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedCategory.links.map((link, index) => (
                    <LinkCard
                      key={link.id}
                      link={link}
                      index={index}
                      onClick={() => handleLinkOpen(link)}
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
                className="fixed inset-0 z-50 bg-black"
              >
                <WebViewProxy
                  link={selectedLink}
                  onClose={goBack}
                />
              </motion.div>
            )}

            {/* Vue Page */}
            {currentView === 'page' && currentPage && (
              <motion.div
                key="page"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={goBack}
                  className="mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white hover:bg-white/20 transition-colors flex items-center space-x-2"
                >
                  <Home size={16} />
                  <span>Retour</span>
                </motion.button>

                <LegalPages page={currentPage} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <Footer onPageOpen={handlePageOpen} />

      {/* Modales */}
      <AnimatePresence>
        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            onSuccess={handleAuthSuccess}
          />
        )}

        {showUserProfile && (
          <UserProfile
            onClose={() => setShowUserProfile(false)}
            onBackOffice={() => {
              setShowUserProfile(false);
              setShowBackOffice(true);
            }}
          />
        )}

        {showBackOffice && (
          <BackOffice
            onClose={() => setShowBackOffice(false)}
          />
        )}
      </AnimatePresence>

      {/* Bouton remonter */}
      <ScrollToTop />
    </div>
  );
}

export default App;
