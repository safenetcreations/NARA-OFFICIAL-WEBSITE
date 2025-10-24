import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { DIVISIONS_CONFIG } from '../../data/divisionsConfig';
import { getDefaultProjects } from '../../data/divisionProjects';
import { getDefaultTeamMembers } from '../../data/divisionTeams';
import { getDefaultImpact } from '../../data/divisionImpact';

/**
 * Comprehensive Admin Panel for Division Content Management
 * Allows easy updating of all division data including staff, projects, and impact metrics
 */
const DivisionContentAdmin = () => {
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview, projects, staff, impact
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState(null);

  // Data states
  const [divisionInfo, setDivisionInfo] = useState(null);
  const [projects, setProjects] = useState([]);
  const [staff, setStaff] = useState([]);
  const [impactData, setImpactData] = useState(null);

  useEffect(() => {
    if (selectedDivision) {
      loadDivisionData();
    }
  }, [selectedDivision]);

  const loadDivisionData = () => {
    const division = DIVISIONS_CONFIG.find(d => d.id === selectedDivision.id);
    setDivisionInfo(division);
    setProjects(getDefaultProjects(selectedDivision.id));
    setStaff(getDefaultTeamMembers(selectedDivision.id));
    setImpactData(getDefaultImpact(selectedDivision.id));
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Info' },
    { id: 'projects', label: 'Projects', icon: 'FolderKanban' },
    { id: 'staff', label: 'Staff', icon: 'Users' },
    { id: 'impact', label: 'Impact Data', icon: 'TrendingUp' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <LucideIcons.Settings size={40} className="text-cyan-400" />
            Division Content Management
          </h1>
          <p className="text-blue-200">Update division information, projects, staff, and impact data</p>
        </div>

        {/* Success/Error Messages */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
              message.type === 'success' ? 'bg-green-100 text-green-800' :
              message.type === 'error' ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-blue-800'
            }`}
          >
            {message.type === 'success' && <LucideIcons.CheckCircle size={24} />}
            {message.type === 'error' && <LucideIcons.AlertCircle size={24} />}
            {message.type === 'info' && <LucideIcons.Info size={24} />}
            <span>{message.text}</span>
          </motion.div>
        )}

        {/* Division Selector */}
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 mb-8 border border-slate-700">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white">
            <LucideIcons.FolderOpen size={28} className="text-cyan-400" />
            Select Division to Edit
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {DIVISIONS_CONFIG.map((division) => {
              const IconComponent = LucideIcons[division.icon];
              return (
                <motion.button
                  key={division.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDivision(division)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedDivision?.id === division.id
                      ? `bg-gradient-to-r ${division.gradient} text-white border-white/30`
                      : 'border-slate-600 hover:border-slate-500 bg-slate-700/50 text-white hover:bg-slate-700'
                  }`}
                >
                  <IconComponent size={32} className="mx-auto mb-2" />
                  <div className="text-sm font-semibold text-center line-clamp-2">
                    {division.name.en}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Content Editor */}
        {selectedDivision && (
          <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-slate-700">
            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
              {tabs.map((tab) => {
                const TabIcon = LucideIcons[tab.icon];
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-cyan-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    <TabIcon size={20} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && divisionInfo && (
              <div className="space-y-6">
                <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <LucideIcons.FileText size={24} className="text-cyan-400" />
                    Division Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Name (English)</label>
                      <input
                        type="text"
                        value={divisionInfo.name.en}
                        readOnly={!editMode}
                        className="w-full px-4 py-3 bg-slate-800 text-white border border-slate-600 rounded-lg"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Contact Email</label>
                      <input
                        type="email"
                        value={divisionInfo.contactEmail}
                        readOnly={!editMode}
                        className="w-full px-4 py-3 bg-slate-800 text-white border border-slate-600 rounded-lg"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-300 mb-2">Description (English)</label>
                      <textarea
                        value={divisionInfo.description.en}
                        readOnly={!editMode}
                        rows={4}
                        className="w-full px-4 py-3 bg-slate-800 text-white border border-slate-600 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-amber-900/20 rounded-xl p-6 border border-amber-500/30">
                  <h4 className="font-bold text-amber-300 mb-2 flex items-center gap-2">
                    <LucideIcons.Lightbulb size={20} />
                    Instructions
                  </h4>
                  <ul className="text-amber-200 space-y-2 text-sm">
                    <li>• Use this panel to view and prepare updates for division content</li>
                    <li>• Current data shown is placeholder - replace with actual NARA data</li>
                    <li>• Copy format and structure when adding real information</li>
                    <li>• Update files directly in <code className="bg-slate-800 px-2 py-1 rounded">src/data/</code> folder</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Projects Tab */}
            {activeTab === 'projects' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Projects ({projects.length})</h3>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                    <LucideIcons.Plus size={20} className="inline mr-2" />
                    Add Project
                  </button>
                </div>

                {projects.map((project, idx) => (
                  <div key={idx} className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-white mb-2">
                          {project.title.en || project.title}
                        </h4>
                        <p className="text-slate-300 mb-3">
                          {project.description.en || project.description}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <span className="text-slate-400">Status:</span>
                            <span className={`ml-2 px-2 py-1 rounded ${
                              project.status === 'Active' ? 'bg-green-600' : 'bg-blue-600'
                            } text-white`}>
                              {project.status}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400">Budget:</span>
                            <span className="ml-2 text-white font-semibold">{project.budget}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Progress:</span>
                            <span className="ml-2 text-white font-semibold">{project.progress}%</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Team:</span>
                            <span className="ml-2 text-white font-semibold">{project.teamSize} people</span>
                          </div>
                        </div>
                      </div>
                      <button className="ml-4 text-cyan-400 hover:text-cyan-300">
                        <LucideIcons.Edit2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="bg-blue-900/20 rounded-xl p-6 border border-blue-500/30">
                  <p className="text-blue-200 text-sm">
                    <LucideIcons.Info size={16} className="inline mr-2" />
                    To update projects: Edit <code className="bg-slate-800 px-2 py-1 rounded">src/data/divisionProjects.js</code>
                  </p>
                </div>
              </div>
            )}

            {/* Staff Tab */}
            {activeTab === 'staff' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Team Members ({staff.length})</h3>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                    <LucideIcons.UserPlus size={20} className="inline mr-2" />
                    Add Staff Member
                  </button>
                </div>

                {staff.map((member, idx) => (
                  <div key={idx} className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-white mb-1">
                          {member.name.en}
                        </h4>
                        <p className="text-cyan-400 font-semibold mb-2">{member.position}</p>
                        <p className="text-slate-300 mb-3">{member.role}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-slate-400">Email:</span>
                            <span className="ml-2 text-white">{member.email}</span>
                          </div>
                          {member.phone && (
                            <div>
                              <span className="text-slate-400">Phone:</span>
                              <span className="ml-2 text-white">{member.phone}</span>
                            </div>
                          )}
                          <div>
                            <span className="text-slate-400">Publications:</span>
                            <span className="ml-2 text-white font-semibold">{member.publications}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Experience:</span>
                            <span className="ml-2 text-white font-semibold">{member.yearsOfExperience} years</span>
                          </div>
                        </div>
                        {member.expertise && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {member.expertise.slice(0, 4).map((skill, i) => (
                              <span key={i} className="px-3 py-1 bg-blue-600/30 text-blue-200 rounded-full text-xs">
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <button className="ml-4 text-cyan-400 hover:text-cyan-300">
                        <LucideIcons.Edit2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="bg-blue-900/20 rounded-xl p-6 border border-blue-500/30">
                  <p className="text-blue-200 text-sm">
                    <LucideIcons.Info size={16} className="inline mr-2" />
                    To update staff: Edit <code className="bg-slate-800 px-2 py-1 rounded">src/data/divisionTeams.js</code>
                  </p>
                </div>
              </div>
            )}

            {/* Impact Tab */}
            {activeTab === 'impact' && impactData && (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <LucideIcons.BarChart3 size={24} className="text-cyan-400" />
                    Key Metrics (4 Cards)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {impactData.keyMetrics?.map((metric, idx) => (
                      <div key={idx} className="bg-slate-800 rounded-lg p-4 border border-slate-600">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-slate-400 text-sm">{metric.label}</span>
                          <button className="text-cyan-400 hover:text-cyan-300">
                            <LucideIcons.Edit2 size={16} />
                          </button>
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">{metric.value}</div>
                        <div className="text-sm text-green-400">{metric.trend} ↑</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Impact Stories */}
                <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <LucideIcons.Award size={24} className="text-cyan-400" />
                    Impact Stories ({impactData.impactStories?.length || 0})
                  </h3>
                  {impactData.impactStories?.map((story, idx) => (
                    <div key={idx} className="bg-slate-800 rounded-lg p-4 mb-4 border border-slate-600">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-white mb-2">{story.title}</h4>
                          <p className="text-slate-300 mb-3">{story.description}</p>
                          <div className="grid grid-cols-3 gap-3 text-sm">
                            <div>
                              <span className="text-slate-400">Before:</span>
                              <span className="ml-2 text-white font-semibold">{story.metrics.before}</span>
                            </div>
                            <div>
                              <span className="text-slate-400">After:</span>
                              <span className="ml-2 text-white font-semibold">{story.metrics.after}</span>
                            </div>
                            <div>
                              <span className="text-slate-400">Improvement:</span>
                              <span className="ml-2 text-green-400 font-semibold">{story.metrics.improvement}</span>
                            </div>
                          </div>
                        </div>
                        <button className="ml-4 text-cyan-400 hover:text-cyan-300">
                          <LucideIcons.Edit2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Economic Impact */}
                <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <LucideIcons.DollarSign size={24} className="text-cyan-400" />
                    Economic Impact
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-800 rounded-lg p-4">
                      <div className="text-sm text-slate-400 mb-1">Value Generated</div>
                      <div className="text-2xl font-bold text-white">{impactData.economicImpact?.valueGenerated}</div>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-4">
                      <div className="text-sm text-slate-400 mb-1">Jobs Created</div>
                      <div className="text-2xl font-bold text-white">{impactData.economicImpact?.jobsCreated}</div>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-4">
                      <div className="text-sm text-slate-400 mb-1">H-Index</div>
                      <div className="text-2xl font-bold text-white">{impactData.researchOutput?.hIndex}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-900/20 rounded-xl p-6 border border-amber-500/30">
                  <h4 className="font-bold text-amber-300 mb-2 flex items-center gap-2">
                    <LucideIcons.AlertTriangle size={20} />
                    Update Impact Data
                  </h4>
                  <p className="text-amber-200 text-sm mb-3">
                    To update impact metrics with REAL NARA data:
                  </p>
                  <ol className="text-amber-200 text-sm space-y-1 list-decimal list-inside">
                    <li>Collect actual statistics from NARA annual reports</li>
                    <li>Get real publication counts from Google Scholar</li>
                    <li>Extract project outcomes from completion reports</li>
                    <li>Edit file: <code className="bg-slate-800 px-2 py-1 rounded">src/data/divisionImpact.js</code></li>
                    <li>Rebuild and redeploy: <code className="bg-slate-800 px-2 py-1 rounded">npm run build && firebase deploy</code></li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DivisionContentAdmin;

