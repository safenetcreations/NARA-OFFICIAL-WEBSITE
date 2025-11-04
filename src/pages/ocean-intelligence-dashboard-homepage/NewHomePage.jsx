import React, { useState, useEffect, useRef, lazy, Suspense, useMemo, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { 
  Fish, Thermometer, Shield, Satellite, Award, Users, Globe2,
  Leaf, Anchor, Droplets, Waves, Compass, Map, TrendingUp, BarChart3, Building2,
  FlaskConical, Info, Database, GraduationCap, Microscope, Ship, ShoppingBag,
  BookOpen, AlertTriangle, TreePine, Handshake, Calendar, Flag, Search,
  ArrowRight, LayoutGrid, BookMarked, RadioTower, Navigation, FileText,
  Layers, Send, MessageCircle, UserCheck, Sparkles
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AppImage from '../../components/AppImage';
import { useOceanData } from '../../hooks/useOceanData';
import DIVISIONS_CONFIG from '../../data/divisionsConfig';
import { getLocalDivisionImages } from '../../utils/localImageStorage';
import { getPrimaryDivisionImage } from '../../services/divisionImagesService';

// Lazy load heavy components
const SriLankaEEZMap = lazy(() => import('../../components/SriLankaEEZMap'));
const APIIntegrationShowcase = lazy(() => import('../../components/sections/APIIntegrationShowcase'));
const LibraryBooksCarousel = lazy(() => import('../../components/library/LibraryBooksCarousel'));
const GovFooter = lazy(() => import('../../components/compliance/GovFooter'));
const UnifiedServicesHub = lazy(() => import('../../components/UnifiedServicesHub'));
const LiveOceanDataShowcase = lazy(() => import('../../components/LiveOceanDataShowcase'));

const NewHomePage = () => {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [divisionHeroImages, setDivisionHeroImages] = useState({});
  const { scrollY } = useScroll();
  const heroRef = useRef(null);
  const { t, i18n } = useTranslation(['home', 'common']);

  const { oceanData, refreshData } = useOceanData();
  const opacity = useTransform(scrollY, [0, 300], [1, 0.85]);

  const heroTitle = t('hero.title', { ns: 'home', returnObjects: true });
  const heroStats = t('hero.stats', { ns: 'home', returnObjects: true });
  const heroOverview = t('hero.overview', { ns: 'home', returnObjects: true });
  const missionContent = t('mission', { ns: 'home', returnObjects: true });
  const researchContent = t('research', { ns: 'home', returnObjects: true });
  const divisionsContent = t('divisions', { ns: 'home', returnObjects: true });
  const highlightsContent = t('highlights', { ns: 'home', returnObjects: true });
  const milestonesContent = t('milestones', { ns: 'home', returnObjects: true });
  const newsContent = t('news', { ns: 'home', returnObjects: true });
  const integrationContent = t('integration', { ns: 'home', returnObjects: true });
  const missionControlContent = t('missionControl', { ns: 'home', returnObjects: true });
  const essentialServicesContent = t('essentialServices', { ns: 'home', returnObjects: true });

  // Function to load division hero images from Firebase Storage
  const loadDivisionHeroImages = useCallback(async () => {
    console.log('%c🎨 LOADING DIVISION HERO IMAGES FROM FIREBASE', 'background: #3b82f6; color: white; padding: 8px; font-size: 14px; font-weight: bold;');
    console.log('━'.repeat(80));

    const loadedImages = {};
    let totalImagesLoaded = 0;

    // Load images in parallel for all divisions
    const loadPromises = DIVISIONS_CONFIG.map(async (division) => {
      console.log(`\n🔍 Division: ${division.name.en}`);
      console.log(`   ID: ${division.id}`);

      try {
        // Try Firebase first
        const result = await getPrimaryDivisionImage(division.id);
        
        console.log(`   Firebase response:`, result);
        
        if (result.success && result.image?.url) {
          loadedImages[division.id] = result.image.url;
          totalImagesLoaded++;
          console.log(`   ✅ Loaded from Firebase Storage`);
          console.log(`   📸 URL: ${result.image.url.substring(0, 100)}...`);
          return;
        } else if (result.success === false) {
          console.log(`   ℹ️  No Firebase image: ${result.message || result.error || 'Not found'}`);
        }
      } catch (error) {
        console.log(`   ⚠️  Firebase error: ${error.message}`);
        console.error(error);
      }

      // Fallback to localStorage (for backward compatibility)
      const localImages = getLocalDivisionImages(division.id);
      if (localImages && localImages.length > 0) {
        loadedImages[division.id] = localImages[0];
        totalImagesLoaded++;
        console.log(`   ✅ Loaded from localStorage (fallback)`);
        console.log(`   📸 Preview: ${localImages[0].substring(0, 100)}...`);
        return;
      }

      console.log(`   ⚠️  No custom images - will use default: ${division.heroImage?.substring(0, 100) || 'Unsplash fallback'}...`);
    });

    await Promise.all(loadPromises);

    console.log('\n━'.repeat(80));
    console.log(`%c📊 SUMMARY: Loaded ${totalImagesLoaded} custom hero images for ${DIVISIONS_CONFIG.length} divisions`, 'background: #10b981; color: white; padding: 8px; font-size: 14px; font-weight: bold;');
    console.log('━'.repeat(80));

    setDivisionHeroImages(loadedImages);

    // Log final state
    console.log('\n🎯 Final divisionHeroImages state:', Object.keys(loadedImages).length, 'divisions with custom images');
    console.log('Division IDs with custom images:', Object.keys(loadedImages));
  }, []);

  // Load images on mount
  useEffect(() => {
    loadDivisionHeroImages();
  }, [loadDivisionHeroImages]);

  // Listen for localStorage changes (when images are uploaded in admin)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key && e.key.startsWith('division_images_')) {
        console.log('🔄 Division images updated in localStorage, reloading...');
        loadDivisionHeroImages();
      }
    };

    // Listen for storage events from other tabs
    window.addEventListener('storage', handleStorageChange);

    // Listen for custom event in same tab
    window.addEventListener('divisionImagesUpdated', loadDivisionHeroImages);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('divisionImagesUpdated', loadDivisionHeroImages);
    };
  }, [loadDivisionHeroImages]);

  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
      setLastUpdate(new Date());
    }, 300000);
    return () => clearInterval(interval);
  }, [refreshData]);

  const researchAreasConfig = useMemo(() => [
    {
      key: 'marineBiodiversity',
      icon: Fish,
      color: 'from-sky-400 to-sky-500',
      statValue: oceanData?.speciesCount,
      trend: oceanData?.speciesTrend || 'stable'
    },
    {
      key: 'climateResearch',
      icon: Thermometer,
      color: 'from-purple-500 to-pink-500',
      statValue: oceanData?.temperature,
      trend: oceanData?.tempTrend || 'warming'
    },
    {
      key: 'conservation',
      icon: Shield,
      color: 'from-green-500 to-teal-500',
      statValue: oceanData?.conservationRate,
      trend: oceanData?.conservationTrend || 'improving'
    },
    {
      key: 'satelliteMonitoring',
      icon: Satellite,
      color: 'from-orange-500 to-red-500',
      statValue: oceanData?.satelliteObservations,
      trend: oceanData?.satelliteTrend || 'active'
    }
  ], [oceanData]);

  const researchAreas = useMemo(() => researchAreasConfig.map((config) => {
    const copy = researchContent?.areas?.[config.key] || {};
    return {
      key: config.key,
      icon: config.icon,
      color: config.color,
      trend: config.trend,
      live: true,
      title: copy.title || '',
      description: copy.description || '',
      stat: config.statValue || copy.statFallback || '',
      unit: copy.unit || ''
    };
  }), [researchAreasConfig, researchContent]);

  const missionStatsIcons = useMemo(() => [Award, Users, Globe2], []);

  const divisionsConfig = [
    { icon: Icons.Leaf, gradient: 'from-green-500 to-emerald-500', slug: 'environmental-studies-division' },
    { icon: Icons.Anchor, gradient: 'from-indigo-500 to-purple-500', slug: 'fishing-technology-division' },
    { icon: Icons.Droplets, gradient: 'from-sky-400 to-sky-500', slug: 'inland-aquatic-aquaculture-division' },
    { icon: Icons.Award, gradient: 'from-purple-500 to-pink-500', slug: 'post-harvest-technology-division' },
    { icon: Icons.Waves, gradient: 'from-teal-500 to-emerald-500', slug: 'marine-biological-division' },
    { icon: Icons.Compass, gradient: 'from-blue-500 to-indigo-500', slug: 'oceanography-marine-sciences-division' },
    { icon: Icons.Map, gradient: 'from-sky-500 to-blue-500', slug: 'hydrographic-division' },
    { icon: Icons.TrendingUp, gradient: 'from-orange-500 to-red-500', slug: 'socio-economic-marketing-division' },
    { icon: Icons.BarChart3, gradient: 'from-violet-500 to-purple-500', slug: 'monitoring-evaluation-division' },
    { icon: Icons.Building2, gradient: 'from-emerald-500 to-green-500', slug: 'aquaculture-research-center' }
  ];

  const highlightCards = Object.entries(highlightsContent?.cards || {}).map(([key, item]) => {
    const iconMap = {
      programs: Icons.Microscope,
      observatories: Icons.Satellite,
      dataAssets: Icons.Database,
      partners: Icons.Users
    };
    const IconComponent = iconMap[key] || Icons.Sparkles;
    return {
      key,
      IconComponent,
      label: item.label,
      value: item.value,
      description: item.description
    };
  });

  const essentialServicesCards = [
    {
      key: 'fishAdvisory',
      link: '/fish-advisory-system',
      cornerClass: 'bg-sky-500/10',
      borderHover: 'hover:border-sky-500/50',
      shadowHover: 'hover:shadow-sky-500/10',
      headingHover: 'group-hover:text-sky-400',
      ctaClass: 'text-sky-400'
    },
    {
      key: 'labTesting',
      link: '/lab-results',
      cornerClass: 'bg-purple-500/10',
      borderHover: 'hover:border-purple-500/50',
      shadowHover: 'hover:shadow-purple-500/10',
      headingHover: 'group-hover:text-purple-400',
      ctaClass: 'text-purple-400'
    },
    {
      key: 'marineIncident',
      link: '/marine-incident-portal',
      cornerClass: 'bg-red-500/10',
      borderHover: 'hover:border-red-500/50',
      shadowHover: 'hover:shadow-red-500/10',
      headingHover: 'group-hover:text-red-400',
      ctaClass: 'text-red-400'
    },
    {
      key: 'openData',
      link: '/open-data-portal',
      cornerClass: 'bg-green-500/10',
      borderHover: 'hover:border-green-500/50',
      shadowHover: 'hover:shadow-green-500/10',
      headingHover: 'group-hover:text-green-400',
      ctaClass: 'text-green-400'
    },
    {
      key: 'exportIntelligence',
      link: '/export-market-intelligence',
      cornerClass: 'bg-orange-500/10',
      borderHover: 'hover:border-orange-500/50',
      shadowHover: 'hover:shadow-orange-500/10',
      headingHover: 'group-hover:text-orange-400',
      ctaClass: 'text-orange-400'
    },
    {
      key: 'publicConsultation',
      link: '/public-consultation',
      cornerClass: 'bg-blue-500/10',
      borderHover: 'hover:border-blue-500/50',
      shadowHover: 'hover:shadow-blue-500/10',
      headingHover: 'group-hover:text-blue-400',
      ctaClass: 'text-blue-400'
    }
  ];

  const milestonesIcons = [Icons.Flag, Icons.Ship, Icons.Waves, Icons.TreePine];
  const milestonesGradients = [
    'from-sky-400 to-sky-500',
    'from-blue-500 to-purple-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-teal-500'
  ];

  const achievementsIcons = [Icons.Search, Icons.Shield, Icons.Globe2, Icons.GraduationCap];
  const achievementsGradients = [
    'from-sky-500 to-blue-500',
    'from-green-500 to-teal-500',
    'from-purple-500 to-pink-500',
    'from-orange-500 to-amber-500'
  ];

  const newsIcons = [Icons.TreePine, Icons.Handshake, Icons.Calendar];
  const newsGradients = [
    'from-green-500 to-teal-500',
    'from-purple-500 to-pink-500',
    'from-sky-500 to-sky-400'
  ];

  const livePointColors = ['bg-green-500', 'bg-blue-500', 'bg-yellow-500'];

  const knowledgeTilesConfig = [
    {
      key: 'library',
      icon: Icons.BookOpen,
      link: '/library'
    },
    {
      key: 'advisory',
      icon: Icons.AlertTriangle,
      link: '/fish-advisory-system'
    },
    {
      key: 'datasets',
      icon: Icons.Database,
      link: '/open-data-portal'
    }
  ];

  const knowledgeTiles = knowledgeTilesConfig.map(({ key, icon, link }) => {
    const copy =
      t(`knowledge.tiles.${key}`, {
        ns: 'home',
        returnObjects: true,
        defaultValue: {}
      }) || {};

    return {
      key,
      icon,
      link,
      title: copy.title || t('home:knowledge.defaultTitle', { defaultValue: 'Knowledge Resource' }),
      description:
        copy.description ||
        t('home:knowledge.defaultDescription', {
          defaultValue: 'Discover curated resources supporting Sri Lanka’s aquatic stewardship.'
        }),
      cta: copy.cta || t('home:knowledge.defaultCta', { defaultValue: 'Explore' })
    };
  });

  return (
    <div className="bg-black text-white overflow-hidden">
      <div className="fixed top-16 md:top-20 right-2 md:right-4 z-50 glass" style={{ padding: '6px 10px', borderRadius: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>
            {t('hero.liveDataLabel', { ns: 'home' })}: {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
      </div>

      <main>
        <section
          ref={heroRef}
          className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-[#001238] to-[#001F54]"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-sky-400/15 blur-3xl" />
            <div className="absolute top-1/2 right-0 h-[420px] w-[420px] rounded-full bg-blue-500/20 blur-3xl" />
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.12) 1px, transparent 0)',
                backgroundSize: '60px 60px'
              }}
            />
          </div>

          <div className="relative z-10 w-full">
            <motion.div
              style={{ opacity }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-24 lg:pt-28 pb-8 md:pb-12 lg:pb-14"
            >
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] items-center">
                <motion.div
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="space-y-4 md:space-y-3"
                >
                  <div className="space-y-2">
                    <div className="relative h-12 sm:h-16 md:h-20 flex items-center justify-center">
                      <div className="text-center text-xl sm:text-2xl md:text-4xl font-bold welcome-text-si absolute inset-0 flex items-center justify-center">
                        <span className="typewriter-wrapper bg-gradient-to-r from-sky-300 via-blue-400 to-sky-300 bg-clip-text text-transparent">
                          {t('hero.welcome.sinhala', { ns: 'home', defaultValue: 'NARA වෙත සාදරයෙන් පිළිගනිමු' })}
                        </span>
                      </div>
                      <div className="text-center text-xl sm:text-2xl md:text-4xl font-bold welcome-text-ta opacity-0 absolute inset-0 flex items-center justify-center">
                        <span className="typewriter-wrapper bg-gradient-to-r from-sky-300 via-blue-400 to-sky-300 bg-clip-text text-transparent">
                          {t('hero.welcome.tamil', { ns: 'home', defaultValue: 'NARA க்கு வரவேற்கிறோம்' })}
                        </span>
                      </div>
                      <div className="text-center text-xl sm:text-2xl md:text-4xl font-bold welcome-text-en opacity-0 absolute inset-0 flex items-center justify-center">
                        <span className="typewriter-wrapper bg-gradient-to-r from-sky-300 via-blue-400 to-sky-300 bg-clip-text text-transparent">
                          {t('hero.welcome.english', { ns: 'home', defaultValue: 'Welcome to NARA' })}
                        </span>
                      </div>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-space leading-tight">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-logo-blue-light via-logo-blue to-blue-500">
                        {heroTitle?.lineOne || 'Pioneering Aquatic'}
                      </span>
                      <br />
                      <span className="text-white">{heroTitle?.lineTwo || 'Stewardship in Sri Lanka'}</span>
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg text-sky-300/90 font-semibold">
                      {heroOverview?.tagline || "Sri Lanka's Premier Marine & Freshwater Research Agency"}
                    </p>
                  </div>

                  <p className="text-sm sm:text-base text-slate-300/90 max-w-2xl leading-relaxed">
                    {heroOverview?.description ||
                      "Advancing scientific research and innovation in marine and aquatic resources to protect ecosystems, support sustainable fisheries, and drive the nation's blue economy."}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-sky-400" />
                      <span>{heroOverview?.since || 'Since 1981'}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-sky-400" />
                      <span>{heroOverview?.divisions || '9 Research Divisions'}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-sky-400" />
                      <span>{heroOverview?.scientists || '100+ Scientists'}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <Link
                      to="/research-excellence-portal"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-logo-blue-light via-logo-blue to-logo-blue-light px-5 py-3.5 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold text-white shadow-lg shadow-logo-blue/30 transition hover:shadow-logo-blue/50 active:scale-95"
                    >
                      <Microscope className="h-4 w-4" />
                      {heroOverview?.primaryCta || 'Explore Research'}
                    </Link>
                    <Link
                      to="/contact-us"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-sky-400/40 px-5 py-3.5 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold text-sky-200 transition hover:border-sky-400 hover:bg-sky-500/10 active:scale-95"
                    >
                    <Send className="h-4 w-4" />
                    {heroOverview?.secondaryCta ||
                      t('hero.secondaryCta', {
                        ns: 'home',
                        defaultValue: 'Connect with our mission team'
                      })}
                    </Link>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 80, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="relative"
                >
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-sky-400/20 via-transparent to-sky-500/10 blur-3xl" />
                  <div className="relative rounded-3xl border border-sky-400/20 bg-slate-950/70 p-3 sm:p-4 backdrop-blur-2xl shadow-[0_25px_80px_-40px_rgba(0,191,255,0.6)]">
                    <motion.div
                      className="relative mx-auto h-[420px] sm:h-[480px] md:h-[540px] w-full max-w-[380px]"
                      initial={{ scale: 0.92, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.9, delay: 0.2 }}
                    >
                      <div className="relative h-full w-full overflow-hidden rounded-3xl">
                        <Suspense fallback={
                          <div className="h-full w-full flex items-center justify-center bg-slate-900">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-400"></div>
                          </div>
                        }>
                          <SriLankaEEZMap className="h-full w-full" showMarkers />
                        </Suspense>
                        <div className="absolute top-4 right-4 z-10">
                          <img
                            src="/assets/images/sri-lanka-flag.png"
                            alt="Sri Lanka Flag"
                            className="h-12 w-20 rounded border-2 border-white/20 object-cover shadow-lg"
                          />
                        </div>
                      </div>

                      <motion.div
                        className="pointer-events-none absolute inset-0 flex items-center justify-center"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <motion.div
                          className="flex h-28 w-28 items-center justify-center rounded-full border-2 bg-slate-900/90 shadow-lg backdrop-blur-md"
                          animate={{
                            borderColor: [
                              'rgba(34,211,238,0.4)',
                              'rgba(6,182,212,0.8)',
                              'rgba(34,211,238,0.4)'
                            ],
                            boxShadow: [
                              '0 0 20px rgba(34,211,238,0.3)',
                              '0 0 40px rgba(6,182,212,0.6)',
                              '0 0 20px rgba(34,211,238,0.3)'
                            ]
                          }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        >
                          <AppImage src="/assets/nara-logo.png" alt="NARA crest" className="h-20 w-20 object-contain" />
                        </motion.div>
                      </motion.div>
                    </motion.div>

                    <div className="mt-3 sm:mt-4 rounded-2xl border border-sky-400/10 bg-slate-950/80 p-2">
                      <div className="mb-1.5">
                        <p className="text-center text-xs sm:text-sm md:text-base font-semibold text-sparkle leading-tight">
                          National Aquatic Resources Research & Development Agency
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {(heroStats?.grid || []).map((item, index) => (
                          <div key={item?.label || index} className="rounded-xl bg-slate-900/80 p-2 text-left">
                            <p className="text-[11px] uppercase tracking-wide text-slate-500">{item?.label}</p>
                            <p className="text-base font-semibold text-white">{item?.value}</p>
                            <p className="text-[11px] text-sky-300/80">{item?.status}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>


        <section className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-12 sm:py-16 md:py-20 px-4 md:px-8 lg:px-12">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-sky-400/15 blur-3xl" />
            <div className="absolute bottom-0 left-24 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
          </div>

          <div className="relative max-w-[1600px] mx-auto space-y-16">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Left Tile - Mission Info */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 md:p-10 backdrop-blur h-full flex flex-col">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-400/15 border border-sky-400/20">
                    <AppImage
                      src="/assets/nara-logo.png"
                      alt="NARA crest"
                      className="h-10 w-10 object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-sky-200/80">
                      {t('mission.badge', {
                        ns: 'home',
                        defaultValue: 'National Aquatic Research Authority'
                      })}
                    </p>
                    <p className="text-[11px] uppercase tracking-[0.4em] text-slate-400">
                      {t('hero.overview.sovereignWaters.label', {
                        ns: 'home',
                        defaultValue: 'Sovereign Waters'
                      })}
                    </p>
                  </div>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white font-space mb-4">
                  {missionContent?.heading}
                </h2>
                <p className="text-base text-slate-300/90 leading-relaxed mb-6">
                  {missionContent?.description}
                </p>

                <div className="grid gap-4 sm:grid-cols-2 mb-6">
                  <div className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                    <Compass className="h-5 w-5 text-sky-300 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {t('mission.focusResearch', {
                        ns: 'home',
                        defaultValue:
                          'Coastal, deep sea, and inland water programmes powering national policy and the blue economy.'
                      })}
                    </p>
                  </div>
                  <div className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                    <UserCheck className="h-5 w-5 text-sky-300 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {t('mission.focusCommunity', {
                        ns: 'home',
                        defaultValue:
                          'Alliances with fishing communities, academia, and defence agencies safeguard livelihoods and maritime security.'
                      })}
                    </p>
                  </div>
                </div>

                <div className="mt-auto flex flex-col sm:flex-row sm:items-center gap-3">
                  <Link
                    to="/about-nara-our-story"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-logo-blue px-5 py-3 text-sm font-semibold text-white transition hover:bg-logo-blue-light"
                  >
                    <BookOpen className="h-4 w-4" />
                    {t('mission.ctaLearn', { ns: 'home', defaultValue: 'About NARA' })}
                  </Link>
                  <Link
                    to="/contact-us"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-sky-400/40 px-5 py-3 text-sm font-semibold text-sky-200 transition hover:border-sky-400 hover:bg-sky-500/10"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {t('mission.ctaConsult', { ns: 'home', defaultValue: 'Request a briefing' })}
                  </Link>
                </div>
              </div>

              {/* Right Tile - Stats */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 md:p-10 backdrop-blur h-full flex flex-col justify-center">
                <div className="space-y-8">
                  {(missionContent?.stats || []).map((stat, index) => {
                    const StatIcon = missionStatsIcons[index] || Icons.Award;
                    const gradient = ['from-sky-500 to-blue-500', 'from-blue-500 to-purple-500', 'from-purple-500 to-pink-500'][index];
                    const colorClass = ['text-sky-300', 'text-blue-300', 'text-purple-300'][index] || 'text-sky-300';
                    return (
                      <div
                        key={stat?.label || index}
                        className="flex items-center gap-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur"
                      >
                        <div className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r ${gradient || 'from-sky-500 to-blue-500'}`}>
                          <StatIcon className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className={`text-4xl font-bold ${colorClass} mb-1`}>{stat?.value}</div>
                          <div className="text-sm uppercase tracking-wide text-slate-400">{stat?.label}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* COMPLETELY NEW RESEARCH DIVISIONS SHOWCASE */}
            <div className="relative">
              {/* Premium Section Header */}
              <div className="text-center mb-20">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="space-y-6"
                >
                  <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-logo-blue/20 via-logo-blue/10 to-transparent border border-logo-blue/30 backdrop-blur-xl">
                    <LayoutGrid className="h-6 w-6 text-logo-blue" />
                    <span className="text-sm font-bold uppercase tracking-[0.3em] text-logo-blue-light">
                      {t('divisions.badge', { ns: 'home', defaultValue: 'Research Excellence Centers' })}
                    </span>
                  </div>
                  
                  <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-logo-blue-light to-logo-blue">
                      {t('divisions.heading', { ns: 'home', defaultValue: 'Our Research Divisions' })}
                    </span>
                  </h2>
                  
                  <p className="text-xl md:text-2xl text-slate-300/90 max-w-4xl mx-auto leading-relaxed">
                    {t('divisions.subheading', {
                      ns: 'home',
                      defaultValue: '10 specialized divisions driving breakthrough discoveries in marine and freshwater science'
                    })}
                  </p>
                </motion.div>
              </div>

              {/* FEATURED AUTO-ROTATING CAROUSEL */}
              <div className="relative overflow-hidden py-12">
                {/* Gradient Edges */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />
                
                {/* Scrolling Container */}
                <div className="flex gap-8 animate-scroll-smooth">
                  {[...divisionsConfig, ...divisionsConfig].map((config, idx) => {
                    const index = idx % divisionsConfig.length;
                    const realDivision = DIVISIONS_CONFIG[index];
                    if (!realDivision) return null;

                    // Get hero image - Priority: Firebase -> Config Default -> Unsplash
                    let heroImage;
                    if (divisionHeroImages[realDivision?.id]) {
                      // From Firebase Storage
                      heroImage = divisionHeroImages[realDivision.id];
                    } else if (realDivision?.heroImage) {
                      // From divisions config default
                      heroImage = realDivision.heroImage;
                    } else {
                      // Fallback to Unsplash
                      heroImage = 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=85';
                    }

                    const divisionName = realDivision.name[i18n.language] || realDivision.name.en;
                    const IconComponent = config.icon;
                    
                    return (
                      <Link
                        key={`division-featured-${idx}`}
                        to={`/divisions/${config.slug}`}
                        className="group flex-shrink-0 w-[600px]"
                      >
                        <div className="relative h-[400px] rounded-3xl overflow-hidden bg-slate-900/50 border border-slate-700/30 backdrop-blur-xl transition-all duration-700 hover:scale-105 hover:border-logo-blue/50 hover:shadow-2xl hover:shadow-logo-blue/30">
                          {/* Background Image with Overlay */}
                          <div className="absolute inset-0">
                            <img
                              src={heroImage}
                              alt={divisionName}
                              className="w-full h-full object-cover opacity-70 group-hover:opacity-85 group-hover:scale-110 transition-all duration-700"
                              loading="lazy"
                            />
                            {/* Multi-layer Gradients - Less dark for better visibility */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-transparent to-slate-950/30" />
                            <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-20 mix-blend-overlay group-hover:opacity-35 transition-opacity duration-700`} />
                          </div>

                          {/* Animated Glow Effect */}
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-logo-blue via-blue-500 to-logo-blue opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-700" />

                          {/* Content - Centered Large Title */}
                          <div className="relative h-full flex flex-col justify-center items-center p-10 text-center">
                            {/* GIANT Shining Title */}
                            <div className="space-y-6">
                              <h3 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-logo-blue-light to-logo-blue animate-pulse-slow drop-shadow-[0_0_30px_rgba(0,191,255,0.5)]">
                                  {divisionName}
                                </span>
                              </h3>
                              
                              {/* CTA Line with Animated Arrow */}
                              <div className="flex items-center justify-center gap-3">
                                <div className="h-1 w-16 bg-gradient-to-r from-transparent via-logo-blue to-transparent rounded-full animate-pulse" />
                                <span className="text-base font-bold uppercase tracking-widest text-logo-blue-light drop-shadow-[0_0_10px_rgba(135,206,235,0.8)]">
                                  {t('common:explore', { defaultValue: 'Explore' })}
                                </span>
                                <ArrowRight className="h-6 w-6 text-logo-blue-light drop-shadow-[0_0_10px_rgba(135,206,235,0.8)] group-hover:translate-x-2 transition-transform duration-300 animate-pulse" />
                                <div className="h-1 w-16 bg-gradient-to-r from-logo-blue via-transparent to-transparent rounded-full animate-pulse" />
                              </div>
                            </div>
                          </div>

                          {/* Shimmer Effect */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500" />
                          </div>
                          
                          {/* Glowing Border Effect */}
                          <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-logo-blue/30 transition-all duration-700" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* View All CTA - Enhanced */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="mt-16 text-center"
              >
                <Link
                  to="/divisions"
                  className="group inline-flex items-center gap-4 px-10 py-5 rounded-2xl bg-gradient-to-r from-logo-blue via-logo-blue-light to-logo-blue text-white text-lg font-bold shadow-2xl shadow-logo-blue/40 transition-all duration-500 hover:shadow-logo-blue/60 hover:scale-105 hover:-translate-y-1"
                >
                  <Microscope className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                  <span>{t('mission.viewAllDivisions', { ns: 'home', defaultValue: 'Explore All 10 Research Divisions' })}</span>
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Essential Services Section - Modern Redesign */}
        <section className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-20 md:py-28 px-4 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-10 w-96 h-96 bg-logo-blue/10 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          </div>

          <div className="max-w-7xl mx-auto relative">
            {/* Section Header */}
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <span className="inline-block px-4 py-2 mb-6 text-sm font-semibold tracking-wider uppercase bg-logo-blue/10 text-logo-blue border border-logo-blue/20 rounded-full">
                  Core Services
                </span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-logo-blue-light via-logo-blue to-white mb-6">
                  {essentialServicesContent?.heading}
                </h2>
                <p className="text-lg md:text-xl text-slate-300/90 max-w-3xl mx-auto leading-relaxed">
                  {essentialServicesContent?.subheading}
                </p>
              </motion.div>
            </div>

            {/* Services Grid - Modern Card Design */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {essentialServicesCards.map((card, index) => {
                const content = essentialServicesContent?.cards?.[card.key] || {};
                
                return (
                  <motion.div
                    key={card.key}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.15 }}
                  >
                    <Link to={card.link} className="group block h-full">
                      <div className="relative h-full p-8 rounded-3xl bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/90 backdrop-blur-xl border border-slate-700/30 overflow-hidden transition-all duration-500 hover:scale-105 hover:border-logo-blue/50 hover:shadow-2xl hover:shadow-logo-blue/20">
                        {/* Animated Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-logo-blue/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        {/* Floating Icon Circle */}
                        <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-logo-blue/20 to-blue-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                        
                        <div className="relative z-10">
                          {/* Title */}
                          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-logo-blue-light transition-colors duration-300">
                            {content.title}
                          </h3>

                          {/* Description */}
                          <p className="text-slate-400 leading-relaxed mb-6 line-clamp-3">
                            {content.description}
                          </p>

                          {/* CTA Arrow */}
                          <div className="flex items-center gap-3 text-logo-blue font-semibold">
                            <span className="group-hover:translate-x-1 transition-transform duration-300">{content.cta}</span>
                            <div className="w-10 h-10 rounded-full bg-logo-blue/10 border border-logo-blue/30 flex items-center justify-center group-hover:bg-logo-blue group-hover:border-logo-blue transition-all duration-300">
                              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 group-hover:text-white transition-all duration-300" />
                            </div>
                          </div>
                        </div>

                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-logo-blue/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Milestones Section - Moved here after Essential Services */}
        <section className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12 sm:py-16 md:py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-white font-space">
                {milestonesContent?.heading}
              </h2>
              <p className="text-base md:text-lg text-slate-300 max-w-3xl mx-auto">
                {milestonesContent?.subheading}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
              {milestonesContent?.timeline?.map((milestone, index) => {
                const IconComponent = milestonesIcons[index] || Icons.Flag;
                const gradient = milestonesGradients[index] || 'from-sky-500 to-blue-500';
                const colorClass = ['text-sky-400', 'text-blue-400', 'text-purple-400', 'text-green-400'][index] || 'text-sky-400';
                return (
                  <div
                    key={`${milestone?.title}-${index}`}
                    className="rounded-2xl border border-slate-700 bg-slate-900/60 p-5 sm:p-6 transition hover:border-sky-500/40"
                  >
                    <span className={`text-4xl font-bold ${colorClass} font-mono mb-4 block`}>{milestone?.year}</span>
                    <h3 className="text-2xl font-bold text-white mb-3 font-mono tracking-tight">{milestone?.title}</h3>
                    <p className="text-base text-slate-300 leading-relaxed">{milestone?.description}</p>
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {milestonesContent?.achievements?.map((achievement, index) => {
                const IconComponent = achievementsIcons[index] || Icons.Award;
                const gradient = achievementsGradients[index] || 'from-sky-500 to-blue-500';
                const colorClass = ['text-sky-400', 'text-green-400', 'text-purple-400', 'text-orange-400'][index] || 'text-sky-400';
                return (
                  <div key={`${achievement?.label}-${index}`} className="rounded-2xl border border-slate-700 bg-slate-900/60 p-6 text-center">
                    <div className={`text-5xl font-bold ${colorClass} mb-3 font-mono`}>{achievement?.number}</div>
                    <p className="text-sm uppercase tracking-wide text-slate-400 font-mono">{achievement?.label}</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-12 text-center">
              <Link
                to="/about-nara-our-story"
                className="inline-flex items-center gap-2 rounded-xl bg-logo-blue px-5 py-3.5 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold text-white transition hover:bg-logo-blue-light active:scale-95"
              >
                <Icons.BookOpen className="h-5 w-5" />
                {milestonesContent?.cta}
                <Icons.ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        <Suspense fallback={
          <div className="py-20 flex items-center justify-center bg-slate-950">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
          </div>
        }>
          <UnifiedServicesHub />
        </Suspense>

        <section className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-12 sm:py-16 md:py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-6 backdrop-blur">
              <LibraryBooksCarousel />
            </div>
          </div>
        </section>

        <section className="relative bg-gradient-to-br from-cyan-900/20 via-slate-900 to-blue-900/20 py-12 sm:py-16 md:py-20 px-4">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(6,182,212,0.2),_transparent_60%)] opacity-40" />
          <div className="relative max-w-5xl mx-auto rounded-3xl border border-sky-500/30 bg-slate-950/80 p-6 sm:p-10 md:p-14 text-center backdrop-blur">
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-sky-500/40 bg-sky-500/10 px-5 py-2 text-xs uppercase tracking-[0.3em] text-sky-200">
              <Icons.RadioTower className="h-4 w-4" />
              {missionControlContent?.badge || 'National Mission Control'}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white font-space mb-4">
              {missionControlContent?.title || "Safeguarding Sri Lanka's Blue Economy"}
            </h2>
            <p className="text-base md:text-lg text-slate-300 max-w-3xl mx-auto mb-8">
              {missionControlContent?.description ||
                'The NARA command centre synchronises research, policy, and frontline intelligence to secure resilient oceans and communities.'}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-3 sm:gap-4">
              <Link
                to="/contact-us"
                className="inline-flex items-center gap-2 rounded-xl bg-logo-blue px-5 py-3.5 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold text-white transition hover:bg-logo-blue-light active:scale-95"
              >
                <Icons.Navigation className="h-5 w-5" />
                {missionControlContent?.form?.cta || 'Join the mission'}
              </Link>
              <Link
                to="/about-nara-our-story"
                className="inline-flex items-center gap-2 rounded-xl border border-sky-500/40 px-5 py-3.5 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold text-sky-200 transition hover:border-sky-400 hover:bg-sky-500/10 active:scale-95"
              >
                <Icons.FileText className="h-5 w-5" />
                {t('home:missionControl.learnMore', { defaultValue: 'Review mandate brief' })}
              </Link>
            </div>
            <p className="mt-6 text-xs text-slate-400">
              {missionControlContent?.form?.privacy ||
                'We protect your data in alignment with GovCERT SL and international research ethics.'}
            </p>
          </div>
        </section>
      </main>

      {/* Live Ocean Data Showcase - Above Footer */}
      <Suspense fallback={
        <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-cyan-950 py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-white/10 rounded w-64 mx-auto mb-4" />
              <div className="h-4 bg-white/10 rounded w-96 mx-auto" />
            </div>
          </div>
        </div>
      }>
        <LiveOceanDataShowcase />
      </Suspense>

      <GovFooter />
    </div>
  );
};

export default NewHomePage;
