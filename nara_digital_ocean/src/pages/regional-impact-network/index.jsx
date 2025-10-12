import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';
import RegionalMap from './components/RegionalMap';
import ImpactStories from './components/ImpactStories';
import CommunityEngagement from './components/CommunityEngagement';
import RegionalDashboard from './components/RegionalDashboard';

const RegionalImpactNetwork = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const navigationSections = [
    { id: 'overview', name: 'Network Overview', icon: 'Globe' },
    { id: 'map', name: 'Regional Centers', icon: 'Map' },
    { id: 'stories', name: 'Impact Stories', icon: 'Heart' },
    { id: 'dashboard', name: 'Data Dashboard', icon: 'BarChart3' },
    { id: 'community', name: 'Community Hub', icon: 'Users' }
  ];

  const networkStats = [
    {
      icon: 'Building',
      value: '6',
      label: 'Research Centers',
      description: 'Strategically located across Sri Lanka',
      color: 'text-primary'
    },
    {
      icon: 'Users',
      value: '124',
      label: 'Research Staff',
      description: 'Dedicated marine scientists and technicians',
      color: 'text-secondary'
    },
    {
      icon: 'Home',
      value: '61',
      label: 'Partner Communities',
      description: 'Coastal villages and fishing communities',
      color: 'text-accent'
    },
    {
      icon: 'Beaker',
      value: '65',
      label: 'Active Projects',
      description: 'Ongoing research and conservation initiatives',
      color: 'text-success'
    }
  ];

  const keyAchievements = [
    {
      title: "Zero Casualties During Cyclone Season",
      description: "Advanced early warning systems protected 2,000+ fishing vessels across all regions",
      impact: "100% Safety Record",
      icon: "Shield",
      color: "bg-success/10 text-success border-success/20"
    },
    {
      title: "Coral Reef Recovery Program",
      description: "Restored 15 hectares of coral reefs with 78% survival rate using innovative techniques",
      impact: "15 Hectares Restored",
      icon: "Flower",
      color: "bg-ocean-light/10 text-ocean-medium border-ocean-light/20"
    },
    {
      title: "Sustainable Fishing Initiative",
      description: "Trained 500+ fishermen in sustainable practices, increasing catch by 25% while protecting stocks",
      impact: "25% Catch Increase",
      icon: "Fish",
      color: "bg-primary/10 text-primary border-primary/20"
    },
    {
      title: "Marine Education Outreach",
      description: "Reached 5,000+ students through mobile marine labs and school partnership programs",
      impact: "5,000+ Students",
      icon: "GraduationCap",
      color: "bg-accent/10 text-accent border-accent/20"
    }
  ];

  const regionalHighlights = [
    {
      region: "Western Province",
      center: "Colombo Marine Research Center",
      image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600&h=400&fit=crop",
      specialization: "Urban Coastal Dynamics",
      keyProject: "Port Environmental Monitoring",
      communityImpact: "Protected 12 fishing communities from industrial pollution",
      stats: { staff: 24, projects: 8, communities: 12 }
    },
    {
      region: "Southern Province",
      center: "Galle Marine Observatory",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop",
      specialization: "Coral Reef Conservation",
      keyProject: "Hikkaduwa Marine Sanctuary Restoration",
      communityImpact: "Boosted tourism revenue by 30% through water quality assurance",
      stats: { staff: 18, projects: 12, communities: 8 }
    },
    {
      region: "Eastern Province",
      center: "Trincomalee Deep Sea Station",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop",
      specialization: "Deep Water Research",
      keyProject: "Whale Migration Corridor Protection",
      communityImpact: "Reduced ship-whale collisions by 95% through smart routing",
      stats: { staff: 32, projects: 15, communities: 6 }
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Regional Impact Network - NARA Digital Ocean</title>
        <meta name="description" content="Explore NARA's six regional research centers across Sri Lanka, showcasing local marine ecosystems, community partnerships, and region-specific research projects that benefit coastal communities." />
        <meta name="keywords" content="NARA regional centers, marine research Sri Lanka, coastal communities, fishing villages, marine conservation, ocean science network" />
      </Helmet>
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-ocean-deep via-ocean-medium to-ocean-light text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-ocean-pulse"></div>
            <div className="absolute bottom-20 right-20 w-24 h-24 bg-coral-warm/20 rounded-full animate-data-flow"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-ocean-light/30 rounded-full animate-depth-reveal"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="animate-depth-reveal">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-coral-warm rounded-lg flex items-center justify-center">
                    <Icon name="Globe" size={24} color="white" />
                  </div>
                  <div>
                    <div className="font-cta text-coral-warm text-sm uppercase tracking-wider">Regional Network</div>
                    <div className="font-headline text-2xl font-bold">Island-wide Impact</div>
                  </div>
                </div>
                
                <h1 className="font-headline text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                  Connecting Communities Through
                  <span className="text-coral-warm"> Ocean Science</span>
                </h1>
                
                <p className="font-body text-lg lg:text-xl text-white/90 mb-8 leading-relaxed">
                  Six regional research centers across Sri Lanka, each dedicated to understanding local marine ecosystems 
                  while serving coastal communities with practical solutions, early warnings, and sustainable practices.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    variant="default"
                    size="lg"
                    className="bg-coral-warm hover:bg-coral-warm/90 text-white"
                    iconName="Map"
                    iconPosition="left"
                    onClick={() => setActiveSection('map')}
                  >
                    Explore Centers
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white hover:text-ocean-deep"
                    iconName="Heart"
                    iconPosition="left"
                    onClick={() => setActiveSection('stories')}
                  >
                    Impact Stories
                  </Button>
                </div>
              </div>
              
              <div className="relative animate-depth-reveal" style={{ animationDelay: '200ms' }}>
                <div className="relative">
                  <Image
                    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=500&fit=crop"
                    alt="Sri Lankan coastal research network"
                    className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl"></div>
                  
                  {/* Floating Stats */}
                  <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <Icon name="Users" size={20} color="white" />
                      </div>
                      <div>
                        <div className="font-headline text-lg font-bold text-text-primary">61</div>
                        <div className="font-body text-xs text-text-secondary">Communities Served</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute -top-6 -right-6 bg-coral-warm/95 backdrop-blur-sm rounded-xl p-4 shadow-xl text-white">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <Icon name="Shield" size={20} color="white" />
                      </div>
                      <div>
                        <div className="font-headline text-lg font-bold">100%</div>
                        <div className="font-body text-xs opacity-90">Safety Record</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <section className="bg-card border-b border-border sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex overflow-x-auto scrollbar-hide">
              {navigationSections?.map((section) => (
                <button
                  key={section?.id}
                  onClick={() => setActiveSection(section?.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-cta-medium text-sm whitespace-nowrap border-b-2 transition-all duration-ocean ${
                    activeSection === section?.id
                      ? 'border-primary text-primary bg-primary/5' :'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
                  }`}
                >
                  <Icon name={section?.icon} size={18} />
                  <span>{section?.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          {activeSection === 'overview' && (
            <div className="space-y-12 animate-depth-reveal">
              {/* Network Statistics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {networkStats?.map((stat, index) => (
                  <div key={index} className="bg-card rounded-lg p-6 text-center ocean-depth-shadow interactive-lift">
                    <div className={`w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center ${
                      stat?.color === 'text-primary' ? 'bg-primary/10' :
                      stat?.color === 'text-secondary' ? 'bg-secondary/10' :
                      stat?.color === 'text-accent'? 'bg-accent/10' : 'bg-success/10'
                    }`}>
                      <Icon name={stat?.icon} size={24} className={stat?.color} />
                    </div>
                    <div className={`font-headline text-3xl font-bold mb-2 ${stat?.color}`}>{stat?.value}</div>
                    <div className="font-cta-medium text-text-primary mb-1">{stat?.label}</div>
                    <div className="font-body text-xs text-text-secondary">{stat?.description}</div>
                  </div>
                ))}
              </div>

              {/* Key Achievements */}
              <div className="bg-card rounded-lg p-8 ocean-depth-shadow">
                <h3 className="font-headline text-2xl font-bold text-text-primary mb-6 text-center">
                  Network Achievements
                </h3>
                <div className="grid lg:grid-cols-2 gap-6">
                  {keyAchievements?.map((achievement, index) => (
                    <div key={index} className={`rounded-lg border p-6 ${achievement?.color}`}>
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <Icon name={achievement?.icon} size={24} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-headline text-lg font-bold mb-2">{achievement?.title}</h4>
                          <p className="font-body text-sm mb-3 opacity-80">{achievement?.description}</p>
                          <div className="font-cta-medium text-sm font-bold">{achievement?.impact}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Regional Highlights */}
              <div className="space-y-8">
                <h3 className="font-headline text-2xl font-bold text-text-primary text-center">
                  Regional Highlights
                </h3>
                <div className="space-y-8">
                  {regionalHighlights?.map((highlight, index) => (
                    <div key={index} className={`bg-card rounded-lg overflow-hidden ocean-depth-shadow ${
                      index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                    } lg:flex`}>
                      <div className="lg:w-1/2">
                        <Image
                          src={highlight?.image}
                          alt={highlight?.center}
                          className="w-full h-64 lg:h-full object-cover"
                        />
                      </div>
                      <div className="lg:w-1/2 p-8">
                        <div className="flex items-center space-x-2 mb-4">
                          <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-cta-medium rounded-full">
                            {highlight?.region}
                          </span>
                        </div>
                        <h4 className="font-headline text-xl font-bold text-text-primary mb-3">
                          {highlight?.center}
                        </h4>
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center space-x-2">
                            <Icon name="Microscope" size={16} className="text-secondary" />
                            <span className="font-body text-sm text-text-secondary">
                              <strong>Specialization:</strong> {highlight?.specialization}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Icon name="Beaker" size={16} className="text-accent" />
                            <span className="font-body text-sm text-text-secondary">
                              <strong>Key Project:</strong> {highlight?.keyProject}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Icon name="Heart" size={16} className="text-success" />
                            <span className="font-body text-sm text-text-secondary">
                              <strong>Community Impact:</strong> {highlight?.communityImpact}
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="font-headline text-lg font-bold text-primary">{highlight?.stats?.staff}</div>
                            <div className="font-body text-xs text-text-secondary">Staff</div>
                          </div>
                          <div className="text-center">
                            <div className="font-headline text-lg font-bold text-secondary">{highlight?.stats?.projects}</div>
                            <div className="font-body text-xs text-text-secondary">Projects</div>
                          </div>
                          <div className="text-center">
                            <div className="font-headline text-lg font-bold text-accent">{highlight?.stats?.communities}</div>
                            <div className="font-body text-xs text-text-secondary">Communities</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'map' && <RegionalMap />}
          {activeSection === 'stories' && <ImpactStories />}
          {activeSection === 'dashboard' && <RegionalDashboard />}
          {activeSection === 'community' && <CommunityEngagement />}
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-ocean-deep to-ocean-medium text-white py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Icon name="Users" size={48} className="mx-auto mb-6 text-coral-warm" />
            <h2 className="font-headline text-3xl lg:text-4xl font-bold mb-6">
              Join Our Regional Network
            </h2>
            <p className="font-body text-lg lg:text-xl text-white/90 mb-8 leading-relaxed">
              Whether you're a researcher, community leader, or ocean enthusiast, there's a place for you 
              in NARA's regional network. Connect with your local center and become part of Sri Lanka's 
              marine conservation future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="default"
                size="lg"
                className="bg-coral-warm hover:bg-coral-warm/90 text-white"
                iconName="MapPin"
                iconPosition="left"
              >
                Find Your Local Center
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-ocean-deep"
                iconName="MessageCircle"
                iconPosition="left"
              >
                Contact Regional Team
              </Button>
            </div>
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Icon name="Waves" size={24} className="text-primary" />
            <span className="font-headline text-lg font-bold text-text-primary">NARA Digital Ocean</span>
          </div>
          <p className="font-body text-sm text-text-secondary">
            © {new Date()?.getFullYear()} National Aquatic Resources Research and Development Agency. 
            Connecting communities through ocean intelligence.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default RegionalImpactNetwork;