import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SeaLevelDashboard from '../components/ocean-data/SeaLevelDashboard';
import DataSourcesPanel from '../components/ocean-data/DataSourcesPanel';
import HistoricalDataPanel from '../components/ocean-data/HistoricalDataPanel';
import IntegrationGuide from '../components/ocean-data/IntegrationGuide';

const tabConfig = [
  { id: 'sea-level', icon: Icons.Waves, color: 'blue' },
  { id: 'data-sources', icon: Icons.Database, color: 'cyan' },
  { id: 'historical', icon: Icons.Archive, color: 'indigo' },
  { id: 'integration', icon: Icons.Code, color: 'violet' }
];

const featureConfig = [
  { id: 'updates', icon: Icons.Radio, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'sources', icon: Icons.Globe, color: 'text-cyan-600', bg: 'bg-cyan-50' },
  { id: 'uptime', icon: Icons.Shield, color: 'text-green-600', bg: 'bg-green-50' }
];

const OceanDataSection = () => {
  const { t } = useTranslation('maritime');
  const [activeTab, setActiveTab] = useState('sea-level');
  const content = t('oceanData', { returnObjects: true }) || {};
  const tabs = content.tabs || [];
  const features = content.features || [];

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
            <span className="text-blue-700 text-sm font-semibold">{content?.badge}</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {content?.heading}
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {content?.description}
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {featureConfig.map((config, index) => {
            const feature = features.find((item) => item.id === config.id) || {};
            const IconComponent = config.icon;
            return (
              <motion.div
              key={config.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className={`w-12 h-12 ${config.bg} rounded-lg flex items-center justify-center mb-4`}>
                <IconComponent className={`w-6 h-6 ${config.color}`} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
            );
          })}
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex flex-wrap">
              {tabConfig.map((config) => {
                const tab = tabs.find((item) => item.id === config.id) || {};
                return (
                <button
                  key={config.id}
                  onClick={() => setActiveTab(config.id)}
                  className={`flex-1 min-w-[200px] px-6 py-4 transition-all ${
                    activeTab === config.id
                      ? 'bg-white border-b-2 border-blue-600'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <config.icon
                      className={`w-5 h-5 ${
                        activeTab === config.id ? 'text-blue-600' : 'text-gray-400'
                      }`}
                    />
                    <span
                      className={`font-semibold ${
                        activeTab === config.id ? 'text-blue-600' : 'text-gray-600'
                      }`}
                    >
                      {tab.label}
                    </span>
                  </div>
                  <p
                    className={`text-xs mt-1 ${
                      activeTab === config.id ? 'text-blue-500' : 'text-gray-400'
                    }`}
                  >
                    {tab.description}
                  </p>
                </button>
                );
              })}
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
            {content?.cta?.heading}
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            {content?.cta?.description}
          </p>
          <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg">
            {content?.cta?.button}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default OceanDataSection;
