import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  SafeAreaView,
  Alert,
  Linking,
  Modal,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { WebView } from 'react-native-webview';
import { categories } from './data/categories';
import { supabase, signInWithGoogle, signInWithMagicLink, signOut, getCurrentSession, onAuthStateChange } from './lib/supabase';

const { width, height } = Dimensions.get('window');
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Hook d'authentification
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier la session existante
    getCurrentSession().then(({ session }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Écouter les changements d'auth
    const { data: { subscription } } = onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  return { user, loading };
};

// Composant Modal d'authentification
const AuthModal = ({ visible, onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('login'); // 'login' ou 'magic'

  const handleGoogleAuth = async () => {
    setLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      Alert.alert('Erreur', error.message);
    }
    setLoading(false);
  };

  const handleMagicLink = async () => {
    if (!email.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir votre email');
      return;
    }
    
    setLoading(true);
    const { error } = await signInWithMagicLink(email);
    if (error) {
      Alert.alert('Erreur', error.message);
    } else {
      Alert.alert('Succès', 'Vérifiez votre email pour le lien de connexion');
      onClose();
    }
    setLoading(false);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <BlurView intensity={20} style={styles.modalBlur}>
          <View style={styles.modalContent}>
            <LinearGradient
              colors={['#1e1b4b', '#312e81', '#3730a3']}
              style={styles.modalGradient}
            >
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>

              <Text style={styles.modalTitle}>
                {mode === 'login' ? 'Connexion' : 'Magic Link'}
              </Text>

              {mode === 'login' ? (
                <View style={styles.authButtons}>
                  <TouchableOpacity
                    style={styles.googleButton}
                    onPress={handleGoogleAuth}
                    disabled={loading}
                  >
                    <Text style={styles.googleButtonText}>
                      {loading ? 'Connexion...' : '🔐 Continuer avec Google'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.magicButton}
                    onPress={() => setMode('magic')}
                  >
                    <Text style={styles.magicButtonText}>
                      ✉️ Connexion par email
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.magicForm}>
                  <TextInput
                    style={styles.emailInput}
                    placeholder="Votre email"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  
                  <TouchableOpacity
                    style={styles.sendButton}
                    onPress={handleMagicLink}
                    disabled={loading}
                  >
                    <Text style={styles.sendButtonText}>
                      {loading ? 'Envoi...' : 'Envoyer le lien'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => setMode('login')}
                  >
                    <Text style={styles.backButtonText}>← Retour</Text>
                  </TouchableOpacity>
                </View>
              )}
            </LinearGradient>
          </View>
        </BlurView>
      </View>
    </Modal>
  );
};

// Composant de carte de catégorie
const CategoryCard = ({ category, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.categoryCard}>
    <LinearGradient
      colors={category.color}
      style={styles.categoryGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.categoryIcon}>{category.icon}</Text>
      <Text style={styles.categoryName}>{category.name}</Text>
      <Text style={styles.categoryDescription}>{category.description}</Text>
      <Text style={styles.categoryCount}>{category.links.length} liens</Text>
    </LinearGradient>
  </TouchableOpacity>
);

// Composant de carte de lien
const LinkCard = ({ link, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.linkCard}>
    <BlurView intensity={20} style={styles.linkBlur}>
      <Text style={styles.linkTitle}>{link.title}</Text>
      <Text style={styles.linkDescription}>{link.description}</Text>
      <Text style={styles.linkUrl}>{link.url}</Text>
    </BlurView>
  </TouchableOpacity>
);

