import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Dashboard = ({ 
  user, 
  favorites, 
  history, 
  analytics, 
  onExportFavorites,
  onExportHistory,
  onExportAnalytics,
  onClearFavorites,
  onClearHistory,
  onCheckLinks,
  checking,
  progress,
  getLastCheck,
  getEngagementMetrics
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [engagement, setEngagement] = useState(null);
  const [lastCheck, setLastCheck] = useState(null);

  useEffect(() => {
    // Charger les statistiques
    if (analytics) {
      setStats(analytics);
    }
    
    // Charger les métriques d'engagement
    if (getEngagementMetrics) {
      setEngagement(getEngagementMetrics());
    }

    // Charger la dernière vérification
    if (getLastCheck) {
      setLastCheck(getLastCheck());
    }
  }, [analytics, getEngagementMetrics, getLastCheck]);

  const handleCheckLinks = async () => {
    if (onCheckLinks) {
      await onCheckLinks();
      setLastCheck(getLastCheck());
    }
  };

  const tabs = [
    { id: 'overview', name: 'Vue d\'ensemble', icon: '📊' },
    { id: 'favorites', name: 'Favoris', icon: '⭐' },
    { id: 'history', name: 'Historique', icon: '📚' },
    { id: 'analytics', name: 'Analytics', icon: '📈' },
    { id: 'maintenance', name: 'Maintenance', icon: '🔧' }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>🏢 Dashboard Utilisateur</h2>
        <p>Gérez vos données et consultez vos statistiques</p>
      </div>

      {/* Navigation des onglets */}
      <div className="dashboard-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`dashboard-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-name">{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Contenu des onglets */}
      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="overview-tab"
          >
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-content">
                  <div className="stat-number">{favorites?.length || 0}</div>
                  <div className="stat-label">Favoris</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📚</div>
                <div className="stat-content">
                  <div className="stat-number">{history?.length || 0}</div>
                  <div className="stat-label">Liens visités</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🎯</div>
                <div className="stat-content">
                  <div className="stat-number">{stats?.totalClicks || 0}</div>
                  <div className="stat-label">Clics totaux</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🏆</div>
                <div className="stat-content">
                  <div className="stat-number">{engagement?.engagementScore || 0}</div>
                  <div className="stat-label">Score d'engagement</div>
                </div>
              </div>
            </div>

            {engagement && (
              <div className="engagement-details">
                <h3>📈 Métriques d'Engagement</h3>
                <div className="engagement-grid">
                  <div className="engagement-item">
                    <span className="label">Moyenne clics/jour:</span>
                    <span className="value">{engagement.averageClicksPerDay}</span>
                  </div>
                  <div className="engagement-item">
                    <span className="label">Heure la plus active:</span>
                    <span className="value">{engagement.mostActiveHour}</span>
                  </div>
                  <div className="engagement-item">
                    <span className="label">Jour le plus actif:</span>
                    <span className="value">{engagement.mostActiveDay}</span>
                  </div>
                </div>
              </div>
            )}

            {stats?.topCategories && stats.topCategories.length > 0 && (
              <div className="top-categories">
                <h3>🏷️ Catégories Préférées</h3>
                <div className="categories-list">
                  {stats.topCategories.slice(0, 5).map((cat, index) => (
                    <div key={cat.category} className="category-item">
                      <span className="category-rank">#{index + 1}</span>
                      <span className="category-name">{cat.category}</span>
                      <span className="category-count">{cat.count} clics</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'favorites' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="favorites-tab"
          >
            <div className="tab-header">
              <h3>⭐ Gestion des Favoris ({favorites?.length || 0})</h3>
              <div className="tab-actions">
                <button onClick={onExportFavorites} className="export-btn">
                  📤 Exporter
                </button>
                <button 
                  onClick={onClearFavorites} 
                  className="clear-btn"
                  disabled={!favorites || favorites.length === 0}
                >
                  🗑️ Tout supprimer
                </button>
              </div>
            </div>

            {favorites && favorites.length > 0 ? (
              <div className="favorites-list">
                {favorites.map(fav => (
                  <div key={fav.id} className="favorite-item">
                    <div className="favorite-info">
                      <div className="favorite-title">{fav.title}</div>
                      <div className="favorite-url">{fav.url}</div>
                      <div className="favorite-meta">
                        <span className="favorite-category">{fav.category}</span>
                        <span className="favorite-date">
                          Ajouté le {new Date(fav.addedAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                    <button className="remove-favorite">❌</button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">⭐</div>
                <div className="empty-title">Aucun favori</div>
                <div className="empty-text">
                  Ajoutez des liens à vos favoris pour les retrouver ici
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="history-tab"
          >
            <div className="tab-header">
              <h3>📚 Historique de Navigation ({history?.length || 0})</h3>
              <div className="tab-actions">
                <button onClick={onExportHistory} className="export-btn">
                  📤 Exporter
                </button>
                <button 
                  onClick={onClearHistory} 
                  className="clear-btn"
                  disabled={!history || history.length === 0}
                >
                  🗑️ Effacer l'historique
                </button>
              </div>
            </div>

            {history && history.length > 0 ? (
              <div className="history-list">
                {history.slice(0, 20).map(item => (
                  <div key={item.id} className="history-item">
                    <div className="history-info">
                      <div className="history-title">{item.title}</div>
                      <div className="history-url">{item.url}</div>
                      <div className="history-meta">
                        <span className="history-category">{item.category}</span>
                        <span className="history-visits">{item.visitCount} visite{item.visitCount > 1 ? 's' : ''}</span>
                        <span className="history-date">
                          {new Date(item.visitedAt).toLocaleDateString('fr-FR')} à {new Date(item.visitedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {history.length > 20 && (
                  <div className="history-more">
                    Et {history.length - 20} autres entrées...
                  </div>
                )}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📚</div>
                <div className="empty-title">Historique vide</div>
                <div className="empty-text">
                  Votre historique de navigation apparaîtra ici
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="analytics-tab"
          >
            <div className="tab-header">
              <h3>📈 Analytics Détaillées</h3>
              <button onClick={onExportAnalytics} className="export-btn">
                📤 Exporter les données
              </button>
            </div>

            {stats?.dailyStats && (
              <div className="analytics-section">
                <h4>📅 Activité des 7 derniers jours</h4>
                <div className="daily-stats">
                  {stats.dailyStats.map(day => (
                    <div key={day.date} className="daily-stat">
                      <div className="day-label">{day.label}</div>
                      <div className="day-bar">
                        <div 
                          className="day-fill" 
                          style={{ 
                            width: `${Math.max(5, (day.clicks / Math.max(...stats.dailyStats.map(d => d.clicks))) * 100)}%` 
                          }}
                        ></div>
                      </div>
                      <div className="day-count">{day.clicks}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {stats?.topLinks && stats.topLinks.length > 0 && (
              <div className="analytics-section">
                <h4>🔗 Liens les plus visités</h4>
                <div className="top-links">
                  {stats.topLinks.slice(0, 10).map((link, index) => (
                    <div key={link.id} className="top-link">
                      <span className="link-rank">#{index + 1}</span>
                      <div className="link-info">
                        <div className="link-title">{link.title}</div>
                        <div className="link-category">{link.category}</div>
                      </div>
                      <span className="link-count">{link.count} clics</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'maintenance' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="maintenance-tab"
          >
            <div className="tab-header">
              <h3>🔧 Maintenance et Vérifications</h3>
            </div>

            <div className="maintenance-section">
              <h4>🔍 Vérification des Liens</h4>
              <p>Vérifiez si tous les liens de ThemaLinks sont encore fonctionnels</p>
              
              <div className="check-controls">
                <button 
                  onClick={handleCheckLinks}
                  disabled={checking}
                  className="check-btn"
                >
                  {checking ? '🔄 Vérification en cours...' : '🔍 Vérifier tous les liens'}
                </button>
              </div>

              {checking && progress && (
                <div className="check-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${progress.percentage}%` }}
                    ></div>
                  </div>
                  <div className="progress-text">
                    {progress.completed}/{progress.total} liens vérifiés ({progress.percentage}%)
                  </div>
                  <div className="progress-current">
                    Vérification: {progress.currentUrl}
                  </div>
                </div>
              )}

              {lastCheck && (
                <div className="last-check">
                  <h5>📊 Dernière Vérification</h5>
                  <div className="check-stats">
                    <div className="check-stat">
                      <span className="stat-label">Date:</span>
                      <span className="stat-value">
                        {new Date(lastCheck.timestamp).toLocaleDateString('fr-FR')} à {new Date(lastCheck.timestamp).toLocaleTimeString('fr-FR')}
                      </span>
                    </div>
                    <div className="check-stat">
                      <span className="stat-label">Liens fonctionnels:</span>
                      <span className="stat-value success">{lastCheck.stats?.accessible || 0}</span>
                    </div>
                    <div className="check-stat">
                      <span className="stat-label">Liens cassés:</span>
                      <span className="stat-value error">{(lastCheck.stats?.inaccessible || 0) + (lastCheck.stats?.errors || 0)}</span>
                    </div>
                    <div className="check-stat">
                      <span className="stat-label">Taux de succès:</span>
                      <span className="stat-value">{lastCheck.stats?.successRate || 0}%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="maintenance-section">
              <h4>💾 Gestion des Données</h4>
              <p>Exportez ou supprimez vos données personnelles</p>
              
              <div className="data-actions">
                <button onClick={onExportFavorites} className="data-btn export">
                  📤 Exporter les favoris
                </button>
                <button onClick={onExportHistory} className="data-btn export">
                  📤 Exporter l'historique
                </button>
                <button onClick={onExportAnalytics} className="data-btn export">
                  📤 Exporter les analytics
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <style jsx>{`
        .dashboard {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .dashboard-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .dashboard-header h2 {
          color: #FFFFFF;
          font-size: 28px;
          margin-bottom: 8px;
        }

        .dashboard-header p {
          color: #E5E7EB;
          opacity: 0.8;
        }

        .dashboard-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
          overflow-x: auto;
          padding-bottom: 10px;
        }

        .dashboard-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 25px;
          color: #FFFFFF;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .dashboard-tab:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        .dashboard-tab.active {
          background: linear-gradient(135deg, #8B5CF6, #A855F7);
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
        }

        .tab-icon {
          font-size: 18px;
        }

        .tab-name {
          font-weight: 600;
        }

        .dashboard-content {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: 30px;
          backdrop-filter: blur(10px);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 15px;
          background: rgba(255, 255, 255, 0.1);
          padding: 20px;
          border-radius: 15px;
          backdrop-filter: blur(10px);
        }

        .stat-icon {
          font-size: 32px;
        }

        .stat-number {
          font-size: 24px;
          font-weight: bold;
          color: #FFFFFF;
        }

        .stat-label {
          color: #E5E7EB;
          opacity: 0.8;
          font-size: 14px;
        }

        .tab-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .tab-header h3 {
          color: #FFFFFF;
          font-size: 20px;
          margin: 0;
        }

        .tab-actions {
          display: flex;
          gap: 10px;
        }

        .export-btn, .clear-btn, .check-btn, .data-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .export-btn, .data-btn.export {
          background: linear-gradient(135deg, #10B981, #059669);
          color: #FFFFFF;
        }

        .clear-btn {
          background: linear-gradient(135deg, #EF4444, #DC2626);
          color: #FFFFFF;
        }

        .check-btn {
          background: linear-gradient(135deg, #3B82F6, #2563EB);
          color: #FFFFFF;
          padding: 12px 24px;
        }

        .export-btn:hover, .clear-btn:hover, .check-btn:hover, .data-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .export-btn:disabled, .clear-btn:disabled, .check-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }

        .empty-title {
          font-size: 20px;
          font-weight: bold;
          color: #FFFFFF;
          margin-bottom: 10px;
        }

        .empty-text {
          color: #E5E7EB;
          opacity: 0.8;
        }

        .engagement-details, .top-categories, .analytics-section, .maintenance-section {
          background: rgba(255, 255, 255, 0.05);
          padding: 20px;
          border-radius: 15px;
          margin-bottom: 20px;
        }

        .engagement-details h3, .top-categories h3, .analytics-section h4, .maintenance-section h4 {
          color: #FFFFFF;
          margin-bottom: 15px;
        }

        .engagement-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }

        .engagement-item {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .engagement-item .label {
          color: #E5E7EB;
        }

        .engagement-item .value {
          color: #FFFFFF;
          font-weight: 600;
        }

        .categories-list, .favorites-list, .history-list, .top-links {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .category-item, .favorite-item, .history-item, .top-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }

        .daily-stats {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .daily-stat {
          display: grid;
          grid-template-columns: 100px 1fr 50px;
          align-items: center;
          gap: 15px;
        }

        .day-label {
          color: #E5E7EB;
          font-size: 14px;
        }

        .day-bar {
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }

        .day-fill {
          height: 100%;
          background: linear-gradient(135deg, #8B5CF6, #A855F7);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .day-count {
          color: #FFFFFF;
          font-weight: 600;
          text-align: right;
        }

        .check-progress {
          margin: 20px 0;
        }

        .progress-bar {
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 10px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(135deg, #10B981, #059669);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .progress-text, .progress-current {
          color: #E5E7EB;
          font-size: 14px;
          margin-bottom: 5px;
        }

        .check-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }

        .check-stat {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .stat-value.success {
          color: #10B981;
        }

        .stat-value.error {
          color: #EF4444;
        }

        .data-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        @media (max-width: 768px) {
          .dashboard {
            padding: 15px;
          }

          .dashboard-tabs {
            flex-wrap: wrap;
          }

          .dashboard-content {
            padding: 20px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .tab-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .daily-stat {
            grid-template-columns: 80px 1fr 40px;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
