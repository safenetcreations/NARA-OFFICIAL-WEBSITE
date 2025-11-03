import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLibraryUser } from '../../contexts/LibraryUserContext';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LibraryLogin = () => {
  const navigate = useNavigate();
  const { signIn, signInWithGoogle, error, setError } = useLibraryUser();
  const { t } = useTranslation('libraryAuth');

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      await signIn(formData.email, formData.password);
      navigate('/library-dashboard');
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle('public'); // Default to public role for existing users
      navigate('/library-dashboard');
    } catch (err) {
      console.error('Google sign-in error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Icons.BookOpen className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            {t('login.title')}
          </h1>
          <p className="text-slate-600">
            {t('login.subtitle')}
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <Icons.AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-800 text-sm font-medium">{t('login.errors.generic')}</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t('login.fields.emailLabel')}
              </label>
              <div className="relative">
                <Icons.Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder={t('login.fields.emailPlaceholder')}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-700">
                  {t('login.fields.passwordLabel')}
                </label>
                <Link
                  to="/library-forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                >
                  {t('login.links.forgotPassword')}
                </Link>
              </div>
              <div className="relative">
                <Icons.Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder={t('login.fields.passwordPlaceholder')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <Icons.EyeOff className="w-5 h-5" />
                  ) : (
                    <Icons.Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="remember-me" className="ml-2 text-sm text-slate-700">
                {t('login.rememberMe')}
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Icons.Loader2 className="w-5 h-5 animate-spin" />
                  {t('login.buttons.signingIn')}
                </>
              ) : (
                <>
                  <Icons.LogIn className="w-5 h-5" />
                  {t('login.buttons.signIn')}
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">{t('login.divider')}</span>
            </div>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 px-6 bg-white border-2 border-slate-300 hover:border-slate-400 text-slate-700 font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {t('login.buttons.google')}
          </button>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-slate-600 text-sm">
              Don't have an account?{' '}
              <Link
                to="/library-register"
                className="text-blue-600 font-semibold hover:text-blue-700 hover:underline"
              >
                Create one now
              </Link>
            </p>
          </div>

          {/* Help Links */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link to="/contact-us" className="text-slate-600 hover:text-slate-900 transition-colors">
                Need Help?
              </Link>
              <span className="text-slate-300">•</span>
              <Link to="/library" className="text-slate-600 hover:text-slate-900 transition-colors">
                Browse Catalogue
              </Link>
              <span className="text-slate-300">•</span>
              <Link to="/about-nara-our-story" className="text-slate-600 hover:text-slate-900 transition-colors">
                About NARA
              </Link>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8 bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-slate-200"
        >
          <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <Icons.Info className="w-4 h-4 text-blue-600" />
            Member Benefits
          </h3>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <Icons.Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Borrow books and research materials</span>
            </li>
            <li className="flex items-start gap-2">
              <Icons.Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Access digital resources 24/7</span>
            </li>
            <li className="flex items-start gap-2">
              <Icons.Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Submit and view research papers</span>
            </li>
            <li className="flex items-start gap-2">
              <Icons.Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Manage loans and reservations online</span>
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LibraryLogin;
