import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AppImage from '../../components/AppImage';
import { useOceanData } from '../../hooks/useOceanData';
import SriLankaEEZMap from '../../components/SriLankaEEZMap';
import GovFooter from '../../components/compliance/GovFooter';

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
  const divisionsContent = t('divisions', { ns: 'home', returnObjects: true });
  const servicesContent = t('services', { ns: 'home', returnObjects: true });
  const milestonesContent = t('milestones', { ns: 'home', returnObjects: true });
  const newsContent = t('news', { ns: 'home', returnObjects: true });
  const ctaContent = t('cta', { ns: 'home', returnObjects: true });
  const portalContent = t('portal', { ns: 'home', returnObjects: true });
  const missionControlContent = t('missionControl', { ns: 'home', returnObjects: true });
  const highlightsContent = t('highlights', { ns: 'home', returnObjects: true });

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

  // Divisions config
  const divisionsConfig = [
    { icon: Icons.Fish, gradient: 'from-blue-500 to-cyan-500', link: '/research-divisions/marine-biology' },
    { icon: Icons.Waves, gradient: 'from-green-500 to-teal-500', link: '/research-divisions/fisheries-aquaculture' },
    { icon: Icons.Satellite, gradient: 'from-purple-500 to-pink-500', link: '/research-divisions/oceanography' },
    { icon: Icons.Shield, gradient: 'from-emerald-500 to-green-500', link: '/research-divisions/environmental-management' },
    { icon: Icons.Droplets, gradient: 'from-cyan-500 to-blue-500', link: '/research-divisions/inland-water' },
    { icon: Icons.Microscope, gradient: 'from-orange-500 to-red-500', link: '/research-divisions/biotechnology' }
  ];

  // Services config
  const servicesConfig = [
    { icon: Icons.FlaskConical, gradient: 'from-cyan-500 to-blue-500', link: '/services/laboratory' },
    { icon: Icons.Info, gradient: 'from-green-500 to-teal-500', link: '/services/fisheries-advisory' },
    { icon: Icons.Database, gradient: 'from-purple-500 to-pink-500', link: '/services/data-portal' },
    { icon: Icons.GraduationCap, gradient: 'from-orange-500 to-amber-500', link: '/services/training' }
  ];

  // CTA config
  const ctaConfig = [
    { icon: Icons.Database, gradient: 'from-cyan-500 to-blue-500', link: '/research-excellence-portal' },
    { icon: Icons.Users, gradient: 'from-purple-500 to-pink-500', link: '/partnerships/collaboration-opportunities' },
    { icon: Icons.MessageSquare, gradient: 'from-green-500 to-teal-500', link: '/contact-us/expert-consultation' },
    { icon: Icons.BookOpen, gradient: 'from-orange-500 to-amber-500', link: '/resources/digital-library' }
  ];

  // Milestones config
  const milestonesIcons = [Icons.Flag, Icons.Ship, Icons.Waves, Icons.TreePine];
  const milestonesGradients = [
    'from-cyan-500 to-blue-500',
    'from-blue-500 to-purple-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-teal-500'
  ];

  // Achievements config
  const achievementsIcons = [Icons.Search, Icons.Shield, Icons.Globe2, Icons.GraduationCap];
  const achievementsGradients = [
    'from-cyan-500 to-blue-500',
    'from-green-500 to-teal-500',
    'from-purple-500 to-pink-500',
    'from-orange-500 to-amber-500'
  ];

  // News icons config
  const newsIcons = [Icons.TreePine, Icons.Handshake, Icons.Calendar];
  const newsGradients = [
    'from-green-500 to-teal-500',
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500'
  ];

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
      <section ref={heroRef} className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-[#03101d] to-blue-950">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-cyan-500/15 blur-3xl" />
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
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-14"
          >
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] items-center">
              <motion.div
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="space-y-5"
              >
                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-slate-900/60 px-4 py-2 text-xs uppercase tracking-[0.35em] text-cyan-200/90 backdrop-blur">
                    <Icons.ShieldCheck className="h-4 w-4" />
                    {heroOverview?.badge || t('hero.badge', { ns: 'home', defaultValue: 'Sri Lanka Government Research Agency' })}
                  </div>
                
                <div className="space-y-3">
                  <h1 className="text-4xl md:text-6xl font-bold font-space leading-tight">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                      {heroTitle?.lineOne || 'Pioneering Aquatic'}
                    </span>
                    <br />
                    <span className="text-white">{heroTitle?.lineTwo || 'Stewardship in Sri Lanka'}</span>
                  </h1>
                  <p className="text-base md:text-lg text-cyan-300/90 font-semibold">
                    {heroOverview?.tagline || 'Sri Lanka\'s Premier Marine & Freshwater Research Agency'}
                  </p>
                </div>
                
                <p className="text-sm md:text-base text-slate-300/90 max-w-2xl leading-relaxed">
                  {heroOverview?.description || 'Advancing scientific research and innovation in marine and aquatic resources to protect ecosystems, support sustainable fisheries, and drive the nation\'s blue economy.'}
                </p>
                
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Icons.Calendar className="h-4 w-4 text-cyan-400" />
                    <span>{heroOverview?.since || 'Since 1981'}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-2">
                    <Icons.Layers className="h-4 w-4 text-cyan-400" />
                    <span>{heroOverview?.divisions || '9 Research Divisions'}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-2">
                    <Icons.Users className="h-4 w-4 text-cyan-400" />
                    <span>{heroOverview?.scientists || '100+ Scientists'}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <Link
                    to="/research-excellence-portal"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:shadow-cyan-400/40"
                  >
                    <Icons.Microscope className="h-4 w-4" />
                    {heroOverview?.primaryCta || 'Explore Research'}
                  </Link>
                  <Link
                    to="/about-nara-our-story"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-500/30 px-6 py-3 text-sm font-semibold text-cyan-200 transition hover:border-cyan-400/60 hover:text-cyan-100"
                  >
                    <Icons.Info className="h-4 w-4" />
                    {heroOverview?.secondaryCta || 'About NARA'}
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="relative"
              >
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/20 via-transparent to-blue-500/10 blur-3xl" />
                <div className="relative rounded-3xl border border-cyan-500/20 bg-slate-950/70 p-4 backdrop-blur-2xl shadow-[0_25px_80px_-40px_rgba(8,145,178,0.6)]">
                  <motion.div
                    className="relative mx-auto w-full max-w-[380px] h-[540px]"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.9, delay: 0.2 }}
                  >
                    {/* Google Maps with EEZ Highlight */}
                    <div className="relative h-full w-full rounded-3xl overflow-hidden">
                      <SriLankaEEZMap className="h-full w-full" showMarkers={true} />
                      
                      {/* Sri Lanka Flag - Top Right Corner */}
                      <div className="absolute top-4 right-4 z-10">
                        <img
                          src="/assets/images/sri-lanka-flag.png"
                          alt="Sri Lanka Flag"
                          className="h-12 w-20 object-cover rounded shadow-lg border-2 border-white/20"
                        />
                      </div>
                    </div>

                    {/* NARA Logo Overlay - Animated Flash */}
                    <motion.div 
                      className="pointer-events-none absolute inset-0 flex items-center justify-center"
                      animate={{ 
                        scale: [1, 1.05, 1],
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <motion.div 
                        className="flex items-center justify-center rounded-full bg-slate-900/90 shadow-lg backdrop-blur-md border-2 w-28 h-28"
                        animate={{
                          borderColor: ['rgba(34,211,238,0.4)', 'rgba(6,182,212,0.8)', 'rgba(34,211,238,0.4)'],
                          boxShadow: [
                            '0 0 20px rgba(34,211,238,0.3)',
                            '0 0 40px rgba(6,182,212,0.6)',
                            '0 0 20px rgba(34,211,238,0.3)'
                          ]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <AppImage
                          src="/assets/nara-logo.png"
                          alt="NARA crest"
                          className="object-contain w-20 h-20"
                        />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Statement & Overview */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-6xl mx-auto">
          {/* Mission Statement */}
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 font-space">
              Safeguarding Sri Lanka&apos;s Aquatic Wealth Through Science
            </h2>
            <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-4xl mx-auto">
              The National Aquatic Resources Research & Development Agency (NARA) is Sri Lanka&apos;s premier institute for marine and freshwater science, dedicated to safeguarding and sustainably developing the nation&apos;s aquatic wealth. We conduct cutting-edge research, guide policy on fisheries and ocean resources, and drive innovation in the Blue Economy to benefit ecosystems and communities.
            </p>
          </div>

          {/* Key Impact Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center backdrop-blur">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 mb-4">
                <Icons.Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-cyan-400 mb-2">40+</div>
              <div className="text-sm text-slate-400">Years of Research Excellence</div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center backdrop-blur">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mb-4">
                <Icons.Waves className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-blue-400 mb-2">460,000 km²</div>
              <div className="text-sm text-slate-400">Ocean Territory Under Watch</div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center backdrop-blur">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mb-4">
                <Icons.Award className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-purple-400 mb-2">100+</div>
              <div className="text-sm text-slate-400">Completed Research Projects</div>
            </div>
          </div>
        </div>
      </section>

      {/* Research Excellence - Optimized Design */}
      <section className="relative py-16 px-4 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          {/* Compact Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              {researchContent?.heading}
            </h2>
            <p className="text-base text-slate-400 max-w-2xl mx-auto">
              {researchContent?.description}
            </p>
          </div>

          {/* Lightweight Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {researchAreas.map((area, index) => (
              <div
                key={area.key || index}
                className="group relative bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-cyan-500/50 transition-colors"
              >
                {/* Minimal Icon Badge */}
                <div className={`inline-flex p-2.5 rounded-lg bg-gradient-to-r ${area.color} mb-3`}>
                  <area.icon className="w-5 h-5 text-white" />
                </div>
                
                {/* Content */}
                <h3 className="text-lg font-semibold mb-1.5 text-white">{area.title}</h3>
                <p className="text-slate-400 text-xs mb-3 line-clamp-2">{area.description}</p>
                
                {/* Stats - Compact */}
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold text-cyan-400">{area.stat}</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wide">{area.unit}</span>
                </div>
                
                {/* Simple Hover Indicator */}
                <Icons.ArrowUpRight className="absolute top-4 right-4 w-4 h-4 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Focus Areas & Services */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto">
          {/* Research Divisions */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 font-space">
                {divisionsContent?.heading}
              </h2>
              <p className="text-base text-slate-400 max-w-2xl mx-auto">
                {divisionsContent?.subheading}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {divisionsConfig.map((config, index) => {
                const division = divisionsContent?.list?.[index] || {};
                const IconComponent = config.icon;
                return (
                  <Link key={index} to={config.link} className="group">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-cyan-500/50 transition-all">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-r ${config.gradient}`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                            {division.name}
                          </h3>
                          <p className="text-sm text-slate-400">{division.description}</p>
                        </div>
                        <Icons.ArrowRight className="w-5 h-5 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Services to Stakeholders */}
          <div>
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 font-space">
                {servicesContent?.heading}
              </h2>
              <p className="text-base text-slate-400 max-w-2xl mx-auto">
                {servicesContent?.subheading}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {servicesConfig.map((config, index) => {
                const service = servicesContent?.list?.[index] || {};
                const IconComponent = config.icon;
                return (
                  <Link key={index} to={config.link} className="group">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-cyan-500/50 transition-all text-center">
                      <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${config.gradient} mb-4`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-sm text-slate-400">{service.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Achievements & Milestones */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-slate-800 via-slate-700 to-slate-800">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 font-space">
              {milestonesContent?.heading}
            </h2>
            <p className="text-base text-slate-300 max-w-2xl mx-auto">
              {milestonesContent?.subheading}
            </p>
          </div>

          {/* Timeline Highlights */}
          <div className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {milestonesContent?.timeline?.map((milestone, index) => {
                const IconComponent = milestonesIcons[index] || Icons.Flag;
                const gradient = milestonesGradients[index] || 'from-cyan-500 to-blue-500';
                const colorClass = ['text-cyan-400', 'text-blue-400', 'text-purple-400', 'text-green-400'][index] || 'text-cyan-400';
                return (
                  <div key={index} className="bg-slate-900/50 border border-slate-600 rounded-xl p-6 hover:border-cyan-400 transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <span className={`text-2xl font-bold ${colorClass}`}>{milestone.year}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{milestone.title}</h3>
                    <p className="text-sm text-slate-300">{milestone.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notable Achievements */}
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-10">
              {milestonesContent?.achievementsHeading}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {milestonesContent?.achievements?.map((achievement, index) => {
                const IconComponent = achievementsIcons[index] || Icons.Award;
                const gradient = achievementsGradients[index] || 'from-cyan-500 to-blue-500';
                const colorClass = ['text-cyan-400', 'text-green-400', 'text-purple-400', 'text-orange-400'][index] || 'text-cyan-400';
                return (
                  <div key={index} className="text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${gradient} mb-4`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div className={`text-3xl font-bold ${colorClass} mb-2`}>{achievement.number}</div>
                    <div className="text-sm text-slate-300">{achievement.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Link to Full History */}
            <div className="text-center mt-12">
              <Link 
                to="/about-nara-our-story" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-xl transition-all"
              >
                <Icons.BookOpen className="w-5 h-5" />
                {milestonesContent?.cta}
                <Icons.ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News & Updates */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-slate-900 via-blue-950/30 to-slate-900">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 font-space">
                {newsContent?.heading}
              </h2>
              <p className="text-base text-slate-400">
                {newsContent?.subheading}
              </p>
            </div>
            <Link 
              to="/media-center/news" 
              className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 border border-cyan-500/50 hover:bg-cyan-500/10 text-cyan-400 rounded-xl transition-all"
            >
              {newsContent?.viewAll}
              <Icons.ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {newsContent?.articles?.map((article, index) => {
              const IconComponent = newsIcons[index] || Icons.Newspaper;
              const gradient = newsGradients[index] || 'from-cyan-500 to-blue-500';
              const linkText = index === 2 ? newsContent?.learnMore : newsContent?.readMore;
              return (
                <Link key={index} to={`/news/article-${index + 1}`} className="group">
                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all">
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${gradient}`}>
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-xs text-slate-400">{article.date}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                        {article.description}
                      </p>
                      <div className="flex items-center gap-2 text-cyan-400 text-sm">
                        <span>{linkText}</span>
                        <Icons.ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Public Notice/Alert */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-amber-500/20">
                <Icons.AlertTriangle className="w-6 h-6 text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-amber-400 mb-2">{newsContent?.advisory?.title}</h3>
                <p className="text-sm text-slate-300 mb-3">
                  {newsContent?.advisory?.description}
                </p>
                <Link to="/services/fisheries-advisory" className="inline-flex items-center gap-2 text-amber-400 text-sm hover:text-amber-300 transition-colors">
                  <span>{newsContent?.advisory?.link}</span>
                  <Icons.ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile "View All" Button */}
          <div className="md:hidden mt-8 text-center">
            <Link 
              to="/media-center/news" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-xl transition-all"
            >
              {newsContent?.viewAll}
              <Icons.ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How Can We Help You - CTAs for Key Audiences */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-cyan-900/20 via-slate-900 to-blue-900/20">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 font-space">
              {ctaContent?.heading}
            </h2>
            <p className="text-base text-slate-300 max-w-2xl mx-auto">
              {ctaContent?.subheading}
            </p>
          </div>

          {/* CTA Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ctaContent?.cards?.map((card, index) => {
              const config = ctaConfig[index] || {};
              const IconComponent = config.icon || Icons.ArrowRight;
              const gradient = config.gradient || 'from-cyan-500 to-blue-500';
              const buttonColors = [
                'bg-cyan-500 hover:bg-cyan-400 text-slate-950',
                'bg-purple-500 hover:bg-purple-400 text-white',
                'bg-green-500 hover:bg-green-400 text-white',
                'bg-orange-500 hover:bg-orange-400 text-white'
              ][index] || 'bg-cyan-500 hover:bg-cyan-400 text-white';
              
              return (
                <div key={index} className="group bg-slate-800/50 border border-slate-700 rounded-2xl p-8 hover:border-cyan-500/50 transition-all">
                  <div className="flex items-start gap-6">
                    <div className={`p-4 rounded-xl bg-gradient-to-r ${gradient} flex-shrink-0`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-3">{card.title}</h3>
                      <p className="text-sm text-slate-400 mb-6">
                        {card.description}
                      </p>
                      <Link 
                        to={config.link || '#'} 
                        className={`inline-flex items-center gap-2 px-5 py-3 ${buttonColors} font-semibold rounded-xl transition-all`}
                      >
                        {card.button}
                        <Icons.ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <GovFooter />
    </div>
  );
};

export default NewHomePage;
