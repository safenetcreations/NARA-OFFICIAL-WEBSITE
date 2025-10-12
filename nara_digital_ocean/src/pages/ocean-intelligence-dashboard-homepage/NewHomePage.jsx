import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AppImage from '../../components/AppImage';
import { useOceanData } from '../../hooks/useOceanData';
import SriLankaEEZMap from '../../components/SriLankaEEZMap';
import OceanIntelligenceHub from '../../components/sections/OceanIntelligenceHub';

const NewHomePage = () => {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const { scrollY } = useScroll();
  const heroRef = useRef(null);
  const { t } = useTranslation(['home', 'common']);

  // Real-time ocean data
  const {
    oceanData,
    isLoading,
    refreshData
  } = useOceanData();

  // Parallax transforms
  const y1 = useTransform(scrollY, [0, 300], [0, 100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const heroTitle = t('hero.title', { ns: 'home', returnObjects: true });
  const heroStats = t('hero.stats', { ns: 'home', returnObjects: true });
  const heroOverview = t('hero.overview', { ns: 'home', returnObjects: true });
  const researchContent = t('research', { ns: 'home', returnObjects: true });
  const intelligenceContent = t('intelligence', { ns: 'home', returnObjects: true });
  const missionContent = t('mission', { ns: 'home', returnObjects: true });
  const portalContent = t('portal', { ns: 'home', returnObjects: true });
  const missionControlContent = t('missionControl', { ns: 'home', returnObjects: true });
  const highlightsContent = t('highlights', { ns: 'home', returnObjects: true });
  const navigationContent = t('navigation', { ns: 'home', returnObjects: true });
  const contactContent = t('contact', { ns: 'home', returnObjects: true });
  const footerContent = t('footer', { ns: 'home', returnObjects: true });

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
      setLastUpdate(new Date());
    }, 300000);
    return () => clearInterval(interval);
  }, [refreshData]);

  // Enhanced research areas data with real-time integration
  const researchAreasConfig = [
    {
      key: 'marineBiodiversity',
      icon: Icons.Fish,
      color: 'from-blue-500 to-cyan-500',
      statValue: oceanData?.speciesCount,
      trend: oceanData?.speciesTrend || 'stable'
    },
    {
      key: 'climateResearch',
      icon: Icons.Thermometer,
      color: 'from-purple-500 to-pink-500',
      statValue: oceanData?.temperature,
      trend: oceanData?.tempTrend || 'warming'
    },
    {
      key: 'conservation',
      icon: Icons.Shield,
      color: 'from-green-500 to-teal-500',
      statValue: oceanData?.conservationRate,
      trend: oceanData?.conservationTrend || 'improving'
    },
    {
      key: 'satelliteMonitoring',
      icon: Icons.Satellite,
      color: 'from-orange-500 to-red-500',
      statValue: oceanData?.satelliteObservations,
      trend: oceanData?.satelliteTrend || 'active'
    }
  ];

  const researchAreas = researchAreasConfig.map((config) => {
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
  });

  const livePointColors = ['bg-green-500', 'bg-blue-500', 'bg-yellow-500'];
  const missionStatsIcons = [Icons.Award, Icons.Users, Icons.Globe2];

  const portalCardsConfig = [
    {
      key: 'research',
      icon: Icons.Microscope,
      gradient: 'from-purple-600 to-pink-600',
      link: '/research-excellence-portal'
    },
    {
      key: 'maritime',
      icon: Icons.Ship,
      gradient: 'from-blue-600 to-cyan-600',
      link: '/maritime-services-hub'
    },
    {
      key: 'marketplace',
      icon: Icons.ShoppingBag,
      gradient: 'from-green-600 to-teal-600',
      link: '/nara-digital-marketplace'
    }
  ];

  const highlightCardsConfig = [
    {
      key: 'programs',
      icon: Icons.Microscope,
      accent: 'from-cyan-500/0 via-cyan-500/20 to-blue-600/0',
      iconColor: 'text-cyan-300'
    },
    {
      key: 'observatories',
      icon: Icons.Satellite,
      accent: 'from-blue-500/0 via-blue-500/20 to-cyan-500/0',
      iconColor: 'text-blue-300'
    },
    {
      key: 'dataAssets',
      icon: Icons.Database,
      accent: 'from-teal-500/0 via-teal-500/20 to-blue-600/0',
      iconColor: 'text-teal-300'
    },
    {
      key: 'partners',
      icon: Icons.Users,
      accent: 'from-cyan-500/0 via-blue-500/20 to-cyan-500/0',
      iconColor: 'text-cyan-200'
    }
  ];

  const navigationColumns = [
    {
      key: 'missionPillars',
      links: [
        { key: 'dashboard', to: '/ocean-intelligence-dashboard-homepage', type: 'link' },
        { key: 'research', to: '/research-excellence-portal', type: 'link' },
        { key: 'knowledge', to: '/knowledge-discovery-center', type: 'link' },
        { key: 'partnership', to: '/partnership-innovation-gateway', type: 'link' }
      ]
    },
    {
      key: 'commandCenters',
      links: [
        { key: 'maritime', to: '/maritime-services-hub', type: 'link' },
        { key: 'emergency', to: '/emergency-response-network', type: 'link' },
        { key: 'integration', to: '/integration-systems-platform', type: 'link' },
        { key: 'learning', to: '/learning-development-academy', type: 'link' }
      ]
    },
    {
      key: 'policy',
      links: [
        { key: 'bulletins', to: '/nara-news-updates-center', type: 'link' },
        { key: 'transactions', to: '/payment-gateway-hub', type: 'link' },
        { key: 'charter', href: '#', type: 'anchor' },
        { key: 'accessibility', href: '#', type: 'anchor' }
      ]
    }
  ];

  return (
    <div className="bg-black text-white overflow-hidden">
      {/* Live Data Indicator */}
      <div className="fixed top-20 right-4 z-50 glass" style={{ padding: '8px 12px', borderRadius: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>
            {t('hero.liveDataLabel', { ns: 'home' })}: {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Hero Section - Sri Lanka Sovereign Waters */}
      <section ref={heroRef} className="relative min-h-screen overflow-hidden flex items-center">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#03101d] to-blue-950" />
          <div className="absolute -top-32 left-1/2 h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-cyan-500/15 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[520px] w-[520px] rounded-full bg-blue-500/20 blur-3xl" />
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
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24"
          >
            <div className="grid gap-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,420px)] items-center">
              <motion.div
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-slate-900/60 px-4 py-2 text-xs uppercase tracking-[0.35em] text-cyan-200/90 backdrop-blur">
                  <Icons.Radar className="h-4 w-4" />
                  {t('hero.badge', { ns: 'home' })}
                </div>
                <h1 className="text-4xl md:text-6xl font-bold font-space leading-tight">
                  {heroTitle?.lead}{' '}
                  <span className="text-cyan-400">{heroTitle?.highlight}</span>
                  {heroTitle?.trail ? ` ${heroTitle.trail}` : ''}
                </h1>
                <p className="text-base md:text-lg text-slate-300/90 max-w-2xl">
                  {t('hero.description', { ns: 'home' })}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <button
                    onClick={() => {
                      refreshData();
                      setLastUpdate(new Date());
                    }}
                    disabled={isLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:shadow-cyan-400/40 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isLoading ? (
                      <Icons.Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Icons.RefreshCw className="h-4 w-4" />
                    )}
                    {t('hero.actions.sync', { ns: 'home' })}
                  </button>
                  <Link
                    to="/research-excellence-portal"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-500/30 px-6 py-3 text-sm font-semibold text-cyan-200 transition hover:border-cyan-400/60 hover:text-cyan-100"
                  >
                    <Icons.Compass className="h-4 w-4" />
                    {t('hero.actions.launch', { ns: 'home' })}
                  </Link>
                </div>

                <div className="grid gap-6 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur">
                    <div className="text-xs uppercase tracking-[0.3em] text-slate-400">{heroStats?.activeSensors?.label}</div>
                    <div className="mt-2 text-3xl font-semibold text-white">{oceanData?.activeSensors || '318'}</div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-cyan-200/80">
                      <Icons.Signal className="h-3.5 w-3.5" />
                      {heroStats?.activeSensors?.caption}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur">
                    <div className="text-xs uppercase tracking-[0.3em] text-slate-400">{heroStats?.protectedWaters?.label}</div>
                    <div className="mt-2 text-3xl font-semibold text-white">{oceanData?.protectedArea || '1.0M km²'}</div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-cyan-200/80">
                      <Icons.ShieldCheck className="h-3.5 w-3.5" />
                      {heroStats?.protectedWaters?.caption}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur">
                    <div className="text-xs uppercase tracking-[0.3em] text-slate-400">{heroStats?.liveAlerts?.label}</div>
                    <div className="mt-2 text-3xl font-semibold text-white">{oceanData?.liveAlerts || '12'}</div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-cyan-200/80">
                      <Icons.AlertTriangle className="h-3.5 w-3.5" />
                      {heroStats?.liveAlerts?.caption}
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="relative"
              >
                <div className="absolute inset-0 rounded-[36px] bg-gradient-to-br from-cyan-500/20 via-transparent to-blue-500/10 blur-3xl" />
                <div className="relative rounded-[36px] border border-cyan-500/20 bg-slate-950/70 p-6 backdrop-blur-2xl shadow-[0_25px_80px_-40px_rgba(8,145,178,0.6)]">
                  <motion.div
                    className="relative mx-auto w-full max-w-[480px] h-[650px]"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.9, delay: 0.2 }}
                  >
                    {/* Google Maps with EEZ Highlight */}
                    <div className="relative h-full w-full rounded-3xl overflow-hidden">
                      <SriLankaEEZMap className="h-full w-full" showMarkers={true} />
                    </div>

                    {/* NARA Logo Overlay - ZOOM IN/OUT Animation */}
                    <motion.div
                      className="pointer-events-none absolute inset-0 flex items-center justify-center"
                      animate={{ 
                        scale: [0.85, 1.15, 0.85],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 3.5, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <motion.div 
                        className="flex items-center justify-center rounded-full bg-slate-900/80 shadow-inner shadow-cyan-500/40 backdrop-blur-md border-2 border-cyan-400/50"
                        animate={{
                          width: [100, 140, 100],
                          height: [100, 140, 100],
                          borderColor: ['rgba(34,211,238,0.5)', 'rgba(6,182,212,0.8)', 'rgba(34,211,238,0.5)']
                        }}
                        transition={{
                          duration: 3.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <AppImage
                          src="/assets/nara-logo.png"
                          alt="NARA crest"
                          className="object-contain"
                          style={{ 
                            width: '75%',
                            height: '75%'
                          }}
                        />
                      </motion.div>
                    </motion.div>
                  </motion.div>

                  <div className="mt-10 space-y-4 text-sm text-slate-300/90">
                    <div className="flex items-center justify-between rounded-2xl border border-slate-800/70 bg-slate-900/60 px-4 py-3">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-200/80">{heroOverview?.sovereignWaters?.label}</p>
                        <p className="text-base font-semibold text-white">{heroOverview?.sovereignWaters?.value}</p>
                      </div>
                      <Icons.Waves className="h-5 w-5 text-cyan-300" />
                    </div>
                    <div className="flex items-center justify-between rounded-2xl border border-slate-800/70 bg-slate-900/60 px-4 py-3">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-200/80">{heroOverview?.lastSync?.label}</p>
                        <p className="text-base font-semibold text-white">{lastUpdate.toLocaleTimeString()}</p>
                      </div>
                      <Icons.Loader className="h-5 w-5 animate-spin text-cyan-300" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Research Areas - Card Grid with Hover Effects */}
      <section className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold font-space mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                {researchContent?.heading}
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {researchContent?.description}
            </p>
          </motion.div>

          {/* Research Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {researchAreas.map((area, index) => (
              <motion.div
                key={area.key || index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${area.color.replace('from-', '').replace('to-', '').split(' ').join(', ')})`
                  }}
                ></div>
                <div className="relative bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 hover:border-cyan-500 transition-all duration-300">
                  {/* Icon */}
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${area.color} mb-4`}>
                    <area.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold mb-2 text-white">{area.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{area.description}</p>
                  
                  {/* Stats */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-cyan-400 font-space">{area.stat}</span>
                    <span className="text-xs text-gray-500 uppercase">{area.unit}</span>
                  </div>
                  
                  {/* Hover Arrow */}
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Icons.ArrowUpRight className="w-5 h-5 text-cyan-400" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Ocean Data Visualization */}
      <section className="relative py-32 px-4 bg-gradient-to-b from-black via-blue-950/20 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold font-space mb-6">
                {intelligenceContent?.heading?.lead}
                <span className="block bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                  {intelligenceContent?.heading?.highlight}
                </span>
              </h2>
              <p className="text-gray-400 mb-8 text-lg">
                {intelligenceContent?.description}
              </p>

              {/* Live Data Points */}
              <div className="space-y-4 mb-8">
                {(intelligenceContent?.livePoints || []).map((point, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className={`w-3 h-3 ${livePointColors[index % livePointColors.length]} rounded-full animate-pulse`}></div>
                    <span className="text-gray-300">{point}</span>
                  </div>
                ))}
              </div>
              
              <Link to="/ocean-intelligence-dashboard">
                <button className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full hover:scale-105 transition-all duration-300">
                  <span className="flex items-center gap-2 text-white font-semibold">
                    {intelligenceContent?.cta}
                    <Icons.ExternalLink className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                  </span>
                </button>
              </Link>
            </motion.div>

            {/* Right - Interactive Globe/Map */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative aspect-square">
                {/* Animated Globe Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
                
                {/* Globe Container */}
                <div className="relative bg-gradient-to-br from-blue-900/50 to-cyan-900/50 rounded-full p-8 backdrop-blur-xl border border-cyan-500/30">
                  {/* Orbital Rings */}
                  <div className="absolute inset-4 border-2 border-cyan-500/20 rounded-full animate-spin-slow"></div>
                  <div className="absolute inset-8 border-2 border-blue-500/20 rounded-full animate-spin-reverse"></div>
                  
                  {/* Center Globe */}
                  <div className="relative aspect-square bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
                    <Icons.Globe className="w-32 h-32 text-white/80" />
                    
                    {/* Data Points */}
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute"
                        style={{
                          top: `${20 + Math.random() * 60}%`,
                          left: `${20 + Math.random() * 60}%`,
                        }}
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.4,
                        }}
                      >
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* Floating Stats */}
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-4 -right-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-4 backdrop-blur-xl"
                >
                  <div className="text-2xl font-bold text-white">{intelligenceContent?.floatingStats?.temperature?.value}</div>
                  <div className="text-xs text-white/80">{intelligenceContent?.floatingStats?.temperature?.label}</div>
                </motion.div>

                <motion.div
                  animate={{ y: [5, -5, 5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -bottom-4 -left-4 bg-gradient-to-br from-green-600 to-teal-600 rounded-xl p-4 backdrop-blur-xl"
                >
                  <div className="text-2xl font-bold text-white">{intelligenceContent?.floatingStats?.ph?.value}</div>
                  <div className="text-xs text-white/80">{intelligenceContent?.floatingStats?.ph?.label}</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Statement - Fullwidth with Parallax */}
      <section className="relative py-32 px-4 overflow-hidden">
        <motion.div 
          style={{ y: y1 }}
          className="absolute inset-0 opacity-10"
        >
          <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>
        </motion.div>
        
        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-7xl font-bold font-space mb-8">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                {missionContent?.heading}
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              &ldquo;{missionContent?.description}&rdquo;
            </p>

            <div className="mt-12 flex items-center justify-center gap-8">
              {(missionContent?.stats || []).map((stat, index) => {
                const IconComponent = missionStatsIcons[index % missionStatsIcons.length];
                return (
                  <div key={stat?.label || index} className="text-center">
                    <IconComponent className={`w-12 h-12 mx-auto mb-2 ${index === 0 ? 'text-cyan-400' : index === 1 ? 'text-blue-400' : 'text-purple-400'}`} />
                    <div className="text-3xl font-bold text-white">{stat?.value}</div>
                    <div className="text-sm text-gray-400">{stat?.label}</div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Ocean Intelligence Hub Section */}
      <OceanIntelligenceHub />

      {/* Quick Access Portal */}
      <section className="relative py-32 px-4 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-space mb-4">
              {portalContent?.heading}
            </h2>
            <p className="text-xl text-gray-400">{portalContent?.subheading}</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {portalCardsConfig.map((card, index) => {
              const copy = portalContent?.cards?.[card.key] || {};
              const IconComponent = card.icon;
              const buttonLabel = portalContent?.cta || copy.title;
              return (
                <motion.div
                  key={card.key}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Link to={card.link}>
                    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 border border-gray-700 hover:border-cyan-500 transition-all duration-300">
                      <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}></div>

                      <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${card.gradient} mb-4`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>

                      <h3 className="text-2xl font-bold text-white mb-2">{copy.title}</h3>
                      <p className="text-gray-400 mb-4">{copy.description}</p>

                      <div className="flex items-center gap-2 text-cyan-400 group-hover:gap-4 transition-all">
                        <span>{buttonLabel}</span>
                        <Icons.ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative mt-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#03172A] to-slate-900" />
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-56 -left-24 w-[32rem] h-[32rem] bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-slate-100 space-y-16">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12">
            <div className="max-w-2xl">
              <div className="flex items-center gap-5 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-400/60 blur-2xl rounded-2xl" />
                  <div className="relative p-3 bg-slate-900/70 border border-cyan-400/40 rounded-2xl backdrop-blur-xl">
                    <AppImage src="/assets/nara-logo.png" alt="NARA crest" className="w-16 h-16 object-contain" />
                  </div>
                </div>
                <div>
                  <p className="text-cyan-300 text-xs tracking-[0.35em] uppercase">{missionControlContent?.badge}</p>
                  <h3 className="text-3xl md:text-4xl font-semibold font-space leading-tight">{missionControlContent?.title}</h3>
                </div>
              </div>
              <p className="text-slate-300/90 text-lg leading-relaxed">
                {missionControlContent?.description}
              </p>
            </div>

            <div className="w-full max-w-md bg-slate-900/60 border border-slate-700/40 rounded-2xl p-6 lg:p-8 backdrop-blur-xl shadow-[0_25px_80px_-40px_rgba(6,182,212,0.45)]">
              <h4 className="text-lg font-semibold mb-3">{missionControlContent?.form?.title}</h4>
              <p className="text-sm text-slate-300/90 mb-5">
                {missionControlContent?.form?.description}
              </p>
              <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
                <input
                  type="text"
                  required
                  placeholder={missionControlContent?.form?.placeholders?.name}
                  className="w-full rounded-xl bg-slate-950/60 border border-slate-700/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/70 focus:border-transparent"
                />
                <input
                  type="email"
                  required
                  placeholder={missionControlContent?.form?.placeholders?.email}
                  className="w-full rounded-xl bg-slate-950/60 border border-slate-700/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/70 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:shadow-cyan-400/30"
                >
                  <Icons.Send className="w-4 h-4" />
                  {missionControlContent?.form?.cta}
                </button>
              </form>
              <p className="text-xs text-slate-400 mt-4">
                {missionControlContent?.form?.privacy}
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {highlightCardsConfig.map((card) => {
              const copy = highlightsContent?.cards?.[card.key] || {};
              const IconComponent = card.icon;
              return (
                <div key={card.key} className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.accent} opacity-0 transition-opacity group-hover:opacity-100`} />
                  <div className="relative flex items-start justify-between gap-6">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{copy.label}</p>
                      <p className="text-4xl font-semibold text-white mt-3">{copy.value}</p>
                      <p className="text-sm text-slate-400 mt-3">{copy.description}</p>
                    </div>
                    <IconComponent className={`w-10 h-10 ${card.iconColor}`} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid gap-10 lg:grid-cols-4">
            {navigationColumns.map((column) => {
              const columnCopy = navigationContent?.[column.key] || {};
              return (
                <div key={column.key} className="space-y-5">
                  <h4 className="text-sm font-semibold tracking-[0.3em] uppercase text-cyan-200">{columnCopy.heading}</h4>
                  <ul className="space-y-3 text-sm text-slate-300">
                    {column.links.map((link) => {
                      const label = columnCopy.links?.[link.key] || '';
                      if (link.type === 'anchor') {
                        return (
                          <li key={link.key}>
                            <a href={link.href || '#'} className="hover:text-cyan-300 transition">
                              {label}
                            </a>
                          </li>
                        );
                      }
                      return (
                        <li key={link.key}>
                          <Link to={link.to || '#'} className="hover:text-cyan-300 transition">
                            {label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
            <div className="space-y-6">
              <h4 className="text-sm font-semibold tracking-[0.3em] uppercase text-cyan-200">{contactContent?.heading}</h4>
              <div className="space-y-4 text-sm text-slate-300">
                <p className="flex items-start gap-3">
                  <Icons.MapPin className="mt-0.5 w-4 h-4 text-cyan-300" />
                  {contactContent?.address}
                </p>
                <p className="flex items-center gap-3">
                  <Icons.Phone className="w-4 h-4 text-cyan-300" />
                  <a href="tel:+94112345678" className="hover:text-cyan-300 transition">+94 11 234 5678</a>
                </p>
                <p className="flex items-center gap-3">
                  <Icons.Mail className="w-4 h-4 text-cyan-300" />
                  <a href="mailto:info@nara.gov.lk" className="hover:text-cyan-300 transition">info@nara.gov.lk</a>
                </p>
                <p className="flex items-center gap-3">
                  <Icons.Clock className="w-4 h-4 text-cyan-300" />
                  {contactContent?.hours}
                </p>
              </div>
            </div>
          </div>

          {/* Centered Footer Section */}
          <div className="mt-16 w-full border-t border-slate-800/70 pt-8">
            <div className="max-w-4xl mx-auto flex flex-col gap-5 text-center">
              
              {/* Line 1: Government Website Badge */}
              <div className="flex items-center justify-center gap-3 text-cyan-200">
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/nara-web-73384.firebasestorage.app/o/sri%20lankan%20goverment%2Fsrilankan%20embelm.png?alt=media&token=f8e4b9e8-1e4d-4350-bbee-76d04b7d0928"
                  alt="Government of Sri Lanka emblem"
                  className="h-10 w-10 object-contain"
                  loading="lazy"
                />
                <span className="text-sm uppercase tracking-[0.3em] font-medium">
                  {footerContent?.badge}
                </span>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/nara-web-73384.firebasestorage.app/o/sri%20lankan%20goverment%2Fsl-flag-1.png?alt=media&token=cf422533-b8df-4d92-a08f-978704d34124"
                  alt="Flag of Sri Lanka"
                  className="h-8 w-11 object-cover rounded-sm ring-1 ring-cyan-300/40"
                  loading="lazy"
                />
              </div>

              {/* Line 2: Legal Links & Compliance */}
              <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-slate-400 border-y border-slate-800/50 py-4">
                <a href="#" className="hover:text-cyan-300 transition-colors">
                  {footerContent?.legal?.privacy}
                </a>
                <span className="text-slate-700">•</span>
                <a href="#" className="hover:text-cyan-300 transition-colors">
                  {footerContent?.legal?.terms}
                </a>
                <span className="text-slate-700">•</span>
                <a href="#" className="hover:text-cyan-300 transition-colors">
                  {footerContent?.legal?.transparency}
                </a>
                <span className="text-slate-700">•</span>
                <span className="flex items-center gap-2 text-slate-500">
                  <Icons.ShieldCheck className="w-4 h-4" />
                  {footerContent?.legal?.compliance}
                </span>
              </div>

              {/* Line 3: Social Media Icons */}
              <div className="flex items-center justify-center gap-4">
                {[Icons.Twitter, Icons.Facebook, Icons.Linkedin, Icons.Youtube].map((IconComponent, index) => (
                  <a
                    key={index}
                    href="#"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700/60 bg-slate-950/40 text-slate-400 transition-all hover:border-cyan-400/60 hover:text-cyan-200 hover:bg-slate-800/60 hover:scale-110"
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                ))}
              </div>

              {/* Line 4: Copyright */}
              <p className="text-sm text-slate-500 pt-3">
                {footerContent?.copyright}
                <br className="sm:hidden" />
                <span className="hidden sm:inline"> </span>
                {footerContent?.craftedBy} <a href="https://www.safenetcreations.com" className="text-cyan-300 hover:text-cyan-100 transition-colors font-medium" target="_blank" rel="noopener noreferrer">www.safenetcreations.com</a>
              </p>

            </div>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default NewHomePage;
