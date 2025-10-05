import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User, 
  Heart, 
  History, 
  Settings, 
  Trash2,
  Edit3,
  Save,
  AlertTriangle,
  Mail,
  Calendar,
  Shield,
  Download,
  Upload
} from 'lucide-react';
import { useAuth, useFavorites, useHistory } from '../hooks/useAuth';

const BackOffice = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: '',
    bio: '',
    website: '',
    location: ''
  });

  const { user, userName, userEmail, userAvatar, signOut, updateProfile } = useAuth();
  const { favorites, toggleFavorite, loadFavorites } = useFavorites();
  const { history, loadHistory } = useHistory();

  // Sauvegarder les modifications du profil
  const handleSaveProfile = async () => {
    try {
      const result = await updateProfile(profileData);
      if (result.success) {
        setIsEditing(false);
        // Afficher un message de succès
      }
    } catch (error) {
      console.error('Erreur sauvegarde profil:', error);
    }
  };

  // Supprimer le compte utilisateur
  const handleDeleteAccount = async () => {
    try {
      // Ici on implémenterait la suppression du compte
      console.log('Suppression du compte...');
      await signOut();
      onClose();
    } catch (error) {
      console.error('Erreur suppression compte:', error);
    }
  };

  // Exporter les données utilisateur
  const handleExportData = () => {
    const userData = {
      profile: {
        email: userEmail,
        name: userName,
        created_at: user?.created_at
      },
      favorites: favorites,
      history: history
    };

    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `themalinks-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  if (!isOpen || !user) return null;

  const tabs = [
    { id: 'profile', label: 'Mon Profil', icon: User },
    { id: 'favorites', label: 'Mes Favoris', icon: Heart },
    { id: 'history', label: 'Historique', icon: History },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ];

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
              <div>
                <h2 className="text-2xl font-bold">Back Office</h2>
                <p className="text-blue-100">Gestion de votre compte ThemaLinks</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex h-[600px]">
            {/* Sidebar */}
            <div className="w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
              <div className="p-4">
                <div className="flex items-center space-x-3 mb-6">
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt={userName}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{userName}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{userEmail}</p>
                  </div>
                </div>

                <nav className="space-y-2">
                  {tabs.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        activeTab === id
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Informations personnelles
                      </h3>
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                        <span>{isEditing ? 'Sauvegarder' : 'Modifier'}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Nom d'affichage
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={profileData.displayName}
                            onChange={(e) => setProfileData({...profileData, displayName: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                        ) : (
                          <p className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-white">
                            {userName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email
                        </label>
                        <p className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-white">
                          {userEmail}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Localisation
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={profileData.location}
                            onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                            placeholder="Votre ville, pays"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                        ) : (
                          <p className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-white">
                            {profileData.location || 'Non renseigné'}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Site web
                        </label>
                        {isEditing ? (
                          <input
                            type="url"
                            value={profileData.website}
                            onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                            placeholder="https://votre-site.com"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                        ) : (
                          <p className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-white">
                            {profileData.website || 'Non renseigné'}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Biographie
                      </label>
                      {isEditing ? (
                        <textarea
                          value={profileData.bio}
                          onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                          placeholder="Parlez-nous de vous..."
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      ) : (
                        <p className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-white min-h-[100px]">
                          {profileData.bio || 'Aucune biographie renseignée'}
                        </p>
                      )}
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 mb-2">
                        <Calendar className="w-5 h-5" />
                        <span className="font-medium">Membre depuis</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">
                        {new Date(user.created_at).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}

                {/* Favorites Tab */}
                {activeTab === 'favorites' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Mes favoris ({favorites.length})
                      </h3>
                      <button
                        onClick={loadFavorites}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        Actualiser
                      </button>
                    </div>

                    {favorites.length === 0 ? (
                      <div className="text-center py-12">
                        <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                          Aucun favori pour le moment
                        </p>
                        <p className="text-gray-500 dark:text-gray-500 mt-2">
                          Explorez les catégories et ajoutez vos liens préférés !
                        </p>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {favorites.map((linkId, index) => (
                          <div
                            key={linkId}
                            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <Heart className="w-5 h-5 text-red-500" />
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  Lien favori #{linkId}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Ajouté le {new Date().toLocaleDateString('fr-FR')}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => toggleFavorite(linkId)}
                              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="Retirer des favoris"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* History Tab */}
                {activeTab === 'history' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Historique de navigation ({history.length})
                      </h3>
                      <button
                        onClick={loadHistory}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        Actualiser
                      </button>
                    </div>

                    {history.length === 0 ? (
                      <div className="text-center py-12">
                        <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                          Aucun historique pour le moment
                        </p>
                        <p className="text-gray-500 dark:text-gray-500 mt-2">
                          Votre historique de navigation apparaîtra ici
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {history.slice(0, 20).map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <History className="w-5 h-5 text-blue-500" />
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  Lien #{item.link_id}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {new Date(item.visited_at).toLocaleString('fr-FR')}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Paramètres du compte
                    </h3>

                    {/* Export Data */}
                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                            Exporter mes données
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400">
                            Téléchargez toutes vos données (profil, favoris, historique)
                          </p>
                        </div>
                        <button
                          onClick={handleExportData}
                          className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span>Exporter</span>
                        </button>
                      </div>
                    </div>

                    {/* Privacy Settings */}
                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                      <div className="flex items-center space-x-3 mb-4">
                        <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          Confidentialité
                        </h4>
                      </div>
                      <div className="space-y-4">
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className="text-gray-700 dark:text-gray-300">
                            Sauvegarder mon historique de navigation
                          </span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className="text-gray-700 dark:text-gray-300">
                            Recevoir des notifications par email
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Delete Account */}
                    <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
                      <div className="flex items-center space-x-3 mb-4">
                        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        <h4 className="font-semibold text-red-900 dark:text-red-100">
                          Zone de danger
                        </h4>
                      </div>
                      <p className="text-red-700 dark:text-red-300 mb-4">
                        La suppression de votre compte est irréversible. Toutes vos données seront définitivement perdues.
                      </p>
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Supprimer mon compte</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full">
                <div className="flex items-center space-x-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Confirmer la suppression
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Êtes-vous sûr de vouloir supprimer définitivement votre compte ? 
                  Cette action ne peut pas être annulée.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BackOffice;
