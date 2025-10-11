import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CommunityEngagement = () => {
  const [activeTab, setActiveTab] = useState('forums');
  const [newObservation, setNewObservation] = useState({
    location: '',
    observation: '',
    category: ''
  });

  const tabs = [
    { id: 'forums', name: 'Community Forums', icon: 'MessageSquare' },
    { id: 'citizen-science', name: 'Citizen Science', icon: 'Search' },
    { id: 'alerts', name: 'Local Alerts', icon: 'Bell' },
    { id: 'events', name: 'Events & Workshops', icon: 'Calendar' }
  ];

  const forumTopics = [
    {
      id: 1,
      title: "Unusual Fish Behavior in Negombo Waters",
      author: "Fisherman Sunil",
      region: "Colombo Marine Research Center",
      replies: 23,
      lastActivity: "2 hours ago",
      category: "Marine Life",
      status: "active",
      excerpt: "Has anyone else noticed the dolphins coming closer to shore than usual? They seem to be following different patterns..."
    },
    {
      id: 2,
      title: "Water Quality Changes After Recent Rains",
      author: "Dr. Kamala Perera",
      region: "Galle Marine Observatory",
      replies: 15,
      lastActivity: "5 hours ago",
      category: "Water Quality",
      status: "expert-response",
      excerpt: "NARA researchers have confirmed increased turbidity levels. Here\'s what communities should know..."
    },
    {
      id: 3,
      title: "Coral Bleaching Observations - Hikkaduwa",
      author: "Dive Master Chaminda",
      region: "Galle Marine Observatory",
      replies: 31,
      lastActivity: "1 day ago",
      category: "Conservation",
      status: "urgent",
      excerpt: "Reporting significant coral bleaching in sectors 3-5. Need immediate scientific assessment..."
    },
    {
      id: 4,
      title: "Traditional Fishing Calendar vs Modern Predictions",
      author: "Elder Fisherman Banda",
      region: "Jaffna Peninsula Center",
      replies: 42,
      lastActivity: "2 days ago",
      category: "Traditional Knowledge",
      status: "popular",
      excerpt: "Comparing our ancestral fishing wisdom with NARA's scientific forecasts. Interesting patterns emerging..."
    }
  ];

  const citizenScienceProjects = [
    {
      id: 1,
      title: "Beach Plastic Monitoring",
      description: "Help track plastic pollution levels across Sri Lankan beaches",
      participants: 156,
      dataPoints: 2340,
      region: "All Centers",
      difficulty: "Easy",
      timeCommitment: "15 min/week",
      tools: ["Mobile App", "Camera", "GPS"],
      impact: "Informing national plastic reduction policies"
    },
    {
      id: 2,
      title: "Fish Population Surveys",
      description: "Record fish species and quantities observed during fishing trips",
      participants: 89,
      dataPoints: 1567,
      region: "Coastal Areas",
      difficulty: "Medium",
      timeCommitment: "30 min/trip",
      tools: ["Species Guide", "Mobile App", "Camera"],
      impact: "Supporting sustainable fisheries management"
    },
    {
      id: 3,
      title: "Water Temperature Logging",
      description: "Daily temperature measurements from various coastal locations",
      participants: 67,
      dataPoints: 4521,
      region: "All Coastal Areas",
      difficulty: "Easy",
      timeCommitment: "5 min/day",
      tools: ["Thermometer", "Mobile App"],
      impact: "Climate change monitoring and research"
    }
  ];

  const localAlerts = [
    {
      id: 1,
      type: "weather",
      severity: "high",
      title: "Strong Wind Warning - Southern Coast",
      message: "Wind speeds expected to reach 45-50 km/h. Small craft advisory in effect.",
      region: "Galle, Matara, Hambantota",
      validUntil: "2024-01-20 18:00",
      source: "Galle Marine Observatory"
    },
    {
      id: 2,
      type: "marine-life",
      severity: "medium",
      title: "Whale Migration Alert - Eastern Waters",
      message: "Blue whale pod spotted 15km off Trincomalee. Vessels advised to maintain safe distance.",
      region: "Trincomalee, Batticaloa",
      validUntil: "2024-01-22 12:00",
      source: "Trincomalee Deep Sea Station"
    },
    {
      id: 3,
      type: "water-quality",
      severity: "low",
      title: "Algae Bloom Monitoring - Negombo Lagoon",
      message: "Increased algae activity detected. Water quality monitoring intensified.",
      region: "Negombo, Chilaw",
      validUntil: "2024-01-25 09:00",
      source: "Colombo Marine Research Center"
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Marine Conservation Workshop",
      date: "2024-01-25",
      time: "09:00 - 16:00",
      location: "Galle Marine Observatory",
      type: "Workshop",
      audience: "Fishing Communities",
      capacity: 50,
      registered: 32,
      description: "Learn about sustainable fishing practices and marine ecosystem protection.",
      facilitator: "Dr. Nimal Silva, Marine Biologist"
    },
    {
      id: 2,
      title: "School Marine Science Fair",
      date: "2024-01-28",
      time: "10:00 - 15:00",
      location: "Jaffna Peninsula Center",
      type: "Educational Event",
      audience: "Students & Teachers",
      capacity: 200,
      registered: 145,
      description: "Students showcase marine science projects and interact with NARA researchers.",
      facilitator: "NARA Education Team"
    },
    {
      id: 3,
      title: "Mangrove Restoration Training",
      date: "2024-02-02",
      time: "08:00 - 12:00",
      location: "Batticaloa Coastal Lab",
      type: "Training",
      audience: "Community Volunteers",
      capacity: 30,
      registered: 28,
      description: "Hands-on training in mangrove planting and maintenance techniques.",
      facilitator: "Coastal Restoration Team"
    }
  ];

  const handleObservationSubmit = (e) => {
    e?.preventDefault();
    // Handle observation submission
    console.log('Observation submitted:', newObservation);
    setNewObservation({ location: '', observation: '', category: '' });
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-error bg-error/10 border-error/20';
      case 'medium': return 'text-warning bg-warning/10 border-warning/20';
      case 'low': return 'text-success bg-success/10 border-success/20';
      default: return 'text-text-secondary bg-muted border-border';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'urgent': return 'bg-error text-error-foreground';
      case 'expert-response': return 'bg-primary text-primary-foreground';
      case 'popular': return 'bg-accent text-accent-foreground';
      default: return 'bg-success text-success-foreground';
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 ocean-depth-shadow">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
        <div>
          <h3 className="font-headline text-xl font-bold text-text-primary">Community Engagement</h3>
          <p className="font-body text-text-secondary mt-1">Connect, contribute, and collaborate with NARA's research community</p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="font-body text-text-secondary">1,247 Active Members</span>
          </div>
        </div>
      </div>
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-border">
        {tabs?.map((tab) => (
          <Button
            key={tab?.id}
            variant={activeTab === tab?.id ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab(tab?.id)}
            iconName={tab?.icon}
            iconPosition="left"
            iconSize={16}
            className={`mb-2 ${activeTab === tab?.id ? '' : 'text-text-secondary hover:text-text-primary'}`}
          >
            {tab?.name}
          </Button>
        ))}
      </div>
      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === 'forums' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center space-x-4">
                <Button variant="default" iconName="Plus" iconPosition="left" size="sm">
                  New Topic
                </Button>
                <Button variant="outline" iconName="Search" iconPosition="left" size="sm">
                  Search Forums
                </Button>
              </div>
              
              <div className="flex items-center space-x-2 text-sm">
                <span className="font-body text-text-secondary">Sort by:</span>
                <Button variant="ghost" size="sm" className="text-xs">Latest Activity</Button>
              </div>
            </div>

            {forumTopics?.map((topic) => (
              <div key={topic?.id} className="bg-muted rounded-lg p-4 interactive-lift">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-cta-medium ${getStatusColor(topic?.status)}`}>
                        {topic?.status?.replace('-', ' ')?.toUpperCase()}
                      </span>
                      <span className="text-xs text-text-secondary">{topic?.category}</span>
                    </div>
                    
                    <h4 className="font-headline text-lg font-bold text-text-primary mb-2 hover:text-primary cursor-pointer">
                      {topic?.title}
                    </h4>
                    
                    <p className="font-body text-sm text-text-secondary mb-3">
                      {topic?.excerpt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Icon name="User" size={14} className="text-text-secondary" />
                      <span className="font-cta-medium text-text-primary">{topic?.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="MapPin" size={14} className="text-text-secondary" />
                      <span className="text-text-secondary">{topic?.region}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Icon name="MessageCircle" size={14} className="text-text-secondary" />
                      <span className="text-text-secondary">{topic?.replies}</span>
                    </div>
                    <span className="text-text-secondary">{topic?.lastActivity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'citizen-science' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-4 mb-6">
              <h4 className="font-headline text-lg font-bold text-text-primary mb-2">Become a Citizen Scientist</h4>
              <p className="font-body text-text-secondary mb-4">
                Join our research efforts by contributing observations and data from your local area. Every contribution helps advance marine science.
              </p>
              <Button variant="default" iconName="UserPlus" iconPosition="left">
                Join Program
              </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {citizenScienceProjects?.map((project) => (
                <div key={project?.id} className="bg-muted rounded-lg p-5 interactive-lift">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-headline text-lg font-bold text-text-primary">{project?.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-cta-medium ${
                      project?.difficulty === 'Easy' ? 'bg-success/20 text-success' :
                      project?.difficulty === 'Medium'? 'bg-warning/20 text-warning' : 'bg-error/20 text-error'
                    }`}>
                      {project?.difficulty}
                    </span>
                  </div>

                  <p className="font-body text-sm text-text-secondary mb-4">
                    {project?.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-2 bg-background rounded">
                      <div className="font-headline text-lg font-bold text-primary">{project?.participants}</div>
                      <div className="font-body text-xs text-text-secondary">Participants</div>
                    </div>
                    <div className="text-center p-2 bg-background rounded">
                      <div className="font-headline text-lg font-bold text-secondary">{project?.dataPoints}</div>
                      <div className="font-body text-xs text-text-secondary">Data Points</div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-body text-text-secondary">Time Commitment:</span>
                      <span className="font-cta-medium text-text-primary">{project?.timeCommitment}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-body text-text-secondary">Region:</span>
                      <span className="font-cta-medium text-text-primary">{project?.region}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="font-body text-sm text-text-secondary mb-2">Tools Needed:</div>
                    <div className="flex flex-wrap gap-1">
                      {project?.tools?.map((tool, idx) => (
                        <span key={idx} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-accent/10 to-accent/5 rounded p-3 mb-4">
                    <div className="font-cta-medium text-sm text-text-primary mb-1">Impact:</div>
                    <div className="font-body text-xs text-text-secondary">{project?.impact}</div>
                  </div>

                  <Button variant="outline" fullWidth iconName="ArrowRight" iconPosition="right">
                    Learn More & Join
                  </Button>
                </div>
              ))}
            </div>

            {/* Quick Observation Form */}
            <div className="bg-gradient-to-br from-ocean-light/10 to-ocean-deep/10 rounded-lg p-5">
              <h4 className="font-headline text-lg font-bold text-text-primary mb-4">Quick Observation Report</h4>
              <form onSubmit={handleObservationSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Location"
                    placeholder="e.g., Negombo Beach, GPS coordinates"
                    value={newObservation?.location}
                    onChange={(e) => setNewObservation({...newObservation, location: e?.target?.value})}
                    required
                  />
                  <Input
                    label="Category"
                    placeholder="e.g., Marine Life, Water Quality, Weather"
                    value={newObservation?.category}
                    onChange={(e) => setNewObservation({...newObservation, category: e?.target?.value})}
                    required
                  />
                </div>
                <Input
                  label="Observation"
                  placeholder="Describe what you observed..."
                  value={newObservation?.observation}
                  onChange={(e) => setNewObservation({...newObservation, observation: e?.target?.value})}
                  required
                />
                <Button type="submit" variant="default" iconName="Send" iconPosition="left">
                  Submit Observation
                </Button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="font-headline text-lg font-bold text-text-primary">Local Alerts & Advisories</h4>
                <p className="font-body text-sm text-text-secondary">Real-time updates from NARA regional centers</p>
              </div>
              <Button variant="outline" iconName="Settings" iconPosition="left" size="sm">
                Alert Preferences
              </Button>
            </div>

            {localAlerts?.map((alert) => (
              <div key={alert?.id} className={`rounded-lg border p-4 ${getSeverityColor(alert?.severity)}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Icon 
                      name={alert?.type === 'weather' ? 'Cloud' : alert?.type === 'marine-life' ? 'Fish' : 'Droplets'} 
                      size={20} 
                      className="flex-shrink-0"
                    />
                    <div>
                      <h4 className="font-headline text-lg font-bold">{alert?.title}</h4>
                      <div className="flex items-center space-x-2 text-sm mt-1">
                        <Icon name="MapPin" size={12} />
                        <span>{alert?.region}</span>
                        <span>•</span>
                        <span>{alert?.source}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-cta-medium ${
                    alert?.severity === 'high' ? 'bg-error text-error-foreground' :
                    alert?.severity === 'medium' ? 'bg-warning text-warning-foreground' :
                    'bg-success text-success-foreground'
                  }`}>
                    {alert?.severity?.toUpperCase()}
                  </span>
                </div>

                <p className="font-body text-sm mb-3">{alert?.message}</p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Icon name="Clock" size={14} />
                    <span>Valid until: {new Date(alert.validUntil)?.toLocaleString()}</span>
                  </div>
                  <Button variant="ghost" size="sm" iconName="Share" iconPosition="left">
                    Share Alert
                  </Button>
                </div>
              </div>
            ))}

            <div className="bg-muted rounded-lg p-4 text-center">
              <Icon name="Bell" size={32} className="text-text-secondary mx-auto mb-3" />
              <h4 className="font-headline text-lg font-bold text-text-primary mb-2">Stay Informed</h4>
              <p className="font-body text-sm text-text-secondary mb-4">
                Subscribe to receive alerts via SMS, email, or push notifications.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button variant="default" iconName="Smartphone" iconPosition="left">
                  SMS Alerts
                </Button>
                <Button variant="outline" iconName="Mail" iconPosition="left">
                  Email Alerts
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h4 className="font-headline text-lg font-bold text-text-primary">Upcoming Events & Workshops</h4>
                <p className="font-body text-sm text-text-secondary">Join NARA's community education and engagement programs</p>
              </div>
              <Button variant="default" iconName="Calendar" iconPosition="left">
                View Full Calendar
              </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {upcomingEvents?.map((event) => (
                <div key={event?.id} className="bg-muted rounded-lg p-5 interactive-lift">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className={`px-2 py-1 rounded-full text-xs font-cta-medium ${
                        event?.type === 'Workshop' ? 'bg-primary/20 text-primary' :
                        event?.type === 'Training'? 'bg-secondary/20 text-secondary' : 'bg-accent/20 text-accent'
                      }`}>
                        {event?.type}
                      </span>
                      <h4 className="font-headline text-lg font-bold text-text-primary mt-2">{event?.title}</h4>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <Icon name="Calendar" size={14} className="text-text-secondary" />
                      <span className="font-body text-text-secondary">{new Date(event.date)?.toLocaleDateString()}</span>
                      <span className="text-text-secondary">•</span>
                      <span className="font-body text-text-secondary">{event?.time}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Icon name="MapPin" size={14} className="text-text-secondary" />
                      <span className="font-body text-text-secondary">{event?.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Icon name="Users" size={14} className="text-text-secondary" />
                      <span className="font-body text-text-secondary">{event?.audience}</span>
                    </div>
                  </div>

                  <p className="font-body text-sm text-text-secondary mb-4">
                    {event?.description}
                  </p>

                  <div className="bg-background rounded p-3 mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-body text-text-secondary">Facilitator:</span>
                      <span className="font-cta-medium text-text-primary">{event?.facilitator}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-body text-text-secondary">Registration:</span>
                      <span className="font-cta-medium text-text-primary">{event?.registered}/{event?.capacity}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 mt-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-ocean"
                        style={{ width: `${(event?.registered / event?.capacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <Button 
                    variant={event?.registered >= event?.capacity ? "outline" : "default"} 
                    fullWidth 
                    iconName={event?.registered >= event?.capacity ? "Clock" : "UserPlus"} 
                    iconPosition="left"
                    disabled={event?.registered >= event?.capacity}
                  >
                    {event?.registered >= event?.capacity ? "Waitlist" : "Register Now"}
                  </Button>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-ocean-deep/10 to-ocean-medium/10 rounded-lg p-6 text-center">
              <Icon name="Calendar" size={32} className="text-primary mx-auto mb-3" />
              <h4 className="font-headline text-lg font-bold text-text-primary mb-2">Host an Event</h4>
              <p className="font-body text-text-secondary mb-4">
                Interested in organizing a marine science event in your community? We'd love to collaborate.
              </p>
              <Button variant="default" iconName="Plus" iconPosition="left">
                Propose Event
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityEngagement;