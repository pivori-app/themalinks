import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  LogOut, 
  Heart, 
  History, 
  Settings, 
  ChevronDown,
  Star,
  Clock,
  Trash2
} from 'lucide-react';
import { useAuth, useFavorites, useHistory } from '../hooks/useAuth';

const UserProfile = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'favorites', 'history'
  const { user, userName, userEmail, userAvatar, signOut } = useAuth();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { history } = useHistory();

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  if (!isOpen || !user) return null;

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
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-center space-x-4">
              <div className="relative">
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt={userName}
                    className="w-16 h-16 rounded-full border-4 border-white/20"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center border-4 border-white/20">
                    <User className="w-8 h-8" />
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{userName}</h2>
                <p className="text-blue-100">{userEmail}</p>
                <p className="text-sm text-blue-200 mt-1">
                  Membre depuis {new Date(user.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {[
              { id: 'profile', label: 'Profil', icon: User },
              { id: 'favorites', label: 'Favoris', icon: Heart },
              { id: 'history', label: 'Historique', icon: History }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 font-medium transition-colors ${
                  activeTab === id
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 mb-2">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm font-medium">Favoris</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {favorites.length}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 mb-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">Visites</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {history.length}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Paramètres du compte
                  </h3>
                  
                  <button 
                    onClick={() => {
                      onClose();
                      // Ouvrir le Back Office
                      window.dispatchEvent(new CustomEvent('openBackOffice'));
                    }}
                    className="w-full flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-900 dark:text-white">Back Office</span>
                  </button>

                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center space-x-3 p-3 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors text-red-600 dark:text-red-400"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Se déconnecter</span>
                  </button>
                </div>
              </div>
            )}

            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Mes favoris ({favorites.length})
                  </h3>
                </div>
                
                {favorites.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Aucun favori pour le moment
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                      Cliquez sur ⭐ pour ajouter des liens à vos favoris
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {favorites.slice(0, 10).map((linkId) => (
                      <div
                        key={linkId}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-gray-900 dark:text-white">
                            Lien #{linkId}
                          </span>
                        </div>
                        <button
                          onClick={() => toggleFavorite(linkId)}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
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
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Historique récent ({history.length})
                  </h3>
                </div>
                
                {history.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Aucun historique pour le moment
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                      Votre historique de navigation apparaîtra ici
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {history.slice(0, 10).map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <Clock className="w-4 h-4 text-blue-500" />
                          <div>
                            <span className="text-gray-900 dark:text-white">
                              Lien #{item.link_id}
                            </span>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
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
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UserProfile;
