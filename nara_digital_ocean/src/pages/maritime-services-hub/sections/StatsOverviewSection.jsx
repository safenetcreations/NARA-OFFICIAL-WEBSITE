import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

const stats = [
  {
    id: 1,
    value: '2',
    label: 'Active IOC Stations',
    sublabel: 'Real-time monitoring',
    icon: Icons.Radio,
    color: 'blue'
  },
  {
    id: 2,
    value: '99.8%',
    label: 'Data Uptime',
    sublabel: 'Quality assurance',
    icon: Icons.Shield,
    color: 'green'
  },
  {
    id: 3,
    value: '6 min',
    label: 'Update Frequency',
    sublabel: 'IOC sea level data',
    icon: Icons.Clock,
    color: 'cyan'
  },
  {
    id: 4,
    value: '30+',
    label: 'Nautical Charts',
    sublabel: 'Sri Lankan waters',
    icon: Icons.Map,
    color: 'indigo'
  },
  {
    id: 5,
    value: '24/7',
    label: 'Monitoring',
    sublabel: 'Continuous coverage',
    icon: Icons.Activity,
    color: 'violet'
  },
  {
    id: 6,
    value: '4',
    label: 'Free Data APIs',
    sublabel: 'IOC, NOAA, NASA, Copernicus',
    icon: Icons.Database,
    color: 'purple'
  }
];

const StatsOverviewSection = () => {
  return (
    <div className="py-12 bg-white border-y border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center mx-auto mb-3`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <div className={`text-3xl font-bold text-${stat.color}-600 mb-1`}>{stat.value}</div>
              <div className="text-sm font-semibold text-gray-900 mb-1">{stat.label}</div>
              <div className="text-xs text-gray-500">{stat.sublabel}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsOverviewSection;