// Composant Footer
const Footer = ({ onPagePress }) => (
  <View style={styles.footer}>
    <LinearGradient
      colors={['#1F2937', '#111827']}
      style={styles.footerGradient}
    >
      <View style={styles.footerContent}>
        <View style={styles.footerSection}>
          <Text style={styles.footerTitle}>✨ ThemaLinks</Text>
          <Text style={styles.footerDescription}>
            Votre bibliothèque de liens thématiques pour explorer le meilleur du web.
          </Text>
        </View>

        <View style={styles.footerLinks}>
          <View style={styles.footerColumn}>
            <Text style={styles.footerColumnTitle}>Ressources</Text>
            <TouchableOpacity onPress={() => onPagePress('faq')}>
              <Text style={styles.footerLink}>FAQ</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onPagePress('guide')}>
              <Text style={styles.footerLink}>Guide d'utilisation</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onPagePress('api')}>
              <Text style={styles.footerLink}>Documentation API</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onPagePress('support')}>
              <Text style={styles.footerLink}>Support</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footerColumn}>
            <Text style={styles.footerColumnTitle}>Légal</Text>
            <TouchableOpacity onPress={() => onPagePress('cgu')}>
              <Text style={styles.footerLink}>CGU</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onPagePress('confidentialite')}>
              <Text style={styles.footerLink}>Confidentialité</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onPagePress('mentions')}>
              <Text style={styles.footerLink}>Mentions légales</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onPagePress('cookies')}>
              <Text style={styles.footerLink}>Cookies</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footerStats}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>126+</Text>
            <Text style={styles.statLabel}>Liens actifs</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>22</Text>
            <Text style={styles.statLabel}>Catégories</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>100%</Text>
            <Text style={styles.statLabel}>Gratuit</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>24/7</Text>
            <Text style={styles.statLabel}>Disponible</Text>
          </View>
        </View>

        <Text style={styles.footerCopyright}>
          © 2025 ThemaLinks. Fait avec ❤️ pour la communauté
        </Text>
      </View>
    </LinearGradient>
  </View>
);

