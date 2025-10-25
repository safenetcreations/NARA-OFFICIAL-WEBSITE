import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useTranslation } from 'react-i18next';

const freeConfig = [
  { id: 'ioc', icon: Icons.Waves, color: 'blue' },
  { id: 'noaa', icon: Icons.Anchor, color: 'cyan' },
  { id: 'copernicus', icon: Icons.Satellite, color: 'indigo' },
  { id: 'nasa', icon: Icons.Rocket, color: 'violet' }
];

const paidConfig = [
  { id: 'stormglass', icon: Icons.Cloud, color: 'orange' },
  { id: 'weatherapi', icon: Icons.CloudRain, color: 'blue' },
  { id: 'marineTraffic', icon: Icons.Ship, color: 'red' }
];

const tierConfig = [
  { id: 'free', icon: Icons.Gift, color: 'green' },
  { id: 'basic', icon: Icons.Zap, color: 'blue' },
  { id: 'professional', icon: Icons.Crown, color: 'purple' }
];

const DataSourcesPanel = () => {
  const { t } = useTranslation('maritime');
  const [activeTab, setActiveTab] = useState('free');

  const tabs = t('dataSources.tabs', { returnObjects: true }) || [];
  const freeSources = t('dataSources.free', { returnObjects: true }) || [];
  const paidSources = t('dataSources.paid', { returnObjects: true }) || [];
  const tiers = t('dataSources.tiers', { returnObjects: true }) || [];
  const labels = t('dataSources.labels', { returnObjects: true }) || {};
  const support = t('dataSources.support', { returnObjects: true }) || {};

  const getFreeSource = (id) => freeSources.find((item) => item.id === id) || {};
  const getPaidSource = (id) => paidSources.find((item) => item.id === id) || {};
  const getTierContent = (id) => tiers.find((item) => item.id === id) || {};

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4 p-1 bg-gray-100 rounded-lg w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center space-x-2">
              {tab.id === 'free' && <Icons.Gift className="w-4 h-4" />}
              {tab.id === 'paid' && <Icons.DollarSign className="w-4 h-4" />}
              {tab.id === 'pricing' && <Icons.Calculator className="w-4 h-4" />}
              <span>{tab.label}</span>
              {tab.id === 'free' && (
                <span className="ml-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                  {freeSources.length}
                </span>
              )}
              {tab.id === 'paid' && (
                <span className="ml-1 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">
                  {paidSources.length}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {activeTab === 'free' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {freeConfig.map((config, index) => {
            const source = getFreeSource(config.id);
            return (
              <motion.div
                key={config.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-${config.color}-100 rounded-lg flex items-center justify-center`}>
                    <config.icon className={`w-6 h-6 text-${config.color}-600`} />
                  </div>
                  <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                    {labels.freeBadge}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-1">{source.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{source.provider}</p>
                <p className="text-gray-700 text-sm mb-4">{source.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Update:</span>
                    <span className="font-semibold text-gray-900">{source.update}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Coverage:</span>
                    <span className="font-semibold text-gray-900">{source.coverage}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Access:</span>
                    <span className="font-semibold text-blue-600">{source.access}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {(source.formats || []).map((format) => (
                    <span
                      key={format}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
                    >
                      {format}
                    </span>
                  ))}
                </div>

                <button className={`w-full py-2 bg-${config.color}-600 text-white rounded-lg font-semibold hover:bg-${config.color}-700 transition-colors`}>
                  {source.cta}
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      {activeTab === 'paid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paidConfig.map((config, index) => {
            const source = getPaidSource(config.id);
            return (
              <motion.div
                key={config.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-md border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-${config.color}-100 rounded-lg flex items-center justify-center`}>
                    <config.icon className={`w-6 h-6 text-${config.color}-600`} />
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      source.tier === 'Basic'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}
                  >
                    {source.tier}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">{source.name}</h3>
                <div className="text-sm font-semibold text-orange-600 mb-3">{source.pricing}</div>
                <p className="text-gray-700 text-sm mb-4">{source.description}</p>

                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="text-xs text-gray-500 mb-1">{labels.integrationNote}</div>
                  <div className="text-xs text-gray-700">{source.notes}</div>
                </div>

                <button className="w-full py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all">
                  {source.cta}
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      {activeTab === 'pricing' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tierConfig.map((config, index) => {
            const tier = getTierContent(config.id);
            return (
              <motion.div
                key={config.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-xl p-8 shadow-lg border-2 ${
                  index === 1 ? 'border-blue-500 relative' : 'border-gray-200'
                }`}
              >
                {index === 1 && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="px-4 py-1 bg-blue-500 text-white rounded-full text-xs font-bold">
                      {labels.recommended}
                    </div>
                  </div>
                )}

                <div className={`w-16 h-16 bg-${config.color}-100 rounded-xl flex items-center justify-center mb-6`}>
                  <config.icon className={`w-8 h-8 text-${config.color}-600`} />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.title}</h3>
                <div className="text-4xl font-bold text-gray-900 mb-6">{tier.price}</div>

                <div className="space-y-3 mb-8">
                  {(tier.inclusions || []).map((item) => (
                    <div key={item} className="flex items-start space-x-3">
                      <Icons.Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>

                <button
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    index === 1
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {tier.cta}
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-start space-x-4">
          <Icons.Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-gray-900 mb-2">{support.heading}</h4>
            <p className="text-gray-700 text-sm">{support.description}</p>
            <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              {support.button}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSourcesPanel;
