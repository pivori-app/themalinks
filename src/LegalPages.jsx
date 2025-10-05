import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Shield, Cookie, Info, HelpCircle, Book, Code, Headphones } from 'lucide-react';

const LegalPages = ({ isOpen, onClose, page }) => {
  if (!isOpen) return null;

  const pages = {
    // Pages légales
    'cgu': {
      title: 'Conditions Générales d\'Utilisation',
      icon: FileText,
      content: (
        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-3">1. Objet</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Les présentes conditions générales d'utilisation (CGU) régissent l'utilisation de la plateforme ThemaLinks, 
              service de curation de liens thématiques accessible à l'adresse [URL].
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">2. Acceptation des conditions</h3>
            <p className="text-gray-600 dark:text-gray-400">
              L'utilisation de ThemaLinks implique l'acceptation pleine et entière des présentes CGU. 
              Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser ce service.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">3. Description du service</h3>
            <p className="text-gray-600 dark:text-gray-400">
              ThemaLinks est une plateforme qui propose une collection organisée de liens web classés par thématiques. 
              Le service permet aux utilisateurs de découvrir, consulter et sauvegarder des liens utiles.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">4. Utilisation du service</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
              <li>L'utilisation du service est gratuite pour les fonctionnalités de base</li>
              <li>Certaines fonctionnalités peuvent nécessiter une inscription</li>
              <li>Vous vous engagez à utiliser le service de manière légale et respectueuse</li>
              <li>Il est interdit de tenter de contourner les mesures de sécurité</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">5. Propriété intellectuelle</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Le contenu de ThemaLinks (design, textes, logos) est protégé par le droit d'auteur. 
              Les liens référencés appartiennent à leurs propriétaires respectifs.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">6. Limitation de responsabilité</h3>
            <p className="text-gray-600 dark:text-gray-400">
              ThemaLinks ne peut être tenu responsable du contenu des sites externes référencés. 
              L'utilisation des liens se fait sous votre propre responsabilité.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">7. Modification des CGU</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Ces conditions peuvent être modifiées à tout moment. Les utilisateurs seront informés 
              des modifications importantes par email ou notification sur la plateforme.
            </p>
          </section>
        </div>
      )
    },

    'privacy': {
      title: 'Politique de Confidentialité',
      icon: Shield,
      content: (
        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-3">1. Collecte des données</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              Nous collectons les données suivantes :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
              <li><strong>Données d'inscription :</strong> email, nom, avatar (via Google OAuth)</li>
              <li><strong>Données d'utilisation :</strong> liens consultés, favoris, historique de navigation</li>
              <li><strong>Données techniques :</strong> adresse IP, navigateur, système d'exploitation</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">2. Utilisation des données</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              Vos données sont utilisées pour :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
              <li>Fournir et améliorer nos services</li>
              <li>Personnaliser votre expérience utilisateur</li>
              <li>Analyser l'utilisation de la plateforme</li>
              <li>Communiquer avec vous (notifications, support)</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">3. Partage des données</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Nous ne vendons ni ne louons vos données personnelles à des tiers. 
              Vos données peuvent être partagées uniquement dans les cas suivants :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 mt-3">
              <li>Avec votre consentement explicite</li>
              <li>Pour se conformer à une obligation légale</li>
              <li>Avec nos prestataires de services (hébergement, analytics)</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">4. Sécurité des données</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Nous mettons en place des mesures techniques et organisationnelles appropriées 
              pour protéger vos données contre l'accès non autorisé, la perte ou la destruction.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">5. Vos droits</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              Conformément au RGPD, vous disposez des droits suivants :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
              <li>Droit d'accès à vos données</li>
              <li>Droit de rectification</li>
              <li>Droit à l'effacement</li>
              <li>Droit à la portabilité</li>
              <li>Droit d'opposition</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">6. Contact</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Pour exercer vos droits ou pour toute question relative à la protection de vos données, 
              contactez-nous à : privacy@themalinks.com
            </p>
          </section>
        </div>
      )
    },

    'mentions': {
      title: 'Mentions Légales',
      icon: Info,
      content: (
        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-3">Éditeur du site</h3>
            <div className="text-gray-600 dark:text-gray-400 space-y-2">
              <p><strong>Nom :</strong> ThemaLinks</p>
              <p><strong>Forme juridique :</strong> [À compléter]</p>
              <p><strong>Adresse :</strong> [À compléter]</p>
              <p><strong>Email :</strong> contact@themalinks.com</p>
              <p><strong>Téléphone :</strong> [À compléter]</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">Hébergement</h3>
            <div className="text-gray-600 dark:text-gray-400 space-y-2">
              <p><strong>Hébergeur :</strong> Vercel Inc.</p>
              <p><strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, USA</p>
              <p><strong>Site web :</strong> https://vercel.com</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">Propriété intellectuelle</h3>
            <p className="text-gray-600 dark:text-gray-400">
              L'ensemble du contenu de ce site (textes, images, logos, icônes) est protégé par le droit d'auteur. 
              Toute reproduction, même partielle, est interdite sans autorisation préalable.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">Crédits</h3>
            <div className="text-gray-600 dark:text-gray-400 space-y-2">
              <p><strong>Design :</strong> Interface moderne développée avec React et Tailwind CSS</p>
              <p><strong>Icônes :</strong> Lucide React (https://lucide.dev)</p>
              <p><strong>Animations :</strong> Framer Motion</p>
              <p><strong>Animations 3D :</strong> Three.js</p>
            </div>
          </section>
        </div>
      )
    },

    'cookies': {
      title: 'Politique des Cookies',
      icon: Cookie,
      content: (
        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-3">Qu'est-ce qu'un cookie ?</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Un cookie est un petit fichier texte stocké sur votre appareil lors de la visite d'un site web. 
              Il permet de mémoriser vos préférences et d'améliorer votre expérience de navigation.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">Types de cookies utilisés</h3>
            
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Cookies essentiels</h4>
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  Nécessaires au fonctionnement du site (session utilisateur, préférences de thème)
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Cookies de performance</h4>
                <p className="text-green-700 dark:text-green-300 text-sm">
                  Collectent des informations anonymes sur l'utilisation du site pour l'améliorer
                </p>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Cookies de fonctionnalité</h4>
                <p className="text-purple-700 dark:text-purple-300 text-sm">
                  Mémorisent vos choix (langue, région) pour personnaliser votre expérience
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">Gestion des cookies</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              Vous pouvez contrôler et gérer les cookies de plusieurs façons :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
              <li>Via les paramètres de votre navigateur</li>
              <li>En utilisant notre centre de préférences (disponible prochainement)</li>
              <li>En supprimant les cookies existants</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">Cookies tiers</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Nous utilisons des services tiers qui peuvent déposer leurs propres cookies :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 mt-3">
              <li><strong>Google Analytics :</strong> Analyse d'audience (anonymisé)</li>
              <li><strong>Supabase :</strong> Authentification et base de données</li>
            </ul>
          </section>
        </div>
      )
    },

    // Pages ressources
    'faq': {
      title: 'Questions Fréquentes',
      icon: HelpCircle,
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Comment créer un compte ?</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Cliquez sur "Connexion" puis choisissez "Continuer avec Google" ou utilisez un Magic Link avec votre email.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Comment ajouter un lien aux favoris ?</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Connectez-vous, puis cliquez sur l'étoile (⭐) à côté du lien que vous souhaitez sauvegarder.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Pourquoi certains liens ne s'ouvrent pas dans l'application ?</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Certains sites bloquent l'affichage en iframe pour des raisons de sécurité. 
                Dans ce cas, le lien s'ouvrira dans un nouvel onglet.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Comment supprimer mon compte ?</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Allez dans votre profil → Back Office → Paramètres → Zone de danger.
                Attention : cette action est irréversible.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">L'application est-elle gratuite ?</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Oui, ThemaLinks est entièrement gratuit. Toutes les fonctionnalités sont accessibles sans frais.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Comment proposer un nouveau lien ?</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Contactez-nous via le formulaire de support avec l'URL et la catégorie suggérée. 
                Nous examinerons votre proposition.
              </p>
            </div>
          </div>
        </div>
      )
    },

    'guide': {
      title: 'Guide d\'Utilisation',
      icon: Book,
      content: (
        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-3">🚀 Premiers pas</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
              <li>Créez votre compte en cliquant sur "Connexion"</li>
              <li>Explorez les catégories sur la page d'accueil</li>
              <li>Cliquez sur une catégorie pour voir les liens disponibles</li>
              <li>Ajoutez vos liens préférés aux favoris avec l'étoile ⭐</li>
            </ol>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">🔍 Recherche</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              Utilisez la barre de recherche pour trouver rapidement des liens :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
              <li>Tapez des mots-clés liés au contenu recherché</li>
              <li>La recherche fonctionne sur les titres et descriptions</li>
              <li>Les résultats s'affichent en temps réel</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">⭐ Gestion des favoris</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              Organisez vos liens préférés :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
              <li>Cliquez sur l'étoile pour ajouter/retirer des favoris</li>
              <li>Accédez à vos favoris via votre profil</li>
              <li>Gérez vos favoris dans le Back Office</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">🎨 Personnalisation</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              Adaptez l'interface à vos préférences :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
              <li>Basculez entre mode sombre et clair</li>
              <li>Activez/désactivez les animations 3D</li>
              <li>Personnalisez votre profil dans le Back Office</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">📱 Version mobile</h3>
            <p className="text-gray-600 dark:text-gray-400">
              ThemaLinks est optimisé pour mobile. Toutes les fonctionnalités sont disponibles 
              sur smartphone et tablette avec une interface adaptée.
            </p>
          </section>
        </div>
      )
    },

    'api': {
      title: 'Documentation API',
      icon: Code,
      content: (
        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-3">🔗 API ThemaLinks</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Notre API REST permet d'accéder aux données de ThemaLinks de manière programmatique.
            </p>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Base URL :</strong> https://api.themalinks.com/v1
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">📋 Endpoints disponibles</h3>
            
            <div className="space-y-4">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-mono rounded">GET</span>
                  <code className="text-sm">/categories</code>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Récupère la liste de toutes les catégories disponibles
                </p>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-mono rounded">GET</span>
                  <code className="text-sm">/categories/{id}/links</code>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Récupère tous les liens d'une catégorie spécifique
                </p>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-mono rounded">GET</span>
                  <code className="text-sm">/search?q={query}</code>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Recherche dans tous les liens par mots-clés
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">🔑 Authentification</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              L'API utilise des clés d'authentification pour les endpoints protégés :
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <code className="text-sm">
                Authorization: Bearer YOUR_API_KEY
              </code>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">📝 Exemple de réponse</h3>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <pre className="text-sm text-gray-600 dark:text-gray-400 overflow-x-auto">
{`{
  "categories": [
    {
      "id": "gaming",
      "name": "Gaming",
      "description": "Jeux en ligne et émulation rétro",
      "icon": "gamepad",
      "color": "from-green-500 to-blue-500",
      "links_count": 16
    }
  ]
}`}
              </pre>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">📞 Support</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Pour obtenir une clé API ou signaler un problème, contactez-nous à : 
              <a href="mailto:api@themalinks.com" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">
                api@themalinks.com
              </a>
            </p>
          </section>
        </div>
      )
    },

    'support': {
      title: 'Support & Contact',
      icon: Headphones,
      content: (
        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-3">💬 Nous contacter</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Notre équipe est là pour vous aider. Choisissez le canal qui vous convient le mieux :
            </p>

            <div className="grid gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100">Email</h4>
                </div>
                <p className="text-blue-700 dark:text-blue-300 text-sm mb-2">
                  Pour toute question ou problème technique
                </p>
                <a href="mailto:support@themalinks.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                  support@themalinks.com
                </a>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <HelpCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <h4 className="font-semibold text-green-900 dark:text-green-100">FAQ</h4>
                </div>
                <p className="text-green-700 dark:text-green-300 text-sm">
                  Consultez notre FAQ pour les questions les plus courantes
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">🐛 Signaler un bug</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              Vous avez trouvé un problème ? Aidez-nous à l'améliorer en nous fournissant :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
              <li>Description détaillée du problème</li>
              <li>Étapes pour reproduire le bug</li>
              <li>Navigateur et système d'exploitation utilisés</li>
              <li>Captures d'écran si possible</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">💡 Suggérer une amélioration</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Vous avez une idée pour améliorer ThemaLinks ? Nous sommes toujours à l'écoute 
              de vos suggestions pour enrichir la plateforme.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">⏱️ Temps de réponse</h3>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li><strong>Questions générales :</strong> 24-48h</li>
                <li><strong>Problèmes techniques :</strong> 12-24h</li>
                <li><strong>Bugs critiques :</strong> 2-6h</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">🌍 Communauté</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Rejoignez notre communauté d'utilisateurs pour échanger des conseils, 
              partager vos découvertes et rester informé des nouveautés.
            </p>
          </section>
        </div>
      )
    }
  };

  const currentPage = pages[page];
  if (!currentPage) return null;

  const Icon = currentPage.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon className="w-8 h-8" />
                <div>
                  <h2 className="text-2xl font-bold">{currentPage.title}</h2>
                  <p className="text-blue-100">ThemaLinks - Documentation</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              {currentPage.content}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LegalPages;
