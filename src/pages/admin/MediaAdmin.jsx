import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit, Trash2, Save, X, LogOut, Image, Video, Upload,
  CheckCircle, AlertCircle, Search, Download, RefreshCw,
  Eye, EyeOff, Tag, MapPin, Calendar, Link as LinkIcon
} from 'lucide-react';
import { auth, db, storage } from '../../firebase';
import {
  collection, addDoc, updateDoc, deleteDoc, doc, getDocs,
  query, orderBy, where
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { manualScrape } from '../../services/mediaScraperService';

const MediaAdmin = () => {
  const [activeTab, setActiveTab] = useState('images'); // 'images' or 'videos'
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterApproved, setFilterApproved] = useState('all'); // 'all', 'approved', 'pending'
  const [scrapingProgress, setScrapingProgress] = useState(null);
  const navigate = useNavigate();

  // Data states
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);

  const tabs = [
    { id: 'images', label: 'Images', icon: Image, collection: 'media_images' },
    { id: 'videos', label: 'Videos', icon: Video, collection: 'media_videos' }
  ];

  useEffect(() => {
    loadData();
  }, [activeTab, filterApproved]);

  const loadData = async () => {
    setDataLoading(true);
    try {
      const currentTab = tabs.find(t => t.id === activeTab);
      let q = query(collection(db, currentTab.collection), orderBy('createdAt', 'desc'));

      if (filterApproved !== 'all') {
        q = query(q, where('approved', '==', filterApproved === 'approved'));
      }

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      if (activeTab === 'images') {
        setImages(data);
      } else {
        setVideos(data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setErrorMessage('Failed to load data. Please refresh the page.');
    } finally {
      setDataLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/admin/research-login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSave = async (data) => {
    setLoading(true);
    try {
      const currentTab = tabs.find(t => t.id === activeTab);
      const dataWithTimestamp = {
        ...data,
        updatedAt: new Date().toISOString()
      };

      if (editingItem) {
        await updateDoc(doc(db, currentTab.collection, editingItem.id), dataWithTimestamp);
        setSuccessMessage(`${currentTab.label.slice(0, -1)} updated successfully!`);
      } else {
        await addDoc(collection(db, currentTab.collection), {
          ...dataWithTimestamp,
          createdAt: new Date().toISOString(),
          views: 0,
          likes: 0
        });
        setSuccessMessage(`${currentTab.label.slice(0, -1)} added successfully!`);
      }

      setShowAddForm(false);
      setEditingItem(null);
      loadData();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving data:', error);
      setErrorMessage('Failed to save. Please try again.');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    setLoading(true);
    try {
      const currentTab = tabs.find(t => t.id === activeTab);
      await deleteDoc(doc(db, currentTab.collection, id));
      setSuccessMessage('Item deleted successfully!');
      loadData();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting:', error);
      setErrorMessage('Failed to delete. Please try again.');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, currentStatus) => {
    setLoading(true);
    try {
      const currentTab = tabs.find(t => t.id === activeTab);
      await updateDoc(doc(db, currentTab.collection, id), {
        approved: !currentStatus,
        updatedAt: new Date().toISOString()
      });
      setSuccessMessage(`Item ${!currentStatus ? 'approved' : 'unapproved'} successfully!`);
      loadData();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating approval:', error);
      setErrorMessage('Failed to update approval status.');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowAddForm(true);
  };

  const handleManualScrape = async () => {
    setScrapingProgress({ status: 'running', message: 'Scraping media from all sources...' });
    try {
      const result = await manualScrape();
      if (result.success) {
        setScrapingProgress({
          status: 'success',
          message: `✅ Found ${result.total} new items (${result.images} images, ${result.videos} videos)`
        });
        loadData();
        setTimeout(() => setScrapingProgress(null), 5000);
      } else {
        setScrapingProgress({
          status: 'error',
          message: `❌ Scraping failed: ${result.error}`
        });
        setTimeout(() => setScrapingProgress(null), 5000);
      }
    } catch (error) {
      setScrapingProgress({
        status: 'error',
        message: `❌ Error: ${error.message}`
      });
      setTimeout(() => setScrapingProgress(null), 5000);
    }
  };

  const getCurrentData = () => {
    const data = activeTab === 'images' ? images : videos;
    return data.filter(item =>
      searchTerm === '' ||
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const filteredData = getCurrentData();
  const pendingCount = filteredData.filter(item => !item.approved).length;
  const approvedCount = filteredData.filter(item => item.approved).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-lg border-b border-slate-700/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">📸 Media Admin Panel</h1>
            <p className="text-sm text-slate-400">Manage images and videos</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            {successMessage}
          </motion.div>
        )}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5" />
            {errorMessage}
          </motion.div>
        )}
        {scrapingProgress && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
              scrapingProgress.status === 'running' ? 'bg-blue-500' :
              scrapingProgress.status === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white`}
          >
            {scrapingProgress.status === 'running' && (
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin" />
                {scrapingProgress.message}
              </div>
            )}
            {scrapingProgress.status !== 'running' && scrapingProgress.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-4 border border-slate-700/50">
            <div className="text-3xl font-bold text-cyan-400">{images.length}</div>
            <div className="text-sm text-slate-400">Total Images</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-4 border border-slate-700/50">
            <div className="text-3xl font-bold text-purple-400">{videos.length}</div>
            <div className="text-sm text-slate-400">Total Videos</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-4 border border-slate-700/50">
            <div className="text-3xl font-bold text-green-400">{approvedCount}</div>
            <div className="text-sm text-slate-400">Approved</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-4 border border-slate-700/50">
            <div className="text-3xl font-bold text-yellow-400">{pendingCount}</div>
            <div className="text-sm text-slate-400">Pending Approval</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          {/* Tabs */}
          <div className="flex gap-2">
            {tabs.map(tab => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-cyan-500 text-white'
                      : 'bg-slate-800/50 text-slate-400 hover:text-white'
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleManualScrape}
              disabled={scrapingProgress?.status === 'running'}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${scrapingProgress?.status === 'running' ? 'animate-spin' : ''}`} />
              Auto-Scrape
            </button>
            <button
              onClick={() => {
                setEditingItem(null);
                setShowAddForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add {activeTab === 'images' ? 'Image' : 'Video'}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by title, description, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pr-10 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          </div>
          <select
            value={filterApproved}
            onChange={(e) => setFilterApproved(e.target.value)}
            className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Items</option>
            <option value="approved">Approved Only</option>
            <option value="pending">Pending Only</option>
          </select>
        </div>

        {/* Data Table */}
        {dataLoading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-400">Loading...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-20 bg-slate-800/30 rounded-xl">
            <Image className="w-16 h-16 mx-auto text-slate-600 mb-4" />
            <p className="text-slate-400">No {activeTab} found</p>
          </div>
        ) : (
          <div className="bg-slate-800/30 backdrop-blur-lg rounded-xl border border-slate-700/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Preview</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Title</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Source</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {filteredData.map(item => (
                    <tr key={item.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-4 py-3">
                        <img
                          src={item.thumbnail || item.url}
                          alt={item.title}
                          className="w-16 h-12 object-cover rounded"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="max-w-xs">
                          <div className="font-semibold line-clamp-1">{item.title}</div>
                          <div className="text-xs text-slate-400 line-clamp-1">{item.description}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded text-xs">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-400">
                        {item.sourceName || item.source}
                        {item.autoScraped && (
                          <span className="ml-1 text-xs text-blue-400">(auto)</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-400">
                        {item.date || new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        {item.approved ? (
                          <span className="flex items-center gap-1 text-green-400 text-sm">
                            <CheckCircle className="w-4 h-4" /> Approved
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-yellow-400 text-sm">
                            <AlertCircle className="w-4 h-4" /> Pending
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(item.id, item.approved)}
                            className={`p-2 rounded hover:bg-slate-700 transition-all ${
                              item.approved ? 'text-yellow-400' : 'text-green-400'
                            }`}
                            title={item.approved ? 'Unapprove' : 'Approve'}
                          >
                            {item.approved ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-2 text-blue-400 rounded hover:bg-slate-700 transition-all"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-red-400 rounded hover:bg-slate-700 transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      <AnimatePresence>
        {showAddForm && (
          <MediaForm
            item={editingItem}
            isVideo={activeTab === 'videos'}
            onSave={handleSave}
            onClose={() => {
              setShowAddForm(false);
              setEditingItem(null);
            }}
            loading={loading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Media Form Component
const MediaForm = ({ item, isVideo, onSave, onClose, loading }) => {
  const [formData, setFormData] = useState({
    title: item?.title || '',
    description: item?.description || '',
    url: item?.url || '',
    thumbnail: item?.thumbnail || '',
    videoUrl: item?.videoUrl || '',
    duration: item?.duration || '',
    category: item?.category || 'research',
    source: item?.source || 'manual',
    sourceName: item?.sourceName || 'NARA Official',
    tags: item?.tags?.join(', ') || '',
    location: item?.location || '',
    date: item?.date || new Date().toISOString().split('T')[0],
    photographer: item?.photographer || '',
    approved: item?.approved || false
  });

  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (file, field) => {
    setUploading(true);
    try {
      const storageRef = ref(storage, `media/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setFormData(prev => ({ ...prev, [field]: url }));
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSave = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    };
    onSave(dataToSave);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-slate-900 border-b border-slate-700 px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold">
            {item ? 'Edit' : 'Add New'} {isVideo ? 'Video' : 'Image'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
            />
          </div>

          {isVideo ? (
            <>
              <div>
                <label className="block text-sm font-semibold mb-2">Video URL (YouTube/Vimeo) *</label>
                <input
                  type="url"
                  required
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Duration (e.g., 5:30)</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
                  placeholder="5:30"
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-semibold mb-2">Image URL or Upload *</label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500 mb-2"
                placeholder="https://example.com/image.jpg"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e.target.files[0], 'url')}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
                disabled={uploading}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold mb-2">Thumbnail URL</label>
            <input
              type="url"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Category *</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
              >
                <option value="research">Research Activities</option>
                <option value="marine-life">Marine Life</option>
                <option value="events">Events & Conferences</option>
                <option value="facilities">Facilities & Equipment</option>
                <option value="field-work">Field Work</option>
                <option value="conservation">Conservation Efforts</option>
                <option value="education">Education & Training</option>
                <option value="partnerships">Partnerships</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Source</label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
              >
                <option value="manual">NARA Official</option>
                <option value="social">Social Media</option>
                <option value="news">News Outlets</option>
                <option value="partners">Partner Organizations</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Tags (comma-separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
              placeholder="research, marine biology, coral"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
                placeholder="Colombo, Sri Lanka"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {!isVideo && (
            <div>
              <label className="block text-sm font-semibold mb-2">Photographer/Credit</label>
              <input
                type="text"
                value={formData.photographer}
                onChange={(e) => setFormData({ ...formData, photographer: e.target.value })}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500"
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="approved"
              checked={formData.approved}
              onChange={(e) => setFormData({ ...formData, approved: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <label htmlFor="approved" className="text-sm">Approve immediately (show on public gallery)</label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading || uploading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default MediaAdmin;
