import React, { Suspense, lazy } from 'react';

// Lazy loading du Dashboard lourd
const Dashboard = lazy(() => import('./Dashboard'));

// Composant de chargement pour le Dashboard
const DashboardLoader = () => (
  <div className="dashboard-loader">
    <div className="loader-content">
      <div className="loader-header">
        <div className="loader-skeleton loader-title"></div>
        <div className="loader-skeleton loader-subtitle"></div>
      </div>
      
      <div className="loader-tabs">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="loader-skeleton loader-tab"></div>
        ))}
      </div>
      
      <div className="loader-stats">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="loader-stat-card">
            <div className="loader-skeleton loader-stat-icon"></div>
            <div className="loader-stat-content">
              <div className="loader-skeleton loader-stat-number"></div>
              <div className="loader-skeleton loader-stat-label"></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="loader-charts">
        <div className="loader-skeleton loader-chart"></div>
        <div className="loader-skeleton loader-chart"></div>
      </div>
    </div>

    <style jsx>{`
      .dashboard-loader {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
        animation: pulse 2s infinite;
      }

      .loader-content {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 20px;
        padding: 30px;
        backdrop-filter: blur(10px);
      }

      .loader-header {
        text-align: center;
        margin-bottom: 30px;
      }

      .loader-tabs {
        display: flex;
        gap: 10px;
        margin-bottom: 30px;
        overflow-x: auto;
      }

      .loader-tab {
        height: 45px;
        min-width: 120px;
        border-radius: 25px;
      }

      .loader-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
      }

      .loader-stat-card {
        display: flex;
        align-items: center;
        gap: 15px;
        background: rgba(255, 255, 255, 0.1);
        padding: 20px;
        border-radius: 15px;
      }

      .loader-stat-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }

      .loader-stat-content {
        flex: 1;
      }

      .loader-stat-number {
        height: 24px;
        width: 60px;
        margin-bottom: 8px;
        border-radius: 4px;
      }

      .loader-stat-label {
        height: 16px;
        width: 80px;
        border-radius: 4px;
      }

      .loader-charts {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
      }

      .loader-chart {
        height: 200px;
        border-radius: 15px;
      }

      .loader-skeleton {
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0.1) 0%,
          rgba(255, 255, 255, 0.2) 50%,
          rgba(255, 255, 255, 0.1) 100%
        );
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
      }

      .loader-title {
        height: 32px;
        width: 300px;
        margin: 0 auto 10px;
        border-radius: 8px;
      }

      .loader-subtitle {
        height: 18px;
        width: 200px;
        margin: 0 auto;
        border-radius: 4px;
      }

      @keyframes shimmer {
        0% {
          background-position: -200% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }

      @keyframes pulse {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.8;
        }
      }

      @media (max-width: 768px) {
        .loader-stats {
          grid-template-columns: 1fr;
        }
        
        .loader-charts {
          grid-template-columns: 1fr;
        }
        
        .loader-tabs {
          flex-wrap: wrap;
        }
      }
    `}</style>
  </div>
);

// Composant wrapper avec gestion d'erreur
const DashboardLazy = (props) => {
  return (
    <Suspense fallback={<DashboardLoader />}>
      <Dashboard {...props} />
    </Suspense>
  );
};

export default DashboardLazy;
