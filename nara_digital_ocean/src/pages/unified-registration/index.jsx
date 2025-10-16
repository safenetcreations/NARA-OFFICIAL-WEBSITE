import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';

const UnifiedRegistration = () => {
  const navigate = useNavigate();
  const { signUp, signInWithGoogle, error, setError } = useFirebaseAuth();

  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    organization: '',
    agreeTerms: false
  });

  // User Roles with Auto-Assigned Services
  const userRoles = [
    {
      id: 'student',
      icon: Icons.GraduationCap,
      title: 'Student',
      description: 'Undergraduate or postgraduate student',
      services: ['library', 'ecommerce'],
      libraryAccess: {
        borrowLimit: 5,
        loanPeriod: '14 days',
        canSubmitResearch: false,
        canAccessPremium: false
      },
      features: [
        'Borrow up to 5 books',
        '14-day loan period',
        'Purchase publications',
        'Access student resources',
        'Free membership'
      ],
      color: 'from-blue-500 to-cyan-500',
      badge: 'Most Popular'
    },
    {
      id: 'researcher',
      icon: Icons.Microscope,
      title: 'Researcher / Faculty',
      description: 'Academic researchers, professors, and faculty members',
      services: ['library', 'ecommerce', 'images', 'data'],
      libraryAccess: {
        borrowLimit: 10,
        loanPeriod: '30 days',
        canSubmitResearch: true,
        canAccessPremium: true
      },
      features: [
        'Borrow up to 10 books',
        '30-day loan period',
        'Submit research papers',
        'Access premium resources',
        'Purchase images & datasets',
        'API access for data',
        'Priority support'
      ],
      color: 'from-purple-500 to-pink-500',
      badge: 'Full Access'
    },
    {
      id: 'professor',
      icon: Icons.Award,
      title: 'Professor / Senior Researcher',
      description: 'Senior faculty and principal investigators',
      services: ['library', 'ecommerce', 'images', 'data', 'collaboration'],
      libraryAccess: {
        borrowLimit: 15,
        loanPeriod: '60 days',
        canSubmitResearch: true,
        canAccessPremium: true,
        canReview: true
      },
      features: [
        'Borrow up to 15 books',
        '60-day loan period',
        'Submit & review research',
        'Full premium access',
        'Unlimited image downloads',
        'Full dataset access',
        'Research collaboration tools',
        'Dedicated support'
      ],
      color: 'from-amber-500 to-orange-500',
      badge: 'Premium'
    },
    {
      id: 'public',
      icon: Icons.Users,
      title: 'Public Member',
      description: 'General public and marine enthusiasts',
      services: ['library', 'ecommerce'],
      libraryAccess: {
        borrowLimit: 3,
        loanPeriod: '7 days',
        canSubmitResearch: false,
        canAccessPremium: false
      },
      features: [
        'Borrow up to 3 books',
        '7-day loan period',
        'View catalogue',
        'Reserve books',
        'Purchase publications',
        'Community access'
      ],
      color: 'from-green-500 to-teal-500',
      badge: 'Basic'
    },
    {
      id: 'institution',
      icon: Icons.Building2,
      title: 'Institution / Organization',
      description: 'Universities, research institutions, and organizations',
      services: ['library', 'ecommerce', 'images', 'data', 'bulk'],
      libraryAccess: {
        borrowLimit: 25,
        loanPeriod: '90 days',
        canSubmitResearch: true,
        canAccessPremium: true,
        bulkAccess: true
      },
      features: [
        'Borrow up to 25 books',
        '90-day loan period',
        'Bulk purchases available',
        'Institutional licensing',
        'Multiple user accounts',
        'Custom data packages',
        'Dedicated account manager'
      ],
      color: 'from-indigo-500 to-purple-500',
      badge: 'Enterprise'
    }
  ];

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!selectedRole) {
      setError('Please select your role');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (!formData.agreeTerms) {
      setError('You must agree to the terms and conditions');
      return;
    }

    try {
      setLoading(true);
      
      // Get role configuration
      const roleConfig = userRoles.find(r => r.id === selectedRole);
      
      // Create unified user profile with role-based services
      const userProfile = {
        ...formData,
        role: selectedRole,
        services: roleConfig.services,
        libraryAccess: roleConfig.libraryAccess,
        registeredAt: new Date().toISOString(),
        accountType: 'unified'
      };

      await signUp(formData.email, formData.password, userProfile);
      
      // Redirect to library dashboard (primary service for all roles)
      navigate('/library-dashboard?welcome=true');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!selectedRole) {
      setError('Please select your role first');
      return;
    }

    try {
      setLoading(true);
      const roleConfig = userRoles.find(r => r.id === selectedRole);
      await signInWithGoogle({ 
        role: selectedRole,
        services: roleConfig.services,
        libraryAccess: roleConfig.libraryAccess
      });
      navigate('/library-dashboard?welcome=true');
    } catch (err) {
      console.error('Google sign-in error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Link to="/" className="inline-flex items-center gap-2 mb-6 text-slate-600 hover:text-slate-900">
            <Icons.ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/assets/nara-logo.png" alt="NARA" className="w-16 h-16 object-contain" />
            <h1 className="text-4xl font-bold text-slate-900">NARA Account Registration</h1>
          </div>
          <p className="text-xl text-slate-600">
            One account for all NARA digital services
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600' : 'text-slate-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>
              1
            </div>
            <span className="font-medium">Select Your Role</span>
          </div>
          <div className="w-16 h-1 bg-slate-200"></div>
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-600' : 'text-slate-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>
              2
            </div>
            <span className="font-medium">Account Details</span>
          </div>
        </div>

        {/* Step 1: Role Selection */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
              What best describes you?
            </h2>
            <p className="text-slate-600 text-center mb-8">
              Select your role to get access to the appropriate NARA services
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {userRoles.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;
                
                return (
                  <motion.div
                    key={role.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRoleSelect(role.id)}
                    className={`relative cursor-pointer rounded-2xl p-6 transition-all ${
                      isSelected
                        ? 'bg-white shadow-xl ring-2 ring-blue-500'
                        : 'bg-white shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {role.badge && (
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          role.badge === 'Premium' ? 'bg-amber-100 text-amber-700' :
                          role.badge === 'Full Access' ? 'bg-purple-100 text-purple-700' :
                          role.badge === 'Enterprise' ? 'bg-indigo-100 text-indigo-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {role.badge}
                        </span>
                      </div>
                    )}

                    {isSelected && (
                      <div className="absolute top-4 left-4">
                        <Icons.CheckCircle className="w-6 h-6 text-blue-600" />
                      </div>
                    )}

                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-4 mt-2`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {role.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-4">
                      {role.description}
                    </p>

                    <div className="space-y-2">
                      {role.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                          <Icons.Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <p className="text-xs font-medium text-slate-500 mb-1">Includes access to:</p>
                      <div className="flex flex-wrap gap-1">
                        {role.services.map((service) => (
                          <span key={service} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                            {service === 'library' ? '📚 Library' :
                             service === 'ecommerce' ? '🛒 Shop' :
                             service === 'images' ? '🖼️ Images' :
                             service === 'data' ? '📊 Data' :
                             service === 'collaboration' ? '🤝 Collab' :
                             service === 'bulk' ? '📦 Bulk' : service}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <Icons.AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <div className="flex justify-center">
              <button
                onClick={() => {
                  if (!selectedRole) {
                    setError('Please select your role');
                    return;
                  }
                  setError(null);
                  setStep(2);
                }}
                disabled={!selectedRole}
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Continue to Account Details
                <Icons.ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Account Details */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
            >
              <Icons.ArrowLeft className="w-5 h-5" />
              Back to role selection
            </button>

            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
              {(() => {
                const role = userRoles.find(r => r.id === selectedRole);
                return (
                  <>
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${role?.color} flex items-center justify-center`}>
                        {role && React.createElement(role.icon, { className: 'w-6 h-6 text-white' })}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                          Create Your NARA Account
                        </h2>
                        <p className="text-slate-600">
                          Registering as: <strong>{role?.title}</strong>
                        </p>
                      </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <p className="text-sm text-blue-800 font-medium mb-2">Your account will include:</p>
                      <div className="flex flex-wrap gap-2">
                        {role?.services.map((service) => (
                          <span key={service} className="px-3 py-1 bg-white text-blue-700 rounded-full text-xs font-medium">
                            {service === 'library' ? '📚 Library System' :
                             service === 'ecommerce' ? '🛒 Book Sales' :
                             service === 'images' ? '🖼️ Image Sales' :
                             service === 'data' ? '📊 Data Access' :
                             service === 'collaboration' ? '🤝 Collaboration' :
                             service === 'bulk' ? '📦 Bulk Licensing' : service}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                );
              })()}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <Icons.AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Password *</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={8}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password *</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Organization/Institution</label>
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    placeholder="University, Company, or Personal"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 bg-white"
                  />
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    required
                    className="mt-1 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <label className="text-sm text-slate-700">
                    I agree to the{' '}
                    <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Icons.Loader2 className="w-5 h-5 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <Icons.UserPlus className="w-5 h-5" />
                      Create NARA Account
                    </>
                  )}
                </button>
              </form>

              <div className="my-6 flex items-center">
                <div className="flex-1 border-t border-slate-300"></div>
                <span className="px-4 text-sm text-slate-500">or</span>
                <div className="flex-1 border-t border-slate-300"></div>
              </div>

              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full bg-white hover:bg-slate-50 text-slate-700 font-semibold py-3 px-4 rounded-lg border border-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                <Icons.Chrome className="w-5 h-5 text-blue-500" />
                Continue with Google
              </button>

              <p className="text-center text-sm text-slate-600 mt-6">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UnifiedRegistration;
