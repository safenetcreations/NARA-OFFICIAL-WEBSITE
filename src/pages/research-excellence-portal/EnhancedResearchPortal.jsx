import React, { useState, useMemo, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, TrendingUp, Users, FileText, Globe, Award,
  Download, ExternalLink, Bookmark, Share2, Mail, Calendar,
  ChevronDown, ChevronRight, Eye, Heart, Star, Zap, Target,
  Database, BarChart3, Network, MapPin, DollarSign, Clock,
  GraduationCap, Microscope, Waves, Fish, Sparkles, BookOpen,
  Code, GitBranch, LineChart, PieChart, Activity, ArrowUpRight, SlidersHorizontal
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ICON_MAP = {
  Search,
  Filter,
  TrendingUp,
  Users,
  FileText,
  Globe,
  Award,
  Download,
  ExternalLink,
  Bookmark,
  Share2,
  Mail,
  Calendar,
  ChevronDown,
  ChevronRight,
  Eye,
  Heart,
  Star,
  Zap,
  Target,
  Database,
  BarChart3,
  Network,
  MapPin,
  DollarSign,
  Clock,
  GraduationCap,
  Microscope,
  Waves,
  Fish,
  Sparkles,
  BookOpen,
  Code,
  GitBranch,
  LineChart,
  PieChart,
  Activity,
  ArrowUpRight,
  SlidersHorizontal
};

const resolveIcon = (iconName, fallback) => {
  if (iconName && ICON_MAP[iconName]) {
    return ICON_MAP[iconName];
  }
  if (fallback && ICON_MAP[fallback]) {
    return ICON_MAP[fallback];
  }
  return Activity;
};

const METRICS_FALLBACK = [
  {
    id: 'publications',
    label: 'Total Publications',
    value: '1,247',
    change: '+15.3%',
    icon: 'FileText',
    color: 'from-cyan-400 to-blue-600',
    description: 'Peer-reviewed research papers'
  },
  {
    id: 'citations',
    label: 'Global Citations',
    value: '28,439',
    change: '+22.7%',
    icon: 'TrendingUp',
    color: 'from-purple-400 to-pink-600',
    description: 'Times our work has been cited'
  },
  {
    id: 'hIndex',
    label: 'H-Index',
    value: '67',
    change: '+3',
    icon: 'Award',
    color: 'from-amber-400 to-orange-600',
    description: 'Research impact metric'
  },
  {
    id: 'collaborations',
    label: 'Global Partners',
    value: '89',
    change: '+12',
    icon: 'Globe',
    color: 'from-green-400 to-emerald-600',
    description: 'International research institutions'
  },
  {
    id: 'projects',
    label: 'Active Projects',
    value: '156',
    change: '+18',
    icon: 'Target',
    color: 'from-blue-400 to-indigo-600',
    description: 'Ongoing research initiatives'
  },
  {
    id: 'funding',
    label: 'Research Funding',
    value: '$12.4M',
    change: '+28%',
    icon: 'DollarSign',
    color: 'from-rose-400 to-red-600',
    description: 'Total grants secured'
  }
];

const AREAS_FALLBACK = [
  { id: 'marine-biology', name: 'Marine Biology', count: 342, icon: 'Fish', color: 'cyan' },
  { id: 'climate', name: 'Climate Change', count: 218, icon: 'Waves', color: 'blue' },
  { id: 'fisheries', name: 'Fisheries Management', count: 189, icon: 'Fish', color: 'green' },
  { id: 'oceanography', name: 'Oceanography', count: 167, icon: 'Waves', color: 'purple' },
  { id: 'conservation', name: 'Conservation', count: 143, icon: 'Heart', color: 'pink' },
  { id: 'policy', name: 'Marine Policy', count: 98, icon: 'FileText', color: 'amber' }
];

const PUBLICATIONS_FALLBACK = [
  {
    id: 'climate-coral',
    access: 'open',
    accessLabel: 'Open Access',
    area: 'Climate Change',
    title: 'Climate-Driven Changes in Sri Lankan Coral Reef Ecosystems: A 30-Year Study',
    authors: 'Dr. Priya Fernando, Dr. Raj Kumar, Dr. Sarah Miller',
    journal: 'Nature Climate Change',
    year: 2024,
    type: 'Journal Article',
    citations: 342,
    downloads: 1847,
    impactFactor: 29.3,
    abstract: 'This comprehensive 30-year longitudinal study examines the impact of rising ocean temperatures on coral reef biodiversity in Sri Lankan waters. Our findings reveal significant shifts in species composition and ecosystem resilience...',
    doi: '10.1038/s41558-024-01234-5',
    tags: ['Coral Reefs', 'Climate Change', 'Biodiversity', 'Sri Lanka'],
    highlights: [
      '30-year longitudinal dataset',
      'Novel biodiversity metrics',
      'Policy recommendations for reef conservation'
    ]
  },
  {
    id: 'ai-fisheries',
    access: 'open',
    accessLabel: 'Open Access',
    area: 'Fisheries Management',
    title: 'Sustainable Fisheries Management Through AI-Powered Stock Assessment',
    authors: 'Dr. Nimal Perera, Dr. Chen Wei, Dr. Emma Thompson',
    journal: 'Science Advances',
    year: 2024,
    type: 'Journal Article',
    citations: 218,
    downloads: 2134,
    impactFactor: 13.6,
    abstract: 'We present a machine learning framework for real-time fish stock assessment using satellite imagery and acoustic data. This approach has improved prediction accuracy by 43% compared to traditional methods...',
    doi: '10.1126/sciadv.abcd1234',
    tags: ['AI', 'Fisheries', 'Sustainability', 'Remote Sensing'],
    highlights: [
      '43% improvement in accuracy',
      'Real-time monitoring system',
      'Deployed across 12 fishing zones'
    ]
  },
  {
    id: 'microplastics',
    access: 'open',
    accessLabel: 'Open Access',
    area: 'Marine Biology',
    title: 'Microplastic Distribution Patterns in the Indian Ocean: A Comprehensive Survey',
    authors: 'Dr. Ayesha Khan, Dr. Michael Brown, Dr. Lakshmi Dissanayake',
    journal: 'Environmental Science & Technology',
    year: 2023,
    type: 'Journal Article',
    citations: 487,
    downloads: 3201,
    impactFactor: 11.4,
    abstract: 'Through systematic sampling across 200+ locations in the Indian Ocean, we mapped microplastic pollution hotspots and identified primary sources. Our data reveals alarming concentration levels in coastal regions...',
    doi: '10.1021/acs.est.3c12345',
    tags: ['Microplastics', 'Pollution', 'Indian Ocean', 'Marine Health'],
    highlights: [
      '200+ sampling locations',
      'First comprehensive Indian Ocean survey',
      'Hotspot identification'
    ]
  },
  {
    id: 'blue-carbon',
    access: 'subscription',
    accessLabel: 'Subscription Required',
    area: 'Conservation',
    title: 'Blue Carbon Sequestration in Mangrove Ecosystems: Economic Valuation',
    authors: 'Dr. Sunil Wickramasinghe, Dr. Jane Wilson, Dr. Carlos Rodriguez',
    journal: 'Nature Sustainability',
    year: 2023,
    type: 'Journal Article',
    citations: 294,
    downloads: 1652,
    impactFactor: 27.2,
    abstract: 'This study quantifies the carbon sequestration capacity of Sri Lankan mangrove forests and provides the first comprehensive economic valuation of their ecosystem services...',
    doi: '10.1038/s41893-023-12345-6',
    tags: ['Blue Carbon', 'Mangroves', 'Climate Mitigation', 'Economics'],
    highlights: [
      'Economic valuation framework',
      'Carbon credit potential',
      'Policy implementation guide'
    ]
  }
];

const TEAMS_FALLBACK = [
  {
    id: 1,
    name: 'Marine Biodiversity Lab',
    lead: 'Dr. Priya Fernando',
    members: 24,
    projects: 12,
    publications: 156,
    funding: '$2.3M',
    focus: 'Coral reef ecosystems, marine species conservation, biodiversity assessment',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop'
  },
  {
    id: 2,
    name: 'Climate & Oceanography Division',
    lead: 'Dr. Nimal Perera',
    members: 18,
    projects: 9,
    publications: 127,
    funding: '$3.1M',
    focus: 'Ocean temperature monitoring, sea level rise, climate modeling',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop'
  },
  {
    id: 3,
    name: 'Sustainable Fisheries Group',
    lead: 'Dr. Ayesha Khan',
    members: 15,
    projects: 8,
    publications: 98,
    funding: '$1.8M',
    focus: 'Stock assessment, fishing technology, sustainable practices',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop'
  }
];

const TABS_FALLBACK = [
  { id: 'publications', label: 'Publications', icon: 'FileText', count: '1,247' },
  { id: 'teams', label: 'Research Teams', icon: 'Users', count: '12' },
  { id: 'projects', label: 'Active Projects', icon: 'Target', count: '156' },
  { id: 'impact', label: 'Impact & Analytics', icon: 'BarChart3' },
  { id: 'collaboration', label: 'Global Network', icon: 'Globe', count: '89' }
];

const createFallbackMap = (items) => items.reduce((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {});

const METRICS_FALLBACK_MAP = createFallbackMap(METRICS_FALLBACK);
const AREAS_FALLBACK_MAP = createFallbackMap(AREAS_FALLBACK);
const PUBLICATIONS_FALLBACK_MAP = createFallbackMap(PUBLICATIONS_FALLBACK);
const TEAMS_FALLBACK_MAP = createFallbackMap(TEAMS_FALLBACK);
const TABS_FALLBACK_MAP = createFallbackMap(TABS_FALLBACK);

// Phase 2 Components
import ActiveProjectsTab from './components/ActiveProjectsTab';
import ImpactAnalyticsTab from './components/ImpactAnalyticsTab';
import GlobalCollaborationTab from './components/GlobalCollaborationTab';
import AdvancedSearch from './components/AdvancedSearch';

const EnhancedResearchPortal = () => {
  const [activeTab, setActiveTab] = useState('publications');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    year: 'all',
    type: 'all',
    area: 'all',
    impactFactor: 'all'
  });
  const [sortBy, setSortBy] = useState('citations');
  const [expandedPublication, setExpandedPublication] = useState(null);
  const [bookmarked, setBookmarked] = useState([]);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const { t } = useTranslation('researchEnhanced');

  // Live Research Metrics
  const metrics = useMemo(() => {
    const translated = t('metrics.cards', { returnObjects: true, defaultValue: METRICS_FALLBACK });
    const items = Array.isArray(translated) && translated.length ? translated : METRICS_FALLBACK;
    return items.map((item) => {
      const fallback = METRICS_FALLBACK_MAP[item.id] || METRICS_FALLBACK_MAP[Object.keys(METRICS_FALLBACK_MAP)[0]];
      const iconName = item.icon || fallback.icon;
      return {
        ...fallback,
        ...item,
        icon: resolveIcon(iconName, fallback.icon),
        color: item.color || fallback.color,
        label: item.label || fallback.label,
        value: item.value || fallback.value,
        change: item.change || fallback.change,
        description: item.description || fallback.description
      };
    });
  }, [t]);

  // Research Areas
  const researchAreas = useMemo(() => {
    const translated = t('areas', { returnObjects: true, defaultValue: AREAS_FALLBACK });
    const items = Array.isArray(translated) && translated.length ? translated : AREAS_FALLBACK;
    return items.map((area) => {
      const fallback = AREAS_FALLBACK_MAP[area.id] || AREAS_FALLBACK_MAP[Object.keys(AREAS_FALLBACK_MAP)[0]];
      const iconName = area.icon || fallback.icon;
      return {
        ...fallback,
        ...area,
        icon: resolveIcon(iconName, fallback.icon),
        color: area.color || fallback.color,
        name: area.name || fallback.name,
        count: area.count ?? fallback.count
      };
    });
  }, [t]);

  // Featured Publications
  const publications = useMemo(() => {
    const translated = t('publications.items', { returnObjects: true, defaultValue: PUBLICATIONS_FALLBACK });
    const items = Array.isArray(translated) && translated.length ? translated : PUBLICATIONS_FALLBACK;
    return items.map((pub) => {
      const fallback = PUBLICATIONS_FALLBACK_MAP[pub.id] || PUBLICATIONS_FALLBACK[0];
      return {
        ...fallback,
        ...pub,
        access: pub.access || fallback.access,
        accessLabel: pub.accessLabel || fallback.accessLabel,
        area: pub.area || fallback.area,
        title: pub.title || fallback.title,
        authors: pub.authors || fallback.authors,
        journal: pub.journal || fallback.journal,
        type: pub.type || fallback.type,
        abstract: pub.abstract || fallback.abstract,
        tags: Array.isArray(pub.tags) && pub.tags.length ? pub.tags : fallback.tags,
        highlights: Array.isArray(pub.highlights) && pub.highlights.length ? pub.highlights : fallback.highlights,
        citations: pub.citations ?? fallback.citations,
        downloads: pub.downloads ?? fallback.downloads,
        impactFactor: pub.impactFactor ?? fallback.impactFactor,
        year: pub.year ?? fallback.year,
        doi: pub.doi || fallback.doi
      };
    });
  }, [t]);

  // Research Teams
  const teams = useMemo(() => {
    const translated = t('teams.items', { returnObjects: true, defaultValue: TEAMS_FALLBACK });
    const items = Array.isArray(translated) && translated.length ? translated : TEAMS_FALLBACK;
    return items.map((team) => {
      const fallback = TEAMS_FALLBACK_MAP[team.id] || TEAMS_FALLBACK[0];
      return {
        ...fallback,
        ...team,
        name: team.name || fallback.name,
        lead: team.lead || fallback.lead,
        focus: team.focus || fallback.focus,
        members: team.members ?? fallback.members,
        projects: team.projects ?? fallback.projects,
        publications: team.publications ?? fallback.publications,
        funding: team.funding || fallback.funding,
        image: team.image || fallback.image
      };
    });
  }, [t]);

  const tabs = useMemo(() => {
    const translated = t('tabs', { returnObjects: true, defaultValue: TABS_FALLBACK });
    const items = Array.isArray(translated) && translated.length ? translated : TABS_FALLBACK;
    return items.map((tab) => {
      const fallback = TABS_FALLBACK_MAP[tab.id] || TABS_FALLBACK[0];
      const iconName = tab.icon || fallback.icon;
      return {
        ...fallback,
        ...tab,
        icon: resolveIcon(iconName, fallback.icon),
        label: tab.label || fallback.label,
        count: tab.count ?? fallback.count
      };
    });
  }, [t]);

  const heroCopy = useMemo(() => ({
    badge: t('hero.badge', 'Research Excellence Portal'),
    titleLine1: t('hero.titleLine1', 'Advancing Marine Science'),
    titleLine2: t('hero.titleLine2', 'for a Sustainable Future'),
    description: t(
      'hero.description',
      "Discover groundbreaking research in marine biology, oceanography, and climate science from Sri Lanka's premier aquatic research institution"
    )
  }), [t]);

  const filterCopy = useMemo(() => ({
    searchPlaceholder: t('filters.searchPlaceholder', 'Search publications...'),
    advanced: t('filters.advanced', 'Advanced')
  }), [t]);

  const yearOptions = useMemo(() => ([
    { value: 'all', label: t('filters.year.options.all', 'All Years') },
    { value: '2024', label: t('filters.year.options.2024', '2024') },
    { value: '2023', label: t('filters.year.options.2023', '2023') },
    { value: '2022', label: t('filters.year.options.2022', '2022') }
  ]), [t]);

  const typeOptions = useMemo(() => ([
    { value: 'all', label: t('filters.type.options.all', 'All Types') },
    { value: 'journal', label: t('filters.type.options.journal', 'Journal Article') },
    { value: 'conference', label: t('filters.type.options.conference', 'Conference Paper') },
    { value: 'report', label: t('filters.type.options.report', 'Technical Report') }
  ]), [t]);

  const sortOptions = useMemo(() => ([
    { value: 'citations', label: t('filters.sort.options.citations', 'Most Cited') },
    { value: 'recent', label: t('filters.sort.options.recent', 'Most Recent') },
    { value: 'downloads', label: t('filters.sort.options.downloads', 'Most Downloaded') },
    { value: 'impact', label: t('filters.sort.options.impact', 'Highest Impact') }
  ]), [t]);

  const publicationsLabels = useMemo(() => ({
    highlights: t('publications.labels.highlights', 'Key Highlights:'),
    showMore: t('publications.labels.showMore', 'Show More'),
    showLess: t('publications.labels.showLess', 'Show Less'),
    viewPaper: t('publications.labels.viewPaper', 'View Paper'),
    openAccess: t('publications.labels.openAccess', 'Open Access')
  }), [t]);

  const teamLabels = useMemo(() => ({
    members: t('teams.labels.members', 'Members'),
    projects: t('teams.labels.projects', 'Projects'),
    publications: t('teams.labels.publications', 'Publications'),
    funding: t('teams.labels.funding', 'Funding'),
    viewProfile: t('teams.actions.viewProfile', 'View Team Profile')
  }), [t]);

  const toggleBookmark = (id) => {
    setBookmarked(prev => 
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      
      {/* Hero Section with Live Metrics */}
      <motion.section 
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative overflow-hidden pt-32 pb-24 px-4"
      >
        {/* Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{ duration: 8, repeat: Infinity, delay: 1 }}
            className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-semibold text-cyan-300 uppercase tracking-wider">
                {heroCopy.badge}
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
              {heroCopy.titleLine1}
              <br />
              {heroCopy.titleLine2}
            </h1>
            
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              {heroCopy.description}
            </p>
          </motion.div>

          {/* Live Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 overflow-hidden group cursor-pointer"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${metric.color} mb-4`}>
                    <metric.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="text-3xl font-bold text-white mb-1">
                    {metric.value}
                  </div>
                  
                  <div className="text-sm text-slate-400 mb-2">
                    {metric.label}
                  </div>
                  
                  <div className="flex items-center gap-1 text-green-400 text-xs font-semibold">
                    <TrendingUp className="w-3 h-3" />
                    {metric.change}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Main Content */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 pb-24">
        
        {/* Tabs Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count && (
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-bold">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'publications' && (
            <motion.div
              key="publications"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Search & Filters */}
              <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {/* Search */}
                  <div className="lg:col-span-2 flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        placeholder={filterCopy.searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                    <button
                      onClick={() => setShowAdvancedSearch(true)}
                      className="px-4 py-3 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30 transition-all flex items-center gap-2 whitespace-nowrap"
                    >
                      <SlidersHorizontal className="w-4 h-4" />
                      <span className="hidden md:inline">{filterCopy.advanced}</span>
                    </button>
                  </div>

                  {/* Filters */}
                  <select
                    value={selectedFilters.year}
                    onChange={(e) => setSelectedFilters({ ...selectedFilters, year: e.target.value })}
                    className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    {yearOptions.map((option) => (
                      <option key={option.value} value={option.value} className="bg-black">
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedFilters.type}
                    onChange={(e) => setSelectedFilters({ ...selectedFilters, type: e.target.value })}
                    className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    {typeOptions.map((option) => (
                      <option key={option.value} value={option.value} className="bg-black">
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value} className="bg-black">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Research Areas Quick Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {researchAreas.map((area) => (
                  <button
                    key={area.id}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all whitespace-nowrap ${
                      selectedFilters.area === area.id
                        ? `bg-${area.color}-500/20 border-${area.color}-500/50 text-${area.color}-300`
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                    onClick={() => setSelectedFilters({...selectedFilters, area: area.id})}
                  >
                    <area.icon className="w-4 h-4" />
                    <span>{area.name}</span>
                    <span className="text-xs opacity-70">({area.count})</span>
                  </button>
                ))}
              </div>

              {/* Publications List */}
              <div className="space-y-6">
                {publications.map((pub, index) => (
                  <motion.div
                    key={pub.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 hover:border-cyan-500/30 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          {pub.access === 'open' && (
                            <span className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-300 text-xs font-semibold uppercase">
                              {publicationsLabels.openAccess}
                            </span>
                          )}
                          <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
                            {pub.area}
                          </span>
                          <span className="text-slate-400 text-sm">{pub.year}</span>
                        </div>
                        
                        <h3 className="text-2xl font-bold text-white mb-2 hover:text-cyan-400 cursor-pointer transition-colors">
                          {pub.title}
                        </h3>
                        
                        <p className="text-slate-400 text-sm mb-3">{pub.authors}</p>
                        
                        <p className="text-slate-300 mb-4">
                          {expandedPublication === pub.id ? pub.abstract : `${pub.abstract.substring(0, 200)}...`}
                        </p>

                        {expandedPublication === pub.id && (
                          <div className="mb-4 space-y-3">
                            <div>
                              <h4 className="text-sm font-semibold text-cyan-400 mb-2">{publicationsLabels.highlights}</h4>
                              <ul className="space-y-1">
                                {pub.highlights.map((highlight, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-slate-300 text-sm">
                                    <ChevronRight className="w-4 h-4 text-cyan-400 mt-0.5" />
                                    <span>{highlight}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                              {pub.tags.map((tag, idx) => (
                                <span key={idx} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => toggleBookmark(pub.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            bookmarked.includes(pub.id)
                              ? 'bg-cyan-500/20 text-cyan-400'
                              : 'bg-white/5 text-slate-400 hover:bg-white/10'
                          }`}
                        >
                          <Bookmark className="w-5 h-5" />
                        </button>
                        <button className="p-2 rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 transition-colors">
                          <Share2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-slate-300">
                          <TrendingUp className="w-4 h-4 text-cyan-400" />
                          <span className="text-sm">
                            {t('publications.labels.citations', '{{count}} citations', { count: pub.citations })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                          <Download className="w-4 h-4 text-green-400" />
                          <span className="text-sm">
                            {t('publications.labels.downloads', '{{count}} downloads', { count: pub.downloads.toLocaleString() })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                          <Star className="w-4 h-4 text-amber-400" />
                          <span className="text-sm">
                            {t('publications.labels.impactFactor', 'IF: {{value}}', { value: pub.impactFactor })}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setExpandedPublication(expandedPublication === pub.id ? null : pub.id)}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-all"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="text-sm">{expandedPublication === pub.id ? publicationsLabels.showLess : publicationsLabels.showMore}</span>
                        </button>
                        <a
                          href={`https://doi.org/${pub.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span className="text-sm">{publicationsLabels.viewPaper}</span>
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'teams' && (
            <motion.div
              key="teams"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {teams.map((team, index) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 hover:border-cyan-500/30 transition-all cursor-pointer"
                >
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-white mb-2">{team.name}</h3>
                    <p className="text-cyan-400 text-sm font-medium mb-4">
                      {t('teams.labels.ledBy', 'Led by {{name}}', { name: team.lead })}
                    </p>
                    <p className="text-slate-300 text-sm leading-relaxed">{team.focus}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-xs text-slate-400 mb-1">{teamLabels.members}</div>
                      <div className="text-2xl font-bold text-white">{team.members}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-xs text-slate-400 mb-1">{teamLabels.projects}</div>
                      <div className="text-2xl font-bold text-white">{team.projects}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-xs text-slate-400 mb-1">{teamLabels.publications}</div>
                      <div className="text-2xl font-bold text-white">{team.publications}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-xs text-slate-400 mb-1">{teamLabels.funding}</div>
                      <div className="text-2xl font-bold text-white">{team.funding}</div>
                    </div>
                  </div>

                  <button className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all">
                    {teamLabels.viewProfile}
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Phase 2: Active Projects Tab */}
          {activeTab === 'projects' && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ActiveProjectsTab />
            </motion.div>
          )}

          {/* Phase 2: Impact Analytics Tab */}
          {activeTab === 'impact' && (
            <motion.div
              key="impact"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ImpactAnalyticsTab />
            </motion.div>
          )}

          {/* Phase 2: Global Collaboration Tab */}
          {activeTab === 'collaboration' && (
            <motion.div
              key="collaboration"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <GlobalCollaborationTab />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Advanced Search Modal */}
      <AnimatePresence>
        {showAdvancedSearch && (
          <AdvancedSearch
            onSearch={(criteria) => {
              console.log('Search criteria:', criteria);
              // Handle search logic here
            }}
            onClose={() => setShowAdvancedSearch(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedResearchPortal;
