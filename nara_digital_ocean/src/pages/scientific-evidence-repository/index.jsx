import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import {
  evidenceDocumentsService,
  policyBriefsService,
  dataVisualizationsService,
  evidenceDashboardService
} from '../../services/scientificEvidenceService';

const ScientificEvidenceRepository = () => {
  const [activeView, setActiveView] = useState('home'); // 'home' | 'documents' | 'briefs' | 'data' | 'search'
  const [documents, setDocuments] = useState([]);
  const [briefs, setBriefs] = useState([]);
  const [visualizations, setVisualizations] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPolicyArea, setSelectedPolicyArea] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [docsResult, briefsResult, vizResult, statsResult] = await Promise.all([
        evidenceDocumentsService.getAll({ limit: 50 }),
        policyBriefsService.getAll({ limit: 20 }),
        dataVisualizationsService.getAll({ limit: 20 }),
        evidenceDashboardService.getStatistics()
      ]);

      if (docsResult.data) setDocuments(docsResult.data);
      if (briefsResult.data) setBriefs(briefsResult.data);
      if (vizResult.data) setVisualizations(vizResult.data);
      if (statsResult.data) setStatistics(statsResult.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const { data } = await evidenceDocumentsService.search(searchQuery);
      setSearchResults(data || []);
      setActiveView('search');
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (doc) => {
    if (doc.fileUrl) {
      await evidenceDocumentsService.incrementDownload(doc.id);
      window.open(doc.fileUrl, '_blank');
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      research_paper: 'bg-blue-100 text-blue-800',
      technical_report: 'bg-green-100 text-green-800',
      policy_analysis: 'bg-purple-100 text-purple-800',
      data_report: 'bg-orange-100 text-orange-800',
      review: 'bg-pink-100 text-pink-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getPolicyAreaColor = (area) => {
    const colors = {
      fisheries_management: 'bg-cyan-100 text-cyan-800',
      marine_conservation: 'bg-teal-100 text-teal-800',
      aquaculture: 'bg-indigo-100 text-indigo-800',
      coastal_management: 'bg-emerald-100 text-emerald-800',
      climate_change: 'bg-red-100 text-red-800',
      sustainable_development: 'bg-green-100 text-green-800'
    };
    return colors[area] || 'bg-gray-100 text-gray-800';
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesPolicyArea = selectedPolicyArea === 'all' || doc.policyArea === selectedPolicyArea;
    return matchesCategory && matchesPolicyArea;
  });

  const navTabs = [
    { id: 'home', label: 'Home', icon: Icons.Home },
    { id: 'documents', label: 'Research Evidence', icon: Icons.FileText },
    { id: 'briefs', label: 'Policy Briefs', icon: Icons.BookOpen },
    { id: 'data', label: 'Data & Visualizations', icon: Icons.BarChart }
  ];

  if (loading && documents.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-purple-900 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 text-white py-24 overflow-hidden">
        {/* Animated Background Icons */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * 400
              }}
              animate={{
                x: [null, Math.random() * window.innerWidth],
                y: [null, Math.random() * 400]
              }}
              transition={{
                duration: 15 + Math.random() * 10,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
            >
              {i % 3 === 0 ? <Icons.FileText className="w-8 h-8" /> : i % 3 === 1 ? <Icons.BookOpen className="w-8 h-8" /> : <Icons.BarChart className="w-8 h-8" />}
            </motion.div>
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <Icons.Scale className="w-16 h-16" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Scientific Evidence Repository
            </h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto leading-relaxed mb-8">
              Access peer-reviewed research, policy briefs, and data-driven insights
              to inform evidence-based marine and fisheries policy decisions
            </p>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search by keywords, authors, or topics..."
                    className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 border-2 border-transparent focus:border-purple-400 focus:outline-none text-lg"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="px-8 py-4 bg-white text-purple-900 rounded-xl hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl font-semibold"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            {statistics && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                  <div className="text-3xl font-bold mb-2">{statistics.documents.total}</div>
                  <div className="text-sm text-purple-200">Research Documents</div>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                  <div className="text-3xl font-bold mb-2">{statistics.briefs.total}</div>
                  <div className="text-sm text-purple-200">Policy Briefs</div>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                  <div className="text-3xl font-bold mb-2">{statistics.documents.totalViews}</div>
                  <div className="text-sm text-purple-200">Total Views</div>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                  <div className="text-3xl font-bold mb-2">{statistics.visualizations.total}</div>
                  <div className="text-sm text-purple-200">Data Visualizations</div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-xl shadow-lg z-40 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2 overflow-x-auto">
            {navTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${
                  activeView === tab.id
                    ? 'text-purple-600 border-b-4 border-purple-600 bg-purple-50'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {/* Home View */}
          {activeView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Featured / Popular Documents */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Most Viewed Research</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {statistics?.popularDocuments?.slice(0, 4).map((doc, idx) => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 bg-purple-100 rounded-lg">
                          <Icons.FileText className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{doc.title}</h3>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(doc.category)}`}>
                              {doc.category?.replace('_', ' ')}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPolicyAreaColor(doc.policyArea)}`}>
                              {doc.policyArea?.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{doc.abstract}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Icons.Eye className="w-4 h-4" />
                            {doc.viewCount}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icons.Download className="w-4 h-4" />
                            {doc.downloadCount}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDownload(doc)}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                        >
                          View Document
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Recent Policy Briefs */}
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">Recent Policy Briefs</h2>
                  <button
                    onClick={() => setActiveView('briefs')}
                    className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2"
                  >
                    View All <Icons.ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {statistics?.recentBriefs?.slice(0, 3).map((brief, idx) => (
                    <div key={brief.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          <Icons.BookOpen className="w-5 h-5 text-indigo-600" />
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPolicyAreaColor(brief.policyArea)}`}>
                          {brief.policyArea?.replace('_', ' ')}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">{brief.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{brief.summary}</p>
                      <div className="text-xs text-gray-500 mb-4">
                        {brief.publishedDate?.toDate?.()?.toLocaleDateString()}
                      </div>
                      <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                        Read Brief
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Policy Areas */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Browse by Policy Area</h2>
                <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {[
                    { id: 'fisheries_management', label: 'Fisheries Management', icon: Icons.Fish },
                    { id: 'marine_conservation', label: 'Marine Conservation', icon: Icons.Waves },
                    { id: 'aquaculture', label: 'Aquaculture', icon: Icons.Droplet },
                    { id: 'coastal_management', label: 'Coastal Management', icon: Icons.Map },
                    { id: 'climate_change', label: 'Climate Change', icon: Icons.CloudRain },
                    { id: 'sustainable_development', label: 'Sustainable Development', icon: Icons.Leaf }
                  ].map((area) => (
                    <button
                      key={area.id}
                      onClick={() => {
                        setSelectedPolicyArea(area.id);
                        setActiveView('documents');
                      }}
                      className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all text-center group"
                    >
                      <area.icon className="w-10 h-10 mx-auto mb-3 text-purple-600 group-hover:scale-110 transition-transform" />
                      <div className="text-sm font-medium text-gray-900">{area.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Documents View */}
          {activeView === 'documents' && (
            <motion.div
              key="documents"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Research Evidence</h2>
                <div className="flex gap-3">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="all">All Categories</option>
                    <option value="research_paper">Research Paper</option>
                    <option value="technical_report">Technical Report</option>
                    <option value="policy_analysis">Policy Analysis</option>
                    <option value="data_report">Data Report</option>
                    <option value="review">Review</option>
                  </select>
                  <select
                    value={selectedPolicyArea}
                    onChange={(e) => setSelectedPolicyArea(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="all">All Policy Areas</option>
                    <option value="fisheries_management">Fisheries Management</option>
                    <option value="marine_conservation">Marine Conservation</option>
                    <option value="aquaculture">Aquaculture</option>
                    <option value="coastal_management">Coastal Management</option>
                    <option value="climate_change">Climate Change</option>
                    <option value="sustainable_development">Sustainable Development</option>
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                {filteredDocuments.map((doc) => (
                  <div key={doc.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
                    <div className="flex items-start gap-6">
                      <div className="p-4 bg-purple-100 rounded-xl">
                        <Icons.FileText className="w-8 h-8 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{doc.title}</h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(doc.category)}`}>
                            {doc.category?.replace('_', ' ')}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPolicyAreaColor(doc.policyArea)}`}>
                            {doc.policyArea?.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4 line-clamp-3">{doc.abstract}</p>
                        {doc.authors && (
                          <div className="text-sm text-gray-500 mb-3">
                            <strong>Authors:</strong> {doc.authors.join(', ')}
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6 text-sm text-gray-500">
                            <span className="flex items-center gap-2">
                              <Icons.Calendar className="w-4 h-4" />
                              {doc.publishedDate?.toDate?.()?.toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-2">
                              <Icons.Eye className="w-4 h-4" />
                              {doc.viewCount} views
                            </span>
                            <span className="flex items-center gap-2">
                              <Icons.Download className="w-4 h-4" />
                              {doc.downloadCount} downloads
                            </span>
                          </div>
                          <button
                            onClick={() => handleDownload(doc)}
                            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center gap-2"
                          >
                            <Icons.Download className="w-4 h-4" />
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredDocuments.length === 0 && (
                <div className="text-center py-16 text-gray-500">
                  <Icons.FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>No documents found matching your criteria.</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Policy Briefs View */}
          {activeView === 'briefs' && (
            <motion.div
              key="briefs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Policy Briefs</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {briefs.map((brief) => (
                  <div key={brief.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-indigo-100 rounded-lg">
                        <Icons.BookOpen className="w-6 h-6 text-indigo-600" />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPolicyAreaColor(brief.policyArea)}`}>
                        {brief.policyArea?.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{brief.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-4">{brief.summary}</p>
                    <div className="text-xs text-gray-500 mb-4">
                      Published: {brief.publishedDate?.toDate?.()?.toLocaleDateString()}
                    </div>
                    {brief.recommendations && brief.recommendations.length > 0 && (
                      <div className="mb-4">
                        <div className="text-xs font-semibold text-gray-700 mb-2">Key Recommendations:</div>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {brief.recommendations.slice(0, 2).map((rec, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <Icons.CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                              <span className="line-clamp-2">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <button
                      onClick={() => handleDownload(brief)}
                      className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    >
                      Read Full Brief
                    </button>
                  </div>
                ))}
              </div>

              {briefs.length === 0 && (
                <div className="text-center py-16 text-gray-500">
                  <Icons.BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>No policy briefs available at the moment.</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Data & Visualizations View */}
          {activeView === 'data' && (
            <motion.div
              key="data"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Data & Visualizations</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visualizations.map((viz) => (
                  <div key={viz.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Icons.BarChart className="w-6 h-6 text-blue-600" />
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {viz.dataType?.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{viz.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{viz.description}</p>
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                      View Visualization
                    </button>
                  </div>
                ))}
              </div>

              {visualizations.length === 0 && (
                <div className="text-center py-16 text-gray-500">
                  <Icons.BarChart className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>No data visualizations available at the moment.</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Search Results View */}
          {activeView === 'search' && (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Search Results</h2>
              <p className="text-gray-600 mb-6">Found {searchResults.length} documents matching "{searchQuery}"</p>

              <div className="space-y-6">
                {searchResults.map((doc) => (
                  <div key={doc.id} className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{doc.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(doc.category)}`}>
                        {doc.category?.replace('_', ' ')}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPolicyAreaColor(doc.policyArea)}`}>
                        {doc.policyArea?.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{doc.abstract}</p>
                    <button
                      onClick={() => handleDownload(doc)}
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                    >
                      View Document
                    </button>
                  </div>
                ))}
              </div>

              {searchResults.length === 0 && (
                <div className="text-center py-16 text-gray-500">
                  <Icons.Search className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>No documents found. Try different keywords.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ScientificEvidenceRepository;
