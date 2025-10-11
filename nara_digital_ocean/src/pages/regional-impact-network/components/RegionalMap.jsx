import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const RegionalMap = () => {
  const [selectedRegion, setSelectedRegion] = useState(null);

  const regions = [
    {
      id: 1,
      name: "Colombo Marine Research Center",
      location: "Colombo",
      coordinates: { lat: 6.9271, lng: 79.8612 },
      position: { top: '45%', left: '15%' },
      specialization: "Urban Coastal Dynamics",
      staff: 24,
      projects: 8,
      communities: 12,
      image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=300&fit=crop",
      description: "Leading research on urban coastal impacts and port environmental monitoring.",
      keyProjects: ["Port Water Quality", "Urban Runoff Impact", "Coastal Erosion Mapping"]
    },
    {
      id: 2,
      name: "Galle Marine Observatory",
      location: "Galle",
      coordinates: { lat: 6.0535, lng: 80.2210 },
      position: { top: '65%', left: '18%' },
      specialization: "Coral Reef Ecosystems",
      staff: 18,
      projects: 12,
      communities: 8,
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
      description: "Protecting and studying the coral reefs of southern Sri Lanka.",
      keyProjects: ["Coral Restoration", "Marine Biodiversity", "Tourism Impact Assessment"]
    },
    {
      id: 3,
      name: "Trincomalee Deep Sea Station",
      location: "Trincomalee",
      coordinates: { lat: 8.5874, lng: 81.2152 },
      position: { top: '25%', left: '75%' },
      specialization: "Deep Water Research",
      staff: 32,
      projects: 15,
      communities: 6,
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
      description: "Advanced deep-sea research and naval oceanographic support.",
      keyProjects: ["Deep Sea Mining Impact", "Whale Migration", "Naval Cooperation"]
    },
    {
      id: 4,
      name: "Jaffna Peninsula Center",
      location: "Jaffna",
      coordinates: { lat: 9.6615, lng: 80.0255 },
      position: { top: '8%', left: '45%' },
      specialization: "Lagoon Ecosystems",
      staff: 16,
      projects: 10,
      communities: 15,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      description: "Specialized research on lagoon systems and brackish water environments.",
      keyProjects: ["Lagoon Restoration", "Fisheries Management", "Community Engagement"]
    },
    {
      id: 5,
      name: "Batticaloa Coastal Lab",
      location: "Batticaloa",
      coordinates: { lat: 7.7102, lng: 81.7088 },
      position: { top: '40%', left: '85%' },
      specialization: "Mangrove Conservation",
      staff: 14,
      projects: 9,
      communities: 11,
      image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop",
      description: "Leading mangrove research and coastal protection initiatives.",
      keyProjects: ["Mangrove Restoration", "Coastal Protection", "Aquaculture Support"]
    },
    {
      id: 6,
      name: "Hambantota Marine Hub",
      location: "Hambantota",
      coordinates: { lat: 6.1241, lng: 81.1185 },
      position: { top: '70%', left: '65%' },
      specialization: "Maritime Infrastructure",
      staff: 20,
      projects: 11,
      communities: 9,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      description: "Research supporting major port development and marine logistics.",
      keyProjects: ["Port Environmental Impact", "Shipping Lane Monitoring", "Marine Traffic Analysis"]
    }
  ];

  return (
    <div className="bg-card rounded-lg p-6 ocean-depth-shadow">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-headline text-xl font-bold text-text-primary">Regional Research Centers</h3>
          <p className="font-body text-text-secondary mt-1">Interactive map of NARA's nationwide presence</p>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="font-body text-text-secondary">Active Centers</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-accent rounded-full"></div>
            <span className="font-body text-text-secondary">Selected</span>
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Interactive Map */}
        <div className="lg:col-span-2">
          <div className="relative bg-gradient-to-br from-ocean-light/10 to-ocean-deep/10 rounded-lg p-8 h-96 overflow-hidden">
            {/* Sri Lanka Outline */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-64 h-80 bg-gradient-to-b from-ocean-medium/20 to-ocean-deep/30 rounded-full transform rotate-12 opacity-50"></div>
            </div>

            {/* Regional Centers */}
            {regions?.map((region) => (
              <div
                key={region?.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-ocean ${
                  selectedRegion?.id === region?.id ? 'scale-125 z-10' : 'hover:scale-110'
                }`}
                style={{ top: region?.position?.top, left: region?.position?.left }}
                onClick={() => setSelectedRegion(selectedRegion?.id === region?.id ? null : region)}
              >
                <div className={`relative ${
                  selectedRegion?.id === region?.id ? 'animate-ocean-pulse' : ''
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-ocean ${
                    selectedRegion?.id === region?.id 
                      ? 'bg-accent text-accent-foreground coral-glow' 
                      : 'bg-primary text-primary-foreground hover:bg-primary/80'
                  }`}>
                    <Icon name="MapPin" size={16} />
                  </div>
                  
                  {/* Tooltip */}
                  <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-card text-card-foreground text-xs rounded-lg shadow-ocean-depth whitespace-nowrap transition-all duration-ocean ${
                    selectedRegion?.id === region?.id ? 'opacity-100 visible' : 'opacity-0 invisible'
                  }`}>
                    <div className="font-cta-medium">{region?.name}</div>
                    <div className="text-text-secondary">{region?.specialization}</div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-card rotate-45"></div>
                  </div>
                </div>
              </div>
            ))}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3">
              <div className="text-xs font-cta text-text-secondary mb-2">Research Centers</div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-xs">
                  <Icon name="Users" size={12} className="text-primary" />
                  <span className="font-body text-text-secondary">Staff: {regions?.reduce((sum, r) => sum + r?.staff, 0)}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <Icon name="Beaker" size={12} className="text-secondary" />
                  <span className="font-body text-text-secondary">Projects: {regions?.reduce((sum, r) => sum + r?.projects, 0)}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <Icon name="Home" size={12} className="text-accent" />
                  <span className="font-body text-text-secondary">Communities: {regions?.reduce((sum, r) => sum + r?.communities, 0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center Details */}
        <div className="space-y-4">
          {selectedRegion ? (
            <div className="bg-muted rounded-lg p-4 animate-depth-reveal">
              <div className="relative h-32 rounded-lg overflow-hidden mb-4">
                <Image
                  src={selectedRegion?.image}
                  alt={selectedRegion?.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-2 left-2 text-white">
                  <div className="font-cta-medium text-sm">{selectedRegion?.location}</div>
                </div>
              </div>

              <h4 className="font-headline text-lg font-bold text-text-primary mb-2">
                {selectedRegion?.name}
              </h4>
              
              <p className="font-body text-sm text-text-secondary mb-4">
                {selectedRegion?.description}
              </p>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center">
                  <div className="font-headline text-lg font-bold text-primary">{selectedRegion?.staff}</div>
                  <div className="font-body text-xs text-text-secondary">Staff</div>
                </div>
                <div className="text-center">
                  <div className="font-headline text-lg font-bold text-secondary">{selectedRegion?.projects}</div>
                  <div className="font-body text-xs text-text-secondary">Projects</div>
                </div>
                <div className="text-center">
                  <div className="font-headline text-lg font-bold text-accent">{selectedRegion?.communities}</div>
                  <div className="font-body text-xs text-text-secondary">Communities</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-cta-medium text-sm text-text-primary">Key Projects:</div>
                {selectedRegion?.keyProjects?.map((project, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <Icon name="ChevronRight" size={12} className="text-primary" />
                    <span className="font-body text-text-secondary">{project}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-muted rounded-lg p-6 text-center">
              <Icon name="MousePointer" size={32} className="text-text-secondary mx-auto mb-3" />
              <div className="font-cta-medium text-text-primary mb-2">Select a Research Center</div>
              <p className="font-body text-sm text-text-secondary">
                Click on any marker to explore detailed information about our regional centers.
              </p>
            </div>
          )}

          {/* Quick Stats */}
          <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg p-4">
            <div className="font-cta-medium text-sm text-text-primary mb-3">Network Overview</div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-body text-text-secondary">Total Coverage</span>
                <span className="font-cta-medium text-primary">Island-wide</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-body text-text-secondary">Research Areas</span>
                <span className="font-cta-medium text-secondary">6 Specializations</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-body text-text-secondary">Community Reach</span>
                <span className="font-cta-medium text-accent">61 Villages</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionalMap;