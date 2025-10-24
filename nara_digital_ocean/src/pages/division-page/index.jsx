import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { getDivisionBySlug } from '../../data/divisionsConfig';
import { getDivisionContent, getProjects, getTeamMembers } from '../../services/divisionsService';
import { getDefaultTeamMembers } from '../../data/divisionTeams';
import { getDefaultProjects } from '../../data/divisionProjects';
import { getDefaultImpact } from '../../data/divisionImpact';
import { getLabel } from '../../utils/divisionTranslations';
import { getDivisionImages } from '../../services/divisionImagesService';
import { getRandomDivisionImage } from '../../services/geminiImageService';
import { getDivisionHeroImages } from '../../data/divisionHeroImages';
import { getLocalDivisionImages, saveLocalDivisionImages } from '../../utils/localImageStorage';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';

const DivisionPage = () => {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const currentLang = i18n.language;

  const [divisionData, setDivisionData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [impactData, setImpactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');
  const [heroImages, setHeroImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageSource, setImageSource] = useState('default'); // 'firebase' or 'default'
  
  // Sample data for visualizations
  const researchOutputData = [
    { year: '2020', publications: 12, projects: 8 },
    { year: '2021', publications: 18, projects: 12 },
    { year: '2022', publications: 24, projects: 15 },
    { year: '2023', publications: 30, projects: 18 },
    { year: '2024', publications: 35, projects: 22 }
  ];

  useEffect(() => {
    const loadDivisionData = async () => {
      try {
        setLoading(true);

        // Load base config
        const configData = getDivisionBySlug(slug);

        if (!configData) {
          console.error('Division not found for slug:', slug);
          setLoading(false);
          return;
        }

        // Set initial data from config
        setDivisionData(configData);

        // Try to load custom content from Firebase (optional)
        try {
          const customContent = await getDivisionContent(configData.id);

          // Merge config with custom content
          if (customContent) {
            setDivisionData({ ...configData, ...customContent });
          }

          // Load projects and team
          const [projectsData, membersData] = await Promise.all([
            getProjects(configData.id),
            getTeamMembers(configData.id)
          ]);

          // Use Firebase data or fallback to default project data
          if (projectsData && projectsData.length > 0) {
            setProjects(projectsData);
          } else {
            const defaultProjects = getDefaultProjects(configData.id);
            setProjects(defaultProjects);
          }

          // Use Firebase data or fallback to default team data
          if (membersData && membersData.length > 0) {
            setTeamMembers(membersData);
          } else {
            const defaultMembers = getDefaultTeamMembers(configData.id);
            setTeamMembers(defaultMembers);
          }
        } catch (firebaseError) {
          console.log('Firebase data not available, using defaults:', firebaseError);
          // Load default data when Firebase is not available
          const defaultProjects = getDefaultProjects(configData.id);
          const defaultMembers = getDefaultTeamMembers(configData.id);
          setProjects(defaultProjects);
          setTeamMembers(defaultMembers);
        }

        // Load impact data
        const impact = getDefaultImpact(configData.id);
        setImpactData(impact);

        // Load division images - Try multiple sources (Firebase → localStorage → Default)
        let imagesLoaded = false;
        
        try {
          // PRIORITY 1: Try localStorage first (works immediately!)
          console.log('🔍 Checking localStorage for division:', configData.id);
          const localImages = getLocalDivisionImages(configData.id);
          
          if (localImages && localImages.length > 0) {
            console.log('💾 SUCCESS! Loaded', localImages.length, 'images from localStorage');
            console.log('📸 Image URLs:', localImages);
            console.log('%c🎉 AI IMAGES CONNECTED TO HERO SECTION!', 'background: #10b981; color: white; padding: 8px; font-size: 14px; font-weight: bold;');
            setHeroImages(localImages);
            setImageSource('firebase'); // Set as firebase for badge display
            imagesLoaded = true;
          }
        } catch (localError) {
          console.log('localStorage check failed:', localError);
        }

        if (!imagesLoaded) {
          try {
            // PRIORITY 2: Try Firebase (requires permissions)
            console.log('🔍 Attempting to load images from Firebase:', configData.id);
            const imagesResult = await getDivisionImages(configData.id);
            
            if (imagesResult.success && imagesResult.images.length > 0) {
              console.log('✅ Loaded', imagesResult.images.length, 'images from Firebase');
              const firebaseUrls = imagesResult.images.map(img => img.url);
              setHeroImages(firebaseUrls);
              setImageSource('firebase');
              imagesLoaded = true;
              
              // Also save to localStorage for future use
              saveLocalDivisionImages(configData.id, firebaseUrls);
              
              console.log('%c🎉 FIREBASE IMAGES CONNECTED!', 'background: #3b82f6; color: white; padding: 8px; font-size: 14px; font-weight: bold;');
            }
          } catch (firebaseError) {
            console.log('Firebase not accessible (permissions):', firebaseError.message);
          }
        }

        if (!imagesLoaded) {
          // PRIORITY 3: Use pre-configured default images (always works!)
          const defaultHeroImages = getDivisionHeroImages(configData.id);
          console.log('📸 Using default hero images:', defaultHeroImages.length);
          setHeroImages(defaultHeroImages);
          setImageSource('default');
        }
      } catch (error) {
        console.error('Error loading division data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDivisionData();
  }, [slug, currentLang, navigate]);

  // Auto-rotate hero images
  useEffect(() => {
    if (heroImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [heroImages]);

  const filteredProjects = useMemo(() => {
    let filtered = projects;
    if (projectFilter !== 'all') {
      filtered = filtered.filter(p => p.status === projectFilter);
    }
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.title?.[currentLang]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.titleEN?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  }, [projects, projectFilter, searchQuery, currentLang]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="relative">
            <div className="w-24 h-24 border-8 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <LucideIcons.Fish className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-blue-600" />
          </div>
          <p className="mt-6 text-white text-lg font-semibold">Loading Division Data...</p>
        </motion.div>
      </div>
    );
  }

  if (!divisionData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center text-white">
          <LucideIcons.AlertCircle size={80} className="mx-auto mb-6 text-red-400" />
          <h2 className="text-3xl font-bold mb-4">Division Not Found</h2>
          <button
            onClick={() => navigate('/divisions')}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-full font-semibold transition-all"
          >
            Back to Divisions
          </button>
        </div>
      </div>
    );
  }

  const IconComponent = LucideIcons[divisionData.icon] || LucideIcons.Briefcase;

  const sections = [
    { id: 'overview', label: { en: 'Overview', si: 'දළ විශ්ලේෂණය', ta: 'கண்ணோட்டம்' }, icon: 'Info' },
    { id: 'focus', label: { en: 'Focus Areas', si: 'අවධාන ක්ෂේත්‍ර', ta: 'கவன பகுதிகள்' }, icon: 'Target' },
    { id: 'services', label: { en: 'Services', si: 'සේවා', ta: 'சேவைகள்' }, icon: 'Briefcase' },
    { id: 'projects', label: { en: 'Projects', si: 'ව්‍යාපෘති', ta: 'திட்டங்கள்' }, icon: 'FolderKanban' },
    { id: 'research', label: { en: 'Research', si: 'පර්යේෂණ', ta: 'ஆராய்ச்சி' }, icon: 'FlaskConical' },
    { id: 'team', label: { en: 'Our Team', si: 'අපගේ කණ්ඩායම', ta: 'எங்கள் குழு' }, icon: 'Users' },
    { id: 'impact', label: { en: 'Impact', si: 'බලපෑම', ta: 'தாக்கம்' }, icon: 'TrendingUp' },
    { id: 'contact', label: { en: 'Contact', si: 'අමතන්න', ta: 'தொடர்பு' }, icon: 'MessageSquare' }
  ];

  // Division-specific animations and effects
  const getDivisionAnimations = () => {
    const animations = {
      'fisheries-science': {
        particleCount: 30,
        particleIcon: 'Fish',
        waveEffect: true,
        colors: ['#06b6d4', '#0891b2', '#0e7490'],
        gradientFrom: 'from-cyan-600',
        gradientVia: 'via-blue-600',
        gradientTo: 'to-teal-600'
      },
      'marine-biology': {
        particleCount: 25,
        particleIcon: 'Waves',
        coralEffect: true,
        colors: ['#14b8a6', '#0d9488', '#0f766e'],
        gradientFrom: 'from-teal-600',
        gradientVia: 'via-emerald-600',
        gradientTo: 'to-cyan-600'
      },
      'aquaculture': {
        particleCount: 20,
        particleIcon: 'Shell',
        bubbleEffect: true,
        colors: ['#8b5cf6', '#7c3aed', '#6d28d9'],
        gradientFrom: 'from-purple-600',
        gradientVia: 'via-violet-600',
        gradientTo: 'to-indigo-600'
      },
      'socio-economics': {
        particleCount: 15,
        particleIcon: 'TrendingUp',
        dataEffect: true,
        colors: ['#f59e0b', '#d97706', '#b45309'],
        gradientFrom: 'from-amber-600',
        gradientVia: 'via-orange-600',
        gradientTo: 'to-yellow-600'
      },
      'maritime-safety': {
        particleCount: 20,
        particleIcon: 'Ship',
        radarEffect: true,
        colors: ['#3b82f6', '#2563eb', '#1d4ed8'],
        gradientFrom: 'from-blue-600',
        gradientVia: 'via-indigo-600',
        gradientTo: 'to-cyan-600'
      },
      'post-harvest': {
        particleCount: 18,
        particleIcon: 'Package',
        techEffect: true,
        colors: ['#10b981', '#059669', '#047857'],
        gradientFrom: 'from-emerald-600',
        gradientVia: 'via-green-600',
        gradientTo: 'to-teal-600'
      },
      'research-training': {
        particleCount: 25,
        particleIcon: 'Microscope',
        scienceEffect: true,
        colors: ['#ec4899', '#db2777', '#be185d'],
        gradientFrom: 'from-pink-600',
        gradientVia: 'via-rose-600',
        gradientTo: 'to-red-600'
      },
      'limnology': {
        particleCount: 22,
        particleIcon: 'Droplets',
        waterEffect: true,
        colors: ['#06b6d4', '#0891b2', '#0e7490'],
        gradientFrom: 'from-cyan-600',
        gradientVia: 'via-sky-600',
        gradientTo: 'to-blue-600'
      }
    };
    return animations[divisionData.id] || animations['fisheries-science'];
  };

  const divisionAnim = getDivisionAnimations();
  const ParticleIcon = LucideIcons[divisionAnim.particleIcon] || LucideIcons.Circle;

  // Get unique page theme based on division
  const getPageTheme = () => {
    const themes = {
      'fisheries-science': {
        layout: 'ocean-waves',
        bg: 'bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900',
        accent: 'cyan',
        heroHeight: 'h-[50vh]',
        cardStyle: 'wave-cards'
      },
      'marine-biology': {
        layout: 'ecosystem-grid',
        bg: 'bg-gradient-to-br from-teal-950 via-emerald-950 to-slate-900',
        accent: 'teal',
        heroHeight: 'h-[45vh]',
        cardStyle: 'coral-cards'
      },
      'aquaculture': {
        layout: 'tech-modern',
        bg: 'bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950',
        accent: 'purple',
        heroHeight: 'h-[50vh]',
        cardStyle: 'tech-cards'
      },
      'socio-economics': {
        layout: 'data-dashboard',
        bg: 'bg-gradient-to-br from-amber-950 via-slate-900 to-orange-950',
        accent: 'amber',
        heroHeight: 'h-[45vh]',
        cardStyle: 'chart-cards'
      },
      'maritime-safety': {
        layout: 'navigation-map',
        bg: 'bg-gradient-to-br from-blue-950 via-slate-900 to-cyan-950',
        accent: 'blue',
        heroHeight: 'h-[50vh]',
        cardStyle: 'nav-cards'
      },
      'post-harvest': {
        layout: 'process-flow',
        bg: 'bg-gradient-to-br from-green-950 via-slate-900 to-teal-950',
        accent: 'emerald',
        heroHeight: 'h-[45vh]',
        cardStyle: 'flow-cards'
      },
      'research-training': {
        layout: 'academic-journal',
        bg: 'bg-gradient-to-br from-rose-950 via-slate-900 to-pink-950',
        accent: 'pink',
        heroHeight: 'h-[50vh]',
        cardStyle: 'paper-cards'
      },
      'limnology': {
        layout: 'water-ripple',
        bg: 'bg-gradient-to-br from-cyan-950 via-slate-900 to-sky-950',
        accent: 'sky',
        heroHeight: 'h-[45vh]',
        cardStyle: 'water-cards'
      }
    };
    return themes[divisionData.id] || themes['fisheries-science'];
  };

  const pageTheme = getPageTheme();

  return (
    <div className={`min-h-screen ${pageTheme.bg}`}>
      {/* COMPACT HERO SECTION - 45-50vh with Image Carousel */}
      <section className={`relative ${pageTheme.heroHeight} overflow-hidden`}>
        {/* Background Image Carousel with Ken Burns Effect */}
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="absolute inset-0"
              onAnimationStart={() => {
                const imageUrl = heroImages[currentImageIndex] || divisionData.heroImage;
                console.log(`🖼️ Displaying image ${currentImageIndex + 1}/${heroImages.length}:`, imageUrl);
              }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url("${heroImages[currentImageIndex] || divisionData.heroImage}")`,
                  filter: 'brightness(0.9)'
                }}
              />
              {/* Gradient Overlay for Better Text Visibility */}
              <div className={`absolute inset-0 bg-gradient-to-br ${divisionAnim.gradientFrom} ${divisionAnim.gradientVia} ${divisionAnim.gradientTo} opacity-40`} />
            </motion.div>
          </AnimatePresence>

          {/* Image Source Badge */}
          {imageSource === 'firebase' && (
            <div className="absolute top-4 right-4 z-10">
              <div className="bg-green-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                <LucideIcons.CheckCircle size={16} />
                AI Images Active
              </div>
            </div>
          )}

          {/* Image Navigation Dots */}
          {heroImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 z-10">
              <div className="flex gap-2">
                {heroImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      idx === currentImageIndex
                        ? 'bg-white w-8'
                        : 'bg-white/40 hover:bg-white/60'
                    }`}
                    aria-label={`Go to image ${idx + 1}`}
                  />
                ))}
              </div>
              <div className="text-white/80 text-xs font-medium bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                {currentImageIndex + 1} / {heroImages.length}
              </div>
            </div>
          )}
        </div>

        {/* Animated Gradient Overlay - Reduced opacity */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Overlay Pattern - Very subtle */}
          <motion.div
            animate={{ backgroundPosition: ['0px 0px', '60px 60px'] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(45deg, rgba(255,255,255,0.05) 25%, transparent 25%),
                linear-gradient(-45deg, rgba(255,255,255,0.05) 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.05) 75%),
                linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.05) 75%)
              `,
              backgroundSize: '60px 60px',
              backgroundPosition: '0 0, 0 30px, 30px -30px, -30px 0px'
            }}
          />
        </div>

        {/* Floating Animated Particles - Division Specific */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(divisionAnim.particleCount)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: typeof window !== 'undefined' ? window.innerHeight + 100 : 1000,
                opacity: 0,
                scale: 0.5 + Math.random() * 0.5
              }}
              animate={{
                y: -100,
                x: [
                  null,
                  Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000)
                ],
                opacity: [0, 0.6, 0.8, 0.6, 0],
                rotate: [0, 360],
                scale: [null, 1, 0.8, 1, 0.5]
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: 'easeInOut'
              }}
            >
              <ParticleIcon 
                className="text-white/30" 
                size={20 + Math.random() * 30}
                style={{ filter: `drop-shadow(0 0 8px ${divisionAnim.colors[i % 3]})` }}
              />
            </motion.div>
          ))}
        </div>

        {/* Wave Effect for Marine Divisions */}
        {divisionAnim.waveEffect && (
          <div className="absolute bottom-0 left-0 right-0 h-32 opacity-20">
            <motion.svg
              viewBox="0 0 1440 320"
              className="absolute bottom-0 w-full"
              animate={{ x: [0, -100, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            >
              <path fill="rgba(255,255,255,0.3)" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </motion.svg>
          </div>
        )}

        {/* COMPACT Hero Content */}
        <div className="relative h-full flex items-center px-4">
          <div className="max-w-7xl mx-auto w-full">
            <motion.button
              onClick={() => navigate('/divisions')}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 flex items-center gap-2 text-white/90 hover:text-white transition-all group"
            >
              <LucideIcons.ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back</span>
            </motion.button>

            <div className="flex items-center gap-6 mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
                className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/20"
              >
                <IconComponent size={48} strokeWidth={1.5} />
              </motion.div>
              
              <div className="flex-1">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl md:text-5xl font-bold mb-2 text-white"
                >
                  {divisionData.name[currentLang]}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg text-white/90"
                >
                  {divisionData.tagline[currentLang]}
                </motion.p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              {[
                { icon: 'Target', value: divisionData.focusAreas.length, label: 'Focus' },
                { icon: 'Briefcase', value: divisionData.services.length, label: 'Services' },
                { icon: 'FolderKanban', value: projects.length || 12, label: 'Projects' },
                { icon: 'Users', value: teamMembers.length || 20, label: 'Team' }
              ].map((stat, i) => {
                const StatIcon = LucideIcons[stat.icon];
                return (
                  <div key={i} className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20 flex items-center gap-2 text-white">
                    <StatIcon size={16} />
                    <span className="font-bold">{stat.value}</span>
                    <span className="text-sm opacity-80">{stat.label}</span>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Sticky Navigation */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-xl shadow-lg z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto scrollbar-hide">
            {sections.map((section) => {
              const SectionIcon = LucideIcons[section.icon];
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-3 px-6 py-4 font-semibold whitespace-nowrap transition-all border-b-4 relative group ${
                    activeSection === section.id
                      ? `border-blue-600 text-blue-600 bg-blue-50/50`
                      : 'border-transparent text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  <SectionIcon size={20} className={activeSection === section.id ? 'animate-pulse' : ''} />
                  <span>{section.label[currentLang]}</span>
                  {activeSection === section.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Overview Section - Enhanced */}
        {activeSection === 'overview' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Main Description Card */}
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl p-8 border border-blue-100">
              <div className="flex items-start gap-4 mb-6">
                <div className={`bg-gradient-to-r ${divisionData.gradient} p-4 rounded-2xl text-white`}>
                  <IconComponent size={40} />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2 text-gray-900">
                    {currentLang === 'en' && 'About This Division'}
                    {currentLang === 'si' && 'මෙම අංශය ගැන'}
                    {currentLang === 'ta' && 'இந்தப் பிரிவு பற்றி'}
                  </h2>
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                      {divisionData.color} Division
                    </span>
                    {divisionData.pdfResource && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold flex items-center gap-1">
                        <LucideIcons.FileText size={14} />
                        PDF Available
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {divisionData.description[currentLang]}
              </p>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 p-4 bg-blue-50 rounded-xl">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{divisionData.focusAreas.length}</div>
                  <div className="text-sm text-gray-600 font-medium">
                    {currentLang === 'en' && 'Focus Areas'}
                    {currentLang === 'si' && 'අවධාන ක්ෂේත්‍ර'}
                    {currentLang === 'ta' && 'கவன பகுதிகள்'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{divisionData.services.length}</div>
                  <div className="text-sm text-gray-600 font-medium">
                    {currentLang === 'en' && 'Services'}
                    {currentLang === 'si' && 'සේවා'}
                    {currentLang === 'ta' && 'சேவைகள்'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{projects.length || '10+'}</div>
                  <div className="text-sm text-gray-600 font-medium">
                    {currentLang === 'en' && 'Projects'}
                    {currentLang === 'si' && 'ව්‍යාපෘති'}
                    {currentLang === 'ta' && 'திட்டங்கள்'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">{teamMembers.length || '15+'}</div>
                  <div className="text-sm text-gray-600 font-medium">
                    {currentLang === 'en' && 'Experts'}
                    {currentLang === 'si' && 'ප්‍රවීණයින්'}
                    {currentLang === 'ta' && 'நிபுணர்கள்'}
                  </div>
                </div>
              </div>
            </div>

            {/* Mission & Vision Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-600">
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <LucideIcons.Target size={24} className="text-blue-600" />
                  {currentLang === 'en' && 'Our Mission'}
                  {currentLang === 'si' && 'අපගේ මෙහෙවර'}
                  {currentLang === 'ta' && 'எங்கள் நோக்கம்'}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {currentLang === 'en' && `To advance ${divisionData.name.en.toLowerCase()} through cutting-edge research, innovation, and sustainable practices that benefit Sri Lanka's marine and aquatic resources.`}
                  {currentLang === 'si' && `ශ්‍රී ලංකාවේ සමුද්‍ර සහ ජලජ සම්පත් වලට ප්‍රයෝජන වන අති නවීන පර්යේෂණ, නවෝත්පාදන සහ තිරසාර පිළිවෙත් හරහා ${divisionData.name.si} දියුණු කිරීම.`}
                  {currentLang === 'ta' && `இலங்கையின் கடல் மற்றும் நீர்வள வளங்களுக்கு பயனளிக்கும் அதிநவீன ஆராய்ச்சி, புதுமை மற்றும் நிலையான நடைமுறைகள் மூலம் ${divisionData.name.ta} முன்னேற்றுதல்.`}
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-600">
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <LucideIcons.Eye size={24} className="text-green-600" />
                  {currentLang === 'en' && 'Our Vision'}
                  {currentLang === 'si' && 'අපගේ දැක්ම'}
                  {currentLang === 'ta' && 'எங்கள் பார்வை'}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {currentLang === 'en' && 'To be a regional leader in marine and aquatic research, recognized for scientific excellence, innovation, and positive impact on sustainable development and community well-being.'}
                  {currentLang === 'si' && 'විද්‍යාත්මක විශිෂ්ටත්වය, නවෝත්පාදනය සහ තිරසාර සංවර්ධනය සහ ප්‍රජා යහපැවැත්ම කෙරෙහි ධනාත්මක බලපෑම සඳහා පිළිගත් සමුද්‍ර සහ ජලජ පර්යේෂණ පිළිබඳ කලාපීය ප්‍රමුඛයා වීම.'}
                  {currentLang === 'ta' && 'அறிவியல் சிறப்பு, புதுமை மற்றும் நிலையான வளர்ச்சி மற்றும் சமூக நல்வாழ்வில் நேர்மறை தாக்கத்திற்காக அங்கீகரிக்கப்பட்ட கடல் மற்றும் நீர்வள ஆராய்ச்சியில் பிராந்திய தலைவராக இருத்தல்.'}
                </p>
              </div>
            </div>

            {/* Key Highlights */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <LucideIcons.Star size={24} className="text-yellow-500" />
                {currentLang === 'en' && 'Key Highlights'}
                {currentLang === 'si' && 'ප්‍රධාන ඉස්මතු කිරීම්'}
                {currentLang === 'ta' && 'முக்கிய சிறப்பம்சங்கள்'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.length > 0 && (
                  <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                    <LucideIcons.Rocket size={24} className="text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-bold text-gray-900">
                        {currentLang === 'en' && 'Active Research Projects'}
                        {currentLang === 'si' && 'ක්‍රියාත්මක පර්යේෂණ ව්‍යාපෘති'}
                        {currentLang === 'ta' && 'செயலில் உள்ள ஆராய்ச்சி திட்டங்கள்'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {projects.length} {currentLang === 'en' && 'ongoing projects with international funding'}
                        {currentLang === 'si' && 'ජාත්‍යන්තර අරමුදල් සමඟ ක්‍රියාත්මක ව්‍යාපෘති'}
                        {currentLang === 'ta' && 'சர்வதேச நிதியுதவியுடன் நடந்துகொண்டிருக்கும் திட்டங்கள்'}
                      </div>
                    </div>
                  </div>
                )}
                
                {teamMembers.length > 0 && (
                  <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
                    <LucideIcons.Users size={24} className="text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-bold text-gray-900">
                        {currentLang === 'en' && 'Expert Research Team'}
                        {currentLang === 'si' && 'ප්‍රවීණ පර්යේෂණ කණ්ඩායම'}
                        {currentLang === 'ta' && 'நிபுணர் ஆராய்ச்சி குழு'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {teamMembers.length} {currentLang === 'en' && 'scientists with advanced degrees and international experience'}
                        {currentLang === 'si' && 'උසස් උපාධි සහ ජාත්‍යන්තර අත්දැකීම් ඇති විද්‍යාඥයින්'}
                        {currentLang === 'ta' && 'மேம்பட்ட பட்டங்கள் மற்றும் சர்வதேச அனுபவம் கொண்ட விஞ்ஞானிகள்'}
                      </div>
                    </div>
                  </div>
                )}

                {impactData && (
                  <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl">
                    <LucideIcons.TrendingUp size={24} className="text-purple-600 flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-bold text-gray-900">
                        {currentLang === 'en' && 'Measurable Impact'}
                        {currentLang === 'si' && 'මැනිය හැකි බලපෑම'}
                        {currentLang === 'ta' && 'அளவிடக்கூடிய தாக்கம்'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {impactData.economicImpact?.valueGenerated} {currentLang === 'en' && 'in economic value with'}
                        {currentLang === 'si' && 'ආර්ථික වටිනාකම සමඟ'}
                        {currentLang === 'ta' && 'பொருளாதார மதிப்புடன்'} {impactData.economicImpact?.jobsCreated}+ {currentLang === 'en' && 'jobs created'}
                        {currentLang === 'si' && 'රැකියා නිර්මාණය'}
                        {currentLang === 'ta' && 'வேலைகள் உருவாக்கப்பட்டன'}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-xl">
                  <LucideIcons.Award size={24} className="text-orange-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-bold text-gray-900">
                      {currentLang === 'en' && 'International Recognition'}
                      {currentLang === 'si' && 'ජාත්‍යන්තර පිළිගැනීම'}
                      {currentLang === 'ta' && 'சர்வதேச அங்கீகாரம்'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {currentLang === 'en' && 'Collaborating with leading global organizations and research institutions'}
                      {currentLang === 'si' && 'ප්‍රමුඛ ගෝලීය සංවිධාන සහ පර්යේෂණ ආයතන සමඟ සහයෝගයෙන්'}
                      {currentLang === 'ta' && 'முன்னணி உலகளாவிய அமைப்புகள் மற்றும் ஆராய்ச்சி நிறுவனங்களுடன் ஒத்துழைத்தல்'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <LucideIcons.Contact size={24} className="text-blue-600" />
                {currentLang === 'en' && 'Contact Information'}
                {currentLang === 'si' && 'සම්බන්ධතා තොරතුරු'}
                {currentLang === 'ta' && 'தொடர்பு தகவல்'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <LucideIcons.Mail size={20} className="text-blue-600" />
                  <div>
                    <div className="text-xs text-gray-500">Email</div>
                    <a href={`mailto:${divisionData.contactEmail}`} className="text-blue-600 font-medium hover:underline">
                      {divisionData.contactEmail}
                    </a>
                  </div>
                </div>
                {divisionData.contactPhone && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <LucideIcons.Phone size={20} className="text-green-600" />
                    <div>
                      <div className="text-xs text-gray-500">Phone</div>
                      <a href={`tel:${divisionData.contactPhone}`} className="text-green-600 font-medium hover:underline">
                        {divisionData.contactPhone}
                      </a>
                    </div>
                  </div>
                )}
                {divisionData.location && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <LucideIcons.MapPin size={20} className="text-purple-600" />
                    <div>
                      <div className="text-xs text-gray-500">Location</div>
                      <div className="text-purple-600 font-medium text-sm">
                        {divisionData.location}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.section>
        )}

        {/* Focus Areas Section */}
        {activeSection === 'focus' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-gray-900">
              <LucideIcons.Target className="text-blue-600" size={32} />
              {currentLang === 'en' && 'Research Focus Areas'}
              {currentLang === 'si' && 'පර්යේෂණ අවධාන ක්ෂේත්‍ර'}
              {currentLang === 'ta' && 'ஆராய்ச்சி கவன பகுதிகள்'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {divisionData.focusAreas.map((area, index) => {
                const AreaIcon = LucideIcons[area.icon] || LucideIcons.Circle;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`bg-gradient-to-r ${divisionData.gradient} p-3 rounded-xl text-white`}>
                        <AreaIcon size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2 text-gray-900">
                          {area.title[currentLang]}
                        </h3>
                        <p className="text-gray-600">
                          {area.description[currentLang]}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* Services Section */}
        {activeSection === 'services' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-gray-900">
              <LucideIcons.Briefcase className="text-blue-600" size={32} />
              {currentLang === 'en' && 'Services We Offer'}
              {currentLang === 'si' && 'අප සපයන සේවා'}
              {currentLang === 'ta' && 'நாங்கள் வழங்கும் சேவைகள்'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {divisionData.services.map((service, index) => {
                const ServiceIcon = LucideIcons[service.icon] || LucideIcons.CheckCircle;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:-translate-y-2"
                  >
                    <div className={`bg-gradient-to-r ${divisionData.gradient} w-16 h-16 rounded-xl flex items-center justify-center text-white mb-4`}>
                      <ServiceIcon size={28} />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">
                      {service.title[currentLang]}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {service.description[currentLang]}
                    </p>
                    <button className="text-blue-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                      {currentLang === 'en' && 'Learn More'}
                      {currentLang === 'si' && 'වැඩිදුර දැනගන්න'}
                      {currentLang === 'ta' && 'மேலும் அறிக'}
                      <LucideIcons.ArrowRight size={16} />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* Research Data Visualization Section */}
        {activeSection === 'research' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold text-slate-800 mb-4">Research Excellence</h2>
              <p className="text-xl text-slate-600">Data-driven insights shaping the future of marine science</p>
            </div>

            {/* Research Output Trends Chart */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <LucideIcons.TrendingUp className="text-green-600" size={28} />
                Research Output Trends (2020-2024)
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={researchOutputData}>
                  <defs>
                    <linearGradient id="colorPubs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProj" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="year" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '12px' }}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="publications" 
                    stroke="#3b82f6" 
                    fillOpacity={1} 
                    fill="url(#colorPubs)"
                    name="Publications"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="projects" 
                    stroke="#10b981" 
                    fillOpacity={1} 
                    fill="url(#colorProj)"
                    name="Research Projects"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Key Research Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: 'BookOpen', label: 'Total Publications', value: '150+', trend: '+35% YoY', color: 'blue' },
                { icon: 'Award', label: 'Research Awards', value: '28', trend: '+8 this year', color: 'yellow' },
                { icon: 'Globe', label: 'International Partners', value: '32', trend: '18 countries', color: 'green' }
              ].map((metric, index) => {
                const MetricIcon = LucideIcons[metric.icon];
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg p-8 border border-blue-100 hover:shadow-2xl transition-all hover:-translate-y-2"
                  >
                    <div className={`bg-${metric.color}-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-4`}>
                      <MetricIcon className={`text-${metric.color}-600`} size={32} />
                    </div>
                    <div className="text-4xl font-bold text-slate-800 mb-2">{metric.value}</div>
                    <div className="text-slate-600 font-medium mb-2">{metric.label}</div>
                    <div className="text-sm text-green-600 font-semibold">{metric.trend}</div>
                  </motion.div>
                );
              })}
            </div>

            {/* Research Impact Statement */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl shadow-xl p-10 text-white">
              <div className="flex items-start gap-6">
                <div className="bg-white/20 p-4 rounded-2xl">
                  <LucideIcons.Lightbulb size={48} />
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-4 text-white">Our Research Impact</h3>
                  <p className="text-xl opacity-95 leading-relaxed mb-6">
                    Our division has contributed significantly to sustainable fisheries management through cutting-edge research, 
                    influencing policy decisions and conservation strategies across the Indian Ocean region.
                  </p>
                  <div className="flex gap-4">
                    <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-white">
                      <span className="font-bold text-2xl">45+</span> Policy Contributions
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-white">
                      <span className="font-bold text-2xl">12</span> Conservation Programs
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Projects Section */}
        {activeSection === 'projects' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-gray-900">
              <LucideIcons.FolderOpen className="text-blue-600" size={32} />
              {currentLang === 'en' && 'Active Projects'}
              {currentLang === 'si' && 'ක්‍රියාකාරී ව්‍යාපෘති'}
              {currentLang === 'ta' && 'செயலில் உள்ள திட்டங்கள்'}
            </h2>
            {projects.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <LucideIcons.FolderOpen size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">
                  {currentLang === 'en' && 'No projects available yet'}
                  {currentLang === 'si' && 'තවම ව්‍යාපෘති නොමැත'}
                  {currentLang === 'ta' && 'இன்னும் திட்டங்கள் இல்லை'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-2 text-gray-900">
                          {project.title?.[currentLang] || project.titleEN}
                        </h3>
                        <p className="text-gray-600">
                          {project.description?.[currentLang] || project.descriptionEN}
                        </p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        project.status === 'Active' ? 'bg-green-100 text-green-700' :
                        project.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {project.status === 'Active' ? getLabel('active', currentLang) : 
                         project.status === 'Completed' ? getLabel('completed', currentLang) : 
                         project.status}
                      </span>
                    </div>
                    {project.startDate && (
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-4">
                        <span className="flex items-center gap-1">
                          <LucideIcons.Calendar size={16} />
                          {project.startDate} - {project.endDate || getLabel('ongoing', currentLang)}
                        </span>
                        {project.fundingSource && (
                          <span className="flex items-center gap-1">
                            <LucideIcons.DollarSign size={16} />
                            {project.fundingSource}
                          </span>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>
        )}

        {/* Team Section */}
        {activeSection === 'team' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-gray-900">
              <LucideIcons.Users className="text-blue-600" size={32} />
              {currentLang === 'en' && 'Meet Our Team'}
              {currentLang === 'si' && 'අපගේ කණ්ඩායම හමුවන්න'}
              {currentLang === 'ta' && 'எங்கள் குழுவைச் சந்திக்கவும்'}
            </h2>
            {teamMembers.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <LucideIcons.Users size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">
                  {currentLang === 'en' && 'Team information coming soon'}
                  {currentLang === 'si' && 'කණ්ඩායම් තොරතුරු ඉක්මනින්'}
                  {currentLang === 'ta' && 'குழு தகவல் விரைவில்'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={member.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100"
                  >
                    <div className="p-8">
                      <div className="flex items-start gap-6 mb-6">
                        {/* Profile Photo */}
                        <div className="w-24 h-24 flex-shrink-0 rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                          {member.photoUrl ? (
                            <img src={member.photoUrl} alt={member.name?.[currentLang] || member.name?.en} className="w-full h-full rounded-2xl object-cover" />
                          ) : (
                            (member.name?.[currentLang] || member.name?.en)?.charAt(0)
                          )}
                        </div>

                        {/* Name & Position */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {member.name?.[currentLang] || member.name?.en}
                          </h3>
                          <p className="text-blue-600 font-semibold mb-1">
                            {typeof member.position === 'object' ? member.position[currentLang] || member.position.en : member.position}
                          </p>
                          {member.role && (
                            <p className="text-gray-600 text-sm mb-3">
                              {typeof member.role === 'object' ? member.role[currentLang] || member.role.en : member.role}
                            </p>
                          )}
                          
                          {/* Contact Info */}
                          <div className="flex flex-wrap gap-3">
                            {member.email && (
                              <a 
                                href={`mailto:${member.email}`} 
                                className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                              >
                                <LucideIcons.Mail size={14} />
                                {member.email}
                              </a>
                            )}
                            {member.phone && (
                              <a 
                                href={`tel:${member.phone}`} 
                                className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                              >
                                <LucideIcons.Phone size={14} />
                                {member.phone}
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Bio */}
                      {member.bio && (
                        <p className="text-gray-700 text-sm leading-relaxed mb-6">
                          {typeof member.bio === 'object' ? member.bio[currentLang] || member.bio.en : member.bio}
                        </p>
                      )}

                      {/* Education */}
                      {member.education && (
                        <div className="mb-5 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                          <div className="flex items-start gap-2">
                            <LucideIcons.GraduationCap className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
                            <div className="text-gray-900">
                              <p className="text-xs font-semibold text-blue-900 uppercase tracking-wide mb-1">{getLabel('education', currentLang)}</p>
                              <p className="text-sm text-gray-700">
                                {typeof member.education === 'object' ? member.education[currentLang] || member.education.en : member.education}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Expertise Tags */}
                      {member.expertise && member.expertise.length > 0 && (
                        <div className="mb-5">
                          <div className="flex items-center gap-2 mb-3">
                            <LucideIcons.Lightbulb className="text-amber-600" size={16} />
                            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">{getLabel('areasOfExpertise', currentLang)}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {member.expertise.map((skill, i) => (
                              <span 
                                key={i} 
                                className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 text-xs font-medium rounded-full border border-gray-200"
                              >
                                {typeof skill === 'object' ? skill[currentLang] || skill.en : skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Publications Count */}
                      {member.publications && (
                        <div className="flex items-center gap-3 pt-5 border-t border-gray-100">
                          <div className="flex items-center gap-2 text-gray-600">
                            <LucideIcons.FileText size={16} />
                            <span className="text-sm font-medium">
                              <span className="text-blue-600 font-bold">{member.publications}</span> {getLabel('publications', currentLang)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>
        )}

        {/* ENHANCED Impact & Analytics Section */}
        {activeSection === 'impact' && impactData && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-10"
          >
            {/* Header */}
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold text-slate-900 mb-4">
                {currentLang === 'en' && 'Impact & Analytics'}
                {currentLang === 'si' && 'බලපෑම සහ විශ්ලේෂණ'}
                {currentLang === 'ta' && 'தாக்கம் மற்றும் பகுப்பாய்வு'}
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Data-driven insights demonstrating our contribution to marine conservation and sustainable development
              </p>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              {impactData.keyMetrics.map((metric, index) => {
                const MetricIcon = LucideIcons[metric.icon];
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                    className={`bg-gradient-to-br from-${metric.color}-50 to-white border-2 border-${metric.color}-200 rounded-2xl p-6 shadow-md`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-${metric.color}-100`}>
                        <MetricIcon className={`text-${metric.color}-600`} size={28} />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold bg-${metric.color}-100 text-${metric.color}-700`}>
                        {metric.trend}
                      </span>
                    </div>
                    <div className="text-4xl font-black text-slate-900 mb-2">{metric.value}</div>
                    <div className="text-sm font-semibold text-slate-600">{metric.label}</div>
                  </motion.div>
                );
              })}
            </div>

            {/* Research Output Chart */}
            {impactData.researchOutput && (
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-slate-900">{getLabel('researchPublicationsTrend', currentLang)}</h3>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span>{getLabel('publications', currentLang)} ({impactData.researchOutput.citations} {getLabel('citations', currentLang)})</span>
                    </div>
                    <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                      {getLabel('hIndex', currentLang)}: {impactData.researchOutput.hIndex}
                    </div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={impactData.researchOutput.publications}>
                    <defs>
                      <linearGradient id="publicationsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="year" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', border: '2px solid #e5e7eb', borderRadius: '12px' }}
                    />
                    <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} fill="url(#publicationsGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Impact Stories */}
            {impactData.impactStories && impactData.impactStories.length > 0 && (
              <div>
                <h3 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <LucideIcons.TrendingUp className="text-green-600" />
                  {getLabel('successStories', currentLang)}
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {impactData.impactStories.map((story, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-gradient-to-br from-white via-blue-50 to-cyan-50 rounded-2xl shadow-lg p-8 border border-blue-200"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="text-xl font-bold text-slate-900">{story.title}</h4>
                        <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-bold">{story.year}</span>
                      </div>
                      <p className="text-slate-700 mb-6 leading-relaxed">{story.description}</p>
                      <div className="grid grid-cols-3 gap-4 p-4 bg-white/80 rounded-xl">
                        <div className="text-center">
                          <div className="text-sm text-slate-600 mb-1">{getLabel('before', currentLang)}</div>
                          <div className="text-2xl font-bold text-slate-900">{story.metrics.before.toLocaleString()}</div>
                          <div className="text-xs text-slate-500">{story.metrics.unit}</div>
                        </div>
                        <div className="flex items-center justify-center">
                          <LucideIcons.ArrowRight className="text-blue-600" size={24} />
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-slate-600 mb-1">{getLabel('after', currentLang)}</div>
                          <div className="text-2xl font-bold text-green-600">{story.metrics.after.toLocaleString()}</div>
                          <div className="text-xs font-bold text-green-600">{story.metrics.improvement}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Economic Impact & Partnerships */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Economic Impact */}
              {impactData.economicImpact && (
                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl shadow-xl p-8 text-white">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <LucideIcons.DollarSign size={28} />
                    {getLabel('economicImpact', currentLang)}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm opacity-90 mb-1">{getLabel('valueGenerated', currentLang)}</div>
                      <div className="text-4xl font-black">{impactData.economicImpact.valueGenerated}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
                      <div>
                        <div className="text-sm opacity-90">{getLabel('jobsCreated', currentLang)}</div>
                        <div className="text-3xl font-bold">{impactData.economicImpact.jobsCreated}+</div>
                      </div>
                      <div>
                        <div className="text-sm opacity-90">
                          {impactData.economicImpact.fisheriesImproved ? getLabel('fisheries', currentLang) : 
                           impactData.economicImpact.communitiesBenefited ? getLabel('communities', currentLang) :
                           impactData.economicImpact.farmsEstablished ? getLabel('farms', currentLang) :
                           impactData.economicImpact.householdsBenefited ? getLabel('households', currentLang) :
                           impactData.economicImpact.vesselsSafeguarded ? getLabel('vessels', currentLang) :
                           impactData.economicImpact.processingUnitsImproved ? getLabel('processingUnits', currentLang) :
                           impactData.economicImpact.professionalsUpskilled ? getLabel('professionals', currentLang) :
                           impactData.economicImpact.waterBodiesImproved ? getLabel('waterBodies', currentLang) :
                           getLabel('beneficiaries', currentLang)}
                        </div>
                        <div className="text-3xl font-bold">
                          {impactData.economicImpact.fisheriesImproved || 
                           impactData.economicImpact.communitiesBenefited ||
                           impactData.economicImpact.farmsEstablished ||
                           impactData.economicImpact.householdsBenefited ||
                           impactData.economicImpact.vesselsSafeguarded ||
                           impactData.economicImpact.processingUnitsImproved ||
                           impactData.economicImpact.professionalsUpskilled ||
                           impactData.economicImpact.waterBodiesImproved || 0}+
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Global Partnerships */}
              {impactData.partnerships && (
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-xl p-8 text-white">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <LucideIcons.Handshake size={28} />
                    {getLabel('globalPartnerships', currentLang)}
                  </h3>
                  <p className="text-white/80 mb-6">{getLabel('collaboratingWith', currentLang)} {impactData.partnerships.length} {getLabel('internationalOrganizations', currentLang)}</p>
                  <div className="grid grid-cols-2 gap-3">
                    {impactData.partnerships.map((partner, idx) => (
                      <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20 hover:bg-white/20 transition">
                        <div className="font-bold text-sm">{partner}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.section>
        )}

        {/* Contact Section - Enhanced */}
        {activeSection === 'contact' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 space-y-8"
          >
            {/* Hero Header */}
            <div className="relative bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 rounded-3xl shadow-2xl p-12 text-white overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMCA2LTE2IDYtMjIgMHMtNi0xNC02LTE0IDYtNiAxNC02IDEwLTIgMTQgNCA0IDEwIDAgMTR6Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
              </div>
              
              <div className="relative z-10 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="inline-block bg-white/20 backdrop-blur-sm p-4 rounded-2xl mb-6"
                >
                  <LucideIcons.MessageCircle size={48} strokeWidth={1.5} />
                </motion.div>
                
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                  {currentLang === 'en' && 'Connect With Us'}
                  {currentLang === 'si' && 'අප හා සම්බන්ධ වන්න'}
                  {currentLang === 'ta' && 'எங்களுடன் தொடர்பு கொள்ளுங்கள்'}
                </h2>
                <p className="text-xl text-white/90 max-w-2xl mx-auto">
                  {currentLang === 'en' && `Get in touch with the ${divisionData.name.en} team`}
                  {currentLang === 'si' && `${divisionData.name.si} කණ්ඩායම සමඟ සම්බන්ධ වන්න`}
                  {currentLang === 'ta' && `${divisionData.name.ta} குழுவுடன் தொடர்பு கொள்ளுங்கள்`}
                </p>
              </div>
            </div>

            {/* Quick Contact Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Email Button */}
              {(divisionData.contact?.email || divisionData.contactEmail) && (
                <motion.a
                  href={`mailto:${divisionData.contact?.email || divisionData.contactEmail}`}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6 transition-all border-2 border-transparent hover:border-blue-500 flex flex-col items-center gap-3 text-center"
                >
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl text-white group-hover:scale-110 transition-transform">
                    <LucideIcons.Mail size={28} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">{currentLang === 'en' ? 'Email Us' : currentLang === 'si' ? 'විද්‍යුත් තැපෑල' : 'மின்னஞ்சல்'}</p>
                    <p className="text-sm text-gray-600 break-all">{divisionData.contact?.email || divisionData.contactEmail}</p>
                  </div>
                </motion.a>
              )}

              {/* Phone Button */}
              {(divisionData.contact?.phone || divisionData.contactPhone) && (
                <motion.a
                  href={`tel:${divisionData.contact?.phone || divisionData.contactPhone}`}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6 transition-all border-2 border-transparent hover:border-green-500 flex flex-col items-center gap-3 text-center"
                >
                  <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-2xl text-white group-hover:scale-110 transition-transform">
                    <LucideIcons.Phone size={28} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">{currentLang === 'en' ? 'Call Us' : currentLang === 'si' ? 'අමතන්න' : 'அழைக்கவும்'}</p>
                    <p className="text-sm text-gray-600">{divisionData.contact?.phone || divisionData.contactPhone}</p>
                  </div>
                </motion.a>
              )}

              {/* WhatsApp Button */}
              {(divisionData.contact?.phone || divisionData.contactPhone) && (
                <motion.a
                  href={`https://wa.me/${(divisionData.contact?.phone || divisionData.contactPhone).replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6 transition-all border-2 border-transparent hover:border-green-500 flex flex-col items-center gap-3 text-center"
                >
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl text-white group-hover:scale-110 transition-transform">
                    <LucideIcons.MessageCircle size={28} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">WhatsApp</p>
                    <p className="text-sm text-gray-600">{currentLang === 'en' ? 'Chat with us' : currentLang === 'si' ? 'අප සමඟ කතා කරන්න' : 'எங்களுடன் அரட்டை'}</p>
                  </div>
                </motion.a>
              )}

              {/* Location Button */}
              {(divisionData.contact?.location || divisionData.location) && (
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6 transition-all border-2 border-transparent hover:border-purple-500 flex flex-col items-center gap-3 text-center cursor-pointer"
                >
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-2xl text-white group-hover:scale-110 transition-transform">
                    <LucideIcons.MapPin size={28} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">{currentLang === 'en' ? 'Visit Us' : currentLang === 'si' ? 'අප වෙත පැමිණෙන්න' : 'எங்களை சந்திக்கவும்'}</p>
                    <p className="text-sm text-gray-600">{typeof divisionData.contact?.location === 'object' ? divisionData.contact.location[currentLang] : divisionData.contact?.location || divisionData.location}</p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Collaboration Section */}
            <div className="bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 rounded-3xl shadow-xl p-10 text-white">
              <div className="max-w-4xl mx-auto text-center">
                <h3 className="text-3xl font-bold mb-4 text-white">
                  {currentLang === 'en' && 'Partner With Us'}
                  {currentLang === 'si' && 'අප සමඟ හවුල් වන්න'}
                  {currentLang === 'ta' && 'எங்களுடன் கூட்டு சேரவும்'}
                </h3>
                <p className="text-white/95 text-lg mb-8 leading-relaxed">
                  {currentLang === 'en' && 'We welcome collaborations with researchers, academic institutions, and industry partners.  Together, we can drive sustainable innovation.'}
                  {currentLang === 'si' && 'පර්යේෂකයන්, අධ්‍යාපනික ආයතන සහ කර්මාන්ත හවුල්කරුවන් සමඟ සහයෝගීතාවය අපි පිළිගනිමු. එක්ව, තිරසාර නවෝත්පාදනයන් අපට ඉදිරියට ගෙන යා හැකිය.'}
                  {currentLang === 'ta' && 'ஆராய்ச்சியாளர்கள், கல்வி நிறுவனங்கள் மற்றும் தொழில் பங்காளர்களுடன் ஒத்துழைப்பை வரவேற்கிறோம். நிலையான புதுமைகளை உருவாக்கலாம்.'}
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => window.location.href = `mailto:${divisionData.contact?.email || divisionData.contactEmail}?subject=Partnership Inquiry`}
                    className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:shadow-2xl transition-all flex items-center gap-3"
                  >
                    <LucideIcons.Send size={20} />
                    <span>{currentLang === 'en' ? 'Send Inquiry' : currentLang === 'si' ? 'විමසීමක් යවන්න' : 'விசாரணை அனுப்பவும்'}</span>
                  </button>
                  <button
                    onClick={() => navigate('/contact-us')}
                    className="bg-white/20 backdrop-blur-sm border-2 border-white/40 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/30 transition-all flex items-center gap-3"
                  >
                    <LucideIcons.MessageSquare size={20} />
                    <span>{currentLang === 'en' ? 'Contact Form' : currentLang === 'si' ? 'සම්බන්ධතා පෝරමය' : 'தொடர்பு படிவம்'}</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
};

export default DivisionPage;
