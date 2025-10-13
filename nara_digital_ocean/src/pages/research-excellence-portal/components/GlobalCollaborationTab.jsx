import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, MapPin, Users, FileText, TrendingUp, ExternalLink,
  Award, BookOpen, Handshake, Building, Mail, Phone,
  Calendar, CheckCircle, Clock, Target, Sparkles
} from 'lucide-react';

const GlobalCollaborationTab = () => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedPartner, setSelectedPartner] = useState(null);

  // Global Statistics
  const globalStats = [
    {
      id: 'countries',
      label: 'Countries',
      value: 42,
      icon: Globe,
      color: 'from-cyan-400 to-blue-600'
    },
    {
      id: 'institutions',
      label: 'Partner Institutions',
      value: 89,
      icon: Building,
      color: 'from-purple-400 to-pink-600'
    },
    {
      id: 'publications',
      label: 'Joint Publications',
      value: 456,
      icon: FileText,
      color: 'from-green-400 to-emerald-600'
    },
    {
      id: 'researchers',
      label: 'Collaborating Researchers',
      value: 723,
      icon: Users,
      color: 'from-amber-400 to-orange-600'
    }
  ];

  // Regional Distribution
  const regions = [
    {
      id: 'asia-pacific',
      name: 'Asia-Pacific',
      countries: 18,
      institutions: 34,
      publications: 234,
      researchers: 312,
      color: 'cyan',
      highlights: ['Leading collaboration hub', 'Most joint publications'],
      topCountries: ['Japan', 'Australia', 'Singapore', 'India', 'China']
    },
    {
      id: 'europe',
      name: 'Europe',
      countries: 12,
      institutions: 28,
      publications: 156,
      researchers: 245,
      color: 'blue',
      highlights: ['Strong research networks', 'EU-funded projects'],
      topCountries: ['UK', 'Germany', 'Netherlands', 'France', 'Norway']
    },
    {
      id: 'north-america',
      name: 'North America',
      countries: 3,
      institutions: 18,
      publications: 98,
      researchers: 134,
      color: 'purple',
      highlights: ['High-impact collaborations', 'Advanced technology'],
      topCountries: ['USA', 'Canada', 'Mexico']
    },
    {
      id: 'africa',
      name: 'Africa',
      countries: 5,
      institutions: 6,
      publications: 34,
      researchers: 45,
      color: 'green',
      highlights: ['Growing partnerships', 'Capacity building'],
      topCountries: ['South Africa', 'Kenya', 'Tanzania', 'Mauritius']
    },
    {
      id: 'latin-america',
      name: 'Latin America',
      countries: 4,
      institutions: 3,
      publications: 21,
      researchers: 28,
      color: 'amber',
      highlights: ['Emerging collaborations', 'Marine biodiversity'],
      topCountries: ['Brazil', 'Chile', 'Peru', 'Argentina']
    }
  ];

  // Top Partner Institutions
  const partners = [
    {
      id: 1,
      name: 'National Oceanic and Atmospheric Administration (NOAA)',
      country: 'United States',
      type: 'Government Agency',
      region: 'North America',
      joinedYear: 2015,
      status: 'active',
      collaborationType: ['Research', 'Data Sharing', 'Training'],
      jointPublications: 42,
      activeProjects: 5,
      mou: true,
      contact: {
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@noaa.gov',
        phone: '+1 301 555 0123'
      },
      focusAreas: ['Climate Change', 'Oceanography', 'Marine Ecosystems'],
      achievements: [
        'Joint ocean monitoring network',
        '15 co-authored papers',
        'Technology transfer program'
      ],
      logo: 'https://via.placeholder.com/80x80'
    },
    {
      id: 2,
      name: 'CSIRO Oceans and Atmosphere',
      country: 'Australia',
      type: 'Research Organization',
      region: 'Asia-Pacific',
      joinedYear: 2017,
      status: 'active',
      collaborationType: ['Research', 'Student Exchange', 'Equipment Sharing'],
      jointPublications: 38,
      activeProjects: 4,
      mou: true,
      contact: {
        name: 'Prof. Michael Chen',
        email: 'm.chen@csiro.au',
        phone: '+61 3 9545 8000'
      },
      focusAreas: ['Marine Biology', 'Climate Science', 'Fisheries'],
      achievements: [
        'Joint research vessels program',
        '12 PhD student exchanges',
        'Shared laboratory facilities'
      ],
      logo: 'https://via.placeholder.com/80x80'
    },
    {
      id: 3,
      name: 'University of Tokyo - Ocean Research Institute',
      country: 'Japan',
      type: 'University',
      region: 'Asia-Pacific',
      joinedYear: 2016,
      status: 'active',
      collaborationType: ['Research', 'Student Exchange', 'Conferences'],
      jointPublications: 34,
      activeProjects: 3,
      mou: true,
      contact: {
        name: 'Prof. Hiroshi Tanaka',
        email: 'h.tanaka@ori.u-tokyo.ac.jp',
        phone: '+81 3 5841 6500'
      },
      focusAreas: ['Oceanography', 'Marine Technology', 'Biodiversity'],
      achievements: [
        'Annual joint symposium',
        '8 joint research cruises',
        'Technology innovation awards'
      ],
      logo: 'https://via.placeholder.com/80x80'
    },
    {
      id: 4,
      name: 'GEOMAR Helmholtz Centre',
      country: 'Germany',
      type: 'Research Institute',
      region: 'Europe',
      joinedYear: 2018,
      status: 'active',
      collaborationType: ['Research', 'Data Sharing', 'Training'],
      jointPublications: 28,
      activeProjects: 3,
      mou: true,
      contact: {
        name: 'Dr. Klaus Schmidt',
        email: 'k.schmidt@geomar.de',
        phone: '+49 431 600 0'
      },
      focusAreas: ['Marine Geology', 'Ocean Dynamics', 'Climate'],
      achievements: [
        'Deep-sea research collaboration',
        'Equipment sharing agreement',
        'Joint PhD program'
      ],
      logo: 'https://via.placeholder.com/80x80'
    },
    {
      id: 5,
      name: 'Scripps Institution of Oceanography',
      country: 'United States',
      type: 'Research Institute',
      region: 'North America',
      joinedYear: 2014,
      status: 'active',
      collaborationType: ['Research', 'Student Exchange', 'Data Sharing'],
      jointPublications: 31,
      activeProjects: 4,
      mou: true,
      contact: {
        name: 'Dr. Maria Rodriguez',
        email: 'm.rodriguez@ucsd.edu',
        phone: '+1 858 534 3624'
      },
      focusAreas: ['Ocean Science', 'Climate Research', 'Marine Biology'],
      achievements: [
        'Decade-long partnership',
        '20+ joint expeditions',
        'Major grant collaborations'
      ],
      logo: 'https://via.placeholder.com/80x80'
    },
    {
      id: 6,
      name: 'National University of Singapore',
      country: 'Singapore',
      type: 'University',
      region: 'Asia-Pacific',
      joinedYear: 2019,
      status: 'active',
      collaborationType: ['Research', 'Student Exchange', 'Joint Programs'],
      jointPublications: 24,
      activeProjects: 2,
      mou: true,
      contact: {
        name: 'Prof. Wei Lin',
        email: 'wei.lin@nus.edu.sg',
        phone: '+65 6516 6666'
      },
      focusAreas: ['Marine Biotechnology', 'Aquaculture', 'Conservation'],
      achievements: [
        'Joint masters program',
        'Innovation lab established',
        'Start-up incubation'
      ],
      logo: 'https://via.placeholder.com/80x80'
    }
  ];

  // Collaboration Opportunities
  const opportunities = [
    {
      id: 1,
      title: 'ASEAN Marine Science Network - Research Fellowship',
      type: 'Fellowship',
      deadline: '2025-03-15',
      region: 'Asia-Pacific',
      value: '$50,000',
      duration: '12 months',
      description: 'Fellowship for joint research projects in marine science across ASEAN countries'
    },
    {
      id: 2,
      title: 'EU Horizon - Blue Economy Innovation Call',
      type: 'Grant',
      deadline: '2025-04-30',
      region: 'Europe',
      value: '€2.5M',
      duration: '36 months',
      description: 'Large-scale collaborative projects on sustainable blue economy'
    },
    {
      id: 3,
      title: 'Indian Ocean Research Exchange Program',
      type: 'Exchange',
      deadline: '2025-02-28',
      region: 'Asia-Pacific',
      value: '$25,000',
      duration: '6 months',
      description: 'Researcher exchange program for Indian Ocean coastal states'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Global Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {globalStats.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 cursor-pointer"
          >
            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} mb-4`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-slate-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Interactive World Map Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Global Collaboration Network</h3>
            <p className="text-slate-400">Click on a region to view partnerships</p>
          </div>
          <div className="p-3 rounded-xl bg-cyan-500/20">
            <Globe className="w-8 h-8 text-cyan-400" />
          </div>
        </div>

        {/* Simplified World Map Visualization */}
        <div className="relative h-64 bg-slate-900/50 rounded-xl overflow-hidden mb-6">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Globe className="w-24 h-24 text-cyan-400/30 mx-auto mb-4" />
              <p className="text-slate-400 text-sm">Interactive map showing global partnerships</p>
              <p className="text-slate-500 text-xs mt-2">89 institutions across 42 countries</p>
            </div>
          </div>
        </div>

        {/* Regional Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {regions.map((region, index) => (
            <motion.div
              key={region.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedRegion(region.id === selectedRegion ? null : region.id)}
              className={`p-5 rounded-xl border cursor-pointer transition-all ${
                selectedRegion === region.id
                  ? `bg-${region.color}-500/20 border-${region.color}-500/50`
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className={`text-lg font-bold text-${region.color}-400`}>{region.name}</h4>
                <MapPin className={`w-5 h-5 text-${region.color}-400`} />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <div className="text-2xl font-bold text-white">{region.countries}</div>
                  <div className="text-xs text-slate-400">Countries</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{region.institutions}</div>
                  <div className="text-xs text-slate-400">Institutions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{region.publications}</div>
                  <div className="text-xs text-slate-400">Publications</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{region.researchers}</div>
                  <div className="text-xs text-slate-400">Researchers</div>
                </div>
              </div>

              <AnimatePresence>
                {selectedRegion === region.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-white/10 pt-4 mt-4 space-y-3"
                  >
                    <div>
                      <div className="text-xs text-slate-400 mb-2">Highlights:</div>
                      {region.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-slate-300 mb-1">
                          <Sparkles className="w-3 h-3 text-cyan-400" />
                          {highlight}
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-2">Top Countries:</div>
                      <div className="flex flex-wrap gap-1">
                        {region.topCountries.map((country, idx) => (
                          <span key={idx} className="px-2 py-1 rounded-full bg-white/5 text-xs text-slate-300">
                            {country}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Partner Institutions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-white">Partner Institutions</h3>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all">
            <Handshake className="w-4 h-4" />
            Become a Partner
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 hover:border-cyan-500/30 transition-all"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Building className="w-8 h-8 text-cyan-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-white mb-2">{partner.name}</h4>
                  <div className="flex flex-wrap gap-2 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {partner.country}
                    </span>
                    <span>•</span>
                    <span>{partner.type}</span>
                    <span>•</span>
                    <span className="text-green-400">Since {partner.joinedYear}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-slate-400 mb-1">Publications</div>
                  <div className="text-xl font-bold text-white">{partner.jointPublications}</div>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-slate-400 mb-1">Projects</div>
                  <div className="text-xl font-bold text-white">{partner.activeProjects}</div>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-slate-400 mb-1">MoU</div>
                  <div className="text-xl">
                    {partner.mou ? <CheckCircle className="w-6 h-6 text-green-400" /> : <Clock className="w-6 h-6 text-amber-400" />}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-xs text-slate-400 mb-2">Focus Areas:</div>
                <div className="flex flex-wrap gap-2">
                  {partner.focusAreas.map((area, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs">
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setSelectedPartner(partner.id === selectedPartner ? null : partner.id)}
                className="w-full py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-all text-sm font-medium"
              >
                {selectedPartner === partner.id ? 'Hide Details' : 'View Details'}
              </button>

              <AnimatePresence>
                {selectedPartner === partner.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-white/10 pt-4 mt-4 space-y-4"
                  >
                    <div>
                      <div className="text-xs text-slate-400 mb-2">Key Achievements:</div>
                      <ul className="space-y-1">
                        {partner.achievements.map((achievement, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                            <Award className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="text-xs text-slate-400 mb-2">Contact:</div>
                      <div className="space-y-2 text-sm text-slate-300">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-cyan-400" />
                          {partner.contact.name}
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-cyan-400" />
                          <a href={`mailto:${partner.contact.email}`} className="text-cyan-400 hover:text-cyan-300">
                            {partner.contact.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-cyan-400" />
                          {partner.contact.phone}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Collaboration Opportunities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10"
      >
        <div className="flex items-center gap-3 mb-6">
          <Target className="w-6 h-6 text-amber-400" />
          <h3 className="text-2xl font-bold text-white">Collaboration Opportunities</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {opportunities.map((opp, index) => (
            <motion.div
              key={opp.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/30 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase">
                  {opp.type}
                </span>
                <Calendar className="w-4 h-4 text-slate-400" />
              </div>

              <h4 className="text-lg font-bold text-white mb-2">{opp.title}</h4>
              <p className="text-sm text-slate-300 mb-4">{opp.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Value:</span>
                  <span className="text-green-400 font-semibold">{opp.value}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Duration:</span>
                  <span className="text-white">{opp.duration}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Deadline:</span>
                  <span className="text-amber-400 font-semibold">{opp.deadline}</span>
                </div>
              </div>

              <button className="w-full py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold hover:shadow-lg hover:shadow-amber-500/30 transition-all text-sm flex items-center justify-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Apply Now
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default GlobalCollaborationTab;
