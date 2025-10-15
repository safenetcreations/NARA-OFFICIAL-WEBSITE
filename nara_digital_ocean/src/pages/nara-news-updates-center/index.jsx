import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Calendar,
  MapPin,
  Tag,
  Search,
  Filter,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Clock,
  User,
  Eye,
  BookOpen,
  ShieldCheck,
  ArrowRight,
  X
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import useNewsArticles from '../../hooks/useNewsArticles';
import usePageContent from '../../hooks/usePageContent';
import NewsHeader from './components/NewsHeader';
import ShareMenu from './components/ShareMenu';

const DATE_LOCALES = {
  en: 'en-US',
  ta: 'ta-LK',
  si: 'si-LK'
};

const CATEGORY_COLOR_MAP = {
  'Education & Outreach': 'bg-blue-100 text-blue-800 border-blue-200',
  'Research & Development': 'bg-purple-100 text-purple-800 border-purple-200',
  'Policy & Management': 'bg-green-100 text-green-800 border-green-200',
  'Technology & Innovation': 'bg-orange-100 text-orange-800 border-orange-200',
  'Environmental Initiatives': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'Conservation & Awareness': 'bg-teal-100 text-teal-800 border-teal-200',
  'Community Development': 'bg-pink-100 text-pink-800 border-pink-200',
  'Capacity Building': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'Technology Integration': 'bg-cyan-100 text-cyan-800 border-cyan-200',
  'International Cooperation': 'bg-red-100 text-red-800 border-red-200',
  'Industry Support': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Industry Development': 'bg-amber-100 text-amber-800 border-amber-200',
  'Cultural Events': 'bg-violet-100 text-violet-800 border-violet-200',
  'Institutional Milestones': 'bg-slate-100 text-slate-800 border-slate-200',
  'Conservation Partnerships': 'bg-lime-100 text-lime-800 border-lime-200'
};

const slugifyKey = (value = '') =>
  value
    ?.toString()
    ?.trim()
    ?.toLowerCase()
    ?.replace(/[^a-z0-9]+/g, '-')
    ?.replace(/(^-|-$)/g, '');

const localizeArticle = (article, language) => {
  if (!article) return null;
  const translation = article?.translations?.[language] || {};

  return {
    ...article,
    displayTitle: translation?.title || article?.title,
    displaySummary: translation?.summary || article?.summary,
    displayContent: translation?.content || article?.content,
    displayCategory: translation?.category || article?.category,
    displayLocation: translation?.location || article?.location,
    displayTags: Array.isArray(translation?.tags) ? translation?.tags : article?.tags || [],
    displayKeyPoints: Array.isArray(translation?.key_points)
      ? translation?.key_points
      : article?.key_points || [],
    displayAuthor: translation?.author || article?.author,
    displayAuthorPosition:
      translation?.author_position || translation?.authorPosition || article?.author_position
  };
};

