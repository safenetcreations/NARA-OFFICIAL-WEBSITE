import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import researchService from '../../../services/researchService';
import { useAuth } from '../../../contexts/AuthContext';

const GrantManagementSection = ({ grants: initialGrants = [], loading: initialLoading = false, user }) => {
  const [grants, setGrants] = useState(initialGrants);
  const [availableGrants, setAvailableGrants] = useState([]);
  const [loading, setLoading] = useState(initialLoading);
  const [activeTab, setActiveTab] = useState('opportunities');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedGrant, setSelectedGrant] = useState(null);

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadAvailableGrants();
    if (isAuthenticated && user?.id) {
      loadUserGrants();
    }
  }, [user?.id]);

  const loadAvailableGrants = () => {
    // Mock available grants - would load from grants database
    const mockGrants = [
      {
        id: 1,
        title: "Marine Biodiversity Conservation Initiative",
        funder: "National Science Foundation",
        deadline: "2024-12-15",
        total_amount: 750000,
        duration_months: 36,
        category: "conservation",
        description: "Comprehensive study of marine biodiversity hotspots and development of conservation strategies for endangered marine species.",
        eligibility: ["PhD required", "2+ years experience", "International collaboration"],
        requirements: ["Research proposal", "Budget justification", "Team CV", "Letters of support"],
        contact_person: "Dr. Maria Santos",
        contact_email: "m.santos@nsf.gov",
        applications_count: 23,
        success_rate: "15%"
      },
      {
        id: 2,
        title: "Ocean Plastic Pollution Research Grant",
        funder: "Environmental Protection Agency",
        deadline: "2024-11-30",
        total_amount: 425000,
        duration_months: 24,
        category: "environmental",
        description: "Investigation of microplastic impact on marine ecosystems and development of innovative removal technologies.",
        eligibility: ["Environmental Science background", "Lab facilities required", "Multi-institutional"],
        requirements: ["Technical proposal", "Environmental impact assessment", "Collaboration agreements"],
        contact_person: "Prof. David Chen",
        contact_email: "d.chen@epa.gov",
        applications_count: 31,
        success_rate: "22%"
      },
      {
        id: 3,
        title: "Coastal Climate Adaptation Fund",
        funder: "Department of Climate Research",
        deadline: "2025-01-20",
        total_amount: 950000,
        duration_months: 48,
        category: "climate",
        description: "Development of coastal adaptation strategies and technologies to address sea-level rise and extreme weather events.",
        eligibility: ["Climate science expertise", "Coastal engineering experience", "Community engagement"],
        requirements: ["Comprehensive proposal", "Community impact plan", "Technology roadmap"],
        contact_person: "Dr. Sarah Williams",
        contact_email: "s.williams@dcr.gov",
        applications_count: 18,
        success_rate: "12%"
      }
    ];
    setAvailableGrants(mockGrants);
  };

  const loadUserGrants = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await researchService?.grants?.getUserGrants(user?.id);
      if (!error && data) {
        setGrants(data);
      }
    } catch (error) {
      console.error('Error loading user grants:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'draft', label: 'Draft' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'conservation', label: 'Conservation' },
    { value: 'environmental', label: 'Environmental' },
    { value: 'climate', label: 'Climate Research' },
    { value: 'technology', label: 'Technology Development' },
    { value: 'education', label: 'Education & Outreach' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-success bg-success/10';
      case 'submitted': return 'text-primary bg-primary/10';
      case 'under_review': return 'text-accent bg-accent/10';
      case 'rejected': return 'text-destructive bg-destructive/10';
      default: return 'text-text-secondary bg-muted';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'conservation': return 'text-success bg-success/10';
      case 'environmental': return 'text-accent bg-accent/10';
      case 'climate': return 'text-warning bg-warning/10';
      case 'technology': return 'text-primary bg-primary/10';
      default: return 'text-text-secondary bg-muted';
    }
  };

  const GrantOpportunityCard = ({ grant }) => (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="font-cta text-lg font-semibold text-text-primary">
              {grant?.title}
            </h3>
            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(grant?.category)}`}>
              {grant?.category?.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center space-x-4 text-sm text-text-secondary mb-3">
            <div className="flex items-center space-x-1">
              <Icon name="Building" size={14} />
              <span>{grant?.funder}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Calendar" size={14} />
              <span>Due {new Date(grant?.deadline)?.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={14} />
              <span>{grant?.duration_months} months</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-headline text-xl font-bold text-primary">
            ${(grant?.total_amount / 1000)?.toFixed(0)}K
          </div>
          <div className="text-xs text-text-secondary">Total Award</div>
        </div>
      </div>
      
      <p className="font-body text-sm text-text-secondary mb-4 line-clamp-3">
        {grant?.description}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <div className="font-cta text-xs font-medium text-text-secondary mb-2 uppercase tracking-wide">
            Key Eligibility
          </div>
          <ul className="space-y-1">
            {grant?.eligibility?.slice(0, 2)?.map((req, index) => (
              <li key={index} className="text-sm text-text-secondary flex items-start space-x-2">
                <Icon name="Check" size={12} className="text-success mt-1 flex-shrink-0" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="font-cta text-xs font-medium text-text-secondary mb-2 uppercase tracking-wide">
            Competition Stats
          </div>
          <div className="space-y-1">
            <div className="text-sm text-text-secondary">
              <span className="font-medium">{grant?.applications_count}</span> applications received
            </div>
            <div className="text-sm text-text-secondary">
              <span className="font-medium">{grant?.success_rate}</span> success rate
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center space-x-4">
          <div className="text-xs text-text-secondary">
            Deadline: {Math.ceil((new Date(grant?.deadline) - new Date()) / (1000 * 60 * 60 * 24))} days left
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="Eye"
            onClick={() => setSelectedGrant(grant)}
          >
            View Details
          </Button>
          {isAuthenticated && (
            <Button
              variant="default"
              size="sm"
              iconName="Send"
              iconPosition="left"
              onClick={() => {
                setSelectedGrant(grant);
                setShowApplicationModal(true);
              }}
            >
              Apply
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  const MyGrantCard = ({ grant }) => (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="font-cta text-lg font-semibold text-text-primary">
              {grant?.title || 'Grant Application'}
            </h3>
            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(grant?.status)}`}>
              {grant?.status?.replace('_', ' ')?.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center space-x-4 text-sm text-text-secondary mb-3">
            <div className="flex items-center space-x-1">
              <Icon name="Calendar" size={14} />
              <span>Applied {new Date(grant?.created_at)?.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="DollarSign" size={14} />
              <span>${(grant?.requested_amount / 1000)?.toFixed(0)}K requested</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          {grant?.award_amount && (
            <>
              <div className="font-headline text-xl font-bold text-success">
                ${(grant?.award_amount / 1000)?.toFixed(0)}K
              </div>
              <div className="text-xs text-text-secondary">Awarded</div>
            </>
          )}
        </div>
      </div>
      
      {grant?.description && (
        <p className="font-body text-sm text-text-secondary mb-4 line-clamp-2">
          {grant?.description}
        </p>
      )}
      
      {grant?.project && (
        <div className="mb-4 p-3 bg-muted/50 rounded-lg">
          <div className="font-cta text-sm font-medium text-text-primary mb-1">
            Associated Project
          </div>
          <div className="text-sm text-text-secondary">
            {grant?.project?.title}
          </div>
        </div>
      )}
      
      {grant?.grant_co_investigators?.length > 0 && (
        <div className="mb-4">
          <div className="font-cta text-xs font-medium text-text-secondary mb-2 uppercase tracking-wide">
            Co-Investigators
          </div>
          <div className="flex -space-x-2">
            {grant?.grant_co_investigators?.slice(0, 4)?.map((investigator, index) => (
              <div
                key={index}
                className="w-8 h-8 bg-muted border-2 border-card rounded-full flex items-center justify-center text-xs font-medium text-text-secondary"
                title={investigator?.user?.full_name}
              >
                {investigator?.user?.full_name?.charAt(0) || 'U'}
              </div>
            ))}
            {grant?.grant_co_investigators?.length > 4 && (
              <div className="w-8 h-8 bg-muted border-2 border-card rounded-full flex items-center justify-center text-xs font-medium text-text-secondary">
                +{grant?.grant_co_investigators?.length - 4}
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="text-xs text-text-secondary">
          {grant?.status === 'approved' 
            ? `Award period: ${grant?.award_period_start ? new Date(grant?.award_period_start)?.toLocaleDateString() : 'TBD'} - ${grant?.award_period_end ? new Date(grant?.award_period_end)?.toLocaleDateString() : 'TBD'}`
            : `Last updated: ${new Date(grant?.updated_at || grant?.created_at)?.toLocaleDateString()}`
          }
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" iconName="Eye">
            View Details
          </Button>
          {grant?.status === 'draft' && (
            <Button variant="outline" size="sm" iconName="Edit">
              Edit
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  const GrantDetailModal = ({ grant, onClose }) => {
    if (!grant) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h2 className="font-headline text-2xl font-bold text-text-primary">
                    {grant?.title}
                  </h2>
                  <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(grant?.category)}`}>
                    {grant?.category?.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center space-x-6 text-text-secondary mb-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="Building" size={16} />
                    <span>{grant?.funder}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Calendar" size={16} />
                    <span>Deadline: {new Date(grant?.deadline)?.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Clock" size={16} />
                    <span>{grant?.duration_months} months</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" iconName="X" onClick={onClose} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="font-cta text-lg font-semibold text-text-primary mb-3">
                    Grant Description
                  </h3>
                  <p className="font-body text-text-secondary leading-relaxed">
                    {grant?.description}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-cta text-lg font-semibold text-text-primary mb-3">
                    Eligibility Requirements
                  </h3>
                  <ul className="space-y-2">
                    {grant?.eligibility?.map((req, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Icon name="Check" size={16} className="text-success mt-1 flex-shrink-0" />
                        <span className="text-text-secondary">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-cta text-lg font-semibold text-text-primary mb-3">
                    Application Requirements
                  </h3>
                  <ul className="space-y-2">
                    {grant?.requirements?.map((req, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Icon name="FileText" size={16} className="text-primary mt-1 flex-shrink-0" />
                        <span className="text-text-secondary">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-muted/50 rounded-lg p-6">
                  <h3 className="font-cta text-lg font-semibold text-text-primary mb-4">
                    Grant Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-text-secondary mb-1">Total Award</div>
                      <div className="font-headline text-2xl font-bold text-primary">
                        ${(grant?.total_amount / 1000)?.toFixed(0)}K
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-text-secondary mb-1">Duration</div>
                      <div className="font-medium text-text-primary">
                        {grant?.duration_months} months
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-text-secondary mb-1">Application Deadline</div>
                      <div className="font-medium text-text-primary">
                        {new Date(grant?.deadline)?.toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-text-secondary mb-1">Days Remaining</div>
                      <div className="font-medium text-warning">
                        {Math.ceil((new Date(grant?.deadline) - new Date()) / (1000 * 60 * 60 * 24))} days
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-6">
                  <h3 className="font-cta text-lg font-semibold text-text-primary mb-4">
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Icon name="User" size={16} className="text-text-secondary" />
                      <span className="text-sm text-text-primary">{grant?.contact_person}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Icon name="Mail" size={16} className="text-text-secondary" />
                      <span className="text-sm text-primary">{grant?.contact_email}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-6">
                  <h3 className="font-cta text-lg font-semibold text-text-primary mb-4">
                    Competition Statistics
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-text-secondary mb-1">Applications Received</div>
                      <div className="font-medium text-text-primary">{grant?.applications_count}</div>
                    </div>
                    <div>
                      <div className="text-sm text-text-secondary mb-1">Historical Success Rate</div>
                      <div className="font-medium text-text-primary">{grant?.success_rate}</div>
                    </div>
                  </div>
                </div>
                
                {isAuthenticated && (
                  <Button 
                    variant="default" 
                    className="w-full"
                    iconName="Send"
                    iconPosition="left"
                    onClick={() => setShowApplicationModal(true)}
                  >
                    Apply for Grant
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const GrantApplicationModal = ({ grant, onClose }) => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      requested_amount: grant?.total_amount || '',
      duration_months: grant?.duration_months || '',
      co_investigators: '',
      project_id: ''
    });

    const handleSubmit = async (e) => {
      e?.preventDefault();
      if (!isAuthenticated || !user?.id) return;

      try {
        const applicationData = {
          ...formData,
          principal_investigator_id: user?.id,
          status: 'draft',
          funder_name: grant?.funder,
          requested_amount: parseInt(formData?.requested_amount),
          duration_months: parseInt(formData?.duration_months)
        };

        const { data, error } = await researchService?.grants?.create(applicationData);
        if (!error && data) {
          alert('Grant application saved as draft!');
          onClose();
          loadUserGrants();
        } else {
          alert('Error saving application. Please try again.');
        }
      } catch (error) {
        console.error('Error creating grant application:', error);
        alert('Error saving application. Please try again.');
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-headline text-xl font-bold text-text-primary">
                  Apply for Grant
                </h2>
                <p className="text-sm text-text-secondary mt-1">
                  {grant?.title} - {grant?.funder}
                </p>
              </div>
              <Button variant="ghost" size="sm" iconName="X" onClick={onClose} />
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  label="Project Title"
                  value={formData?.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e?.target?.value }))}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Project Description
                </label>
                <textarea
                  value={formData?.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e?.target?.value }))}
                  rows={6}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Describe your research project, objectives, and expected outcomes..."
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="number"
                  label="Requested Amount (USD)"
                  value={formData?.requested_amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, requested_amount: e?.target?.value }))}
                  max={grant?.total_amount}
                  required
                />
                <Input
                  type="number"
                  label="Project Duration (months)"
                  value={formData?.duration_months}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration_months: e?.target?.value }))}
                  max={grant?.duration_months}
                  required
                />
              </div>
              
              <div>
                <Input
                  label="Co-Investigators (comma-separated names)"
                  value={formData?.co_investigators}
                  onChange={(e) => setFormData(prev => ({ ...prev, co_investigators: e?.target?.value }))}
                  placeholder="Dr. Jane Smith, Prof. John Doe"
                />
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="Info" size={16} className="text-primary mt-0.5" />
                  <div className="text-sm text-text-secondary">
                    <div className="font-medium text-text-primary mb-1">Next Steps:</div>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Your application will be saved as a draft</li>
                      <li>Complete all required documents and attachments</li>
                      <li>Review and submit before the deadline</li>
                      <li>Track your application status in "My Applications"</li>
                    </ol>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 pt-4">
                <Button type="submit" variant="default" className="flex-1">
                  Save Application Draft
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

  const currentGrants = activeTab === 'my' ? grants : availableGrants;
  const filteredGrants = currentGrants?.filter(grant => {
    const matchesSearch = !searchQuery || 
      grant?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      grant?.funder?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    
    const matchesStatus = activeTab === 'my' 
      ? (selectedStatus === 'all' || grant?.status === selectedStatus)
      : true;
    
    const matchesCategory = activeTab === 'opportunities'
      ? (selectedCategory === 'all' || grant?.category === selectedCategory)
      : true;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline text-2xl font-bold text-text-primary mb-2">
            Grant Management
          </h2>
          <p className="font-body text-text-secondary">
            Find funding opportunities and manage your grant applications
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-1 bg-muted/50 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('opportunities')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'opportunities' ?'bg-card text-text-primary shadow-sm' :'text-text-secondary hover:text-text-primary'
          }`}
        >
          Grant Opportunities ({availableGrants?.length || 0})
        </button>
        {isAuthenticated && (
          <button
            onClick={() => setActiveTab('my')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'my' ?'bg-card text-text-primary shadow-sm' :'text-text-secondary hover:text-text-primary'
            }`}
          >
            My Applications ({grants?.length || 0})
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            type="search"
            placeholder="Search grants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
          />
          {activeTab === 'opportunities' ? (
            <Select
              options={categoryOptions}
              value={selectedCategory}
              onChange={setSelectedCategory}
              placeholder="Filter by category"
            />
          ) : (
            <Select
              options={statusOptions}
              value={selectedStatus}
              onChange={setSelectedStatus}
              placeholder="Filter by status"
            />
          )}
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" iconName="Filter">
              Advanced Filters
            </Button>
            <span className="text-sm text-text-secondary">
              {filteredGrants?.length || 0} grants
            </span>
          </div>
        </div>
      </div>

      {/* Grants Grid */}
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
      ) : filteredGrants?.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredGrants?.map((grant) => (
            activeTab === 'opportunities' ? (
              <GrantOpportunityCard key={grant?.id} grant={grant} />
            ) : (
              <MyGrantCard key={grant?.id} grant={grant} />
            )
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="DollarSign" size={24} className="text-text-secondary" />
          </div>
          <h3 className="font-cta text-lg font-semibold text-text-primary mb-2">
            {activeTab === 'my' ? 'No applications yet' : 'No grants found'}
          </h3>
          <p className="font-body text-text-secondary mb-6">
            {activeTab === 'my' ?'Start by applying for available grant opportunities' :'Try adjusting your search criteria or filters'
            }
          </p>
          {activeTab === 'my' && (
            <Button 
              variant="default"
              onClick={() => setActiveTab('opportunities')}
            >
              Browse Opportunities
            </Button>
          )}
        </div>
      )}

      {/* Modals */}
      <GrantDetailModal grant={selectedGrant} onClose={() => setSelectedGrant(null)} />
      {showApplicationModal && selectedGrant && (
        <GrantApplicationModal 
          grant={selectedGrant} 
          onClose={() => {
            setShowApplicationModal(false);
            setSelectedGrant(null);
          }} 
        />
      )}
    </div>
  );
};

export default GrantManagementSection;