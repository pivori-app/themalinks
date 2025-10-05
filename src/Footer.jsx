import { motion } from 'framer-motion';
import { Heart, Mail, Globe, Sparkles, ExternalLink, FileText, HelpCircle, Book, Headphones, Cookie, Info, Code, Shield } from 'lucide-react';

export default function Footer({ onPageOpen }) {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = {
    categories: [
      { name: 'Streaming', href: '#streaming' },
      { name: 'Gaming', href: '#gaming' },
      { name: 'Apprentissage', href: '#apprendre' },
      { name: 'Outils', href: '#outils' }
    ],
    resources: [
      { name: 'FAQ', action: () => onPageOpen?.('faq'), icon: HelpCircle },
      { name: 'Guide d\'utilisation', action: () => onPageOpen?.('guide'), icon: Book },
      { name: 'Documentation API', action: () => onPageOpen?.('api'), icon: Code },
      { name: 'Support', action: () => onPageOpen?.('support'), icon: Headphones }
    ],
    legal: [
      { name: 'CGU', action: () => onPageOpen?.('cgu'), icon: FileText },
      { name: 'Confidentialité', action: () => onPageOpen?.('privacy'), icon: Shield },
      { name: 'Mentions légales', action: () => onPageOpen?.('mentions'), icon: Info },
      { name: 'Cookies', action: () => onPageOpen?.('cookies'), icon: Cookie }
    ]
  };
  
  return (
    <footer className="relative mt-20 bg-card/50 backdrop-blur-sm border-t border-border/50">
      {/* Effet de dégradé en haut */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Section principale */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo et description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles size={18} className="text-white" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ThemaLinks
              </h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Votre bibliothèque de liens thématiques pour explorer le meilleur du web. 
              Plus de 126 liens soigneusement sélectionnés et organisés.
            </p>
            <div className="flex items-center space-x-4">
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="mailto:contact@themalinks.com"
                className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
                title="Contact"
              >
                <Mail size={16} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="https://themalinks.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
                title="Site web"
              >
                <Globe size={16} />
              </motion.a>
            </div>
          </motion.div>
          
          {/* Catégories populaires */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="font-semibold mb-4 text-foreground">Catégories populaires</h4>
            <ul className="space-y-2">
              {footerLinks.categories.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group"
                  >
                    <span>{link.name}</span>
                    <ExternalLink size={12} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
          
          {/* Ressources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="font-semibold mb-4 text-foreground">Ressources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link, index) => {
                const Icon = link.icon;
                return (
                  <li key={index}>
                    <button
                      onClick={link.action}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group"
                    >
                      <Icon size={14} className="mr-2" />
                      <span>{link.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
          
          {/* Légal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="font-semibold mb-4 text-foreground">Légal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link, index) => {
                const Icon = link.icon;
                return (
                  <li key={index}>
                    <button
                      onClick={link.action}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group"
                    >
                      <Icon size={14} className="mr-2" />
                      <span>{link.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </div>
        
        {/* Séparateur */}
        <div className="border-t border-border/50 pt-8">
          {/* Statistiques */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">126+</div>
              <div className="text-xs text-muted-foreground">Liens actifs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">22</div>
              <div className="text-xs text-muted-foreground">Catégories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">100%</div>
              <div className="text-xs text-muted-foreground">Gratuit</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">24/7</div>
              <div className="text-xs text-muted-foreground">Disponible</div>
            </div>
          </motion.div>
          
          {/* Copyright et crédits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0"
          >
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>© {currentYear} ThemaLinks.</span>
              <span>Fait avec</span>
              <Heart size={14} className="text-red-500 animate-pulse" />
              <span>pour la communauté</span>
            </div>
            
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <span>Propulsé par React & Three.js</span>
              <span>•</span>
              <span>Hébergé sur Vercel</span>
              <span>•</span>
              <span>Authentification Supabase</span>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Effet de particules en arrière-plan */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full"
            style={{
              left: `${20 + i * 20}%`,
              top: `${30 + (i % 2) * 40}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </footer>
  );
}
