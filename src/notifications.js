// Système de notifications push pour ThemaLinks
export class NotificationManager {
  constructor() {
    this.permission = 'default';
    this.registration = null;
    this.isSupported = 'serviceWorker' in navigator && 'PushManager' in window;
    this.init();
  }

  async init() {
    if (!this.isSupported) {
      console.warn('Les notifications push ne sont pas supportées par ce navigateur');
      return;
    }

    // Vérifier la permission actuelle
    this.permission = Notification.permission;

    // Enregistrer le service worker si pas déjà fait
    try {
      this.registration = await navigator.serviceWorker.getRegistration();
      if (!this.registration) {
        this.registration = await navigator.serviceWorker.register('/sw.js');
      }
    } catch (error) {
      console.error('Erreur enregistrement service worker:', error);
    }
  }

  // Demander la permission pour les notifications
  async requestPermission() {
    if (!this.isSupported) {
      return { success: false, error: 'Notifications non supportées' };
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;

      if (permission === 'granted') {
        return { success: true, permission };
      } else {
        return { success: false, error: 'Permission refusée', permission };
      }
    } catch (error) {
      console.error('Erreur demande permission:', error);
      return { success: false, error: error.message };
    }
  }

  // Vérifier si les notifications sont autorisées
  isPermissionGranted() {
    return this.permission === 'granted';
  }

  // Envoyer une notification locale
  async showNotification(title, options = {}) {
    if (!this.isPermissionGranted()) {
      console.warn('Permission notifications non accordée');
      return { success: false, error: 'Permission non accordée' };
    }

    try {
      const defaultOptions = {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        vibrate: [100, 50, 100],
        requireInteraction: false,
        silent: false,
        ...options
      };

      if (this.registration) {
        // Utiliser le service worker pour les notifications
        await this.registration.showNotification(title, defaultOptions);
      } else {
        // Fallback vers les notifications directes
        new Notification(title, defaultOptions);
      }

      return { success: true };
    } catch (error) {
      console.error('Erreur affichage notification:', error);
      return { success: false, error: error.message };
    }
  }

  // Notifications prédéfinies pour ThemaLinks
  async notifyNewLinks(count, category = null) {
    const title = category 
      ? `Nouveaux liens dans ${category}!`
      : 'Nouveaux liens disponibles!';
    
    const body = `${count} nouveau${count > 1 ? 'x' : ''} lien${count > 1 ? 's' : ''} ${category ? `dans la catégorie ${category}` : 'ajouté' + (count > 1 ? 's' : '')}`;

    return await this.showNotification(title, {
      body,
      tag: 'new-links',
      data: { type: 'new-links', category, count },
      actions: [
        {
          action: 'view',
          title: 'Voir les liens',
          icon: '/icons/icon-96x96.png'
        },
        {
          action: 'dismiss',
          title: 'Ignorer',
          icon: '/icons/icon-96x96.png'
        }
      ]
    });
  }

  async notifyFavoriteUpdate(linkTitle, action = 'added') {
    const title = action === 'added' ? 'Ajouté aux favoris' : 'Retiré des favoris';
    const body = `${linkTitle} a été ${action === 'added' ? 'ajouté à' : 'retiré de'} vos favoris`;

    return await this.showNotification(title, {
      body,
      tag: 'favorite-update',
      data: { type: 'favorite', action, linkTitle },
      requireInteraction: false,
      silent: true
    });
  }

  async notifyLinkCheck(brokenCount, totalCount) {
    if (brokenCount === 0) {
      return await this.showNotification('Vérification terminée', {
        body: `Tous les ${totalCount} liens sont fonctionnels ✅`,
        tag: 'link-check',
        data: { type: 'link-check', brokenCount, totalCount }
      });
    } else {
      return await this.showNotification('Liens cassés détectés', {
        body: `${brokenCount} lien${brokenCount > 1 ? 's' : ''} sur ${totalCount} ne fonctionne${brokenCount > 1 ? 'nt' : ''} plus ⚠️`,
        tag: 'link-check',
        data: { type: 'link-check', brokenCount, totalCount },
        requireInteraction: true,
        actions: [
          {
            action: 'view-broken',
            title: 'Voir les liens cassés',
            icon: '/icons/icon-96x96.png'
          }
        ]
      });
    }
  }

  async notifyWeeklyStats(stats) {
    const title = 'Votre résumé hebdomadaire';
    const body = `${stats.totalClicks} clics • ${stats.uniqueLinks} liens visités • ${stats.topCategory} en tête`;

    return await this.showNotification(title, {
      body,
      tag: 'weekly-stats',
      data: { type: 'weekly-stats', stats },
      actions: [
        {
          action: 'view-stats',
          title: 'Voir les statistiques',
          icon: '/icons/icon-96x96.png'
        }
      ]
    });
  }

  // Planifier des notifications récurrentes
  scheduleWeeklyStats() {
    // Programmer pour chaque dimanche à 19h
    const now = new Date();
    const nextSunday = new Date(now);
    nextSunday.setDate(now.getDate() + (7 - now.getDay()));
    nextSunday.setHours(19, 0, 0, 0);

    const timeUntilSunday = nextSunday.getTime() - now.getTime();

    setTimeout(() => {
      // Récupérer les stats de la semaine
      const weeklyStats = this.getWeeklyStats();
      this.notifyWeeklyStats(weeklyStats);

      // Programmer la prochaine notification
      setInterval(() => {
        const stats = this.getWeeklyStats();
        this.notifyWeeklyStats(stats);
      }, 7 * 24 * 60 * 60 * 1000); // Chaque semaine

    }, timeUntilSunday);
  }

