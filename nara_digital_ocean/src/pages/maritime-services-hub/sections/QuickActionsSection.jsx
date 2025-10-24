import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';

const quickActions = [
  {
    id: 'book-survey',
    title: 'Book Hydrographic Survey',
    description: 'Schedule professional bathymetric surveys',
    icon: Icons.Compass,
    color: 'blue',
    action: 'Book Now',
    link: null
  },
  {
    id: 'order-chart',
    title: 'Order Nautical Charts',
    description: 'Browse and purchase official charts',
    icon: Icons.Map,
    color: 'cyan',
    action: 'Browse Catalog',
    link: null
  },
  {
    id: 'access-data',
    title: 'Access Live Ocean Data',
    description: 'Real-time temperature, currents, waves & salinity data',
    icon: Icons.Database,
    color: 'indigo',
    action: 'View Live Data',
    link: '/live-ocean-data'
  },
  {
    id: 'request-data',
    title: 'Request Historical Data',
    description: 'Access archived oceanographic datasets',
    icon: Icons.Archive,
    color: 'violet',
    action: 'Submit Request',
    link: null
  },
  {
    id: 'training',
    title: 'Training Programs',
    description: 'Professional maritime training courses',
    icon: Icons.GraduationCap,
    color: 'purple',
    action: 'View Programs',
    link: null
  },
  {
    id: 'consultation',
    title: 'Expert Consultation',
    description: 'Get technical advice from our team',
    icon: Icons.MessageSquare,
    color: 'orange',
    action: 'Contact Us',
    link: null
  }
];

const QuickActionsSection = () => {
  const navigate = useNavigate();

  const handleActionClick = (action) => {
    if (action.link) {
      navigate(action.link);
    } else {
      // Handle other actions or show coming soon message
      console.log(`Action clicked: ${action.id}`);
    }
  };

  return (
    <div className="py-12 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Quick Actions</h2>
          <p className="text-gray-600">Fast access to our most popular services</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.id}
              onClick={() => handleActionClick(action)}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`bg-white rounded-xl p-6 shadow-md border-2 border-transparent hover:border-${action.color}-300 hover:shadow-lg transition-all text-left group ${action.link ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <div className={`w-12 h-12 bg-${action.color}-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <action.icon className={`w-6 h-6 text-${action.color}-600`} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{action.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{action.description}</p>
              <div className={`flex items-center text-${action.color}-600 font-semibold text-sm`}>
                <span>{action.action}</span>
                <Icons.ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActionsSection;
