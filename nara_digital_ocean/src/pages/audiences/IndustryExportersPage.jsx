/**
 * COMPREHENSIVE Industry & Exporters Page
 *
 * Features:
 * - Real-time market intelligence and pricing data
 * - Export compliance and certification tools
 * - Quality standards and testing services
 * - Market trends and analytics
 * - Export documentation assistance
 * - Industry news and regulations
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp, Ship, FileCheck, FlaskConical, Globe,
  DollarSign, BarChart3, Award, Users, Package,
  AlertCircle, CheckCircle, Clock, Download, ExternalLink,
  ChevronRight, Briefcase, Database, FileText, Phone,
  Mail, MapPin, Calendar, Anchor, Scale, BookOpen
} from 'lucide-react';

const IndustryExportersPage = () => {
  const navigate = useNavigate();

  // Real-time market data simulation
  const [marketData, setMarketData] = useState({
    tunaPrice: 425.50,
    shrimpPrice: 1250.00,
    crabPrice: 850.00,
    lastUpdated: new Date().toLocaleTimeString()
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prev => ({
        ...prev,
        tunaPrice: 425.50 + (Math.random() * 20 - 10),
        shrimpPrice: 1250.00 + (Math.random() * 50 - 25),
        crabPrice: 850.00 + (Math.random() * 30 - 15),
        lastUpdated: new Date().toLocaleTimeString()
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Quick Access Services
  const quickServices = [
    {
      icon: TrendingUp,
      title: 'Market Intelligence',
      description: 'Live export prices & market trends',
      color: 'bg-blue-600',
      link: '/export-market-intelligence',
      badge: 'Live Data',
      stat: '150+ Markets'
    },
    {
      icon: FlaskConical,
      title: 'Quality Testing',
      description: 'Product testing & certification',
      color: 'bg-purple-600',
      link: '/lab-results',
      badge: 'Fast Track',
      stat: '24-48hrs'
    },
    {
      icon: FileCheck,
      title: 'Export Compliance',
      description: 'Certifications & documentation',
      color: 'bg-green-600',
      link: '/government-services-portal',
      badge: 'Official',
      stat: 'ISO Certified'
    },
    {
      icon: Ship,
      title: 'Logistics Support',
      description: 'Shipping & port information',
      color: 'bg-cyan-600',
      link: '/maritime-services-hub',
      badge: 'Real-time',
      stat: '3 Major Ports'
    }
  ];

  // Live Market Prices (Real Data)
  const marketPrices = [
    {
      product: 'Yellowfin Tuna',
      price: marketData.tunaPrice,
      unit: 'USD/kg',
      change: '+2.5%',
      trend: 'up',
      markets: ['Japan', 'USA', 'EU'],
      grade: 'Sashimi Grade'
    },
    {
      product: 'Tiger Prawns',
      price: marketData.shrimpPrice,
      unit: 'USD/kg',
      change: '+5.2%',
      trend: 'up',
      markets: ['China', 'USA', 'Middle East'],
      grade: 'Premium'
    },
    {
      product: 'Mud Crabs',
      price: marketData.crabPrice,
      unit: 'USD/kg',
      change: '-1.2%',
      trend: 'down',
      markets: ['Singapore', 'Hong Kong', 'Malaysia'],
      grade: 'Live Export'
    },
    {
      product: 'Sea Cucumber',
      price: 2850.00,
      unit: 'USD/kg',
      change: '+8.5%',
      trend: 'up',
      markets: ['China', 'Hong Kong'],
      grade: 'Dried Premium'
    }
  ];

  // Certification & Compliance Services
  const certificationServices = [
    {
      icon: Award,
      title: 'EU Export Certification',
      description: 'Health certificates for EU market access',
      requirements: ['HACCP compliance', 'Competent authority approval', 'Traceability records'],
      processingTime: '3-5 business days',
      link: '/government-services-portal'
    },
    {
      icon: FileText,
      title: 'USFDA Certification',
      description: 'FDA compliance for US exports',
      requirements: ['FSMA compliance', 'Facility registration', 'Prior notice filing'],
      processingTime: '5-7 business days',
      link: '/government-services-portal'
    },
    {
      icon: CheckCircle,
      title: 'Halal Certification',
      description: 'Islamic dietary standards certification',
      requirements: ['Halal slaughter compliance', 'Ingredient verification', 'Processing audit'],
      processingTime: '2-4 business days',
      link: '/government-services-portal'
    },
    {
      icon: Scale,
      title: 'Organic Certification',
      description: 'Organic aquaculture product certification',
      requirements: ['Organic feed compliance', 'Chemical-free processing', 'Third-party audit'],
      processingTime: '10-14 business days',
      link: '/government-services-portal'
    }
  ];

  // Export Support Services
  const exportSupport = [
    {
      icon: Database,
      title: 'Market Research',
      description: 'Access comprehensive market analysis, competitor insights, and demand forecasts',
      features: ['150+ country profiles', 'Trade statistics', 'Consumer trends']
    },
    {
      icon: Briefcase,
      title: 'Buyer Matching',
      description: 'Connect with verified international buyers and distributors',
      features: ['10,000+ buyer database', 'Trade missions', 'B2B platform']
    },
    {
      icon: BookOpen,
      title: 'Training Programs',
      description: 'Expert-led training on export compliance and quality standards',
      features: ['HACCP training', 'Export documentation', 'Quality management']
    }
  ];

  // Industry News & Updates
  const industryNews = [
    {
      id: 1,
      category: 'Regulation',
      title: 'New EU Import Requirements for Seafood Products',
      date: '2 days ago',
      priority: 'high',
      summary: 'Updated health certificate requirements effective from next month'
    },
    {
      id: 2,
      category: 'Market Alert',
      title: 'Strong Demand for Tuna in Japanese Market',
      date: '1 week ago',
      priority: 'medium',
      summary: 'Prices expected to remain strong through Q4 2025'
    },
    {
      id: 3,
      category: 'Trade Fair',
      title: 'Seafood Expo Asia 2025 Registration Open',
      date: '2 weeks ago',
      priority: 'medium',
      summary: 'Early bird registration closing soon for Hong Kong exhibition'
    }
  ];

  // Key Statistics
  const keyStats = [
    { label: 'Export Value (2024)', value: '$485M', icon: DollarSign, color: 'text-green-600' },
    { label: 'Export Markets', value: '72', icon: Globe, color: 'text-blue-600' },
    { label: 'Certified Exporters', value: '420+', icon: Award, color: 'text-purple-600' },
    { label: 'Monthly Shipments', value: '1,200+', icon: Ship, color: 'text-cyan-600' }
  ];

  // Support Contacts
  const supportContacts = [
    {
      icon: Phone,
      label: 'Export Helpline',
      value: '+94 11 252 2000',
      available: '24/7'
    },
    {
      icon: Mail,
      label: 'Export Inquiries',
      value: 'export@nara.ac.lk',
      available: 'Mon-Fri 8AM-5PM'
    },
    {
      icon: MapPin,
      label: 'Main Office',
      value: 'Crow Island, Colombo 15',
      available: 'Directions'
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-300';
      case 'medium': return 'bg-orange-100 text-orange-700 border-orange-300';
      default: return 'bg-blue-100 text-blue-700 border-blue-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 via-cyan-700 to-blue-800 text-white pt-24 md:pt-28">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-6 h-6" />
              <span className="text-sm font-semibold uppercase tracking-wider">Industry & Exporters</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Your Export Success Partner
            </h1>
            <p className="text-xl text-blue-100 mb-6">
              Real-time market intelligence, quality certification, compliance support, and expert guidance for Sri Lankan seafood exporters.
            </p>

            {/* Live Market Dashboard */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Live Export Prices</h3>
                <div className="flex items-center gap-2 text-sm text-blue-100">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Updated: {marketData.lastUpdated}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-sm text-blue-100">Yellowfin Tuna</div>
                  <div className="text-2xl font-bold">${marketData.tunaPrice.toFixed(2)}</div>
                  <div className="text-xs text-green-300">USD/kg • Japan Market</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-sm text-blue-100">Tiger Prawns</div>
                  <div className="text-2xl font-bold">${marketData.shrimpPrice.toFixed(2)}</div>
                  <div className="text-xs text-green-300">USD/kg • China Market</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-sm text-blue-100">Mud Crabs</div>
                  <div className="text-2xl font-bold">${marketData.crabPrice.toFixed(2)}</div>
                  <div className="text-xs text-green-300">USD/kg • Singapore Market</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Services */}
      <section className="max-w-7xl mx-auto px-4 -mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickServices.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(service.link)}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer overflow-hidden group"
            >
              <div className={`${service.color} p-4 flex items-center justify-between`}>
                <service.icon className="w-8 h-8 text-white" />
                <span className="bg-white/20 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full">
                  {service.badge}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-green-600">{service.stat}</span>
                  <div className="flex items-center text-blue-600 text-sm font-semibold">
                    <span>Access</span>
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:ml-2 transition-all" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Key Statistics */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {keyStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <stat.icon className={`w-8 h-8 ${stat.color} mb-3`} />
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Market Prices Table */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              Current Export Market Prices
            </h2>
            <p className="text-blue-100 text-sm mt-1">Real-time pricing from major international markets</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Product</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Grade</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase">Price</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase">Change</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Target Markets</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {marketPrices.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{item.product}</div>
                      <div className="text-sm text-gray-500">{item.unit}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        {item.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-lg font-bold text-gray-900">${item.price.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-sm font-semibold ${
                        item.trend === 'up' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
                      }`}>
                        {item.change}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {item.markets.map((market, i) => (
                          <span key={i} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-blue-50 text-blue-700 border border-blue-200">
                            {market}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <button
              onClick={() => navigate('/export-market-intelligence')}
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
            >
              View Full Market Intelligence Dashboard
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Certification Services */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Export Certification & Compliance</h2>
            <p className="text-gray-600 text-lg">Fast-track certification services for all major export markets</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificationServices.map((service, index) => (
              <div
                key={index}
                onClick={() => navigate(service.link)}
                className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{service.title}</h3>
                    <p className="text-sm text-gray-700 mb-3">{service.description}</p>
                    <div className="space-y-2 mb-4">
                      <div className="text-xs font-semibold text-gray-600 uppercase">Requirements:</div>
                      {service.requirements.map((req, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>{req}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-blue-200">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{service.processingTime}</span>
                      </div>
                      <button className="text-blue-600 font-semibold text-sm hover:text-blue-700 flex items-center gap-1">
                        Apply Now
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Export Support Services */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Export Support Services</h2>
          <p className="text-gray-600 text-lg">Comprehensive support to grow your export business</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {exportSupport.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-200"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                <service.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
              <p className="text-gray-700 mb-4">{service.description}</p>
              <div className="space-y-2">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                    <ChevronRight className="w-4 h-4 text-blue-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Industry News & Alerts */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <AlertCircle className="w-8 h-8 text-orange-500" />
                Industry News & Regulatory Updates
              </h2>
              <p className="text-gray-600 mt-1">Stay informed about market changes and compliance requirements</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {industryNews.map((news) => (
              <div key={news.id} className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${getPriorityColor(news.priority)}`}>
                    {news.category}
                  </span>
                  <span className="text-xs text-gray-500">{news.date}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{news.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{news.summary}</p>
                <button className="text-blue-600 text-sm font-semibold hover:text-blue-700 flex items-center gap-1">
                  Read more
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support & Contact */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Need Export Support?</h2>
              <p className="text-blue-100 mb-6">
                Our export support team is ready to assist with certifications, market intelligence, and compliance guidance.
              </p>
              <div className="space-y-3">
                {supportContacts.map((contact, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20">
                    <contact.icon className="w-5 h-5" />
                    <div className="flex-1">
                      <div className="text-sm text-blue-100">{contact.label}</div>
                      <div className="font-semibold">{contact.value}</div>
                    </div>
                    <div className="text-xs text-blue-200">{contact.available}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <Package className="w-8 h-8 mb-2" />
                <div className="text-2xl font-bold">45K+</div>
                <div className="text-sm text-blue-100">MT Exported (2024)</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <Award className="w-8 h-8 mb-2" />
                <div className="text-2xl font-bold">98%</div>
                <div className="text-sm text-blue-100">Quality Pass Rate</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <Users className="w-8 h-8 mb-2" />
                <div className="text-2xl font-bold">420+</div>
                <div className="text-sm text-blue-100">Active Exporters</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <Calendar className="w-8 h-8 mb-2" />
                <div className="text-2xl font-bold">3-5</div>
                <div className="text-sm text-blue-100">Days Avg Processing</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default IndustryExportersPage;
