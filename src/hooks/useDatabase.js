import { useState, useEffect, useCallback } from 'react';
import { db } from '../lib/database';

// Hook personnalisé pour la gestion de la base de données
export function useDatabase() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialisation de la base de données
    const initDB = async () => {
      try {
        await db.init();
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    initDB();
  }, []);

  return { isLoading, error, db };
}

// Hook pour les catégories
export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await db.getCategories();
      if (error) throw error;
      setCategories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, isLoading, error, refetch: fetchCategories };
}

// Hook pour les liens
export function useLinks(categoryId = null) {
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLinks = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await db.getLinks(categoryId);
      if (error) throw error;
      setLinks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  return { links, isLoading, error, refetch: fetchLinks };
}

// Hook pour la recherche
export function useSearch() {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = useCallback(async (query) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await db.searchLinks(query);
      if (error) throw error;
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return { results, isLoading, error, search, clearResults };
}

// Hook pour les favoris
export function useFavorites(userId) {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFavorites = useCallback(async () => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await db.getFavorites(userId);
      if (error) throw error;
      setFavorites(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const addFavorite = useCallback(async (linkId) => {
    if (!userId) return;
    
    try {
      const { error } = await db.addToFavorites(userId, linkId);
      if (error) throw error;
      await fetchFavorites();
    } catch (err) {
      setError(err.message);
    }
  }, [userId, fetchFavorites]);

  const removeFavorite = useCallback(async (linkId) => {
    if (!userId) return;
    
    try {
      const { error } = await db.removeFromFavorites(userId, linkId);
      if (error) throw error;
      await fetchFavorites();
    } catch (err) {
      setError(err.message);
    }
  }, [userId, fetchFavorites]);

  const isFavorite = useCallback((linkId) => {
    return favorites.some(fav => fav.link_id === linkId);
  }, [favorites]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return { 
    favorites, 
    isLoading, 
    error, 
    addFavorite, 
    removeFavorite, 
    isFavorite,
    refetch: fetchFavorites 
  };
}

// Hook pour l'historique
export function useHistory(userId, limit = 20) {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = useCallback(async () => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await db.getHistory(userId, limit);
      if (error) throw error;
      setHistory(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [userId, limit]);

  const addToHistory = useCallback(async (linkId) => {
    if (!userId) return;
    
    try {
      const { error } = await db.addToHistory(userId, linkId);
      if (error) throw error;
      await fetchHistory();
    } catch (err) {
      setError(err.message);
    }
  }, [userId, fetchHistory]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { 
    history, 
    isLoading, 
    error, 
    addToHistory,
    refetch: fetchHistory 
  };
}

// Hook pour les analytics
export function useAnalytics() {
  const logEvent = useCallback(async (linkId, eventType, metadata = {}) => {
    try {
      await db.logAnalytics(linkId, eventType, {
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        ...metadata
      });
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement des analytics:', err);
    }
  }, []);

  const incrementClick = useCallback(async (linkId) => {
    try {
      await db.incrementClickCount(linkId);
      await logEvent(linkId, 'click');
    } catch (err) {
      console.error('Erreur lors de l\'incrémentation du compteur:', err);
    }
  }, [logEvent]);

  return { logEvent, incrementClick };
}
