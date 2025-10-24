import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

const maritimeServices = [
  {
    id: 'hydrographic-survey',
    name: 'Hydrographic Survey',
    icon: 'Ship',
    description: 'Professional bathymetric surveys and seafloor mapping using advanced multibeam sonar technology',
    price: 500000,
    duration: '2-4 weeks',
    features: ['Multibeam sonar mapping', 'Side-scan sonar imaging', 'Sub-bottom profiling', 'GPS positioning'],
    status: 'Available',
    color: 'blue'
  },
  {
    id: 'chart-supply',
    name: 'Nautical Chart Supply',
    icon: 'Map',
    description: 'Official nautical charts for Sri Lankan waters, updated with latest hydrographic data',
    price: 8500,
    duration: '1-2 days',
    features: ['Digital & paper formats', 'Latest editions', 'Custom coverage', 'Certified charts'],
    status: 'Available',
    color: 'cyan'
  },
  {
    id: 'data-processing',
    name: 'Oceanographic Data Processing',
    icon: 'Database',
    description: 'Advanced processing and analysis of marine data including CTD, ADCP, and water quality measurements',
    price: 150000,
    duration: '1 week',
    features: ['CTD data analysis', 'Current profiling', 'Quality control', 'Report generation'],
    status: 'Available',
    color: 'indigo'
  },
  {
    id: 'vessel-positioning',
    name: 'Vessel Positioning Services',
    icon: 'Navigation',
    description: 'Real-time DGPS positioning and navigation support for research vessels and commercial ships',
    price: 75000,
    duration: 'Daily',
    features: ['DGPS corrections', 'Real-time positioning', 'Route planning', '24/7 support'],
    status: 'Available',
    color: 'green'
  },
  {
    id: 'training',
    name: 'Maritime Training',
    icon: 'GraduationCap',
    description: 'Professional training in hydrography, navigation, and oceanographic instrumentation',
    price: 250000,
    duration: '1-2 weeks',
    features: ['Hands-on training', 'Certification', 'Equipment familiarization', 'Field practice'],
    status: 'Limited',
    color: 'violet'
  },
  {
    id: 'consultation',
    name: 'Maritime Consultation',
    icon: 'Users',
    description: 'Expert consultation on marine projects, EIA studies, and oceanographic research',
    price: 100000,
    duration: 'Project-based',
    features: ['Expert advice', 'Project planning', 'Feasibility studies', 'Technical reports'],
    status: 'Available',
    color: 'orange'
  }
];

const ServicesSection = () => {
  const [selectedService, setSelectedService] = useState(null);

  const getIconComponent = (iconName) => {
    return Icons[iconName] || Icons.Circle;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full mb-4">
            <Icons.Briefcase className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-blue-700 text-sm font-semibold">Professional Maritime Services</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive maritime services backed by decades of expertise in hydrography,
            oceanography, and marine research
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {maritimeServices.map((service, index) => {
            const IconComponent = getIconComponent(service.icon);

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-xl hover:border-blue-300 transition-all cursor-pointer group"
                onClick={() => setSelectedService(service)}
              >
                <div className={`w-14 h-14 bg-${service.color}-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <IconComponent className={`w-7 h-7 text-${service.color}-600`} />
                </div>

                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{service.name}</h3>
                  <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    service.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {service.status}
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Starting from</span>
                    <span className={`font-bold text-${service.color}-600`}>{formatPrice(service.price)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Duration</span>
                    <span className="font-semibold text-gray-900">{service.duration}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="flex flex-wrap gap-1">
                    {service.features.slice(0, 3).map((feature, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                      >
                        {feature}
                      </span>
                    ))}
                    {service.features.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        +{service.features.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <button className={`w-full py-3 bg-${service.color}-600 text-white rounded-lg font-semibold hover:bg-${service.color}-700 transition-colors flex items-center justify-center space-x-2`}>
                  <Icons.Calendar className="w-4 h-4" />
                  <span>Request Quote</span>
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Why Choose Us */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              icon: Icons.Award,
              title: '30+ Years',
              description: 'Industry experience',
              color: 'blue'
            },
            {
              icon: Icons.Shield,
              title: 'IHO Certified',
              description: 'International standards',
              color: 'green'
            },
            {
              icon: Icons.Users,
              title: 'Expert Team',
              description: 'Qualified professionals',
              color: 'purple'
            },
            {
              icon: Icons.Clock,
              title: '24/7 Support',
              description: 'Round-the-clock assistance',
              color: 'orange'
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 text-center border border-gray-200"
            >
              <div className={`w-12 h-12 bg-${item.color}-100 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                <item.icon className={`w-6 h-6 text-${item.color}-600`} />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{item.title}</div>
              <div className="text-sm text-gray-600">{item.description}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;
