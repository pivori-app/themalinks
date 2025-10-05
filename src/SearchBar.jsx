import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';

export default function SearchBar({ onSearch, placeholder = "Rechercher des liens..." }) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };
  
  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative w-full max-w-2xl mx-auto"
    >
      {/* Container de la barre de recherche */}
      <div className={`
        relative flex items-center
        bg-card/80 backdrop-blur-sm border border-border/50
        rounded-2xl shadow-sm hover:shadow-md
        transition-all duration-300
        ${isFocused ? 'border-primary/50 shadow-lg' : ''}
      `}>
        {/* Icône de recherche */}
        <motion.div
          animate={{ 
            scale: isFocused ? 1.1 : 1,
            color: isFocused ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'
          }}
          transition={{ duration: 0.2 }}
          className="absolute left-4 z-10"
        >
          <Search size={20} />
        </motion.div>
        
        {/* Input de recherche */}
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="
            w-full pl-12 pr-12 py-4
            bg-transparent border-none outline-none
            text-foreground placeholder:text-muted-foreground
            text-lg font-medium
          "
        />
        
        {/* Bouton de suppression */}
        {query && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={clearSearch}
            className="
              absolute right-4 z-10
              p-1 rounded-full
              text-muted-foreground hover:text-foreground
              hover:bg-muted/50
              transition-colors duration-200
            "
          >
            <X size={18} />
          </motion.button>
        )}
        
        {/* Effet de brillance au focus */}
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-primary/5 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: isFocused ? '100%' : '-100%' }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </div>
      
      {/* Suggestions ou résultats rapides (optionnel) */}
      {query && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="
            absolute top-full mt-2 w-full
            bg-card/95 backdrop-blur-sm border border-border/50
            rounded-xl shadow-lg z-50
            max-h-60 overflow-y-auto
          "
        >
          <div className="p-3">
            <p className="text-sm text-muted-foreground">
              Recherche en cours pour "{query}"...
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