// Écran d'accueil
const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCategories, setFilteredCategories] = useState(categories);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [searchQuery]);

  const handleCategoryPress = (category) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    navigation.navigate('Category', { category });
  };

  const handlePagePress = (page) => {
    navigation.navigate('LegalPage', { page });
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1e1b4b', '#312e81', '#3730a3']}
        style={styles.background}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.logo}>✨ ThemaLinks</Text>
            {user ? (
              <TouchableOpacity
                onPress={() => navigation.navigate('Profile')}
                style={styles.profileButton}
              >
                <Text style={styles.profileButtonText}>👤 Profil</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => setShowAuthModal(true)}
                style={styles.loginButton}
              >
                <Text style={styles.loginButtonText}>🔐 Connexion</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.subtitle}>Découvrez le Web</Text>
        </View>

        {/* Barre de recherche */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher parmi plus de 126 liens..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Grille des catégories */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Explorez par catégorie</Text>
          <View style={styles.categoriesGrid}>
            {filteredCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onPress={() => handleCategoryPress(category)}
              />
            ))}
          </View>

          {/* Footer */}
          <Footer onPagePress={handlePagePress} />
        </ScrollView>

        {/* Modal d'authentification */}
        <AuthModal
          visible={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

// Écran de catégorie
const CategoryScreen = ({ route, navigation }) => {
  const { category } = route.params;

  const handleLinkPress = (link) => {
    Alert.alert(
      'Ouvrir le lien',
      `Voulez-vous ouvrir ${link.title} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'WebView', onPress: () => navigation.navigate('WebView', { link }) },
        { text: 'Navigateur', onPress: () => Linking.openURL(link.url) }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={category.color}
        style={styles.background}
      >
        {/* Header de catégorie */}
        <View style={styles.categoryHeader}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>← Retour</Text>
          </TouchableOpacity>
          <Text style={styles.categoryHeaderIcon}>{category.icon}</Text>
          <Text style={styles.categoryHeaderName}>{category.name}</Text>
          <Text style={styles.categoryHeaderDescription}>{category.description}</Text>
        </View>

        {/* Liste des liens */}
        <ScrollView style={styles.linksContainer} showsVerticalScrollIndicator={false}>
          {category.links.map((link) => (
            <LinkCard
              key={link.id}
              link={link}
              onPress={() => handleLinkPress(link)}
            />
          ))}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

// Écran WebView
const WebViewScreen = ({ route, navigation }) => {
  const { link } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.webViewHeader}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.webViewBackButton}
        >
          <Text style={styles.webViewBackText}>← {link.title}</Text>
        </TouchableOpacity>
      </View>
      <WebView
        source={{ uri: link.url }}
        style={styles.webView}
        startInLoadingState={true}
        scalesPageToFit={true}
      />
    </SafeAreaView>
  );
};

// Écran de profil utilisateur
const ProfileScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            await signOut();
            setLoading(false);
            navigation.navigate('Home');
          }
        }
      ]
    );
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#1e1b4b', '#312e81']}
          style={styles.background}
        >
          <View style={styles.centerContent}>
            <Text style={styles.comingSoonIcon}>🔐</Text>
            <Text style={styles.comingSoonTitle}>Connexion requise</Text>
            <Text style={styles.comingSoonText}>
              Connectez-vous pour accéder à votre profil
            </Text>
            <TouchableOpacity
              style={styles.loginPromptButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.loginPromptButtonText}>Se connecter</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1e1b4b', '#312e81']}
        style={styles.background}
      >
        <ScrollView style={styles.profileContainer}>
          <View style={styles.profileHeader}>
            <Text style={styles.profileIcon}>👤</Text>
            <Text style={styles.profileName}>
              {user.user_metadata?.full_name || user.email}
            </Text>
            <Text style={styles.profileEmail}>{user.email}</Text>
          </View>

          <View style={styles.profileSections}>
            <TouchableOpacity style={styles.profileSection}>
              <Text style={styles.profileSectionIcon}>⭐</Text>
              <Text style={styles.profileSectionTitle}>Mes Favoris</Text>
              <Text style={styles.profileSectionArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.profileSection}>
              <Text style={styles.profileSectionIcon}>📊</Text>
              <Text style={styles.profileSectionTitle}>Historique</Text>
              <Text style={styles.profileSectionArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.profileSection}>
              <Text style={styles.profileSectionIcon}>⚙️</Text>
              <Text style={styles.profileSectionTitle}>Paramètres</Text>
              <Text style={styles.profileSectionArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.profileSection, styles.dangerSection]}
              onPress={handleSignOut}
              disabled={loading}
            >
              <Text style={styles.profileSectionIcon}>🚪</Text>
              <Text style={styles.profileSectionTitle}>
                {loading ? 'Déconnexion...' : 'Déconnexion'}
              </Text>
              <Text style={styles.profileSectionArrow}>→</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

// Écran des pages légales
const LegalPageScreen = ({ route, navigation }) => {
  const { page } = route.params;
  
  const getPageContent = (pageType) => {
    const contents = {
      faq: {
        title: 'FAQ - Questions Fréquentes',
        content: 'Retrouvez ici les réponses aux questions les plus fréquemment posées sur ThemaLinks...'
      },
      guide: {
        title: 'Guide d\'utilisation',
        content: 'Découvrez comment utiliser ThemaLinks pour explorer le web efficacement...'
      },
      api: {
        title: 'Documentation API',
        content: 'Documentation technique pour les développeurs souhaitant intégrer ThemaLinks...'
      },
      support: {
        title: 'Support',
        content: 'Besoin d\'aide ? Contactez notre équipe de support...'
      },
      cgu: {
        title: 'Conditions Générales d\'Utilisation',
        content: 'Les présentes conditions générales d\'utilisation régissent l\'usage de ThemaLinks...'
      },
      confidentialite: {
        title: 'Politique de Confidentialité',
        content: 'Nous respectons votre vie privée. Cette politique explique comment nous collectons et utilisons vos données...'
      },
      mentions: {
        title: 'Mentions Légales',
        content: 'Informations légales concernant ThemaLinks et son éditeur...'
      },
      cookies: {
        title: 'Politique des Cookies',
        content: 'Information sur l\'utilisation des cookies sur ThemaLinks...'
      }
    };
    
    return contents[pageType] || { title: 'Page non trouvée', content: 'Cette page n\'existe pas.' };
  };

  const pageContent = getPageContent(page);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1e1b4b', '#312e81']}
        style={styles.background}
      >
        <View style={styles.legalHeader}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>← Retour</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.legalContent}>
          <Text style={styles.legalTitle}>{pageContent.title}</Text>
          <Text style={styles.legalText}>{pageContent.content}</Text>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

// Écran de favoris
const FavoritesScreen = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#1e1b4b', '#312e81']}
          style={styles.background}
        >
          <View style={styles.centerContent}>
            <Text style={styles.comingSoonIcon}>🔐</Text>
            <Text style={styles.comingSoonTitle}>Connexion requise</Text>
            <Text style={styles.comingSoonText}>
              Connectez-vous pour voir vos favoris
            </Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1e1b4b', '#312e81']}
        style={styles.background}
      >
        <View style={styles.centerContent}>
          <Text style={styles.comingSoonIcon}>⭐</Text>
          <Text style={styles.comingSoonTitle}>Mes Favoris</Text>
          <Text style={styles.comingSoonText}>
            Vos liens favoris apparaîtront ici prochainement
          </Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

// Navigation par onglets
const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: styles.tabBar,
      tabBarActiveTintColor: '#8B5CF6',
      tabBarInactiveTintColor: '#6B7280',
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarLabel: 'Accueil',
        tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>🏠</Text>,
      }}
    />
    <Tab.Screen
      name="Favorites"
      component={FavoritesScreen}
      options={{
        tabBarLabel: 'Favoris',
        tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>⭐</Text>,
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarLabel: 'Profil',
        tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>👤</Text>,
      }}
    />
  </Tab.Navigator>
);

// Navigation principale
const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen name="Category" component={CategoryScreen} />
      <Stack.Screen name="WebView" component={WebViewScreen} />
      <Stack.Screen name="LegalPage" component={LegalPageScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

// App principale
export default function App() {
  return (
    <>
      <AppNavigator />
      <StatusBar style="light" />
    </>
  );
}

// Styles complets
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  loginButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.8)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  profileButton: {
    backgroundColor: 'rgba(34, 197, 94, 0.8)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  profileButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 18,
    color: '#E5E7EB',
    opacity: 0.8,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  categoryCard: {
    width: (width - 60) / 2,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  categoryGradient: {
    padding: 20,
    minHeight: 140,
    justifyContent: 'space-between',
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 8,
  },
  categoryCount: {
    fontSize: 11,
    color: '#FFFFFF',
    opacity: 0.6,
  },
  categoryHeader: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  categoryHeaderIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  categoryHeaderName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  categoryHeaderDescription: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
    textAlign: 'center',
  },
  linksContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  linkCard: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
  linkBlur: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  linkTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  linkDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 8,
  },
  linkUrl: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.6,
  },
  webViewHeader: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  webViewBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  webViewBackText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  webView: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  comingSoonIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  comingSoonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  comingSoonText: {
    fontSize: 16,
    color: '#E5E7EB',
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 30,
  },
  loginPromptButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  loginPromptButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  profileContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  profileIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  profileEmail: {
    fontSize: 16,
    color: '#E5E7EB',
    opacity: 0.8,
  },
  profileSections: {
    paddingBottom: 40,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
  },
  dangerSection: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  profileSectionIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  profileSectionTitle: {
    flex: 1,
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  profileSectionArrow: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.6,
  },
  legalHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  legalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  legalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  legalText: {
    fontSize: 16,
    color: '#E5E7EB',
    lineHeight: 24,
    marginBottom: 40,
  },
  footer: {
    marginTop: 40,
  },
  footerGradient: {
    padding: 30,
  },
  footerContent: {
    alignItems: 'center',
  },
  footerSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  footerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  footerDescription: {
    fontSize: 14,
    color: '#E5E7EB',
    textAlign: 'center',
    opacity: 0.8,
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  footerColumn: {
    alignItems: 'center',
  },
  footerColumnTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  footerLink: {
    fontSize: 14,
    color: '#8B5CF6',
    marginBottom: 8,
  },
  footerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  statLabel: {
    fontSize: 12,
    color: '#E5E7EB',
    opacity: 0.8,
  },
  footerCopyright: {
    fontSize: 12,
    color: '#E5E7EB',
    opacity: 0.6,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBlur: {
    width: '90%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalContent: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalGradient: {
    padding: 30,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 30,
    marginTop: 20,
  },
  authButtons: {
    width: '100%',
  },
  googleButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 15,
  },
  googleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  magicButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.8)',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  magicButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  magicForm: {
    width: '100%',
  },
  emailInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  sendButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 15,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  tabBar: {
    backgroundColor: '#1F2937',
    borderTopWidth: 0,
    paddingBottom: 5,
    paddingTop: 5,
    height: 60,
  },
  tabIcon: {
    fontSize: 20,
  },
});
