import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Microscope,
  Ship,
  ShoppingBag,
  FlaskConical,
  Info,
  Database,
  GraduationCap,
  AlertTriangle,
  TrendingUp,
  Cloud,
  DollarSign,
  Waves,
  FileText,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle,
  ChevronRight
} from 'lucide-react';

const iconMap = {
  microscope: Microscope,
  ship: Ship,
  shopping: ShoppingBag,
  flask: FlaskConical,
  info: Info,
  database: Database,
  graduation: GraduationCap,
  alert: AlertTriangle,
  trending: TrendingUp,
  cloud: Cloud,
  dollar: DollarSign,
  waves: Waves,
  file: FileText
};

const UnifiedServicesHub = () => {
  const { t } = useTranslation('home');
  const [activeTab, setActiveTab] = useState('portals');
  const content = t('unifiedHub', { returnObjects: true });

  const portalLinks = [
    '/research-excellence-portal',
    '/government-services-portal',
    '/nara-digital-marketplace'
  ];

  return (
    <section className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-20 px-4 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-emerald-500/20 border border-purple-500/30 backdrop-blur-sm mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-semibold text-purple-200 uppercase tracking-wider">
              {content?.badge}
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-purple-200 font-space leading-tight">
            {content?.heading}
          </h2>
          
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {content?.subheading}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex gap-2 p-2 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
            {['portals', 'services', 'tools'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/50'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {content?.tabs?.[tab]}
              </button>
            ))}
          </div>
        </div>

        {/* Portals Tab */}
        {activeTab === 'portals' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            {content?.portals?.map((portal, idx) => {
              const Icon = iconMap[portal.icon] || Microscope;
              return (
                <Link
                  key={idx}
                  to={portalLinks[idx]}
                  className="group relative"
                >
                  <div className="relative h-full rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/90 to-slate-950/90 p-8 backdrop-blur-xl overflow-hidden transition-all duration-500 hover:border-transparent hover:scale-[1.02] hover:shadow-2xl">
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${portal.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                    
                    {/* Icon */}
                    <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${portal.gradient} p-0.5 mb-6`}>
                      <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    {/* Title */}
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-300 group-hover:to-purple-300 transition-all duration-300">
                        {portal.title}
                      </h3>
                      <p className={`text-sm font-semibold bg-gradient-to-r ${portal.gradient} bg-clip-text text-transparent`}>
                        {portal.subtitle}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-slate-400 mb-6 leading-relaxed">
                      {portal.description}
                    </p>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-slate-800">
                      {portal.metrics?.map((metric, i) => (
                        <div key={i} className="text-center">
                          <div className="text-2xl font-bold text-white mb-1">
                            {metric.value}
                          </div>
                          <div className="text-xs text-slate-500">
                            {metric.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Features */}
                    <div className="space-y-2 mb-6">
                      {portal.features?.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          <span className="text-sm text-slate-300">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="flex items-center justify-between text-cyan-400 font-semibold group-hover:text-cyan-300 transition-colors">
                      <span>{portal.cta}</span>
                      <ArrowRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            {content?.services?.map((service, idx) => {
              const Icon = iconMap[service.icon] || Database;
              const badgeValue = service.turnaround || service.availability || service.access || service.programs || service.response || service.updated;
              
              return (
                <Link
                  key={idx}
                  to={service.link}
                  className="group"
                >
                  <div className="relative h-full rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-6 transition-all duration-300 hover:border-cyan-500/50 hover:bg-slate-900/80 hover:shadow-lg hover:shadow-cyan-500/20">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-cyan-400" />
                      </div>
                      <Zap className="w-5 h-5 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <h4 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                      {service.title}
                    </h4>

                    <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                      {service.description}
                    </p>

                    {badgeValue && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {badgeValue}
                      </div>
                    )}

                    <div className="mt-4 flex items-center gap-2 text-cyan-400 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Learn more</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Quick Tools Tab */}
        {activeTab === 'tools' && (
          <div className="max-w-4xl mx-auto animate-fadeIn">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {content?.quickTools?.map((tool, idx) => {
                const Icon = iconMap[tool.icon] || FileText;
                return (
                  <Link
                    key={idx}
                    to={tool.link}
                    className="group"
                  >
                    <div className="relative rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-6 text-center transition-all duration-300 hover:border-purple-500/50 hover:bg-slate-900/80 hover:scale-105">
                      <div className="mx-auto w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Icon className="w-7 h-7 text-purple-400 group-hover:text-cyan-400 transition-colors" />
                      </div>
                      <div className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">
                        {tool.title}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="mt-8 text-center">
              <p className="text-slate-400 text-sm">
                <Sparkles className="inline w-4 h-4 mr-2 text-yellow-400" />
                Quick access tools for daily operations and real-time data
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </section>
  );
};

export default UnifiedServicesHub;
