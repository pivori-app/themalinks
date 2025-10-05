import { motion } from 'framer-motion';
import { useState } from 'react';
import { ExternalLink, Eye, ArrowRight } from 'lucide-react';

export default function LinkCard({ link, index, onOpen }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleClick = () => {
    onOpen(link);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.05,
        ease: "easeOut"
      }}
      whileHover={{ 
        scale: 1.02,
        y: -5,
        transition: { duration: 0.2 }
      }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Carte principale */}
      <div className="
        relative overflow-hidden rounded-xl p-6 h-full
        bg-card/80 backdrop-blur-sm border border-border/50
        hover:bg-card hover:border-border
        shadow-sm hover:shadow-lg
        transition-all duration-300
        cursor-pointer
      "
      onClick={handleClick}
      >
        {/* Indicateur du mode d'intégration */}
        <div className="absolute top-3 right-3">
          <motion.div
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.2 }}
            className={`
              w-3 h-3 rounded-full
              ${link.integration_mode === 'webview' 
                ? 'bg-green-500' 
                : 'bg-orange-500'
              }
            `}
            title={link.integration_mode === 'webview' ? 'WebView intégrée' : 'Redirection externe'}
          />
        </div>
        
        {/* Contenu */}
        <div className="space-y-3">
          {/* Titre */}
          <div className="flex items-start justify-between pr-6">
            <motion.h3 
              className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200"
              animate={{ x: isHovered ? 3 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {link.title}
            </motion.h3>
          </div>
          
          {/* Description */}
          <motion.p 
            className="text-sm text-muted-foreground leading-relaxed"
            animate={{ x: isHovered ? 3 : 0 }}
            transition={{ duration: 0.2, delay: 0.05 }}
          >
            {link.description}
          </motion.p>
          
          {/* URL */}
          <motion.div 
            className="flex items-center space-x-2 text-xs text-muted-foreground"
            animate={{ x: isHovered ? 3 : 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            <span className="truncate font-mono bg-muted/50 px-2 py-1 rounded">
              {new URL(link.url).hostname}
            </span>
          </motion.div>
        </div>
        
        {/* Bouton d'action */}
        <motion.div
          className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          animate={{ 
            scale: isHovered ? 1 : 0.8,
            opacity: isHovered ? 1 : 0
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center space-x-1 text-primary">
            {link.integration_mode === 'webview' ? (
              <>
                <Eye size={16} />
                <span className="text-xs font-medium">Ouvrir</span>
              </>
            ) : (
              <>
                <ExternalLink size={16} />
                <span className="text-xs font-medium">Visiter</span>
              </>
            )}
            <ArrowRight size={14} />
          </div>
        </motion.div>
        
        {/* Effet de brillance au survol */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: isHovered ? '100%' : '-100%' }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
        
        {/* Bordure animée */}
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-primary/0"
          animate={{ 
            borderColor: isHovered ? 'hsl(var(--primary) / 0.2)' : 'hsl(var(--primary) / 0)'
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
}
