// Utilitaire de vérification des liens morts
export class LinkChecker {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 heures
    this.maxConcurrent = 5;
    this.timeout = 10000; // 10 secondes
  }

  // Vérifier un seul lien
  async checkLink(url) {
    try {
      // Vérifier le cache
      const cached = this.getCachedResult(url);
      if (cached !== null) {
        return cached;
      }

      // Créer un contrôleur d'abort pour le timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      try {
        // Utiliser fetch avec mode 'no-cors' pour éviter les problèmes CORS
        const response = await fetch(url, {
          method: 'HEAD',
          mode: 'no-cors',
          signal: controller.signal,
          cache: 'no-cache'
        });

        clearTimeout(timeoutId);

        // En mode no-cors, on ne peut pas lire le status
        // On considère que si fetch ne lance pas d'erreur, le lien est accessible
        const result = {
          url,
          status: 'accessible',
          statusCode: 'unknown',
          responseTime: Date.now(),
          checkedAt: new Date().toISOString(),
          error: null
        };

        this.setCachedResult(url, result);
        return result;

      } catch (fetchError) {
        clearTimeout(timeoutId);
        
        // Si fetch échoue, essayer avec une requête GET simple
        try {
          const getResponse = await fetch(url, {
            method: 'GET',
            mode: 'no-cors',
            signal: controller.signal
          });

          const result = {
            url,
            status: 'accessible',
            statusCode: 'unknown',
            responseTime: Date.now(),
            checkedAt: new Date().toISOString(),
            error: null
          };

          this.setCachedResult(url, result);
          return result;

        } catch (getError) {
          const result = {
            url,
            status: 'inaccessible',
            statusCode: 'error',
            responseTime: null,
            checkedAt: new Date().toISOString(),
            error: getError.message
          };

          this.setCachedResult(url, result);
          return result;
        }
      }

    } catch (error) {
      const result = {
        url,
        status: 'error',
        statusCode: 'error',
        responseTime: null,
        checkedAt: new Date().toISOString(),
        error: error.message
      };

      this.setCachedResult(url, result);
      return result;
    }
  }

  // Vérifier plusieurs liens avec limitation de concurrence
  async checkLinks(urls, onProgress = null) {
    const results = [];
    const chunks = this.chunkArray(urls, this.maxConcurrent);
    let completed = 0;

    for (const chunk of chunks) {
      const chunkPromises = chunk.map(async (url) => {
        const result = await this.checkLink(url);
        completed++;
        
        if (onProgress) {
          onProgress({
            completed,
            total: urls.length,
            percentage: Math.round((completed / urls.length) * 100),
            currentUrl: url,
            result
          });
        }
        
        return result;
      });

      const chunkResults = await Promise.all(chunkPromises);
      results.push(...chunkResults);
    }

    return results;
  }

  // Vérifier tous les liens d'une catégorie
  async checkCategoryLinks(category, onProgress = null) {
    const urls = category.links.map(link => link.url);
    const results = await this.checkLinks(urls, onProgress);
    
    // Associer les résultats aux liens
    return category.links.map((link, index) => ({
      ...link,
      checkResult: results[index]
    }));
  }

  // Vérifier tous les liens de toutes les catégories
  async checkAllLinks(categories, onProgress = null) {
    const allLinks = [];
    categories.forEach(category => {
      category.links.forEach(link => {
        allLinks.push({
          ...link,
          category: category.name,
          categoryId: category.id
        });
      });
    });

    const urls = allLinks.map(link => link.url);
    const results = await this.checkLinks(urls, onProgress);

    // Organiser les résultats par catégorie
    const resultsByCategory = {};
    categories.forEach(category => {
      resultsByCategory[category.id] = {
        ...category,
        links: category.links.map(link => {
          const linkIndex = allLinks.findIndex(l => l.id === link.id);
          return {
            ...link,
            checkResult: results[linkIndex]
          };
        })
      };
    });

    return resultsByCategory;
  }

  // Obtenir les statistiques des vérifications
  getCheckStats(results) {
    const stats = {
      total: results.length,
      accessible: 0,
      inaccessible: 0,
      errors: 0,
      cached: 0,
      averageResponseTime: 0
    };

    let totalResponseTime = 0;
    let responseTimeCount = 0;

    results.forEach(result => {
      switch (result.status) {
        case 'accessible':
          stats.accessible++;
          break;
        case 'inaccessible':
          stats.inaccessible++;
          break;
        case 'error':
          stats.errors++;
          break;
      }

      if (result.responseTime) {
        totalResponseTime += result.responseTime;
        responseTimeCount++;
      }

      if (this.getCachedResult(result.url)) {
        stats.cached++;
      }
    });

    if (responseTimeCount > 0) {
      stats.averageResponseTime = Math.round(totalResponseTime / responseTimeCount);
    }

    stats.successRate = Math.round((stats.accessible / stats.total) * 100);

    return stats;
  }

  // Filtrer les liens par statut
  filterLinksByStatus(results, status) {
    return results.filter(result => result.checkResult?.status === status);
  }

  // Obtenir les liens les plus lents
  getSlowestLinks(results, limit = 10) {
    return results
      .filter(result => result.checkResult?.responseTime)
      .sort((a, b) => (b.checkResult.responseTime || 0) - (a.checkResult.responseTime || 0))
      .slice(0, limit);
  }

  // Exporter les résultats de vérification
  exportResults(results, filename = null) {
    const exportData = {
      checkedAt: new Date().toISOString(),
      stats: this.getCheckStats(results.map(r => r.checkResult)),
      results: results.map(result => ({
        id: result.id,
        title: result.title,
        url: result.url,
        category: result.category,
        status: result.checkResult?.status,
        statusCode: result.checkResult?.statusCode,
        responseTime: result.checkResult?.responseTime,
        error: result.checkResult?.error,
        checkedAt: result.checkResult?.checkedAt
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `themalinks-verification-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Gestion du cache
  getCachedResult(url) {
    const cached = this.cache.get(url);
    if (cached && (Date.now() - cached.timestamp) < this.cacheExpiry) {
      return cached.result;
    }
    return null;
  }

  setCachedResult(url, result) {
    this.cache.set(url, {
      result,
      timestamp: Date.now()
    });
  }

  clearCache() {
    this.cache.clear();
  }

  // Utilitaires
  chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  // Planifier une vérification automatique
  scheduleCheck(categories, intervalHours = 24) {
    const intervalMs = intervalHours * 60 * 60 * 1000;
    
    const runCheck = async () => {
      console.log('🔍 Vérification automatique des liens...');
      
      try {
        const results = await this.checkAllLinks(categories, (progress) => {
          console.log(`Progression: ${progress.percentage}% (${progress.completed}/${progress.total})`);
        });

        const stats = this.getCheckStats(
          Object.values(results).flatMap(cat => cat.links.map(link => link.checkResult))
        );

        console.log('📊 Statistiques de vérification:', stats);

        // Sauvegarder les résultats
        localStorage.setItem('themalinks_last_check', JSON.stringify({
          timestamp: new Date().toISOString(),
          stats,
          results
        }));

        // Notifier si des liens sont cassés
        if (stats.inaccessible > 0 || stats.errors > 0) {
          console.warn(`⚠️ ${stats.inaccessible + stats.errors} liens inaccessibles détectés`);
        }

      } catch (error) {
        console.error('Erreur lors de la vérification automatique:', error);
      }
    };

    // Première vérification immédiate
    setTimeout(runCheck, 5000); // 5 secondes après le démarrage

    // Vérifications périodiques
    return setInterval(runCheck, intervalMs);
  }
}

// Instance globale
export const linkChecker = new LinkChecker();

// Hook React pour utiliser le vérificateur de liens
export const useLinkChecker = () => {
  const [checking, setChecking] = useState(false);
  const [progress, setProgress] = useState(null);
  const [results, setResults] = useState(null);
  const [stats, setStats] = useState(null);

  const checkLinks = async (categories) => {
    setChecking(true);
    setProgress(null);
    setResults(null);
    setStats(null);

    try {
      const results = await linkChecker.checkAllLinks(categories, (progressData) => {
        setProgress(progressData);
      });

      const allResults = Object.values(results).flatMap(cat => 
        cat.links.map(link => ({ ...link, category: cat.name }))
      );

      const stats = linkChecker.getCheckStats(
        allResults.map(link => link.checkResult)
      );

      setResults(results);
      setStats(stats);

      return { results, stats };

    } catch (error) {
      console.error('Erreur vérification liens:', error);
      throw error;
    } finally {
      setChecking(false);
      setProgress(null);
    }
  };

  const getLastCheck = () => {
    try {
      const stored = localStorage.getItem('themalinks_last_check');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Erreur lecture dernière vérification:', error);
      return null;
    }
  };

  return {
    checking,
    progress,
    results,
    stats,
    checkLinks,
    getLastCheck,
    linkChecker
  };
};
