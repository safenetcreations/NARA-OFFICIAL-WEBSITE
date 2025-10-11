import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import researchService from '../../../services/researchService';
import { useAuth } from '../../../contexts/AuthContext';

const ProjectManagementSection = ({ projects: initialProjects = [], loading: initialLoading = false, user }) => {
  const [projects, setProjects] = useState(initialProjects);
  const [userProjects, setUserProjects] = useState([]);
  const [loading, setLoading] = useState(initialLoading);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadUserProjects();
    }
  }, [user?.id]);

  const loadUserProjects = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await researchService?.projects?.getUserProjects(user?.id);
      if (!error && data) {
        setUserProjects(data);
      }
    } catch (error) {
      console.error('Error loading user projects:', error);
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'planning', label: 'Planning' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'on_hold', label: 'On Hold' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success bg-success/10';
      case 'completed': return 'text-primary bg-primary/10';
      case 'on_hold': return 'text-warning bg-warning/10';
      case 'planning': return 'text-accent bg-accent/10';
      default: return 'text-text-secondary bg-muted';
    }
  };

  const ProjectCard = ({ project, isUserProject = false }) => (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="font-cta text-lg font-semibold text-text-primary">
              {project?.title || 'Untitled Project'}
            </h3>
            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project?.status)}`}>
              {project?.status?.replace('_', ' ')?.toUpperCase() || 'PLANNING'}
            </span>
          </div>
          <div className="flex items-center space-x-4 text-sm text-text-secondary mb-3">
            <div className="flex items-center space-x-1">
              <Icon name="User" size={14} />
              <span>{project?.lead_researcher?.full_name || 'Lead Researcher'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Building" size={14} />
              <span>{project?.division?.name || 'Division'}</span>
            </div>
          </div>
        </div>
        {isUserProject && (
          <Button
            variant="ghost"
            size="sm"
            iconName="Settings"
            onClick={() => setSelectedProject(project)}
          />
        )}
      </div>
      
      <p className="font-body text-sm text-text-secondary mb-4 line-clamp-3">
        {project?.description || 'Research project focused on marine science and ocean conservation.'}
      </p>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1 text-text-secondary">
            <Icon name="Calendar" size={14} />
            <span>
              {project?.start_date ? new Date(project?.start_date)?.toLocaleDateString() : 'TBD'}
            </span>
          </div>
          <div className="flex items-center space-x-1 text-text-secondary">
            <Icon name="Users" size={14} />
            <span>{project?.project_collaborators?.length || 0} collaborators</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {project?.budget_total && (
            <span className="text-sm font-medium text-accent">
              ${(project?.budget_total / 1000)?.toFixed(0)}K
            </span>
          )}
        </div>
      </div>
      
      {project?.project_collaborators?.length > 0 && (
        <div className="flex items-center space-x-3 mb-4">
          <span className="text-sm text-text-secondary">Collaborators:</span>
          <div className="flex -space-x-2">
            {project?.project_collaborators?.slice(0, 3)?.map((collab, index) => (
              <div
                key={index}
                className="w-8 h-8 bg-muted border-2 border-card rounded-full flex items-center justify-center text-xs font-medium text-text-secondary"
                title={collab?.user?.full_name}
              >
                {collab?.user?.full_name?.charAt(0) || 'U'}
              </div>
            ))}
            {project?.project_collaborators?.length > 3 && (
              <div className="w-8 h-8 bg-muted border-2 border-card rounded-full flex items-center justify-center text-xs font-medium text-text-secondary">
                +{project?.project_collaborators?.length - 3}
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="Eye"
            onClick={() => setSelectedProject(project)}
          >
            View Details
          </Button>
          {!isUserProject && isAuthenticated && (
            <Button
              variant="ghost"
              size="sm"
              iconName="UserPlus"
              onClick={() => handleJoinRequest(project?.id)}
            >
              Request to Join
            </Button>
          )}
        </div>
        <div className="text-xs text-text-secondary">
          Updated {new Date(project?.updated_at || project?.created_at)?.toLocaleDateString()}
        </div>
      </div>
    </div>
  );

  const handleJoinRequest = async (projectId) => {
    if (!isAuthenticated) {
      alert('Please sign in to request joining projects');
      return;
    }
    
    // Mock join request - would implement actual logic
    alert('Join request sent successfully!');
  };

  const ProjectDetailModal = ({ project, onClose }) => {
    if (!project) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h2 className="font-headline text-2xl font-bold text-text-primary">
                    {project?.title}
                  </h2>
                  <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(project?.status)}`}>
                    {project?.status?.replace('_', ' ')?.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-text-secondary mb-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="User" size={16} />
                    <span>{project?.lead_researcher?.full_name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Building" size={16} />
                    <span>{project?.division?.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Calendar" size={16} />
                    <span>Started {new Date(project?.start_date)?.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" iconName="X" onClick={onClose} />
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-cta text-lg font-semibold text-text-primary mb-3">Project Description</h3>
                <p className="font-body text-text-secondary leading-relaxed">
                  {project?.description || 'Detailed project description will be displayed here.'}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-cta text-lg font-semibold text-text-primary mb-3">Project Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-text-secondary">Status</span>
                      <span className="font-medium">{project?.status?.replace('_', ' ')?.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-text-secondary">Start Date</span>
                      <span className="font-medium">
                        {project?.start_date ? new Date(project?.start_date)?.toLocaleDateString() : 'TBD'}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-text-secondary">End Date</span>
                      <span className="font-medium">
                        {project?.end_date ? new Date(project?.end_date)?.toLocaleDateString() : 'Ongoing'}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-text-secondary">Budget</span>
                      <span className="font-medium">
                        ${project?.budget_total ? (project?.budget_total / 1000)?.toFixed(0) + 'K' : 'TBD'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-cta text-lg font-semibold text-text-primary mb-3">Team Members</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <Icon name="Crown" size={16} className="text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-text-primary">
                          {project?.lead_researcher?.full_name}
                        </div>
                        <div className="text-sm text-text-secondary">Lead Researcher</div>
                      </div>
                    </div>
                    {project?.project_collaborators?.slice(0, 4)?.map((collab, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                          <Icon name="User" size={16} className="text-text-secondary" />
                        </div>
                        <div>
                          <div className="font-medium text-text-primary">
                            {collab?.user?.full_name || 'Team Member'}
                          </div>
                          <div className="text-sm text-text-secondary">
                            {collab?.role?.replace('_', ' ') || 'Collaborator'}
                          </div>
                        </div>
                      </div>
                    ))}
                    {project?.project_collaborators?.length > 4 && (
                      <div className="text-sm text-text-secondary text-center py-2">
                        +{project?.project_collaborators?.length - 4} more team members
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 pt-6 border-t border-border">
                <Button variant="default" iconName="MessageCircle" iconPosition="left">
                  Join Discussion
                </Button>
                <Button variant="outline" iconName="Calendar" iconPosition="left">
                  View Timeline
                </Button>
                <Button variant="outline" iconName="FileText" iconPosition="left">
                  View Documents
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CreateProjectModal = ({ onClose }) => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      division_id: '',
      start_date: '',
      end_date: '',
      budget_total: '',
      is_public: true
    });

    const handleSubmit = async (e) => {
      e?.preventDefault();
      if (!isAuthenticated || !user?.id) return;

      try {
        const projectData = {
          ...formData,
          lead_researcher_id: user?.id,
          status: 'planning',
          budget_total: formData?.budget_total ? parseInt(formData?.budget_total) : null
        };

        const { data, error } = await researchService?.projects?.create(projectData);
        if (!error && data) {
          alert('Project created successfully!');
          onClose();
          loadUserProjects();
        } else {
          alert('Error creating project. Please try again.');
        }
      } catch (error) {
        console.error('Error creating project:', error);
        alert('Error creating project. Please try again.');
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline text-xl font-bold text-text-primary">
                Create New Project
              </h2>
              <Button variant="ghost" size="sm" iconName="X" onClick={onClose} />
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Project Title"
                value={formData?.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e?.target?.value }))}
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Project Description
                </label>
                <textarea
                  value={formData?.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e?.target?.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="date"
                  label="Start Date"
                  value={formData?.start_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, start_date: e?.target?.value }))}
                />
                <Input
                  type="date"
                  label="End Date (Optional)"
                  value={formData?.end_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, end_date: e?.target?.value }))}
                />
              </div>
              
              <Input
                type="number"
                label="Budget (USD)"
                value={formData?.budget_total}
                onChange={(e) => setFormData(prev => ({ ...prev, budget_total: e?.target?.value }))}
                placeholder="e.g. 50000"
              />
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_public"
                  checked={formData?.is_public}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_public: e?.target?.checked }))}
                  className="rounded border-border"
                />
                <label htmlFor="is_public" className="text-sm text-text-secondary">
                  Make this project visible to the public
                </label>
              </div>
              
              <div className="flex items-center space-x-4 pt-4">
                <Button type="submit" variant="default" className="flex-1">
                  Create Project
                </Button>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const currentProjects = activeTab === 'my' ? userProjects : projects;
  const filteredProjects = currentProjects?.filter(project => {
    const matchesSearch = !searchQuery || 
      project?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      project?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || project?.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline text-2xl font-bold text-text-primary mb-2">
            Project Management
          </h2>
          <p className="font-body text-text-secondary">
            Manage collaborative research projects across institutions
          </p>
        </div>
        {isAuthenticated && (
          <Button 
            variant="default" 
            iconName="Plus" 
            iconPosition="left"
            onClick={() => setShowCreateModal(true)}
          >
            New Project
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-1 bg-muted/50 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'all' ?'bg-card text-text-primary shadow-sm' :'text-text-secondary hover:text-text-primary'
          }`}
        >
          All Projects ({projects?.length || 0})
        </button>
        {isAuthenticated && (
          <button
            onClick={() => setActiveTab('my')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'my' ?'bg-card text-text-primary shadow-sm' :'text-text-secondary hover:text-text-primary'
            }`}
          >
            My Projects ({userProjects?.length || 0})
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            type="search"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
          />
          <Select
            options={statusOptions}
            value={selectedStatus}
            onChange={setSelectedStatus}
            placeholder="Filter by status"
          />
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" iconName="Filter">
              More Filters
            </Button>
            <span className="text-sm text-text-secondary">
              {filteredProjects?.length || 0} projects
            </span>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4]?.map((item) => (
            <div key={item} className="bg-card border border-border rounded-lg p-6 animate-pulse">
              <div className="h-6 bg-muted rounded mb-4"></div>
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded mb-4"></div>
              <div className="h-20 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      ) : filteredProjects?.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects?.map((project) => (
            <ProjectCard 
              key={project?.id} 
              project={project} 
              isUserProject={activeTab === 'my'}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="FolderOpen" size={24} className="text-text-secondary" />
          </div>
          <h3 className="font-cta text-lg font-semibold text-text-primary mb-2">
            {activeTab === 'my' ? 'No projects found' : 'No projects match your criteria'}
          </h3>
          <p className="font-body text-text-secondary mb-6">
            {activeTab === 'my' ?'Start by creating your first research project' :'Try adjusting your search or filters'
            }
          </p>
          {activeTab === 'my' && isAuthenticated && (
            <Button 
              variant="default" 
              iconName="Plus"
              onClick={() => setShowCreateModal(true)}
            >
              Create Project
            </Button>
          )}
        </div>
      )}

      {/* Modals */}
      <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      {showCreateModal && <CreateProjectModal onClose={() => setShowCreateModal(false)} />}
    </div>
  );
};

export default ProjectManagementSection;