const NewsPage = () => {
  const { t, i18n } = useTranslation('news');
  const {
    articles: rawArticles,
    metadata,
    latestArticles: rawLatestArticles,
    isLoading: isNewsLoading,
    error: newsError,
    source: newsSource
  } = useNewsArticles();
  const { heroContent, isLoading: isHeroLoading } = usePageContent('nara-news-updates-center');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [expandedArticle, setExpandedArticle] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [isFiltering, setIsFiltering] = useState(false);

  const articlesPerPage = 9;

  const localizedArticles = useMemo(
    () => rawArticles?.map(article => localizeArticle(article, i18n.language)) || [],
    [rawArticles, i18n.language]
  );

  const localizedLatestArticles = useMemo(
    () => rawLatestArticles?.map(article => localizeArticle(article, i18n.language)) || [],
    [rawLatestArticles, i18n.language]
  );

  const [filteredArticles, setFilteredArticles] = useState(localizedArticles);

  useEffect(() => {
    setFilteredArticles(localizedArticles);
  }, [localizedArticles]);

  const availableCategories = useMemo(() => {
    const categorySet = new Set();
    localizedArticles?.forEach(article => {
      if (article?.category) categorySet.add(article.category);
    });
    if (metadata?.categories) {
      Object.keys(metadata.categories).forEach(category => categorySet.add(category));
    }
    return ['all', ...Array.from(categorySet)];
  }, [localizedArticles, metadata?.categories]);

  useEffect(() => {
    setIsFiltering(true);
    setCurrentPage(1);

    const timer = setTimeout(() => {
      let working = [...(localizedArticles || [])];

      if (selectedCategory !== 'all') {
        working = working.filter(article => article?.category === selectedCategory);
      }

      if (searchTerm) {
        const needle = searchTerm.trim().toLowerCase();
        working = working.filter(article => {
          const baseMatch = [
            article?.displayTitle,
            article?.displaySummary,
            article?.displayContent,
            article?.displayAuthor,
            article?.displayLocation
          ]
            .filter(Boolean)
            .some(value => value?.toLowerCase()?.includes(needle));
          const tagMatch = (article?.displayTags || []).some(tag =>
            tag?.toLowerCase()?.includes(needle)
          );
          return baseMatch || tagMatch;
        });
      }

      if (dateRange?.start || dateRange?.end) {
        working = working.filter(article => {
          const articleDate = article?.date ? new Date(article.date) : null;
          if (!articleDate || Number.isNaN(articleDate)) return false;
          const startDate = dateRange?.start ? new Date(dateRange.start) : null;
          const endDate = dateRange?.end ? new Date(dateRange.end) : null;
          if (startDate && articleDate < startDate) return false;
          if (endDate && articleDate > endDate) return false;
          return true;
        });
      }

      working.sort((a, b) => {
        const compareNumeric = (valA, valB) =>
          sortOrder === 'asc' ? valA - valB : valB - valA;
        const compareString = (valA, valB) =>
          sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);

        switch (sortBy) {
          case 'views':
            return compareNumeric(a?.views || 0, b?.views || 0);
          case 'shares':
            return compareNumeric(a?.social_shares || 0, b?.social_shares || 0);
          case 'title':
            return compareString(
              a?.displayTitle?.toLowerCase() || '',
              b?.displayTitle?.toLowerCase() || ''
            );
          case 'category':
            return compareString(
              a?.displayCategory?.toLowerCase() || '',
              b?.displayCategory?.toLowerCase() || ''
            );
          case 'date':
          default: {
            const dateA = a?.date ? new Date(a.date).getTime() : 0;
            const dateB = b?.date ? new Date(b.date).getTime() : 0;
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
          }
        }
      });

      setFilteredArticles(working);
      setIsFiltering(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [localizedArticles, selectedCategory, searchTerm, sortBy, sortOrder, dateRange]);

  const totalPages = Math.max(1, Math.ceil((filteredArticles?.length || 0) / articlesPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const indexOfLastArticle = currentPage * articlesPerPage;
  const currentArticles =
    filteredArticles?.slice(indexOfLastArticle - articlesPerPage, indexOfLastArticle) || [];

  const formatDate = (dateString) => {
    if (!dateString) return t('articles.datePending');
    try {
      const locale = DATE_LOCALES[i18n.language] || 'en-US';
      return new Date(dateString).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const getCategoryColor = (category) =>
    CATEGORY_COLOR_MAP[category] || 'bg-gray-100 text-gray-800 border-gray-200';

  const getCategoryLabel = (category) => {
    if (!category || category === 'all') {
      return t('filters.allCategories');
    }
    return t(`categories.${slugifyKey(category)}`, { defaultValue: category });
  };

  const formatStatNumber = (value) => {
    if (value == null) return '—';
    const numeric = Number(value);
    if (Number.isNaN(numeric)) {
      return value;
    }
    try {
      return numeric.toLocaleString();
    } catch (error) {
      return numeric;
    }
  };

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSearchTerm('');
    setSortBy('date');
    setSortOrder('desc');
    setDateRange({ start: '', end: '' });
    setCurrentPage(1);
  };

  const handleSortChange = (value) => {
    const [nextSortBy, nextSortOrder] = value.split('-');
    setSortBy(nextSortBy);
    setSortOrder(nextSortOrder);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const activeLoading = isNewsLoading || isHeroLoading || isFiltering;
  const selectedCategoryLabel = getCategoryLabel(selectedCategory);
  const filtersApplied =
    selectedCategory !== 'all' || searchTerm || dateRange?.start || dateRange?.end;
  const heroTickerArticles =
    localizedLatestArticles?.length > 0
      ? localizedLatestArticles
      : localizedArticles?.slice(0, 5);
  const resultsSummary = t('results.summary', {
    count: currentArticles?.length || 0,
    total: filteredArticles?.length || 0
  });

  const spotlightArticle = currentArticles?.[0] || null;
  const supportingArticles = currentArticles?.slice(1) || [];
  const featureGridArticles = supportingArticles.slice(0, 4);
  const timelineArticles = supportingArticles.slice(4);
  const adminStatusKey = newsError
    ? 'error'
    : newsSource === 'firestore'
      ? 'connected'
      : newsSource === 'local' || newsSource === 'empty'
        ? 'cached'
        : newsSource === 'error'
          ? 'error'
          : 'unknown';
  const adminStatusMessage = t(`layout.admin.${adminStatusKey}`, {
    defaultValue:
      adminStatusKey === 'connected'
        ? 'Live sync with newsroom admin'
        : adminStatusKey === 'cached'
          ? 'Showing cached newsroom dataset'
          : adminStatusKey === 'error'
            ? 'Using fallback newsroom data'
            : 'Newsroom status unknown'
  });
  const lastUpdatedSource = metadata?.latest_date || spotlightArticle?.date || null;
  const lastUpdatedLabel = lastUpdatedSource
    ? formatDate(lastUpdatedSource)
    : t('articles.datePending');
  const totalArticlesCount = metadata?.total_articles ?? filteredArticles?.length ?? 0;
  const totalArticlesLabel = t('layout.admin.articleCount', {
    count: totalArticlesCount,
    defaultValue: `${totalArticlesCount} stories published`
  });
  const formattedTotalViews = formatStatNumber(metadata?.total_views);
  const averageReadTimeValue = metadata?.average_read_time ?? null;
  const spotlightReadMinutes =
    spotlightArticle?.read_time ||
    spotlightArticle?.estimatedRead ||
    metadata?.average_read_time ||
    5;
  const spotlightTags = spotlightArticle?.displayTags || spotlightArticle?.tags || [];
  const spotlightViews = spotlightArticle?.views ?? 0;
  const spotlightShares = spotlightArticle?.social_shares ?? 0;
  const spotlightHighlights =
    spotlightArticle?.displayKeyPoints || spotlightArticle?.key_points || [];

  const handleTickerSelect = (article) => {
    const localized = localizeArticle(article, i18n.language);
    setExpandedArticle(localized);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <NewsHeader
        heroContent={heroContent}
        metadata={metadata}
        tickerArticles={heroTickerArticles}
        isLoading={activeLoading}
        onTickerSelect={handleTickerSelect}
      />
      {/* Enhanced Filter and Search Section */}
      <section id="latest" className="py-12 px-4 bg-white shadow-lg">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
          >
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-800 flex items-center">
                <BookOpen className="w-8 h-8 mr-3 text-blue-600" />
                {t('filters.sectionTitle')}
              </h2>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Filter className="w-5 h-5" />
                  {t('filters.advanced')}
                </button>

                {filtersApplied && (
                  <button
                    onClick={clearAllFilters}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300"
                  >
                    <X className="w-5 h-5" />
                    {t('filters.clearAll')}
                  </button>
                )}
              </div>
            </div>

            {newsError && (
              <div className="mb-6 w-full rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                {t('results.dataSource.error')}
              </div>
            )}

            {newsSource === 'local' && !newsError && (
              <div className="mb-6 w-full rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                {t('results.dataSource.localFallback')}
              </div>
            )}

            {/* Enhanced Search Bar */}
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                placeholder={t('filters.searchPlaceholder')}
                aria-label={t('filters.searchPlaceholder')}
                className="w-full pl-12 pr-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e?.target?.value)}
              />
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              {availableCategories?.map((category) => {
                const isAll = category === 'all';
                const count = !isAll ? metadata?.categories?.[category] : null;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform -translate-y-1'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                    }`}
                  >
                    {isAll ? t('filters.allCategories') : getCategoryLabel(category)}
                    {!isAll && typeof count === 'number' && (
                      <span className="ml-2 text-xs opacity-75">({count})</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Advanced Filters */}
            <AnimatePresence>
              {showAdvancedFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mt-8 pt-8 border-t-2 border-gray-100"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        {t('filters.sortLabel')}
                      </label>
                      <select
                        value={`${sortBy}-${sortOrder}`}
                        onChange={(e) => handleSortChange(e?.target?.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                      >
                        <option value="date-desc">{t('filters.sortOptions.dateDesc')}</option>
                        <option value="date-asc">{t('filters.sortOptions.dateAsc')}</option>
                        <option value="views-desc">{t('filters.sortOptions.viewsDesc')}</option>
                        <option value="shares-desc">{t('filters.sortOptions.sharesDesc')}</option>
                        <option value="title-asc">{t('filters.sortOptions.titleAsc')}</option>
                        <option value="title-desc">{t('filters.sortOptions.titleDesc')}</option>
                        <option value="category-asc">
                          {t('filters.sortOptions.categoryAsc')}
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        {t('filters.dateFrom')}
                      </label>
                      <input
                        type="date"
                        value={dateRange?.start}
                        onChange={(e) =>
                          setDateRange(prev => ({ ...prev, start: e?.target?.value }))
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        {t('filters.dateTo')}
                      </label>
                      <input
                        type="date"
                        value={dateRange?.end}
                        onChange={(e) =>
                          setDateRange(prev => ({ ...prev, end: e?.target?.value }))
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
      {/* Results Summary */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-gray-600 text-lg">
              <span>{resultsSummary}</span>
              {selectedCategory !== 'all' && (
                <span className="ml-2 text-blue-600 font-medium">
                  {t('results.categorySuffix', { category: selectedCategoryLabel })}
                </span>
              )}
              {searchTerm && (
                <span className="ml-2 text-green-600 font-medium">
                  {t('results.searchSuffix', { term: searchTerm })}
                </span>
              )}
            </div>

            {/* Active Filter Tags */}
            {filtersApplied && (
              <div className="flex flex-wrap gap-2">
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    <Tag className="w-3 h-3" />
                    {selectedCategoryLabel}
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className="ml-1 hover:text-blue-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {searchTerm && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    <Search className="w-3 h-3" />
                    {searchTerm}
                    <button
                      onClick={() => setSearchTerm('')}
                      className="ml-1 hover:text-green-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {(dateRange?.start || dateRange?.end) && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    <Calendar className="w-3 h-3" />
                    {t('results.dateRangeLabel')}
                    <button
                      onClick={() => setDateRange({ start: '', end: '' })}
                      className="ml-1 hover:text-purple-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
      {/* Enhanced Articles Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {activeLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)]?.map((_, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg animate-pulse">
                  <div className="h-64 bg-gray-200 rounded-t-2xl"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-4 w-20 bg-gray-200 rounded"></div>
                      <div className="h-4 w-16 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredArticles?.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="max-w-md mx-auto">
                <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full flex items-center justify-center">
                  <Search className="w-16 h-16 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {t('results.emptyTitle')}
                </h3>
                <p className="text-gray-600 mb-8 text-lg">
                  {t('results.emptyDescription')}
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  {t('results.emptyResetButton')}
                </button>
              </div>
            </motion.div>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="grid gap-10 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]"
              >
                <div className="space-y-8">
                  {spotlightArticle && (
                    <motion.article
                      key={spotlightArticle?.id || spotlightArticle?.slug || 'spotlight'}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                    >
                      <div className="absolute -right-36 -top-32 h-72 w-72 rounded-full bg-gradient-to-br from-cyan-100 via-blue-50 to-slate-100 blur-3xl opacity-60"></div>
                      <div className="relative z-10 grid gap-8 p-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start">
                        <div className="space-y-6">
                          <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-blue-700">
                            <span className="inline-flex items-center gap-2 rounded-full bg-blue-100/80 px-4 py-2 text-blue-700">
                              <Activity className="h-4 w-4" />
                              {t('layout.spotlightTitle')}
                            </span>
                            {spotlightArticle?.displayCategory && (
                              <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 px-4 py-2 text-blue-800">
                                <Tag className="h-3.5 w-3.5" />
                                {spotlightArticle.displayCategory}
                              </span>
                            )}
                          </div>

                          <div className="space-y-4">
                            <h3 className="text-3xl font-bold leading-tight text-slate-900 lg:text-4xl">
                              {spotlightArticle?.displayTitle || spotlightArticle?.title}
                            </h3>
                            {spotlightArticle?.displaySummary && (
                              <p className="text-lg leading-relaxed text-slate-600">
                                {spotlightArticle.displaySummary}
                              </p>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                            <div className="inline-flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {formatDate(spotlightArticle?.date)}
                            </div>
                            {spotlightArticle?.displayLocation && (
                              <div className="inline-flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {spotlightArticle.displayLocation}
                              </div>
                            )}
                            <div className="inline-flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {t('articles.readTimeShort', { minutes: spotlightReadMinutes })}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-3">
                            {spotlightTags.slice(0, 6).map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                              >
                                #{tag}
                              </span>
                            ))}
                            {spotlightTags.length === 0 && (
                              <span className="text-sm text-slate-500">
                                {t('modal.noTags')}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-3">
                            <button
                              onClick={() => setExpandedArticle(spotlightArticle)}
                              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-blue-700 hover:shadow-xl"
                            >
                              {t('articles.readFull')}
                              <ArrowRight className="h-4 w-4" />
                            </button>
                            <ShareMenu
                              article={spotlightArticle}
                              size="sm"
                            />
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-6 shadow-inner">
                            <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                              <div>
                                <p className="text-xs uppercase tracking-wide text-slate-500">
                                  {t('modal.stats.views')}
                                </p>
                                <p className="mt-2 text-2xl font-semibold text-slate-900">
                                  {formatStatNumber(spotlightViews)}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-wide text-slate-500">
                                  {t('modal.stats.shares')}
                                </p>
                                <p className="mt-2 text-2xl font-semibold text-slate-900">
                                  {formatStatNumber(spotlightShares)}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="rounded-2xl border border-blue-100 bg-white/80 p-6 shadow-sm">
                            <p className="text-xs uppercase tracking-wide text-slate-500">
                              {t('modal.highlightsTitle')}
                            </p>
                            {spotlightHighlights.length > 0 ? (
                              <ul className="mt-3 space-y-3 text-sm text-slate-600">
                                {spotlightHighlights.slice(0, 4).map((highlight, index) => (
                                  <li
                                    key={`spotlight-highlight-${index}`}
                                    className="flex items-start gap-2"
                                  >
                                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500"></span>
                                    <span>{highlight}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="mt-3 text-sm text-slate-500">
                                {t('layout.spotlight.noHighlights')}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  )}

                  {featureGridArticles.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-slate-900">
                        {t('layout.moreStoriesTitle')}
                      </h3>
                      <div className="grid gap-6 md:grid-cols-2">
                        {featureGridArticles.map((article, index) => {
                          const readMinutes =
                            article?.read_time ||
                            article?.estimatedRead ||
                            metadata?.average_read_time ||
                            5;

                          return (
                            <motion.article
                              key={article?.id || `${article?.slug}-${index}`}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: index * 0.05 }}
                              className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                            >
                              <div className="space-y-4">
                                <div className="flex items-start justify-between gap-3">
                                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                    {article?.displayCategory || article?.category}
                                  </span>
                                  {article?.is_featured && (
                                    <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-700">
                                      {t('articles.featured')}
                                    </span>
                                  )}
                                </div>
                                <h4 className="text-lg font-semibold leading-tight text-slate-900">
                                  {article?.displayTitle || article?.title}
                                </h4>
                                {article?.displaySummary && (
                                  <p className="text-sm leading-relaxed text-slate-600 line-clamp-3">
                                    {article.displaySummary}
                                  </p>
                                )}
                                {article?.displayAuthor && (
                                  <p className="text-xs font-medium text-slate-500">
                                    {article.displayAuthor}
                                    {article?.displayAuthorPosition && (
                                      <span className="text-slate-400"> · {article.displayAuthorPosition}</span>
                                    )}
                                  </p>
                                )}
                              </div>

                              <div className="mt-6 space-y-4">
                                <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                                  <span className="inline-flex items-center gap-1">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {formatDate(article?.date)}
                                  </span>
                                  {article?.displayLocation && (
                                    <span className="inline-flex items-center gap-1">
                                      <MapPin className="h-3.5 w-3.5" />
                                      {article.displayLocation}
                                    </span>
                                  )}
                                  <span className="inline-flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" />
                                    {t('articles.readTimeShort', { minutes: readMinutes })}
                                  </span>
                                </div>

                                <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
                                  <div className="flex items-center gap-3">
                                    <span className="inline-flex items-center gap-1">
                                      <Eye className="h-3.5 w-3.5" />
                                      {formatStatNumber(article?.views ?? 0)}
                                    </span>
                                    <span className="inline-flex items-center gap-1">
                                      <ExternalLink className="h-3.5 w-3.5" />
                                      {formatStatNumber(article?.social_shares ?? 0)}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => setExpandedArticle(article)}
                                      className="inline-flex items-center gap-2 font-semibold text-blue-600 transition-colors duration-300 hover:text-blue-800"
                                    >
                                      {t('articles.readFull')}
                                      <ArrowRight className="h-3.5 w-3.5" />
                                    </button>
                                    <ShareMenu
                                      article={article}
                                      size="sm"
                                    />
                                  </div>
                                </div>
                              </div>
                            </motion.article>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6 shadow-inner"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-md">
                        <ShieldCheck className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                          {t('layout.admin.title')}
                        </p>
                        <p className="mt-1 text-base font-semibold text-slate-900">
                          {adminStatusMessage}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {t('layout.admin.lastUpdated', { date: lastUpdatedLabel })}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-slate-600">
                      <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          {t('hero.stats.totalArticles')}
                        </p>
                        <p className="mt-2 text-3xl font-semibold text-slate-900">
                          {formatStatNumber(totalArticlesCount)}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">{totalArticlesLabel}</p>
                      </div>
                      <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          {t('hero.stats.totalViews')}
                        </p>
                        <p className="mt-2 text-3xl font-semibold text-slate-900">
                          {formattedTotalViews}
                        </p>
                      </div>
                      <div className="col-span-2 rounded-2xl bg-white/80 p-4 shadow-sm">
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          {t('hero.stats.averageReadTime')}
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-slate-900">
                          {averageReadTimeValue
                            ? t('articles.readTimeShort', { minutes: averageReadTimeValue })
                            : t('hero.stats.noReadTime')}
                        </p>
                      </div>
                    </div>

                    <Link
                      to="/admin/login"
                      className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-blue-700 hover:shadow-xl"
                    >
                      {t('layout.admin.openPanel')}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <Activity className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-slate-900">
                        {t('layout.timelineTitle')}
                      </h3>
                    </div>

                    {timelineArticles.length > 0 ? (
                      <div className="relative mt-6 pl-4">
                        <div className="absolute left-1 top-2 bottom-2 w-px bg-gradient-to-b from-blue-300 via-blue-200 to-cyan-200"></div>
                        <div className="space-y-6">
                          {timelineArticles.map((article, index) => {
                            const readMinutes =
                              article?.read_time ||
                              article?.estimatedRead ||
                              metadata?.average_read_time ||
                              5;

                            return (
                              <div key={article?.id || `${article?.slug}-${index}`} className="relative pl-4">
                                <span className="absolute -left-[0.95rem] top-2 flex h-3 w-3 items-center justify-center">
                                  <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                                </span>
                                <p className="text-xs uppercase tracking-wide text-slate-400">
                                  {formatDate(article?.date)}
                                </p>
                                <button
                                  onClick={() => setExpandedArticle(article)}
                                  className="mt-1 w-full text-left text-sm font-semibold text-slate-900 transition-colors duration-300 hover:text-blue-600"
                                >
                                  {article?.displayTitle || article?.title}
                                </button>
                                {article?.displaySummary && (
                                  <p className="mt-1 text-xs leading-relaxed text-slate-500 line-clamp-2">
                                    {article.displaySummary}
                                  </p>
                                )}
                                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                                  <span className="inline-flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {t('articles.readTimeShort', { minutes: readMinutes })}
                                  </span>
                                  {article?.displayLocation && (
                                    <span className="inline-flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      {article.displayLocation}
                                    </span>
                                  )}
                                </div>
                                <div className="mt-3 flex items-center gap-2">
                                  <ShareMenu article={article} size="sm" />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <p className="mt-6 text-sm leading-relaxed text-slate-600">
                        {t('layout.timelineEmpty')}
                      </p>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-16"
            >
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-3 rounded-xl border-2 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)?.map(page => {
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 2 && page <= currentPage + 2)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                          currentPage === page
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-600 shadow-lg transform -translate-y-1'
                            : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === currentPage - 3 ||
                    page === currentPage + 3
                  ) {
                    return (
                      <span key={page} className="px-2 text-gray-500">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-3 rounded-xl border-2 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="text-center mt-6 text-gray-600">
                Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
              </div>
            </motion.div>
          )}
        </div>
      </section>
      <AnimatePresence>
        {expandedArticle &&
          (() => {
            const modalArticle = expandedArticle;
            const modalReadMinutes =
              modalArticle?.read_time ||
              modalArticle?.estimatedRead ||
              metadata?.average_read_time ||
              5;
            const modalTags = modalArticle?.displayTags || modalArticle?.tags || [];
            const modalKeyPoints =
              modalArticle?.displayKeyPoints || modalArticle?.key_points || [];
            const categoryLabel =
              modalArticle?.displayCategory || getCategoryLabel(modalArticle?.category);
            const modalAuthor = modalArticle?.displayAuthor || modalArticle?.author;
            const modalAuthorPosition =
              modalArticle?.displayAuthorPosition || modalArticle?.author_position;
            const modalLocation = modalArticle?.displayLocation || modalArticle?.location;
            const modalSummary = modalArticle?.displaySummary || modalArticle?.summary;
            const modalContent = modalArticle?.displayContent || modalArticle?.content;
            const viewsValue = modalArticle?.views ?? 0;
            const sharesValue = modalArticle?.social_shares ?? 0;
            const tagsCount = modalTags.length;

            return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                onClick={() => setExpandedArticle(null)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="bg-white rounded-3xl max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl"
                  onClick={(e) => e?.stopPropagation()}
                >
                  <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b-2 border-gray-100 p-8 z-10 rounded-t-3xl">
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <span
                            className={`px-4 py-2 rounded-full text-sm font-semibold border ${getCategoryColor(
                              modalArticle?.category
                            )}`}
                          >
                            {categoryLabel}
                          </span>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            {formatDate(modalArticle?.date)}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            {t('articles.readTimeShort', { minutes: modalReadMinutes })}
                          </div>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 leading-tight">
                          {modalArticle?.displayTitle || modalArticle?.title}
                        </h2>
                        {modalLocation && (
                          <div className="flex items-center gap-1 text-gray-600 mb-2">
                            <MapPin className="w-5 h-5" />
                            <span className="text-lg">{modalLocation}</span>
                          </div>
                        )}
                        {modalAuthor && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <User className="w-5 h-5" />
                            <span className="font-medium text-lg">{modalAuthor}</span>
                            {modalAuthorPosition && (
                              <span className="text-gray-500">• {modalAuthorPosition}</span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <ShareMenu
                          article={modalArticle}
                          size="sm"
                          showLabel
                          showLink
                          orientation="column"
                        />
                        <button
                          onClick={() => setExpandedArticle(null)}
                          className="text-gray-400 hover:text-gray-600 text-3xl font-bold p-2 rounded-full hover:bg-gray-100 transition-all duration-300"
                          aria-label={t('modal.close', 'Close dialog')}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="prose max-w-none prose-lg">
                      {modalSummary && (
                        <p className="text-xl text-gray-700 mb-8 font-medium leading-relaxed">
                          {modalSummary}
                        </p>
                      )}

                      {modalContent && (
                        <div className="text-gray-600 leading-relaxed text-lg whitespace-pre-line mb-10">
                          {modalContent}
                        </div>
                      )}

                      {modalKeyPoints?.length > 0 && (
                        <div className="mt-10 p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-100">
                          <h4 className="font-bold text-gray-800 mb-6 flex items-center gap-3 text-xl">
                            <Eye className="w-6 h-6 text-blue-600" />
                            {t('modal.highlightsTitle')}
                          </h4>
                          <ul className="space-y-4">
                            {modalKeyPoints?.map((point, index) => (
                              <li key={`${point}-${index}`} className="flex items-start gap-3">
                                <div className="w-3 h-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-gray-700 text-lg leading-relaxed">{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="mt-10 p-6 bg-gray-50 rounded-2xl">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-gray-800">{viewsValue}</div>
                            <div className="text-sm text-gray-600">
                              {t('modal.stats.views')}
                            </div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-gray-800">{sharesValue}</div>
                            <div className="text-sm text-gray-600">
                              {t('modal.stats.shares')}
                            </div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-gray-800">
                              {modalReadMinutes}
                            </div>
                            <div className="text-sm text-gray-600">
                              {t('modal.stats.readTime')}
                            </div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-gray-800">{tagsCount}</div>
                            <div className="text-sm text-gray-600">
                              {t('modal.stats.tags')}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-10">
                        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-3 text-xl">
                          <Tag className="w-6 h-6 text-gray-600" />
                          {t('modal.relatedTopics')}
                        </h4>
                        <div className="flex flex-wrap gap-3">
                          {modalTags.map((tag, index) => (
                            <span
                              key={`${tag}-${index}`}
                              className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-full text-sm font-medium hover:from-gray-200 hover:to-gray-300 transition-all duration-300 cursor-pointer"
                            >
                              #{tag}
                            </span>
                          ))}
                          {modalTags.length === 0 && (
                            <span className="text-sm text-gray-500">
                              {t('modal.noTags')}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-10 pt-8 border-t-2 border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {t('modal.publishedBy', {
                              author: modalAuthor || t('modal.defaultAuthor')
                            })}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {t('modal.publishedOn', {
                              date: formatDate(modalArticle?.date)
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })()}
      </AnimatePresence>
    </div>
  );
};

export default NewsPage;
