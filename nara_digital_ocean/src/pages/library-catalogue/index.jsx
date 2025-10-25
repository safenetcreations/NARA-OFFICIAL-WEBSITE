import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as Icons from 'lucide-react';
import { searchService, catalogueService } from '../../services/libraryService';

// All 26 NARA Material Types
const MATERIAL_TYPES = [
  { code: 'ACT', icon: 'Scale', color: 'from-purple-500 to-purple-600' },
  { code: 'ATC', icon: 'Archive', color: 'from-amber-500 to-amber-600' },
  { code: 'BOBP', icon: 'FileText', color: 'from-blue-500 to-blue-600' },
  { code: 'CD', icon: 'Disc', color: 'from-cyan-500 to-cyan-600' },
  { code: 'DMAP', icon: 'Map', color: 'from-green-500 to-green-600' },
  { code: 'EBOOK', icon: 'Tablet', color: 'from-indigo-500 to-indigo-600' },
  { code: 'FAO', icon: 'FileSpreadsheet', color: 'from-emerald-500 to-emerald-600' },
  { code: 'IOC', icon: 'FileText', color: 'from-teal-500 to-teal-600' },
  { code: 'IWMI', icon: 'Droplet', color: 'from-sky-500 to-sky-600' },
  { code: 'JR', icon: 'BookOpen', color: 'from-violet-500 to-violet-600' },
  { code: 'LBOOK', icon: 'Book', color: 'from-blue-600 to-blue-700' },
  { code: 'MAP', icon: 'MapPin', color: 'from-lime-500 to-lime-600' },
  { code: 'NEWS', icon: 'Newspaper', color: 'from-slate-500 to-slate-600' },
  { code: 'PREF', icon: 'BookMarked', color: 'from-red-500 to-red-600' },
  { code: 'PROC', icon: 'BookCopy', color: 'from-orange-500 to-orange-600' },
  { code: 'UACOL', icon: 'LibraryBig', color: 'from-pink-500 to-pink-600' },
  { code: 'RBOOK', icon: 'BookOpenCheck', color: 'from-rose-500 to-rose-600' },
  { code: 'RPAPER', icon: 'FileEdit', color: 'from-fuchsia-500 to-fuchsia-600' },
  { code: 'RNARA', icon: 'ScrollText', color: 'from-cyan-600 to-cyan-700' },
  { code: 'SREF', icon: 'BookmarkCheck', color: 'from-red-600 to-red-700' },
  { code: 'SLBOOK', icon: 'Library', color: 'from-yellow-500 to-yellow-600' },
  { code: 'SLREP', icon: 'FolderOpen', color: 'from-amber-600 to-amber-700' },
  { code: 'THESIS', icon: 'GraduationCap', color: 'from-purple-600 to-purple-700' },
  { code: 'WFISH', icon: 'Fish', color: 'from-blue-500 to-blue-600' },
  { code: 'EJART', icon: 'FileDigit', color: 'from-violet-600 to-violet-700' },
  { code: 'EREP', icon: 'FileCode', color: 'from-indigo-600 to-indigo-700' },
];

