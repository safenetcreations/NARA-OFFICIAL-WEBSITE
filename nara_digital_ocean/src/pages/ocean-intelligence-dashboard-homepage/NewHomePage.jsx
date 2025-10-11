import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import AppImage from '../../components/AppImage';
import { useOceanData } from '../../hooks/useOceanData';

const NewHomePage = () => {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const { scrollY } = useScroll();
  const heroRef = useRef(null);

  // Real-time ocean data
  const {
    oceanData,
    isLoading,
    refreshData
  } = useOceanData();

  // Parallax transforms
  const y1 = useTransform(scrollY, [0, 300], [0, 100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
      setLastUpdate(new Date());
    }, 300000);
    return () => clearInterval(interval);
  }, [refreshData]);

  // Enhanced research areas data with real-time integration
  const researchAreas = [
    {
      icon: Icons.Fish,
      title: "Marine Biodiversity",
      description: "Protecting 50,000+ marine species",
      stat: oceanData?.speciesCount || "15K",
      unit: "Species Documented",
      color: "from-blue-500 to-cyan-500",
      trend: oceanData?.speciesTrend || "stable",
      live: true
    },
    {
      icon: Icons.Thermometer,
      title: "Climate Research",
      description: "Real-time ocean temperature monitoring",
      stat: oceanData?.temperature || "24/7",
      unit: "Climate Tracking",
      color: "from-purple-500 to-pink-500",
      trend: oceanData?.tempTrend || "warming",
      live: true
    },
    {
      icon: Icons.Shield,
      title: "Conservation",
      description: "Sustainable fishing practices",
      stat: oceanData?.conservationRate || "85%",
      unit: "Success Rate",
      color: "from-green-500 to-teal-500",
      trend: oceanData?.conservationTrend || "improving",
      live: true
    },
    {
      icon: Icons.Satellite,
      title: "Satellite Monitoring",
      description: "AI-powered ocean surveillance",
      stat: oceanData?.satelliteObservations || "500",
      unit: "Daily Observations",
      color: "from-orange-500 to-red-500",
      trend: oceanData?.satelliteTrend || "active",
      live: true
    }
  ];

  return (
    <div className="bg-black text-white overflow-hidden">
      {/* Live Data Indicator */}
      <div className="fixed top-20 right-4 z-50 glass" style={{ padding: '8px 12px', borderRadius: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>
            Live Data: {lastUpdate.toLocaleTimeString()}
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
                  Sri Lanka Exclusive Economic Zone
                </div>
                <h1 className="text-4xl md:text-6xl font-bold font-space leading-tight">
                  Commanding <span className="text-cyan-400">200 Nautical Miles</span> of Sovereign Ocean Intelligence
                </h1>
                <p className="text-base md:text-lg text-slate-300/90 max-w-2xl">
                  NARA&apos;s national mission control fuses satellite telemetry, autonomous gliders, and coastal observatories to illuminate Sri Lanka&apos;s seas. Every pulse safeguards maritime trade, blue economy prosperity, and climate resilience across the island nation.
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
                    Sync Live Sensors
                  </button>
                  <Link
                    to="/research-excellence-portal"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-500/30 px-6 py-3 text-sm font-semibold text-cyan-200 transition hover:border-cyan-400/60 hover:text-cyan-100"
                  >
                    <Icons.Compass className="h-4 w-4" />
                    Launch Intelligence Console
                  </Link>
                </div>

                <div className="grid gap-6 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur">
                    <div className="text-xs uppercase tracking-[0.3em] text-slate-400">Active Sensors</div>
                    <div className="mt-2 text-3xl font-semibold text-white">{oceanData?.activeSensors || '318'}</div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-cyan-200/80">
                      <Icons.Signal className="h-3.5 w-3.5" />
                      Satellite, buoy, and ROV network
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur">
                    <div className="text-xs uppercase tracking-[0.3em] text-slate-400">Protected Waters</div>
                    <div className="mt-2 text-3xl font-semibold text-white">{oceanData?.protectedArea || '1.0M km²'}</div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-cyan-200/80">
                      <Icons.ShieldCheck className="h-3.5 w-3.5" />
                      EEZ coverage within 200 NM
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur">
                    <div className="text-xs uppercase tracking-[0.3em] text-slate-400">Live Alerts</div>
                    <div className="mt-2 text-3xl font-semibold text-white">{oceanData?.liveAlerts || '12'}</div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-cyan-200/80">
                      <Icons.AlertTriangle className="h-3.5 w-3.5" />
                      Fisheries, navic, and weather
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
                    className="relative mx-auto aspect-[3/4] w-full max-w-[360px]"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.9, delay: 0.2 }}
                  >
                    <motion.div
                      className="absolute inset-0 rounded-full border border-cyan-400/30"
                      animate={{ opacity: [0.4, 0.9, 0.4] }}
                      transition={{ duration: 6, repeat: Infinity }}
                    />
                    <motion.div
                      className="absolute inset-8 rounded-full border border-cyan-400/20"
                      animate={{ opacity: [0.2, 0.6, 0.2], scale: [0.95, 1.05, 0.95] }}
                      transition={{ duration: 8, repeat: Infinity }}
                    />
                    <motion.svg
                      viewBox="0 0 400 520"
                      className="relative h-full w-full"
                      initial={{ rotate: -2 }}
                      animate={{ rotate: 0 }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                    >
                      <defs>
                        <radialGradient id="heroWaterGradient" cx="50%" cy="45%" r="65%">
                          <stop offset="0%" stopColor="rgba(56,189,248,0.25)" />
                          <stop offset="60%" stopColor="rgba(8,47,73,0.45)" />
                          <stop offset="100%" stopColor="rgba(2,6,23,0.9)" />
                        </radialGradient>
                        <linearGradient id="heroLandGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#38bdf8" />
                          <stop offset="45%" stopColor="#0ea5e9" />
                          <stop offset="100%" stopColor="#0f172a" />
                        </linearGradient>
                        <radialGradient id="heroEEZGradient" cx="50%" cy="50%" r="60%">
                          <stop offset="0%" stopColor="rgba(14,165,233,0.32)" />
                          <stop offset="55%" stopColor="rgba(8,145,178,0.18)" />
                          <stop offset="100%" stopColor="rgba(8,47,73,0)" />
                        </radialGradient>
                        <filter id="heroMapGlow" x="-30%" y="-30%" width="160%" height="160%">
                          <feGaussianBlur stdDeviation="12" result="coloredBlur" />
                          <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>

                      <circle cx="200" cy="260" r="190" fill="url(#heroWaterGradient)" />
                      <circle cx="200" cy="260" r="150" fill="url(#heroEEZGradient)" />

                      <motion.circle
                        cx="200"
                        cy="260"
                        r="180"
                        fill="none"
                        stroke="rgba(56,189,248,0.35)"
                        strokeWidth="2"
                        strokeDasharray="6 14"
                        animate={{ strokeDashoffset: [0, -120] }}
                        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
                      />

                      <motion.path
                        d="M228 65c-52 15-93 58-103 110-7 38 3 77 16 114 14 38 21 84 4 126-11 28 11 62 38 79 30 19 72 21 100-1 29-22 45-67 44-113-2-62-20-122-43-176-14-32-32-64-55-88-13-14-27-42-1-51z"
                        fill="url(#heroLandGradient)"
                        stroke="rgba(148, 223, 255, 0.7)"
                        strokeWidth="8"
                        strokeLinejoin="round"
                        filter="url(#heroMapGlow)"
                      />

                      <motion.path
                        d="M205 110c-22 28-45 78-36 118 11 48 34 96 12 144"
                        fill="none"
                        stroke="rgba(248,250,252,0.3)"
                        strokeWidth="3"
                        strokeDasharray="8 12"
                        animate={{ strokeDashoffset: [0, 24] }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                      />

                      {[0, 60, -60, 120].map((angle, index) => (
                        <motion.circle
                          key={index}
                          cx={200 + Math.cos((angle * Math.PI) / 180) * 140}
                          cy={260 + Math.sin((angle * Math.PI) / 180) * 140}
                          r="6"
                          fill="rgba(56,189,248,0.6)"
                          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                          transition={{ duration: 4 + index, repeat: Infinity, delay: index * 0.6 }}
                        />
                      ))}
                    </motion.svg>

                    <motion.div
                      className="pointer-events-none absolute inset-0 flex items-center justify-center"
                      animate={{ scale: [0.94, 1, 0.94] }}
                      transition={{ duration: 6, repeat: Infinity }}
                    >
                      <div className="flex h-28 w-28 items-center justify-center rounded-full bg-slate-900/70 shadow-inner shadow-cyan-500/20">
                        <AppImage
                          src="/assets/nara-logo.png"
                          alt="NARA crest"
                          className="h-20 w-20 object-contain"
                          style={{ animation: 'spin 18s linear infinite' }}
                        />
                      </div>
                    </motion.div>
                  </motion.div>

                  <div className="mt-10 space-y-4 text-sm text-slate-300/90">
                    <div className="flex items-center justify-between rounded-2xl border border-slate-800/70 bg-slate-900/60 px-4 py-3">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-200/80">Sovereign Waters</p>
                        <p className="text-base font-semibold text-white">200 NM EEZ Radius</p>
                      </div>
                      <Icons.Waves className="h-5 w-5 text-cyan-300" />
                    </div>
                    <div className="flex items-center justify-between rounded-2xl border border-slate-800/70 bg-slate-900/60 px-4 py-3">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-200/80">Last Sync</p>
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
                Research Excellence
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Leading ocean research with cutting-edge technology and scientific innovation
            </p>
          </motion.div>

          {/* Research Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {researchAreas.map((area, index) => (
              <motion.div
                key={index}
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
                Real-Time
                <span className="block bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                  Ocean Intelligence
                </span>
              </h2>
              <p className="text-gray-400 mb-8 text-lg">
                Monitor ocean conditions, marine traffic, and environmental data in real-time 
                with our advanced satellite and sensor network covering Sri Lankan waters.
              </p>
              
              {/* Live Data Points */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-300">127 Active Research Stations</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-300">3,847 Marine Species Tracked</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-300">15 Research Vessels at Sea</span>
                </div>
              </div>
              
              <Link to="/ocean-intelligence-dashboard">
                <button className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full hover:scale-105 transition-all duration-300">
                  <span className="flex items-center gap-2 text-white font-semibold">
                    Access Live Dashboard
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
                  <div className="text-2xl font-bold text-white">28.5°C</div>
                  <div className="text-xs text-white/80">Ocean Temp</div>
                </motion.div>
                
                <motion.div
                  animate={{ y: [5, -5, 5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -bottom-4 -left-4 bg-gradient-to-br from-green-600 to-teal-600 rounded-xl p-4 backdrop-blur-xl"
                >
                  <div className="text-2xl font-bold text-white">7.8</div>
                  <div className="text-xs text-white/80">pH Level</div>
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
                Protecting Our Oceans
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              "Through cutting-edge research and innovation, we safeguard Sri Lanka's marine 
              ecosystems for future generations while advancing the blue economy through 
              sustainable practices and scientific excellence."
            </p>
            
            <div className="mt-12 flex items-center justify-center gap-8">
              <div className="text-center">
                <Icons.Award className="w-12 h-12 text-cyan-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-white">25+</div>
                <div className="text-sm text-gray-400">Years of Excellence</div>
              </div>
              <div className="text-center">
                <Icons.Users className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-white">500+</div>
                <div className="text-sm text-gray-400">Scientists</div>
              </div>
              <div className="text-center">
                <Icons.Globe2 className="w-12 h-12 text-purple-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-white">50+</div>
                <div className="text-sm text-gray-400">Global Partners</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Access Portal */}
      <section className="relative py-32 px-4 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-space mb-4">
              Quick Access Portal
            </h2>
            <p className="text-xl text-gray-400">Navigate to our specialized platforms</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Research Portal",
                description: "Access scientific publications and data",
                icon: Icons.Microscope,
                link: "/research-excellence-portal",
                gradient: "from-purple-600 to-pink-600"
              },
              {
                title: "Maritime Services",
                description: "Vessel tracking and port information",
                icon: Icons.Ship,
                link: "/maritime-services-hub",
                gradient: "from-blue-600 to-cyan-600"
              },
              {
                title: "Digital Marketplace",
                description: "Purchase research data and reports",
                icon: Icons.ShoppingBag,
                link: "/nara-digital-marketplace",
                gradient: "from-green-600 to-teal-600"
              }
            ].map((portal, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Link to={portal.link}>
                  <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 border border-gray-700 hover:border-cyan-500 transition-all duration-300">
                    <div className={`absolute inset-0 bg-gradient-to-br ${portal.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                    
                    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${portal.gradient} mb-4`}>
                      <portal.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-2">{portal.title}</h3>
                    <p className="text-gray-400 mb-4">{portal.description}</p>
                    
                    <div className="flex items-center gap-2 text-cyan-400 group-hover:gap-4 transition-all">
                      <span>Enter Portal</span>
                      <Icons.ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
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
                  <p className="text-cyan-300 text-xs tracking-[0.35em] uppercase">National Mission Control</p>
                  <h3 className="text-3xl md:text-4xl font-semibold font-space leading-tight">Safeguarding Sri Lanka&apos;s Blue Economy</h3>
                </div>
              </div>
              <p className="text-slate-300/90 text-lg leading-relaxed">
                The National Aquatic Resources Research & Development Agency orchestrates ocean intelligence, policy, and innovation to secure a resilient maritime future for the nation.
              </p>
            </div>

            <div className="w-full max-w-md bg-slate-900/60 border border-slate-700/40 rounded-2xl p-6 lg:p-8 backdrop-blur-xl shadow-[0_25px_80px_-40px_rgba(6,182,212,0.45)]">
              <h4 className="text-lg font-semibold mb-3">Request a Strategic Briefing</h4>
              <p className="text-sm text-slate-300/90 mb-5">
                Receive monthly intelligence dispatches, mission updates, and collaboration windows from the command center.
              </p>
              <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
                <input
                  type="text"
                  required
                  placeholder="Full name"
                  className="w-full rounded-xl bg-slate-950/60 border border-slate-700/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/70 focus:border-transparent"
                />
                <input
                  type="email"
                  required
                  placeholder="Work email"
                  className="w-full rounded-xl bg-slate-950/60 border border-slate-700/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/70 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:shadow-cyan-400/30"
                >
                  <Icons.Send className="w-4 h-4" />
                  Join the mission
                </button>
              </form>
              <p className="text-xs text-slate-400 mt-4">
                We protect your data in alignment with GovCERT SL and global research ethics protocols.
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-cyan-500/20 to-blue-600/0 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative flex items-start justify-between gap-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Research Programs</p>
                  <p className="text-4xl font-semibold text-white mt-3">42</p>
                  <p className="text-sm text-slate-400 mt-3">
                    Active ocean science missions advancing biodiversity, climate, and naval readiness.
                  </p>
                </div>
                <Icons.Microscope className="w-10 h-10 text-cyan-300" />
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-500/20 to-cyan-500/0 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative flex items-start justify-between gap-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Observatories</p>
                  <p className="text-4xl font-semibold text-white mt-3">18</p>
                  <p className="text-sm text-slate-400 mt-3">
                    Coastal, deep-sea, and satellite-linked stations monitoring the Indian Ocean corridor.
                  </p>
                </div>
                <Icons.Satellite className="w-10 h-10 text-blue-300" />
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 via-teal-500/20 to-blue-600/0 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative flex items-start justify-between gap-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Data Assets</p>
                  <p className="text-4xl font-semibold text-white mt-3">12.4M</p>
                  <p className="text-sm text-slate-400 mt-3">
                    Verified datapoints fueling analytics, conservation, and maritime decision systems.
                  </p>
                </div>
                <Icons.Database className="w-10 h-10 text-teal-300" />
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-blue-500/20 to-cyan-500/0 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative flex items-start justify-between gap-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Allied Partners</p>
                  <p className="text-4xl font-semibold text-white mt-3">65+</p>
                  <p className="text-sm text-slate-400 mt-3">
                    Government, academic, and private alliances powering ocean stewardship initiatives.
                  </p>
                </div>
                <Icons.Users className="w-10 h-10 text-cyan-200" />
              </div>
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-4">
            <div className="space-y-5">
              <h4 className="text-sm font-semibold tracking-[0.3em] uppercase text-cyan-200">Mission Pillars</h4>
              <ul className="space-y-3 text-sm text-slate-300">
                <li><Link to="/ocean-intelligence-dashboard-homepage" className="hover:text-cyan-300 transition">Ocean Intelligence Dashboard</Link></li>
                <li><Link to="/research-excellence-portal" className="hover:text-cyan-300 transition">Research Excellence Portal</Link></li>
                <li><Link to="/knowledge-discovery-center" className="hover:text-cyan-300 transition">Knowledge Discovery Center</Link></li>
                <li><Link to="/partnership-innovation-gateway" className="hover:text-cyan-300 transition">Partnership Innovation Gateway</Link></li>
              </ul>
            </div>
            <div className="space-y-5">
              <h4 className="text-sm font-semibold tracking-[0.3em] uppercase text-cyan-200">Digital Command Centers</h4>
              <ul className="space-y-3 text-sm text-slate-300">
                <li><Link to="/maritime-services-hub" className="hover:text-cyan-300 transition">Maritime Services Hub</Link></li>
                <li><Link to="/emergency-response-network" className="hover:text-cyan-300 transition">Emergency Response Network</Link></li>
                <li><Link to="/integration-systems-platform" className="hover:text-cyan-300 transition">Integration Systems Platform</Link></li>
                <li><Link to="/learning-development-academy" className="hover:text-cyan-300 transition">Learning & Development Academy</Link></li>
              </ul>
            </div>
            <div className="space-y-5">
              <h4 className="text-sm font-semibold tracking-[0.3em] uppercase text-cyan-200">Policy & Compliance</h4>
              <ul className="space-y-3 text-sm text-slate-300">
                <li><Link to="/nara-news-updates-center" className="hover:text-cyan-300 transition">Mission Bulletins</Link></li>
                <li><Link to="/payment-gateway-hub" className="hover:text-cyan-300 transition">Secure Transactions</Link></li>
                <li><a href="#" className="hover:text-cyan-300 transition">Data Protection Charter</a></li>
                <li><a href="#" className="hover:text-cyan-300 transition">Accessibility Statement</a></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-sm font-semibold tracking-[0.3em] uppercase text-cyan-200">Contact & Duty Desk</h4>
              <div className="space-y-4 text-sm text-slate-300">
                <p className="flex items-start gap-3">
                  <Icons.MapPin className="mt-0.5 w-4 h-4 text-cyan-300" />
                  Crow Island, Colombo 15, Sri Lanka
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
                  Mission operations: 08:30 - 18:00 IST
                </p>
              </div>
              <div className="flex gap-3">
                {[Icons.Twitter, Icons.Facebook, Icons.Linkedin, Icons.Youtube].map((IconComponent, index) => (
                  <a
                    key={index}
                    href="#"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700/60 bg-slate-950/40 text-slate-300 transition hover:border-cyan-400/60 hover:text-cyan-200"
                  >
                    <IconComponent className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-t border-slate-800/80 pt-8 text-xs text-slate-400">
            <p>
              © 2024 National Aquatic Resources Research & Development Agency. Crafted by www.safenetcreations.com.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a href="#" className="hover:text-cyan-300 transition">Privacy &amp; Data Ethics</a>
              <a href="#" className="hover:text-cyan-300 transition">Terms of Collaboration</a>
              <a href="#" className="hover:text-cyan-300 transition">Transparency Portal</a>
              <span className="flex items-center gap-2 text-slate-500">
                <Icons.ShieldCheck className="w-4 h-4" /> ISO 27001 | GovCERT SL Aligned
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NewHomePage;
