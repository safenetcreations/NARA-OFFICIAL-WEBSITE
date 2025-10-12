import React from 'react';
import GlobalNetworkSection from './components/GlobalNetworkSection';
import InnovationShowcase from './components/InnovationShowcase';
import PartnershipOpportunities from './components/PartnershipOpportunities';
import TechnologyTransfer from './components/TechnologyTransfer';
import EventsCalendar from './components/EventsCalendar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const PartnershipInnovationGateway = () => {
  const heroStats = [
    { label: "Global Partners", value: "24", icon: "Globe" },
    { label: "Active Projects", value: "156", icon: "Zap" },
    { label: "Technologies Licensed", value: "18", icon: "Award" },
    { label: "Countries Reached", value: "35", icon: "Map" }
  ];

  const impactMetrics = [
    {
      title: "Research Impact",
      metrics: [
        { label: "Joint Publications", value: "342" },
        { label: "Citation Index", value: "2,847" },
        { label: "H-Index Growth", value: "+45%" }
      ]
    },
    {
      title: "Economic Impact",
      metrics: [
        { label: "Technology Revenue", value: "$12.5M" },
        { label: "Jobs Created", value: "1,250" },
        { label: "Industry Partnerships", value: "89" }
      ]
    },
    {
      title: "Innovation Pipeline",
      metrics: [
        { label: "Patents Filed", value: "28" },
        { label: "Technologies in Development", value: "15" },
        { label: "Pilot Projects", value: "42" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pb-16 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
              <Icon name="Lightbulb" size={40} className="text-primary" />
            </div>
            <h1 className="font-headline text-4xl lg:text-6xl font-bold text-text-primary mb-6">
              Partnership & Innovation
              <span className="block text-primary">Gateway</span>
            </h1>
            <p className="font-body text-xl text-text-secondary max-w-4xl mx-auto mb-8">
              Connecting NARA with the global ocean science community through strategic partnerships, 
              cutting-edge innovations, and collaborative research initiatives that drive marine conservation 
              and sustainable development worldwide.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="default" size="lg">
                <Icon name="Handshake" size={20} className="mr-2" />
                Explore Partnerships
              </Button>
              <Button variant="outline" size="lg">
                <Icon name="Rocket" size={20} className="mr-2" />
                View Innovations
              </Button>
              <Button variant="ghost" size="lg">
                <Icon name="Calendar" size={20} className="mr-2" />
                Upcoming Events
              </Button>
            </div>
          </div>

          {/* Hero Statistics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {heroStats?.map((stat, index) => (
              <div key={index} className="bg-card rounded-lg p-6 text-center ocean-depth-shadow">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                  <Icon name={stat?.icon} size={24} className="text-primary" />
                </div>
                <div className="font-headline text-3xl font-bold text-text-primary mb-2">
                  {stat?.value}
                </div>
                <div className="font-body text-sm text-text-secondary">
                  {stat?.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Global Network Section */}
      <GlobalNetworkSection />
      {/* Innovation Showcase */}
      <InnovationShowcase />
      {/* Partnership Opportunities */}
      <PartnershipOpportunities />
      {/* Technology Transfer */}
      <TechnologyTransfer />
      {/* Events Calendar */}
      <EventsCalendar />
      {/* Impact Metrics Section */}
      <section className="py-16 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl lg:text-4xl font-bold text-text-primary mb-4">
              Partnership Impact Metrics
            </h2>
            <p className="font-body text-lg text-text-secondary max-w-3xl mx-auto">
              Measuring the real-world impact of our partnerships and innovations on ocean science, 
              economic development, and global marine conservation efforts.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {impactMetrics?.map((category, index) => (
              <div key={index} className="bg-card rounded-lg p-8 ocean-depth-shadow">
                <h3 className="font-cta text-xl font-semibold text-text-primary mb-6 text-center">
                  {category?.title}
                </h3>
                <div className="space-y-4">
                  {category?.metrics?.map((metric, metricIndex) => (
                    <div key={metricIndex} className="flex items-center justify-between">
                      <span className="font-body text-text-secondary">{metric?.label}</span>
                      <span className="font-cta text-lg font-semibold text-primary">{metric?.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Call to Action Section */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-success/10 rounded-2xl p-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-6">
              <Icon name="Users" size={32} className="text-primary" />
            </div>
            <h2 className="font-headline text-3xl font-bold text-text-primary mb-4">
              Ready to Partner with NARA?
            </h2>
            <p className="font-body text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
              Join our global network of partners and contribute to advancing ocean science, 
              marine conservation, and sustainable development. Together, we can create lasting 
              impact for our oceans and communities.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="default" size="lg">
                <Icon name="MessageSquare" size={20} className="mr-2" />
                Start a Conversation
              </Button>
              <Button variant="outline" size="lg">
                <Icon name="FileText" size={20} className="mr-2" />
                Partnership Proposal
              </Button>
              <Button variant="ghost" size="lg">
                <Icon name="Phone" size={20} className="mr-2" />
                Schedule Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-ocean-deep to-ocean-medium rounded-lg flex items-center justify-center">
                  <Icon name="Waves" size={24} color="white" />
                </div>
                <div>
                  <div className="font-headline text-lg font-bold text-text-primary">
                    NARA Digital Ocean
                  </div>
                  <div className="font-body text-sm text-text-secondary">
                    Partnership & Innovation Gateway
                  </div>
                </div>
              </div>
              <p className="font-body text-sm text-text-secondary mb-4 max-w-md">
                Facilitating global partnerships and driving innovation in ocean science 
                for sustainable marine development and conservation.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm">
                  <Icon name="Mail" size={16} />
                </Button>
                <Button variant="ghost" size="sm">
                  <Icon name="Phone" size={16} />
                </Button>
                <Button variant="ghost" size="sm">
                  <Icon name="Globe" size={16} />
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="font-cta text-sm font-semibold text-text-primary mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#partnerships" className="font-body text-sm text-text-secondary hover:text-primary">Global Network</a></li>
                <li><a href="#innovations" className="font-body text-sm text-text-secondary hover:text-primary">Innovation Showcase</a></li>
                <li><a href="#opportunities" className="font-body text-sm text-text-secondary hover:text-primary">Partnership Opportunities</a></li>
                <li><a href="#technology" className="font-body text-sm text-text-secondary hover:text-primary">Technology Transfer</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-cta text-sm font-semibold text-text-primary mb-4">Contact</h3>
              <div className="space-y-2 text-sm">
                <p className="font-body text-text-secondary">Partnership Office</p>
                <p className="font-body text-text-secondary">partnerships@nara.ac.lk</p>
                <p className="font-body text-text-secondary">+94 11 2 694 138</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="font-body text-sm text-text-secondary">
              © {new Date()?.getFullYear()} National Aquatic Resources Research and Development Agency. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PartnershipInnovationGateway;