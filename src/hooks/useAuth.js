import { useState, useEffect } from 'react';
import { authService } from '../lib/supabase';

// Hook principal d'authentification
export const useAuth = () => {
  const [user, setUser] = useState(authService.user);
  const [session, setSession] = useState(authService.session);
  const [loading, setLoading] = useState(authService.loading);

  useEffect(() => {
    // S'abonner aux changements d'auth
    const unsubscribe = authService.addListener(({ user, session, loading }) => {
      setUser(user);
      setSession(session);
      setLoading(loading);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    return await authService.signInWithGoogle();
  };

  const signInWithMagicLink = async (email) => {
    return await authService.signInWithMagicLink(email);
  };

  const signOut = async () => {
    return await authService.signOut();
  };

  const updateProfile = async (updates) => {
    return await authService.updateProfile(updates);
  };

  return {
    user,
    session,
    loading,
    isAuthenticated: authService.isAuthenticated,
    userEmail: authService.userEmail,
    userName: authService.userName,
    userAvatar: authService.userAvatar,
    signInWithGoogle,
    signInWithMagicLink,
    signOut,
    updateProfile
  };
};

// Hook pour les favoris
export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Charger les favoris
  const loadFavorites = async () => {
    if (!user) {
      setFavorites([]);
      return;
    }

    setLoading(true);
    try {
      const result = await authService.getFavorites();
      if (result.success) {
        setFavorites(result.data.map(f => f.link_id));
      }
    } catch (error) {
      console.error('Erreur chargement favoris:', error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle favori
  const toggleFavorite = async (linkId) => {
    if (!user) {
      return { success: false, error: 'Connexion requise' };
    }

    try {
      const result = await authService.toggleFavorite(linkId);
      if (result.success) {
        if (result.action === 'added') {
          setFavorites(prev => [...prev, linkId]);
        } else {
          setFavorites(prev => prev.filter(id => id !== linkId));
        }
      }
      return result;
    } catch (error) {
      console.error('Erreur toggle favori:', error);
      return { success: false, error: error.message };
    }
  };

  // Vérifier si un lien est en favori
  const isFavorite = (linkId) => {
    return favorites.includes(linkId);
  };

  useEffect(() => {
    loadFavorites();
  }, [user]);

  return {
    favorites,
    loading,
    toggleFavorite,
    isFavorite,
    loadFavorites
  };
};

// Hook pour l'historique
export const useHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Charger l'historique
  const loadHistory = async (limit = 50) => {
    if (!user) {
      setHistory([]);
      return;
    }

    setLoading(true);
    try {
      const result = await authService.getHistory(limit);
      if (result.success) {
        setHistory(result.data);
      }
    } catch (error) {
      console.error('Erreur chargement historique:', error);
    } finally {
      setLoading(false);
    }
  };

  // Ajouter à l'historique
  const addToHistory = async (linkId, categoryId) => {
    try {
      await authService.saveToHistory(linkId, categoryId);
      // Recharger l'historique si l'utilisateur est connecté
      if (user) {
        loadHistory();
      }
    } catch (error) {
      console.error('Erreur ajout historique:', error);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [user]);

  return {
    history,
    loading,
    addToHistory,
    loadHistory
  };
};

// Hook pour les analytics utilisateur
export const useUserAnalytics = () => {
  const { user } = useAuth();

  const trackEvent = async (eventType, data = {}) => {
    if (!user) return;

    try {
      // Ici on pourrait envoyer vers Supabase ou un service d'analytics
      console.log('Analytics:', eventType, data);
    } catch (error) {
      console.error('Erreur analytics:', error);
    }
  };

  const trackLinkClick = async (linkId, categoryId, linkUrl) => {
    await trackEvent('link_click', {
      link_id: linkId,
      category_id: categoryId,
      link_url: linkUrl,
      timestamp: new Date().toISOString()
    });
  };

  const trackCategoryView = async (categoryId, categoryName) => {
    await trackEvent('category_view', {
      category_id: categoryId,
      category_name: categoryName,
      timestamp: new Date().toISOString()
    });
  };

  const trackSearch = async (query, resultsCount) => {
    await trackEvent('search', {
      query,
      results_count: resultsCount,
      timestamp: new Date().toISOString()
    });
  };

  return {
    trackEvent,
    trackLinkClick,
    trackCategoryView,
    trackSearch
  };
};
