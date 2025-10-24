import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import * as Icons from 'lucide-react';

// Import sections
import HeroSection from './sections/HeroSection';
import OceanDataSection from './sections/OceanDataSection';
import ServicesSection from './sections/ServicesSection';
import ChartCatalogSection from './sections/ChartCatalogSection';
import QuickActionsSection from './sections/QuickActionsSection';
import StatsOverviewSection from './sections/StatsOverviewSection';

const NewMaritimeHub = () => {
  const { t, i18n } = useTranslation(['maritime', 'common']);
  const [activeSection, setActiveSection] = useState('overview');
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Helmet>
        <title>Maritime Services Hub | NARA Sri Lanka</title>
        <meta
          name="description"
          content="Comprehensive maritime services, ocean data monitoring, nautical charts, hydrographic surveys, and real-time sea level data for Sri Lanka's waters"
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-50">
        {/* Navigation Bar */}
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className={`sticky top-0 z-40 backdrop-blur-lg border-b transition-all duration-300 ${
            scrollPosition > 50
              ? 'bg-white/90 shadow-lg border-blue-200'
              : 'bg-white/70 border-transparent'
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Icons.Waves className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Maritime Services</h1>
                  <p className="text-xs text-gray-500">Ocean Intelligence & Navigation</p>
                </div>
              </div>

              <div className="hidden md:flex items-center space-x-1">
                {[
                  { id: 'overview', label: 'Overview', icon: Icons.Home },
                  { id: 'ocean-data', label: 'Ocean Data', icon: Icons.Waves },
                  { id: 'services', label: 'Services', icon: Icons.Ship },
                  { id: 'charts', label: 'Charts', icon: Icons.Map },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeSection === item.id
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <section id="overview">
          <HeroSection />
        </section>

        {/* Stats Overview */}
        <StatsOverviewSection />

        {/* Quick Actions */}
        <QuickActionsSection />

        {/* Ocean Data Section - NEW */}
        <section id="ocean-data">
          <OceanDataSection />
        </section>

        {/* Services Section */}
        <section id="services">
          <ServicesSection />
        </section>

        {/* Chart Catalog Section */}
        <section id="charts">
          <ChartCatalogSection />
        </section>

        {/* Footer CTA */}
        <section className="py-16 bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Icons.Anchor className="w-16 h-16 mx-auto mb-6 text-cyan-400" />
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Ready to Navigate Sri Lanka's Waters?
                </h2>
                <p className="text-xl text-blue-100 mb-8">
                  Access real-time ocean data, professional maritime services, and official nautical charts
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="px-8 py-4 bg-white text-blue-900 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl">
                    <div className="flex items-center justify-center space-x-2">
                      <Icons.Phone className="w-5 h-5" />
                      <span>Contact Maritime Division</span>
                    </div>
                  </button>
                  <button className="px-8 py-4 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all border-2 border-blue-500">
                    <div className="flex items-center justify-center space-x-2">
                      <Icons.Download className="w-5 h-5" />
                      <span>Download Resources</span>
                    </div>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default NewMaritimeHub;
