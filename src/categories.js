// Données des catégories et liens pour ThemaLinks
export const categories = [
  {
    id: 'voiture',
    name: 'Voiture',
    icon: 'Car',
    description: 'Achat, vente et entretien automobile',
    color: 'from-red-500 to-orange-500',
    links: [
      {
        id: 1,
        title: 'Auto1',
        url: 'https://www.auto1.com/fr/home',
        description: 'Plateforme européenne d\'achat et vente de voitures d\'occasion en ligne',
        integration_mode: 'redirect'
      },
      {
        id: 2,
        title: 'StarMyCar',
        url: 'https://starmycar.com',
        description: 'Service de mise en relation pour l\'achat et la vente de véhicules',
        integration_mode: 'redirect'
      },
      {
        id: 3,
        title: 'CarCareKiosk',
        url: 'https://www.carcarekiosk.com/',
        description: 'Guides et conseils pour l\'entretien et la réparation automobile',
        integration_mode: 'webview'
      }
    ]
  },
  {
    id: 'tv-streaming',
    name: 'TV & Streaming',
    icon: 'Tv',
    description: 'Films, séries et contenus vidéo en streaming',
    color: 'from-purple-500 to-pink-500',
    links: [
      {
        id: 4,
        title: 'WaveWatch',
        url: 'https://wavewatch-beta-v19.vercel.app/',
        description: 'Plateforme de streaming moderne avec interface épurée',
        integration_mode: 'webview'
      },
      {
        id: 5,
        title: 'DesiCinemas',
        url: 'https://desicinemas.pk/',
        description: 'Cinéma et films de Bollywood et du sous-continent indien',
        integration_mode: 'webview'
      },
      {
        id: 6,
        title: 'Nakios TV',
        url: 'https://nakios.site/tv',
        description: 'Chaînes de télévision et contenus en direct',
        integration_mode: 'webview'
      },
      {
        id: 7,
        title: 'NovoVue',
        url: 'https://www.novovue.fr/',
        description: 'Plateforme française de streaming avec contenu varié',
        integration_mode: 'webview'
      },
      {
        id: 8,
        title: 'Moviepire',
        url: 'https://moviepire.net/',
        description: 'Base de données et streaming de films avec recommandations',
        integration_mode: 'webview'
      },
      {
        id: 9,
        title: 'WaveWatch DL3',
        url: 'https://dl3.wavewatch.xyz/',
        description: 'Version alternative de WaveWatch pour le téléchargement',
        integration_mode: 'webview'
      },
      {
        id: 10,
        title: 'XalaFlix',
        url: 'https://xalaflix.art/movies',
        description: 'Collection de films artistiques et indépendants',
        integration_mode: 'webview'
      },
      {
        id: 11,
        title: 'Nunflix',
        url: 'https://nunflix.org/',
        description: 'Plateforme de streaming avec interface similaire à Netflix',
        integration_mode: 'webview'
      },
      {
        id: 12,
        title: 'PurStream',
        url: 'https://purstream.to/',
        description: 'Service de streaming haute qualité sans publicité',
        integration_mode: 'webview'
      },
      {
        id: 13,
        title: 'Empire Stream',
        url: 'https://www.empire-stream.fr/',
        description: 'Plateforme française de streaming avec large catalogue',
        integration_mode: 'redirect'
      },
      {
        id: 14,
        title: 'Nova Stream',
        url: 'https://nova-stream.live/',
        description: 'Streaming en direct et à la demande',
        integration_mode: 'webview'
      },
      {
        id: 15,
        title: 'Ufrov',
        url: 'https://ufrov.com/',
        description: 'Plateforme de streaming avec contenu international',
        integration_mode: 'webview'
      },
      {
        id: 16,
        title: 'Flixer',
        url: 'https://flixer.su/',
        description: 'Service de streaming avec interface moderne',
        integration_mode: 'webview'
      },
      {
        id: 17,
        title: 'NetMirror',
        url: 'https://netmirror.app/1/en',
        description: 'Miroir de contenus Netflix avec accès international',
        integration_mode: 'webview'
      },
      {
        id: 18,
        title: 'MyRetroTVs',
        url: 'https://myretrotvs.com',
        description: 'Chaînes de télévision rétro et programmes vintage',
        integration_mode: 'redirect'
      },
      {
        id: 19,
        title: 'TV Garden',
        url: 'https://tv.garden',
        description: 'Jardin de chaînes TV du monde entier',
        integration_mode: 'webview'
      },
      {
        id: 20,
        title: 'Xataf',
        url: 'https://www.xataf.com/',
        description: 'Plateforme de streaming avec contenu varié',
        integration_mode: 'webview'
      },
      {
        id: 21,
        title: 'Movix',
        url: 'https://movix.website/',
        description: 'Site de films avec interface élégante',
        integration_mode: 'webview'
      },
      {
        id: 22,
        title: 'J2N',
        url: 'https://www.j2n.fr/',
        description: 'Plateforme française de contenus audiovisuels',
        integration_mode: 'redirect'
      },
      {
        id: 23,
        title: 'NetAklap',
        url: 'https://netaklap.com/wmu81z7hp/home/netaklap/',
        description: 'Service de streaming avec accès privé',
        integration_mode: 'webview'
      },
      {
        id: 24,
        title: 'XPrime TV',
        url: 'https://xprime.tv/',
        description: 'Télévision premium avec contenus exclusifs',
        integration_mode: 'redirect'
      },
      {
        id: 25,
        title: 'CineBy',
        url: 'https://www.cineby.app/',
        description: 'Application de cinéma avec recommandations personnalisées',
        integration_mode: 'redirect'
      },
      {
        id: 26,
        title: 'BitCine',
        url: 'https://www.bitcine.app/',
        description: 'Plateforme de cinéma numérique',
        integration_mode: 'redirect'
      },
      {
        id: 27,
        title: 'FMovies',
        url: 'https://www.fmovies.gd/home',
        description: 'Large collection de films gratuits en streaming',
        integration_mode: 'webview'
      },
      {
        id: 28,
        title: 'Footballia',
        url: 'https://footballia.eu/',
        description: 'Archive historique de matchs de football complets',
        integration_mode: 'redirect'
      }
    ]
  },
  {
    id: 'astuce-streaming',
    name: 'Astuce Streaming',
    icon: 'Lightbulb',
    description: 'Outils et astuces pour optimiser le streaming',
    color: 'from-yellow-500 to-orange-500',
    links: [
      {
        id: 29,
        title: 'Teleparty',
        url: 'https://www.teleparty.com/',
        description: 'Regarder des films et séries ensemble à distance',
        integration_mode: 'webview'
      },
      {
        id: 30,
        title: 'Netflix Codes',
        url: 'https://www.netflix-codes.com/fr',
        description: 'Codes secrets pour débloquer les catégories cachées Netflix',
        integration_mode: 'redirect'
      },
      {
        id: 31,
        title: 'ShotDeck',
        url: 'https://shotdeck.com/',
        description: 'Base de données d\'images de films pour l\'inspiration visuelle',
        integration_mode: 'redirect'
      }
    ]
  },
  {
    id: 'streaming-live',
    name: 'Streaming Live',
    icon: 'Radio',
    description: 'Diffusion en direct et télévision live',
    color: 'from-red-500 to-pink-500',
    links: [
      {
        id: 32,
        title: 'GoStreamEast',
        url: 'https://v2.gostreameast.link/',
        description: 'Streaming live de sports et événements',
        integration_mode: 'webview'
      },
      {
        id: 33,
        title: 'TVPass',
        url: 'https://tvpass.org/',
        description: 'Accès à des chaînes de télévision internationales',
        integration_mode: 'webview'
      },
      {
        id: 34,
        title: 'LiveHDTV',
        url: 'https://www.livehdtv.com/',
        description: 'Télévision en direct haute définition',
        integration_mode: 'redirect'
      },
      {
        id: 35,
        title: 'Easy Web TV',
        url: 'https://zhangboheng.github.io/Easy-Web-TV-M3u8/routes/countries.html',
        description: 'Interface simple pour accéder aux chaînes TV mondiales',
        integration_mode: 'webview'
      }
    ]
  },
  {
    id: 'manga',
    name: 'Manga',
    icon: 'BookOpen',
    description: 'Manga et anime en streaming',
    color: 'from-blue-500 to-purple-500',
    links: [
      {
        id: 36,
        title: 'VoirAnime',
        url: 'https://v6.voiranime.com/',
        description: 'Plateforme française de streaming d\'anime avec sous-titres',
        integration_mode: 'webview'
      },
      {
        id: 37,
        title: 'Kaa.to',
        url: 'https://kaa.to/',
        description: 'Site de streaming anime avec interface moderne',
        integration_mode: 'webview'
      },
      {
        id: 38,
        title: 'HiAnime',
        url: 'https://hianime.to/',
        description: 'Plateforme d\'anime haute qualité sans publicité',
        integration_mode: 'webview'
      },
      {
        id: 39,
        title: 'AnimeNoSub',
        url: 'https://animenosub.to/',
        description: 'Anime en version originale japonaise sans sous-titres',
        integration_mode: 'webview'
      }
    ]
  },
  {
    id: 'gaming',
    name: 'Gaming',
    icon: 'Gamepad2',
    description: 'Jeux en ligne et émulation rétro',
    color: 'from-green-500 to-blue-500',
    links: [
      {
        id: 40,
        title: 'ArcadeSpot',
        url: 'https://arcadespot.com/',
        description: 'Collection de jeux d\'arcade classiques jouables en ligne',
        integration_mode: 'webview'
      },
      {
        id: 41,
        title: 'PlayClassic',
        url: 'https://playclassic.games/',
        description: 'Émulateur en ligne pour jeux rétro de toutes consoles',
        integration_mode: 'webview'
      },
      {
        id: 42,
        title: 'RetroGames',
        url: 'https://www.retrogames.onl/',
        description: 'Large collection de jeux rétro organisés par console',
        integration_mode: 'webview'
      },
      {
        id: 43,
        title: 'DODI Repacks',
        url: 'https://dodi-repacks.download/',
        description: 'Jeux PC compressés et optimisés pour téléchargement',
        integration_mode: 'redirect'
      },
      {
        id: 44,
        title: 'GOG Games',
        url: 'https://gog-games.to/game/parkitect',
        description: 'Jeux sans DRM de la plateforme GOG',
        integration_mode: 'redirect'
      },
      {
        id: 45,
        title: 'FitGirl Repacks',
        url: 'https://fitgirl-repacks.site/',
        description: 'Jeux PC ultra-compressés avec installation rapide',
        integration_mode: 'redirect'
      },
      {
        id: 46,
        title: 'OnlineFix',
        url: 'https://online-fix.me/',
        description: 'Correctifs pour activer le multijoueur dans les jeux piratés',
        integration_mode: 'redirect'
      },
      {
        id: 47,
        title: 'ElAmigos',
        url: 'https://elamigos.site/#TopOfPage',
        description: 'Groupe de release spécialisé dans les jeux PC',
        integration_mode: 'redirect'
      },
      {
        id: 48,
        title: 'M4ckD0ge Repacks',
        url: 'https://m4ckd0ge-repacks.site/index.html',
        description: 'Repacks de jeux PC avec focus sur la qualité',
        integration_mode: 'redirect'
      },
      {
        id: 49,
        title: 'SteamRip',
        url: 'https://steamrip.com/',
        description: 'Jeux Steam pré-installés et prêts à jouer',
        integration_mode: 'redirect'
      },
      {
        id: 50,
        title: 'SteamGG',
        url: 'https://steamgg.net/',
        description: 'Alternative pour télécharger des jeux Steam',
        integration_mode: 'redirect'
      },
      {
        id: 51,
        title: 'AnkerGames',
        url: 'https://ankergames.net/',
        description: 'Plateforme de jeux indépendants et rétro',
        integration_mode: 'webview'
      },
      {
        id: 52,
        title: 'BuildIt App',
        url: 'https://builditapp.com/',
        description: 'Jeux de construction et simulation en ligne',
        integration_mode: 'webview'
      },
      {
        id: 53,
        title: 'GeoFS',
        url: 'https://www.geo-fs.com/',
        description: 'Simulateur de vol gratuit avec cartes satellite réelles',
        integration_mode: 'webview'
      },
      {
        id: 54,
        title: 'EmuGames',
        url: 'https://www.emugames.com/',
        description: 'Émulation de consoles rétro directement dans le navigateur',
        integration_mode: 'webview'
      },
      {
        id: 55,
        title: 'AirConsole',
        url: 'https://www.airconsole.com/',
        description: 'Console de jeu utilisant smartphones comme manettes',
        integration_mode: 'webview'
      }
    ]
  },
  {
    id: 'trainer',
    name: 'Trainer',
    icon: 'Zap',
    description: 'Trainers et cheats pour jeux vidéo',
    color: 'from-orange-500 to-red-500',
    links: [
      {
        id: 56,
        title: 'EmuParadise',
        url: 'https://www.emuparadise.me/',
        description: 'ROMs et émulateurs pour consoles rétro',
        integration_mode: 'redirect'
      },
      {
        id: 57,
        title: 'WeMod',
        url: 'https://www.wemod.com/fr',
        description: 'Application de mods et trainers pour jeux PC',
        integration_mode: 'redirect'
      },
      {
        id: 58,
        title: 'FearlessRevolution',
        url: 'https://fearlessrevolution.com/',
        description: 'Forum et trainers Cheat Engine pour jeux',
        integration_mode: 'redirect'
      },
      {
        id: 59,
        title: 'FlingTrainer',
        url: 'https://flingtrainer.com/',
        description: 'Trainers premium pour jeux PC populaires',
        integration_mode: 'redirect'
      }
    ]
  },
  {
    id: 'livre',
    name: 'Livre',
    icon: 'Book',
    description: 'Livres numériques et audiobooks',
    color: 'from-emerald-500 to-teal-500',
    links: [
      {
        id: 60,
        title: 'RiveStream Manga',
        url: 'https://rivestream.org/manga',
        description: 'Lecture de manga en ligne avec interface fluide',
        integration_mode: 'webview'
      },
      {
        id: 61,
        title: 'Z-Library',
        url: 'https://fr.z-lib.gd/',
        description: 'Plus grande bibliothèque numérique gratuite au monde',
        integration_mode: 'webview'
      },
      {
        id: 62,
        title: 'AudioBookBay',
        url: 'https://audiobookbay.lu/',
        description: 'Vaste collection d\'audiobooks gratuits à télécharger',
        integration_mode: 'webview'
      },
      {
        id: 63,
        title: 'FullLengthAudioBooks',
        url: 'https://fulllengthaudiobooks.net/',
        description: 'Audiobooks complets gratuits en streaming',
        integration_mode: 'webview'
      },
      {
        id: 64,
        title: 'Gallica BnF',
        url: 'https://gallica.bnf.fr',
        description: 'Bibliothèque numérique de la Bibliothèque nationale de France',
        integration_mode: 'webview'
      },
      {
        id: 65,
        title: 'OpenLibrary',
        url: 'https://openlibrary.org/',
        description: 'Catalogue ouvert de tous les livres publiés',
        integration_mode: 'webview'
      },
      {
        id: 66,
        title: 'LibriVox',
        url: 'https://librivox.org/',
        description: 'Audiobooks gratuits de livres du domaine public',
        integration_mode: 'webview'
      },
      {
        id: 67,
        title: 'OnRead',
        url: 'https://www.onread.com/',
        description: 'Plateforme de lecture sociale avec recommandations',
        integration_mode: 'webview'
      },
      {
        id: 68,
        title: 'SoBrief',
        url: 'https://sobrief.com/',
        description: 'Résumés de livres business et développement personnel',
        integration_mode: 'webview'
      }
    ]
  },
  {
    id: 'urbex',
    name: 'Urbex',
    icon: 'MapPin',
    description: 'Exploration urbaine et lieux abandonnés',
    color: 'from-gray-500 to-slate-600',
    links: [
      {
        id: 69,
        title: 'EasyUrbex',
        url: 'https://easyurbex.com/free-urbex-map/',
        description: 'Carte interactive gratuite des lieux d\'urbex en Europe',
        integration_mode: 'webview'
      },
      {
        id: 70,
        title: 'Urbexology',
        url: 'https://urbexology.com/fr.html',
        description: 'Guide français de l\'exploration urbaine et conseils',
        integration_mode: 'webview'
      },
      {
        id: 71,
        title: 'UrbexSession',
        url: 'https://urbexsession.com/',
        description: 'Communauté et reportages d\'exploration urbaine',
        integration_mode: 'webview'
      }
    ]
  },
  {
    id: 'apprendre',
    name: 'Apprendre',
    icon: 'GraduationCap',
    description: 'Ressources éducatives et apprentissage',
    color: 'from-blue-500 to-indigo-500',
    links: [
      {
        id: 72,
        title: 'LingoHut',
        url: 'https://www.lingohut.com/fr',
        description: 'Apprentissage gratuit de plus de 50 langues',
        integration_mode: 'redirect'
      },
      {
        id: 73,
        title: 'Google Labs LLL',
        url: 'https://labs.google/lll/fr',
        description: 'Expériences d\'apprentissage des langues par Google',
        integration_mode: 'webview'
      },
      {
        id: 74,
        title: 'Loecsen',
        url: 'https://www.loecsen.com/fr',
        description: 'Expressions essentielles dans 40 langues avec audio',
        integration_mode: 'redirect'
      },
      {
        id: 75,
        title: 'BioDigital Human',
        url: 'https://human.biodigital.com/explore',
        description: 'Atlas 3D interactif du corps humain',
        integration_mode: 'webview'
      },
      {
        id: 76,
        title: 'Animagraffs',
        url: 'https://animagraffs.com/',
        description: 'Infographies animées expliquant le fonctionnement des objets',
        integration_mode: 'webview'
      },
      {
        id: 77,
        title: 'Old Maps Online',
        url: 'https://www.oldmapsonline.org/en#position=5/46.87/-1.02',
        description: 'Collection de cartes historiques géolocalisées',
        integration_mode: 'webview'
      },
      {
        id: 78,
        title: 'Class Central',
        url: 'https://www.classcentral.com/',
        description: 'Moteur de recherche pour cours en ligne gratuits',
        integration_mode: 'redirect'
      },
      {
        id: 79,
        title: 'Cymath',
        url: 'https://www.cymath.com/',
        description: 'Résolveur de problèmes mathématiques étape par étape',
        integration_mode: 'webview'
      },
      {
        id: 80,
        title: 'Exercism',
        url: 'https://exercism.org/',
        description: 'Plateforme d\'apprentissage de la programmation avec mentors',
        integration_mode: 'redirect'
      },
      {
        id: 81,
        title: 'Wolfram Alpha',
        url: 'https://www.wolframalpha.com/',
        description: 'Moteur de calcul et base de connaissances computationnelle',
        integration_mode: 'redirect'
      },
      {
        id: 82,
        title: 'Imagine Explainers',
        url: 'https://imagineexplainers.com/',
        description: 'Explications visuelles de concepts complexes',
        integration_mode: 'webview'
      },
      {
        id: 83,
        title: 'PhET Simulations',
        url: 'https://phet.colorado.edu/',
        description: 'Simulations interactives de sciences et mathématiques',
        integration_mode: 'redirect'
      },
      {
        id: 84,
        title: 'Symbolab',
        url: 'https://www.symbolab.com/',
        description: 'Calculatrice avancée et résolveur d\'équations mathématiques',
        integration_mode: 'redirect'
      },
      {
        id: 85,
        title: 'MakeMyDriveFun',
        url: 'https://makemydrivefun.com/',
        description: 'Jeux et activités pour rendre les trajets en voiture amusants',
        integration_mode: 'webview'
      }
    ]
  },
  {
    id: 'reparer',
    name: 'Réparer',
    icon: 'Wrench',
    description: 'Guides de réparation et manuels techniques',
    color: 'from-amber-500 to-orange-500',
    links: [
      {
        id: 86,
        title: 'iFixit',
        url: 'https://fr.ifixit.com/',
        description: 'Guides de réparation gratuits pour tous types d\'appareils',
        integration_mode: 'redirect'
      },
      {
        id: 87,
        title: 'CarCareKiosk FR',
        url: 'https://fr.carcarekiosk.com/',
        description: 'Guides d\'entretien et réparation automobile détaillés',
        integration_mode: 'webview'
      },
      {
        id: 88,
        title: 'ManualsLib',
        url: 'https://www.manualslib.com/',
        description: 'Plus grande collection de manuels d\'utilisation gratuits',
        integration_mode: 'webview'
      }
    ]
  },
  {
    id: 'sport-fitness',
    name: 'Sport & Fitness',
    icon: 'Dumbbell',
    description: 'Entraînement et programmes fitness',
    color: 'from-red-500 to-rose-500',
    links: [
      {
        id: 89,
        title: 'Workout Cool',
        url: 'https://www.workout.cool/fr',
        description: 'Générateur d\'entraînements personnalisés sans équipement',
        integration_mode: 'webview'
      },
      {
        id: 90,
        title: 'Darebee',
        url: 'https://darebee.com/',
        description: 'Entraînements gratuits, défis fitness et programmes nutrition',
        integration_mode: 'redirect'
      },
      {
        id: 91,
        title: 'MuscleWiki',
        url: 'https://musclewiki.com/fr-fr',
        description: 'Guide interactif d\'exercices de musculation par groupe musculaire',
        integration_mode: 'redirect'
      }
    ]
  },
  {
    id: 'cuisine',
    name: 'Cuisine',
    icon: 'ChefHat',
    description: 'Recettes et conseils culinaires',
    color: 'from-green-500 to-emerald-500',
    links: [
      {
        id: 92,
        title: 'ChefGPT',
        url: 'https://www.chefgpt.xyz/fr',
        description: 'Assistant culinaire IA pour recettes personnalisées',
        integration_mode: 'webview'
      },
      {
        id: 93,
        title: 'MyFridgeFood',
        url: 'https://myfridgefood.com/',
        description: 'Trouvez des recettes avec les ingrédients de votre frigo',
        integration_mode: 'redirect'
      },
      {
        id: 94,
        title: '750g',
        url: 'https://www.750g.com',
        description: 'Site français de recettes avec vidéos et conseils de chefs',
        integration_mode: 'webview'
      },
      {
        id: 95,
        title: 'Cuisine Libre',
        url: 'https://cuisine-libre.org',
        description: 'Recettes libres et conseils culinaires communautaires',
        integration_mode: 'webview'
      }
    ]
  },
  {
    id: 'musique-audio',
    name: 'Musique & Audio',
    icon: 'Music',
    description: 'Création musicale et streaming audio',
    color: 'from-violet-500 to-purple-500',
    links: [
      {
        id: 96,
        title: 'RadioCast',
        url: 'https://radiocast.co/',
        description: 'Plateforme de diffusion radio en ligne',
        integration_mode: 'webview'
      },
      {
        id: 97,
        title: 'Radio Garden',
        url: 'https://www.radio.garden',
        description: 'Explorez les stations radio du monde entier sur un globe 3D',
        integration_mode: 'webview'
      },
      {
        id: 98,
        title: 'Soundation',
        url: 'https://soundation.com',
        description: 'Studio de production musicale en ligne gratuit',
        integration_mode: 'webview'
      },
      {
        id: 99,
        title: 'NCS',
        url: 'https://ncs.io/',
        description: 'Musique électronique libre de droits pour créateurs',
        integration_mode: 'redirect'
      },
      {
        id: 100,
        title: 'MusicGPT',
        url: 'https://musicgpt.com/',
        description: 'Génération de musique assistée par intelligence artificielle',
        integration_mode: 'webview'
      }
    ]
  },
  {
    id: 'convertisseur',
    name: 'Convertisseur',
    icon: 'RefreshCw',
    description: 'Outils de conversion audio et vidéo',
    color: 'from-cyan-500 to-blue-500',
    links: [
      {
        id: 101,
        title: 'CNVMP3',
        url: 'https://cnvmp3.com/v33',
        description: 'Convertisseur YouTube vers MP3 rapide et gratuit',
        integration_mode: 'webview'
      },
      {
        id: 102,
        title: 'Download Music School',
        url: 'https://downloadmusicschool.com/bandcamp/',
        description: 'Téléchargeur pour musique Bandcamp et autres plateformes',
        integration_mode: 'webview'
      },
      {
        id: 103,
        title: 'DoubleDouble',
        url: 'https://eu.doubledouble.top/',
        description: 'Convertisseur multi-format pour médias en ligne',
        integration_mode: 'redirect'
      },
      {
        id: 104,
        title: 'Cobalt Tools',
        url: 'https://cobalt.tools/',
        description: 'Téléchargeur universel pour réseaux sociaux et plateformes',
        integration_mode: 'webview'
      },
      {
        id: 105,
        title: 'EzConv',
        url: 'https://ezconv.com/',
        description: 'Conversion facile de fichiers audio et vidéo',
        integration_mode: 'webview'
      },
      {
        id: 106,
        title: 'AZMP3',
        url: 'https://azmp3.cc/',
        description: 'Convertisseur YouTube MP3 avec qualité haute définition',
        integration_mode: 'redirect'
      },
      {
        id: 107,
        title: 'Racoon',
        url: 'https://shailen.dedyn.io/racoon/',
        description: 'Outil de téléchargement et conversion multimédia',
        integration_mode: 'webview'
      }
    ]
  },
  {
    id: 'enfant-creativite',
    name: 'Enfant - Créativité',
    icon: 'Palette',
    description: 'Activités créatives et éducatives pour enfants',
    color: 'from-pink-500 to-rose-500',
    links: [
      {
        id: 108,
        title: 'Sketch.io',
        url: 'https://sketch.io/sketchpad/',
        description: 'Application de dessin en ligne simple et intuitive',
        integration_mode: 'webview'
      },
      {
        id: 109,
        title: 'ColorifyAI',
        url: 'https://colorifyai.art/',
        description: 'Coloriage assisté par IA pour créer des œuvres uniques',
        integration_mode: 'webview'
      },
      {
        id: 110,
        title: 'YoPrintables',
        url: 'https://yoprintables.com',
        description: 'Activités imprimables gratuites pour enfants',
        integration_mode: 'webview'
      },
      {
        id: 111,
        title: 'KiddoWorksheets',
        url: 'https://www.kiddoworksheets.com/',
        description: 'Fiches d\'exercices éducatives pour enfants de 3 à 10 ans',
        integration_mode: 'webview'
      }
    ]
  },
  {
    id: 'voyage-culture',
    name: 'Voyage & Culture',
    icon: 'Plane',
    description: 'Découverte culturelle et voyage virtuel',
    color: 'from-teal-500 to-cyan-500',
    links: [
      {
        id: 112,
        title: 'Google Arts & Culture',
        url: 'https://artsandculture.google.com/',
        description: 'Explorez musées, œuvres d\'art et sites historiques mondiaux',
        integration_mode: 'redirect'
      },
      {
        id: 113,
        title: 'Seterra',
        url: 'https://www.seterra.com/',
        description: 'Jeux de géographie pour apprendre pays, capitales et drapeaux',
        integration_mode: 'webview'
      },
      {
        id: 114,
        title: 'Gallerix',
        url: 'https://fr.gallerix.ru/',
        description: 'Galerie virtuelle d\'art avec œuvres de maîtres célèbres',
        integration_mode: 'webview'
      }
    ]
  },
  {
    id: 'divers',
    name: 'Divers',
    icon: 'Sparkles',
    description: 'Outils et ressources diverses',
    color: 'from-indigo-500 to-purple-500',
    links: [
      {
        id: 115,
        title: 'Notable People',
        url: 'https://tjukanovt.github.io/notable-people',
        description: 'Carte interactive des personnalités célèbres par région',
        integration_mode: 'webview'
      }
    ]
  },
  {
    id: 'astuce',
    name: 'Astuce',
    icon: 'Lightbulb',
    description: 'Astuces et outils pratiques du quotidien',
    color: 'from-yellow-500 to-amber-500',
    links: [
      {
        id: 116,
        title: 'Spoken',
        url: 'https://www.spoken.io/',
        description: 'Convertisseur texte vers parole avec voix naturelles',
        integration_mode: 'webview'
      },
      {
        id: 117,
        title: 'Ninite',
        url: 'https://ninite.com/',
        description: 'Installateur automatique de logiciels essentiels pour PC',
        integration_mode: 'redirect'
      },
      {
        id: 118,
        title: 'WiFi Map',
        url: 'https://www.wifimap.io/',
        description: 'Carte mondiale des hotspots WiFi gratuits',
        integration_mode: 'webview'
      },
      {
        id: 119,
        title: 'GeoSpy',
        url: 'https://geospy.ai/',
        description: 'Géolocalisation d\'images par intelligence artificielle',
        integration_mode: 'webview'
      }
    ]
  },
  {
    id: 'telephone',
    name: 'Téléphone',
    icon: 'Phone',
    description: 'Services de téléphonie et SMS temporaires',
    color: 'from-green-500 to-teal-500',
    links: [
      {
        id: 120,
        title: 'SMS24',
        url: 'https://sms24.me/en',
        description: 'Réception de SMS temporaires pour vérifications',
        integration_mode: 'webview'
      },
      {
        id: 121,
        title: 'Receive SMS',
        url: 'https://receive-smss.com/',
        description: 'Numéros temporaires pour recevoir des codes de vérification',
        integration_mode: 'webview'
      }
    ]
  },
  {
    id: 'informatique',
    name: 'Informatique',
    icon: 'Monitor',
    description: 'Outils informatiques et utilitaires web',
    color: 'from-blue-500 to-cyan-500',
    links: [
      {
        id: 122,
        title: 'TinyWow',
        url: 'https://tinywow.com/',
        description: 'Suite d\'outils gratuits pour PDF, images et fichiers',
        integration_mode: 'redirect'
      },
      {
        id: 123,
        title: 'PrePostSEO',
        url: 'https://www.prepostseo.com/',
        description: 'Outils SEO et utilitaires web pour webmasters',
        integration_mode: 'webview'
      }
    ]
  },
  {
    id: 'immobilier',
    name: 'Immobilier',
    icon: 'Home',
    description: 'Outils de design et planification immobilière',
    color: 'from-stone-500 to-gray-600',
    links: [
      {
        id: 124,
        title: 'PlanYourRoom',
        url: 'https://www.planyourroom.com/',
        description: 'Planificateur 3D gratuit pour aménagement intérieur',
        integration_mode: 'redirect'
      },
      {
        id: 125,
        title: 'TopoExport',
        url: 'https://app.topoexport.com/',
        description: 'Export de données topographiques et cartographiques',
        integration_mode: 'webview'
      },
      {
        id: 126,
        title: 'Collov AI',
        url: 'https://collov.ai/',
        description: 'Design d\'intérieur assisté par intelligence artificielle',
        integration_mode: 'webview'
      }
    ]
  }
];

// Fonction utilitaire pour obtenir toutes les catégories
export const getAllCategories = () => categories;

// Fonction utilitaire pour obtenir une catégorie par ID
export const getCategoryById = (id) => categories.find(cat => cat.id === id);

// Fonction utilitaire pour obtenir tous les liens
export const getAllLinks = () => {
  return categories.flatMap(category => 
    category.links.map(link => ({
      ...link,
      category: category.name,
      categoryId: category.id
    }))
  );
};

// Fonction utilitaire pour rechercher dans les liens
export const searchLinks = (query) => {
  const allLinks = getAllLinks();
  const searchTerm = query.toLowerCase();
  
  return allLinks.filter(link => 
    link.title.toLowerCase().includes(searchTerm) ||
    link.description.toLowerCase().includes(searchTerm) ||
    link.category.toLowerCase().includes(searchTerm)
  );
};
