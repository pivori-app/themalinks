import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useFavorites = (user) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  // Clé pour le stockage local
  const getStorageKey = () => user ? `favorites_${user.id}` : 'favorites_guest';

  // Charger les favoris
  useEffect(() => {
    loadFavorites();
  }, [user]);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      if (user && supabase) {
        // Charger depuis Supabase si connecté
        const { data, error } = await supabase
          .from('user_favorites')
          .select('*')
          .eq('user_id', user.id);
        
        if (!error && data) {
          setFavorites(data.map(fav => ({
            id: fav.link_id,
            title: fav.link_title,
            url: fav.link_url,
            description: fav.link_description,
            category: fav.category,
            addedAt: fav.created_at
          })));
        } else {
          // Fallback vers localStorage
          loadFromLocalStorage();
        }
      } else {
        // Mode invité - localStorage uniquement
        loadFromLocalStorage();
      }
    } catch (error) {
      console.error('Erreur chargement favoris:', error);
      loadFromLocalStorage();
    }
    setLoading(false);
  };

  const loadFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem(getStorageKey());
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Erreur localStorage:', error);
      setFavorites([]);
    }
  };

  const saveToLocalStorage = (newFavorites) => {
    try {
      localStorage.setItem(getStorageKey(), JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Erreur sauvegarde localStorage:', error);
    }
  };

  const addToFavorites = async (link) => {
    try {
      const newFavorite = {
        id: link.id,
        title: link.title,
        url: link.url,
        description: link.description,
        category: link.category,
        addedAt: new Date().toISOString()
      };

      const newFavorites = [...favorites, newFavorite];
      setFavorites(newFavorites);
      saveToLocalStorage(newFavorites);

      // Sauvegarder dans Supabase si connecté
      if (user && supabase) {
        await supabase.from('user_favorites').insert({
          user_id: user.id,
          link_id: link.id,
          link_title: link.title,
          link_url: link.url,
          link_description: link.description,
          category: link.category
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Erreur ajout favori:', error);
      return { success: false, error };
    }
  };

  const removeFromFavorites = async (linkId) => {
    try {
      const newFavorites = favorites.filter(fav => fav.id !== linkId);
      setFavorites(newFavorites);
      saveToLocalStorage(newFavorites);

      // Supprimer de Supabase si connecté
      if (user && supabase) {
        await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('link_id', linkId);
      }

      return { success: true };
    } catch (error) {
      console.error('Erreur suppression favori:', error);
      return { success: false, error };
    }
  };

  const isFavorite = (linkId) => {
    return favorites.some(fav => fav.id === linkId);
  };

  const toggleFavorite = async (link) => {
    if (isFavorite(link.id)) {
      return await removeFromFavorites(link.id);
    } else {
      return await addToFavorites(link);
    }
  };

  const clearAllFavorites = async () => {
    try {
      setFavorites([]);
      localStorage.removeItem(getStorageKey());

      // Supprimer de Supabase si connecté
      if (user && supabase) {
        await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id);
      }

      return { success: true };
    } catch (error) {
      console.error('Erreur suppression tous favoris:', error);
      return { success: false, error };
    }
  };

  const getFavoritesByCategory = () => {
    const grouped = {};
    favorites.forEach(fav => {
      if (!grouped[fav.category]) {
        grouped[fav.category] = [];
      }
      grouped[fav.category].push(fav);
    });
    return grouped;
  };

  const exportFavorites = () => {
    const exportData = {
      favorites,
      exportedAt: new Date().toISOString(),
      totalCount: favorites.length,
      user: user ? user.email : 'guest'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `themalinks-favoris-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importFavorites = async (file) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (data.favorites && Array.isArray(data.favorites)) {
        // Fusionner avec les favoris existants (éviter les doublons)
        const existingIds = new Set(favorites.map(fav => fav.id));
        const newFavorites = data.favorites.filter(fav => !existingIds.has(fav.id));
        
        const mergedFavorites = [...favorites, ...newFavorites];
        setFavorites(mergedFavorites);
        saveToLocalStorage(mergedFavorites);

        // Sauvegarder dans Supabase si connecté
        if (user && supabase && newFavorites.length > 0) {
          const supabaseData = newFavorites.map(fav => ({
            user_id: user.id,
            link_id: fav.id,
            link_title: fav.title,
            link_url: fav.url,
            link_description: fav.description,
            category: fav.category
          }));
          
          await supabase.from('user_favorites').insert(supabaseData);
        }

        return { success: true, imported: newFavorites.length };
      } else {
        throw new Error('Format de fichier invalide');
      }
    } catch (error) {
      console.error('Erreur import favoris:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    clearAllFavorites,
    getFavoritesByCategory,
    exportFavorites,
    importFavorites,
    refreshFavorites: loadFavorites
  };
};
