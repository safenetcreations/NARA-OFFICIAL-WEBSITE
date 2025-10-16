import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import * as Icons from 'lucide-react';
import {
  pressReleasesService,
  mediaAssetsService,
  storiesService,
  mediaContactsService,
  mediaPressDashboardService
} from '../../services/mediaPressService';

const MediaPressKit = () => {
  const { t, i18n } = useTranslation(['common', 'media']);
  const currentLang = i18n.language || 'en';
  const [activeView, setActiveView] = useState('home');
  const [dashboardData, setDashboardData] = useState(null);
  const [releases, setReleases] = useState([]);
  const [assets, setAssets] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssetType, setSelectedAssetType] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [dashResult, releasesResult, assetsResult, storiesResult] = await Promise.all([
        mediaPressDashboardService.getStatistics(),
        pressReleasesService.getAll({ limit: 50 }),
        mediaAssetsService.getAll({ limit: 100 }),
        storiesService.getAll({ limit: 30 })
      ]);

      if (dashResult.data) setDashboardData(dashResult.data);
      if (releasesResult.data) setReleases(releasesResult.data);
      if (assetsResult.data) setAssets(assetsResult.data);
      if (storiesResult.data) setStories(storiesResult.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (asset) => {
    if (asset.fileUrl) {
      await mediaAssetsService.incrementDownload(asset.id);
      window.open(asset.fileUrl, '_blank');
    }
  };

  const filteredAssets = selectedAssetType === 'all'
    ? assets
    : assets.filter(a => a.assetType === selectedAssetType);

  const navTabs = [
    { id: 'home', label: t('media:tabs.home'), icon: Icons.Home },
    { id: 'releases', label: t('media:tabs.releases'), icon: Icons.FileText },
    { id: 'assets', label: t('media:tabs.assets'), icon: Icons.Image },
    { id: 'stories', label: t('media:tabs.stories'), icon: Icons.BookOpen },
    { id: 'contacts', label: t('media:tabs.contacts'), icon: Icons.Phone }
  ];

  if (loading && !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-pink-900 text-xl">{t('common:loading')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50 to-blue-50">
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-pink-900 via-purple-900 to-indigo-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ x: Math.random() * window.innerWidth, y: Math.random() * 300 }}
              animate={{ x: [null, Math.random() * window.innerWidth], y: [null, Math.random() * 300] }}
              transition={{ duration: 15 + Math.random() * 10, repeat: Infinity, repeatType: 'reverse' }}
            >
              <Icons.Camera className="w-8 h-8" />
            </motion.div>
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center justify-center gap-4 mb-6">
              <Icons.Newspaper className="w-16 h-16" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6" lang={currentLang}>
              {t('media:hero.title')}
            </h1>
            <p className="text-xl text-pink-100 max-w-3xl mx-auto leading-relaxed" lang={currentLang}>
              {t('media:hero.description')}
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <button className="px-8 py-4 bg-white text-pink-900 font-bold rounded-xl hover:shadow-2xl transition-all flex items-center gap-3 group">
                <Icons.Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {t('media:quickActions.download')}
              </button>
              <button className="px-8 py-4 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl transition-all flex items-center gap-3">
                <Icons.Bell className="w-5 h-5" />
                {t('media:quickActions.subscribe')}
              </button>
              <button className="px-8 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-all flex items-center gap-3">
                <Icons.Rss className="w-5 h-5" />
                {t('media:quickActions.rss')}
              </button>
            </div>

            {dashboardData && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                  <div className="text-3xl font-bold mb-2">{dashboardData.overview.totalReleases}</div>
                  <div className="text-sm text-pink-200">{t('media:stats.pressReleases')}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                  <div className="text-3xl font-bold mb-2">{dashboardData.overview.totalAssets}</div>
                  <div className="text-sm text-pink-200">{t('media:stats.mediaAssets')}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                  <div className="text-3xl font-bold mb-2">{dashboardData.overview.totalStories}</div>
                  <div className="text-sm text-pink-200">{t('media:stats.stories')}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                  <div className="text-3xl font-bold mb-2">{dashboardData.overview.totalContacts}</div>
                  <div className="text-sm text-pink-200">{t('media:stats.mediaContacts')}</div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Professional Toolbar */}
      <div className="bg-white border-b-2 border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm">
                <Icons.Calendar className="w-4 h-4 text-pink-600" />
                <span className="text-gray-600">{t('media:toolbar.lastUpdated')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Icons.Users className="w-4 h-4 text-pink-600" />
                <span className="text-gray-600">{t('media:toolbar.activeContacts')}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title={t('media:toolbar.shareTwitter')}>
                <Icons.Twitter className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title={t('media:toolbar.shareFacebook')}>
                <Icons.Facebook className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title={t('media:toolbar.shareLinkedIn')}>
                <Icons.Linkedin className="w-5 h-5 text-gray-600" />
              </button>
              <div className="h-6 w-px bg-gray-300 mx-2"></div>
              <a
                href="/admin/media"
                className="px-4 py-2 bg-pink-600 text-white text-sm font-medium rounded-lg hover:bg-pink-700 transition-colors flex items-center gap-2"
              >
                <Icons.Settings className="w-4 h-4" />
                {t('media:toolbar.adminPanel')}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-xl shadow-lg z-40 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2 overflow-x-auto">
            {navTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${
                  activeView === tab.id ? 'text-pink-600 border-b-4 border-pink-600 bg-pink-50' : 'text-gray-600 hover:text-pink-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {/* Home */}
          {activeView === 'home' && dashboardData && (
            <motion.div key="home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              {/* Recent Releases */}
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-900" lang={currentLang}>
                    {t('media:sections.latestReleases')}
                  </h2>
                  <button onClick={() => setActiveView('releases')} className="text-pink-600 hover:text-pink-700 font-medium flex items-center gap-2">
                    {t('common:viewAll')} <Icons.ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {dashboardData.recentReleases.map((release) => (
                    <motion.div 
                      key={release.id} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border-l-4 border-pink-500"
                    >
                      {/* Release Header */}
                      <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-5 border-b border-gray-100">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-pink-600 rounded-xl shadow-lg">
                              <Icons.FileText className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="px-3 py-1 bg-pink-600 text-white rounded-full text-xs font-bold uppercase tracking-wide">
                                  {release.category}
                                </span>
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                                  {t('common:new')}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 flex items-center gap-2">
                                <Icons.Clock className="w-3 h-3" />
                                {release.publishDate?.toDate?.()?.toLocaleDateString()} • {t('common:readTime')}
                              </p>
                            </div>
                          </div>
                          <button className="p-2 hover:bg-white rounded-lg transition-colors" title={t('common:share')}>
                            <Icons.Share2 className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      </div>

                      {/* Release Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-pink-600 transition-colors leading-tight">
                          {release.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">{release.content}</p>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                          <button className="flex-1 px-4 py-2 bg-pink-600 text-white font-medium rounded-lg hover:bg-pink-700 transition-colors flex items-center justify-center gap-2">
                            {t('common:readMore')} <Icons.ExternalLink className="w-4 h-4" />
                          </button>
                          <button className="px-4 py-2 border-2 border-pink-600 text-pink-600 font-medium rounded-lg hover:bg-pink-50 transition-colors flex items-center gap-2">
                            <Icons.Download className="w-4 h-4" />
                            {t('common:downloadPDF')}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Featured Stories */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6" lang={currentLang}>
                  {t('media:sections.featuredStories')}
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {dashboardData.featuredStories.map((story) => (
                    <div key={story.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
                      {story.imageUrl && (
                        <div className="h-48 bg-gradient-to-br from-pink-400 to-purple-600 overflow-hidden">
                          <img src={story.imageUrl} alt={story.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                            {story.storyType}
                          </span>
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold">{t('common:featured')}</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{story.title}</h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{story.excerpt}</p>
                        <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">{t('common:readStory')}</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Downloads */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6" lang={currentLang}>
                  {t('media:sections.quickDownloads')}
                </h2>
                <div className="grid md:grid-cols-4 gap-6">
                  {Object.entries(dashboardData.assetsByType).map(([type, count]) => (
                    <button
                      key={type}
                      onClick={() => {
                        setSelectedAssetType(type);
                        setActiveView('assets');
                      }}
                      className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all text-center group"
                    >
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        {type === 'image' && <Icons.Image className="w-8 h-8 text-pink-600" />}
                        {type === 'video' && <Icons.Video className="w-8 h-8 text-purple-600" />}
                        {type === 'document' && <Icons.FileText className="w-8 h-8 text-blue-600" />}
                        {type === 'logo' && <Icons.Award className="w-8 h-8 text-emerald-600" />}
                      </div>
                      <div className="font-bold text-gray-900 capitalize">{t(`media:assets.${type}s`)}</div>
                      <div className="text-sm text-gray-500 mt-1">{count} {t('common:files')}</div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Releases */}
          {activeView === 'releases' && (
            <motion.div key="releases" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <h2 className="text-3xl font-bold text-gray-900 mb-6" lang={currentLang}>
                {t('media:sections.pressReleases')}
              </h2>
              <div className="space-y-6">
                {releases.map((release) => (
                  <div key={release.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
                    <div className="flex items-start gap-6">
                      <div className="p-4 bg-pink-100 rounded-xl">
                        <Icons.FileText className="w-8 h-8 text-pink-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-xs font-medium">
                            {release.category}
                          </span>
                          <span className="text-sm text-gray-500">{release.publishDate?.toDate?.()?.toLocaleDateString()}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">{release.title}</h3>
                        <p className="text-gray-600 mb-4">{release.content}</p>
                        {release.attachments && release.attachments.length > 0 && (
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                            <Icons.Paperclip className="w-4 h-4" />
                            <span>{release.attachments.length} {t('common:attachments')}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-4">
                          <button className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium">
                            {t('common:downloadPDF')}
                          </button>
                          <button className="text-pink-600 hover:text-pink-700 font-medium">{t('common:share')}</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Assets */}
          {activeView === 'assets' && (
            <motion.div key="assets" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              {/* Professional Filter Bar */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2" lang={currentLang}>
                      {t('media:assets.title')}
                    </h2>
                    <p className="text-sm text-gray-600">{t('media:assets.description')}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-pink-600 text-white font-medium rounded-lg hover:bg-pink-700 transition-colors flex items-center gap-2">
                      <Icons.Download className="w-4 h-4" />
                      {t('media:assets.downloadAll')}
                    </button>
                    <button className="px-4 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                      <Icons.Filter className="w-4 h-4" />
                      {t('media:assets.advancedFilters')}
                    </button>
                  </div>
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-3 mt-4">
                  {['all', 'image', 'video', 'document', 'logo'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedAssetType(type)}
                      className={`px-5 py-2 rounded-lg font-medium transition-all ${
                        selectedAssetType === type
                          ? 'bg-pink-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {t(`media:assets.${type}`)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAssets.map((asset) => (
                  <motion.div 
                    key={asset.id} 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all overflow-hidden border border-gray-200"
                  >
                    {/* Asset Preview */}
                    <div className="relative h-56 bg-gradient-to-br from-pink-100 to-purple-100 overflow-hidden">
                      {asset.thumbnailUrl ? (
                        <img src={asset.thumbnailUrl} alt={asset.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Icons.Image className="w-20 h-20 text-pink-400 opacity-50" />
                        </div>
                      )}
                      
                      {/* Overlay Actions */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button className="p-3 bg-white rounded-full hover:bg-pink-600 hover:text-white transition-colors" title={t('common:preview')}>
                          <Icons.Eye className="w-5 h-5" />
                        </button>
                        <button className="p-3 bg-white rounded-full hover:bg-pink-600 hover:text-white transition-colors" title={t('common:download')}>
                          <Icons.Download className="w-5 h-5" />
                        </button>
                        <button className="p-3 bg-white rounded-full hover:bg-pink-600 hover:text-white transition-colors" title={t('common:share')}>
                          <Icons.Share2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Type Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg">
                          {asset.assetType}
                        </span>
                      </div>
                    </div>

                    {/* Asset Info */}
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-pink-100 text-pink-800 rounded-full text-xs font-medium capitalize">
                          {asset.assetType}
                        </span>
                        {asset.resolution && (
                          <span className="text-xs text-gray-500">{asset.resolution}</span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2">{asset.title}</h3>
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">{asset.description}</p>
                      
                      {/* Asset Metadata */}
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3 pb-3 border-b border-gray-100">
                        {asset.resolution && (
                          <div className="flex items-center gap-1">
                            <Icons.Maximize className="w-3 h-3" />
                            {asset.resolution}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Icons.File className="w-3 h-3" />
                          2.4 MB
                        </div>
                      </div>

                      <button
                        onClick={() => handleDownload(asset)}
                        className="w-full px-4 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all text-sm font-bold flex items-center justify-center gap-2"
                      >
                        <Icons.Download className="w-4 h-4" />
                        {t('common:download')}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredAssets.length === 0 && (
                <div className="text-center py-20 text-gray-500 bg-white rounded-2xl shadow-lg border-2 border-dashed border-gray-300">
                  <Icons.Image className="w-20 h-20 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-semibold mb-2">{t('common:noAssets')}</p>
                  <p className="text-sm">{t('common:noAssetsDescription')}</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Stories */}
          {activeView === 'stories' && (
            <motion.div key="stories" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <h2 className="text-3xl font-bold text-gray-900 mb-6" lang={currentLang}>
                {t('media:sections.allStories')}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stories.map((story) => (
                  <div key={story.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
                    {story.imageUrl && (
                      <div className="h-48 bg-gradient-to-br from-pink-400 to-purple-600 overflow-hidden">
                        <img src={story.imageUrl} alt={story.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                          {story.storyType}
                        </span>
                        {story.featured && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold">{t('common:featured')}</span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{story.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-4">{story.excerpt}</p>
                      <div className="text-xs text-gray-500 mb-4">
                        {story.publishDate?.toDate?.()?.toLocaleDateString()}
                      </div>
                      <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
                        {t('common:readStory')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Contacts */}
          {activeView === 'contacts' && dashboardData && (
            <motion.div key="contacts" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <h2 className="text-3xl font-bold text-gray-900 mb-6" lang={currentLang}>
                {t('media:sections.ourTeam')}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {dashboardData.contacts.map((contact) => (
                  <div key={contact.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {contact.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{contact.name}</h3>
                        <div className="text-sm text-gray-600 mb-3">{contact.position}</div>
                        <div className="space-y-2">
                          {contact.email && (
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <Icons.Mail className="w-4 h-4 text-pink-600" />
                              <a href={`mailto:${contact.email}`} className="hover:text-pink-600">{contact.email}</a>
                            </div>
                          )}
                          {contact.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <Icons.Phone className="w-4 h-4 text-pink-600" />
                              <a href={`tel:${contact.phone}`} className="hover:text-pink-600">{contact.phone}</a>
                            </div>
                          )}
                          {contact.department && (
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <Icons.Building className="w-4 h-4 text-pink-600" />
                              {contact.department}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {dashboardData.contacts.length === 0 && (
                <div className="text-center py-16 text-gray-500 bg-white rounded-xl">
                  <Icons.Phone className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>{t('common:noItems')}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MediaPressKit;
