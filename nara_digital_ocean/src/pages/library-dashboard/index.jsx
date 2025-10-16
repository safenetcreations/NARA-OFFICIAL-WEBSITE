import React, { useState, useEffect } from 'react';
import { useLibraryUser } from '../../contexts/LibraryUserContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { RoleGuard } from '../../components/library';

const LibraryDashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, userProfile, signOut, updateProfile } = useLibraryUser();
  
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
        text: 'Welcome! Your account has been created successfully. Please check your email to verify your account.'
      });
    } else if (searchParams.get('submission') === 'success') {
      setMessage({
        type: 'success',
        text: 'Research paper submitted successfully! Your submission is under review and you will be notified once it has been processed.'
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
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Icons.LayoutDashboard },
    { id: 'profile', label: 'My Profile', icon: Icons.User },
    { id: 'loans', label: 'My Loans', icon: Icons.BookOpen },
    { id: 'settings', label: 'Settings', icon: Icons.Settings },
  ];

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Icons.Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

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
                  {userProfile.profile?.displayName || 'Library User'}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(userProfile.role)}`}>
                    {userProfile.role?.charAt(0).toUpperCase() + userProfile.role?.slice(1)}
                  </span>
                  <span className="text-sm text-slate-600">
                    Card: {userProfile.libraryCard?.cardNumber}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Icons.LogOut className="w-5 h-5" />
              Sign Out
            </button>
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
                <p className="text-sm">{message.text}</p>
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
              <h3 className="font-semibold text-slate-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/library')}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <Icons.Search className="w-4 h-4" />
                  Browse Catalogue
                </button>
                <RoleGuard allowedRoles={['researcher']}>
                  <button
                    onClick={() => navigate('/library-research-submit')}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                  >
                    <Icons.Microscope className="w-4 h-4" />
                    Submit Research
                  </button>
                </RoleGuard>
                <button
                  onClick={() => navigate('/contact-us')}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <Icons.HelpCircle className="w-4 h-4" />
                  Get Help
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
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Dashboard Overview</h2>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-blue-600 font-medium">Active Loans</p>
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
                          <p className="text-sm text-green-600 font-medium">Total Borrowed</p>
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
                          <p className="text-sm text-amber-600 font-medium">Fines Owed</p>
                          <p className="text-3xl font-bold text-amber-900 mt-1">
                            Rs. {userProfile.statistics?.finesOwed || 0}
                          </p>
                        </div>
                        <Icons.DollarSign className="w-10 h-10 text-amber-400" />
                      </div>
                    </div>
                  </div>

                  {/* Account Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900">Account Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <p className="text-sm text-slate-600 mb-1">Library Card Status</p>
                        <p className="font-semibold text-slate-900 capitalize">
                          {userProfile.libraryCard?.status}
                        </p>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-lg">
                        <p className="text-sm text-slate-600 mb-1">Max Loans Allowed</p>
                        <p className="font-semibold text-slate-900">
                          {userProfile.permissions?.maxLoans} books
                        </p>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-lg">
                        <p className="text-sm text-slate-600 mb-1">Loan Period</p>
                        <p className="font-semibold text-slate-900">
                          {userProfile.permissions?.loanPeriodDays} days
                        </p>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-lg">
                        <p className="text-sm text-slate-600 mb-1">Card Expiry</p>
                        <p className="font-semibold text-slate-900">
                          {new Date(userProfile.libraryCard?.expiryDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Permissions */}
                    <div className="mt-6">
                      <h4 className="text-sm font-semibold text-slate-900 mb-3">Your Permissions</h4>
                      <div className="flex flex-wrap gap-2">
                        {userProfile.permissions?.canBorrow && (
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                            Can Borrow
                          </span>
                        )}
                        {userProfile.permissions?.canSubmitResearch && (
                          <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                            Can Submit Research
                          </span>
                        )}
                        {userProfile.permissions?.canAccessPremium && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                            Premium Access
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
                    <h2 className="text-2xl font-bold text-slate-900">My Profile</h2>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        <Icons.Edit2 className="w-4 h-4" />
                        Edit Profile
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveProfile}
                          disabled={loading}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                          {loading ? (
                            <>
                              <Icons.Loader2 className="w-4 h-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Icons.Save className="w-4 h-4" />
                              Save Changes
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
                          First Name
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
                          Last Name
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
                        Email Address
                      </label>
                      <p className="text-slate-900 font-medium">{userProfile.email}</p>
                      <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Phone Number
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
                          Institution
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
                          Research Area
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
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">My Loans</h2>
                  <div className="text-center py-12">
                    <Icons.BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600 mb-4">
                      You don't have any active loans at the moment
                    </p>
                    <button
                      onClick={() => navigate('/library')}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                    >
                      <Icons.Search className="w-5 h-5" />
                      Browse Catalogue
                    </button>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Settings</h2>
                  <div className="space-y-6">
                    <div className="p-4 border border-slate-200 rounded-lg">
                      <h3 className="font-semibold text-slate-900 mb-2">Email Verification</h3>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-600">
                          Status: {user.emailVerified ? (
                            <span className="text-green-600 font-semibold">Verified</span>
                          ) : (
                            <span className="text-amber-600 font-semibold">Not Verified</span>
                          )}
                        </p>
                        {!user.emailVerified && (
                          <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
                            Resend Verification Email
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="p-4 border border-slate-200 rounded-lg">
                      <h3 className="font-semibold text-slate-900 mb-2">Account Security</h3>
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
                        Change Password
                      </button>
                    </div>

                    <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                      <h3 className="font-semibold text-red-900 mb-2">Danger Zone</h3>
                      <p className="text-sm text-red-700 mb-3">
                        Once you delete your account, there is no going back.
                      </p>
                      <button className="text-sm text-red-600 hover:text-red-700 font-semibold">
                        Delete Account
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
