import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as Icons from 'lucide-react';
import { searchService, catalogueService } from '../../services/libraryService';

const LibraryCatalogue = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
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
  const [popularItems, setPopularItems] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    loadFacets();
    loadPopularItems();
    loadNewArrivals();
    
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

  const performSearch = async (page = 1) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const params = {
        page,
        limit: 20,
        ...filters,
      };

      const response = await searchService.search(searchQuery, params);
      
      if (response.success) {
        setItems(response.data);
        setPagination(response.pagination);
      }
    } catch (err) {
      setError('Failed to search catalogue. Please try again.');
      console.error('Search error:', err);
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

  const getAvailabilityBadge = (item) => {
    if (item.available_copies > 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <Icons.CheckCircle className="w-3 h-3 mr-1" />
          Available ({item.available_copies})
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <Icons.XCircle className="w-3 h-3 mr-1" />
          Checked Out
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Icons.Library className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">NARA Library Catalogue</h1>
            <p className="text-xl text-cyan-100 mb-8">
              Discover our collection of marine and aquatic research resources
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Icons.Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title, author, subject, ISBN..."
                    className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-8 py-4 bg-white text-cyan-600 rounded-lg font-semibold hover:bg-cyan-50 transition flex items-center gap-2"
                >
                  <Icons.Search className="w-5 h-5" />
                  Search
                </button>
              </div>
              
              <button
                type="button"
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                className="mt-3 text-cyan-100 hover:text-white text-sm flex items-center gap-1 mx-auto"
              >
                <Icons.SlidersHorizontal className="w-4 h-4" />
                Advanced Search
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Advanced Search Panel */}
      {showAdvancedSearch && (
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Material Type
                </label>
                <select
                  value={filters.material_type}
                  onChange={(e) => handleFilterChange('material_type', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  {facets.material_types.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name} ({type.count})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Publication Year
                </label>
                <select
                  value={filters.year}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="">All Years</option>
                  {facets.years.slice(0, 20).map((year) => (
                    <option key={year.publication_year} value={year.publication_year}>
                      {year.publication_year} ({year.count})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  value={filters.language}
                  onChange={(e) => handleFilterChange('language', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="">All Languages</option>
                  {facets.languages.map((lang) => (
                    <option key={lang.language} value={lang.language}>
                      {lang.language} ({lang.count})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {(filters.material_type || filters.year || filters.language) && (
              <button
                onClick={clearFilters}
                className="mt-4 text-sm text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
              >
                <Icons.X className="w-4 h-4" />
                Clear Filters
              </button>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Results */}
        {searchQuery && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Search Results
                {pagination.total > 0 && (
                  <span className="text-gray-500 text-lg ml-2">
                    ({pagination.total} items found)
                  </span>
                )}
              </h2>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Icons.Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
                <span className="ml-3 text-gray-600">Searching...</span>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                <Icons.AlertCircle className="w-5 h-5 inline mr-2" />
                {error}
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-12">
                <Icons.SearchX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No items found matching your search.</p>
                <p className="text-gray-500 mt-2">Try different keywords or clear your filters.</p>
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
                      Page {pagination.page} of {pagination.totalPages}
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

        {/* Popular Items */}
        {!searchQuery && popularItems.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Icons.TrendingUp className="w-6 h-6 text-cyan-600" />
              Popular Items
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
                          {item.checkout_count} checkouts
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
        {!searchQuery && newArrivals.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Icons.Sparkles className="w-6 h-6 text-cyan-600" />
              New Arrivals
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

        {/* Quick Links */}
        {!searchQuery && (
          <div className="mt-12 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Library Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={() => navigate('/library/patron-portal')}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition text-center group"
              >
                <Icons.User className="w-12 h-12 text-cyan-600 mx-auto mb-3 group-hover:scale-110 transition" />
                <h3 className="font-semibold text-gray-900 mb-2">Patron Portal</h3>
                <p className="text-sm text-gray-600">Manage your loans, holds, and fines</p>
              </button>

              <button
                onClick={() => navigate('/knowledge-discovery-center')}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition text-center group"
              >
                <Icons.Database className="w-12 h-12 text-cyan-600 mx-auto mb-3 group-hover:scale-110 transition" />
                <h3 className="font-semibold text-gray-900 mb-2">Digital Repository</h3>
                <p className="text-sm text-gray-600">Access research papers and publications</p>
              </button>

              <button
                onClick={() => navigate('/contact-us')}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition text-center group"
              >
                <Icons.HelpCircle className="w-12 h-12 text-cyan-600 mx-auto mb-3 group-hover:scale-110 transition" />
                <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600">Contact library staff for assistance</p>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryCatalogue;

