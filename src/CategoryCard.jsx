import { motion } from 'framer-motion';
import { useState } from 'react';
import * as Icons from 'lucide-react';

export default function CategoryCard({ category, onClick, index }) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Récupération de l'icône dynamiquement
  const IconComponent = Icons[category.icon] || Icons.Folder;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ 
        scale: 1.05,
        rotateY: 5,
        rotateX: 5,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.95 }}
      className="group relative cursor-pointer"
      onClick={() => onClick(category)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Carte principale */}
      <div className={`
        relative overflow-hidden rounded-2xl p-6 h-48
        bg-gradient-to-br ${category.color}
        shadow-lg hover:shadow-2xl transition-all duration-300
        border border-white/20 backdrop-blur-sm
      `}>
        {/* Effet de brillance au survol */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: isHovered ? '100%' : '-100%' }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
        
        {/* Particules flottantes */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`,
              }}
              animate={{
                y: [-10, 10, -10],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        
        {/* Contenu de la carte */}
        <div className="relative z-10 h-full flex flex-col justify-between">
          {/* Icône */}
          <motion.div
            animate={{ 
              rotateY: isHovered ? 360 : 0,
              scale: isHovered ? 1.1 : 1
            }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="w-12 h-12 mb-4"
          >
            <IconComponent 
              size={48} 
              className="text-white drop-shadow-lg"
            />
          </motion.div>
          
          {/* Titre et description */}
          <div>
            <motion.h3 
              className="text-xl font-bold text-white mb-2 drop-shadow-md"
              animate={{ x: isHovered ? 5 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {category.name}
            </motion.h3>
            
            <motion.p 
              className="text-white/90 text-sm leading-relaxed drop-shadow-sm"
              animate={{ x: isHovered ? 5 : 0 }}
              transition={{ duration: 0.2, delay: 0.05 }}
            >
              {category.description}
            </motion.p>
          </div>
          
          {/* Nombre de liens */}
          <motion.div
            className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-white text-xs font-medium">
              {category.links.length} liens
            </span>
          </motion.div>
        </div>
        
        {/* Effet de bordure animée */}
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-white/0"
          animate={{ 
            borderColor: isHovered ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0)'
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      {/* Ombre projetée */}
      <motion.div
        className={`
          absolute inset-0 rounded-2xl -z-10
          bg-gradient-to-br ${category.color}
          blur-xl opacity-0 group-hover:opacity-30
          transition-opacity duration-300
        `}
        style={{ transform: 'translateY(8px)' }}
      />
    </motion.div>
  );
}
