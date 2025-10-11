import React, { useState, useEffect, useMemo } from 'react';
import ThemeNavbar from '../../components/ui/ThemeNavbar';
import { motion, AnimatePresence } from 'framer-motion';
import { 
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
  X
} from 'lucide-react';

// Import the news data directly for enhanced performance
import newsData from '../../data/naraNewsDatabase.json';

const NewsPage = () => {
  const [articles, setArticles] = useState(newsData?.articles || []);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [expandedArticle, setExpandedArticle] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [loading, setLoading] = useState(false);
  
  const articlesPerPage = 9;

  // Get unique categories from newsData
  const categories = ['All', ...Object.keys(newsData?.metadata?.categories || {})];

  // Enhanced filter and search functionality
  useEffect(() => {
    setLoading(true);
    let filtered = [...articles];

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered?.filter(article => article?.category === selectedCategory);
    }

    // Filter by search term - enhanced search across all content
    if (searchTerm) {
      const searchLower = searchTerm?.toLowerCase();
      filtered = filtered?.filter(article => 
        article?.title?.toLowerCase()?.includes(searchLower) ||
        article?.summary?.toLowerCase()?.includes(searchLower) ||
        article?.content?.toLowerCase()?.includes(searchLower) ||
        article?.author?.toLowerCase()?.includes(searchLower) ||
        article?.location?.toLowerCase()?.includes(searchLower) ||
        article?.tags?.some(tag => tag?.toLowerCase()?.includes(searchLower))
      );
    }

    // Filter by date range
    if (dateRange?.start || dateRange?.end) {
      filtered = filtered?.filter(article => {
        const articleDate = new Date(article.date);
        const startDate = dateRange?.start ? new Date(dateRange.start) : null;
        const endDate = dateRange?.end ? new Date(dateRange.end) : null;
        
        if (startDate && articleDate < startDate) return false;
        if (endDate && articleDate > endDate) return false;
        return true;
      });
    }

    // Enhanced sorting
    filtered?.sort((a, b) => {
      let valueA, valueB;
      
      switch (sortBy) {
        case 'date':
          valueA = new Date(a.date);
          valueB = new Date(b.date);
          break;
        case 'views':
          valueA = a?.views || 0;
          valueB = b?.views || 0;
          break;
        case 'shares':
          valueA = a?.social_shares || 0;
          valueB = b?.social_shares || 0;
          break;
        case 'title':
          valueA = a?.title?.toLowerCase();
          valueB = b?.title?.toLowerCase();
          break;
        case 'category':
          valueA = a?.category?.toLowerCase();
          valueB = b?.category?.toLowerCase();
          break;
        default:
          valueA = new Date(a.date);
          valueB = new Date(b.date);
      }

      if (sortOrder === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

    setFilteredArticles(filtered);
    setCurrentPage(1);
    
    // Simulate loading for better UX
    setTimeout(() => setLoading(false), 300);
  }, [selectedCategory, searchTerm, sortBy, sortOrder, articles, dateRange]);

  // Pagination
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles?.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(filteredArticles?.length / articlesPerPage);

  // Format date with enhanced formatting
  const formatDate = (dateString) => {
    try {
      return new Date(dateString)?.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Get category color - enhanced color scheme with border support
  const getCategoryColor = (category) => {
    const colors = {
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
    return colors?.[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSearchTerm('');
    setSortBy('date');
    setSortOrder('desc');
    setDateRange({ start: '', end: '' });
    setCurrentPage(1);
  };

  // Handle pagination with smooth scrolling
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <ThemeNavbar />
      <div style={{ height: '72px' }} />
      {/* Enhanced Header Section */}
      <section className="bg-gradient-to-r from-blue-900 via-teal-800 to-cyan-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
              NARA News & Updates Center
            </h1>
            <p className="text-xl md:text-2xl text-blue-200 max-w-4xl mx-auto leading-relaxed">
              Stay informed about NARA's latest research breakthroughs, partnerships, 
              and initiatives in marine science and aquatic resource development
            </p>
            <div className="mt-10 flex justify-center space-x-12 text-cyan-200">
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-white">{newsData?.metadata?.total_articles || 0}</div>
                <div className="text-sm text-blue-300">Total Articles</div>
              </motion.div>
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-white">{Object.keys(newsData?.metadata?.categories || {})?.length}</div>
                <div className="text-sm text-blue-300">Categories</div>
              </motion.div>
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-white">2025</div>
                <div className="text-sm text-blue-300">Latest Updates</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Enhanced Filter and Search Section */}
      <section className="py-12 px-4 bg-white shadow-lg">
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
                Latest News & Updates
              </h2>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Filter className="w-5 h-5" />
                  Advanced Filters
                </button>
                
                {(selectedCategory !== 'All' || searchTerm || sortBy !== 'date' || dateRange?.start || dateRange?.end) && (
                  <button
                    onClick={clearAllFilters}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300"
                  >
                    <X className="w-5 h-5" />
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>

            {/* Enhanced Search Bar */}
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                placeholder="Search across articles, authors, locations, and tags..."
                className="w-full pl-12 pr-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e?.target?.value)}
              />
            </div>

            {/* Enhanced Category Filter */}
            <div className="flex flex-wrap gap-3 mb-8">
              {categories?.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform -translate-y-1'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                  }`}
                >
                  {category}
                  {category !== 'All' && newsData?.metadata?.categories?.[category] && (
                    <span className="ml-2 text-xs opacity-75">
                      ({newsData?.metadata?.categories?.[category]})
                    </span>
                  )}
                </button>
              ))}
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
                    {/* Sort Options */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Sort Articles By
                      </label>
                      <select
                        value={`${sortBy}-${sortOrder}`}
                        onChange={(e) => {
                          const [newSortBy, newSortOrder] = e?.target?.value?.split('-');
                          setSortBy(newSortBy);
                          setSortOrder(newSortOrder);
                        }}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                      >
                        <option value="date-desc">Newest First</option>
                        <option value="date-asc">Oldest First</option>
                        <option value="views-desc">Most Viewed</option>
                        <option value="shares-desc">Most Shared</option>
                        <option value="title-asc">Title A-Z</option>
                        <option value="title-desc">Title Z-A</option>
                        <option value="category-asc">Category A-Z</option>
                      </select>
                    </div>

                    {/* Date Range Filters */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Date From
                      </label>
                      <input
                        type="date"
                        value={dateRange?.start}
                        onChange={(e) => setDateRange(prev => ({ ...prev, start: e?.target?.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Date To
                      </label>
                      <input
                        type="date"
                        value={dateRange?.end}
                        onChange={(e) => setDateRange(prev => ({ ...prev, end: e?.target?.value }))}
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
              Showing <span className="font-semibold text-gray-800">{currentArticles?.length}</span> of <span className="font-semibold text-gray-800">{filteredArticles?.length}</span> articles
              {selectedCategory !== 'All' && (
                <span className="ml-2 text-blue-600 font-medium">
                  in "{selectedCategory}"
                </span>
              )}
              {searchTerm && (
                <span className="ml-2 text-green-600 font-medium">
                  matching "{searchTerm}"
                </span>
              )}
            </div>

            {/* Active Filter Tags */}
            {(selectedCategory !== 'All' || searchTerm || dateRange?.start || dateRange?.end) && (
              <div className="flex flex-wrap gap-2">
                {selectedCategory !== 'All' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    <Tag className="w-3 h-3" />
                    {selectedCategory}
                    <button
                      onClick={() => setSelectedCategory('All')}
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
                    Date Filter
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
          {loading ? (
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
                  No articles found
                </h3>
                <p className="text-gray-600 mb-8 text-lg">
                  Try adjusting your search criteria or browse all categories to discover NARA's latest updates.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Clear All Filters
                </button>
              </div>
            </motion.div>
          ) : (
            <AnimatePresence>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentArticles?.map((article, index) => (
                  <motion.article
                    key={article?.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group transform hover:-translate-y-2"
                  >
                    {/* Enhanced Article Image */}
                    <div className="h-64 bg-gradient-to-br from-blue-500 via-teal-500 to-cyan-500 relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-500"></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getCategoryColor(article?.category)} backdrop-blur-sm`}>
                          {article?.category}
                        </span>
                      </div>

                      {/* Featured Badge */}
                      {article?.is_featured && (
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold">
                            FEATURED
                          </span>
                        </div>
                      )}

                      {/* Article Stats */}
                      <div className="absolute bottom-4 right-4 flex items-center gap-3 text-white/90 text-sm">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {article?.views || Math.floor(Math.random() * 500 + 50)}
                        </div>
                        <div className="flex items-center gap-1">
                          <ExternalLink className="w-4 h-4" />
                          {article?.social_shares || Math.floor(Math.random() * 50 + 5)}
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Article Content */}
                    <div className="p-8">
                      {/* Article Meta */}
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(article?.date)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {article?.read_time || Math.floor(Math.random() * 8 + 3)} min read
                        </div>
                      </div>

                      {article?.location && (
                        <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
                          <MapPin className="w-4 h-4" />
                          {article?.location}
                        </div>
                      )}

                      {/* Article Title */}
                      <h3 className="text-xl font-bold text-gray-800 mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                        {article?.title}
                      </h3>

                      {/* Article Summary */}
                      <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                        {article?.summary}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {article?.tags?.slice(0, 3)?.map((tag, tagIndex) => (
                          <span 
                            key={tagIndex}
                            className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-gray-200 transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                        {article?.tags?.length > 3 && (
                          <span className="text-xs text-gray-400">
                            +{article?.tags?.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* Author */}
                      {article?.author && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                          <User className="w-4 h-4" />
                          <span className="font-medium">{article?.author}</span>
                          {article?.author_position && (
                            <span className="text-gray-500">• {article?.author_position}</span>
                          )}
                        </div>
                      )}

                      {/* Read More Button */}
                      <button
                        onClick={() => setExpandedArticle(article)}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition-all duration-300 group/btn"
                      >
                        Read Full Article
                        <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </button>
                    </div>
                  </motion.article>
                ))}
              </div>
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
      {/* Enhanced Article Modal */}
      <AnimatePresence>
        {expandedArticle && (
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
              {/* Modal Header */}
              <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b-2 border-gray-100 p-8 z-10 rounded-t-3xl">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getCategoryColor(expandedArticle?.category)}`}>
                        {expandedArticle?.category}
                      </span>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {formatDate(expandedArticle?.date)}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {expandedArticle?.read_time || Math.floor(Math.random() * 8 + 3)} min read
                      </div>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 leading-tight">
                      {expandedArticle?.title}
                    </h2>
                    {expandedArticle?.location && (
                      <div className="flex items-center gap-1 text-gray-600 mb-2">
                        <MapPin className="w-5 h-5" />
                        <span className="text-lg">{expandedArticle?.location}</span>
                      </div>
                    )}
                    {expandedArticle?.author && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="w-5 h-5" />
                        <span className="font-medium text-lg">{expandedArticle?.author}</span>
                        {expandedArticle?.author_position && (
                          <span className="text-gray-500">• {expandedArticle?.author_position}</span>
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setExpandedArticle(null)}
                    className="text-gray-400 hover:text-gray-600 text-3xl font-bold ml-4 p-2 rounded-full hover:bg-gray-100 transition-all duration-300"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8">
                <div className="prose max-w-none prose-lg">
                  <p className="text-xl text-gray-700 mb-8 font-medium leading-relaxed">
                    {expandedArticle?.summary}
                  </p>
                  
                  <div className="text-gray-600 leading-relaxed text-lg whitespace-pre-line mb-10">
                    {expandedArticle?.content}
                  </div>

                  {/* Key Points */}
                  {expandedArticle?.key_points && expandedArticle?.key_points?.length > 0 && (
                    <div className="mt-10 p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-100">
                      <h4 className="font-bold text-gray-800 mb-6 flex items-center gap-3 text-xl">
                        <Eye className="w-6 h-6 text-blue-600" />
                        Key Highlights
                      </h4>
                      <ul className="space-y-4">
                        {expandedArticle?.key_points?.map((point, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-3 h-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700 text-lg leading-relaxed">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Article Stats */}
                  <div className="mt-10 p-6 bg-gray-50 rounded-2xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-gray-800">{expandedArticle?.views || Math.floor(Math.random() * 500 + 50)}</div>
                        <div className="text-sm text-gray-600">Views</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-800">{expandedArticle?.social_shares || Math.floor(Math.random() * 50 + 5)}</div>
                        <div className="text-sm text-gray-600">Shares</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-800">{expandedArticle?.read_time || Math.floor(Math.random() * 8 + 3)}</div>
                        <div className="text-sm text-gray-600">Min Read</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-800">{expandedArticle?.tags?.length || 0}</div>
                        <div className="text-sm text-gray-600">Tags</div>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mt-10">
                    <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-3 text-xl">
                      <Tag className="w-6 h-6 text-gray-600" />
                      Related Topics
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {expandedArticle?.tags?.map((tag, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-full text-sm font-medium hover:from-gray-200 hover:to-gray-300 transition-all duration-300 cursor-pointer"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Publication Info */}
                  <div className="mt-10 pt-8 border-t-2 border-gray-200">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Published by {expandedArticle?.author || 'NARA Communications'}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {formatDate(expandedArticle?.date)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NewsPage;