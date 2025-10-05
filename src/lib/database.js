// Configuration de la base de données pour ThemaLinks
import { createClient } from '@supabase/supabase-js';

// Configuration Supabase (sera utilisée quand disponible)
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Schéma de base de données
export const DATABASE_SCHEMA = {
  categories: {
    id: 'TEXT PRIMARY KEY',
    name: 'TEXT NOT NULL',
    icon: 'TEXT NOT NULL',
    description: 'TEXT NOT NULL',
    color: 'TEXT NOT NULL',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
  },
  links: {
    id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
    title: 'TEXT NOT NULL',
    url: 'TEXT NOT NULL',
    description: 'TEXT NOT NULL',
    category_id: 'TEXT NOT NULL',
    integration_mode: 'TEXT NOT NULL CHECK (integration_mode IN ("webview", "redirect"))',
    is_active: 'BOOLEAN DEFAULT TRUE',
    click_count: 'INTEGER DEFAULT 0',
    last_checked: 'TIMESTAMP',
    status: 'TEXT DEFAULT "active" CHECK (status IN ("active", "inactive", "broken"))',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    'FOREIGN KEY (category_id)': 'REFERENCES categories(id) ON DELETE CASCADE'
  },
  user_favorites: {
    id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
    user_id: 'TEXT NOT NULL',
    link_id: 'INTEGER NOT NULL',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    'FOREIGN KEY (link_id)': 'REFERENCES links(id) ON DELETE CASCADE',
    'UNIQUE(user_id, link_id)': ''
  },
  user_history: {
    id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
    user_id: 'TEXT NOT NULL',
    link_id: 'INTEGER NOT NULL',
    visited_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    'FOREIGN KEY (link_id)': 'REFERENCES links(id) ON DELETE CASCADE'
  },
  analytics: {
    id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
    link_id: 'INTEGER NOT NULL',
    event_type: 'TEXT NOT NULL CHECK (event_type IN ("click", "view", "share"))',
    user_agent: 'TEXT',
    ip_address: 'TEXT',
    referrer: 'TEXT',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    'FOREIGN KEY (link_id)': 'REFERENCES links(id) ON DELETE CASCADE'
  }
};

// Fonctions utilitaires pour la base de données
export class DatabaseManager {
  constructor() {
    this.isSupabaseAvailable = false;
    this.localData = null;
    this.init();
  }

  async init() {
    try {
      // Test de connexion Supabase
      const { data, error } = await supabase.from('categories').select('count').limit(1);
      if (!error) {
        this.isSupabaseAvailable = true;
        console.log('✅ Supabase connecté');
      }
    } catch (err) {
      console.log('📦 Mode local activé');
      this.initLocalData();
    }
  }

  initLocalData() {
    // Chargement des données depuis localStorage ou données par défaut
    const stored = localStorage.getItem('themalinks_data');
    if (stored) {
      this.localData = JSON.parse(stored);
    } else {
      // Import des données par défaut
      import('../data/categories.js').then(({ categories }) => {
        this.localData = {
          categories: categories,
          links: categories.flatMap(cat => 
            cat.links.map(link => ({
              ...link,
              category_id: cat.id,
              is_active: true,
              click_count: 0,
              status: 'active',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }))
          ),
          user_favorites: [],
          user_history: [],
          analytics: []
        };
        this.saveLocalData();
      });
    }
  }

  saveLocalData() {
    if (this.localData) {
      localStorage.setItem('themalinks_data', JSON.stringify(this.localData));
    }
  }

  // CRUD Operations
  async getCategories() {
    if (this.isSupabaseAvailable) {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      return { data, error };
    } else {
      return { 
        data: this.localData?.categories || [], 
        error: null 
      };
    }
  }

