import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useHistory = (user) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Clé pour le stockage local
  const getStorageKey = () => user ? `history_${user.id}` : 'history_guest';

  // Charger l'historique
  useEffect(() => {
    loadHistory();
  }, [user]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      if (user && supabase) {
        // Charger depuis Supabase si connecté
        const { data, error } = await supabase
          .from('user_history')
          .select('*')
          .eq('user_id', user.id)
          .order('visited_at', { ascending: false })
          .limit(100);
        
        if (!error && data) {
          setHistory(data.map(item => ({
            id: item.id,
            linkId: item.link_id,
            title: item.link_title,
            url: item.link_url,
            description: item.link_description,
            category: item.category,
            visitedAt: item.visited_at,
            visitCount: item.visit_count || 1
          })));
        } else {
          loadFromLocalStorage();
        }
      } else {
        loadFromLocalStorage();
      }
    } catch (error) {
      console.error('Erreur chargement historique:', error);
      loadFromLocalStorage();
    }
    setLoading(false);
  };

  const loadFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem(getStorageKey());
      if (stored) {
        const parsedHistory = JSON.parse(stored);
        // Trier par date de visite (plus récent en premier)
        parsedHistory.sort((a, b) => new Date(b.visitedAt) - new Date(a.visitedAt));
        setHistory(parsedHistory);
      }
    } catch (error) {
      console.error('Erreur localStorage historique:', error);
      setHistory([]);
    }
  };

  const saveToLocalStorage = (newHistory) => {
    try {
      // Garder seulement les 100 derniers éléments
      const limitedHistory = newHistory.slice(0, 100);
      localStorage.setItem(getStorageKey(), JSON.stringify(limitedHistory));
    } catch (error) {
      console.error('Erreur sauvegarde localStorage historique:', error);
    }
  };

  const addToHistory = async (link) => {
    try {
      const now = new Date().toISOString();
      
      // Vérifier si le lien existe déjà dans l'historique
      const existingIndex = history.findIndex(item => item.linkId === link.id);
      
      let newHistory;
      if (existingIndex !== -1) {
        // Mettre à jour l'entrée existante
        const updatedItem = {
          ...history[existingIndex],
          visitedAt: now,
          visitCount: (history[existingIndex].visitCount || 1) + 1
        };
        
        newHistory = [
          updatedItem,
          ...history.filter((_, index) => index !== existingIndex)
        ];
      } else {
        // Ajouter une nouvelle entrée
        const newItem = {
          id: `${link.id}_${Date.now()}`,
          linkId: link.id,
          title: link.title,
          url: link.url,
          description: link.description,
          category: link.category,
          visitedAt: now,
          visitCount: 1
        };
        
        newHistory = [newItem, ...history];
      }

      // Limiter à 100 éléments
      newHistory = newHistory.slice(0, 100);
      
      setHistory(newHistory);
      saveToLocalStorage(newHistory);

      // Sauvegarder dans Supabase si connecté
      if (user && supabase) {
        if (existingIndex !== -1) {
          // Mettre à jour l'entrée existante
          await supabase
            .from('user_history')
            .update({
              visited_at: now,
              visit_count: newHistory[0].visitCount
            })
            .eq('user_id', user.id)
            .eq('link_id', link.id);
        } else {
          // Insérer nouvelle entrée
          await supabase.from('user_history').insert({
            user_id: user.id,
            link_id: link.id,
            link_title: link.title,
            link_url: link.url,
            link_description: link.description,
            category: link.category,
            visited_at: now,
            visit_count: 1
          });
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Erreur ajout historique:', error);
      return { success: false, error };
    }
  };

  const removeFromHistory = async (itemId) => {
    try {
      const newHistory = history.filter(item => item.id !== itemId);
      setHistory(newHistory);
      saveToLocalStorage(newHistory);

      // Supprimer de Supabase si connecté
      if (user && supabase) {
        await supabase
          .from('user_history')
          .delete()
          .eq('id', itemId);
      }

      return { success: true };
    } catch (error) {
      console.error('Erreur suppression historique:', error);
      return { success: false, error };
    }
  };

  const clearHistory = async () => {
    try {
      setHistory([]);
      localStorage.removeItem(getStorageKey());

      // Supprimer de Supabase si connecté
      if (user && supabase) {
        await supabase
          .from('user_history')
          .delete()
          .eq('user_id', user.id);
      }

      return { success: true };
    } catch (error) {
      console.error('Erreur suppression historique:', error);
      return { success: false, error };
    }
  };

  const getHistoryByCategory = () => {
    const grouped = {};
    history.forEach(item => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    return grouped;
  };

  const getHistoryByDate = () => {
    const grouped = {};
    history.forEach(item => {
      const date = new Date(item.visitedAt).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(item);
    });
    return grouped;
  };

  const getMostVisited = (limit = 10) => {
    return [...history]
      .sort((a, b) => (b.visitCount || 1) - (a.visitCount || 1))
      .slice(0, limit);
  };

  const getRecentlyVisited = (limit = 10) => {
    return history.slice(0, limit);
  };

  const searchHistory = (query) => {
    const lowercaseQuery = query.toLowerCase();
    return history.filter(item =>
      item.title.toLowerCase().includes(lowercaseQuery) ||
      item.description.toLowerCase().includes(lowercaseQuery) ||
      item.url.toLowerCase().includes(lowercaseQuery)
    );
  };

  const getHistoryStats = () => {
    const totalVisits = history.reduce((sum, item) => sum + (item.visitCount || 1), 0);
    const uniqueLinks = new Set(history.map(item => item.linkId)).size;
    const categoriesVisited = new Set(history.map(item => item.category)).size;
    
    const categoryStats = {};
    history.forEach(item => {
      if (!categoryStats[item.category]) {
        categoryStats[item.category] = { count: 0, visits: 0 };
      }
      categoryStats[item.category].count++;
      categoryStats[item.category].visits += (item.visitCount || 1);
    });

    return {
      totalVisits,
      uniqueLinks,
      categoriesVisited,
      totalEntries: history.length,
      categoryStats,
      firstVisit: history.length > 0 ? history[history.length - 1].visitedAt : null,
      lastVisit: history.length > 0 ? history[0].visitedAt : null
    };
  };

  const exportHistory = () => {
    const stats = getHistoryStats();
    const exportData = {
      history,
      stats,
      exportedAt: new Date().toISOString(),
      user: user ? user.email : 'guest'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `themalinks-historique-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return {
    history,
    loading,
    addToHistory,
    removeFromHistory,
    clearHistory,
    getHistoryByCategory,
    getHistoryByDate,
    getMostVisited,
    getRecentlyVisited,
    searchHistory,
    getHistoryStats,
    exportHistory,
    refreshHistory: loadHistory
  };
};