  scheduleDailyReminder() {
    // Notification quotidienne à 18h pour encourager l'utilisation
    const now = new Date();
    const nextReminder = new Date(now);
    nextReminder.setHours(18, 0, 0, 0);
    
    if (nextReminder <= now) {
      nextReminder.setDate(nextReminder.getDate() + 1);
    }

    const timeUntilReminder = nextReminder.getTime() - now.getTime();

    setTimeout(() => {
      this.showNotification('Découvrez de nouveaux liens', {
        body: 'Explorez ThemaLinks pour découvrir de nouveaux contenus intéressants!',
        tag: 'daily-reminder',
        data: { type: 'daily-reminder' },
        actions: [
          {
            action: 'explore',
            title: 'Explorer',
            icon: '/icons/icon-96x96.png'
          }
        ]
      });

      // Programmer les prochaines notifications
      setInterval(() => {
        this.showNotification('Découvrez de nouveaux liens', {
          body: 'Explorez ThemaLinks pour découvrir de nouveaux contenus intéressants!',
          tag: 'daily-reminder',
          data: { type: 'daily-reminder' }
        });
      }, 24 * 60 * 60 * 1000); // Chaque jour

    }, timeUntilReminder);
  }

  // Obtenir les statistiques de la semaine (à implémenter selon vos besoins)
  getWeeklyStats() {
    // Cette fonction devrait récupérer les vraies statistiques
    // Pour l'instant, on retourne des données d'exemple
    return {
      totalClicks: 42,
      uniqueLinks: 15,
      topCategory: 'Gaming',
      engagementScore: 85
    };
  }

  // Gérer les clics sur les notifications
  handleNotificationClick(event) {
    const data = event.notification.data;
    
    switch (data?.type) {
      case 'new-links':
        // Rediriger vers la catégorie ou l'accueil
        if (data.category) {
          window.location.href = `/#category-${data.category}`;
        } else {
          window.location.href = '/';
        }
        break;
        
      case 'link-check':
        if (event.action === 'view-broken') {
          window.location.href = '/#admin-broken-links';
        }
        break;
        
      case 'weekly-stats':
        if (event.action === 'view-stats') {
          window.location.href = '/#profile-stats';
        }
        break;
        
      case 'daily-reminder':
        if (event.action === 'explore') {
          window.location.href = '/';
        }
        break;
        
      default:
        window.location.href = '/';
    }
    
    event.notification.close();
  }

  // Supprimer toutes les notifications
  async clearAllNotifications() {
    if (this.registration) {
      const notifications = await this.registration.getNotifications();
      notifications.forEach(notification => notification.close());
    }
  }

  // Obtenir les notifications actives
  async getActiveNotifications() {
    if (this.registration) {
      return await this.registration.getNotifications();
    }
    return [];
  }

  // Désactiver les notifications
  async disableNotifications() {
    await this.clearAllNotifications();
    localStorage.setItem('themalinks_notifications_disabled', 'true');
  }

  // Réactiver les notifications
  async enableNotifications() {
    localStorage.removeItem('themalinks_notifications_disabled');
    return await this.requestPermission();
  }

  // Vérifier si les notifications sont désactivées par l'utilisateur
  areNotificationsDisabled() {
    return localStorage.getItem('themalinks_notifications_disabled') === 'true';
  }
}

// Instance globale
export const notificationManager = new NotificationManager();

// Hook React pour utiliser les notifications
export const useNotifications = () => {
  const [permission, setPermission] = useState(notificationManager.permission);
  const [isSupported] = useState(notificationManager.isSupported);

  useEffect(() => {
    // Mettre à jour la permission si elle change
    const updatePermission = () => {
      setPermission(Notification.permission);
    };

    // Écouter les changements de permission (pas d'API standard, on vérifie périodiquement)
    const interval = setInterval(updatePermission, 1000);

    return () => clearInterval(interval);
  }, []);

  const requestPermission = async () => {
    const result = await notificationManager.requestPermission();
    setPermission(notificationManager.permission);
    return result;
  };

  const showNotification = (title, options) => {
    return notificationManager.showNotification(title, options);
  };

  const scheduleWeeklyStats = () => {
    notificationManager.scheduleWeeklyStats();
  };

  const scheduleDailyReminder = () => {
    notificationManager.scheduleDailyReminder();
  };

  return {
    permission,
    isSupported,
    isGranted: permission === 'granted',
    requestPermission,
    showNotification,
    scheduleWeeklyStats,
    scheduleDailyReminder,
    notifyNewLinks: notificationManager.notifyNewLinks.bind(notificationManager),
    notifyFavoriteUpdate: notificationManager.notifyFavoriteUpdate.bind(notificationManager),
    notifyLinkCheck: notificationManager.notifyLinkCheck.bind(notificationManager),
    clearAll: notificationManager.clearAllNotifications.bind(notificationManager),
    disable: notificationManager.disableNotifications.bind(notificationManager),
    enable: notificationManager.enableNotifications.bind(notificationManager)
  };
};
