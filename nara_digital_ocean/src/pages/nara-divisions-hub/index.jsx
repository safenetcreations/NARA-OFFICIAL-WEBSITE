import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { DIVISIONS_CONFIG, getDivisionById } from '../../data/divisionsConfig';
import PDFDownloadCard from '../../components/PDFDownloadCard';

const DivisionsHub = () => {
  const { t, i18n } = useTranslation('divisions');
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDivisions, setFilteredDivisions] = useState(DIVISIONS_CONFIG);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filterCategory, setFilterCategory] = useState('all'); // 'all', 'research', 'services', 'monitoring'
  const currentLang = i18n.language;
  const isTamil = currentLang === 'ta';
  const isSinhala = currentLang === 'si';
  const headingFontClass = isTamil ? 'font-tamil' : isSinhala ? 'font-sinhala' : 'font-headline';
  const headingLeadingClass = isTamil || isSinhala ? 'leading-[1.5]' : 'leading-tight';
  const headingPaddingClass = isTamil || isSinhala ? 'pt-4' : '';
  const categoryLabels = t('filters.categories', { returnObjects: true });
  const viewLabels = t('filters.view', { returnObjects: true });
  const heroStats = t('hero.stats', { returnObjects: true }) || [];
  const cardMetrics = t('card.metrics', { returnObjects: true }) || {};
  const cardActions = t('card.actions', { returnObjects: true }) || {};

  useEffect(() => {
    let filtered = DIVISIONS_CONFIG;

    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(division => {
        const name = division.name[currentLang]?.toLowerCase() || '';
        const tagline = division.tagline[currentLang]?.toLowerCase() || '';
        const description = division.description[currentLang]?.toLowerCase() || '';
        return name.includes(query) || tagline.includes(query) || description.includes(query);
      });
    }

    // Apply category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(division => {
        // Custom categorization logic
        const researchDivisions = ['environmental-studies', 'marine-biology', 'oceanography'];
        const servicesDivisions = ['fishing-technology', 'post-harvest', 'hydrography'];
        const monitoringDivisions = ['monitoring-evaluation', 'socio-economics'];

        switch (filterCategory) {
          case 'research':
            return researchDivisions.includes(division.id);
          case 'services':
            return servicesDivisions.includes(division.id);
          case 'monitoring':
            return monitoringDivisions.includes(division.id);
          default:
            return true;
        }
      });
    }

    setFilteredDivisions(filtered);
  }, [searchQuery, filterCategory, currentLang]);

  const handleDivisionClick = (slug) => {
    navigate(`/divisions/${slug}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const categories = [
    { id: 'all', icon: 'LayoutGrid' },
    { id: 'research', icon: 'FlaskConical' },
    { id: 'services', icon: 'Briefcase' },
    { id: 'monitoring', icon: 'BarChart3' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      
      {/* Hero Section - Redesigned */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 text-white py-24 px-4 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="inline-block mb-6">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full">
                <LucideIcons.Building2 size={24} />
                <span className="text-sm font-semibold tracking-wide uppercase">
                  {t('hero.badge')}
                </span>
              </div>
            </div>

            <h1
              className={`text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent ${headingFontClass} ${headingLeadingClass} ${headingPaddingClass}`}
            >
              {t('hero.title')}
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto text-blue-100 leading-relaxed">
              {t('hero.subtitle')}
            </p>

            {/* Enhanced Search Bar */}
            <div className="max-w-3xl mx-auto">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl">
                  <LucideIcons.Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-blue-600" size={24} />
                  <input
                    type="text"
                    placeholder={t('hero.searchPlaceholder')}
                    aria-label={t('hero.searchAria')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-16 pr-6 py-5 rounded-2xl text-gray-900 text-lg placeholder-gray-500 focus:outline-none bg-transparent"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <LucideIcons.X size={20} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-12">
              {heroStats.map((stat, idx) => {
                const StatIcon = LucideIcons[stat.icon] || LucideIcons.Award;
                return (
                <motion.div
                  key={`${stat.label}-${idx}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20"
                >
                  {StatIcon && <StatIcon size={28} className="mx-auto mb-2" />}
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="text-sm text-blue-100">{stat.label}</div>
                </motion.div>
              );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filter & View Controls */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
              const IconComponent = LucideIcons[category.icon];
              return (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilterCategory(category.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                    filterCategory === category.id
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                  }`}
                >
                  <IconComponent size={18} />
                  <span>{categoryLabels?.[category.id] || ''}</span>
                </motion.button>
              );
            })}
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2 bg-white rounded-xl p-1.5 shadow-md">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <LucideIcons.LayoutGrid size={18} />
              <span className="hidden sm:inline">{viewLabels?.grid || 'Grid'}</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <LucideIcons.List size={18} />
              <span className="hidden sm:inline">{viewLabels?.list || 'List'}</span>
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 text-sm">
            {t('results.summary', {
              count: filteredDivisions.length,
              total: DIVISIONS_CONFIG.length
            })}
            {searchQuery && (
              <span> {t('results.matching', { query: searchQuery })}</span>
            )}
          </p>
        </div>
      </section>

      {/* Divisions Grid/List */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        {filteredDivisions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="bg-white rounded-3xl shadow-xl p-12 max-w-2xl mx-auto">
              <LucideIcons.SearchX size={80} className="mx-auto text-gray-300 mb-6" />
              <h3 className="text-2xl font-bold text-gray-800 mb-3">{t('empty.title')}</h3>
              <p className="text-gray-600 mb-6">
                {t('empty.description')}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterCategory('all');
                }}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                {t('empty.clear')}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
              : 'flex flex-col gap-6'
            }
          >
            {filteredDivisions.map((division) => {
              const IconComponent = LucideIcons[division.icon] || LucideIcons.Briefcase;

              return (
                <motion.div
                  key={division.id}
                  variants={cardVariants}
                  layout
                  className={viewMode === 'list' ? 'w-full' : ''}
                >
                  <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden h-full group">
                    
                    {/* Card Header with Gradient & Image */}
                    <div className="relative h-48 overflow-hidden">
                      {/* Background Image */}
                      {division.heroImage && (
                        <div 
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                          style={{ backgroundImage: `url(${division.heroImage})` }}
                        />
                      )}
                      {/* Gradient Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${division.gradient} opacity-90`} />
                      
                      {/* Content */}
                      <div className="relative h-full p-6 flex flex-col justify-between text-white">
                        <div className="flex items-start justify-between">
                          <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl">
                            <IconComponent size={32} />
                          </div>
                          {division.pdfResource && (
                            <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5">
                              <LucideIcons.FileText size={14} />
                              <span className="text-xs font-semibold">{t('card.pdfAvailable')}</span>
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <h3 className="text-2xl font-bold mb-2 leading-tight">
                            {division.name[currentLang]}
                          </h3>
                          <p className="text-sm opacity-90 line-clamp-2">
                            {division.tagline[currentLang]}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                      <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                        {division.description[currentLang]}
                      </p>

                      {/* Key Metrics */}
                      <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                          <div className="text-2xl font-bold text-blue-600">
                            {division.focusAreas.length}
                          </div>
                          <div className="text-xs text-gray-600 font-medium">{cardMetrics.focusAreas || 'Focus Areas'}</div>
                        </div>
                        <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                          <div className="text-2xl font-bold text-green-600">
                            {division.services.length}
                          </div>
                          <div className="text-xs text-gray-600 font-medium">{cardMetrics.services || 'Services'}</div>
                        </div>
                        <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                          <div className="text-2xl font-bold text-purple-600">
                            <LucideIcons.Users size={24} className="mx-auto" />
                          </div>
                          <div className="text-xs text-gray-600 font-medium">{cardMetrics.team || 'Team'}</div>
                        </div>
                      </div>

                      {/* PDF Quick Info */}
                      {division.pdfResource && (
                        <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                          <div className="flex items-center gap-3 mb-2">
                            <LucideIcons.Download size={18} className="text-amber-600" />
                            <span className="text-sm font-bold text-amber-900">
                              {t('card.pdfInfo.title')}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-amber-700">
                            <span className="flex items-center gap-1">
                              <LucideIcons.FileStack size={12} />
                              {t('card.pdfInfo.pages', { count: division.pdfResource.pages })}
                            </span>
                            <span className="flex items-center gap-1">
                              <LucideIcons.HardDrive size={12} />
                              {t('card.pdfInfo.size', { size: division.pdfResource.sizeKB })}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleDivisionClick(division.slug)}
                          className={`flex-1 bg-gradient-to-r ${division.gradient} text-white py-3.5 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2`}
                        >
                          <span>{cardActions.explore || t('card.actions.explore')}</span>
                          <LucideIcons.ArrowRight size={20} />
                        </motion.button>
                        
                        {division.pdfResource && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedDivision(division)}
                            className="bg-white border-2 border-gray-300 text-gray-700 p-3.5 rounded-xl font-semibold hover:border-gray-400 hover:shadow-lg transition-all duration-300"
                            title={cardActions.download || t('card.actions.download')}
                          >
                            <LucideIcons.Download size={20} />
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </section>

      {/* PDF Download Modal */}
      <AnimatePresence>
        {selectedDivision && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedDivision(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl"
            >
              <div className="relative">
                <button
                  onClick={() => setSelectedDivision(null)}
                  className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-xl hover:bg-gray-100 transition-all z-10"
                >
                  <LucideIcons.X size={24} className="text-gray-700" />
                </button>
                <PDFDownloadCard division={selectedDivision} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Call to Action */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 text-white py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                {t('cta.heading')}
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                {t('cta.description')}
              </p>
            </motion.div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/contact')}
              className="bg-white text-blue-900 px-8 py-4 rounded-xl font-bold hover:shadow-2xl transition-all duration-300 flex items-center gap-3"
            >
              <LucideIcons.Mail size={24} />
              <span>{t('cta.primary')}</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/research-excellence-portal')}
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-blue-900 transition-all duration-300 flex items-center gap-3"
            >
              <LucideIcons.BookOpen size={24} />
              <span>{t('cta.secondary')}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-cyan-500 text-white px-8 py-4 rounded-xl font-bold hover:shadow-2xl transition-all duration-300 flex items-center gap-3"
            >
              <LucideIcons.Download size={24} />
              <span>{t('cta.downloadAll')}</span>
            </motion.button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DivisionsHub;
