import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, FileText, Search, MapPin, Calendar,
  DollarSign, Building, X, LogIn, UserPlus,
  Clock, TrendingUp, Users,
  ArrowRight, Filter, Download, Eye, Loader, Globe, Check
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import EnhancedRegistration from './components/EnhancedRegistration';
import { jobsService, tendersService, dashboardStatsService, seedPortalData } from '../../services/portalDataService';

const SimplePortal = () => {
  const { t, i18n } = useTranslation('procurement');
  const [activeTab, setActiveTab] = useState('jobs');
  const [showRegistration, setShowRegistration] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [tenders, setTenders] = useState([]);
  const [stats, setStats] = useState({
    activeJobs: 0,
    openTenders: 0,
    totalApplications: 0,
    successRate: 0
  });

  // Load data on component mount
  useEffect(() => {
    loadPortalData();
  }, []);

  const loadPortalData = async () => {
    setLoading(true);
    try {
      // Load jobs, tenders, and stats in parallel
      const [jobsResult, tendersResult, statsResult] = await Promise.all([
        jobsService.getAllPublished({ limit: 10 }),
        tendersService.getAllPublished({ limit: 10 }),
        dashboardStatsService.getStats()
      ]);

      // Check if we got any data
      const hasJobs = jobsResult.data && jobsResult.data.length > 0;
      const hasTenders = tendersResult.data && tendersResult.data.length > 0;

      // If no data exists, seed the database with sample data
      if (!hasJobs && !hasTenders) {
        console.log('No data found, seeding database...');
        await seedPortalData();
        // Reload data after seeding
        const [newJobsResult, newTendersResult, newStatsResult] = await Promise.all([
          jobsService.getAllPublished({ limit: 10 }),
          tendersService.getAllPublished({ limit: 10 }),
          dashboardStatsService.getStats()
        ]);
        setJobs(newJobsResult.data || []);
        setTenders(newTendersResult.data || []);
        setStats(newStatsResult.data || {
          activeJobs: newJobsResult.data?.length || 0,
          openTenders: newTendersResult.data?.length || 0,
          totalApplications: 0,
          successRate: 0
        });
      } else {
        setJobs(jobsResult.data || []);
        setTenders(tendersResult.data || []);
        setStats(statsResult.data || {
          activeJobs: jobsResult.data?.length || 0,
          openTenders: tendersResult.data?.length || 0,
          totalApplications: 0,
          successRate: 0
        });
      }
    } catch (error) {
      console.error('Error loading portal data:', error);
      // Set empty arrays on error
      setJobs([]);
      setTenders([]);
    } finally {
      setLoading(false);
    }
  };

  const statsDisplay = [
    { label: t('simplePortal.stats.activeJobs'), value: stats.activeJobs.toString(), icon: Briefcase, color: 'blue' },
    { label: t('simplePortal.stats.openTenders'), value: stats.openTenders.toString(), icon: FileText, color: 'green' },
    { label: t('simplePortal.stats.totalApplications'), value: stats.totalApplications > 0 ? `${stats.totalApplications}+` : '0', icon: Users, color: 'purple' },
    { label: t('simplePortal.stats.successRate'), value: `${stats.successRate}%`, icon: TrendingUp, color: 'orange' }
  ];

  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const endDate = new Date(deadline);
    const days = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

        {/* Language Switcher */}
        <div className="absolute top-6 right-6 z-10">
          <div className="relative">
            <button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-xl hover:bg-white/20 transition-all"
            >
              <Globe className="w-5 h-5" />
              <span className="font-semibold text-sm uppercase">
                {i18n.language === 'en' ? 'EN' : i18n.language === 'si' ? 'සිං' : 'தமி'}
              </span>
            </button>

            {showLanguageMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200 min-w-[180px]"
              >
                <button
                  onClick={() => {
                    i18n.changeLanguage('en');
                    setShowLanguageMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center justify-between text-gray-700 font-medium"
                >
                  <span>English</span>
                  {i18n.language === 'en' && <Check className="w-4 h-4 text-blue-600" />}
                </button>
                <button
                  onClick={() => {
                    i18n.changeLanguage('si');
                    setShowLanguageMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center justify-between text-gray-700 font-medium"
                >
                  <span>සිංහල</span>
                  {i18n.language === 'si' && <Check className="w-4 h-4 text-blue-600" />}
                </button>
                <button
                  onClick={() => {
                    i18n.changeLanguage('ta');
                    setShowLanguageMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center justify-between text-gray-700 font-medium"
                >
                  <span>தமிழ்</span>
                  {i18n.language === 'ta' && <Check className="w-4 h-4 text-blue-600" />}
                </button>
              </motion.div>
            )}
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-semibold mb-4">
              {t('simplePortal.hero.badge')}
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {t('simplePortal.hero.title')} <span className="text-blue-200">{t('simplePortal.hero.titleHighlight')}</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              {t('simplePortal.hero.description')}
            </p>

            {/* Sign In and Register Buttons */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <button
                onClick={() => setShowLogin(true)}
                className="flex items-center gap-2 px-8 py-3.5 bg-white/10 backdrop-blur-md text-white rounded-xl font-bold transition-all border-2 border-white/30 hover:bg-white/20 hover:border-white/50 hover:shadow-xl"
              >
                <LogIn className="w-5 h-5" />
                {t('simplePortal.hero.signIn')}
              </button>
              <button
                onClick={() => setShowRegistration(true)}
                className="flex items-center gap-2 px-8 py-3.5 bg-white text-blue-600 rounded-xl hover:shadow-2xl font-bold transition-all hover:scale-105"
              >
                <UserPlus className="w-5 h-5" />
                {t('simplePortal.hero.registerNow')}
              </button>
            </div>

            {/* Tab Switcher */}
            <div className="inline-flex bg-white/10 backdrop-blur-md rounded-2xl p-2 gap-2 shadow-2xl">
              <button
                onClick={() => setActiveTab('jobs')}
                className={`px-10 py-4 rounded-xl font-bold transition-all flex items-center gap-3 ${
                  activeTab === 'jobs'
                    ? 'bg-white text-blue-600 shadow-xl scale-105'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <Briefcase className="w-6 h-6" />
                <div className="text-left">
                  <div className="text-lg">{t('simplePortal.tabs.jobs.title')}</div>
                  <div className="text-xs opacity-70">{t('simplePortal.tabs.jobs.count', { count: jobs.length })}</div>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('tenders')}
                className={`px-10 py-4 rounded-xl font-bold transition-all flex items-center gap-3 ${
                  activeTab === 'tenders'
                    ? 'bg-white text-green-600 shadow-xl scale-105'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <FileText className="w-6 h-6" />
                <div className="text-left">
                  <div className="text-lg">{t('simplePortal.tabs.tenders.title')}</div>
                  <div className="text-xs opacity-70">{t('simplePortal.tabs.tenders.count', { count: tenders.length })}</div>
                </div>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" className="w-full h-16 fill-white">
            <path d="M0,0 C300,60 900,60 1200,0 L1200,120 L0,120 Z"></path>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 -mt-8 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statsDisplay.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
            >
              <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center mb-3`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="max-w-7xl mx-auto px-4 mb-8">
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={activeTab === 'jobs' ? t('simplePortal.search.jobsPlaceholder') : t('simplePortal.search.tendersPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-base"
              />
            </div>
            <button className="px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold flex items-center gap-2 justify-center">
              <Search className="w-5 h-5" />
              {t('simplePortal.search.button')}
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 font-medium">{t('simplePortal.jobs.loading')}</p>
            </div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {/* Jobs Section */}
            {activeTab === 'jobs' && (
            <motion.div
              key="jobs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('simplePortal.jobs.heading')}</h2>
                  <p className="text-gray-600">{t('simplePortal.jobs.subheading')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 border-2 border-gray-200 rounded-xl hover:border-blue-500 flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    {t('simplePortal.jobs.filter')}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {jobs.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-600 mb-2">{t('simplePortal.jobs.noJobs')}</h3>
                    <p className="text-gray-500">{t('simplePortal.jobs.noJobsMessage')}</p>
                  </div>
                ) : (
                  jobs.map((job, index) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-2xl transition-all group"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                                ● {job.status || t('simplePortal.jobs.status')}
                              </span>
                              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold">
                                {job.employmentType || 'Full-time'}
                              </span>
                              <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-semibold">
                                {t('simplePortal.jobs.applicants', { count: job.applicationCount || 0 })}
                              </span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                              {job.jobTitle || job.title}
                            </h3>
                            <p className="text-gray-600 mb-4">{job.description}</p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div className="flex items-center gap-2 text-gray-700">
                                <Building className="w-5 h-5 text-blue-600" />
                                <div>
                                  <div className="text-xs text-gray-500">{t('simplePortal.jobs.department')}</div>
                                  <div className="font-semibold text-sm">{job.department}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-gray-700">
                                <MapPin className="w-5 h-5 text-green-600" />
                                <div>
                                  <div className="text-xs text-gray-500">{t('simplePortal.jobs.location')}</div>
                                  <div className="font-semibold text-sm">{job.location}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-gray-700">
                                <DollarSign className="w-5 h-5 text-orange-600" />
                                <div>
                                  <div className="text-xs text-gray-500">{t('simplePortal.jobs.salaryRange')}</div>
                                  <div className="font-bold text-sm text-orange-600">{job.salaryRange || job.salary}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-gray-700">
                                <Clock className="w-5 h-5 text-red-600" />
                                <div>
                                  <div className="text-xs text-gray-500">{t('simplePortal.jobs.deadline')}</div>
                                  <div className="font-bold text-sm text-red-600">{t('simplePortal.jobs.daysRemaining', { count: getDaysRemaining(job.closingDate || job.deadline) })}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex gap-2">
                          <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2 text-sm font-medium">
                            <Eye className="w-4 h-4" />
                            {t('simplePortal.jobs.viewDetails')}
                          </button>
                          <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2 text-sm font-medium">
                            <Download className="w-4 h-4" />
                            {t('simplePortal.jobs.downloadJD')}
                          </button>
                        </div>
                        <button
                          onClick={() => setShowRegistration(true)}
                          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg font-bold flex items-center gap-2 group-hover:scale-105 transition-transform"
                        >
                          {t('simplePortal.jobs.applyNow')}
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* Tenders Section */}
          {activeTab === 'tenders' && (
            <motion.div
              key="tenders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('simplePortal.tenders.heading')}</h2>
                  <p className="text-gray-600">{t('simplePortal.tenders.subheading')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 border-2 border-gray-200 rounded-xl hover:border-green-500 flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    {t('simplePortal.tenders.filter')}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {tenders.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-600 mb-2">{t('simplePortal.tenders.noTenders')}</h3>
                    <p className="text-gray-500">{t('simplePortal.tenders.noTendersMessage')}</p>
                  </div>
                ) : (
                  tenders.map((tender, index) => (
                    <motion.div
                      key={tender.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-2xl transition-all group"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                                ● {tender.status || t('simplePortal.tenders.status')}
                              </span>
                              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold">
                                {tender.category}
                              </span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                              {tender.title}
                            </h3>
                            <p className="text-gray-600 mb-4">{tender.description}</p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div className="flex items-center gap-2 text-gray-700">
                                <Building className="w-5 h-5 text-blue-600" />
                                <div>
                                  <div className="text-xs text-gray-500">{t('simplePortal.jobs.department')}</div>
                                  <div className="font-semibold text-sm">{tender.department}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-gray-700">
                                <DollarSign className="w-5 h-5 text-green-600" />
                                <div>
                                  <div className="text-xs text-gray-500">{t('simplePortal.tenders.tenderValue')}</div>
                                  <div className="font-bold text-sm text-green-600">{tender.tenderValue || tender.value}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-gray-700">
                                <Calendar className="w-5 h-5 text-purple-600" />
                                <div>
                                  <div className="text-xs text-gray-500">{t('simplePortal.tenders.bidOpening')}</div>
                                  <div className="font-semibold text-sm">{new Date(tender.bidOpeningDate || tender.bidOpening).toLocaleDateString()}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-gray-700">
                                <Clock className="w-5 h-5 text-red-600" />
                                <div>
                                  <div className="text-xs text-gray-500">{t('simplePortal.tenders.deadline')}</div>
                                  <div className="font-bold text-sm text-red-600">{t('simplePortal.tenders.daysRemaining', { count: getDaysRemaining(tender.closingDate || tender.deadline) })}</div>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                              <span className="text-xs text-gray-600">{t('simplePortal.tenders.requiredDocuments')}</span>
                              {(tender.requiredDocuments || tender.documents || []).map((doc, i) => (
                                <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                                  📄 {doc}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex gap-2">
                          <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2 text-sm font-medium">
                            <Eye className="w-4 h-4" />
                            {t('simplePortal.tenders.viewDetails')}
                          </button>
                          <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2 text-sm font-medium">
                            <Download className="w-4 h-4" />
                            {t('simplePortal.tenders.downloadDocuments')}
                          </button>
                        </div>
                        <button
                          onClick={() => setShowRegistration(true)}
                          className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:shadow-lg font-bold flex items-center gap-2 group-hover:scale-105 transition-transform"
                        >
                          {t('simplePortal.tenders.submitBid')}
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">{t('simplePortal.cta.heading')}</h2>
          <p className="text-xl text-blue-100 mb-8">
            {t('simplePortal.cta.description')}
          </p>
          <button
            onClick={() => setShowRegistration(true)}
            className="px-10 py-4 bg-white text-blue-600 rounded-xl hover:shadow-2xl font-bold text-lg flex items-center gap-3 mx-auto"
          >
            <UserPlus className="w-6 h-6" />
            {t('simplePortal.cta.createAccount')}
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-3xl">N</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">{t('simplePortal.footer.title')}</h3>
            <p className="text-gray-400 mb-6">{t('simplePortal.footer.subtitle')}</p>
            <p className="text-sm text-gray-500">{t('simplePortal.footer.copyright')}</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showRegistration && (
        <EnhancedRegistration
          onClose={() => setShowRegistration(false)}
          onSuccess={(user) => {
            console.log('User registered:', user);
            setShowRegistration(false);
          }}
          translations={{}}
        />
      )}

      {showLogin && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Welcome Back</h2>
                <button onClick={() => setShowLogin(false)} className="p-2 hover:bg-white/10 rounded-lg">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-blue-100 text-sm mt-1">Login to access your account</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
              <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg font-bold">
                Login to Account
              </button>
              <p className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={() => {
                    setShowLogin(false);
                    setShowRegistration(true);
                  }}
                  className="text-blue-600 font-bold hover:underline"
                >
                  Register Now
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SimplePortal;
