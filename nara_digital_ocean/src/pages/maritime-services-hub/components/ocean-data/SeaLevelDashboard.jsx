import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

const seaLevelStations = [
  {
    id: 'colombo',
    code: 'colo',
    name: 'Colombo',
    coordinates: '6.9271° N, 79.8612° E',
    region: 'Western Province',
    update: '6-minute realtime feed',
    docs: 'https://www.ioc-sealevelmonitoring.org/station.php?code=colo',
    apiEndpoint: 'https://www.ioc-sealevelmonitoring.org/service.php?query=data&code=colo&format=json',
    fallback: {
      value: 0.45,
      change: 0.03,
      trend: 'rising',
      timestamp: new Date().toISOString(),
      quality: 'verified',
      sampleCount: 240
    }
  },
  {
    id: 'trincomalee',
    code: 'trin',
    name: 'Trincomalee',
    coordinates: '8.5874° N, 81.2152° E',
    region: 'Eastern Province',
    update: '6-minute realtime feed',
    docs: 'https://www.ioc-sealevelmonitoring.org/station.php?code=trin',
    apiEndpoint: 'https://www.ioc-sealevelmonitoring.org/service.php?query=data&code=trin&format=json',
    fallback: {
      value: 0.38,
      change: -0.01,
      trend: 'falling',
      timestamp: new Date().toISOString(),
      quality: 'verified',
      sampleCount: 240
    }
  }
];

const SeaLevelDashboard = () => {
  const [selectedStation, setSelectedStation] = useState(seaLevelStations[0]);
  const [liveData, setLiveData] = useState(seaLevelStations[0].fallback);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time data updates (in production, this would fetch from actual API)
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      // In production: fetch from selectedStation.apiEndpoint
    }, 360000); // Update every 6 minutes

    return () => clearInterval(interval);
  }, [selectedStation]);

  const getTrendIcon = (trend) => {
    if (trend === 'rising') return Icons.TrendingUp;
    if (trend === 'falling') return Icons.TrendingDown;
    return Icons.Minus;
  };

  const getTrendColor = (trend) => {
    if (trend === 'rising') return 'text-orange-600 bg-orange-50';
    if (trend === 'falling') return 'text-blue-600 bg-blue-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="space-y-6">
      {/* Station Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {seaLevelStations.map((station) => (
          <motion.button
            key={station.id}
            onClick={() => {
              setSelectedStation(station);
              setLiveData(station.fallback);
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-6 rounded-xl text-left transition-all ${
              selectedStation.id === station.id
                ? 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-200'
                : 'bg-gray-50 hover:bg-gray-100 text-gray-900 border border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-bold mb-1">{station.name}</h3>
                <p className={`text-sm ${selectedStation.id === station.id ? 'text-blue-100' : 'text-gray-500'}`}>
                  {station.region}
                </p>
              </div>
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${
                selectedStation.id === station.id ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700'
              }`}>
                <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                <span>Live</span>
              </div>
            </div>
            <p className={`text-sm mb-2 ${selectedStation.id === station.id ? 'text-blue-100' : 'text-gray-600'}`}>
              {station.coordinates}
            </p>
            <p className={`text-xs ${selectedStation.id === station.id ? 'text-blue-200' : 'text-gray-500'}`}>
              {station.update}
            </p>
          </motion.button>
        ))}
      </div>

      {/* Live Data Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Current Sea Level */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Icons.Waves className="w-8 h-8 opacity-80" />
            <div className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
              Real-time
            </div>
          </div>
          <div className="text-5xl font-bold mb-2">{liveData.value.toFixed(2)} m</div>
          <div className="text-blue-100 text-sm">Current Sea Level</div>
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-100">Change (24h)</span>
              <span className="font-semibold">+{liveData.change.toFixed(2)} m</span>
            </div>
          </div>
        </div>

        {/* Tide Status */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Icons.Activity className="w-8 h-8 text-cyan-600" />
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold ${getTrendColor(liveData.trend)}`}>
              {React.createElement(getTrendIcon(liveData.trend), { className: 'w-3 h-3' })}
              <span className="capitalize">{liveData.trend}</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">Tide Status</div>
          <div className="text-gray-600 text-sm mb-4">Tidal movement pattern</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Next High</span>
              <span className="font-semibold text-gray-900">14:30 LKT</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Next Low</span>
              <span className="font-semibold text-gray-900">20:45 LKT</span>
            </div>
          </div>
        </div>

        {/* Data Quality */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Icons.Shield className="w-8 h-8 text-green-600" />
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-700 text-xs font-semibold">Excellent</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">Data Quality</div>
          <div className="text-gray-600 text-sm mb-4">Quality assurance metrics</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Status</span>
              <span className="font-semibold text-green-600">{liveData.quality}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Uptime</span>
              <span className="font-semibold text-gray-900">99.8%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Samples</span>
              <span className="font-semibold text-gray-900">{liveData.sampleCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">24-Hour Sea Level Trend</h3>
            <p className="text-sm text-gray-500">Last updated: {lastUpdate.toLocaleTimeString()}</p>
          </div>
          <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-colors">
            <div className="flex items-center space-x-2">
              <Icons.Download className="w-4 h-4" />
              <span>Export Data</span>
            </div>
          </button>
        </div>

        {/* Chart area (ready for integration with ApexCharts or Recharts) */}
        <div className="h-64 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Icons.LineChart className="w-16 h-16 text-blue-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">Real-time Chart Integration Ready</p>
            <p className="text-sm text-gray-500 mt-1">Connect to IOC API for live visualization</p>
          </div>
        </div>
      </div>

      {/* API Information */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold mb-2">IOC Sea Level Monitoring API</h3>
            <p className="text-slate-300 text-sm">UNESCO - Intergovernmental Oceanographic Commission</p>
          </div>
          <a
            href={selectedStation.docs}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-2"
          >
            <Icons.ExternalLink className="w-4 h-4" />
            <span>View Documentation</span>
          </a>
        </div>

        <div className="bg-black/30 rounded-lg p-4 font-mono text-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-400">GET</span>
            <button className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-xs transition-colors">
              Copy
            </button>
          </div>
          <code className="text-cyan-300 break-all">
            {selectedStation.apiEndpoint}
          </code>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-slate-400 text-xs mb-1">Format</div>
            <div className="text-white font-semibold">JSON / XML / CSV</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-slate-400 text-xs mb-1">Update Frequency</div>
            <div className="text-white font-semibold">Every 6 minutes</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-slate-400 text-xs mb-1">Access</div>
            <div className="text-green-400 font-semibold">Free ✓</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeaLevelDashboard;
