import React from 'react';
import Icon from '../../../components/AppIcon';

const SystemStatusIndicator = ({ systems }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'operational':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          icon: 'CheckCircle',
          label: 'Operational'
        };
      case 'degraded':
        return {
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          icon: 'AlertCircle',
          label: 'Degraded'
        };
      case 'outage':
        return {
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          icon: 'XCircle',
          label: 'Outage'
        };
      case 'maintenance':
        return {
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          icon: 'Settings',
          label: 'Maintenance'
        };
      default:
        return {
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          icon: 'HelpCircle',
          label: 'Unknown'
        };
    }
  };

  const overallStatus = systems?.every(s => s?.status === 'operational') 
    ? 'operational' 
    : systems?.some(s => s?.status === 'outage') 
    ? 'outage' :'degraded';

  const overallConfig = getStatusConfig(overallStatus);

  return (
    <div className="bg-white rounded-lg ocean-depth-shadow">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-headline font-bold text-text-primary">
            System Status
          </h2>
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-full ${overallConfig?.bgColor}`}>
            <Icon name={overallConfig?.icon} size={16} className={overallConfig?.color} />
            <span className={`font-cta-medium text-sm ${overallConfig?.color}`}>
              {overallConfig?.label}
            </span>
          </div>
        </div>
        <p className="text-sm font-body text-text-secondary mt-2">
          Real-time status of emergency response systems and communication networks
        </p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {systems?.map((system, index) => {
            const config = getStatusConfig(system?.status);
            
            return (
              <div key={index} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${config?.bgColor}`}>
                      <Icon name={system?.icon} size={20} className={config?.color} />
                    </div>
                    <div>
                      <h3 className="font-cta-medium text-sm text-text-primary">
                        {system?.name}
                      </h3>
                      <p className="text-xs font-body text-text-secondary mt-1">
                        {system?.description}
                      </p>
                    </div>
                  </div>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded ${config?.bgColor}`}>
                    <Icon name={config?.icon} size={12} className={config?.color} />
                    <span className={`text-xs font-cta ${config?.color}`}>
                      {config?.label}
                    </span>
                  </div>
                </div>
                {/* System Metrics */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="text-center p-2 bg-slate-50 rounded">
                    <div className="font-mono text-sm font-bold text-text-primary">
                      {system?.uptime}
                    </div>
                    <div className="text-xs font-body text-text-secondary">Uptime</div>
                  </div>
                  <div className="text-center p-2 bg-slate-50 rounded">
                    <div className="font-mono text-sm font-bold text-text-primary">
                      {system?.responseTime}
                    </div>
                    <div className="text-xs font-body text-text-secondary">Response</div>
                  </div>
                </div>
                {/* Last Check */}
                <div className="flex items-center justify-between text-xs font-mono text-text-secondary">
                  <span>Last check: {system?.lastCheck}</span>
                  {system?.nextMaintenance && (
                    <span>Next maintenance: {system?.nextMaintenance}</span>
                  )}
                </div>
                {/* Status Message */}
                {system?.statusMessage && (
                  <div className={`mt-3 p-2 rounded text-xs font-body ${config?.bgColor} ${config?.color}`}>
                    {system?.statusMessage}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* System Testing */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-cta-medium text-sm text-blue-900 mb-1">
                System Testing Schedule
              </h3>
              <p className="text-xs font-body text-blue-700">
                Regular testing ensures reliability during emergencies
              </p>
            </div>
            <div className="text-right">
              <div className="font-mono text-sm font-bold text-blue-900">
                Next Test: Dec 25, 2025
              </div>
              <div className="text-xs font-body text-blue-700">
                Monthly drill at 10:00 AM
              </div>
            </div>
          </div>
        </div>

        {/* Historical Performance */}
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-cta-medium text-sm text-green-900 mb-2">
            30-Day Performance Summary
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="font-mono text-lg font-bold text-green-800">99.8%</div>
              <div className="text-xs font-body text-green-700">Average Uptime</div>
            </div>
            <div>
              <div className="font-mono text-lg font-bold text-green-800">1.2s</div>
              <div className="text-xs font-body text-green-700">Avg Response</div>
            </div>
            <div>
              <div className="font-mono text-lg font-bold text-green-800">0</div>
              <div className="text-xs font-body text-green-700">Critical Issues</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemStatusIndicator;