import React, { useState, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { useResearchData } from '../../hooks/useResearchData';

const ResearchExcellenceRedesign = () => {
  const [activeTab, setActiveTab] = useState('publications');
  const [selectedResearch, setSelectedResearch] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('year');
  const [sortOrder, setSortOrder] = useState('desc');
  const { scrollY } = useScroll();

  // Real-time research data
  const {
    researchData,
    publications,
    teams,
    metrics,
    isLoading,
    error,
    refreshData
  } = useResearchData();

  // Parallax effects
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Research publications data
  const researchPublications = [
    {
      id: 1,
      title: "Deep Ocean Biodiversity Mapping of Sri Lankan Waters",
      authors: "Dr. Sarah Chen, Prof. Kumar Silva, Dr. Amanda Roberts",
      year: 2024,
      journal: "Nature Ocean Sciences",
      impact: 12.5,
      citations: 245,
      category: "Marine Biology",
      thumbnail: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400",
      abstract: "Comprehensive analysis of deep-sea ecosystems revealing 127 new species...",
      tags: ["Deep Sea", "Biodiversity", "New Species"],
      downloadCount: 3847
    },
    {
      id: 2,
      title: "Climate Impact on Coral Reef Systems: A 10-Year Study",
      authors: "Prof. Michael Thompson, Dr. Priya Fernando",
      year: 2024,
      journal: "Science Advances",
      impact: 9.8,
      citations: 189,
      category: "Climate Science",
      thumbnail: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400",
      abstract: "Long-term monitoring reveals critical temperature thresholds for coral survival...",
      tags: ["Climate Change", "Coral Reefs", "Conservation"],
      downloadCount: 2156
    },
    {
      id: 3,
      title: "AI-Powered Ocean Current Prediction Models",
      authors: "Dr. James Liu, Prof. Nimal Perera",
      year: 2023,
      journal: "Journal of Marine Technology",
      impact: 8.2,
      citations: 156,
      category: "Ocean Technology",
      thumbnail: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400",
      abstract: "Machine learning algorithms achieving 94% accuracy in current predictions...",
      tags: ["AI", "Ocean Currents", "Predictive Modeling"],
      downloadCount: 1892
    }
  ];

  // Research teams data
  const researchTeams = [
    {
      name: "Marine Biodiversity Unit",
      lead: "Dr. Sarah Chen",
      members: 12,
      projects: 8,
      funding: "$2.5M",
      icon: Icons.Fish,
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "Climate Research Division",
      lead: "Prof. Kumar Silva",
      members: 18,
      projects: 12,
      funding: "$4.2M",
      icon: Icons.Thermometer,
      color: "from-purple-500 to-pink-500"
    },
    {
      name: "Ocean Technology Lab",
      lead: "Dr. James Liu",
      members: 15,
      projects: 10,
      funding: "$3.8M",
      icon: Icons.Cpu,
      color: "from-green-500 to-teal-500"
    },
    {
      name: "Conservation Research",
      lead: "Prof. Amanda Roberts",
      members: 10,
      projects: 6,
      funding: "$1.9M",
      icon: Icons.Shield,
      color: "from-orange-500 to-red-500"
    }
  ];

  // Categories for filtering
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Marine Biology', label: 'Marine Biology' },
    { value: 'Climate Science', label: 'Climate Science' },
    { value: 'Ocean Technology', label: 'Ocean Technology' },
    { value: 'Conservation', label: 'Conservation' }
  ];

  // Sort options
  const sortOptions = [
    { value: 'year', label: 'Publication Year' },
    { value: 'citations', label: 'Citations' },
    { value: 'impact', label: 'Impact Factor' },
    { value: 'downloads', label: 'Downloads' }
  ];

  // Filtered and sorted publications
  const filteredPublications = useMemo(() => {
    const source = publications && publications.length > 0 ? publications : researchPublications;
    let filtered = [...source];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((pub) => {
        const title = (pub?.title || '').toLowerCase();
        const authors = (pub?.authors || '').toLowerCase();
        const tags = Array.isArray(pub?.tags) ? pub.tags.map((tag) => (tag || '').toLowerCase()) : [];

        return title.includes(term) || authors.includes(term) || tags.some((tag) => tag.includes(term));
      });
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((pub) => (pub?.category || '').toLowerCase() === selectedCategory.toLowerCase());
    }

    filtered.sort((a, b) => {
      const valueFor = (item) => {
        switch (sortBy) {
          case 'citations':
            return Number(item?.citations) || 0;
          case 'impact':
            return Number(item?.impact) || 0;
          case 'downloads':
            return Number(item?.downloadCount) || 0;
          case 'year':
          default:
            return Number(item?.year) || 0;
        }
      };

      const aValue = valueFor(a);
      const bValue = valueFor(b);

      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return filtered;
  }, [publications, researchPublications, searchTerm, selectedCategory, sortBy, sortOrder]);

  // Compose research metrics with icon components and safe fallbacks
  const researchMetrics = useMemo(() => {
    const defaults = [
      { label: 'Active Projects', value: 47, change: '+12%', icon: Icons.Briefcase },
      { label: 'Publications (2024)', value: 89, change: '+23%', icon: Icons.FileText },
      { label: 'International Collaborations', value: 32, change: '+8%', icon: Icons.Globe },
      { label: 'Research Funding', value: '$12.4M', change: '+15%', icon: Icons.TrendingUp },
    ];
    if (Array.isArray(metrics) && metrics.length) {
      return metrics.map((m) => ({
        label: m?.label ?? '',
        value: m?.value ?? 0,
        change: m?.change ?? '+0%',
        icon: Icons[m?.icon] || Icons.Activity,
      }));
    }
    return defaults;
  }, [metrics]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section with Animated Background */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 via-purple-900/30 to-black"></div>
          <div className="absolute inset-0">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [-20, 20],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </div>

        {/* Hero Content */}
        <motion.div 
          style={{ opacity }}
          className="relative z-10 text-center px-4 max-w-6xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, type: "spring" }}
            className="inline-block mb-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-1 rounded-2xl">
                <div className="bg-black/80 backdrop-blur-xl px-6 py-3 rounded-2xl">
                  <span className="text-purple-400 font-space text-sm tracking-widest uppercase">
                    Research Division
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-bold font-space mb-4"
          >
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
              Research Excellence
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-8"
          >
            Advancing ocean science through groundbreaking research, innovation, and global collaboration
          </motion.p>

          {/* Live Metrics Bar */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {researchMetrics.map((metric, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <metric.icon className="w-5 h-5 text-purple-400" />
                  <span className={`text-xs ${metric.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {metric.change}
                  </span>
                </div>
                <div className="text-2xl font-bold text-white font-space">{metric.value}</div>
                <div className="text-xs text-gray-400">{metric.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Navigation Tabs */}
      <section className="sticky top-[72px] z-40 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8 overflow-x-auto">
            {['publications', 'teams', 'projects', 'datasets', 'collaboration'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 capitalize font-medium transition-all duration-300 border-b-2 ${
                  activeTab === tab
                    ? 'text-purple-400 border-purple-400'
                    : 'text-gray-400 border-transparent hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Publications Section */}
      <AnimatePresence mode="wait">
        {activeTab === 'publications' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="py-20 px-4"
          >
            <div className="max-w-7xl mx-auto">
              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-12">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search publications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-12 py-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all"
                  />
                  <Icons.Search className="absolute left-4 top-4.5 w-5 h-5 text-gray-400" />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-6 py-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 text-white focus:outline-none focus:border-purple-500"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value} className="bg-black">
                      {category.label}
                    </option>
                  ))}
                </select>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [sort, order] = e.target.value.split('-');
                    setSortBy(sort);
                    setSortOrder(order);
                  }}
                  className="px-6 py-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 text-white focus:outline-none focus:border-purple-500"
                >
                  {sortOptions.map(option => (
                    <optgroup key={option.value} label={option.label} className="bg-black">
                      <option value={`${option.value}-desc`} className="bg-black">
                        {option.label} (High to Low)
                      </option>
                      <option value={`${option.value}-asc`} className="bg-black">
                        {option.label} (Low to High)
                      </option>
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Publications Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                  // Loading skeleton
                  [...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                      <div className="animate-pulse">
                        <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-white/10 rounded w-1/2 mb-4"></div>
                        <div className="h-20 bg-white/10 rounded mb-4"></div>
                        <div className="h-4 bg-white/10 rounded w-1/4"></div>
                      </div>
                    </div>
                  ))
                ) : filteredPublications.length > 0 ? (
                  filteredPublications.map((pub, index) => (
                    <motion.div
                      key={pub.id}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedResearch(pub)}
                      className="group cursor-pointer"
                    >
                      <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-purple-500 transition-all duration-300">
                        <div className="grid md:grid-cols-12 gap-6">
                          {/* Thumbnail */}
                          <div className="md:col-span-2">
                            <div className="relative aspect-video md:aspect-square rounded-xl overflow-hidden">
                              <img
                                src={pub.thumbnail}
                                alt={pub.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="md:col-span-8">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                                {pub.title}
                              </h3>
                            </div>
                            <p className="text-sm text-gray-400 mb-2">{pub.authors}</p>
                            <p className="text-gray-300 mb-4 line-clamp-2">{pub.abstract}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {(Array.isArray(pub?.tags) ? pub.tags : []).map((tag, i) => (
                                <span key={i} className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-gray-400">
                                <Icons.Calendar className="inline w-4 h-4 mr-1" />
                                {pub.year}
                              </span>
                              <span className="text-gray-400">
                                <Icons.BookOpen className="inline w-4 h-4 mr-1" />
                                {pub.journal}
                              </span>
                              <span className="text-purple-400 font-semibold">
                                IF: {pub.impact}
                              </span>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="md:col-span-2">
                            <div className="space-y-4">
                              <div className="text-center p-3 bg-white/5 rounded-xl">
                                <div className="text-2xl font-bold text-cyan-400">{pub.citations}</div>
                                <div className="text-xs text-gray-400">Citations</div>
                              </div>
                              <div className="text-center p-3 bg-white/5 rounded-xl">
                                <div className="text-2xl font-bold text-green-400">{pub.downloadCount}</div>
                                <div className="text-xs text-gray-400">Downloads</div>
                              </div>
                              <button className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium hover:from-purple-700 hover:to-pink-700 transition-all">
                                <Icons.Download className="inline w-4 h-4 mr-1" />
                                PDF
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <Icons.SearchX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No publications found</h3>
                    <p className="text-gray-400">Try adjusting your search criteria or filters.</p>
                  </div>
                )}
              </div>

              {/* Load More */}
              {filteredPublications.length > 0 && (
                <div className="text-center mt-12">
                  <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-medium hover:scale-105 transition-all">
                    Load More Publications
                    <Icons.ChevronDown className="inline w-5 h-5 ml-2" />
                  </button>
                </div>
              )}
            </div>
          </motion.section>
        )}

        {/* Research Teams Section */}
        {activeTab === 'teams' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="py-20 px-4"
          >
            <div className="max-w-7xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {researchTeams.map((team, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1, type: "spring" }}
                    whileHover={{ y: -10 }}
                  >
                    <div className="relative group">
                      <div className={`absolute inset-0 bg-gradient-to-r ${team.color} opacity-20 blur-xl group-hover:opacity-30 transition-opacity rounded-2xl`}></div>
                      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-purple-500 transition-all">
                        <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${team.color} mb-4`}>
                          <team.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{team.name}</h3>
                        <p className="text-gray-400 text-sm mb-4">Lead: {team.lead}</p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Members</span>
                            <span className="text-white font-semibold">{team.members}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Projects</span>
                            <span className="text-white font-semibold">{team.projects}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Funding</span>
                            <span className="text-green-400 font-semibold">{team.funding}</span>
                          </div>
                        </div>

                        <button className="w-full py-2 border border-purple-500 text-purple-400 rounded-lg hover:bg-purple-500 hover:text-white transition-all">
                          View Team Profile
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Team Stats */}
              <div className="mt-16 grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-xl rounded-2xl p-8 border border-white/10 text-center">
                  <Icons.Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <div className="text-4xl font-bold text-white mb-2">152</div>
                  <div className="text-gray-400">Total Researchers</div>
                </div>
                <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-xl rounded-2xl p-8 border border-white/10 text-center">
                  <Icons.Award className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <div className="text-4xl font-bold text-white mb-2">47</div>
                  <div className="text-gray-400">PhD Candidates</div>
                </div>
                <div className="bg-gradient-to-br from-green-900/20 to-teal-900/20 backdrop-blur-xl rounded-2xl p-8 border border-white/10 text-center">
                  <Icons.Globe className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <div className="text-4xl font-bold text-white mb-2">23</div>
                  <div className="text-gray-400">International Partners</div>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Projects Section */}
        {activeTab === 'projects' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="py-20 px-4"
          >
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold font-space mb-4">
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                    Active Research Projects
                  </span>
                </h2>
                <p className="text-gray-400 text-xl">47 ongoing projects across multiple disciplines</p>
              </div>

              {/* Project Cards */}
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Deep Sea Exploration Initiative",
                    status: "In Progress",
                    progress: 65,
                    team: "Marine Biology Unit",
                    budget: "$3.2M",
                    deadline: "Dec 2024",
                    description: "Mapping uncharted deep sea territories using advanced ROV technology"
                  },
                  {
                    title: "Coral Restoration Program",
                    status: "In Progress",
                    progress: 45,
                    team: "Conservation Research",
                    budget: "$1.8M",
                    deadline: "Mar 2025",
                    description: "Large-scale coral reef restoration using innovative transplantation techniques"
                  },
                  {
                    title: "AI Ocean Monitoring System",
                    status: "Testing Phase",
                    progress: 80,
                    team: "Ocean Technology Lab",
                    budget: "$2.5M",
                    deadline: "Sep 2024",
                    description: "Developing AI models for real-time ocean condition monitoring"
                  },
                  {
                    title: "Climate Impact Assessment",
                    status: "Data Collection",
                    progress: 30,
                    team: "Climate Research Division",
                    budget: "$4.1M",
                    deadline: "Jun 2025",
                    description: "Comprehensive study on climate change effects on marine ecosystems"
                  }
                ].map((project, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-cyan-500 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-bold text-white">{project.title}</h3>
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                        {project.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-400 mb-4">{project.description}</p>
                    
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-cyan-400">{project.progress}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${project.progress}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400">Team</div>
                        <div className="text-white font-medium">{project.team}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Budget</div>
                        <div className="text-green-400 font-medium">{project.budget}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Deadline</div>
                        <div className="text-yellow-400 font-medium">{project.deadline}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Research Impact Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black via-purple-950/10 to-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-space mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                Global Research Impact
              </span>
            </h2>
            <p className="text-xl text-gray-400">Our research shapes ocean conservation worldwide</p>
          </motion.div>

          {/* Impact Visualization */}
          <div className="relative aspect-video bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-2xl p-8 backdrop-blur-xl border border-white/10">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Animated rings */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-[-100px] border-2 border-purple-500/20 rounded-full"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-[-50px] border-2 border-cyan-500/20 rounded-full"
                />
                
                {/* Center globe */}
                <div className="relative w-48 h-48 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <Icons.Globe className="w-24 h-24 text-white/80" />
                </div>

                {/* Data points around globe */}
                {[
                  { top: '-80px', left: '50%', label: '3,847', sublabel: 'Citations' },
                  { top: '50%', right: '-120px', label: '89', sublabel: 'Papers' },
                  { bottom: '-80px', left: '50%', label: '32', sublabel: 'Countries' },
                  { top: '50%', left: '-120px', label: '245', sublabel: 'Partners' }
                ].map((pos, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.2 }}
                    className="absolute bg-black/80 backdrop-blur-xl rounded-xl p-3 border border-purple-500/30"
                    style={pos}
                  >
                    <div className="text-2xl font-bold text-purple-400">{pos.label}</div>
                    <div className="text-xs text-gray-400">{pos.sublabel}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold font-space mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-600 bg-clip-text text-transparent">
                Join Our Research Community
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Collaborate with world-class scientists and contribute to ocean conservation
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-medium hover:scale-105 transition-all">
                <Icons.UserPlus className="inline w-5 h-5 mr-2" />
                Become a Researcher
              </button>
              <button className="px-8 py-4 border-2 border-purple-500 rounded-full text-purple-400 font-medium hover:bg-purple-500 hover:text-white transition-all">
                <Icons.Mail className="inline w-5 h-5 mr-2" />
                Contact Research Team
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ResearchExcellenceRedesign;
