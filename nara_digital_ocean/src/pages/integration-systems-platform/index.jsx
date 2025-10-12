import React, { useState, useEffect } from 'react';
import { Database, Globe, Satellite, Settings, Activity, AlertCircle, CheckCircle, Clock, TrendingUp, Shield, Zap, Users } from 'lucide-react';
import GovernmentDatabaseSection from './components/GovernmentDatabaseSection';
import InternationalResearchSection from './components/InternationalResearchSection';
import SatelliteDataSection from './components/SatelliteDataSection';
import APIManagementSection from './components/APIManagementSection';
import { integrationMonitoringService } from '../../services/integrationService';

const IntegrationSystemsPlatform = () => {
  const [activeTab, setActiveTab] = useState('government');
  const [monitoringData, setMonitoringData] = useState([]);
  const [systemStats, setSystemStats] = useState({
    totalIntegrations: 0,
    activeConnections: 0,
    avgHealthScore: 0,
    alertsCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMonitoringData();
  }, []);

  const loadMonitoringData = async () => {
    try {
      const data = await integrationMonitoringService?.getDashboardData();
      setMonitoringData(data || []);
      
      // Calculate system stats
      const totalIntegrations = data?.length || 0;
      const activeConnections = data?.filter(item => item?.status === 'active')?.length || 0;
      const avgHealthScore = totalIntegrations > 0 
        ? Math.round(data?.reduce((sum, item) => sum + (item?.health_score || 0), 0) / totalIntegrations)
        : 0;
      const alertsCount = data?.filter(item => item?.alert_threshold_breached)?.length || 0;

      setSystemStats({
        totalIntegrations,
        activeConnections,
        avgHealthScore,
        alertsCount
      });
    } catch (error) {
      console.error('Error loading monitoring data:', error);
      setSystemStats({
        totalIntegrations: 0,
        activeConnections: 0,
        avgHealthScore: 0,
        alertsCount: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    {
      id: 'government',
      label: 'Government Database',
      icon: Database,
      description: 'API connectors for inter-governmental data sharing'
    },
    {
      id: 'research',
      label: 'Research Networks',
      icon: Globe,
      description: 'Global institution connections and collaborations'
    },
    {
      id: 'satellite',
      label: 'Satellite Data',
      icon: Satellite,
      description: 'Real-time satellite feeds and processing'
    },
    {
      id: 'api',
      label: 'API Management',
      icon: Settings,
      description: 'Third-party API gateway and monitoring'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'maintenance':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'government':
        return <GovernmentDatabaseSection />;
      case 'research':
        return <InternationalResearchSection />;
      case 'satellite':
        return <SatelliteDataSection />;
      case 'api':
        return <APIManagementSection />;
      default:
        return <GovernmentDatabaseSection />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Integration Systems Platform
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Centralized hub for managing external system connections through specialized integration modules
            </p>
            
            {/* System Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Integrations</p>
                    <p className="text-2xl font-bold">{systemStats?.totalIntegrations || 0}</p>
                  </div>
                  <Shield className="w-8 h-8 text-blue-200" />
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Active Connections</p>
                    <p className="text-2xl font-bold">{systemStats?.activeConnections || 0}</p>
                  </div>
                  <Zap className="w-8 h-8 text-green-300" />
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Avg Health Score</p>
                    <p className="text-2xl font-bold">{systemStats?.avgHealthScore || 0}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-yellow-300" />
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Active Alerts</p>
                    <p className="text-2xl font-bold">{systemStats?.alertsCount || 0}</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-red-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Integration Module Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8" aria-label="Tabs">
              {tabs?.map((tab) => {
                const IconComponent = tab?.icon;
                return (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`${
                      activeTab === tab?.id
                        ? 'border-blue-500 text-blue-600' :'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center space-x-2`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-semibold">{tab?.label}</div>
                      <div className="text-xs text-gray-500">{tab?.description}</div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* System Health Monitor */}
        {monitoringData?.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm mb-8 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Activity className="w-5 h-5 text-blue-600 mr-2" />
              System Health Monitor
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {monitoringData?.slice(0, 6)?.map((item) => (
                <div key={item?.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{item?.integration_name}</p>
                    <p className="text-sm text-gray-500 capitalize">{item?.integration_type?.replace('_', ' ')}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(item?.status)}
                    <span className="text-sm font-medium">{item?.health_score || 0}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm">
          {renderTabContent()}
        </div>

        {/* Integration Guidelines */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Security Best Practices
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• All API connections use encrypted protocols (HTTPS/TLS)</li>
              <li>• Role-based access controls for sensitive data streams</li>
              <li>• Automated compliance monitoring for data sharing agreements</li>
              <li>• Regular security audits and vulnerability assessments</li>
            </ul>
          </div>

          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Collaboration Features
            </h3>
            <ul className="space-y-2 text-sm text-green-800">
              <li>• Real-time data synchronization across institutions</li>
              <li>• Automated workflow triggers for joint research projects</li>
              <li>• Centralized document sharing with version control</li>
              <li>• Multi-language support for international partnerships</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationSystemsPlatform;