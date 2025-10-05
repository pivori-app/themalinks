import React, { Suspense, lazy } from 'react';

// Lazy loading du composant 3D lourd
const Background3D = lazy(() => import('./Background3D'));

// Composant de fallback pendant le chargement
const Background3DFallback = () => (
  <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900 to-slate-900"></div>
    <div className="absolute inset-0 opacity-30">
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
      <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse delay-500"></div>
    </div>
  </div>
);

// Composant wrapper avec gestion d'erreur
const Background3DLazy = ({ show3D, ...props }) => {
  // Si les animations 3D sont désactivées, afficher seulement le fallback
  if (!show3D) {
    return <Background3DFallback />;
  }

  return (
    <Suspense fallback={<Background3DFallback />}>
      <Background3D {...props} />
    </Suspense>
  );
};

export default Background3DLazy;
