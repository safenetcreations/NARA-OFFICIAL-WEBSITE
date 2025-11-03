import React, { useState, useEffect, useMemo } from 'react';
import { useLibraryUser } from '../../contexts/LibraryUserContext';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { RoleGuard } from '../../components/library';
import { useTranslation } from 'react-i18next';

const LibraryDashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, userProfile, signOut, updateProfile } = useLibraryUser();
  const { t } = useTranslation('libraryDashboard');
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Show welcome message for new users
  useEffect(() => {
    if (searchParams.get('welcome') === 'true') {
      setMessage({
        type: 'success',
        key: 'messages.welcome'
      });
    } else if (searchParams.get('submission') === 'success') {
      setMessage({
        type: 'success',
        key: 'messages.submissionSuccess'
      });
    }
  }, [searchParams]);

  useEffect(() => {
    if (userProfile && !isEditing) {
      setEditData({
        firstName: userProfile.profile?.firstName || '',
        lastName: userProfile.profile?.lastName || '',
        phoneNumber: userProfile.profile?.phoneNumber || '',
        institution: userProfile.profile?.institution || '',
        researchArea: userProfile.profile?.researchArea || '',
      });
    }
  }, [userProfile, isEditing]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      await updateProfile({
        profile: {
          ...userProfile.profile,
          ...editData,
          displayName: `${editData.firstName} ${editData.lastName}`.trim()
        }
      });
      setIsEditing(false);
      setMessage({ type: 'success', key: 'messages.updateSuccess' });
    } catch (err) {
      setMessage({ type: 'error', key: 'messages.updateError' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/library-login');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'researcher': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'student': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'public': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const tabs = useMemo(() => [
    { id: 'overview', label: t('tabs.overview'), icon: Icons.LayoutDashboard },
    { id: 'profile', label: t('tabs.profile'), icon: Icons.User },
    { id: 'loans', label: t('tabs.loans'), icon: Icons.BookOpen },
    { id: 'settings', label: t('tabs.settings'), icon: Icons.Settings }
  ], [t]);

  const roleLabels = useMemo(() => ({
    researcher: t('roles.researcher'),
    student: t('roles.student'),
    public: t('roles.public'),
    institution: t('roles.institution'),
    default: t('roles.default')
  }), [t]);

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Icons.Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const displayedRoleLabel = roleLabels[userProfile.role] || roleLabels.default;
  const verificationStatusKey = user?.emailVerified ? 'verified' : 'notVerified';
  const statusPrefix = t('settings.emailVerification.status', { status: '' });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold">
                {userProfile.profile?.firstName?.[0]}{userProfile.profile?.lastName?.[0]}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {userProfile.profile?.displayName || t('roles.default')}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(userProfile.role)}`}>
                    {displayedRoleLabel}
                  </span>
                  <span className="text-sm text-slate-600">
                    {t('header.cardLabel', { cardNumber: userProfile.libraryCard?.cardNumber || '—' })}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
              >
                <Icons.User className="w-5 h-5" />
                {t('header.viewProfile')}
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Icons.LogOut className="w-5 h-5" />
                {t('header.signOut')}
              </button>
            </div>
          </div>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-4 rounded-lg border ${
                message.type === 'success' 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              <div className="flex items-start gap-2">
                {message.type === 'success' ? (
                  <Icons.CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                ) : (
                  <Icons.AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                )}
                <p className="text-sm">{message.key ? t(message.key) : ''}</p>
              </div>
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-4 space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-4 mt-6">
              <h3 className="font-semibold text-slate-900 mb-3">{t('header.quickActions')}</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/library')}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <Icons.Search className="w-4 h-4" />
                  {t('buttons.browseCatalogue')}
                </button>
                <RoleGuard allowedRoles={['researcher']}>
                  <button
                    onClick={() => navigate('/library-research-submit')}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                  >
                    <Icons.Microscope className="w-4 h-4" />
                    {t('buttons.submitResearch')}
                  </button>
                </RoleGuard>
                <button
                  onClick={() => navigate('/contact-us')}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <Icons.HelpCircle className="w-4 h-4" />
                  {t('buttons.getHelp')}
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">{t('overview.title')}</h2>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-blue-600 font-medium">{t('overview.stats.activeLoans')}</p>
                          <p className="text-3xl font-bold text-blue-900 mt-1">
                            {userProfile.statistics?.activeLoans || 0}
                          </p>
                        </div>
                        <Icons.BookOpen className="w-10 h-10 text-blue-400" />
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-green-600 font-medium">{t('overview.stats.totalBorrowed')}</p>
                          <p className="text-3xl font-bold text-green-900 mt-1">
                            {userProfile.statistics?.totalBorrowed || 0}
                          </p>
                        </div>
                        <Icons.BookMarked className="w-10 h-10 text-green-400" />
                      </div>
                    </div>

                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-amber-600 font-medium">{t('overview.stats.finesOwed')}</p>
                          <p className="text-3xl font-bold text-amber-900 mt-1">
                            {t('overview.stats.finesValue', { amount: userProfile.statistics?.finesOwed || 0 })}
                          </p>
                        </div>
                        <Icons.DollarSign className="w-10 h-10 text-amber-400" />
                      </div>
                    </div>
                  </div>

                  {/* Account Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900">{t('overview.account.title')}</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <p className="text-sm text-slate-600 mb-1">{t('overview.account.cardStatus')}</p>
                        <p className="font-semibold text-slate-900 capitalize">
                          {userProfile.libraryCard?.status}
                        </p>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-lg">
                        <p className="text-sm text-slate-600 mb-1">{t('overview.account.maxLoans')}</p>
                        <p className="font-semibold text-slate-900">
                          {t('overview.account.maxLoansValue', { count: userProfile.permissions?.maxLoans || 0 })}
                        </p>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-lg">
                        <p className="text-sm text-slate-600 mb-1">{t('overview.account.loanPeriod')}</p>
                        <p className="font-semibold text-slate-900">
                          {t('overview.account.loanPeriodValue', { days: userProfile.permissions?.loanPeriodDays || 0 })}
                        </p>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-lg">
                        <p className="text-sm text-slate-600 mb-1">{t('overview.account.cardExpiry')}</p>
                        <p className="font-semibold text-slate-900">
                          {new Date(userProfile.libraryCard?.expiryDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Permissions */}
                    <div className="mt-6">
                      <h4 className="text-sm font-semibold text-slate-900 mb-3">{t('overview.permissions.title')}</h4>
                      <div className="flex flex-wrap gap-2">
                        {userProfile.permissions?.canBorrow && (
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                            {t('overview.permissions.canBorrow')}
                          </span>
                        )}
                        {userProfile.permissions?.canSubmitResearch && (
                          <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                            {t('overview.permissions.canSubmitResearch')}
                          </span>
                        )}
                        {userProfile.permissions?.canAccessPremium && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                            {t('overview.permissions.premiumAccess')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">{t('profile.title')}</h2>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        <Icons.Edit2 className="w-4 h-4" />
                        {t('buttons.editProfile')}
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors"
                        >
                          {t('buttons.cancel')}
                        </button>
                        <button
                          onClick={handleSaveProfile}
                          disabled={loading}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                          {loading ? (
                            <>
                              <Icons.Loader2 className="w-4 h-4 animate-spin" />
                              {t('buttons.saving')}
                            </>
                          ) : (
                            <>
                              <Icons.Save className="w-4 h-4" />
                              {t('buttons.saveChanges')}
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          {t('profile.fields.firstName')}
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="firstName"
                            value={editData.firstName}
                            onChange={handleEditChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          />
                        ) : (
                          <p className="text-slate-900 font-medium">
                            {userProfile.profile?.firstName || '-'}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          {t('profile.fields.lastName')}
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="lastName"
                            value={editData.lastName}
                            onChange={handleEditChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          />
                        ) : (
                          <p className="text-slate-900 font-medium">
                            {userProfile.profile?.lastName || '-'}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        {t('profile.fields.email')}
                      </label>
                      <p className="text-slate-900 font-medium">{userProfile.email}</p>
                      <p className="text-xs text-slate-500 mt-1">{t('profile.fields.emailNote')}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        {t('profile.fields.phoneNumber')}
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={editData.phoneNumber}
                          onChange={handleEditChange}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      ) : (
                        <p className="text-slate-900 font-medium">
                          {userProfile.profile?.phoneNumber || '-'}
                        </p>
                      )}
                    </div>

                    {(userProfile.role === 'student' || userProfile.role === 'researcher') && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          {t('profile.fields.institution')}
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="institution"
                            value={editData.institution}
                            onChange={handleEditChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          />
                        ) : (
                          <p className="text-slate-900 font-medium">
                            {userProfile.profile?.institution || '-'}
                          </p>
                        )}
                      </div>
                    )}

                    {userProfile.role === 'researcher' && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          {t('profile.fields.researchArea')}
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="researchArea"
                            value={editData.researchArea}
                            onChange={handleEditChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          />
                        ) : (
                          <p className="text-slate-900 font-medium">
                            {userProfile.profile?.researchArea || '-'}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Loans Tab */}
              {activeTab === 'loans' && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">{t('loans.title')}</h2>
                  <div className="text-center py-12">
                    <Icons.BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600 mb-4">
                      {t('loans.empty')}
                    </p>
                    <button
                      onClick={() => navigate('/library')}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                    >
                      <Icons.Search className="w-5 h-5" />
                      {t('buttons.browseCatalogue')}
                    </button>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">{t('settings.title')}</h2>
                  <div className="space-y-6">
                    <div className="p-4 border border-slate-200 rounded-lg">
                      <h3 className="font-semibold text-slate-900 mb-2">{t('settings.emailVerification.title')}</h3>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-600">
                          {statusPrefix}
                          <span className={user.emailVerified ? 'text-green-600 font-semibold' : 'text-amber-600 font-semibold'}>
                            {t(`settings.emailVerification.${verificationStatusKey}`)}
                          </span>
                        </p>
                        {!user.emailVerified && (
                          <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
                            {t('buttons.resendVerification')}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="p-4 border border-slate-200 rounded-lg">
                      <h3 className="font-semibold text-slate-900 mb-2">{t('settings.security.title')}</h3>
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
                        {t('buttons.changePassword')}
                      </button>
                    </div>

                    <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                      <h3 className="font-semibold text-red-900 mb-2">{t('settings.danger.title')}</h3>
                      <p className="text-sm text-red-700 mb-3">
                        {t('settings.danger.description')}
                      </p>
                      <button className="text-sm text-red-600 hover:text-red-700 font-semibold">
                        {t('buttons.deleteAccount')}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryDashboard;
