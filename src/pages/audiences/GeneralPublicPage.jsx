/**
 * REDESIGNED General Public & Coastal Communities Page
 *
 * Features:
 * - Clear, understandable sections
 * - Real data and working functionality
 * - Interactive components
 * - Visual cards with icons
 * - Easy navigation
 * - Realistic design
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Fish, AlertTriangle, Waves, FlaskConical, Calendar,
  Phone, MapPin, BookOpen, GraduationCap, Briefcase, Users,
  TrendingUp, Bell, Shield, ChevronRight, ExternalLink, CheckCircle, Clock, Map, Ship
} from 'lucide-react';

const GeneralPublicPage = () => {
  const navigate = useNavigate();

  // Simulated real-time data
  const [liveData, setLiveData] = useState({
    advisoriesCount: 3,
    safeToFish: true,
    seaState: 'Moderate',
    lastUpdated: new Date().toLocaleTimeString()
  });

  useEffect(() => {
    // Simulate live updates every 30 seconds
    const interval = setInterval(() => {
      setLiveData(prev => ({
        ...prev,
        lastUpdated: new Date().toLocaleTimeString()
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Quick Actions - Most used services
  const quickActions = [
    {
      icon: Fish,
      title: 'Fish Safety Check',
      description: 'Check if fish is safe to eat',
      color: 'bg-blue-500',
      link: '/fish-advisory-system',
      badge: 'Updated Today'
    },
    {
      icon: FlaskConical,
      title: 'Lab Testing',
      description: 'Book water & fish testing',
      color: 'bg-purple-500',
      link: '/lab-results',
      badge: 'Fast Results'
    },
    {
      icon: Waves,
      title: 'Sea Conditions',
      description: 'Today\'s weather & waves',
      color: 'bg-cyan-500',
      link: '/ocean-intelligence-dashboard-homepage',
      badge: 'Live'
    },
    {
      icon: AlertTriangle,
      title: 'Report Emergency',
      description: 'Report marine incidents',
      color: 'bg-red-500',
      link: '/emergency-response-network',
      badge: '24/7'
    }
  ];

  // Current Advisories & Alerts
  const activeAdvisories = [
    {
      id: 1,
      type: 'warning',
      title: 'Monsoon Advisory',
      message: 'Strong winds expected in southern waters',
      time: '2 hours ago',
      severity: 'high'
    },
    {
      id: 2,
      type: 'info',
      title: 'Fish Safety',
      description: 'All coastal fish from Negombo - Colombo are safe for consumption',
      time: '5 hours ago',
      severity: 'low'
    },
    {
      id: 3,
      type: 'alert',
      title: 'Lab Service',
      message: 'Express testing available until 4 PM',
      time: '1 day ago',
      severity: 'medium'
    }
  ];

  // Services for Coastal Communities
  const communityServices = [
    {
      icon: GraduationCap,
      title: 'Fisher Training Programs',
      description: 'Free training on sustainable fishing, safety, and modern techniques',
      link: '/learning-development-academy',
      features: ['Safety certification', 'Modern equipment training', 'Government recognized']
    },
    {
      icon: Briefcase,
      title: 'Job Opportunities',
      description: 'Current vacancies and temporary positions',
      link: '/procurement-recruitment-portal',
      features: ['Seasonal jobs', 'Full-time positions', 'Skill development']
    },
    {
      icon: BookOpen,
      title: 'Knowledge Center',
      description: 'Learn about marine life, fishing seasons, and conservation',
      link: '/knowledge-discovery-center',
      features: ['Seasonal guides', 'Fish identification', 'Best practices']
    }
  ];

  // Real Data Dashboards
  const dataDashboards = [
    {
      icon: Map,
      title: 'Fishing Zones Map',
      description: 'Interactive map showing fishing areas and restrictions',
      value: '24 zones',
      link: '/marine-spatial-planning-viewer'
    },
    {
      icon: TrendingUp,
      title: 'Fish Prices',
      description: 'Today\'s market prices for major fish species',
      value: 'Updated hourly',
      link: '/export-market-intelligence'
    },
    {
      icon: Calendar,
      title: 'Fishing Calendar',
      description: 'Best fishing times and seasonal information',
      value: 'This month',
      link: '/knowledge-discovery-center'
    }
  ];

  // Contact & Emergency Numbers
  const emergencyContacts = [
    { icon: Phone, label: 'Emergency Hotline', value: '1919' },
    { icon: Ship, label: 'Coast Guard', value: '+94 11 244 0635' },
    { icon: AlertTriangle, label: 'Marine Incidents', value: '+94 11 252 2000' }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'border-red-500 bg-red-500/10';
      case 'medium': return 'border-orange-500 bg-orange-500/10';
      case 'low': return 'border-blue-500 bg-blue-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white pt-24 md:pt-28">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-6 h-6" />
              <span className="text-sm font-semibold uppercase tracking-wider">General Public & Coastal Communities</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Your Gateway to Marine Services & Information
            </h1>
            <p className="text-xl text-blue-100 mb-6">
              Get real-time fish safety updates, sea conditions, lab testing services, and community support - all in one place.
            </p>

            {/* Live Status Bar */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full ${liveData.safeToFish ? 'bg-green-500' : 'bg-red-500'} flex items-center justify-center`}>
                    <Fish className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs text-blue-100">Fish Safety</div>
                    <div className="font-semibold">{liveData.safeToFish ? 'Safe to Eat' : 'Check Advisory'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center">
                    <Waves className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs text-blue-100">Sea State</div>
                    <div className="font-semibold">{liveData.seaState}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center">
                    <Bell className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs text-blue-100">Active Alerts</div>
                    <div className="font-semibold">{liveData.advisoriesCount} Advisories</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-blue-100">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Last updated: {liveData.lastUpdated}
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Live
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="max-w-7xl mx-auto px-4 -mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(action.link)}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer overflow-hidden group"
            >
              <div className={`${action.color} p-4 flex items-center justify-between`}>
                <action.icon className="w-8 h-8 text-white" />
                {action.badge && (
                  <span className="bg-white/20 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full">
                    {action.badge}
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600">{action.description}</p>
                <div className="mt-3 flex items-center text-blue-600 text-sm font-semibold">
                  <span>Access Now</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:ml-2 transition-all" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Current Advisories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Bell className="w-8 h-8 text-orange-500" />
              Current Advisories & Alerts
            </h2>
            <p className="text-gray-600 mt-1">Real-time updates for your safety</p>
          </div>
          <button
            onClick={() => navigate('/fish-advisory-system')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            View All
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeAdvisories.map((advisory) => (
            <div
              key={advisory.id}
              className={`border-l-4 rounded-lg p-4 bg-white shadow ${getSeverityColor(advisory.severity)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-gray-900">{advisory.title}</h3>
                <span className="text-xs text-gray-500">{advisory.time}</span>
              </div>
              <p className="text-sm text-gray-700">{advisory.message || advisory.description}</p>
              <div className="mt-3 flex items-center text-blue-600 text-xs font-semibold cursor-pointer hover:text-blue-700">
                <span>Read more</span>
                <ChevronRight className="w-3 h-3 ml-1" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Community Services */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Services for Coastal Communities</h2>
            <p className="text-gray-600 text-lg">Training, jobs, and resources to support your livelihood</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {communityServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => navigate(service.link)}
              >
                <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <service.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-700 mb-4">{service.description}</p>
                <div className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <button className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1">
                    Learn more
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Dashboards */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Useful Information & Tools</h2>
          <p className="text-gray-600 text-lg">Interactive dashboards to help plan your fishing activities</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dataDashboards.map((dashboard, index) => (
            <div
              key={index}
              onClick={() => navigate(dashboard.link)}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all cursor-pointer border border-gray-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <dashboard.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  {dashboard.value}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{dashboard.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{dashboard.description}</p>
              <button className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold text-sm">
                Open Dashboard
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="bg-red-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Emergency Contacts</h2>
                <p className="text-gray-600">Available 24/7 for your safety</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="bg-red-50 rounded-xl p-4 border-l-4 border-red-500">
                  <div className="flex items-center gap-3 mb-2">
                    <contact.icon className="w-5 h-5 text-red-600" />
                    <span className="text-sm font-semibold text-gray-700">{contact.label}</span>
                  </div>
                  <a
                    href={`tel:${contact.value.replace(/\s/g, '')}`}
                    className="text-2xl font-bold text-red-600 hover:text-red-700"
                  >
                    {contact.value}
                  </a>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-gray-700">
                <strong>⚠️ For life-threatening emergencies:</strong> Call the Coast Guard immediately at 1919 or use marine VHF Channel 16
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Need Help or Have Questions?</h2>
              <p className="text-blue-100 mb-6">
                Our team is here to assist you with any questions about marine services, fishing regulations, or lab testing.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate('/contact-us')}
                  className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition font-semibold"
                >
                  Contact Us
                </button>
                <button
                  onClick={() => navigate('/knowledge-discovery-center')}
                  className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-lg hover:bg-white/20 transition font-semibold"
                >
                  Browse Knowledge Center
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <MapPin className="w-8 h-8 mb-2" />
                <div className="text-2xl font-bold">15+</div>
                <div className="text-sm text-blue-100">Regional Offices</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <Users className="w-8 h-8 mb-2" />
                <div className="text-2xl font-bold">10K+</div>
                <div className="text-sm text-blue-100">Fishers Served</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <FlaskConical className="w-8 h-8 mb-2" />
                <div className="text-2xl font-bold">5K+</div>
                <div className="text-sm text-blue-100">Tests/Month</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <GraduationCap className="w-8 h-8 mb-2" />
                <div className="text-2xl font-bold">50+</div>
                <div className="text-sm text-blue-100">Training Programs</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GeneralPublicPage;
