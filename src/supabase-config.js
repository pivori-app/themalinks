// Configuration Supabase optimisée pour production
import { createClient } from '@supabase/supabase-js';

// Configuration sécurisée avec variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Options de configuration optimisées
const supabaseOptions = {
  auth: {
    // Configuration OAuth
    redirectTo: `${window.location.origin}/auth/callback`,
    // Persistance de session sécurisée
    persistSession: true,
    // Détection automatique de session
    autoRefreshToken: true,
    // Stockage sécurisé
    storage: window.localStorage,
    // Configuration des cookies
    cookieOptions: {
      name: 'themalinks-auth',
      lifetime: 60 * 60 * 24 * 7, // 7 jours
      domain: window.location.hostname,
      path: '/',
      sameSite: 'lax'
    }
  },
  // Configuration de la base de données
  db: {
    schema: 'public'
  },
  // Configuration temps réel
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  // Configuration globale
  global: {
    headers: {
      'X-Client-Info': 'themalinks-web'
    }
  }
};

// Création du client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, supabaseOptions);

// Fonction de vérification de la configuration
export const checkSupabaseConfig = () => {
  const isConfigured = supabaseUrl !== 'https://your-project.supabase.co' && 
                      supabaseAnonKey !== 'your-anon-key';
  
  if (!isConfigured) {
    console.warn('⚠️ Supabase non configuré - Mode localStorage activé');
    return false;
  }
  
  console.log('✅ Supabase configuré et prêt');
  return true;
};

// Fonction d'initialisation avec fallback
export const initializeSupabase = async () => {
  try {
    if (!checkSupabaseConfig()) {
      return { success: false, mode: 'localStorage' };
    }

    // Test de connexion
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Erreur Supabase:', error);
      return { success: false, mode: 'localStorage', error };
    }

    return { success: true, mode: 'supabase', session: data.session };
  } catch (error) {
    console.error('Erreur initialisation Supabase:', error);
    return { success: false, mode: 'localStorage', error };
  }
};

// Schéma de base de données optimisé
export const databaseSchema = {
  // Table des utilisateurs (gérée par Supabase Auth)
  profiles: {
    id: 'uuid PRIMARY KEY REFERENCES auth.users(id)',
    email: 'text',
    full_name: 'text',
    avatar_url: 'text',
    bio: 'text',
    website: 'text',
    location: 'text',
    preferences: 'jsonb DEFAULT \'{}\'',
    created_at: 'timestamp with time zone DEFAULT now()',
    updated_at: 'timestamp with time zone DEFAULT now()'
  },

  // Table des catégories
  categories: {
    id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
    name: 'text NOT NULL',
    description: 'text',
    icon: 'text',
    color: 'text',
    gradient: 'text',
    order_index: 'integer DEFAULT 0',
    is_active: 'boolean DEFAULT true',
    created_at: 'timestamp with time zone DEFAULT now()',
    updated_at: 'timestamp with time zone DEFAULT now()'
  },

  // Table des liens
  links: {
    id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
    category_id: 'uuid REFERENCES categories(id) ON DELETE CASCADE',
    title: 'text NOT NULL',
    description: 'text',
    url: 'text NOT NULL',
    icon: 'text',
    integration_mode: 'text DEFAULT \'redirect\'', // 'webview' ou 'redirect'
    is_active: 'boolean DEFAULT true',
    click_count: 'integer DEFAULT 0',
    order_index: 'integer DEFAULT 0',
    metadata: 'jsonb DEFAULT \'{}\'',
    created_at: 'timestamp with time zone DEFAULT now()',
    updated_at: 'timestamp with time zone DEFAULT now()'
  },

  // Table des favoris utilisateur
  user_favorites: {
    id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
    user_id: 'uuid REFERENCES auth.users(id) ON DELETE CASCADE',
    link_id: 'uuid REFERENCES links(id) ON DELETE CASCADE',
    added_at: 'timestamp with time zone DEFAULT now()',
    notes: 'text',
    // Contrainte d'unicité
    'UNIQUE(user_id, link_id)': ''
  },

  // Table de l'historique utilisateur
  user_history: {
    id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
    user_id: 'uuid REFERENCES auth.users(id) ON DELETE CASCADE',
    link_id: 'uuid REFERENCES links(id) ON DELETE CASCADE',
    visited_at: 'timestamp with time zone DEFAULT now()',
    visit_count: 'integer DEFAULT 1',
    session_id: 'text',
    user_agent: 'text',
    referrer: 'text'
  },

  // Table des analytics utilisateur
  user_analytics: {
    id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
    user_id: 'uuid REFERENCES auth.users(id) ON DELETE CASCADE',
    link_id: 'uuid REFERENCES links(id) ON DELETE CASCADE',
    category_id: 'uuid REFERENCES categories(id)',
    event_type: 'text NOT NULL', // 'click', 'view', 'favorite', etc.
    event_data: 'jsonb DEFAULT \'{}\'',
    created_at: 'timestamp with time zone DEFAULT now()',
    session_id: 'text',
    user_agent: 'text',
    ip_address: 'inet'
  },

  // Table de vérification des liens
  link_checks: {
    id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
    link_id: 'uuid REFERENCES links(id) ON DELETE CASCADE',
    status: 'text NOT NULL', // 'accessible', 'inaccessible', 'error'
    status_code: 'integer',
    response_time: 'integer',
    error_message: 'text',
    checked_at: 'timestamp with time zone DEFAULT now()',
    checked_by: 'text DEFAULT \'system\''
  }
};

