import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Image as ImageIcon, Video, Download, Share2,
  Calendar, Tag, MapPin, ExternalLink, Clock, Eye, Heart,
  Grid3x3, List, SlidersHorizontal, X, ChevronDown, Play,
  ZoomIn, Facebook, Twitter, Instagram, Youtube, Linkedin
} from 'lucide-react';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { useTranslation } from 'react-i18next';

const MediaGallery = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('images'); // 'images' or 'videos'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  // Categories for filtering
  const categories = [
    { id: 'all', label: 'All Media', icon: Grid3x3 },
    { id: 'research', label: 'Research Activities', icon: ImageIcon },
    { id: 'marine-life', label: 'Marine Life', icon: ImageIcon },
    { id: 'events', label: 'Events & Conferences', icon: Calendar },
    { id: 'facilities', label: 'Facilities & Equipment', icon: ImageIcon },
    { id: 'field-work', label: 'Field Work', icon: MapPin },
    { id: 'conservation', label: 'Conservation Efforts', icon: Heart },
    { id: 'education', label: 'Education & Training', icon: ImageIcon },
    { id: 'partnerships', label: 'Partnerships', icon: ImageIcon },
  ];

  // Source filters
  const sources = [
    { id: 'all', label: 'All Sources', icon: Grid3x3 },
    { id: 'manual', label: 'NARA Official', icon: ImageIcon },
    { id: 'social', label: 'Social Media', icon: Facebook },
    { id: 'news', label: 'News Outlets', icon: ExternalLink },
    { id: 'partners', label: 'Partner Organizations', icon: Linkedin },
  ];

  // Load media from Firebase
  useEffect(() => {
    loadMedia();
  }, [activeTab, selectedCategory, selectedSource, dateFilter]);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const collectionName = activeTab === 'images' ? 'media_images' : 'media_videos';
      let q = query(collection(db, collectionName), orderBy('createdAt', 'desc'), limit(50));

      // Apply filters
      if (selectedCategory !== 'all') {
        q = query(q, where('category', '==', selectedCategory));
      }
      if (selectedSource !== 'all') {
        q = query(q, where('source', '==', selectedSource));
      }

      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMediaItems(items);
    } catch (error) {
      console.error('Error loading media:', error);
      // Load fallback data if Firebase fails
      setMediaItems(getFallbackData());
    } finally {
      setLoading(false);
    }
  };

  // Fallback data for demonstration
  const getFallbackData = () => {
    if (activeTab === 'images') {
      return [
        {
          id: '1',
          title: 'Marine Research Expedition - Southern Coast',
          description: 'NARA researchers conducting marine biodiversity assessment in southern waters',
          url: 'https://picsum.photos/800/600?random=1',
          thumbnail: 'https://picsum.photos/400/300?random=1',
          category: 'research',
          source: 'manual',
          tags: ['research', 'marine biology', 'field work'],
          location: 'Galle, Sri Lanka',
          date: '2024-10-10',
          photographer: 'NARA Media Team',
          views: 1245,
          likes: 89
        },
        {
          id: '2',
          title: 'Coral Reef Conservation Project',
          description: 'Underwater documentation of coral restoration efforts',
          url: 'https://picsum.photos/800/600?random=2',
          thumbnail: 'https://picsum.photos/400/300?random=2',
          category: 'conservation',
          source: 'manual',
          tags: ['coral', 'conservation', 'underwater'],
          location: 'Hikkaduwa Marine Sanctuary',
          date: '2024-10-08',
          photographer: 'Dr. Priya Fernando',
          views: 2134,
          likes: 156
        },
        {
          id: '3',
          title: 'International Ocean Conference 2024',
          description: 'NARA delegation at the Indo-Pacific Marine Science Summit',
          url: 'https://picsum.photos/800/600?random=3',
          thumbnail: 'https://picsum.photos/400/300?random=3',
          category: 'events',
          source: 'news',
          tags: ['conference', 'international', 'collaboration'],
          location: 'Colombo Convention Center',
          date: '2024-10-05',
          photographer: 'Daily News',
          views: 3456,
          likes: 234
        },
        {
          id: '4',
          title: 'Sea Turtle Nesting Monitoring',
          description: 'Conservation team tracking sea turtle nesting patterns',
          url: 'https://picsum.photos/800/600?random=4',
          thumbnail: 'https://picsum.photos/400/300?random=4',
          category: 'marine-life',
          source: 'social',
          tags: ['turtles', 'conservation', 'wildlife'],
          location: 'Rekawa Beach',
          date: '2024-10-03',
          photographer: 'NARA Facebook',
          views: 5678,
          likes: 423
        },
        {
          id: '5',
          title: 'Advanced Marine Laboratory Equipment',
          description: 'New state-of-the-art research equipment installation',
          url: 'https://picsum.photos/800/600?random=5',
          thumbnail: 'https://picsum.photos/400/300?random=5',
          category: 'facilities',
          source: 'manual',
          tags: ['laboratory', 'equipment', 'research'],
          location: 'NARA Colombo',
          date: '2024-09-28',
          photographer: 'NARA Media Team',
          views: 876,
          likes: 67
        },
        {
          id: '6',
          title: 'School Outreach Program',
          description: 'Marine biology education session with local school students',
          url: 'https://picsum.photos/800/600?random=6',
          thumbnail: 'https://picsum.photos/400/300?random=6',
          category: 'education',
          source: 'manual',
          tags: ['education', 'outreach', 'students'],
          location: 'NARA Learning Center',
          date: '2024-09-25',
          photographer: 'NARA Education Team',
          views: 1543,
          likes: 198
        }
      ];
    } else {
      return [
        {
          id: 'v1',
          title: 'NARA 2024 Year in Review',
          description: 'Comprehensive overview of NARA\'s major achievements and research highlights',
          thumbnail: 'https://picsum.photos/400/300?random=11',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          duration: '8:45',
          category: 'research',
          source: 'manual',
          tags: ['annual review', 'highlights', 'research'],
          date: '2024-10-12',
          views: 12456,
          likes: 892
        },
        {
          id: 'v2',
          title: 'Underwater Documentary: Sri Lankan Coral Reefs',
          description: '4K underwater footage showcasing the biodiversity of Sri Lankan coral ecosystems',
          thumbnail: 'https://picsum.photos/400/300?random=12',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          duration: '15:30',
          category: 'marine-life',
          source: 'manual',
          tags: ['coral reefs', 'underwater', 'documentary'],
          date: '2024-10-09',
          views: 23789,
          likes: 1567
        },
        {
          id: 'v3',
          title: 'Marine Research Methods Training',
          description: 'Educational video on modern marine research techniques and equipment',
          thumbnail: 'https://picsum.photos/400/300?random=13',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          duration: '12:20',
          category: 'education',
          source: 'manual',
          tags: ['training', 'education', 'methods'],
          date: '2024-10-01',
          views: 8934,
          likes: 567
        },
        {
          id: 'v4',
          title: 'Blue Whale Sighting - Southern Coast',
          description: 'Rare footage of blue whales migrating through Sri Lankan waters',
          thumbnail: 'https://picsum.photos/400/300?random=14',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          duration: '5:15',
          category: 'marine-life',
          source: 'social',
          tags: ['whales', 'wildlife', 'migration'],
          date: '2024-09-28',
          views: 45678,
          likes: 3245
        }
      ];
    }
  };

  // Filter media based on search query
  const filteredMedia = mediaItems.filter(item => {
    const matchesSearch = searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSearch;
  });

  const toggleFavorite = (id) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">
            📸 NARA Media Gallery
          </h1>
          <p className="text-xl md:text-2xl text-center text-cyan-100 mb-8">
            Explore our visual journey through ocean research, conservation, and marine science
          </p>

          {/* Main Search Bar */}
          <div className="max-w-3xl mx-auto relative">
            <input
              type="text"
              placeholder="Search images, videos, tags, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 pr-12 rounded-2xl bg-white/20 backdrop-blur-lg border-2 border-white/30 text-white placeholder-white/60 text-lg focus:outline-none focus:border-cyan-300 transition-all"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-white/60" />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-4xl mx-auto">
            {[
              { label: 'Total Images', value: '2,400+', icon: ImageIcon },
              { label: 'Video Content', value: '340+', icon: Video },
              { label: 'Total Views', value: '1.2M+', icon: Eye },
              { label: 'Media Sources', value: '15+', icon: ExternalLink }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-cyan-300" />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-cyan-200">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs and Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          {/* Image/Video Tabs */}
          <div className="flex gap-2 bg-slate-800/50 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('images')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'images'
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <ImageIcon className="w-5 h-5" />
              Images ({filteredMedia.length})
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'videos'
                  ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/50'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Video className="w-5 h-5" />
              Videos ({filteredMedia.length})
            </button>
          </div>

          {/* View Mode and Filters */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-all"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>
            <div className="flex gap-1 bg-slate-800/50 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-all ${
                  viewMode === 'grid' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-all ${
                  viewMode === 'list' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 bg-slate-800/30 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-semibold mb-3 text-cyan-300">Category</label>
                  <div className="space-y-2">
                    {categories.slice(0, 6).map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all ${
                          selectedCategory === cat.id
                            ? 'bg-cyan-500 text-white'
                            : 'bg-slate-700/30 text-slate-300 hover:bg-slate-700/50'
                        }`}
                      >
                        <cat.icon className="w-4 h-4" />
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Source Filter */}
                <div>
                  <label className="block text-sm font-semibold mb-3 text-purple-300">Source</label>
                  <div className="space-y-2">
                    {sources.map(src => (
                      <button
                        key={src.id}
                        onClick={() => setSelectedSource(src.id)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all ${
                          selectedSource === src.id
                            ? 'bg-purple-500 text-white'
                            : 'bg-slate-700/30 text-slate-300 hover:bg-slate-700/50'
                        }`}
                      >
                        <src.icon className="w-4 h-4" />
                        {src.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date Filter */}
                <div>
                  <label className="block text-sm font-semibold mb-3 text-blue-300">Date Range</label>
                  <div className="space-y-2">
                    {['all', 'today', 'week', 'month', 'year'].map(period => (
                      <button
                        key={period}
                        onClick={() => setDateFilter(period)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all capitalize ${
                          dateFilter === period
                            ? 'bg-blue-500 text-white'
                            : 'bg-slate-700/30 text-slate-300 hover:bg-slate-700/50'
                        }`}
                      >
                        <Calendar className="w-4 h-4" />
                        {period === 'all' ? 'All Time' : `Last ${period}`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Media Grid/List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-400">Loading media...</p>
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="text-center py-20">
            <ImageIcon className="w-24 h-24 mx-auto text-slate-600 mb-4" />
            <h3 className="text-2xl font-bold text-slate-400 mb-2">No media found</h3>
            <p className="text-slate-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }>
            {filteredMedia.map((item, index) => (
              <MediaCard
                key={item.id}
                item={item}
                viewMode={viewMode}
                isVideo={activeTab === 'videos'}
                isFavorite={favorites.includes(item.id)}
                onToggleFavorite={() => toggleFavorite(item.id)}
                onClick={() => setSelectedMedia(item)}
                index={index}
              />
            ))}
          </div>
        )}
      </div>

      {/* Media Modal */}
      <AnimatePresence>
        {selectedMedia && (
          <MediaModal
            media={selectedMedia}
            isVideo={activeTab === 'videos'}
            onClose={() => setSelectedMedia(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Media Card Component
const MediaCard = ({ item, viewMode, isVideo, isFavorite, onToggleFavorite, onClick, index }) => {
  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className="flex gap-4 bg-slate-800/30 backdrop-blur-lg rounded-xl overflow-hidden border border-slate-700/50 hover:border-cyan-500/50 transition-all group cursor-pointer"
        onClick={onClick}
      >
        <div className="relative w-48 h-32 flex-shrink-0">
          <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
          {isVideo && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Play className="w-12 h-12 text-white" />
              <span className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs">
                {item.duration}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 py-3 pr-4">
          <h3 className="font-bold text-lg mb-1 group-hover:text-cyan-400 transition-colors">{item.title}</h3>
          <p className="text-sm text-slate-400 mb-2 line-clamp-2">{item.description}</p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {item.date}</span>
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {item.views}</span>
            <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {item.likes}</span>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
          className="p-4"
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-500'}`} />
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="group relative bg-slate-800/30 backdrop-blur-lg rounded-xl overflow-hidden border border-slate-700/50 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/20 transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/60 transition-colors">
            <Play className="w-16 h-16 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
            <span className="absolute bottom-3 right-3 bg-black/70 px-2 py-1 rounded text-sm font-semibold">
              {item.duration}
            </span>
          </div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
          className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-all z-10"
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">
          {item.title}
        </h3>
        <p className="text-sm text-slate-400 mb-3 line-clamp-2">{item.description}</p>
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {item.date}</span>
          <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {item.views}</span>
        </div>
        {item.location && (
          <div className="flex items-center gap-1 text-xs text-cyan-400 mb-2">
            <MapPin className="w-3 h-3" /> {item.location}
          </div>
        )}
        <div className="flex flex-wrap gap-1">
          {item.tags?.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-1 bg-slate-700/50 rounded text-xs">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Media Modal Component
const MediaModal = ({ media, isVideo, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-6xl w-full max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-all"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        <div className="max-h-[90vh] overflow-y-auto">
          {isVideo ? (
            <div className="aspect-video bg-black">
              <iframe
                src={media.videoUrl.replace('watch?v=', 'embed/')}
                className="w-full h-full"
                allowFullScreen
                title={media.title}
              />
            </div>
          ) : (
            <div className="relative">
              <img src={media.url} alt={media.title} className="w-full" />
            </div>
          )}

          <div className="p-6">
            <h2 className="text-3xl font-bold mb-2">{media.title}</h2>
            <p className="text-slate-400 mb-4">{media.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-400" />
                <span className="text-sm">{media.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-cyan-400" />
                <span className="text-sm">{media.views} views</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-400" />
                <span className="text-sm">{media.likes} likes</span>
              </div>
              {media.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm">{media.location}</span>
                </div>
              )}
            </div>

            {media.photographer && (
              <p className="text-sm text-slate-500 mb-4">
                📸 Photo by: {media.photographer}
              </p>
            )}

            <div className="flex flex-wrap gap-2 mb-4">
              {media.tags?.map(tag => (
                <span key={tag} className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500 rounded-lg hover:bg-cyan-600 transition-all">
                <Download className="w-4 h-4" />
                Download
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-all">
                <Share2 className="w-4 h-4" />
                Share
              </button>
              {!isVideo && media.url && (
                <a
                  href={media.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Original
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MediaGallery;
