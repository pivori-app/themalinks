import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Mail, 
  LogIn, 
  UserPlus, 
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const AuthModal = ({ isOpen, onClose, mode = 'signin' }) => {
  const [currentMode, setCurrentMode] = useState(mode); // 'signin', 'signup', 'magic'
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const { signInWithGoogle, signInWithMagicLink } = useAuth();

  // Réinitialiser l'état lors de l'ouverture/fermeture
  const handleClose = () => {
    setEmail('');
    setMessage(null);
    setError(null);
    setLoading(false);
    onClose();
  };

  // Connexion Google
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await signInWithGoogle();
      if (result.success) {
        handleClose();
      } else {
        setError(result.error || 'Erreur de connexion avec Google');
      }
    } catch (err) {
      setError('Erreur de connexion avec Google');
    } finally {
      setLoading(false);
    }
  };

  // Magic Link
  const handleMagicLink = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Veuillez saisir votre email');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await signInWithMagicLink(email);
      if (result.success) {
        setMessage(result.message);
        setEmail('');
      } else {
        setError(result.error || 'Erreur lors de l\'envoi du lien');
      }
    } catch (err) {
      setError('Erreur lors de l\'envoi du lien');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentMode === 'signin' && 'Connexion'}
                {currentMode === 'signup' && 'Inscription'}
                {currentMode === 'magic' && 'Lien magique'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {currentMode === 'signin' && 'Connectez-vous à votre compte'}
                {currentMode === 'signup' && 'Créez votre compte ThemaLinks'}
                {currentMode === 'magic' && 'Recevez un lien de connexion par email'}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Messages */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
              >
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                <p className="text-sm text-green-800 dark:text-green-200">{message}</p>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
              >
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </motion.div>
            )}

            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                Continuer avec Google
              </span>
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                  ou
                </span>
              </div>
            </div>

            {/* Magic Link Form */}
            <form onSubmit={handleMagicLink} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Adresse email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Mail className="w-5 h-5" />
                )}
                <span>
                  {loading ? 'Envoi en cours...' : 'Envoyer le lien magique'}
                </span>
              </button>
            </form>

            {/* Mode Switch */}
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {currentMode === 'signin' ? "Pas encore de compte ?" : "Déjà un compte ?"}
              </p>
              <button
                onClick={() => setCurrentMode(currentMode === 'signin' ? 'signup' : 'signin')}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-colors"
              >
                {currentMode === 'signin' ? 'Créer un compte' : 'Se connecter'}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              En continuant, vous acceptez nos{' '}
              <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                conditions d'utilisation
              </a>{' '}
              et notre{' '}
              <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                politique de confidentialité
              </a>
              .
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;
