import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Filter, X, Calendar, User, FileText, Building,
  Tag, TrendingUp, Download, Star, ChevronDown, Plus, Minus
} from 'lucide-react';

const AdvancedSearch = ({ onSearch, onClose }) => {
  const [searchCriteria, setSearchCriteria] = useState({
    keywords: '',
    title: '',
    author: '',
    institution: '',
    yearFrom: '',
    yearTo: '',
    researchAreas: [],
    publicationType: [],
    minCitations: '',
    maxCitations: '',
    minImpactFactor: '',
    openAccessOnly: false,
    hasDataset: false,
    language: 'all'
  });

  const researchAreas = [
    'Marine Biology',
    'Climate Change',
    'Fisheries Management',
    'Oceanography',
    'Conservation',
    'Marine Policy',
    'Aquaculture',
    'Coastal Engineering',
    'Marine Biotechnology',
    'Ocean Modeling'
  ];

  const publicationTypes = [
    'Journal Article',
    'Conference Paper',
    'Technical Report',
    'Book Chapter',
    'Dataset',
    'Thesis/Dissertation',
    'Review Article',
    'Policy Brief'
  ];

  const languages = [
    { value: 'all', label: 'All Languages' },
    { value: 'en', label: 'English' },
    { value: 'si', label: 'Sinhala' },
    { value: 'ta', label: 'Tamil' }
  ];

  const toggleArrayValue = (array, value) => {
    if (array.includes(value)) {
      return array.filter(item => item !== value);
    }
    return [...array, value];
  };

  const handleSearch = () => {
    onSearch(searchCriteria);
    if (onClose) onClose();
  };

  const handleReset = () => {
    setSearchCriteria({
      keywords: '',
      title: '',
      author: '',
      institution: '',
      yearFrom: '',
      yearTo: '',
      researchAreas: [],
      publicationType: [],
      minCitations: '',
      maxCitations: '',
      minImpactFactor: '',
      openAccessOnly: false,
      hasDataset: false,
      language: 'all'
    });
  };

  const activeFiltersCount = Object.entries(searchCriteria).filter(([key, value]) => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'boolean') return value;
    return value !== '' && value !== 'all';
  }).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-white/20 shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 p-6 bg-gradient-to-r from-cyan-900/50 to-blue-900/50 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-cyan-500/20">
                <Filter className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Advanced Search</h2>
                <p className="text-sm text-slate-400">
                  {activeFiltersCount > 0 ? `${activeFiltersCount} filters active` : 'Search across 1,247 publications'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Text Search Fields */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-cyan-400" />
              Text Search
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Keywords (any field)</label>
                <input
                  type="text"
                  value={searchCriteria.keywords}
                  onChange={(e) => setSearchCriteria({...searchCriteria, keywords: e.target.value})}
                  placeholder="e.g., coral reef, microplastic"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Title</label>
                <input
                  type="text"
                  value={searchCriteria.title}
                  onChange={(e) => setSearchCriteria({...searchCriteria, title: e.target.value})}
                  placeholder="Publication title"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Author</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchCriteria.author}
                    onChange={(e) => setSearchCriteria({...searchCriteria, author: e.target.value})}
                    placeholder="Author name"
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Institution</label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchCriteria.institution}
                    onChange={(e) => setSearchCriteria({...searchCriteria, institution: e.target.value})}
                    placeholder="Institution name"
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              Publication Date
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">From Year</label>
                <input
                  type="number"
                  value={searchCriteria.yearFrom}
                  onChange={(e) => setSearchCriteria({...searchCriteria, yearFrom: e.target.value})}
                  placeholder="2020"
                  min="1900"
                  max="2024"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">To Year</label>
                <input
                  type="number"
                  value={searchCriteria.yearTo}
                  onChange={(e) => setSearchCriteria({...searchCriteria, yearTo: e.target.value})}
                  placeholder="2024"
                  min="1900"
                  max="2024"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Research Areas */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Tag className="w-5 h-5 text-purple-400" />
              Research Areas
            </h3>

            <div className="flex flex-wrap gap-2">
              {researchAreas.map((area) => (
                <button
                  key={area}
                  onClick={() => setSearchCriteria({
                    ...searchCriteria,
                    researchAreas: toggleArrayValue(searchCriteria.researchAreas, area)
                  })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    searchCriteria.researchAreas.includes(area)
                      ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 border'
                      : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {searchCriteria.researchAreas.includes(area) ? (
                    <Minus className="w-3 h-3 inline mr-1" />
                  ) : (
                    <Plus className="w-3 h-3 inline mr-1" />
                  )}
                  {area}
                </button>
              ))}
            </div>
          </div>

          {/* Publication Type */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-400" />
              Publication Type
            </h3>

            <div className="flex flex-wrap gap-2">
              {publicationTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSearchCriteria({
                    ...searchCriteria,
                    publicationType: toggleArrayValue(searchCriteria.publicationType, type)
                  })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    searchCriteria.publicationType.includes(type)
                      ? 'bg-green-500/20 border-green-500/50 text-green-300 border'
                      : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {searchCriteria.publicationType.includes(type) ? (
                    <Minus className="w-3 h-3 inline mr-1" />
                  ) : (
                    <Plus className="w-3 h-3 inline mr-1" />
                  )}
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Citation & Impact Metrics */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              Impact Metrics
            </h3>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Min. Citations</label>
                <input
                  type="number"
                  value={searchCriteria.minCitations}
                  onChange={(e) => setSearchCriteria({...searchCriteria, minCitations: e.target.value})}
                  placeholder="e.g., 10"
                  min="0"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Max. Citations</label>
                <input
                  type="number"
                  value={searchCriteria.maxCitations}
                  onChange={(e) => setSearchCriteria({...searchCriteria, maxCitations: e.target.value})}
                  placeholder="e.g., 1000"
                  min="0"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Min. Impact Factor</label>
                <input
                  type="number"
                  value={searchCriteria.minImpactFactor}
                  onChange={(e) => setSearchCriteria({...searchCriteria, minImpactFactor: e.target.value})}
                  placeholder="e.g., 5.0"
                  step="0.1"
                  min="0"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Additional Filters */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-cyan-400" />
              Additional Filters
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
                <input
                  type="checkbox"
                  checked={searchCriteria.openAccessOnly}
                  onChange={(e) => setSearchCriteria({...searchCriteria, openAccessOnly: e.target.checked})}
                  className="w-5 h-5 rounded bg-white/10 border-white/20 text-cyan-500 focus:ring-2 focus:ring-cyan-500"
                />
                <div>
                  <div className="text-white font-medium">Open Access Only</div>
                  <div className="text-xs text-slate-400">Show only freely available publications</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
                <input
                  type="checkbox"
                  checked={searchCriteria.hasDataset}
                  onChange={(e) => setSearchCriteria({...searchCriteria, hasDataset: e.target.checked})}
                  className="w-5 h-5 rounded bg-white/10 border-white/20 text-cyan-500 focus:ring-2 focus:ring-cyan-500"
                />
                <div>
                  <div className="text-white font-medium">Has Dataset</div>
                  <div className="text-xs text-slate-400">Publications with linked datasets</div>
                </div>
              </label>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Language</label>
              <select
                value={searchCriteria.language}
                onChange={(e) => setSearchCriteria({...searchCriteria, language: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>{lang.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 p-6 bg-gradient-to-r from-slate-900 to-slate-800 border-t border-white/10">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-all font-medium"
            >
              Reset All
            </button>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSearch}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                Search
                {activeFiltersCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdvancedSearch;
