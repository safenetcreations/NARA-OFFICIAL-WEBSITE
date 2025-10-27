import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { podcastService, podcastAnalyticsService } from '../../services/podcastService';
import * as Icons from 'lucide-react';

const PodcastAdmin = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPodcast, setEditingPodcast] = useState(null);
  const [stats, setStats] = useState(null);

  const [formData, setFormData] = useState({
    title: { en: '', si: '', ta: '' },
    description: { en: '', si: '', ta: '' },
    category: 'marine-research',
    youtubeId: '',
    youtubeUrl: '',
    audioUrl: '',
    notebooklmUrl: '',
    duration: '',
    thumbnail: '',
    tags: [],
    featured: false,
    status: 'published',
    publishedAt: new Date()
  });

  const categories = [
    { value: 'marine-research', label: 'Marine Research' },
    { value: 'ocean-science', label: 'Ocean Science' },
    { value: 'conservation', label: 'Conservation' },
    { value: 'interviews', label: 'Interviews' },
    { value: 'live', label: 'Live Sessions' }
  ];

  useEffect(() => {
    loadPodcasts();
    loadStatistics();
  }, []);

  const loadPodcasts = async () => {
    setLoading(true);
    const { data, error } = await podcastService.getAll({});
    if (!error && data) {
      setPodcasts(data);
    }
    setLoading(false);
  };

  const loadStatistics = async () => {
    const { data } = await podcastAnalyticsService.getStatistics();
    setStats(data);
  };

  const extractYoutubeId = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };

  const handleYoutubeUrlChange = (url) => {
    const youtubeId = extractYoutubeId(url);
    setFormData(prev => ({
      ...prev,
      youtubeUrl: url,
      youtubeId: youtubeId
    }));
  };

  const handleInputChange = (field, value, lang = null) => {
    if (lang) {
      setFormData(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          [lang]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const podcastData = {
        ...formData,
        publishedAt: new Date(formData.publishedAt)
      };

      if (editingPodcast) {
        await podcastService.update(editingPodcast.id, podcastData);
      } else {
        await podcastService.create(podcastData);
      }

      resetForm();
      await loadPodcasts();
      await loadStatistics();
    } catch (error) {
      console.error('Error saving podcast:', error);
      alert('Error saving podcast: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (podcast) => {
    setEditingPodcast(podcast);
    setFormData({
      title: podcast.title || { en: '', si: '', ta: '' },
      description: podcast.description || { en: '', si: '', ta: '' },
      category: podcast.category || 'marine-research',
      youtubeId: podcast.youtubeId || '',
      youtubeUrl: podcast.youtubeUrl || '',
      audioUrl: podcast.audioUrl || '',
      notebooklmUrl: podcast.notebooklmUrl || '',
      duration: podcast.duration || '',
      thumbnail: podcast.thumbnail || '',
      tags: podcast.tags || [],
      featured: podcast.featured || false,
      status: podcast.status || 'published',
      publishedAt: podcast.publishedAt || new Date()
    });
    setShowForm(true);
  };

  const handleDelete = async (podcastId) => {
    if (!confirm('Are you sure you want to delete this podcast?')) return;

    setLoading(true);
    await podcastService.delete(podcastId);
    await loadPodcasts();
    await loadStatistics();
    setLoading(false);
  };

  const resetForm = () => {
    setEditingPodcast(null);
    setFormData({
      title: { en: '', si: '', ta: '' },
      description: { en: '', si: '', ta: '' },
      category: 'marine-research',
      youtubeId: '',
      youtubeUrl: '',
      audioUrl: '',
      notebooklmUrl: '',
      duration: '',
      thumbnail: '',
      tags: [],
      featured: false,
      status: 'published',
      publishedAt: new Date()
    });
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-4">
            Podcast Management
          </h1>
          <p className="text-slate-400">Manage NARA podcast episodes and NotebookLM integrations</p>
        </motion.div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-lg rounded-2xl p-6 border border-cyan-500/30"
            >
              <Icons.Radio className="w-8 h-8 text-cyan-400 mb-2" />
              <div className="text-3xl font-bold text-white">{stats.total}</div>
              <div className="text-sm text-slate-300">Total Episodes</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-2xl p-6 border border-green-500/30"
            >
              <Icons.CheckCircle className="w-8 h-8 text-green-400 mb-2" />
              <div className="text-3xl font-bold text-white">{stats.published}</div>
              <div className="text-sm text-slate-300">Published</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30"
            >
              <Icons.Eye className="w-8 h-8 text-purple-400 mb-2" />
              <div className="text-3xl font-bold text-white">{stats.totalViews}</div>
              <div className="text-sm text-slate-300">Total Views</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-lg rounded-2xl p-6 border border-red-500/30"
            >
              <Icons.Heart className="w-8 h-8 text-red-400 mb-2" />
              <div className="text-3xl font-bold text-white">{stats.totalLikes}</div>
              <div className="text-sm text-slate-300">Total Likes</div>
            </motion.div>
          </div>
        )}

        {/* Add New Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)}
          className="mb-8 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-2xl font-bold shadow-lg hover:shadow-cyan-500/50 transition-all flex items-center gap-3"
        >
          <Icons.Plus className="w-6 h-6" />
          {showForm ? 'Close Form' : 'Add New Podcast'}
        </motion.button>

        {/* Form */}
        <AnimatePresence>
          {showForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSubmit}
              className="mb-8 bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20"
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                {editingPodcast ? 'Edit Podcast' : 'Create New Podcast'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title Fields */}
                <div className="md:col-span-2">
                  <label className="block text-white font-semibold mb-3">Title</label>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="English Title"
                      value={formData.title.en}
                      onChange={(e) => handleInputChange('title', e.target.value, 'en')}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Sinhala Title (සිංහල)"
                      value={formData.title.si}
                      onChange={(e) => handleInputChange('title', e.target.value, 'si')}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                    />
                    <input
                      type="text"
                      placeholder="Tamil Title (தமிழ்)"
                      value={formData.title.ta}
                      onChange={(e) => handleInputChange('title', e.target.value, 'ta')}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                {/* Description Fields */}
                <div className="md:col-span-2">
                  <label className="block text-white font-semibold mb-3">Description</label>
                  <div className="space-y-3">
                    <textarea
                      placeholder="English Description"
                      value={formData.description.en}
                      onChange={(e) => handleInputChange('description', e.target.value, 'en')}
                      rows={3}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                      required
                    />
                    <textarea
                      placeholder="Sinhala Description (සිංහල)"
                      value={formData.description.si}
                      onChange={(e) => handleInputChange('description', e.target.value, 'si')}
                      rows={3}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                    />
                    <textarea
                      placeholder="Tamil Description (தமிழ்)"
                      value={formData.description.ta}
                      onChange={(e) => handleInputChange('description', e.target.value, 'ta')}
                      rows={3}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                {/* YouTube URL */}
                <div className="md:col-span-2">
                  <label className="block text-white font-semibold mb-2">YouTube URL</label>
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={formData.youtubeUrl}
                    onChange={(e) => handleYoutubeUrlChange(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                  />
                  {formData.youtubeId && (
                    <p className="mt-2 text-sm text-green-400">
                      Extracted Video ID: {formData.youtubeId}
                    </p>
                  )}
                </div>

                {/* NotebookLM URL */}
                <div className="md:col-span-2">
                  <label className="block text-white font-semibold mb-2">NotebookLM URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://notebooklm.google.com/..."
                    value={formData.notebooklmUrl}
                    onChange={(e) => handleInputChange('notebooklmUrl', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Audio URL */}
                <div>
                  <label className="block text-white font-semibold mb-2">Audio URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.audioUrl}
                    onChange={(e) => handleInputChange('audioUrl', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-white font-semibold mb-2">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g., 45:30"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-white font-semibold mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value} className="bg-slate-900">
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-white font-semibold mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                    required
                  >
                    <option value="published" className="bg-slate-900">Published</option>
                    <option value="draft" className="bg-slate-900">Draft</option>
                  </select>
                </div>

                {/* Tags */}
                <div className="md:col-span-2">
                  <label className="block text-white font-semibold mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="marine, research, ocean"
                    value={formData.tags.join(', ')}
                    onChange={handleTagsChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Featured Toggle */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => handleInputChange('featured', e.target.checked)}
                      className="w-6 h-6 rounded bg-white/10 border-2 border-white/20 checked:bg-cyan-500"
                    />
                    <span className="text-white font-semibold">Featured Podcast</span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingPodcast ? 'Update Podcast' : 'Create Podcast'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-8 py-4 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Podcasts List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white mb-4">All Podcasts</h2>

          {loading && !showForm ? (
            <div className="flex justify-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Icons.Radio className="w-12 h-12 text-cyan-400" />
              </motion.div>
            </div>
          ) : (
            <div className="grid gap-4">
              {podcasts.map((podcast) => (
                <motion.div
                  key={podcast.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-cyan-400/50 transition-all"
                >
                  <div className="flex items-start gap-6">
                    {/* Thumbnail */}
                    <div className="w-48 h-32 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0">
                      {podcast.youtubeId ? (
                        <img
                          src={`https://img.youtube.com/vi/${podcast.youtubeId}/mqdefault.jpg`}
                          alt={podcast.title?.en}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Icons.Radio className="w-12 h-12 text-slate-700" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">
                            {podcast.title?.en}
                          </h3>
                          <p className="text-slate-400 text-sm line-clamp-2">
                            {podcast.description?.en}
                          </p>
                        </div>

                        {/* Badges */}
                        <div className="flex gap-2">
                          {podcast.featured && (
                            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded-full border border-yellow-500/30">
                              FEATURED
                            </span>
                          )}
                          <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                            podcast.status === 'published'
                              ? 'bg-green-500/20 text-green-400 border-green-500/30'
                              : 'bg-slate-500/20 text-slate-400 border-slate-500/30'
                          }`}>
                            {podcast.status?.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Meta Info */}
                      <div className="flex items-center gap-6 text-sm text-slate-400 mb-4">
                        <span className="flex items-center gap-1">
                          <Icons.FolderOpen className="w-4 h-4" />
                          {podcast.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icons.Eye className="w-4 h-4" />
                          {podcast.views || 0} views
                        </span>
                        <span className="flex items-center gap-1">
                          <Icons.Heart className="w-4 h-4" />
                          {podcast.likes || 0} likes
                        </span>
                        {podcast.duration && (
                          <span className="flex items-center gap-1">
                            <Icons.Clock className="w-4 h-4" />
                            {podcast.duration}
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEdit(podcast)}
                          className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg font-semibold hover:bg-blue-500/30 transition-all flex items-center gap-2"
                        >
                          <Icons.Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(podcast.id)}
                          className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg font-semibold hover:bg-red-500/30 transition-all flex items-center gap-2"
                        >
                          <Icons.Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && podcasts.length === 0 && (
            <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
              <Icons.Radio className="w-16 h-16 text-slate-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-400 mb-2">No podcasts yet</h3>
              <p className="text-slate-500">Create your first podcast to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PodcastAdmin;
