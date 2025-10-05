# ThemaLinks

Une bibliothèque moderne de liens thématiques avec animations 3D, authentification et interface responsive.

## 🚀 Fonctionnalités

- **Interface moderne** avec animations 3D interactives
- **22 catégories thématiques** avec plus de 126 liens soigneusement sélectionnés
- **Authentification sécurisée** avec Google OAuth et Magic Link
- **Système de proxy WebView** pour une navigation intégrée
- **Design responsive** optimisé pour tous les appareils
- **PWA** (Progressive Web App) avec support hors ligne
- **Back office** pour la gestion des utilisateurs
- **Pages légales** complètes (CGU, Politique de confidentialité, etc.)

## 🛠️ Technologies

- **Frontend**: React 19, Vite, Tailwind CSS
- **Animations**: Three.js, React Three Fiber, Framer Motion
- **Authentification**: Supabase Auth
- **Base de données**: Supabase
- **Déploiement**: Vercel
- **PWA**: Service Worker optimisé

## 📦 Installation

1. Cloner le dépôt :
```bash
git clone https://github.com/votre-username/themalinks.git
cd themalinks
```

2. Installer les dépendances :
```bash
pnpm install
```

3. Configurer les variables d'environnement :
```bash
cp .env.example .env.local
```

4. Remplir les variables dans `.env.local` :
```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_anonyme_supabase
```

5. Lancer le serveur de développement :
```bash
pnpm dev
```

## 🌐 Déploiement

### Vercel (Recommandé)

1. Connecter votre dépôt GitHub à Vercel
2. Configurer les variables d'environnement dans Vercel
3. Déployer automatiquement

### Variables d'environnement pour la production

```env
VITE_SUPABASE_URL=votre_url_supabase_production
VITE_SUPABASE_ANON_KEY=votre_cle_anonyme_supabase_production
```

## 📱 PWA

L'application est configurée comme une Progressive Web App :

- **Manifest** : Configuration complète pour l'installation
- **Service Worker** : Cache optimisé et fonctionnement hors ligne
- **Icons** : Icônes adaptatives pour tous les appareils

## 🔐 Authentification

L'application utilise Supabase Auth avec :

- **Google OAuth** : Connexion rapide avec Google
- **Magic Link** : Connexion par email sans mot de passe
- **Gestion des sessions** : Persistance automatique
- **Profils utilisateurs** : Données personnalisées

## 📊 Structure du projet

```
themalinks/
├── public/
│   ├── icons/           # Icônes PWA
│   ├── manifest.json    # Manifest PWA
│   └── sw-optimized.js  # Service Worker
├── src/
│   ├── components/      # Composants React
│   ├── data/           # Données des catégories
│   ├── hooks/          # Hooks personnalisés
│   ├── lib/            # Utilitaires et configuration
│   └── utils/          # Fonctions utilitaires
├── .env.example        # Variables d'environnement exemple
└── README.md
```

## 🎨 Catégories disponibles

1. **Développement Web** - Outils et ressources pour développeurs
2. **Design & UI/UX** - Inspiration et outils de design
3. **Intelligence Artificielle** - IA, ML et outils modernes
4. **Productivité** - Applications et services productifs
5. **Éducation** - Plateformes d'apprentissage
6. **Finance** - Outils financiers et crypto
7. **Marketing** - Ressources marketing digital
8. **Santé & Bien-être** - Applications santé
9. **Divertissement** - Streaming et jeux
10. **Actualités** - Sources d'information
11. **Réseaux Sociaux** - Plateformes sociales
12. **E-commerce** - Sites de vente en ligne
13. **Voyage** - Planification et réservation
14. **Immobilier** - Recherche et gestion
15. **Emploi** - Recherche d'emploi et carrière
16. **Cuisine** - Recettes et livraison
17. **Sport** - Fitness et activités
18. **Musique** - Streaming et découverte
19. **Photo & Vidéo** - Édition et partage
20. **Jeux** - Gaming et divertissement
21. **Science** - Recherche et découverte
22. **Technologie** - Actualités tech

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème :

- Ouvrir une issue sur GitHub
- Contacter l'équipe de développement

## 🔄 Changelog

### Version 1.0.0
- Interface initiale avec 22 catégories
- Authentification Supabase
- Animations 3D
- PWA complet
- Back office administrateur
