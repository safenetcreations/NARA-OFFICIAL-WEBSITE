import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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

const navIds = ['overview', 'ocean-data', 'services', 'charts'];

const NewMaritimeHub = () => {
  const { t } = useTranslation(['maritime', 'common']);
  const [activeSection, setActiveSection] = useState('overview');
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const meta = t('meta', { ns: 'maritime', returnObjects: true });
  const navContent = t('nav', { ns: 'maritime', returnObjects: true }) || {};
  const navItems = navContent.items || [];
  const ctaContent = t('cta', { ns: 'maritime', returnObjects: true }) || {};

  return (
    <>
      <Helmet>
        <title>{meta?.title || 'Maritime Services Hub | NARA Sri Lanka'}</title>
        <meta name="description" content={meta?.description || ''} />
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
                  <h1 className="text-lg font-bold text-gray-900">{navContent?.title}</h1>
                  <p className="text-xs text-gray-500">{navContent?.subtitle}</p>
                </div>
              </div>

              <div className="hidden md:flex items-center space-x-1">
                {navIds.map((itemId) => {
                  const item = navItems.find((entry) => entry.id === itemId);
                  const IconComponent =
                    itemId === 'overview'
                      ? Icons.Home
                      : itemId === 'ocean-data'
                      ? Icons.Waves
                      : itemId === 'services'
                      ? Icons.Ship
                      : Icons.Map;
                  return (
                  <button
                    key={itemId}
                    onClick={() => {
                      setActiveSection(itemId);
                      document.getElementById(itemId)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeSection === itemId
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <IconComponent className="w-4 h-4" />
                      <span>{item?.label}</span>
                    </div>
                  </button>
                  );
                })}
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
                  {ctaContent?.heading}
                </h2>
                <p className="text-xl text-blue-100 mb-8">
                  {ctaContent?.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="px-8 py-4 bg-white text-blue-900 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl">
                    <div className="flex items-center justify-center space-x-2">
                      <Icons.Phone className="w-5 h-5" />
                      <span>{ctaContent?.primary}</span>
                    </div>
                  </button>
                  <button className="px-8 py-4 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all border-2 border-blue-500">
                    <div className="flex items-center justify-center space-x-2">
                      <Icons.Download className="w-5 h-5" />
                      <span>{ctaContent?.secondary}</span>
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