const LibraryCatalogue = () => {
  const { t } = useTranslation('library');
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Library Type: 'physical' or 'digital'
  const [libraryType, setLibraryType] = useState(searchParams.get('type') || 'physical');

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [facets, setFacets] = useState({ material_types: [], years: [], languages: [] });
  const [filters, setFilters] = useState({
    material_type: searchParams.get('material_type') || '',
    year: searchParams.get('year') || '',
    language: searchParams.get('language') || '',
  });
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showCategories, setShowCategories] = useState(true);
  const [popularItems, setPopularItems] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [tamilTranslations, setTamilTranslations] = useState([]);
  const [sinhalaTranslations, setSinhalaTranslations] = useState([]);
  const [categoryStats, setCategoryStats] = useState({});

  useEffect(() => {
    loadFacets();
    loadPopularItems();
    loadNewArrivals();
    loadTamilTranslations();
    loadSinhalaTranslations();

    if (searchQuery) {
      performSearch();
    }
  }, []);

  const loadFacets = async () => {
    try {
      const response = await searchService.getFacets();
      if (response.success) {
        setFacets(response.data);
      }
    } catch (err) {
      console.error('Failed to load facets:', err);
    }
  };

  const loadPopularItems = async () => {
    try {
      const response = await searchService.getPopularItems(6);
      if (response.success) {
        setPopularItems(response.data);
      }
    } catch (err) {
      console.error('Failed to load popular items:', err);
    }
  };

  const loadNewArrivals = async () => {
    try {
      const response = await searchService.getNewArrivals(6);
      if (response.success) {
        setNewArrivals(response.data);
      }
    } catch (err) {
      console.error('Failed to load new arrivals:', err);
    }
  };

  const loadTamilTranslations = async () => {
    try {
      const response = await searchService.getTamilTranslations(6);
      if (response.success) {
        setTamilTranslations(response.data);
      }
    } catch (err) {
      console.error('Failed to load Tamil translations:', err);
    }
  };

  const loadSinhalaTranslations = async () => {
    try {
      const response = await searchService.getSinhalaTranslations(6);
      if (response.success) {
        setSinhalaTranslations(response.data);
      }
    } catch (err) {
      console.error('Failed to load Sinhala translations:', err);
    }
  };

  const performSearch = async (page = 1) => {
    if (!searchQuery.trim()) {
      setItems([]);
      return;
    }

    setLoading(true);
    setError(null);
    setShowCategories(false);

    try {
      const params = {
        page,
        limit: 20,
        ...filters,
      };

      const response = await searchService.search(searchQuery, params);

      if (response.success) {
        setItems(response.data || []);
        setPagination(response.pagination || {});
      } else {
        setError(response.error || 'Failed to search catalogue. Please try again.');
        setItems([]);
      }
    } catch (err) {
      setError('Failed to search catalogue. Please try again.');
      console.error('Search error:', err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const params = new URLSearchParams({ q: searchQuery, ...filters });
      setSearchParams(params);
      performSearch();
    }
  };

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
    
    if (searchQuery) {
      const params = new URLSearchParams({ q: searchQuery, ...newFilters });
      setSearchParams(params);
      performSearch();
    }
  };

  const clearFilters = () => {
    setFilters({ material_type: '', year: '', language: '' });
    setSearchParams({ q: searchQuery });
    performSearch();
  };

  const handleItemClick = (itemId) => {
    navigate(`/library/item/${itemId}`);
  };

  const handleCategoryClick = (categoryCode) => {
    setFilters({ ...filters, material_type: categoryCode });
    setSearchParams({ material_type: categoryCode });
    setShowCategories(false);
    
    // Perform search with category filter
    if (categoryCode) {
      setSearchQuery('*'); // Search all items in this category
      performCategorySearch(categoryCode);
    }
  };

  const performCategorySearch = async (categoryCode, page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        page,
        limit: 20,
        material_type: categoryCode,
      };

      const response = await catalogueService.getAllItems(params);

      if (response.success) {
        setItems(response.data || []);
        setPagination(response.pagination || {});
      } else {
        setError(response.error || 'Failed to load items. Please try again.');
        setItems([]);
      }
    } catch (err) {
      setError('Failed to load items. Please try again.');
      console.error('Category search error:', err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const getIconComponent = (iconName) => {
    return Icons[iconName] || Icons.Book;
  };

  const getAvailabilityBadge = (item) => {
    if (item.available_copies > 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <Icons.CheckCircle className="w-3 h-3 mr-1" />
          {t('availability.available')} ({item.available_copies})
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <Icons.XCircle className="w-3 h-3 mr-1" />
          {t('availability.checkedOut')}
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white" style={{ fontFamily: "'Noto Sans Sinhala', 'Noto Sans Tamil', 'Inter', 'Segoe UI', sans-serif" }}>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white py-16 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            backgroundSize: '30px 30px'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <Icons.Library className="w-20 h-20 mx-auto mb-4 animate-pulse" />
            <h1 className="text-5xl font-bold mb-4">{t('hero.title')}</h1>
            <p className="text-xl text-cyan-100 mb-6">
              {t('hero.subtitle')}
            </p>

            {/* Library Type Selector */}
            <div className="flex justify-center mb-8">
              <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl p-2 inline-flex gap-2 border border-white border-opacity-30">
                <button
                  onClick={() => {
                    setLibraryType('physical');
                    setSearchParams({ type: 'physical' });
                    setFilters({ material_type: '', year: '', language: '' });
                  }}
                  className={`
                    px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2
                    ${libraryType === 'physical'
                      ? 'bg-white text-blue-700 shadow-lg'
                      : 'text-white hover:bg-white hover:bg-opacity-10'
                    }
                  `}
                >
                  <Icons.Building className="w-5 h-5" />
                  <span>Physical Library</span>
                  <span className="text-xs opacity-75">(26 Categories)</span>
                </button>
                <button
                  onClick={() => {
                    setLibraryType('digital');
                    setSearchParams({ type: 'digital' });
                    setFilters({ material_type: '', year: '', language: '' });
                  }}
                  className={`
                    px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2
                    ${libraryType === 'digital'
                      ? 'bg-white text-blue-700 shadow-lg'
                      : 'text-white hover:bg-white hover:bg-opacity-10'
                    }
                  `}
                >
                  <Icons.Globe className="w-5 h-5" />
                  <span>Digital Library</span>
                  <span className="text-xs opacity-75">(Online/Translations)</span>
                </button>
              </div>
            </div>

            {/* Statistics Bar */}
            <div className="max-w-4xl mx-auto mb-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 border border-white border-opacity-20">
                  <div className="text-3xl font-bold">{facets.material_types.reduce((sum, type) => sum + (type.count || 0), 0).toLocaleString()}</div>
                  <div className="text-sm text-cyan-100">{t('hero.stats.totalItems')}</div>
                </div>
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 border border-white border-opacity-20">
                  <div className="text-3xl font-bold">{facets.material_types.length || 26}</div>
                  <div className="text-sm text-cyan-100">{t('hero.stats.categories')}</div>
                </div>
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 border border-white border-opacity-20">
                  <div className="text-3xl font-bold">{facets.languages.length}</div>
                  <div className="text-sm text-cyan-100">{t('hero.stats.languages')}</div>
                </div>
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 border border-white border-opacity-20">
                  <div className="text-3xl font-bold">{facets.years.length}</div>
                  <div className="text-sm text-cyan-100">{t('hero.stats.yearsCovered')}</div>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Icons.Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('hero.searchPlaceholder')}
                    className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-lg"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setItems([]);
                      }}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <Icons.X className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={!searchQuery.trim()}
                  className="px-8 py-4 bg-white text-cyan-600 rounded-lg font-semibold hover:bg-cyan-50 transition flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icons.Search className="w-5 h-5" />
                  {t('hero.searchButton')}
                </button>
              </div>
              
              <div className="mt-4 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                  className="text-cyan-100 hover:text-white text-sm flex items-center gap-1"
                >
                  <Icons.SlidersHorizontal className="w-4 h-4" />
                  {showAdvancedSearch ? t('hero.hideFilters') : t('hero.advancedSearch')}
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setShowCategories(true);
                    setSearchQuery('');
                    setFilters({ material_type: '', year: '', language: '' });
                    setItems([]);
                  }}
                  className="text-cyan-100 hover:text-white text-sm flex items-center gap-1"
                >
                  <Icons.Grid3x3 className="w-4 h-4" />
                  {t('hero.browseCategories')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Advanced Search Panel */}
      {showAdvancedSearch && (
        <div className="bg-gradient-to-br from-white to-gray-50 border-b shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Icons.Filter className="w-5 h-5 text-cyan-600" />
              {t('filters.advancedFilters')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Icons.BookType className="w-4 h-4 text-gray-500" />
                  {t('filters.materialType')}
                </label>
                <select
                  value={filters.material_type}
                  onChange={(e) => handleFilterChange('material_type', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent shadow-sm hover:border-cyan-400 transition"
                >
                  <option value="">{t('filters.allTypes')}</option>
                  {MATERIAL_TYPES.map((type) => {
                    const count = facets.material_types.find(f => f.code === type.code)?.count || 0;
                    return (
                      <option key={type.code} value={type.code}>
                        {t(`materialTypes.${type.code}`)} {count > 0 && `(${count})`}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Icons.Calendar className="w-4 h-4 text-gray-500" />
                  {t('filters.publicationYear')}
                </label>
                <select
                  value={filters.year}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent shadow-sm hover:border-cyan-400 transition"
                >
                  <option value="">{t('filters.allYears')}</option>
                  {facets.years.slice(0, 25).map((year) => (
                    <option key={year.publication_year} value={year.publication_year}>
                      {year.publication_year} ({year.count})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Icons.Languages className="w-4 h-4 text-gray-500" />
                  {t('filters.language')}
                </label>
                <select
                  value={filters.language}
                  onChange={(e) => handleFilterChange('language', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent shadow-sm hover:border-cyan-400 transition"
                >
                  <option value="">{t('filters.allLanguages')}</option>
                  {facets.languages.map((lang) => (
                    <option key={lang.language} value={lang.language}>
                      {lang.language} ({lang.count})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters Display */}
            {(filters.material_type || filters.year || filters.language) && (
              <div className="mt-6 flex items-center gap-3 flex-wrap">
                <span className="text-sm font-medium text-gray-700">{t('filters.activeFilters')}</span>
                
                {filters.material_type && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm">
                    {t(`materialTypes.${filters.material_type}`)}
                    <button
                      onClick={() => handleFilterChange('material_type', '')}
                      className="hover:bg-cyan-200 rounded-full p-0.5"
                    >
                      <Icons.X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                
                {filters.year && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    {t('filters.year')} {filters.year}
                    <button
                      onClick={() => handleFilterChange('year', '')}
                      className="hover:bg-purple-200 rounded-full p-0.5"
                    >
                      <Icons.X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                
                {filters.language && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {filters.language}
                    <button
                      onClick={() => handleFilterChange('language', '')}
                      className="hover:bg-green-200 rounded-full p-0.5"
                    >
                      <Icons.X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                
                <button
                  onClick={clearFilters}
                  className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                >
                  <Icons.XCircle className="w-4 h-4" />
                  {t('filters.clearAll')}
                </button>
              </div>
            )}
            
            {/* Quick Filter Suggestions */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-3">{t('filters.quickFilters')}</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleFilterChange('material_type', 'EBOOK')}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:border-cyan-500 hover:bg-cyan-50 transition"
                >
                  <Icons.Tablet className="w-4 h-4 inline mr-1" />
                  {t('filters.eBooks')}
                </button>
                <button
                  onClick={() => handleFilterChange('material_type', 'RNARA')}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:border-cyan-500 hover:bg-cyan-50 transition"
                >
                  <Icons.ScrollText className="w-4 h-4 inline mr-1" />
                  {t('filters.naraResearch')}
                </button>
                <button
                  onClick={() => handleFilterChange('material_type', 'THESIS')}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:border-cyan-500 hover:bg-cyan-50 transition"
                >
                  <Icons.GraduationCap className="w-4 h-4 inline mr-1" />
                  {t('filters.theses')}
                </button>
                <button
                  onClick={() => handleFilterChange('year', new Date().getFullYear().toString())}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:border-cyan-500 hover:bg-cyan-50 transition"
                >
                  <Icons.Sparkles className="w-4 h-4 inline mr-1" />
                  {t('filters.thisYear')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Physical Library: Material Type Categories Browser (26 Categories) */}
        {libraryType === 'physical' && showCategories && !searchQuery && !filters.material_type && (
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Physical Library - {t('browse.title')}</h2>
              <p className="text-gray-600">Browse NARA's 26 physical collection categories</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {MATERIAL_TYPES.map((type) => {
                const IconComponent = getIconComponent(type.icon);
                const itemCount = facets.material_types.find(f => f.code === type.code)?.count || 0;
                
                return (
                  <button
                    key={type.code}
                    onClick={() => handleCategoryClick(type.code)}
                    className={`bg-gradient-to-br ${type.color} text-white rounded-xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 flex flex-col items-center justify-center gap-3 group relative overflow-hidden`}
                  >
                    {/* Animated background effect */}
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    
                    {/* Icon */}
                    <div className="relative z-10">
                      <IconComponent className="w-10 h-10 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    
                    {/* Name */}
                    <div className="relative z-10 text-center">
                      <h3 className="font-semibold text-sm leading-tight mb-1">{t(`materialTypes.${type.code}`)}</h3>
                      {itemCount > 0 && (
                        <span className="text-xs opacity-90">
                          {itemCount} {itemCount === 1 ? t('browse.item') : t('browse.items')}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Featured Collections Banner */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl p-6 text-white">
                <Icons.TrendingUp className="w-8 h-8 mb-3" />
                <h3 className="text-xl font-bold mb-2">{t('featured.naraResearch.title')}</h3>
                <p className="text-cyan-100 text-sm mb-4">{t('featured.naraResearch.description')}</p>
                <button
                  onClick={() => handleCategoryClick('RNARA')}
                  className="bg-white text-cyan-600 px-4 py-2 rounded-lg font-semibold hover:bg-cyan-50 transition text-sm"
                >
                  {t('featured.naraResearch.cta')}
                </button>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl p-6 text-white">
                <Icons.GraduationCap className="w-8 h-8 mb-3" />
                <h3 className="text-xl font-bold mb-2">{t('featured.academicResources.title')}</h3>
                <p className="text-purple-100 text-sm mb-4">{t('featured.academicResources.description')}</p>
                <button
                  onClick={() => handleCategoryClick('THESIS')}
                  className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition text-sm"
                >
                  {t('featured.academicResources.cta')}
                </button>
              </div>

              <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 text-white">
                <Icons.Archive className="w-8 h-8 mb-3" />
                <h3 className="text-xl font-bold mb-2">{t('featured.specialCollections.title')}</h3>
                <p className="text-amber-100 text-sm mb-4">{t('featured.specialCollections.description')}</p>
                <button
                  onClick={() => handleCategoryClick('ATC')}
                  className="bg-white text-amber-600 px-4 py-2 rounded-lg font-semibold hover:bg-amber-50 transition text-sm"
                >
                  {t('featured.specialCollections.cta')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Active Category Header */}
        {filters.material_type && (
          <div className="mb-8 bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {(() => {
                  const activeType = MATERIAL_TYPES.find(t => t.code === filters.material_type);
                  if (activeType) {
                    const IconComponent = getIconComponent(activeType.icon);
                    return (
                      <>
                        <div className={`p-4 rounded-xl bg-gradient-to-br ${activeType.color} text-white`}>
                          <IconComponent className="w-8 h-8" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">{t(`materialTypes.${activeType.code}`)}</h2>
                          <p className="text-gray-600">
                            {pagination.total || 0} {pagination.total === 1 ? t('results.item') : t('results.itemsInCollection')}
                          </p>
                        </div>
                      </>
                    );
                  }
                })()}
              </div>
              <button
                onClick={() => {
                  setFilters({ material_type: '', year: '', language: '' });
                  setSearchParams({});
                  setShowCategories(true);
                  setItems([]);
                  setSearchQuery('');
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                <Icons.ArrowLeft className="w-4 h-4" />
                {t('results.backToCategories')}
              </button>
            </div>
          </div>
        )}

        {/* Search Results */}
        {searchQuery && searchQuery !== '*' && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {t('results.title')}
                {pagination.total > 0 && (
                  <span className="text-gray-500 text-lg ml-2">
                    ({pagination.total} {t('results.itemsFound')})
                  </span>
                )}
              </h2>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Icons.Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
                <span className="ml-3 text-gray-600">{t('results.searching')}</span>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                <Icons.AlertCircle className="w-5 h-5 inline mr-2" />
                {error}
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-12">
                <Icons.SearchX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">{t('results.noItemsFound')}</p>
                <p className="text-gray-500 mt-2">{t('results.tryDifferent')}</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleItemClick(item.id)}
                      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer overflow-hidden group"
                    >
                      <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                        {item.cover_image_url ? (
                          <img
                            src={item.cover_image_url}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Icons.BookOpen className="w-16 h-16 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="mb-2">
                          {getAvailabilityBadge(item)}
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-cyan-600 transition">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-1">{item.author}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{item.material_type_name}</span>
                          {item.publication_year && <span>{item.publication_year}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-8 flex justify-center gap-2">
                    <button
                      onClick={() => performSearch(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <Icons.ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <span className="px-4 py-2 text-gray-700">
                      {t('results.page')} {pagination.page} {t('results.of')} {pagination.totalPages}
                    </span>
                    
                    <button
                      onClick={() => performSearch(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <Icons.ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Category Results (when material_type filter is active) */}
        {filters.material_type && items.length > 0 && (
          <div className="mb-12">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Icons.Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
                <span className="ml-3 text-gray-600">{t('results.loadingItems')}</span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleItemClick(item.id)}
                      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer overflow-hidden group"
                    >
                      <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                        {item.cover_image_url ? (
                          <img
                            src={item.cover_image_url}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Icons.BookOpen className="w-16 h-16 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="mb-2">
                          {getAvailabilityBadge(item)}
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-cyan-600 transition">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-1">{item.author}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{item.material_type_name}</span>
                          {item.publication_year && <span>{item.publication_year}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-8 flex justify-center gap-2">
                    <button
                      onClick={() => performCategorySearch(filters.material_type, pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <Icons.ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <span className="px-4 py-2 text-gray-700">
                      {t('results.page')} {pagination.page} {t('results.of')} {pagination.totalPages}
                    </span>
                    
                    <button
                      onClick={() => performCategorySearch(filters.material_type, pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <Icons.ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Popular Items */}
        {!searchQuery && !filters.material_type && popularItems.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Icons.TrendingUp className="w-6 h-6 text-cyan-600" />
              {t('sections.popularItems')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer p-4 flex gap-4"
                >
                  <div className="w-20 h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded flex-shrink-0 flex items-center justify-center">
                    {item.cover_image_url ? (
                      <img src={item.cover_image_url} alt={item.title} className="w-full h-full object-cover rounded" />
                    ) : (
                      <Icons.BookOpen className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-1">{item.author}</p>
                    <div className="flex items-center gap-2">
                      {getAvailabilityBadge(item)}
                      {item.checkout_count && (
                        <span className="text-xs text-gray-500">
                          {item.checkout_count} {t('availability.checkouts')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Arrivals */}
        {!searchQuery && !filters.material_type && newArrivals.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Icons.Sparkles className="w-6 h-6 text-cyan-600" />
              {t('sections.newArrivals')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newArrivals.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer p-4 flex gap-4"
                >
                  <div className="w-20 h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded flex-shrink-0 flex items-center justify-center">
                    {item.cover_image_url ? (
                      <img src={item.cover_image_url} alt={item.title} className="w-full h-full object-cover rounded" />
                    ) : (
                      <Icons.BookOpen className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-1">{item.author}</p>
                    {getAvailabilityBadge(item)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Digital Library: Sinhala Translations */}
        {libraryType === 'digital' && !searchQuery && !filters.material_type && sinhalaTranslations.length > 0 && (
          <div className="mb-12">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-white">
                  <Icons.Globe className="w-8 h-8" />
                  <div>
                    <h2 className="text-2xl font-bold font-sinhala">Sinhala Translations (සිංහල පරිවර්තන)</h2>
                    <p className="text-blue-100">Recently uploaded - AI-powered translations</p>
                  </div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                  <p className="text-white font-semibold">{sinhalaTranslations.length} Books</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sinhalaTranslations.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer p-4 flex gap-4 border-l-4 border-blue-600"
                >
                  <div className="w-20 h-28 bg-gradient-to-br from-blue-100 to-indigo-100 rounded flex-shrink-0 flex items-center justify-center">
                    {item.cover_image_url ? (
                      <img src={item.cover_image_url} alt={item.title} className="w-full h-full object-cover rounded" />
                    ) : (
                      <Icons.Languages className="w-8 h-8 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium font-sinhala">සිංහල</span>
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full text-xs">AI Translated</span>
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">NEW</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-1">{item.author}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Icons.Clock className="w-3 h-3" />
                      <p>
                        {item.translations?.sinhala?.translated_at &&
                          `Added ${new Date(item.translations.sinhala.translated_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}`
                        }
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Digital Library: Tamil Translations */}
        {libraryType === 'digital' && !searchQuery && !filters.material_type && tamilTranslations.length > 0 && (
          <div className="mb-12">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-white">
                  <Icons.Globe className="w-8 h-8" />
                  <div>
                    <h2 className="text-2xl font-bold font-tamil">Tamil Translations (தமிழ் மொழிபெயர்ப்புகள்)</h2>
                    <p className="text-orange-100">Recently uploaded - AI-powered translations</p>
                  </div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                  <p className="text-white font-semibold">{tamilTranslations.length} Books</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tamilTranslations.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer p-4 flex gap-4 border-l-4 border-orange-500"
                >
                  <div className="w-20 h-28 bg-gradient-to-br from-orange-100 to-red-100 rounded flex-shrink-0 flex items-center justify-center">
                    {item.cover_image_url ? (
                      <img src={item.cover_image_url} alt={item.title} className="w-full h-full object-cover rounded" />
                    ) : (
                      <Icons.Languages className="w-8 h-8 text-orange-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-800 rounded-full text-xs font-medium font-tamil">தமிழ்</span>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">AI Translated</span>
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">NEW</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-1">{item.author}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Icons.Clock className="w-3 h-3" />
                      <p>
                        {item.translations?.tamil?.translated_at &&
                          `Added ${new Date(item.translations.tamil.translated_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}`
                        }
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Library Information Banner */}
        {!searchQuery && !filters.material_type && (
          <div className="mt-12 bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 lg:p-12">
              {/* Left side - About */}
              <div className="text-white">
                <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                  <Icons.BookOpen className="w-8 h-8" />
                  {t('about.title')}
                </h2>
                <p className="text-cyan-100 mb-6 leading-relaxed">
                  {t('about.description')}
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
                    <Icons.Clock className="w-6 h-6 mb-2" />
                    <h4 className="font-semibold mb-1">{t('about.openHours.title')}</h4>
                    <p className="text-sm text-cyan-100">{t('about.openHours.schedule')}</p>
                  </div>
                  <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
                    <Icons.Mail className="w-6 h-6 mb-2" />
                    <h4 className="font-semibold mb-1">{t('about.contact.title')}</h4>
                    <p className="text-sm text-cyan-100">{t('about.contact.email')}</p>
                  </div>
                </div>
              </div>

              {/* Right side - Services */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">{t('services.title')}</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/library/patron-portal')}
                    className="w-full bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-lg p-4 hover:bg-opacity-20 transition text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-white bg-opacity-20 rounded-lg p-3 group-hover:scale-110 transition">
                        <Icons.User className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-white flex-1">
                        <h4 className="font-semibold mb-1">{t('services.patronPortal.title')}</h4>
                        <p className="text-sm text-cyan-100">{t('services.patronPortal.description')}</p>
                      </div>
                      <Icons.ChevronRight className="w-5 h-5 text-white opacity-50 group-hover:opacity-100" />
                    </div>
                  </button>

                  <button
                    onClick={() => navigate('/knowledge-discovery-center')}
                    className="w-full bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-lg p-4 hover:bg-opacity-20 transition text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-white bg-opacity-20 rounded-lg p-3 group-hover:scale-110 transition">
                        <Icons.Database className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-white flex-1">
                        <h4 className="font-semibold mb-1">{t('services.digitalRepository.title')}</h4>
                        <p className="text-sm text-cyan-100">{t('services.digitalRepository.description')}</p>
                      </div>
                      <Icons.ChevronRight className="w-5 h-5 text-white opacity-50 group-hover:opacity-100" />
                    </div>
                  </button>

                  <button
                    onClick={() => navigate('/contact-us')}
                    className="w-full bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-lg p-4 hover:bg-opacity-20 transition text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-white bg-opacity-20 rounded-lg p-3 group-hover:scale-110 transition">
                        <Icons.HelpCircle className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-white flex-1">
                        <h4 className="font-semibold mb-1">{t('services.needHelp.title')}</h4>
                        <p className="text-sm text-cyan-100">{t('services.needHelp.description')}</p>
                      </div>
                      <Icons.ChevronRight className="w-5 h-5 text-white opacity-50 group-hover:opacity-100" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryCatalogue;

