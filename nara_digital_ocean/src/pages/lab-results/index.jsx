import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { labResultsService, sampleTrackingService, labResultsDashboardService } from '../../services/labResultsService';

const LabResultsPortal = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  // State Management
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard' | 'results' | 'samples' | 'track'
  const [loading, setLoading] = useState(false);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [results, setResults] = useState([]);
  const [samples, setSamples] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedResult, setSelectedResult] = useState(null);
  const [selectedSample, setSelectedSample] = useState(null);
  const [trackingId, setTrackingId] = useState('');

  // Load Dashboard Data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const { data, error } = await labResultsDashboardService.getStatistics();
      if (data) {
        setDashboardStats(data);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load Results
  const loadResults = async (filters = {}) => {
    setLoading(true);
    try {
      const { data, error } = await labResultsService.getAll(filters);
      if (data) {
        setResults(data);
      }
    } catch (error) {
      console.error('Error loading results:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load Samples
  const loadSamples = async (filters = {}) => {
    setLoading(true);
    try {
      const { data, error } = await sampleTrackingService.getAll(filters);
      if (data) {
        setSamples(data);
      }
    } catch (error) {
      console.error('Error loading samples:', error);
    } finally {
      setLoading(false);
    }
  };

  // Track Sample by ID
  const trackSample = async () => {
    if (!trackingId.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await sampleTrackingService.getBySampleId(trackingId);
      if (data) {
        setSelectedSample(data);
      } else {
        alert('Sample not found');
      }
    } catch (error) {
      console.error('Error tracking sample:', error);
      alert('Error tracking sample');
    } finally {
      setLoading(false);
    }
  };

  // Filter Results
  const filteredResults = results.filter(result => {
    const matchesSearch = searchQuery === '' ||
      result.testType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.sampleType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.projectName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || result.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Filter Samples
  const filteredSamples = samples.filter(sample => {
    const matchesSearch = searchQuery === '' ||
      sample.sampleId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sample.sampleType?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || sample.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Get Status Badge Color
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      in_progress: 'bg-blue-100 text-blue-800 border-blue-300',
      processing: 'bg-blue-100 text-blue-800 border-blue-300',
      completed: 'bg-green-100 text-green-800 border-green-300',
      submitted: 'bg-cyan-100 text-cyan-800 border-cyan-300',
      received: 'bg-purple-100 text-purple-800 border-purple-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  // Navigation Tabs
  const navTabs = [
    { id: 'dashboard', label: { en: 'Dashboard', si: 'උපකරණ පුවරුව', ta: 'டாஷ்போர்டு' }, icon: Icons.LayoutDashboard },
    { id: 'results', label: { en: 'Lab Results', si: 'රසායනාගාර ප්‍රතිඵල', ta: 'ஆய்வக முடிவுகள்' }, icon: Icons.FlaskConical },
    { id: 'samples', label: { en: 'My Samples', si: 'මගේ නියැදි', ta: 'எனது மாதிரிகள்' }, icon: Icons.TestTube },
    { id: 'track', label: { en: 'Track Sample', si: 'නියැදි ලුහුබැඳීම', ta: 'மாதிரி கண்காணிப்பு' }, icon: Icons.Search }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 via-cyan-900 to-blue-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              animate={{
                y: [0, -100, 0],
                opacity: [0, 0.7, 0]
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 5
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            >
              <Icons.FlaskConical className="w-8 h-8" />
            </motion.div>
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-block mb-4 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <span className="text-cyan-300 font-semibold">For Researchers & Students</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Laboratory Results Portal
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Access your test results, track samples, and manage laboratory analysis data in one comprehensive platform
            </p>
          </motion.div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-xl shadow-lg z-40 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto scrollbar-hide">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveView(tab.id);
                    if (tab.id === 'results' && results.length === 0) loadResults();
                    if (tab.id === 'samples' && samples.length === 0) loadSamples();
                  }}
                  className={`flex items-center gap-3 px-6 py-4 font-semibold whitespace-nowrap transition-all border-b-4 ${
                    activeView === tab.id
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  <span>{tab.label[currentLang] || tab.label.en}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {/* Dashboard View */}
          {activeView === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  {
                    label: { en: 'Total Results', si: 'සම්පූර්ණ ප්‍රතිඵල', ta: 'மொத்த முடிவுகள்' },
                    value: dashboardStats?.results?.total || 0,
                    icon: Icons.FileText,
                    color: 'blue',
                    bgGradient: 'from-blue-500 to-cyan-500'
                  },
                  {
                    label: { en: 'Completed', si: 'සම්පූර්ණ', ta: 'முடிக்கப்பட்டது' },
                    value: dashboardStats?.results?.completed || 0,
                    icon: Icons.CheckCircle,
                    color: 'green',
                    bgGradient: 'from-green-500 to-emerald-500'
                  },
                  {
                    label: { en: 'Pending', si: 'පොරොත්තුවෙන්', ta: 'நிலுவையில்' },
                    value: dashboardStats?.results?.pending || 0,
                    icon: Icons.Clock,
                    color: 'yellow',
                    bgGradient: 'from-yellow-500 to-amber-500'
                  },
                  {
                    label: { en: 'Total Samples', si: 'සම්පූර්ණ නියැදි', ta: 'மொத்த மாதிரிகள்' },
                    value: dashboardStats?.samples?.total || 0,
                    icon: Icons.TestTube,
                    color: 'purple',
                    bgGradient: 'from-purple-500 to-pink-500'
                  }
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
                    <div className="relative p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.bgGradient} text-white shadow-lg`}>
                          <stat.icon size={28} />
                        </div>
                        <Icons.TrendingUp className={`text-${stat.color}-500 opacity-50`} size={20} />
                      </div>
                      <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
                      <div className="text-sm font-medium text-gray-600">{stat.label[currentLang] || stat.label.en}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Recent Results */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-2xl shadow-lg p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <Icons.FileText className="text-blue-600" size={28} />
                      {currentLang === 'en' && 'Recent Results'}
                      {currentLang === 'si' && 'මෑත ප්‍රතිඵල'}
                      {currentLang === 'ta' && 'சமீபத்தியmுடிவுகள்'}
                    </h3>
                    <button
                      onClick={() => {
                        setActiveView('results');
                        loadResults();
                      }}
                      className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                    >
                      {currentLang === 'en' && 'View All'}
                      {currentLang === 'si' && 'සියල්ල බලන්න'}
                      {currentLang === 'ta' && 'அனைத்தையும் பார்க்க'}
                    </button>
                  </div>

                  {dashboardStats?.recentResults?.length > 0 ? (
                    <div className="space-y-3">
                      {dashboardStats.recentResults.map((result, idx) => (
                        <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">{result.testType || 'Test'}</p>
                              <p className="text-sm text-gray-600">{result.sampleType}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(result.status)}`}>
                              {result.status}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {result.createdAt && new Date(result.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Icons.FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>{currentLang === 'en' && 'No results yet'}</p>
                    </div>
                  )}
                </motion.div>

                {/* Recent Samples */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-2xl shadow-lg p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <Icons.TestTube className="text-purple-600" size={28} />
                      {currentLang === 'en' && 'Recent Samples'}
                      {currentLang === 'si' && 'මෑත නියැදි'}
                      {currentLang === 'ta' && 'சமீபத்திய மாதிரிகள்'}
                    </h3>
                    <button
                      onClick={() => {
                        setActiveView('samples');
                        loadSamples();
                      }}
                      className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
                    >
                      {currentLang === 'en' && 'View All'}
                      {currentLang === 'si' && 'සියල්ල බලන්න'}
                      {currentLang === 'ta' && 'அனைத்தையும் பார்க்க'}
                    </button>
                  </div>

                  {dashboardStats?.recentSamples?.length > 0 ? (
                    <div className="space-y-3">
                      {dashboardStats.recentSamples.map((sample, idx) => (
                        <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all cursor-pointer">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">{sample.sampleId}</p>
                              <p className="text-sm text-gray-600">{sample.sampleType}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(sample.status)}`}>
                              {sample.status}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {sample.createdAt && new Date(sample.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Icons.TestTube className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>{currentLang === 'en' && 'No samples yet'}</p>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-2xl p-8 text-white"
              >
                <h3 className="text-2xl font-bold mb-4">Quick Actions</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { icon: Icons.Search, label: { en: 'Track Sample', si: 'නියැදි ලුහුබැඳීම', ta: 'மாதிரி கண்காணிப்பு' }, action: () => setActiveView('track') },
                    { icon: Icons.FlaskConical, label: { en: 'View Results', si: 'ප්‍රතිඵල බලන්න', ta: 'முடிவுகளைப் பார்க்கவும்' }, action: () => setActiveView('results') },
                    { icon: Icons.Download, label: { en: 'Download Reports', si: 'වාර්තා බාගන්න', ta: 'அறிக்கைகளைப் பதிவிறக்கவும்' }, action: () => {} }
                  ].map((action, idx) => (
                    <button
                      key={idx}
                      onClick={action.action}
                      className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/30 rounded-xl p-6 transition-all group"
                    >
                      <action.icon className="w-12 h-12 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                      <p className="font-semibold">{action.label[currentLang] || action.label.en}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Results View */}
          {activeView === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Search and Filters */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <div className="relative">
                      <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={currentLang === 'en' ? 'Search by test type, sample type...' : 'සොයන්න...'}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                    >
                      <option value="all">{currentLang === 'en' ? 'All Status' : 'සියලු තත්ත්වය'}</option>
                      <option value="completed">{currentLang === 'en' ? 'Completed' : 'සම්පූර්ණ'}</option>
                      <option value="pending">{currentLang === 'en' ? 'Pending' : 'පොරොත්තුවෙන්'}</option>
                      <option value="in_progress">{currentLang === 'en' ? 'In Progress' : 'ක්‍රියාත්මකයි'}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Results List */}
              {loading ? (
                <div className="flex justify-center py-12">
                  <Icons.Loader className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : filteredResults.length > 0 ? (
                <div className="grid gap-4">
                  {filteredResults.map((result) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all cursor-pointer group"
                      onClick={() => setSelectedResult(result)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Icons.FlaskConical className="text-blue-600 group-hover:scale-110 transition-transform" size={24} />
                            <h3 className="text-xl font-bold text-gray-900">{result.testType || 'Laboratory Test'}</h3>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Icons.TestTube size={16} />
                              <span><strong>Sample:</strong> {result.sampleType}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Icons.Calendar size={16} />
                              <span><strong>Date:</strong> {result.createdAt ? new Date(result.createdAt).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            {result.projectName && (
                              <div className="flex items-center gap-2">
                                <Icons.FolderOpen size={16} />
                                <span><strong>Project:</strong> {result.projectName}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(result.status)}`}>
                            {result.status}
                          </span>
                          <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1">
                            {currentLang === 'en' ? 'View Details' : 'විස්තර බලන්න'}
                            <Icons.ChevronRight size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <Icons.FileX className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500 text-lg">{currentLang === 'en' ? 'No results found' : 'ප්‍රතිඵල හමු නොවීය'}</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Samples View */}
          {activeView === 'samples' && (
            <motion.div
              key="samples"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Search and Filters */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <div className="relative">
                      <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={currentLang === 'en' ? 'Search by sample ID, type...' : 'සොයන්න...'}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
                    >
                      <option value="all">{currentLang === 'en' ? 'All Status' : 'සියලු තත්ත්වය'}</option>
                      <option value="submitted">{currentLang === 'en' ? 'Submitted' : 'ඉදිරිපත් කළ'}</option>
                      <option value="received">{currentLang === 'en' ? 'Received' : 'ලැබී ඇත'}</option>
                      <option value="processing">{currentLang === 'en' ? 'Processing' : 'සැකසීම'}</option>
                      <option value="completed">{currentLang === 'en' ? 'Completed' : 'සම්පූර්ණ'}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Samples List */}
              {loading ? (
                <div className="flex justify-center py-12">
                  <Icons.Loader className="w-8 h-8 animate-spin text-purple-600" />
                </div>
              ) : filteredSamples.length > 0 ? (
                <div className="grid gap-4">
                  {filteredSamples.map((sample) => (
                    <motion.div
                      key={sample.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all cursor-pointer group"
                      onClick={() => setSelectedSample(sample)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Icons.TestTube className="text-purple-600 group-hover:scale-110 transition-transform" size={24} />
                            <h3 className="text-xl font-bold text-gray-900">{sample.sampleId}</h3>
                          </div>
                          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Icons.Droplet size={16} />
                              <span><strong>Type:</strong> {sample.sampleType}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Icons.Calendar size={16} />
                              <span><strong>Submitted:</strong> {sample.submittedAt ? new Date(sample.submittedAt).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Icons.MapPin size={16} />
                              <span><strong>Location:</strong> {sample.location || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(sample.status)}`}>
                            {sample.status}
                          </span>
                          <button className="text-purple-600 hover:text-purple-700 font-semibold text-sm flex items-center gap-1">
                            {currentLang === 'en' ? 'Track Sample' : 'ලුහුබැඳීම'}
                            <Icons.ChevronRight size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <Icons.TestTube className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500 text-lg">{currentLang === 'en' ? 'No samples found' : 'නියැදි හමු නොවීය'}</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Track Sample View */}
          {activeView === 'track' && (
            <motion.div
              key="track"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Icons.Search className="text-blue-600" size={32} />
                  {currentLang === 'en' && 'Track Your Sample'}
                  {currentLang === 'si' && 'ඔබේ නියැදිය ලුහුබැඳින්න'}
                  {currentLang === 'ta' && 'உங்கள் மாதிரியைக் கண்காணிக்கவும்'}
                </h2>

                <div className="flex gap-4 mb-8">
                  <input
                    type="text"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder={currentLang === 'en' ? 'Enter Sample ID (e.g., SMP-1234567890-ABC123)' : 'නියැදි හැඳුනුම්පත ඇතුළත් කරන්න'}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                  />
                  <button
                    onClick={trackSample}
                    disabled={loading || !trackingId.trim()}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <Icons.Loader className="w-5 h-5 animate-spin" />
                    ) : (
                      <Icons.Search size={20} />
                    )}
                    {currentLang === 'en' ? 'Track' : 'ලුහුබඳින්න'}
                  </button>
                </div>

                {/* Sample Tracking Result */}
                {selectedSample && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border-2 border-blue-200"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedSample.sampleId}</h3>
                        <p className="text-gray-600">{selectedSample.sampleType}</p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(selectedSample.status)}`}>
                        {selectedSample.status}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Submitted Date</p>
                        <p className="font-semibold text-gray-900">
                          {selectedSample.submittedAt ? new Date(selectedSample.submittedAt).toLocaleString() : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Location</p>
                        <p className="font-semibold text-gray-900">{selectedSample.location || 'N/A'}</p>
                      </div>
                      {selectedSample.receivedAt && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Received Date</p>
                          <p className="font-semibold text-gray-900">
                            {new Date(selectedSample.receivedAt).toLocaleString()}
                          </p>
                        </div>
                      )}
                      {selectedSample.completedAt && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Completed Date</p>
                          <p className="font-semibold text-gray-900">
                            {new Date(selectedSample.completedAt).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Status Timeline */}
                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-200" />
                      {[
                        { status: 'submitted', label: 'Submitted', completed: true },
                        { status: 'received', label: 'Received', completed: selectedSample.status !== 'submitted' },
                        { status: 'processing', label: 'Processing', completed: selectedSample.status === 'processing' || selectedSample.status === 'completed' },
                        { status: 'completed', label: 'Completed', completed: selectedSample.status === 'completed' }
                      ].map((stage, idx) => (
                        <div key={idx} className="relative flex items-center gap-4 mb-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                            stage.completed ? 'bg-blue-600' : 'bg-gray-300'
                          }`}>
                            {stage.completed ? (
                              <Icons.Check className="text-white" size={16} />
                            ) : (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                          <div>
                            <p className={`font-semibold ${stage.completed ? 'text-blue-900' : 'text-gray-500'}`}>
                              {stage.label}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {selectedSample.statusNotes && (
                      <div className="mt-6 p-4 bg-white rounded-xl border border-blue-200">
                        <p className="text-sm font-semibold text-gray-700 mb-1">Notes:</p>
                        <p className="text-gray-600">{selectedSample.statusNotes}</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LabResultsPortal;
