import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { podcastService, podcastAnalyticsService } from '../../services/podcastService';
import * as Icons from 'lucide-react';

const PodcastsPage = () => {
  const { t, i18n } = useTranslation('common');
  const [podcasts, setPodcasts] = useState([]);
  const [featuredPodcast, setFeaturedPodcast] = useState(null);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLanguages, setSelectedLanguages] = useState(['en', 'si', 'ta']); // All languages by default
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null); // Currently playing podcast

  const availableLanguages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'si', label: 'Sinhala', flag: '🇱🇰' },
    { code: 'ta', label: 'Tamil', flag: '🇱🇰' }
  ];

  const categories = [
    { id: 'all', label: 'All Podcasts', icon: Icons.Radio },
    { id: 'marine-research', label: 'Marine Research', icon: Icons.Microscope },
    { id: 'ocean-science', label: 'Ocean Science', icon: Icons.Waves },
    { id: 'conservation', label: 'Conservation', icon: Icons.TreePine },
    { id: 'interviews', label: 'Interviews', icon: Icons.Mic },
    { id: 'live', label: 'Live Sessions', icon: Icons.Radio }
  ];

  useEffect(() => {
    loadPodcasts();
    loadStatistics();
  }, [selectedCategory]);

  const loadPodcasts = async () => {
    setLoading(true);
    try {
      console.log('🔍 PUBLIC PAGE: Loading podcasts...');

      // Load featured podcast
      const { data: featured } = await podcastService.getFeatured(1);
      console.log('📺 Featured podcasts:', featured);
      if (featured && featured.length > 0) {
        setFeaturedPodcast(featured[0]);
      }

      // Load podcasts by category
      const filters = { status: 'published' };
      if (selectedCategory !== 'all') {
        filters.category = selectedCategory;
      }

      console.log('🔍 Fetching with filters:', filters);
      const { data: allPodcasts, error } = await podcastService.getAll(filters);
      console.log('📦 Fetched podcasts count:', allPodcasts?.length || 0);
      console.log('📦 Fetched podcasts data:', allPodcasts);
      console.log('❌ Fetch error:', error);

      setPodcasts(allPodcasts || []);

      // Load trending
      const { data: trendingData } = await podcastAnalyticsService.getTrending(6);
      console.log('🔥 Trending podcasts:', trendingData);
      setTrending(trendingData || []);
    } catch (error) {
      console.error('❌ Error loading podcasts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    const { data } = await podcastAnalyticsService.getStatistics();
    setStats(data);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadPodcasts();
      return;
    }

    setLoading(true);
    const { data } = await podcastService.search(searchQuery);
    setPodcasts(data || []);
    setLoading(false);
  };

  const toggleLanguageFilter = (langCode) => {
    setSelectedLanguages(prev => {
      const hasLang = prev.includes(langCode);
      if (hasLang) {
        // Remove language (but keep at least one)
        if (prev.length > 1) {
          return prev.filter(l => l !== langCode);
        }
        return prev;
      } else {
        // Add language
        return [...prev, langCode];
      }
    });
  };

  const filteredPodcasts = podcasts.filter(podcast => {
    // Filter by language
    const podcastLangs = podcast.languages || ['en'];
    const hasMatchingLang = selectedLanguages.some(lang => podcastLangs.includes(lang));

    console.log(`🔍 Filtering podcast "${podcast.title?.en}":`, {
      podcastLangs,
      selectedLanguages,
      hasMatchingLang
    });

    if (!hasMatchingLang) return false;

    // Filter by search query
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const title = podcast.title?.[i18n.language] || podcast.title?.en || '';
      const desc = podcast.description?.[i18n.language] || podcast.description?.en || '';
      return title.toLowerCase().includes(searchLower) ||
             desc.toLowerCase().includes(searchLower);
    }
    return true;
  });

  console.log('✅ Filtered podcasts count:', filteredPodcasts.length);
  console.log('✅ Filtered podcasts:', filteredPodcasts);

  const getCategoryLabel = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.label : categoryId;
  };

  const handlePodcastClick = (podcast) => {
    setCurrentlyPlaying(podcast);
    // Scroll to top to show the TV frame
    window.scrollTo({ top: 0, behavior: 'smooth' });
    console.log('🎬 Now playing:', podcast.title?.en);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950">
      {/* Hero Section with Stats */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative pt-32 pb-20 px-4 overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          {/* Title */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 mb-4 drop-shadow-2xl">
              NARA PODCASTS
            </h1>
            <p className="text-2xl text-slate-300 font-light">
              Ocean Knowledge Broadcasting System
            </p>
          </motion.div>

          {/* Statistics */}
          {stats && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center gap-8 mb-12 flex-wrap"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl px-8 py-4 border border-white/20">
                <div className="text-4xl font-bold text-cyan-400">{stats.published}</div>
                <div className="text-sm text-slate-300">Episodes</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl px-8 py-4 border border-white/20">
                <div className="text-4xl font-bold text-blue-400">{stats.totalViews}</div>
                <div className="text-sm text-slate-300">Total Views</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl px-8 py-4 border border-white/20">
                <div className="text-4xl font-bold text-purple-400">{Object.keys(stats.categories).length}</div>
                <div className="text-sm text-slate-300">Categories</div>
              </div>
            </motion.div>
          )}

          {/* RETRO TV FRAME - PERMANENT VIDEO DISPLAY */}
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="relative max-w-6xl mx-auto mb-16"
          >
            {/* TV Stand */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-72 h-14 bg-gradient-to-b from-slate-700 to-slate-900 rounded-t-3xl shadow-2xl z-10">
              <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-40 h-4 bg-slate-600 rounded-full" />
            </div>

            {/* TV Body - Retro CRT Style */}
            <div className="relative p-16 rounded-[4rem] bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 shadow-[0_0_150px_rgba(0,0,0,0.9)] border-8 border-slate-600">

              {/* Brand Badge */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-slate-900 px-8 py-2 rounded-full border-2 border-slate-500">
                <span className="text-slate-400 font-bold text-sm tracking-widest">NARA BROADCAST</span>
              </div>

              {/* Control Knobs - Left Side */}
              <div className="absolute left-8 top-1/2 -translate-y-1/2 space-y-8">
                {/* Volume Knob */}
                <motion.div
                  whileHover={{ rotate: 45 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="relative w-20 h-20 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border-4 border-slate-600 shadow-lg flex items-center justify-center cursor-pointer"
                >
                  <div className="w-2 h-10 bg-slate-300 rounded-full" />
                  <span className="absolute -bottom-8 text-xs text-slate-400 font-bold tracking-wider">VOL</span>
                </motion.div>

                {/* Channel Knob */}
                <motion.div
                  whileHover={{ rotate: -45 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="relative w-20 h-20 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border-4 border-slate-600 shadow-lg flex items-center justify-center cursor-pointer"
                >
                  <div className="w-2 h-10 bg-slate-300 rounded-full" />
                  <span className="absolute -bottom-8 text-xs text-slate-400 font-bold tracking-wider">CH</span>
                </motion.div>
              </div>

              {/* Screen Bezel with CRT Effects */}
              <div className="relative p-10 rounded-3xl bg-gradient-to-br from-slate-900 to-black shadow-inner border-4 border-slate-800">

                {/* Scanlines Overlay */}
                <div
                  className="absolute inset-0 pointer-events-none z-20 rounded-3xl"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
                    opacity: 0.1
                  }}
                />

                {/* Screen Glow Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 animate-pulse pointer-events-none z-10" />

                {/* Video Player Container */}
                <div className="relative rounded-2xl overflow-hidden bg-black shadow-2xl aspect-video">
                  {currentlyPlaying && currentlyPlaying.youtubeUrl ? (
                    // YouTube/Firebase Storage Video Player
                    <video
                      key={currentlyPlaying.youtubeUrl} // Force remount when video changes
                      autoPlay
                      controls
                      className="w-full h-full object-contain"
                      src={currentlyPlaying.youtubeUrl}
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    // Default intro video when no podcast is selected
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      controls
                      className="w-full h-full object-cover"
                    >
                      <source src="/videos/PODCAST VIDEO HERO SECTION.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}

                  {/* ON AIR Indicator */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute top-4 right-4 flex items-center gap-2 bg-red-600/90 backdrop-blur-sm px-4 py-2 rounded-full z-30"
                  >
                    <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
                    <span className="text-white font-bold text-sm tracking-wider">
                      {currentlyPlaying ? 'LIVE' : 'ON AIR'}
                    </span>
                  </motion.div>

                  {/* Now Playing Display */}
                  {currentlyPlaying && (
                    <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-cyan-400 z-30 max-w-md">
                      <div className="flex items-center gap-2">
                        <Icons.Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                        <span className="text-white font-semibold text-sm line-clamp-1">
                          {currentlyPlaying.title?.[i18n.language] || currentlyPlaying.title?.en}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Channel Display */}
                  <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-slate-700 z-30">
                    <span className="text-green-400 font-mono text-sm">NARA-FM</span>
                  </div>

                  {/* TV Static Effect (subtle overlay) */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-5 mix-blend-overlay z-10"
                    style={{
                      backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=)'
                    }}
                  />
                </div>
              </div>

              {/* Speaker Grills - Bottom */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="w-16 h-1 bg-slate-800 rounded-full" />
                    ))}
                  </div>
                ))}
              </div>

              {/* Power LED Indicator */}
              <motion.div
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute bottom-8 right-8 w-4 h-4 rounded-full bg-green-500 shadow-lg shadow-green-500/50"
              />

              {/* Vintage Label */}
              <div className="absolute bottom-4 right-1/4 bg-slate-900/50 px-3 py-1 rounded border border-slate-600">
                <span className="text-[10px] text-slate-500 font-mono">EST. 1981</span>
              </div>
            </div>
          </motion.div>

          {/* Social Share Buttons */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-12 max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-r from-slate-900/80 via-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl border-2 border-white/10 p-8 shadow-2xl">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                  <Icons.Share2 className="w-6 h-6 text-cyan-400" />
                  Share NARA Podcasts
                </h3>
                <p className="text-slate-300 text-sm">Share our ocean research podcasts with your community</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {/* WhatsApp */}
                <motion.a
                  href={`https://wa.me/?text=${encodeURIComponent('Check out NARA Podcasts - Ocean Research & Marine Science! ' + window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-3 bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl shadow-lg hover:shadow-green-500/50 transition-all group"
                >
                  <Icons.MessageCircle className="w-10 h-10 text-white" />
                  <span className="text-white font-bold text-sm">WhatsApp</span>
                  <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-white"
                      initial={{ width: 0 }}
                      whileHover={{ width: '100%' }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.a>

                {/* Facebook */}
                <motion.a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-3 bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-2xl shadow-lg hover:shadow-blue-500/50 transition-all group"
                >
                  <Icons.Facebook className="w-10 h-10 text-white" />
                  <span className="text-white font-bold text-sm">Facebook</span>
                  <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-white"
                      initial={{ width: 0 }}
                      whileHover={{ width: '100%' }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.a>

                {/* LinkedIn */}
                <motion.a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-3 bg-gradient-to-br from-blue-700 to-blue-800 p-6 rounded-2xl shadow-lg hover:shadow-blue-600/50 transition-all group"
                >
                  <Icons.Linkedin className="w-10 h-10 text-white" />
                  <span className="text-white font-bold text-sm">LinkedIn</span>
                  <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-white"
                      initial={{ width: 0 }}
                      whileHover={{ width: '100%' }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.a>

                {/* Instagram (Copy Link) */}
                <motion.button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied! Paste it in your Instagram bio or story.');
                  }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-3 bg-gradient-to-br from-pink-600 via-purple-600 to-orange-500 p-6 rounded-2xl shadow-lg hover:shadow-pink-500/50 transition-all group"
                >
                  <Icons.Instagram className="w-10 h-10 text-white" />
                  <span className="text-white font-bold text-sm">Instagram</span>
                  <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-white"
                      initial={{ width: 0 }}
                      whileHover={{ width: '100%' }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.button>

                {/* TikTok (Copy Link) */}
                <motion.button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied! Share it on your TikTok.');
                  }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-3 bg-gradient-to-br from-black via-slate-900 to-black p-6 rounded-2xl shadow-lg hover:shadow-cyan-400/50 transition-all group border-2 border-cyan-400"
                >
                  <Icons.Music className="w-10 h-10 text-cyan-400" />
                  <span className="text-cyan-400 font-bold text-sm">TikTok</span>
                  <div className="w-full h-1 bg-cyan-400/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-cyan-400"
                      initial={{ width: 0 }}
                      whileHover={{ width: '100%' }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.button>
              </div>

              {/* Share Counter (Optional) */}
              <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full">
                  <Icons.Users className="w-4 h-4 text-cyan-400" />
                  <span className="text-slate-300 text-sm">Join thousands sharing ocean knowledge</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Language Filter Buttons */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-r from-slate-900/50 via-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <Icons.Languages className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-white font-bold text-lg">Filter by Language</h3>
                </div>

                <div className="flex gap-3 flex-wrap">
                  {availableLanguages.map(lang => (
                    <motion.button
                      key={lang.code}
                      onClick={() => toggleLanguageFilter(lang.code)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-5 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                        selectedLanguages.includes(lang.code)
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                          : 'bg-white/10 text-slate-300 hover:bg-white/20'
                      }`}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <span>{lang.label}</span>
                      {selectedLanguages.includes(lang.code) && (
                        <Icons.Check className="w-4 h-4" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-slate-400 text-sm">
                <Icons.Info className="w-4 h-4" />
                <span>
                  Showing podcasts available in: {selectedLanguages.map(code =>
                    availableLanguages.find(l => l.code === code)?.label
                  ).join(', ')}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.form
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            onSubmit={handleSearch}
            className="mt-8 max-w-3xl mx-auto"
          >
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search podcasts..."
                className="w-full px-8 py-6 bg-white/10 backdrop-blur-lg border-2 border-white/20 rounded-2xl text-white placeholder-slate-400 text-xl focus:outline-none focus:border-cyan-400 transition-all"
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-gradient-to-r from-cyan-500 to-blue-500 p-4 rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
              >
                <Icons.Search className="w-6 h-6 text-white" />
              </button>
            </div>
          </motion.form>
        </div>
      </motion.section>

      {/* Category Filter Tiles */}
      <section className="relative py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {categories.map((category, index) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;

              return (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`relative p-6 rounded-2xl backdrop-blur-lg border-2 transition-all ${
                    isActive
                      ? 'bg-gradient-to-br from-cyan-500/30 to-blue-500/30 border-cyan-400 shadow-lg shadow-cyan-500/30'
                      : 'bg-white/10 border-white/20 hover:border-white/40'
                  }`}
                >
                  <Icon className={`w-8 h-8 mx-auto mb-2 ${isActive ? 'text-cyan-400' : 'text-slate-300'}`} />
                  <span className={`text-sm font-semibold ${isActive ? 'text-cyan-400' : 'text-slate-300'}`}>
                    {category.label}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Podcasts Grid */}
      <section className="relative py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Icons.Radio className="w-16 h-16 text-cyan-400" />
              </motion.div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredPodcasts.map((podcast, index) => (
                  <motion.div
                    key={podcast.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    onClick={() => handlePodcastClick(podcast)}
                    className="group relative bg-white/10 backdrop-blur-lg rounded-3xl overflow-hidden border border-white/20 hover:border-cyan-400/50 transition-all shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20 cursor-pointer"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-64 overflow-hidden bg-slate-900">
                      {podcast.youtubeId ? (
                        <img
                          src={`https://img.youtube.com/vi/${podcast.youtubeId}/maxresdefault.jpg`}
                          alt={podcast.title?.[i18n.language] || podcast.title?.en}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Icons.Radio className="w-20 h-20 text-slate-700" />
                        </div>
                      )}

                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <motion.div
                          whileHover={{ scale: 1.2 }}
                          className="w-20 h-20 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg"
                        >
                          <Icons.Play className="w-10 h-10 text-white ml-1" />
                        </motion.div>
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-cyan-400 font-semibold">
                        {getCategoryLabel(podcast.category)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                        {podcast.title?.[i18n.language] || podcast.title?.en || 'Untitled'}
                      </h3>

                      <p className="text-slate-300 text-sm mb-4 line-clamp-3">
                        {podcast.description?.[i18n.language] || podcast.description?.en || ''}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Icons.Eye className="w-4 h-4" />
                            {podcast.views || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icons.Heart className="w-4 h-4" />
                            {podcast.likes || 0}
                          </span>
                        </div>
                        {podcast.duration && (
                          <span className="flex items-center gap-1">
                            <Icons.Clock className="w-4 h-4" />
                            {podcast.duration}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {!loading && filteredPodcasts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Icons.Radio className="w-24 h-24 text-slate-700 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-400 mb-2">No podcasts found</h3>
              <p className="text-slate-500">Try adjusting your search or category filter</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Trending Section */}
      {trending.length > 0 && (
        <section className="relative py-16 px-4 bg-gradient-to-b from-transparent to-slate-900/50">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 mb-12"
            >
              <Icons.TrendingUp className="w-12 h-12 text-orange-400 inline-block mr-4 mb-2" />
              Trending Now
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trending.map((podcast, index) => (
                <motion.div
                  key={podcast.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-orange-900/30 to-red-900/30 backdrop-blur-lg rounded-2xl p-6 border border-orange-500/30 hover:border-orange-400 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-5xl font-black text-orange-400/30">#{index + 1}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">
                        {podcast.title?.[i18n.language] || podcast.title?.en}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Icons.Eye className="w-3 h-3" />
                          {podcast.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icons.TrendingUp className="w-3 h-3" />
                          Hot
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default PodcastsPage;