// Politiques RLS (Row Level Security)
export const rlsPolicies = {
  profiles: [
    'ALTER TABLE profiles ENABLE ROW LEVEL SECURITY',
    'CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id)',
    'CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id)'
  ],
  
  user_favorites: [
    'ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY',
    'CREATE POLICY "Users can manage own favorites" ON user_favorites FOR ALL USING (auth.uid() = user_id)'
  ],
  
  user_history: [
    'ALTER TABLE user_history ENABLE ROW LEVEL SECURITY',
    'CREATE POLICY "Users can view own history" ON user_history FOR SELECT USING (auth.uid() = user_id)',
    'CREATE POLICY "Users can insert own history" ON user_history FOR INSERT WITH CHECK (auth.uid() = user_id)'
  ],
  
  user_analytics: [
    'ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY',
    'CREATE POLICY "Users can view own analytics" ON user_analytics FOR SELECT USING (auth.uid() = user_id)',
    'CREATE POLICY "Users can insert own analytics" ON user_analytics FOR INSERT WITH CHECK (auth.uid() = user_id)'
  ],
  
  // Tables publiques (lecture seule pour tous)
  categories: [
    'ALTER TABLE categories ENABLE ROW LEVEL SECURITY',
    'CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (is_active = true)'
  ],
  
  links: [
    'ALTER TABLE links ENABLE ROW LEVEL SECURITY',
    'CREATE POLICY "Links are viewable by everyone" ON links FOR SELECT USING (is_active = true)'
  ],
  
  link_checks: [
    'ALTER TABLE link_checks ENABLE ROW LEVEL SECURITY',
    'CREATE POLICY "Link checks are viewable by everyone" ON link_checks FOR SELECT USING (true)'
  ]
};

// Fonctions utilitaires
export const supabaseUtils = {
  // Fonction de migration des données locales vers Supabase
  migrateLocalData: async (localData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      // Migrer les favoris
      if (localData.favorites && localData.favorites.length > 0) {
        const { error: favError } = await supabase
          .from('user_favorites')
          .upsert(
            localData.favorites.map(fav => ({
              user_id: user.id,
              link_id: fav.id,
              added_at: fav.addedAt,
              notes: fav.notes || null
            }))
          );
        
        if (favError) console.error('Erreur migration favoris:', favError);
      }

      // Migrer l'historique
      if (localData.history && localData.history.length > 0) {
        const { error: histError } = await supabase
          .from('user_history')
          .upsert(
            localData.history.map(hist => ({
              user_id: user.id,
              link_id: hist.id,
              visited_at: hist.visitedAt,
              visit_count: hist.visitCount || 1,
              session_id: hist.sessionId || 'migrated'
            }))
          );
        
        if (histError) console.error('Erreur migration historique:', histError);
      }

      return { success: true };
    } catch (error) {
      console.error('Erreur migration:', error);
      return { success: false, error };
    }
  },

  // Fonction de sauvegarde des données
  backupUserData: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      const [favorites, history, analytics] = await Promise.all([
        supabase.from('user_favorites').select('*').eq('user_id', user.id),
        supabase.from('user_history').select('*').eq('user_id', user.id),
        supabase.from('user_analytics').select('*').eq('user_id', user.id)
      ]);

      const backup = {
        user: user,
        favorites: favorites.data || [],
        history: history.data || [],
        analytics: analytics.data || [],
        exportedAt: new Date().toISOString()
      };

      return { success: true, data: backup };
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      return { success: false, error };
    }
  },

  // Fonction de nettoyage des données anciennes
  cleanupOldData: async (daysToKeep = 90) => {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      // Nettoyer l'historique ancien
      const { error: histError } = await supabase
        .from('user_history')
        .delete()
        .eq('user_id', user.id)
        .lt('visited_at', cutoffDate.toISOString());

      // Nettoyer les analytics anciennes
      const { error: analyticsError } = await supabase
        .from('user_analytics')
        .delete()
        .eq('user_id', user.id)
        .lt('created_at', cutoffDate.toISOString());

      return { 
        success: true, 
        errors: [histError, analyticsError].filter(Boolean) 
      };
    } catch (error) {
      console.error('Erreur nettoyage:', error);
      return { success: false, error };
    }
  }
};

// Export par défaut
export default supabase;
