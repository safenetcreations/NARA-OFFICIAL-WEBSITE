/**
 * NARA Podcast Station
 *
 * Features:
 * - Google NotebookLM podcast integration
 * - YouTube embed player
 * - Live podcast station
 * - Episode archive/history
 * - Categories and search
 * - Audio player with playlist
 * - Social sharing
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import {
  Mic,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Radio,
  Clock,
  Eye,
  Heart,
  Share2,
  Download,
  Calendar,
  Tag,
  TrendingUp,
  Youtube,
  Search,
  Filter,
  Star,
  Sparkles,
  Waves,
  Podcast
} from 'lucide-react';
import { podcastService, podcastAnalyticsService } from '../../services/podcastService';

const PodcastsPage = () => {
  const { t, i18n } = useTranslation('podcasts');
  const [podcasts, setPodcasts] = useState([]);
  const [featuredPodcast, setFeaturedPodcast] = useState(null);
  const [trendingPodcasts, setTrendingPodcasts] = useState([]);
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLiveMode, setIsLiveMode] = useState(false);

  const audioRef = useRef(null);

  const categories = [
    { id: 'all', label: 'All Episodes', icon: Podcast },
    { id: 'marine-research', label: 'Marine Research', icon: Waves },
    { id: 'ocean-science', label: 'Ocean Science', icon: Sparkles },
    { id: 'conservation', label: 'Conservation', icon: Heart },
    { id: 'interviews', label: 'Interviews', icon: Mic },
    { id: 'live', label: 'Live Sessions', icon: Radio }
  ];

  useEffect(() => {
    loadPodcasts();
    loadStatistics();
  }, []);

  const loadPodcasts = async () => {
    setLoading(true);
    try {
      const [podcastsResult, featuredResult, trendingResult] = await Promise.all([
        podcastService.getAll({ status: 'published', limit: 50 }),
        podcastService.getFeatured(1),
        podcastAnalyticsService.getTrending(5)
      ]);

      if (podcastsResult.data) {
        setPodcasts(podcastsResult.data);
      }

      if (featuredResult.data && featuredResult.data.length > 0) {
        setFeaturedPodcast(featuredResult.data[0]);
        setSelectedPodcast(featuredResult.data[0]);
      }

      if (trendingResult.data) {
        setTrendingPodcasts(trendingResult.data);
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

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handlePodcastSelect = async (podcast) => {
    setSelectedPodcast(podcast);
    setIsPlaying(false);

    // Increment views
    await podcastService.incrementViews(podcast.id);
  };

  const handleLike = async (podcastId) => {
    // TODO: Get userId from auth context
    const userId = 'guest';
    const result = await podcastService.toggleLike(podcastId, userId);
    if (result.data) {
      // Reload podcasts to update like count
      loadPodcasts();
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredPodcasts = podcasts.filter(podcast => {
    const matchesSearch = !searchTerm ||
      podcast.title?.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      podcast.description?.en?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || podcast.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      <Helmet>
        <title>NARA Podcasts - Ocean Science Audio Station</title>
        <meta name="description" content="Listen to NARA's ocean science podcasts, interviews, and live sessions" />
      </Helmet>

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 mb-6">
            <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
            <span className="text-cyan-400 font-semibold">LIVE PODCAST STATION</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
              NARA Podcasts
            </span>
          </h1>

          <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-8">
            Dive into ocean science with our AI-powered podcasts from Google NotebookLM.
            Listen to research insights, interviews, and live sessions.
          </p>

          {/* Statistics */}
          {statistics && (
            <div className="flex justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">{statistics.total}</div>
                <div className="text-sm text-slate-400">Episodes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{statistics.totalViews}</div>
                <div className="text-sm text-slate-400">Total Plays</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{statistics.totalLikes}</div>
                <div className="text-sm text-slate-400">Likes</div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Featured Podcast / Live Player */}
        {selectedPodcast && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-12 p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 shadow-2xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Podcast Info */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  {selectedPodcast.featured && (
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-semibold flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      FEATURED
                    </span>
                  )}
                  <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
                    {selectedPodcast.category}
                  </span>
                </div>

                <h2 className="text-3xl font-bold mb-4">{selectedPodcast.title?.en || selectedPodcast.title}</h2>
                <p className="text-slate-400 mb-6">{selectedPodcast.description?.en || selectedPodcast.description}</p>

                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{selectedPodcast.publishedAt && new Date(selectedPodcast.publishedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{selectedPodcast.duration || '45 min'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">{selectedPodcast.views || 0} plays</span>
                  </div>
                </div>

                {/* YouTube Embed if available */}
                {selectedPodcast.youtubeId && (
                  <div className="aspect-video rounded-xl overflow-hidden mb-6 shadow-lg">
                    <iframe
                      src={`https://www.youtube.com/embed/${selectedPodcast.youtubeId}`}
                      title={selectedPodcast.title?.en || selectedPodcast.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-4">
                  <button
                    onClick={() => handleLike(selectedPodcast.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 transition-colors"
                  >
                    <Heart className="w-5 h-5 text-red-400" />
                    <span>{selectedPodcast.likes || 0}</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30 transition-colors">
                    <Share2 className="w-5 h-5 text-blue-400" />
                    Share
                  </button>
                  {selectedPodcast.audioUrl && (
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/20 border border-green-500/30 hover:bg-green-500/30 transition-colors">
                      <Download className="w-5 h-5 text-green-400" />
                      Download
                    </button>
                  )}
                </div>
              </div>

              {/* Audio Player */}
              {selectedPodcast.audioUrl && (
                <div className="flex flex-col justify-center">
                  <div className="p-8 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-xl border border-cyan-500/20">
                    {/* Waveform Visualization Placeholder */}
                    <div className="h-32 mb-6 flex items-end justify-around gap-1">
                      {[...Array(50)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-full bg-gradient-to-t from-cyan-400 to-blue-400 rounded-full"
                          style={{ height: `${Math.random() * 100}%` }}
                          animate={{ height: isPlaying ? [`${Math.random() * 100}%`, `${Math.random() * 100}%`] : '40%' }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.02 }}
                        />
                      ))}
                    </div>

                    {/* Progress Bar */}
                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full mb-4"
                    />

                    <div className="flex justify-between text-sm text-slate-400 mb-6">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-6">
                      <button className="p-3 rounded-full hover:bg-white/10 transition-colors">
                        <SkipBack className="w-6 h-6" />
                      </button>

                      <button
                        onClick={handlePlayPause}
                        className="p-6 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg shadow-cyan-500/50"
                      >
                        {isPlaying ? (
                          <Pause className="w-8 h-8" />
                        ) : (
                          <Play className="w-8 h-8 ml-1" />
                        )}
                      </button>

                      <button className="p-3 rounded-full hover:bg-white/10 transition-colors">
                        <SkipForward className="w-6 h-6" />
                      </button>
                    </div>

                    {/* Volume Control */}
                    <div className="flex items-center gap-4 mt-6">
                      <button onClick={toggleMute} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="flex-1"
                      />
                    </div>

                    {/* Hidden Audio Element */}
                    <audio
                      ref={audioRef}
                      src={selectedPodcast.audioUrl}
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                      onEnded={() => setIsPlaying(false)}
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search podcasts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-white placeholder-slate-400"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl whitespace-nowrap transition-all ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  <category.icon className="w-4 h-4" />
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Podcast Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Loading Skeletons
            [...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-full h-48 bg-white/10 rounded-xl mb-4" />
                <div className="h-6 bg-white/10 rounded mb-2" />
                <div className="h-4 bg-white/10 rounded w-2/3" />
              </div>
            ))
          ) : filteredPodcasts.length === 0 ? (
            <div className="col-span-3 text-center py-12">
              <Podcast className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400">No podcasts found. Try adjusting your search or filters.</p>
            </div>
          ) : (
            filteredPodcasts.map((podcast) => (
              <motion.div
                key={podcast.id}
                whileHover={{ y: -5, scale: 1.02 }}
                onClick={() => handlePodcastSelect(podcast)}
                className="cursor-pointer p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 hover:border-cyan-500/50 transition-all group"
              >
                {/* Thumbnail */}
                <div className="relative mb-4 rounded-xl overflow-hidden">
                  {podcast.thumbnail ? (
                    <img
                      src={podcast.thumbnail}
                      alt={podcast.title?.en || podcast.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                      <Mic className="w-16 h-16 text-cyan-400" />
                    </div>
                  )}

                  {podcast.featured && (
                    <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-yellow-500 text-white text-xs font-semibold flex items-center gap-1">
                      <Star className="w-3 h-3" />
                    </div>
                  )}

                  {podcast.youtubeId && (
                    <div className="absolute bottom-2 right-2 p-2 rounded-full bg-red-600">
                      <Youtube className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
                      {podcast.category}
                    </span>
                    <span className="text-xs text-slate-400">{podcast.duration || '45 min'}</span>
                  </div>

                  <h3 className="text-lg font-bold line-clamp-2 group-hover:text-cyan-400 transition-colors">
                    {podcast.title?.en || podcast.title}
                  </h3>

                  <p className="text-sm text-slate-400 line-clamp-2">
                    {podcast.description?.en || podcast.description}
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {podcast.views || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {podcast.likes || 0}
                      </span>
                    </div>
                    <button className="p-2 rounded-full bg-cyan-500/20 border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors">
                      <Play className="w-4 h-4 text-cyan-400" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Trending Section */}
        {trendingPodcasts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-orange-400" />
              <h2 className="text-2xl font-bold">Trending Now</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {trendingPodcasts.map((podcast, index) => (
                <motion.div
                  key={podcast.id}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handlePodcastSelect(podcast)}
                  className="cursor-pointer p-4 rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 hover:border-orange-500/50 transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-bold text-orange-400">#{index + 1}</span>
                    <TrendingUp className="w-5 h-5 text-orange-400" />
                  </div>
                  <h3 className="font-semibold text-sm line-clamp-2 mb-2">{podcast.title?.en || podcast.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Eye className="w-3 h-3" />
                    {podcast.views || 0} plays
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PodcastsPage;
