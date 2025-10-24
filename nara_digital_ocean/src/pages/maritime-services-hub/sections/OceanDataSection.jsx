import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import SeaLevelDashboard from '../components/ocean-data/SeaLevelDashboard';
import DataSourcesPanel from '../components/ocean-data/DataSourcesPanel';
import HistoricalDataPanel from '../components/ocean-data/HistoricalDataPanel';
import IntegrationGuide from '../components/ocean-data/IntegrationGuide';

const OceanDataSection = () => {
  const [activeTab, setActiveTab] = useState('sea-level');
  const [isExpanded, setIsExpanded] = useState(false);

  const tabs = [
    {
      id: 'sea-level',
      label: 'Sea Level Monitoring',
      icon: Icons.Waves,
      description: 'Real-time sea level data from IOC stations',
      color: 'blue'
    },
    {
      id: 'data-sources',
      label: 'Data Sources',
      icon: Icons.Database,
      description: 'Free & premium ocean data APIs',
      color: 'cyan'
    },
    {
      id: 'historical',
      label: 'Historical Data',
      icon: Icons.Archive,
      description: 'Access archived datasets',
      color: 'indigo'
    },
    {
      id: 'integration',
      label: 'Integration Guide',
      icon: Icons.Code,
      description: 'Developer resources & APIs',
      color: 'violet'
    }
  ];

  return (
    <div className="py-16 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full mb-4">
            <Icons.Activity className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-blue-700 text-sm font-semibold">Real-Time Ocean Intelligence</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Ocean Data Dashboard
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access comprehensive ocean data including sea level monitoring, temperature, currents, waves,
            salinity, and chlorophyll concentration for Sri Lankan waters
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: Icons.Radio,
              title: '6-Minute Updates',
              description: 'Real-time data from IOC sea level monitoring network',
              color: 'text-blue-600',
              bg: 'bg-blue-50'
            },
            {
              icon: Icons.Globe,
              title: 'Free Data Sources',
              description: 'Access NASA, NOAA, Copernicus, and IOC datasets',
              color: 'text-cyan-600',
              bg: 'bg-cyan-50'
            },
            {
              icon: Icons.Shield,
              title: '99.8% Uptime',
              description: 'Quality-assured data with automated QA/QC pipelines',
              color: 'text-green-600',
              bg: 'bg-green-50'
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className={`w-12 h-12 ${feature.bg} rounded-lg flex items-center justify-center mb-4`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex flex-wrap">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-[200px] px-6 py-4 transition-all ${
                    activeTab === tab.id
                      ? 'bg-white border-b-2 border-blue-600'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <tab.icon
                      className={`w-5 h-5 ${
                        activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'
                      }`}
                    />
                    <span
                      className={`font-semibold ${
                        activeTab === tab.id ? 'text-blue-600' : 'text-gray-600'
                      }`}
                    >
                      {tab.label}
                    </span>
                  </div>
                  <p
                    className={`text-xs mt-1 ${
                      activeTab === tab.id ? 'text-blue-500' : 'text-gray-400'
                    }`}
                  >
                    {tab.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'sea-level' && <SeaLevelDashboard />}
                {activeTab === 'data-sources' && <DataSourcesPanel />}
                {activeTab === 'historical' && <HistoricalDataPanel />}
                {activeTab === 'integration' && <IntegrationGuide />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-8 text-center"
        >
          <Icons.BookOpen className="w-12 h-12 text-white mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-3">
            Need Help Integrating Ocean Data?
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Our team can help you integrate real-time ocean data into your applications,
            set up custom dashboards, and access historical datasets.
          </p>
          <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg">
            Contact Ocean Data Team
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default OceanDataSection;
