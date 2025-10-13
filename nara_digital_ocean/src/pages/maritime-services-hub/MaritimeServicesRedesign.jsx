import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import * as Icons from 'lucide-react';
import {
  getVessels,
  getPorts,
  getMaritimeServices,
  getMaritimeAlerts
} from '../../services/maritimeService';

const MaritimeServicesRedesign = () => {
  const { t, i18n } = useTranslation('maritime');
  const [activeTab, setActiveTab] = useState('tracking');
  const [vessels, setVessels] = useState([]);
  const [ports, setPorts] = useState([]);
  const [services, setServices] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [i18n.language]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [vesselsData, portsData, servicesData, alertsData] = await Promise.all([
        getVessels({ limit: 50 }).catch(() => []),
        getPorts().catch(() => []),
        getMaritimeServices(i18n.language).catch(() => []),
        getMaritimeAlerts(true).catch(() => [])
      ]);
      
      setVessels(vesselsData);
      setPorts(portsData);
      setServices(servicesData);
      setAlerts(alertsData);
    } catch (error) {
      console.error('Error fetching maritime data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'tracking', label: 'Vessel Tracking', icon: Icons.Ship },
    { id: 'ports', label: 'Port Information', icon: Icons.Anchor },
    { id: 'weather', label: 'Weather & Navigation', icon: Icons.Cloud },
    { id: 'alerts', label: 'Safety Alerts', icon: Icons.AlertTriangle }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <Helmet>
        <title>{t('meta.title')}</title>
        <meta name="description" content={t('meta.description')} />
      </Helmet>

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-blue-900/50 to-transparent"></div>
        <motion.div
          animate={{ scale: [1, 2, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute w-96 h-96 border-2 border-cyan-500/30 rounded-full"
        />
        
        <div className="relative max-w-7xl mx-auto px-4 py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {t('hero.title')} <span className="text-cyan-400">{t('hero.highlight')}</span>
            </h1>
            <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">{t('hero.subtitle')}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setActiveTab('tracking')}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg font-medium transition-all"
              >
                {t('hero.primaryCta')}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tabs */}
      <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap border-b-2 ${
                  activeTab === tab.id
                    ? 'border-cyan-500 text-cyan-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {activeTab === 'tracking' && (
            <motion.div key="tracking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="text-2xl font-bold mb-6">Live Vessel Tracking</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vessels.length > 0 ? vessels.map((vessel) => (
                  <div key={vessel.id} className="bg-slate-900/50 backdrop-blur-xl rounded-xl border border-slate-800 p-6">
                    <h3 className="text-lg font-semibold mb-2">{vessel.name?.en || vessel.name}</h3>
                    <p className="text-sm text-slate-400 mb-4">{vessel.type}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Speed</span>
                        <span className="text-white">{vessel.speed} knots</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Heading</span>
                        <span className="text-white">{vessel.heading}°</span>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-3 text-center py-12 text-slate-400">
                    No vessels currently tracked. Add vessels in the admin panel.
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'ports' && (
            <motion.div key="ports" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="text-2xl font-bold mb-6">Port Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ports.length > 0 ? ports.map((port) => (
                  <div key={port.id} className="bg-slate-900/50 backdrop-blur-xl rounded-xl border border-slate-800 p-6">
                    <h3 className="text-lg font-semibold mb-2">{port.name?.en || port.name}</h3>
                    <p className="text-sm text-slate-400 mb-4">{port.code}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Vessels</span>
                        <span className="text-white">{port.vessels}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Capacity</span>
                        <span className="text-white">{port.capacity}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Status</span>
                        <span className="text-green-400">{port.status}</span>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-3 text-center py-12 text-slate-400">
                    No port data available. Add ports in the admin panel.
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'weather' && (
            <motion.div key="weather" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="text-2xl font-bold mb-6">Weather & Navigation</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['South Coast', 'East Coast', 'West Coast'].map((zone, i) => (
                  <div key={zone} className="bg-slate-900/50 backdrop-blur-xl rounded-xl border border-slate-800 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Icons.Cloud className="w-8 h-8 text-blue-400" />
                      <div>
                        <h3 className="text-lg font-semibold">{zone}</h3>
                        <p className="text-sm text-slate-400">Current Conditions</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Temperature</span>
                        <span className="text-white">{28 + i}°C</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Wind Speed</span>
                        <span className="text-white">{12 + i * 3} km/h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Wave Height</span>
                        <span className="text-white">{1 + i * 0.3} m</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'alerts' && (
            <motion.div key="alerts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="text-2xl font-bold mb-6">Safety Alerts</h2>
              {alerts.length > 0 ? (
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="bg-slate-900/50 backdrop-blur-xl rounded-xl border-l-4 border-red-500 p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">{alert.title?.en || alert.title}</h3>
                          <p className="text-slate-400">{alert.description?.en || alert.description}</p>
                        </div>
                        <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">{alert.severity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl border border-slate-800 p-12 text-center">
                  <Icons.CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <p className="text-slate-400">No active alerts at this time</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MaritimeServicesRedesign;
