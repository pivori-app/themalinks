import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useAnalytics = (user) => {
  const [analytics, setAnalytics] = useState({
    totalClicks: 0,
    uniqueLinks: 0,
    topCategories: [],
    topLinks: [],
    dailyStats: [],
    weeklyStats: [],
    monthlyStats: []
  });
  const [loading, setLoading] = useState(false);

  // Clé pour le stockage local
  const getStorageKey = () => user ? `analytics_${user.id}` : 'analytics_guest';

  useEffect(() => {
    loadAnalytics();
  }, [user]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      if (user && supabase) {
        await loadFromSupabase();
      } else {
        loadFromLocalStorage();
      }
    } catch (error) {
      console.error('Erreur chargement analytics:', error);
      loadFromLocalStorage();
    }
    setLoading(false);
  };

  const loadFromSupabase = async () => {
    try {
      // Charger les statistiques depuis Supabase
      const { data: clicksData } = await supabase
        .from('user_analytics')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (clicksData) {
        processAnalyticsData(clicksData);
      }
    } catch (error) {
      console.error('Erreur Supabase analytics:', error);
      loadFromLocalStorage();
    }
  };

  const loadFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem(getStorageKey());
      if (stored) {
        const data = JSON.parse(stored);
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Erreur localStorage analytics:', error);
    }
  };

  const saveToLocalStorage = (data) => {
    try {
      localStorage.setItem(getStorageKey(), JSON.stringify(data));
    } catch (error) {
      console.error('Erreur sauvegarde analytics:', error);
    }
  };

  const processAnalyticsData = (rawData) => {
    if (!rawData || rawData.length === 0) return;

    // Calculer les statistiques
    const totalClicks = rawData.length;
    const uniqueLinks = new Set(rawData.map(item => item.link_id)).size;

    // Top catégories
    const categoryCount = {};
    rawData.forEach(item => {
      categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
    });
    const topCategories = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([category, count]) => ({ category, count }));

    // Top liens
    const linkCount = {};
    rawData.forEach(item => {
      const key = `${item.link_id}_${item.link_title}`;
      if (!linkCount[key]) {
        linkCount[key] = {
          id: item.link_id,
          title: item.link_title,
          url: item.link_url,
          category: item.category,
          count: 0
        };
      }
      linkCount[key].count++;
    });
    const topLinks = Object.values(linkCount)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Statistiques par jour (7 derniers jours)
    const dailyStats = generateDailyStats(rawData, 7);
    
    // Statistiques par semaine (4 dernières semaines)
    const weeklyStats = generateWeeklyStats(rawData, 4);
    
    // Statistiques par mois (6 derniers mois)
    const monthlyStats = generateMonthlyStats(rawData, 6);

    const newAnalytics = {
      totalClicks,
      uniqueLinks,
      topCategories,
      topLinks,
      dailyStats,
      weeklyStats,
      monthlyStats,
      lastUpdated: new Date().toISOString()
    };

    setAnalytics(newAnalytics);
    saveToLocalStorage(newAnalytics);
  };

  const generateDailyStats = (data, days) => {
    const stats = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayClicks = data.filter(item => 
        item.created_at.startsWith(dateStr)
      ).length;
      
      stats.push({
        date: dateStr,
        clicks: dayClicks,
        label: i === 0 ? 'Aujourd\'hui' : i === 1 ? 'Hier' : date.toLocaleDateString('fr-FR', { weekday: 'short' })
      });
    }
    
    return stats;
  };

  const generateWeeklyStats = (data, weeks) => {
    const stats = [];
    const now = new Date();
    
    for (let i = weeks - 1; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - (weekStart.getDay() + 7 * i));
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      
      const weekClicks = data.filter(item => {
        const itemDate = new Date(item.created_at);
        return itemDate >= weekStart && itemDate <= weekEnd;
      }).length;
      
      stats.push({
        week: `${weekStart.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} - ${weekEnd.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}`,
        clicks: weekClicks,
        startDate: weekStart.toISOString(),
        endDate: weekEnd.toISOString()
      });
    }
    
    return stats;
  };

  const generateMonthlyStats = (data, months) => {
    const stats = [];
    const now = new Date();
    
    for (let i = months - 1; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
      
      const monthClicks = data.filter(item => {
        const itemDate = new Date(item.created_at);
        return itemDate.getFullYear() === month.getFullYear() && 
               itemDate.getMonth() === month.getMonth();
      }).length;
      
      stats.push({
        month: month.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
        clicks: monthClicks,
        date: month.toISOString()
      });
    }
    
    return stats;
  };

  const trackClick = async (link, category) => {
    try {
      const clickData = {
        link_id: link.id,
        link_title: link.title,
        link_url: link.url,
        category: category,
        created_at: new Date().toISOString(),
        user_agent: navigator.userAgent,
        referrer: document.referrer || 'direct'
      };

      // Sauvegarder dans Supabase si connecté
      if (user && supabase) {
        await supabase.from('user_analytics').insert({
          user_id: user.id,
          ...clickData
        });
      }

      // Mettre à jour les analytics locales
      const currentData = JSON.parse(localStorage.getItem(`raw_analytics_${user?.id || 'guest'}`) || '[]');
      currentData.push(clickData);
      
      // Garder seulement les 1000 derniers clics
      const limitedData = currentData.slice(-1000);
      localStorage.setItem(`raw_analytics_${user?.id || 'guest'}`, JSON.stringify(limitedData));
      
      // Reprocesser les analytics
      processAnalyticsData(limitedData);

      return { success: true };
    } catch (error) {
      console.error('Erreur tracking click:', error);
      return { success: false, error };
    }
  };

  const getClicksByTimeRange = (range) => {
    const now = new Date();
    let startDate;
    
    switch (range) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(0);
    }

    const rawData = JSON.parse(localStorage.getItem(`raw_analytics_${user?.id || 'guest'}`) || '[]');
    return rawData.filter(item => new Date(item.created_at) >= startDate);
  };

  const getEngagementMetrics = () => {
    const rawData = JSON.parse(localStorage.getItem(`raw_analytics_${user?.id || 'guest'}`) || '[]');
    
    if (rawData.length === 0) {
      return {
        averageClicksPerDay: 0,
        mostActiveHour: 'N/A',
        mostActiveDay: 'N/A',
        engagementScore: 0
      };
    }

    // Calculer la moyenne de clics par jour
    const dayGroups = {};
    rawData.forEach(item => {
      const day = item.created_at.split('T')[0];
      dayGroups[day] = (dayGroups[day] || 0) + 1;
    });
    const averageClicksPerDay = Object.values(dayGroups).reduce((a, b) => a + b, 0) / Object.keys(dayGroups).length;

    // Heure la plus active
    const hourGroups = {};
    rawData.forEach(item => {
      const hour = new Date(item.created_at).getHours();
      hourGroups[hour] = (hourGroups[hour] || 0) + 1;
    });
    const mostActiveHour = Object.entries(hourGroups).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

    // Jour le plus actif
    const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const dayOfWeekGroups = {};
    rawData.forEach(item => {
      const dayOfWeek = new Date(item.created_at).getDay();
      dayOfWeekGroups[dayOfWeek] = (dayOfWeekGroups[dayOfWeek] || 0) + 1;
    });
    const mostActiveDayIndex = Object.entries(dayOfWeekGroups).sort(([,a], [,b]) => b - a)[0]?.[0];
    const mostActiveDay = mostActiveDayIndex ? dayNames[mostActiveDayIndex] : 'N/A';

    // Score d'engagement (basé sur la régularité et la diversité)
    const uniqueDays = Object.keys(dayGroups).length;
    const uniqueCategories = new Set(rawData.map(item => item.category)).size;
    const engagementScore = Math.min(100, (uniqueDays * 2) + (uniqueCategories * 5) + (averageClicksPerDay * 3));

    return {
      averageClicksPerDay: Math.round(averageClicksPerDay * 100) / 100,
      mostActiveHour: mostActiveHour !== 'N/A' ? `${mostActiveHour}h` : 'N/A',
      mostActiveDay,
      engagementScore: Math.round(engagementScore)
    };
  };

  const exportAnalytics = () => {
    const rawData = JSON.parse(localStorage.getItem(`raw_analytics_${user?.id || 'guest'}`) || '[]');
    const engagement = getEngagementMetrics();
    
    const exportData = {
      analytics,
      engagement,
      rawData,
      exportedAt: new Date().toISOString(),
      user: user ? user.email : 'guest'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `themalinks-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearAnalytics = async () => {
    try {
      setAnalytics({
        totalClicks: 0,
        uniqueLinks: 0,
        topCategories: [],
        topLinks: [],
        dailyStats: [],
        weeklyStats: [],
        monthlyStats: []
      });

      localStorage.removeItem(getStorageKey());
      localStorage.removeItem(`raw_analytics_${user?.id || 'guest'}`);

      // Supprimer de Supabase si connecté
      if (user && supabase) {
        await supabase
          .from('user_analytics')
          .delete()
          .eq('user_id', user.id);
      }

      return { success: true };
    } catch (error) {
      console.error('Erreur suppression analytics:', error);
      return { success: false, error };
    }
  };

  return {
    analytics,
    loading,
    trackClick,
    getClicksByTimeRange,
    getEngagementMetrics,
    exportAnalytics,
    clearAnalytics,
    refreshAnalytics: loadAnalytics
  };
};
