import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';
import { getResearchContent, searchResearchContent } from '../../services/researchContentService';
import SearchBar from './components/SearchBar';
import AdminUpload from './components/AdminUpload';
import { seedNARAResearchPapers } from '../../utils/seedResearchData';

const ResearchPortalMain = () => {
  const { t, i18n } = useTranslation(['researchPortal']);
  const { user } = useFirebaseAuth();
  const [content, setContent] = useState([]);
  const [filteredContent, setFilteredContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    language: '',
    sortBy: 'newest'
  });

  const handleSeedData = async () => {
    setSeeding(true);
    try {
      console.log('🌊 Starting to seed NARA research papers...');
      const result = await seedNARAResearchPapers();
      
      if (result.success) {
        alert(`✅ Success! Added ${result.count} NEW research papers!\n\n📊 Total in database: ${result.totalInDatabase}\n📚 Remaining in pool: ${result.remaining}\n\n✨ Click this button daily to add 5 more papers!\n\nRefreshing data...`);
        await loadContent();
      } else {
        alert(`ℹ️ ${result.error || 'No new papers to add'}\n\n${result.total ? `Pool has ${result.total} papers total.` : ''}`);
      }
    } catch (error) {
      console.error('❌ Error seeding data:', error);
      alert(`❌ Error: ${error.message}\n\nCheck console for details.`);
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [content, filters]);

  const loadContent = async () => {
    try {
      const data = await getResearchContent({ status: 'published' });
      setContent(data);
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (searchTerm) => {
    try {
      setLoading(true);
      const results = await searchResearchContent(searchTerm, filters.language);
      setContent(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...content];

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(item => item.category === filters.category);
    }

    // Apply language filter
    if (filters.language) {
      filtered = filtered.filter(item => item.language === filters.language);
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'mostViewed':
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'mostDownloaded':
        filtered.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredContent(filtered);
  };

  const getCurrentLangContent = (multilingualField) => {
    if (!multilingualField) return '';
    return multilingualField[i18n.language] || multilingualField.en || '';
  };

  const getCategoryColor = (category) => {
    const colors = {
      marineEcology: 'from-green-500 to-emerald-600',
      oceanography: 'from-blue-500 to-cyan-600',
      fisheries: 'from-purple-500 to-pink-600',
      climateChange: 'from-orange-500 to-red-600',
      conservation: 'from-teal-500 to-green-600',
      biotechnology: 'from-indigo-500 to-purple-600',
      policy: 'from-amber-500 to-orange-600',
      other: 'from-slate-500 to-gray-600'
    };
    return colors[category] || colors.other;
  };

  // Check if user is admin (you can customize this logic)
  const isAdmin = user?.role === 'researcher' || user?.role === 'professor';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-xl text-slate-600 mb-6">
            {t('subtitle')}
          </p>

          {/* Admin Button */}
          {isAdmin && (
            <button
              onClick={() => setShowAdmin(!showAdmin)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg"
            >
              <Icons.Upload className="w-5 h-5" />
              {showAdmin ? 'Hide Upload Panel' : t('admin.uploadNew')}
            </button>
          )}
        </motion.div>

        {/* Admin Upload Panel */}
        {showAdmin && isAdmin && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <AdminUpload onSuccess={() => {
              loadContent();
              setShowAdmin(false);
            }} />
          </motion.div>
        )}

        {/* Search Bar */}
        <SearchBar
          onSearch={handleSearch}
          onFilterChange={setFilters}
          filters={filters}
        />

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-slate-600">
            {t('search.results', { count: filteredContent.length })}
          </p>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Icons.Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredContent.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl shadow-xl p-12 max-w-2xl mx-auto">
              <Icons.FileX className="w-20 h-20 text-blue-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                {content.length === 0 ? 'No Research Papers Yet' : t('search.noResults')}
              </h3>
              <p className="text-slate-600 mb-6">
                {content.length === 0 
                  ? 'Be the first to upload research content to this portal!' 
                  : 'Try adjusting your search or filters'}
              </p>
              
              {content.length === 0 && isAdmin && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
                  <h4 className="font-semibold text-blue-900 mb-2">👋 Getting Started</h4>
                  <p className="text-blue-800 text-sm mb-4">
                    You're logged in as a researcher/professor. Click the "Upload New Paper" button above to add your first research paper!
                  </p>
                  <ul className="text-left text-sm text-blue-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <Icons.CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>Upload content in English, Sinhala, and Tamil</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icons.CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>Attach PDF files for full papers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icons.CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>Content is protected - only registered users can read full papers</span>
                    </li>
                  </ul>
                </div>
              )}
              
              {content.length === 0 && !user && (
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-lg p-6">
                  <p className="text-blue-800 text-sm mb-4">
                    <strong>Note:</strong> This is a new portal. Research content will appear here once researchers upload their papers.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleSeedData}
                      disabled={seeding}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                      {seeding ? (
                        <>
                          <Icons.Loader2 className="w-5 h-5 animate-spin" />
                          Loading Papers...
                        </>
                      ) : (
                        <>
                          <Icons.Database className="w-5 h-5" />
                          Add 5 NEW Research Papers
                        </>
                      )}
                    </button>
                    <Link
                      to="/register"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Icons.UserPlus className="w-5 h-5" />
                      Register to Access Research
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all"
              >
                {/* Category Badge */}
                <div className={`h-2 bg-gradient-to-r ${getCategoryColor(item.category)}`} />

                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">
                    {getCurrentLangContent(item.title)}
                  </h3>

                  {/* Authors */}
                  <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
                    <Icons.Users className="w-4 h-4" />
                    <span className="line-clamp-1">{item.authors?.join(', ')}</span>
                  </div>

                  {/* Description */}
                  <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                    {getCurrentLangContent(item.description)}
                  </p>

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Icons.Eye className="w-4 h-4" />
                      <span>{item.views || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icons.Download className="w-4 h-4" />
                      <span>{item.downloads || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icons.Calendar className="w-4 h-4" />
                      <span>{new Date(item.publicationDate).getFullYear()}</span>
                    </div>
                  </div>

                  {/* Read More Button */}
                  <Link
                    to={`/research-excellence-portal/read/${item.id}`}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all"
                  >
                    <Icons.BookOpen className="w-5 h-5" />
                    {t('card.readMore')}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchPortalMain;
