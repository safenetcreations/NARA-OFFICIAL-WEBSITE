import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ImpactStories = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Stories', icon: 'Globe' },
    { id: 'fishing', name: 'Fishing Communities', icon: 'Fish' },
    { id: 'tourism', name: 'Tourism', icon: 'Camera' },
    { id: 'conservation', name: 'Conservation', icon: 'Leaf' },
    { id: 'education', name: 'Education', icon: 'BookOpen' }
  ];

  const stories = [
    {
      id: 1,
      category: 'fishing',
      title: "Early Warning System Saves 200 Fishing Boats",
      location: "Negombo Fishing Harbor",
      region: "Colombo Marine Research Center",
      impact: "Zero casualties during Cyclone Burevi",
      date: "December 2023",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
      description: `NARA's advanced weather monitoring system provided 48-hour advance warning of dangerous sea conditions, allowing the entire Negombo fishing fleet to return safely to harbor. The coordinated alert system, delivered through SMS, radio, and community leaders, prevented potential loss of life and equipment worth over Rs. 50 million.`,
      metrics: [
        { label: "Boats Protected", value: "200", icon: "Ship" },
        { label: "Lives Saved", value: "800", icon: "Users" },
        { label: "Economic Impact", value: "Rs. 50M", icon: "DollarSign" }
      ],
      testimonial: {
        quote: "NARA's warning came just in time. We had never seen such accurate predictions before. This system is a lifeline for our community.",author: "Sunil Perera",role: "Fishermen\'s Association President"
      }
    },
    {
      id: 2,
      category: 'tourism',
      title: "Water Quality Monitoring Boosts Hikkaduwa Tourism",
      location: "Hikkaduwa Marine Sanctuary",
      region: "Galle Marine Observatory",
      impact: "30% increase in tourist confidence",
      date: "January 2024",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
      description: `Real-time water quality monitoring and coral health assessments have restored tourist confidence in Hikkaduwa's marine sanctuary. NARA's transparent reporting system provides daily updates on water clarity, coral coverage, and marine life activity, leading to increased bookings and positive reviews.`,
      metrics: [
        { label: "Tourist Increase", value: "30%", icon: "TrendingUp" },
        { label: "Water Quality Score", value: "95/100", icon: "Droplets" },
        { label: "Coral Coverage", value: "78%", icon: "Flower" }
      ],
      testimonial: {
        quote: "Tourists now trust our waters because they can see the scientific data. NARA's monitoring gives us credibility we never had before.",author: "Chaminda Silva",role: "Dive Center Owner"
      }
    },
    {
      id: 3,
      category: 'conservation',
      title: "Mangrove Restoration Protects 500 Families",location: "Batticaloa Lagoon",region: "Batticaloa Coastal Lab",impact: "85% reduction in coastal erosion",date: "March 2024",image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop",
      description: `NARA's community-led mangrove restoration project has planted over 10,000 mangrove seedlings, creating a natural barrier that protects coastal villages from erosion and storm surge. The project combines scientific monitoring with traditional knowledge, involving local communities in every step.`,
      metrics: [
        { label: "Families Protected", value: "500", icon: "Home" },
        { label: "Mangroves Planted", value: "10,000", icon: "TreePine" },
        { label: "Erosion Reduction", value: "85%", icon: "Shield" }
      ],
      testimonial: {
        quote: "Our children can now play safely by the shore. The mangroves have brought back the fish and protected our homes.",author: "Kamala Devi",role: "Village Council Member"
      }
    },
    {
      id: 4,
      category: 'education',
      title: "Marine Science Program Inspires 1,000 Students",location: "Jaffna Peninsula Schools",region: "Jaffna Peninsula Center",impact: "40% increase in marine science enrollment",date: "February 2024",image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      description: `NARA's mobile marine laboratory visits schools across the Jaffna Peninsula, bringing hands-on ocean science education directly to students. The program includes water quality testing, marine biology experiments, and career guidance, inspiring a new generation of marine scientists.`,
      metrics: [
        { label: "Students Reached", value: "1,000", icon: "Users" },
        { label: "Schools Visited", value: "25", icon: "School" },
        { label: "Science Enrollment", value: "+40%", icon: "TrendingUp" }
      ],
      testimonial: {
        quote: "My daughter now wants to become a marine biologist. NARA showed her that science can help our community and protect our seas.",author: "Rajesh Kumar",role: "Parent & Teacher"
      }
    },
    {
      id: 5,
      category: 'fishing',
      title: "Sustainable Fishing Practices Increase Catch by 25%",location: "Hambantota Fishing Villages",region: "Hambantota Marine Hub",impact: "Sustainable livelihood improvement",date: "April 2024",image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      description: `NARA's fisheries management program introduced sustainable fishing techniques and seasonal guidelines based on marine ecosystem research. Fishermen now use selective gear and follow science-based fishing calendars, resulting in larger catches and healthier fish populations.`,
      metrics: [
        { label: "Catch Increase", value: "25%", icon: "Fish" },
        { label: "Fishermen Trained", value: "150", icon: "Users" },
        { label: "Fish Stock Recovery", value: "60%", icon: "TrendingUp" }
      ],
      testimonial: {
        quote: "Following NARA's advice, we catch more fish with less effort. The sea is healing, and our future is secure.",
        author: "Mohamed Hassan",
        role: "Senior Fisherman"
      }
    },
    {
      id: 6,
      category: 'conservation',
      title: "Whale Migration Corridor Protection Initiative",
      location: "Trincomalee Deep Waters",
      region: "Trincomalee Deep Sea Station",
      impact: "95% reduction in ship strikes",
      date: "May 2024",
      image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=300&fit=crop",
      description: `NARA's whale tracking and ship routing system has dramatically reduced whale-ship collisions in the busy Trincomalee shipping lanes. Real-time whale location data is shared with vessels, creating dynamic protection zones during migration seasons.`,
      metrics: [
        { label: "Ship Strikes Reduced", value: "95%", icon: "Shield" },
        { label: "Whales Protected", value: "200+", icon: "Fish" },
        { label: "Ships Participating", value: "85%", icon: "Ship" }
      ],
      testimonial: {
        quote: "We're proud to be part of whale protection. NARA's system helps us navigate safely while protecting these magnificent creatures.",
        author: "Captain Pradeep Silva",
        role: "Merchant Marine Officer"
      }
    }
  ];

  const filteredStories = selectedCategory === 'all' 
    ? stories 
    : stories?.filter(story => story?.category === selectedCategory);

  return (
    <div className="bg-card rounded-lg p-6 ocean-depth-shadow">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
        <div>
          <h3 className="font-headline text-xl font-bold text-text-primary">Local Impact Stories</h3>
          <p className="font-body text-text-secondary mt-1">Real stories of how NARA's research benefits coastal communities</p>
        </div>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mt-4 lg:mt-0">
          {categories?.map((category) => (
            <Button
              key={category?.id}
              variant={selectedCategory === category?.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category?.id)}
              iconName={category?.icon}
              iconPosition="left"
              iconSize={16}
              className="text-xs"
            >
              {category?.name}
            </Button>
          ))}
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        {filteredStories?.map((story, index) => (
          <div 
            key={story?.id} 
            className="bg-muted rounded-lg overflow-hidden interactive-lift animate-depth-reveal"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Story Image */}
            <div className="relative h-48 overflow-hidden">
              <Image
                src={story?.image}
                alt={story?.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              {/* Impact Badge */}
              <div className="absolute top-3 left-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-cta-medium">
                {story?.impact}
              </div>
              
              {/* Location */}
              <div className="absolute bottom-3 left-3 text-white">
                <div className="flex items-center space-x-2 text-sm">
                  <Icon name="MapPin" size={14} />
                  <span className="font-cta-medium">{story?.location}</span>
                </div>
                <div className="text-xs opacity-80 mt-1">{story?.region}</div>
              </div>
              
              {/* Date */}
              <div className="absolute bottom-3 right-3 bg-black/50 text-white px-2 py-1 rounded text-xs">
                {story?.date}
              </div>
            </div>

            {/* Story Content */}
            <div className="p-5">
              <h4 className="font-headline text-lg font-bold text-text-primary mb-3">
                {story?.title}
              </h4>
              
              <p className="font-body text-sm text-text-secondary mb-4 leading-relaxed">
                {story?.description}
              </p>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {story?.metrics?.map((metric, idx) => (
                  <div key={idx} className="text-center p-2 bg-background rounded-lg">
                    <Icon name={metric?.icon} size={16} className="text-primary mx-auto mb-1" />
                    <div className="font-headline text-sm font-bold text-text-primary">{metric?.value}</div>
                    <div className="font-body text-xs text-text-secondary">{metric?.label}</div>
                  </div>
                ))}
              </div>

              {/* Testimonial */}
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="Quote" size={16} className="text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-body text-sm text-text-primary italic mb-2">
                      "{story?.testimonial?.quote}"
                    </p>
                    <div className="text-xs">
                      <div className="font-cta-medium text-text-primary">{story?.testimonial?.author}</div>
                      <div className="text-text-secondary">{story?.testimonial?.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Call to Action */}
      <div className="mt-8 text-center">
        <div className="bg-gradient-to-r from-ocean-deep/10 to-ocean-medium/10 rounded-lg p-6">
          <h4 className="font-headline text-lg font-bold text-text-primary mb-2">Share Your Story</h4>
          <p className="font-body text-text-secondary mb-4">
            Has NARA's work impacted your community? We'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="default" iconName="MessageCircle" iconPosition="left">
              Submit Your Story
            </Button>
            <Button variant="outline" iconName="Users" iconPosition="left">
              Join Community Forum
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactStories;