import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target, Users, DollarSign, Calendar, Clock, TrendingUp,
  CheckCircle, AlertCircle, PlayCircle, Award, MapPin,
  FileText, ExternalLink, ChevronDown, ChevronRight, 
  GitBranch, Layers, Sparkles, Eye, Filter
} from 'lucide-react';

const ActiveProjectsTab = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [expandedProject, setExpandedProject] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid or timeline

  // Project Categories
  const categories = [
    { id: 'all', name: 'All Projects', count: 156 },
    { id: 'marine-biology', name: 'Marine Biology', count: 42 },
    { id: 'climate', name: 'Climate Research', count: 38 },
    { id: 'fisheries', name: 'Fisheries', count: 31 },
    { id: 'conservation', name: 'Conservation', count: 27 },
    { id: 'policy', name: 'Policy & Governance', count: 18 }
  ];

  // Project Status
  const statusOptions = [
    { id: 'all', name: 'All Status', color: 'slate' },
    { id: 'active', name: 'Active', color: 'green' },
    { id: 'planning', name: 'Planning', color: 'blue' },
    { id: 'completing', name: 'Completing', color: 'amber' },
    { id: 'completed', name: 'Completed', color: 'purple' }
  ];

  // Sample Projects Data
  const projects = [
    {
      id: 1,
      title: 'Indian Ocean Microplastic Monitoring Network',
      category: 'marine-biology',
      status: 'active',
      duration: '2023-2026',
      progress: 67,
      budget: '$2.8M',
      spent: '$1.9M',
      pi: 'Dr. Priya Fernando',
      team: 12,
      partners: ['NOAA', 'CSIRO', 'University of Tokyo'],
      description: 'Establishing a comprehensive network of monitoring stations across the Indian Ocean to track microplastic pollution patterns and develop predictive models.',
      objectives: [
        'Deploy 50 monitoring stations across the Indian Ocean',
        'Develop AI-powered microplastic detection system',
        'Create predictive pollution dispersion models',
        'Publish comprehensive ocean health reports'
      ],
      milestones: [
        { name: 'Station Deployment Phase 1', date: '2023-06', status: 'completed' },
        { name: 'AI Model Development', date: '2024-03', status: 'completed' },
        { name: 'Data Collection & Analysis', date: '2024-12', status: 'active' },
        { name: 'Final Report & Publication', date: '2026-06', status: 'upcoming' }
      ],
      outcomes: [
        '32 stations deployed',
        '2 papers published',
        '45,000+ data points collected'
      ],
      fundingSource: 'National Science Foundation',
      publications: 2,
      datasets: 4,
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop'
    },
    {
      id: 2,
      title: 'Sri Lankan Coral Reef Restoration Initiative',
      category: 'conservation',
      status: 'active',
      duration: '2022-2025',
      progress: 78,
      budget: '$1.5M',
      spent: '$1.2M',
      pi: 'Dr. Nimal Perera',
      team: 8,
      partners: ['WWF', 'Coral Triangle Initiative', 'Local Communities'],
      description: 'Large-scale coral reef restoration using innovative coral gardening techniques and community engagement programs.',
      objectives: [
        'Restore 10 hectares of degraded coral reefs',
        'Train 100 community members in coral gardening',
        'Establish 5 coral nurseries',
        'Monitor long-term ecosystem recovery'
      ],
      milestones: [
        { name: 'Site Assessment', date: '2022-08', status: 'completed' },
        { name: 'Nursery Establishment', date: '2023-03', status: 'completed' },
        { name: 'Coral Transplantation', date: '2024-06', status: 'active' },
        { name: 'Impact Evaluation', date: '2025-12', status: 'upcoming' }
      ],
      outcomes: [
        '7.8 hectares restored',
        '85 community members trained',
        '15,000+ coral fragments transplanted'
      ],
      fundingSource: 'Global Environment Facility',
      publications: 3,
      datasets: 2,
      image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600&h=400&fit=crop'
    },
    {
      id: 3,
      title: 'AI-Powered Fish Stock Assessment System',
      category: 'fisheries',
      status: 'active',
      duration: '2024-2027',
      progress: 45,
      budget: '$3.2M',
      spent: '$1.4M',
      pi: 'Dr. Ayesha Khan',
      team: 15,
      partners: ['FAO', 'Microsoft AI', 'Regional Fisheries Agencies'],
      description: 'Developing machine learning models for real-time fish stock assessment using satellite imagery, acoustic data, and environmental parameters.',
      objectives: [
        'Deploy AI models across 12 fishing zones',
        'Improve stock assessment accuracy by 40%',
        'Create real-time monitoring dashboard',
        'Train 500 fisheries officers'
      ],
      milestones: [
        { name: 'Data Collection & Labeling', date: '2024-06', status: 'completed' },
        { name: 'Model Training & Validation', date: '2024-12', status: 'active' },
        { name: 'System Deployment', date: '2025-09', status: 'upcoming' },
        { name: 'Nationwide Rollout', date: '2027-03', status: 'upcoming' }
      ],
      outcomes: [
        'AI model 87% accurate',
        '3 pilot zones deployed',
        '120 officers trained'
      ],
      fundingSource: 'World Bank Blue Economy Fund',
      publications: 1,
      datasets: 8,
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop'
    },
    {
      id: 4,
      title: 'Blue Carbon Sequestration Valuation Study',
      category: 'climate',
      status: 'completing',
      duration: '2022-2024',
      progress: 92,
      budget: '$980K',
      spent: '$900K',
      pi: 'Dr. Sunil Wickramasinghe',
      team: 6,
      partners: ['IUCN', 'Conservation International', 'Ministry of Environment'],
      description: 'Comprehensive economic valuation of carbon sequestration services provided by Sri Lankan mangrove and seagrass ecosystems.',
      objectives: [
        'Map all coastal blue carbon ecosystems',
        'Quantify carbon sequestration rates',
        'Calculate economic value',
        'Develop carbon credit framework'
      ],
      milestones: [
        { name: 'Ecosystem Mapping', date: '2022-12', status: 'completed' },
        { name: 'Field Measurements', date: '2023-08', status: 'completed' },
        { name: 'Economic Analysis', date: '2024-03', status: 'completed' },
        { name: 'Policy Recommendations', date: '2024-12', status: 'active' }
      ],
      outcomes: [
        '$45M/year carbon value identified',
        '12,000 hectares mapped',
        '4 papers published'
      ],
      fundingSource: 'Green Climate Fund',
      publications: 4,
      datasets: 3,
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop'
    },
    {
      id: 5,
      title: 'Ocean Acidification Impact on Marine Life',
      category: 'climate',
      status: 'planning',
      duration: '2025-2028',
      progress: 15,
      budget: '$2.1M',
      spent: '$315K',
      pi: 'Dr. Lakshmi Dissanayake',
      team: 10,
      partners: ['Scripps Institution', 'GEOMAR', 'National University Singapore'],
      description: 'Long-term study examining the impacts of ocean acidification on Sri Lankan marine biodiversity and ecosystem services.',
      objectives: [
        'Establish 8 ocean pH monitoring stations',
        'Conduct controlled acidification experiments',
        'Assess impacts on 50 key species',
        'Develop adaptation strategies'
      ],
      milestones: [
        { name: 'Equipment Procurement', date: '2025-03', status: 'active' },
        { name: 'Station Installation', date: '2025-09', status: 'upcoming' },
        { name: 'Data Collection Phase', date: '2026-03', status: 'upcoming' },
        { name: 'Final Assessment', date: '2028-12', status: 'upcoming' }
      ],
      outcomes: [
        'Planning phase 85% complete',
        'Partners secured',
        'Equipment ordered'
      ],
      fundingSource: 'EU Horizon Programme',
      publications: 0,
      datasets: 0,
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop'
    },
    {
      id: 6,
      title: 'Sustainable Fishing Technology Innovation',
      category: 'fisheries',
      status: 'active',
      duration: '2023-2026',
      progress: 58,
      budget: '$1.8M',
      spent: '$1.0M',
      pi: 'Dr. Ravi Kumar',
      team: 11,
      partners: ['FAO', 'Local Fishing Cooperatives', 'Tech Startups'],
      description: 'Developing and testing innovative fishing technologies that reduce bycatch and improve selectivity while maintaining economic viability.',
      objectives: [
        'Design 3 new gear types',
        'Conduct field trials with 100 vessels',
        'Reduce bycatch by 60%',
        'Create technology adoption framework'
      ],
      milestones: [
        { name: 'Technology Design', date: '2023-09', status: 'completed' },
        { name: 'Prototype Testing', date: '2024-06', status: 'completed' },
        { name: 'Field Trials', date: '2025-03', status: 'active' },
        { name: 'Commercialization', date: '2026-12', status: 'upcoming' }
      ],
      outcomes: [
        '2 gear types field-tested',
        '45% bycatch reduction achieved',
        '45 vessels participating'
      ],
      fundingSource: 'Asian Development Bank',
      publications: 2,
      datasets: 5,
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop'
    }
  ];

  const filteredProjects = projects.filter(project => {
    const categoryMatch = selectedCategory === 'all' || project.category === selectedCategory;
    const statusMatch = selectedStatus === 'all' || project.status === selectedStatus;
    return categoryMatch && statusMatch;
  });

  const getStatusColor = (status) => {
    const colors = {
      active: 'green',
      planning: 'blue',
      completing: 'amber',
      completed: 'purple'
    };
    return colors[status] || 'slate';
  };

  const getStatusIcon = (status) => {
    const icons = {
      active: PlayCircle,
      planning: Clock,
      completing: AlertCircle,
      completed: CheckCircle
    };
    return icons[status] || Target;
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30"
        >
          <div className="flex items-center gap-3 mb-2">
            <PlayCircle className="w-5 h-5 text-green-400" />
            <span className="text-sm text-green-300">Active</span>
          </div>
          <div className="text-3xl font-bold text-white">89</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30"
        >
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-blue-300">Planning</span>
          </div>
          <div className="text-3xl font-bold text-white">24</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30"
        >
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            <span className="text-sm text-amber-300">Completing</span>
          </div>
          <div className="text-3xl font-bold text-white">18</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30"
        >
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-purple-300">Completed</span>
          </div>
          <div className="text-3xl font-bold text-white">25</div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Category Filter */}
          <div className="flex-1">
            <label className="block text-sm text-slate-400 mb-2">Category</label>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 border'
                      : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {cat.name}
                  <span className="ml-2 text-xs opacity-70">({cat.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div className="w-full md:w-48">
            <label className="block text-sm text-slate-400 mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {statusOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredProjects.map((project, index) => {
          const StatusIcon = getStatusIcon(project.status);
          const isExpanded = expandedProject === project.id;

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 hover:border-cyan-500/30 transition-all"
            >
              {/* Project Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full bg-${getStatusColor(project.status)}-500/20 border border-${getStatusColor(project.status)}-500/30 text-${getStatusColor(project.status)}-300 text-xs font-semibold uppercase flex items-center gap-1`}>
                      <StatusIcon className="w-3 h-3" />
                      {project.status}
                    </span>
                    <span className="text-xs text-slate-400">{project.duration}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">
                    {project.title}
                  </h3>
                  
                  <p className="text-slate-400 text-sm mb-3">
                    PI: {project.pi}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-400">Progress</span>
                  <span className="text-cyan-400 font-semibold">{project.progress}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                  />
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-slate-400">Budget</span>
                  </div>
                  <div className="text-sm font-semibold text-white">{project.budget}</div>
                  <div className="text-xs text-slate-500">Spent: {project.spent}</div>
                </div>

                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-3 h-3 text-cyan-400" />
                    <span className="text-xs text-slate-400">Team</span>
                  </div>
                  <div className="text-sm font-semibold text-white">{project.team}</div>
                  <div className="text-xs text-slate-500">Members</div>
                </div>

                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-3 h-3 text-purple-400" />
                    <span className="text-xs text-slate-400">Output</span>
                  </div>
                  <div className="text-sm font-semibold text-white">{project.publications}</div>
                  <div className="text-xs text-slate-500">Papers</div>
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-300 text-sm mb-4">
                {isExpanded ? project.description : `${project.description.substring(0, 120)}...`}
              </p>

              {/* Expanded Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 mb-4"
                  >
                    {/* Objectives */}
                    <div>
                      <h4 className="text-sm font-semibold text-cyan-400 mb-2">Objectives:</h4>
                      <ul className="space-y-1">
                        {project.objectives.map((obj, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-slate-300 text-sm">
                            <ChevronRight className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Key Outcomes */}
                    <div>
                      <h4 className="text-sm font-semibold text-green-400 mb-2">Key Outcomes:</h4>
                      <ul className="space-y-1">
                        {project.outcomes.map((outcome, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-slate-300 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span>{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Partners */}
                    <div>
                      <h4 className="text-sm font-semibold text-purple-400 mb-2">Partners:</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.partners.map((partner, idx) => (
                          <span key={idx} className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs">
                            {partner}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Milestones */}
                    <div>
                      <h4 className="text-sm font-semibold text-amber-400 mb-3">Timeline:</h4>
                      <div className="space-y-2">
                        {project.milestones.map((milestone, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${
                              milestone.status === 'completed' ? 'bg-green-400' :
                              milestone.status === 'active' ? 'bg-cyan-400' :
                              'bg-slate-600'
                            }`} />
                            <div className="flex-1">
                              <div className="text-sm text-white">{milestone.name}</div>
                              <div className="text-xs text-slate-400">{milestone.date}</div>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded ${
                              milestone.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                              milestone.status === 'active' ? 'bg-cyan-500/20 text-cyan-300' :
                              'bg-slate-700 text-slate-400'
                            }`}>
                              {milestone.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  onClick={() => setExpandedProject(isExpanded ? null : project.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-all text-sm"
                >
                  <Eye className="w-4 h-4" />
                  {isExpanded ? 'Show Less' : 'View Details'}
                </button>
                
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all text-sm">
                  <ExternalLink className="w-4 h-4" />
                  Project Page
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ActiveProjectsTab;
