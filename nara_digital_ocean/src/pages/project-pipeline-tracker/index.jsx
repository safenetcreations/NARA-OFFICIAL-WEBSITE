import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import {
  projectsService,
  milestonesService,
  outputsService,
  budgetTrackingService,
  projectPipelineDashboardService
} from '../../services/projectPipelineService';

const ProjectPipelineTracker = () => {
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard' | 'projects' | 'detail'
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filters, setFilters] = useState({
    status: 'all',
    ragStatus: 'all',
    division: 'all',
    fundingSource: 'all',
    searchTerm: ''
  });

  useEffect(() => {
    loadProjects();
    loadDashboardStats();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [projects, filters]);

  const loadProjects = async () => {
    setLoading(true);
    const { data, error } = await projectsService.getAll({ visibility: 'public' });
    if (!error && data) {
      setProjects(data);
    }
    setLoading(false);
  };

  const loadDashboardStats = async () => {
    const { data, error } = await projectPipelineDashboardService.getStatistics('public');
    if (!error && data) {
      setDashboardStats(data);
    }
  };

  const applyFilters = () => {
    let filtered = [...projects];

    if (filters.status !== 'all') {
      filtered = filtered.filter(p => p.status === filters.status);
    }

    if (filters.ragStatus !== 'all') {
      filtered = filtered.filter(p => p.ragStatus === filters.ragStatus);
    }

    if (filters.division !== 'all') {
      filtered = filtered.filter(p => p.division === filters.division);
    }

    if (filters.fundingSource !== 'all') {
      filtered = filtered.filter(p => p.fundingSource === filters.fundingSource);
    }

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.principalInvestigator.toLowerCase().includes(term)
      );
    }

    setFilteredProjects(filtered);
  };

  const getRAGColor = (ragStatus) => {
    const colors = {
      green: 'bg-green-500',
      amber: 'bg-yellow-500',
      red: 'bg-red-500'
    };
    return colors[ragStatus] || 'bg-gray-400';
  };

  const getRAGTextColor = (ragStatus) => {
    const colors = {
      green: 'text-green-700',
      amber: 'text-yellow-700',
      red: 'text-red-700'
    };
    return colors[ragStatus] || 'text-gray-700';
  };

  const getRAGBgColor = (ragStatus) => {
    const colors = {
      green: 'bg-green-50',
      amber: 'bg-yellow-50',
      red: 'bg-red-50'
    };
    return colors[ragStatus] || 'bg-gray-50';
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      planning: 'bg-blue-100 text-blue-700',
      active: 'bg-green-100 text-green-700',
      on_hold: 'bg-yellow-100 text-yellow-700',
      completed: 'bg-purple-100 text-purple-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Dashboard View
  const renderDashboard = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white p-12">
        <div className="relative z-10">
          <Icons.Activity className="w-16 h-16 mb-4 opacity-90" />
          <h1 className="text-4xl font-bold mb-3">Project Pipeline Tracker</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Track NARA's research projects in real-time. Monitor progress, budgets, outputs, and impact through our public transparency dashboard.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
          <Icons.TrendingUp className="w-full h-full" />
        </div>
      </div>

      {/* Statistics Cards */}
      {dashboardStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Icons.FolderOpen}
            label="Total Projects"
            value={dashboardStats.overview.totalProjects}
            color="blue"
          />
          <StatCard
            icon={Icons.Activity}
            label="Active Projects"
            value={dashboardStats.overview.activeProjects}
            color="green"
          />
          <StatCard
            icon={Icons.CheckCircle}
            label="Completed Projects"
            value={dashboardStats.overview.completedProjects}
            color="purple"
          />
          <StatCard
            icon={Icons.DollarSign}
            label="Total Budget"
            value={formatCurrency(dashboardStats.overview.totalBudget)}
            color="indigo"
            isLarge
          />
        </div>
      )}

      {/* RAG Status Overview */}
      {dashboardStats && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Icons.AlertCircle className="w-7 h-7 text-blue-600" />
            Project Health (RAG Status)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-700 font-semibold">On Track (Green)</span>
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
              </div>
              <div className="text-4xl font-bold text-green-800">{dashboardStats.ragStatus.green}</div>
              <p className="text-green-600 text-sm mt-2">Projects proceeding as planned</p>
            </div>
            <div className="bg-yellow-50 rounded-xl p-6 border-2 border-yellow-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-yellow-700 font-semibold">At Risk (Amber)</span>
                <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              </div>
              <div className="text-4xl font-bold text-yellow-800">{dashboardStats.ragStatus.amber}</div>
              <p className="text-yellow-600 text-sm mt-2">Minor issues requiring attention</p>
            </div>
            <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-red-700 font-semibold">Critical (Red)</span>
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
              </div>
              <div className="text-4xl font-bold text-red-800">{dashboardStats.ragStatus.red}</div>
              <p className="text-red-600 text-sm mt-2">Significant delays or issues</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => setActiveView('projects')}
          className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl p-8 hover:shadow-2xl transition-all duration-300 group"
        >
          <Icons.Search className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-2xl font-bold mb-2">Browse All Projects</h3>
          <p className="text-blue-100">Explore our complete research portfolio with advanced filtering</p>
        </button>
        <button
          onClick={() => {
            setFilters({ ...filters, ragStatus: 'red' });
            setActiveView('projects');
          }}
          className="bg-gradient-to-br from-red-600 to-red-700 text-white rounded-xl p-8 hover:shadow-2xl transition-all duration-300 group"
        >
          <Icons.AlertTriangle className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-2xl font-bold mb-2">Critical Projects</h3>
          <p className="text-red-100">View projects requiring immediate attention</p>
        </button>
      </div>

      {/* Division Breakdown */}
      {dashboardStats && Object.keys(dashboardStats.byDivision).length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Icons.Building className="w-7 h-7 text-blue-600" />
            Projects by Division
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(dashboardStats.byDivision).map(([division, count]) => (
              <div key={division} className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                <span className="font-medium text-gray-700">{division}</span>
                <span className="text-2xl font-bold text-blue-600">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );

  // Projects List View
  const renderProjects = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-xl p-8">
        <button
          onClick={() => setActiveView('dashboard')}
          className="flex items-center gap-2 text-blue-100 hover:text-white mb-4 transition-colors"
        >
          <Icons.ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold">Research Projects</h1>
        <p className="text-blue-100 mt-2">Browse and track all public research projects</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Icons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={filters.searchTerm}
                onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                placeholder="Search projects, PI, keywords..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* RAG Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">RAG Status</label>
            <select
              value={filters.ragStatus}
              onChange={(e) => setFilters({ ...filters, ragStatus: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All RAG</option>
              <option value="green">Green (On Track)</option>
              <option value="amber">Amber (At Risk)</option>
              <option value="red">Red (Critical)</option>
            </select>
          </div>

          {/* Division Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Division</label>
            <select
              value={filters.division}
              onChange={(e) => setFilters({ ...filters, division: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Divisions</option>
              <option value="Marine Biology & Ecosystems">Marine Biology & Ecosystems</option>
              <option value="Fisheries Science">Fisheries Science</option>
              <option value="Aquaculture">Aquaculture</option>
              <option value="Environmental Monitoring">Environmental Monitoring</option>
              <option value="Post-Harvest & Quality">Post-Harvest & Quality</option>
              <option value="Hydrography">Hydrography</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <span className="text-sm text-gray-600">
            Showing {filteredProjects.length} of {projects.length} projects
          </span>
          <button
            onClick={() => setFilters({
              status: 'all',
              ragStatus: 'all',
              division: 'all',
              fundingSource: 'all',
              searchTerm: ''
            })}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Icons.FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-xl text-gray-600">No projects found matching your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => {
                setSelectedProject(project);
                setActiveView('detail');
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );

  // Project Detail View
  const renderProjectDetail = () => {
    if (!selectedProject) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className={`${getRAGBgColor(selectedProject.ragStatus)} rounded-xl p-8 border-2 ${selectedProject.ragStatus === 'green' ? 'border-green-200' : selectedProject.ragStatus === 'amber' ? 'border-yellow-200' : 'border-red-200'}`}>
          <button
            onClick={() => setActiveView('projects')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
          >
            <Icons.ArrowLeft className="w-5 h-5" />
            Back to Projects
          </button>

          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeColor(selectedProject.status)}`}>
                  {selectedProject.status.replace('_', ' ').toUpperCase()}
                </span>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getRAGColor(selectedProject.ragStatus)}`}></div>
                  <span className={`font-semibold ${getRAGTextColor(selectedProject.ragStatus)}`}>
                    {selectedProject.ragStatus.toUpperCase()}
                  </span>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{selectedProject.title}</h1>
              <p className="text-gray-700 text-lg">{selectedProject.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Project ID</p>
              <p className="font-mono font-semibold text-gray-800">{selectedProject.projectId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Division</p>
              <p className="font-semibold text-gray-800">{selectedProject.division}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Start Date</p>
              <p className="font-semibold text-gray-800">{formatDate(selectedProject.startDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">End Date</p>
              <p className="font-semibold text-gray-800">{formatDate(selectedProject.endDate)}</p>
            </div>
          </div>
        </div>

        {/* Progress & Budget */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Progress */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Icons.TrendingUp className="w-6 h-6 text-blue-600" />
              Progress
            </h2>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Completion</span>
                <span className="text-sm font-semibold text-gray-800">{selectedProject.completionPercentage || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${selectedProject.completionPercentage || 0}%` }}
                ></div>
              </div>
            </div>
            {selectedProject.ragNotes && (
              <div className="bg-gray-50 rounded-lg p-4 mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Latest Update:</p>
                <p className="text-sm text-gray-600">{selectedProject.ragNotes}</p>
              </div>
            )}
          </div>

          {/* Budget */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Icons.DollarSign className="w-6 h-6 text-green-600" />
              Budget
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Budget</span>
                <span className="font-semibold text-gray-800">{formatCurrency(selectedProject.totalBudget || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Spent</span>
                <span className="font-semibold text-green-600">{formatCurrency(selectedProject.budgetSpent || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Remaining</span>
                <span className="font-semibold text-blue-600">
                  {formatCurrency((selectedProject.totalBudget || 0) - (selectedProject.budgetSpent || 0))}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Utilization</span>
                  <span className="text-sm font-semibold">{selectedProject.budgetUtilization || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${Math.min(selectedProject.budgetUtilization || 0, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Icons.Users className="w-6 h-6 text-purple-600" />
            Research Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Principal Investigator</p>
              <p className="font-semibold text-gray-800">{selectedProject.principalInvestigator}</p>
            </div>
            {selectedProject.team && selectedProject.team.length > 0 && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600 mb-2">Team Members</p>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.team.map((member, index) => (
                    <span key={index} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                      {member.name} ({member.role})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Milestones */}
        {selectedProject.milestones && selectedProject.milestones.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Icons.Target className="w-6 h-6 text-orange-600" />
              Milestones
            </h2>
            <div className="space-y-4">
              {selectedProject.milestones.map((milestone) => (
                <div key={milestone.milestoneId} className="flex items-start gap-4 pb-4 border-b border-gray-200 last:border-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    milestone.status === 'completed' ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {milestone.status === 'completed' ? (
                      <Icons.CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <Icons.Clock className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">{milestone.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-500">Target: {formatDate(milestone.targetDate)}</span>
                      {milestone.completedDate && (
                        <span className="text-green-600 font-medium">
                          Completed: {formatDate(milestone.completedDate)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Outputs */}
        {selectedProject.outputs && selectedProject.outputs.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Icons.FileText className="w-6 h-6 text-indigo-600" />
              Research Outputs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedProject.outputs.map((output) => (
                <div key={output.outputId} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      output.type === 'publication' ? 'bg-blue-100 text-blue-700' :
                      output.type === 'report' ? 'bg-green-100 text-green-700' :
                      output.type === 'dataset' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {output.type.toUpperCase()}
                    </span>
                    {output.url && (
                      <a
                        href={output.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Icons.ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">{output.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{output.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{formatDate(output.publishedDate)}</span>
                    {output.citations > 0 && (
                      <span>{output.citations} citations</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeView === 'dashboard' && renderDashboard()}
          {activeView === 'projects' && renderProjects()}
          {activeView === 'detail' && renderProjectDetail()}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, color, isLarge = false }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    indigo: 'from-indigo-500 to-indigo-600'
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow`}>
      <Icon className="w-10 h-10 mb-3 opacity-90" />
      <div className={`${isLarge ? 'text-2xl' : 'text-3xl'} font-bold mb-1`}>{value}</div>
      <div className="text-sm opacity-90">{label}</div>
    </div>
  );
};

// Project Card Component
const ProjectCard = ({ project, onClick }) => {
  const getRAGColor = (ragStatus) => {
    const colors = {
      green: 'bg-green-500',
      amber: 'bg-yellow-500',
      red: 'bg-red-500'
    };
    return colors[ragStatus] || 'bg-gray-400';
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      planning: 'bg-blue-100 text-blue-700',
      active: 'bg-green-100 text-green-700',
      on_hold: 'bg-yellow-100 text-yellow-700',
      completed: 'bg-purple-100 text-purple-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      notation: 'compact'
    }).format(amount);
  };

  return (
    <motion.div
      whileHover={{ y: -4, shadow: '0 20px 40px rgba(0,0,0,0.15)' }}
      onClick={onClick}
      className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-2xl transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(project.status)}`}>
            {project.status.replace('_', ' ').toUpperCase()}
          </span>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getRAGColor(project.ragStatus)}`}></div>
            <span className="text-sm font-semibold text-gray-600">{project.ragStatus.toUpperCase()}</span>
          </div>
        </div>
        <Icons.ChevronRight className="w-5 h-5 text-gray-400" />
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{project.title}</h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Progress</span>
          <span className="font-semibold text-gray-800">{project.completionPercentage || 0}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${project.completionPercentage || 0}%` }}
          ></div>
        </div>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
        <div>
          <p className="text-xs text-gray-500 mb-1">Principal Investigator</p>
          <p className="text-sm font-semibold text-gray-800">{project.principalInvestigator}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Budget</p>
          <p className="text-sm font-semibold text-gray-800">{formatCurrency(project.totalBudget || 0)}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Icons.Building className="w-3 h-3" />
          {project.division}
        </span>
        {project.milestones && project.milestones.length > 0 && (
          <span className="flex items-center gap-1">
            <Icons.Target className="w-3 h-3" />
            {project.milestones.filter(m => m.status === 'completed').length}/{project.milestones.length} milestones
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectPipelineTracker;