  async getLinks(categoryId = null) {
    if (this.isSupabaseAvailable) {
      let query = supabase
        .from('links')
        .select(`
          *,
          categories (
            id,
            name,
            icon,
            color
          )
        `)
        .eq('is_active', true);
      
      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }
      
      const { data, error } = await query.order('title');
      return { data, error };
    } else {
      let links = this.localData?.links || [];
      if (categoryId) {
        links = links.filter(link => link.category_id === categoryId);
      }
      
      // Enrichir avec les données de catégorie
      const categories = this.localData?.categories || [];
      const enrichedLinks = links.map(link => ({
        ...link,
        category: categories.find(cat => cat.id === link.category_id)
      }));
      
      return { 
        data: enrichedLinks.filter(link => link.is_active), 
        error: null 
      };
    }
  }

  async searchLinks(query) {
    if (this.isSupabaseAvailable) {
      const { data, error } = await supabase
        .from('links')
        .select(`
          *,
          categories (
            id,
            name,
            icon,
            color
          )
        `)
        .eq('is_active', true)
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .order('title');
      return { data, error };
    } else {
      const links = this.localData?.links || [];
      const categories = this.localData?.categories || [];
      const searchTerm = query.toLowerCase();
      
      const filteredLinks = links
        .filter(link => 
          link.is_active &&
          (link.title.toLowerCase().includes(searchTerm) ||
           link.description.toLowerCase().includes(searchTerm))
        )
        .map(link => ({
          ...link,
          category: categories.find(cat => cat.id === link.category_id)
        }));
      
      return { data: filteredLinks, error: null };
    }
  }

  async incrementClickCount(linkId) {
    if (this.isSupabaseAvailable) {
      const { data, error } = await supabase.rpc('increment_click_count', {
        link_id: linkId
      });
      return { data, error };
    } else {
      if (this.localData?.links) {
        const linkIndex = this.localData.links.findIndex(link => link.id === linkId);
        if (linkIndex !== -1) {
          this.localData.links[linkIndex].click_count += 1;
          this.localData.links[linkIndex].updated_at = new Date().toISOString();
          this.saveLocalData();
        }
      }
      return { data: null, error: null };
    }
  }

  async addToFavorites(userId, linkId) {
    if (this.isSupabaseAvailable) {
      const { data, error } = await supabase
        .from('user_favorites')
        .insert({ user_id: userId, link_id: linkId });
      return { data, error };
    } else {
      if (!this.localData?.user_favorites) {
        this.localData.user_favorites = [];
      }
      
      const exists = this.localData.user_favorites.find(
        fav => fav.user_id === userId && fav.link_id === linkId
      );
      
      if (!exists) {
        this.localData.user_favorites.push({
          id: Date.now(),
          user_id: userId,
          link_id: linkId,
          created_at: new Date().toISOString()
        });
        this.saveLocalData();
      }
      
      return { data: null, error: null };
    }
  }

  async removeFromFavorites(userId, linkId) {
    if (this.isSupabaseAvailable) {
      const { data, error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', userId)
        .eq('link_id', linkId);
      return { data, error };
    } else {
      if (this.localData?.user_favorites) {
        this.localData.user_favorites = this.localData.user_favorites.filter(
          fav => !(fav.user_id === userId && fav.link_id === linkId)
        );
        this.saveLocalData();
      }
      return { data: null, error: null };
    }
  }

  async getFavorites(userId) {
    if (this.isSupabaseAvailable) {
      const { data, error } = await supabase
        .from('user_favorites')
        .select(`
          *,
          links (
            *,
            categories (
              id,
              name,
              icon,
              color
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      return { data, error };
    } else {
      const favorites = this.localData?.user_favorites?.filter(
        fav => fav.user_id === userId
      ) || [];
      
      const links = this.localData?.links || [];
      const categories = this.localData?.categories || [];
      
      const enrichedFavorites = favorites.map(fav => {
        const link = links.find(l => l.id === fav.link_id);
        const category = categories.find(cat => cat.id === link?.category_id);
        return {
          ...fav,
          link: {
            ...link,
            category
          }
        };
      });
      
      return { data: enrichedFavorites, error: null };
    }
  }

  async addToHistory(userId, linkId) {
    if (this.isSupabaseAvailable) {
      const { data, error } = await supabase
        .from('user_history')
        .insert({ user_id: userId, link_id: linkId });
      return { data, error };
    } else {
      if (!this.localData?.user_history) {
        this.localData.user_history = [];
      }
      
      this.localData.user_history.push({
        id: Date.now(),
        user_id: userId,
        link_id: linkId,
        visited_at: new Date().toISOString()
      });
      
      // Garder seulement les 100 derniers éléments
      if (this.localData.user_history.length > 100) {
        this.localData.user_history = this.localData.user_history.slice(-100);
      }
      
      this.saveLocalData();
      return { data: null, error: null };
    }
  }

  async getHistory(userId, limit = 20) {
    if (this.isSupabaseAvailable) {
      const { data, error } = await supabase
        .from('user_history')
        .select(`
          *,
          links (
            *,
            categories (
              id,
              name,
              icon,
              color
            )
          )
        `)
        .eq('user_id', userId)
        .order('visited_at', { ascending: false })
        .limit(limit);
      return { data, error };
    } else {
      const history = this.localData?.user_history
        ?.filter(h => h.user_id === userId)
        ?.slice(-limit)
        ?.reverse() || [];
      
      const links = this.localData?.links || [];
      const categories = this.localData?.categories || [];
      
      const enrichedHistory = history.map(h => {
        const link = links.find(l => l.id === h.link_id);
        const category = categories.find(cat => cat.id === link?.category_id);
        return {
          ...h,
          link: {
            ...link,
            category
          }
        };
      });
      
      return { data: enrichedHistory, error: null };
    }
  }

  async logAnalytics(linkId, eventType, metadata = {}) {
    if (this.isSupabaseAvailable) {
      const { data, error } = await supabase
        .from('analytics')
        .insert({
          link_id: linkId,
          event_type: eventType,
          user_agent: metadata.userAgent,
          ip_address: metadata.ipAddress,
          referrer: metadata.referrer
        });
      return { data, error };
    } else {
      if (!this.localData?.analytics) {
        this.localData.analytics = [];
      }
      
      this.localData.analytics.push({
        id: Date.now(),
        link_id: linkId,
        event_type: eventType,
        user_agent: metadata.userAgent,
        ip_address: metadata.ipAddress,
        referrer: metadata.referrer,
        created_at: new Date().toISOString()
      });
      
      // Garder seulement les 1000 derniers événements
      if (this.localData.analytics.length > 1000) {
        this.localData.analytics = this.localData.analytics.slice(-1000);
      }
      
      this.saveLocalData();
      return { data: null, error: null };
    }
  }
}

// Instance globale
export const db = new DatabaseManager();
