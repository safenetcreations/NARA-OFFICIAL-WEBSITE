/**
 * Podcast Admin Panel
 *
 * Features:
 * - Create/Edit/Delete podcasts
 * - Google NotebookLM integration
 * - YouTube URL integration
 * - Audio file upload
 * - Podcast scheduling
 * - Analytics dashboard
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  Plus,
  Edit,
  Trash2,
  Youtube,
  Upload,
  Calendar,
  Eye,
  Heart,
  TrendingUp,
  Save,
  X,
  Radio,
  Sparkles,
  FileAudio,
  Link as LinkIcon,
  Check
} from 'lucide-react';
import { podcastService, podcastAnalyticsService } from '../../services/podcastService';

const PodcastAdmin = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPodcast, setEditingPodcast] = useState(null);
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
    status: 'published'
  });
  const [newTag, setNewTag] = useState('');

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
    try {
      const result = await podcastService.getAll({ limit: 100 });
      if (result.data) {
        setPodcasts(result.data);
      }
    } catch (error) {
      console.error('Error loading podcasts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const result = await podcastAnalyticsService.getStatistics();
      if (result.data) {
        setStatistics(result.data);
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  const handleCreateNew = () => {
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
      status: 'published'
    });
    setShowModal(true);
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
      status: podcast.status || 'published'
    });
    setShowModal(true);
  };

  const extractYoutubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleYoutubeUrlChange = (url) => {
    setFormData(prev => ({
      ...prev,
      youtubeUrl: url,
      youtubeId: extractYoutubeId(url) || ''
    }));
  };

  const handleAddTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const podcastData = {
      ...formData,
      publishedAt: new Date()
    };

    try {
      if (editingPodcast) {
        await podcastService.update(editingPodcast.id, podcastData);
        alert('✅ Podcast updated successfully!');
      } else {
        await podcastService.create(podcastData);
        alert('✅ Podcast created successfully!');
      }

      setShowModal(false);
      loadPodcasts();
      loadStatistics();
    } catch (error) {
      console.error('Error saving podcast:', error);
      alert('❌ Error saving podcast: ' + error.message);
    }
  };

  const handleDelete = async (podcastId) => {
    if (!window.confirm('Are you sure you want to delete this podcast?')) {
      return;
    }

    try {
      await podcastService.delete(podcastId);
      alert('✅ Podcast deleted successfully!');
      loadPodcasts();
      loadStatistics();
    } catch (error) {
      console.error('Error deleting podcast:', error);
      alert('❌ Error deleting podcast: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Mic className="w-10 h-10 text-cyan-400" />
              Podcast Management
            </h1>
            <p className="text-slate-400">Manage NARA podcasts with NotebookLM integration</p>
          </div>

          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 font-semibold shadow-lg shadow-cyan-500/25 transition-all"
          >
            <Plus className="w-5 h-5" />
            New Podcast
          </button>
        </div>

        {/* Statistics */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400">Total Episodes</span>
                <Mic className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="text-3xl font-bold">{statistics.total}</div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400">Total Views</span>
                <Eye className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-3xl font-bold">{statistics.totalViews}</div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400">Total Likes</span>
                <Heart className="w-5 h-5 text-red-400" />
              </div>
              <div className="text-3xl font-bold">{statistics.totalLikes}</div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400">Published</span>
                <Radio className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-3xl font-bold">{statistics.published}</div>
            </div>
          </div>
        )}

        {/* Podcasts List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto" />
            </div>
          ) : podcasts.length === 0 ? (
            <div className="text-center py-12 px-6 rounded-2xl bg-white/5 border border-white/10">
              <Mic className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400">No podcasts yet. Create your first one!</p>
            </div>
          ) : (
            podcasts.map((podcast) => (
              <motion.div
                key={podcast.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 hover:border-cyan-500/50 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{podcast.title?.en || podcast.title}</h3>
                      {podcast.featured && (
                        <span className="px-2 py-1 rounded-full bg-yellow-500 text-white text-xs font-semibold">
                          FEATURED
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        podcast.status === 'published'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {podcast.status?.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-slate-400 mb-4">{podcast.description?.en || podcast.description}</p>

                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Calendar className="w-4 h-4" />
                        {podcast.publishedAt && new Date(podcast.publishedAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Eye className="w-4 h-4" />
                        {podcast.views || 0} views
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Heart className="w-4 h-4" />
                        {podcast.likes || 0} likes
                      </div>
                      {podcast.youtubeId && (
                        <div className="flex items-center gap-2 text-red-400">
                          <Youtube className="w-4 h-4" />
                          YouTube
                        </div>
                      )}
                      {podcast.notebooklmUrl && (
                        <div className="flex items-center gap-2 text-purple-400">
                          <Sparkles className="w-4 h-4" />
                          NotebookLM
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(podcast)}
                      className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30 transition-colors"
                    >
                      <Edit className="w-5 h-5 text-blue-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(podcast.id)}
                      className="p-2 rounded-lg bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 transition-colors"
                    >
                      <Trash2 className="w-5 h-5 text-red-400" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/10"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {editingPodcast ? 'Edit Podcast' : 'New Podcast'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Title (English)</label>
                  <input
                    type="text"
                    value={formData.title.en}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: { ...prev.title, en: e.target.value } }))}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Description (English)</label>
                  <textarea
                    value={formData.description.en}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: { ...prev.description, en: e.target.value } }))}
                    rows="4"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* YouTube URL */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                      <Youtube className="w-4 h-4 text-red-400" />
                      YouTube URL
                    </label>
                    <input
                      type="url"
                      value={formData.youtubeUrl}
                      onChange={(e) => handleYoutubeUrlChange(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                    {formData.youtubeId && (
                      <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        YouTube ID extracted: {formData.youtubeId}
                      </p>
                    )}
                  </div>

                  {/* Audio URL */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                      <FileAudio className="w-4 h-4 text-cyan-400" />
                      Audio URL
                    </label>
                    <input
                      type="url"
                      value={formData.audioUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, audioUrl: e.target.value }))}
                      placeholder="https://storage.googleapis.com/..."
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* NotebookLM URL */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      NotebookLM URL
                    </label>
                    <input
                      type="url"
                      value={formData.notebooklmUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, notebooklmUrl: e.target.value }))}
                      placeholder="https://notebooklm.google.com/..."
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Duration</label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="e.g., 45 min"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                  </div>
                </div>

                {/* Thumbnail URL */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Thumbnail URL</label>
                  <input
                    type="url"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData(prev => ({ ...prev, thumbnail: e.target.value }))}
                    placeholder="https://..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Tags</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      placeholder="Add a tag..."
                      className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-red-400 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Options */}
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                      className="w-5 h-5 rounded bg-white/5 border border-white/10"
                    />
                    <span>Featured Episode</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <span>Status:</span>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      className="px-3 py-1 rounded-lg bg-white/5 border border-white/10"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </label>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-6">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 font-semibold transition-all"
                  >
                    <Save className="w-5 h-5" />
                    {editingPodcast ? 'Update Podcast' : 'Create Podcast'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 font-semibold transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PodcastAdmin;
