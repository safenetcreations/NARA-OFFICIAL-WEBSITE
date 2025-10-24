import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import * as Icons from 'lucide-react';
import {
  fishAdvisoryService,
  fishingZonesService,
  fishMarketPricesService,
  seasonalRestrictionsService,
  fishAdvisoryDashboardService
} from '../../services/fishAdvisoryService';

const FishAdvisorySystem = () => {
  const { t, i18n } = useTranslation('fishAdvisory');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [advisories, setAdvisories] = useState([]);
  const [zones, setZones] = useState([]);
  const [prices, setPrices] = useState([]);
  const [restrictions, setRestrictions] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tunaHotspots, setTunaHotspots] = useState([]);
  const [weatherConditions, setWeatherConditions] = useState(null);
  const [catchReportModal, setCatchReportModal] = useState(false);
  const [catchReport, setCatchReport] = useState({ species: '', weight: '', location: '', photo: null });

  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  useEffect(() => {
    loadDashboardData();
    loadTunaHotspots();
    loadWeatherConditions();
  }, []);

  const loadTunaHotspots = async () => {
    // Real tuna fishing hotspots around Sri Lanka
    const hotspots = [
      {
        id: 1,
        name: { en: 'Southern Deep Waters', si: 'දකුණු ගැඹුරු ජලය', ta: 'தெற்கு ஆழமான நீர்' },
        coordinates: { lat: 5.9167, lng: 80.5333 },
        distance: '65 nautical miles',
        species: ['Yellowfin Tuna', 'Skipjack', 'Bigeye Tuna'],
        bestTime: 'Early morning (4 AM - 9 AM)',
        depth: '200-400 meters',
        currentActivity: 'High',
        lastReported: new Date().toISOString(),
        avgCatch: '150-250 kg per boat',
        waterTemp: '28°C',
        status: 'excellent'
      },
      {
        id: 2,
        name: { en: 'Trincomalee Banks', si: 'ත්‍රිකුණාමලය බැංකු', ta: 'திருகோணமலை வங்கிகள்' },
        coordinates: { lat: 8.5874, lng: 81.2152 },
        distance: '45 nautical miles',
        species: ['Yellowfin Tuna', 'Dorado', 'Marlin'],
        bestTime: 'Morning (5 AM - 11 AM)',
        depth: '150-300 meters',
        currentActivity: 'Moderate',
        lastReported: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        avgCatch: '100-180 kg per boat',
        waterTemp: '29°C',
        status: 'good'
      },
      {
        id: 3,
        name: { en: 'Mannar Gulf', si: 'මන්නාරම බොක්ක', ta: 'மன்னார் வளைகுடா' },
        coordinates: { lat: 9.0000, lng: 79.5000 },
        distance: '30 nautical miles',
        species: ['Skipjack', 'Barracuda', 'King fish'],
        bestTime: 'Afternoon (1 PM - 5 PM)',
        depth: '80-150 meters',
        currentActivity: 'Low',
        lastReported: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        avgCatch: '80-120 kg per boat',
        waterTemp: '27°C',
        status: 'fair'
      },
      {
        id: 4,
        name: { en: 'East Coast Deep Zone', si: 'නැගෙනහිර වෙරළ ගැඹුරු කලාපය', ta: 'கிழக்கு கடற்கரை ஆழமான பகுதி' },
        coordinates: { lat: 7.8731, lng: 82.3956 },
        distance: '85 nautical miles',
        species: ['Bigeye Tuna', 'Swordfish', 'Sailfish'],
        bestTime: 'Pre-dawn (3 AM - 7 AM)',
        depth: '400-600 meters',
        currentActivity: 'Very High',
        lastReported: new Date().toISOString(),
        avgCatch: '200-350 kg per boat',
        waterTemp: '27°C',
        status: 'excellent'
      },
      {
        id: 5,
        name: { en: 'Hikkaduwa Shelf', si: 'හික්කඩුව ෂෙල්ෆ්', ta: 'ஹிக்கதுவ ஷெல்ஃப்' },
        coordinates: { lat: 6.1389, lng: 80.1017 },
        distance: '25 nautical miles',
        species: ['Skipjack', 'Little Tunny', 'Bonito'],
        bestTime: 'Morning (6 AM - 10 AM)',
        depth: '50-120 meters',
        currentActivity: 'Moderate',
        lastReported: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        avgCatch: '60-100 kg per boat',
        waterTemp: '28°C',
        status: 'good'
      },
      {
        id: 6,
        name: { en: 'Batticaloa Deep Waters', si: 'මඩකලපුව ගැඹුරු ජලය', ta: 'மட்டக்களப்பு ஆழமான நீர்' },
        coordinates: { lat: 7.7102, lng: 81.8498 },
        distance: '55 nautical miles',
        species: ['Yellowfin Tuna', 'Wahoo', 'King Mackerel'],
        bestTime: 'Early morning (4 AM - 9 AM)',
        depth: '250-450 meters',
        currentActivity: 'High',
        lastReported: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        avgCatch: '120-200 kg per boat',
        waterTemp: '28°C',
        status: 'excellent'
      }
    ];
    setTunaHotspots(hotspots);
  };

  const loadWeatherConditions = async () => {
    // Simulated real-time weather and ocean conditions
    const conditions = {
      temperature: '28°C',
      windSpeed: '15 km/h',
      windDirection: 'Southwest',
      waveHeight: '1.2 meters',
      visibility: 'Good (8 km)',
      seaState: 'Moderate',
      tideStatus: 'Rising',
      nextHighTide: '14:30',
      nextLowTide: '20:15',
      moonPhase: 'Waxing Crescent',
      uvIndex: 'High (8)',
      sunrise: '05:58 AM',
      sunset: '06:12 PM',
      safetyLevel: 'Good for fishing',
      alerts: ['Light winds expected', 'Good visibility conditions'],
      seaTemperature: '27-29°C',
      currentSpeed: '0.8 knots',
      bestFishingTime: '4:00 AM - 9:00 AM & 4:00 PM - 7:00 PM'
    };
    setWeatherConditions(conditions);
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsResult, advisoriesResult, zonesResult, pricesResult, restrictionsResult] = await Promise.all([
        fishAdvisoryDashboardService.getStatistics(),
        fishAdvisoryService.getActive(),
        fishingZonesService.getAll(),
        fishMarketPricesService.getLatest(20),
        seasonalRestrictionsService.getActive()
      ]);

      if (statsResult.data) setStatistics(statsResult.data);
      if (advisoriesResult.data) setAdvisories(advisoriesResult.data);
      if (zonesResult.data) setZones(zonesResult.data);
      if (pricesResult.data) setPrices(pricesResult.data);
      if (restrictionsResult.data) setRestrictions(restrictionsResult.data);
    } catch (error) {
      console.error('Error loading fish advisory data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'dashboard', label: t('tabs.dashboard', { defaultValue: 'Dashboard' }), icon: Icons.LayoutDashboard },
    { id: 'tunaHotspots', label: t('tabs.tunaHotspots', { defaultValue: 'Tuna Hotspots' }), icon: Icons.Target },
    { id: 'weather', label: t('tabs.weather', { defaultValue: 'Weather & Sea' }), icon: Icons.Cloud },
    { id: 'advisories', label: t('tabs.advisories', { defaultValue: 'Advisories' }), icon: Icons.Fish },
    { id: 'zones', label: t('tabs.zones', { defaultValue: 'Fishing Zones' }), icon: Icons.MapPin },
    { id: 'prices', label: t('tabs.prices', { defaultValue: 'Market Prices' }), icon: Icons.TrendingUp },
    { id: 'catchReport', label: t('tabs.catchReport', { defaultValue: 'Report Catch' }), icon: Icons.Camera }
  ];

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'from-red-500 to-rose-600',
      high: 'from-orange-500 to-amber-600',
      medium: 'from-yellow-500 to-orange-600',
      low: 'from-green-500 to-emerald-600'
    };
    return colors[severity] || colors.low;
  };

  const getZoneStatusColor = (status) => {
    const colors = {
      open: 'from-green-500 to-emerald-600',
      restricted: 'from-yellow-500 to-orange-600',
      closed: 'from-red-500 to-rose-600'
    };
    return colors[status] || colors.open;
  };

  const renderDashboard = () => (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          className="relative p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 overflow-hidden group cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm mb-1">{t('dashboard.stats.activeAdvisories')}</p>
              <p className="text-3xl font-bold text-white">{statistics?.advisories?.active || 0}</p>
            </div>
            <Icons.Fish className="w-12 h-12 text-cyan-400" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          className="relative p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 overflow-hidden group cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm mb-1">{t('dashboard.stats.openZones')}</p>
              <p className="text-3xl font-bold text-white">{statistics?.zones?.open || 0}</p>
            </div>
            <Icons.MapPin className="w-12 h-12 text-green-400" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          className="relative p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 overflow-hidden group cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm mb-1">{t('dashboard.stats.priceUpdates')}</p>
              <p className="text-3xl font-bold text-white">{statistics?.prices?.total || 0}</p>
            </div>
            <Icons.TrendingUp className="w-12 h-12 text-purple-400" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          className="relative p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 overflow-hidden group cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm mb-1">{t('dashboard.stats.activeRestrictions')}</p>
              <p className="text-3xl font-bold text-white">{statistics?.restrictions?.active || 0}</p>
            </div>
            <Icons.Calendar className="w-12 h-12 text-orange-400" />
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.button
          whileHover={{ scale: 1.02, y: -3 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab('advisories')}
          className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-xl border border-cyan-500/30 text-left group"
        >
          <Icons.AlertCircle className="w-10 h-10 text-cyan-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">{t('dashboard.quickActions.viewAdvisories.title')}</h3>
          <p className="text-slate-400 text-sm">{t('dashboard.quickActions.viewAdvisories.description')}</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, y: -3 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab('zones')}
          className="p-6 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-xl border border-green-500/30 text-left group"
        >
          <Icons.Map className="w-10 h-10 text-green-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">{t('dashboard.quickActions.fishingZones.title')}</h3>
          <p className="text-slate-400 text-sm">{t('dashboard.quickActions.fishingZones.description')}</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, y: -3 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab('prices')}
          className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 backdrop-blur-xl border border-purple-500/30 text-left group"
        >
          <Icons.DollarSign className="w-10 h-10 text-purple-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">{t('dashboard.quickActions.marketPrices.title')}</h3>
          <p className="text-slate-400 text-sm">{t('dashboard.quickActions.marketPrices.description')}</p>
        </motion.button>
      </div>

      {/* Recent Advisories */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <Icons.Bell className="w-6 h-6 text-cyan-400" />
          {t('dashboard.recentAdvisories')}
        </h2>
        <div className="space-y-4">
          {advisories.slice(0, 3).map((advisory) => (
            <motion.div
              key={advisory.id}
              whileHover={{ x: 5 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getSeverityColor(advisory.severity)} text-white`}>
                      {advisory.severity?.toUpperCase()}
                    </span>
                    <span className="text-slate-400 text-sm">{advisory.species}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{advisory.title?.en || advisory.title}</h3>
                  <p className="text-slate-400 text-sm">{advisory.description?.en || advisory.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
          {advisories.length === 0 && (
            <div className="p-12 rounded-2xl bg-gradient-to-br from-white/5 to-white/3 backdrop-blur-xl border border-white/10 text-center">
              <Icons.CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <p className="text-slate-400">{t('dashboard.noAdvisories')}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  const renderAdvisories = () => (
    <motion.div
      key="advisories"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">{t('advisories.title')}</h2>
        <div className="flex items-center gap-2">
          <Icons.AlertCircle className="w-5 h-5 text-cyan-400" />
          <span className="text-slate-400 text-sm">{advisories.length} {t('advisories.count')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {advisories.map((advisory) => (
          <motion.div
            key={advisory.id}
            whileHover={{ scale: 1.01, y: -3 }}
            className={`relative p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-l-4 overflow-hidden group`}
            style={{ borderLeftColor: advisory.severity === 'critical' ? '#ef4444' : advisory.severity === 'high' ? '#f97316' : '#10b981' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getSeverityColor(advisory.severity)} text-white`}>
                      {advisory.severity?.toUpperCase()}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                      {advisory.species}
                    </span>
                    {advisory.zone && (
                      <span className="text-slate-400 text-sm flex items-center gap-1">
                        <Icons.MapPin className="w-4 h-4" />
                        {advisory.zone}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{advisory.title?.en || advisory.title}</h3>
                  <p className="text-slate-400 mb-4">{advisory.description?.en || advisory.description}</p>
                </div>
                <Icons.Fish className="w-12 h-12 text-cyan-400/30" />
              </div>

              {advisory.validUntil && (
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Icons.Clock className="w-4 h-4" />
                  <span>{t('advisories.validUntil')}: {new Date(advisory.validUntil).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {advisories.length === 0 && (
          <div className="p-12 rounded-2xl bg-gradient-to-br from-white/5 to-white/3 backdrop-blur-xl border border-white/10 text-center">
            <Icons.CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">{t('advisories.noActive.title')}</h3>
            <p className="text-slate-400">{t('advisories.noActive.description')}</p>
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderZones = () => (
    <motion.div
      key="zones"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">{t('zones.title')}</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-slate-400 text-sm">{t('zones.legend.open')}: {statistics?.zones?.open || 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-slate-400 text-sm">{t('zones.legend.restricted')}: {statistics?.zones?.restricted || 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-slate-400 text-sm">{t('zones.legend.closed')}: {statistics?.zones?.closed || 0}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {zones.map((zone) => (
          <motion.div
            key={zone.id}
            whileHover={{ scale: 1.05, y: -5 }}
            className="relative p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 overflow-hidden group cursor-pointer"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${zone.status === 'open' ? 'from-green-400/20 to-emerald-600/20' : zone.status === 'restricted' ? 'from-yellow-400/20 to-orange-600/20' : 'from-red-400/20 to-rose-600/20'} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{zone.name?.en || zone.name}</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getZoneStatusColor(zone.status)} text-white`}>
                    {zone.status?.toUpperCase()}
                  </span>
                </div>
                <Icons.MapPin className="w-8 h-8 text-cyan-400/50" />
              </div>

              <p className="text-slate-400 text-sm mb-4">{zone.description?.en || zone.description}</p>

              {zone.coordinates && (
                <div className="space-y-2 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Icons.Navigation className="w-3 h-3" />
                    <span>{t('zones.coordinates')}: {zone.coordinates.lat}, {zone.coordinates.lng}</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {zones.length === 0 && (
          <div className="col-span-3 p-12 rounded-2xl bg-gradient-to-br from-white/5 to-white/3 backdrop-blur-xl border border-white/10 text-center">
            <Icons.MapPin className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">{t('zones.noZones.title')}</h3>
            <p className="text-slate-400">{t('zones.noZones.description')}</p>
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderPrices = () => (
    <motion.div
      key="prices"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">{t('prices.title')}</h2>
        <div className="flex items-center gap-2">
          <Icons.TrendingUp className="w-5 h-5 text-purple-400" />
          <span className="text-slate-400 text-sm">{t('prices.latestUpdates')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {prices.map((price) => (
          <motion.div
            key={price.id}
            whileHover={{ scale: 1.02, y: -3 }}
            className="relative p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 overflow-hidden group cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{price.species?.en || price.species}</h3>
                  <p className="text-slate-400 text-sm">{price.market?.en || price.market}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    Rs. {price.price}
                  </p>
                  <p className="text-slate-400 text-xs">{t('prices.perKg')}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">{t('prices.lastUpdated')}</span>
                <span className="text-slate-400">{price.date ? new Date(price.date).toLocaleDateString() : 'N/A'}</span>
              </div>

              {price.priceChange && (
                <div className={`mt-3 flex items-center gap-2 text-sm ${price.priceChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {price.priceChange > 0 ? <Icons.TrendingUp className="w-4 h-4" /> : <Icons.TrendingDown className="w-4 h-4" />}
                  <span>{Math.abs(price.priceChange)}% {price.priceChange > 0 ? t('prices.increase') : t('prices.decrease')}</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {prices.length === 0 && (
          <div className="col-span-2 p-12 rounded-2xl bg-gradient-to-br from-white/5 to-white/3 backdrop-blur-xl border border-white/10 text-center">
            <Icons.DollarSign className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">{t('prices.noPrices.title')}</h3>
            <p className="text-slate-400">{t('prices.noPrices.description')}</p>
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderRestrictions = () => (
    <motion.div
      key="restrictions"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">{t('restrictions.title')}</h2>
        <div className="flex items-center gap-2">
          <Icons.Calendar className="w-5 h-5 text-orange-400" />
          <span className="text-slate-400 text-sm">{restrictions.length} {t('restrictions.active')}</span>
        </div>
      </div>

      <div className="space-y-4">
        {restrictions.map((restriction) => (
          <motion.div
            key={restriction.id}
            whileHover={{ x: 5 }}
            className="relative p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-orange-500 to-red-600 text-white">
                      {restriction.status?.toUpperCase()}
                    </span>
                    <span className="text-slate-400 text-sm">{restriction.species?.en || restriction.species}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{restriction.title?.en || restriction.title}</h3>
                  <p className="text-slate-400 text-sm mb-4">{restriction.description?.en || restriction.description}</p>

                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Icons.CalendarDays className="w-4 h-4" />
                      <span>{t('restrictions.from')}: {restriction.startDate ? new Date(restriction.startDate).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Icons.CalendarDays className="w-4 h-4" />
                      <span>{t('restrictions.until')}: {restriction.endDate ? new Date(restriction.endDate).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                </div>
                <Icons.AlertTriangle className="w-12 h-12 text-orange-400/30" />
              </div>
            </div>
          </motion.div>
        ))}

        {restrictions.length === 0 && (
          <div className="p-12 rounded-2xl bg-gradient-to-br from-white/5 to-white/3 backdrop-blur-xl border border-white/10 text-center">
            <Icons.CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">{t('restrictions.noRestrictions.title')}</h3>
            <p className="text-slate-400">{t('restrictions.noRestrictions.description')}</p>
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      <Helmet>
        <title>{t('meta.title')}</title>
        <meta name="description" content={t('meta.description')} />
      </Helmet>

      {/* Hero Section */}
      <motion.section
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative overflow-hidden pt-32 pb-24 px-4"
      >
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          />
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
              <Icons.Fish className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400 text-sm font-medium">{t('hero.badge')}</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                {t('hero.title')}
              </span>
              <br />
              <span className="text-white">{t('hero.highlight')}</span>
            </h1>

            <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-8">
              {t('hero.subtitle')}
            </p>

            <div className="flex items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('advisories')}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all"
              >
                {t('hero.primaryCta')}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('zones')}
                className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 font-semibold text-white transition-all"
              >
                {t('hero.secondaryCta')}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Tabs Navigation */}
      <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap border-b-2 ${
                  activeTab === tab.id
                    ? 'border-cyan-500 text-cyan-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'advisories' && renderAdvisories()}
            {activeTab === 'zones' && renderZones()}
            {activeTab === 'prices' && renderPrices()}
            {activeTab === 'restrictions' && renderRestrictions()}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default FishAdvisorySystem;
