import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

// Service d'authentification
export class AuthService {
  constructor() {
    this.user = null;
    this.session = null;
    this.loading = true;
    this.listeners = new Set();
  }

  // Initialisation de l'auth
  async initialize() {
    try {
      // Récupérer la session actuelle
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Erreur lors de la récupération de la session:', error);
      } else {
        this.session = session;
        this.user = session?.user || null;
      }

      // Écouter les changements d'auth
      supabase.auth.onAuthStateChange((event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        this.session = session;
        this.user = session?.user || null;
        this.notifyListeners();
      });

      this.loading = false;
      this.notifyListeners();
    } catch (error) {
      console.error('Erreur d\'initialisation auth:', error);
      this.loading = false;
      this.notifyListeners();
    }
  }

  // Connexion avec Google
  async signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        throw error;
      }

      return { success: true, data };
    } catch (error) {
      console.error('Erreur connexion Google:', error);
      return { success: false, error: error.message };
    }
  }

  // Connexion avec Magic Link
  async signInWithMagicLink(email) {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
          shouldCreateUser: true
        }
      });

      if (error) {
        throw error;
      }

      return { 
        success: true, 
        message: 'Un lien de connexion a été envoyé à votre email',
        data 
      };
    } catch (error) {
      console.error('Erreur Magic Link:', error);
      return { success: false, error: error.message };
    }
  }

  // Déconnexion
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }

      this.user = null;
      this.session = null;
      this.notifyListeners();
      
      return { success: true };
    } catch (error) {
      console.error('Erreur déconnexion:', error);
      return { success: false, error: error.message };
    }
  }

  // Mise à jour du profil utilisateur
  async updateProfile(updates) {
    try {
      if (!this.user) {
        throw new Error('Utilisateur non connecté');
      }

      const { data, error } = await supabase.auth.updateUser({
        data: updates
      });

      if (error) {
        throw error;
      }

      this.notifyListeners();
      return { success: true, data };
    } catch (error) {
      console.error('Erreur mise à jour profil:', error);
      return { success: false, error: error.message };
    }
  }

  // Récupérer les favoris de l'utilisateur
  async getFavorites() {
    try {
      if (!this.user) {
        return { success: true, data: [] };
      }

      const { data, error } = await supabase
        .from('user_favorites')
        .select('link_id, created_at')
        .eq('user_id', this.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Erreur récupération favoris:', error);
      return { success: false, error: error.message };
    }
  }

  // Ajouter/Supprimer un favori
  async toggleFavorite(linkId) {
    try {
      if (!this.user) {
        throw new Error('Connexion requise pour les favoris');
      }

      // Vérifier si déjà en favori
      const { data: existing } = await supabase
        .from('user_favorites')
        .select('id')
        .eq('user_id', this.user.id)
        .eq('link_id', linkId)
        .single();

      if (existing) {
        // Supprimer des favoris
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', this.user.id)
          .eq('link_id', linkId);

        if (error) throw error;
        return { success: true, action: 'removed' };
      } else {
        // Ajouter aux favoris
        const { error } = await supabase
          .from('user_favorites')
          .insert({
            user_id: this.user.id,
            link_id: linkId
          });

        if (error) throw error;
        return { success: true, action: 'added' };
      }
    } catch (error) {
      console.error('Erreur toggle favori:', error);
      return { success: false, error: error.message };
    }
  }

  // Enregistrer l'historique de navigation
  async saveToHistory(linkId, categoryId) {
    try {
      if (!this.user) {
        return { success: true }; // Pas d'erreur si non connecté
      }

      const { error } = await supabase
        .from('user_history')
        .insert({
          user_id: this.user.id,
          link_id: linkId,
          category_id: categoryId,
          visited_at: new Date().toISOString()
        });

      if (error) {
        console.error('Erreur sauvegarde historique:', error);
      }

      return { success: true };
    } catch (error) {
      console.error('Erreur historique:', error);
      return { success: false, error: error.message };
    }
  }

  // Récupérer l'historique
  async getHistory(limit = 50) {
    try {
      if (!this.user) {
        return { success: true, data: [] };
      }

      const { data, error } = await supabase
        .from('user_history')
        .select('link_id, category_id, visited_at')
        .eq('user_id', this.user.id)
        .order('visited_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Erreur récupération historique:', error);
      return { success: false, error: error.message };
    }
  }

  // Gestion des listeners
  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback({
          user: this.user,
          session: this.session,
          loading: this.loading
        });
      } catch (error) {
        console.error('Erreur listener auth:', error);
      }
    });
  }

  // Getters
  get isAuthenticated() {
    return !!this.user;
  }

  get userEmail() {
    return this.user?.email || null;
  }

  get userName() {
    return this.user?.user_metadata?.full_name || 
           this.user?.user_metadata?.name || 
           this.user?.email?.split('@')[0] || 
           'Utilisateur';
  }

  get userAvatar() {
    return this.user?.user_metadata?.avatar_url || 
           this.user?.user_metadata?.picture || 
           null;
  }
}

// Instance globale
export const authService = new AuthService();

// Initialisation automatique
if (typeof window !== 'undefined') {
  authService.initialize().catch(console.error);
}
