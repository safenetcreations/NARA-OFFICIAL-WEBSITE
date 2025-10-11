import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';

const MaritimeServicesRedesign = () => {
  const [activeService, setActiveService] = useState('tracking');
  const [selectedVessel, setSelectedVessel] = useState(null);
  const [mapView, setMapView] = useState('satellite');
  const { scrollY } = useScroll();
  
  // Parallax effects
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Simulated vessel data
  const vessels = [
    {
      id: 'NARA-001',
      name: 'RV Ocean Explorer',
      type: 'Research Vessel',
      status: 'Active',
      speed: '12.5 knots',
      heading: '045°',
      position: { lat: 6.9271, lon: 79.8612 },
      crew: 24,
      mission: 'Deep Sea Survey',
      eta: '2024-09-22 14:30',
      flag: '🇱🇰',
      lastUpdate: '2 min ago'
    },
    {
      id: 'FISH-245',
      name: 'MV Blue Horizon',
      type: 'Fishing Vessel',
      status: 'In Port',
      speed: '0 knots',
      heading: '180°',
      position: { lat: 7.2906, lon: 79.8428 },
      crew: 12,
      mission: 'Maintenance',
      eta: 'Docked',
      flag: '🇱🇰',
      lastUpdate: '5 min ago'
    },
    {
      id: 'CARGO-789',
      name: 'MV Sri Lanka Pride',
      type: 'Cargo Ship',
      status: 'Departing',
      speed: '8.2 knots',
      heading: '270°',
      position: { lat: 6.9419, lon: 79.8433 },
      crew: 35,
      mission: 'Export Transit',
      eta: '2024-09-23 06:00',
      flag: '🇱🇰',
      lastUpdate: '1 min ago'
    }
  ];

  const ports = [
    {
      name: 'Colombo Port',
      code: 'LKCMB',
      vessels: 47,
      capacity: '85%',
      weather: 'Clear',
      temp: '28°C',
      wind: '12 km/h',
      status: 'Operational',
      icon: Icons.Anchor
    },
    {
      name: 'Hambantota Port',
      code: 'LKHAM',
      vessels: 12,
      capacity: '45%',
      weather: 'Partly Cloudy',
      temp: '29°C',
      wind: '15 km/h',
      status: 'Operational',
      icon: Icons.Ship
    },
    {
      name: 'Galle Port',
      code: 'LKGAL',
      vessels: 8,
      capacity: '62%',
      weather: 'Light Rain',
      temp: '27°C',
      wind: '18 km/h',
      status: 'Limited',
      icon: Icons.Anchor
    }
  ];

  const maritimeMetrics = [
    { label: 'Vessels Tracked', value: '127', change: '+12', icon: Icons.Ship, color: 'text-cyan-400' },
    { label: 'Port Operations', value: '24/7', change: 'Active', icon: Icons.Anchor, color: 'text-green-400' },
    { label: 'Nautical Miles', value: '15.8K', change: '+523', icon: Icons.Navigation, color: 'text-blue-400' },
    { label: 'Safety Score', value: '98%', change: '+2%', icon: Icons.Shield, color: 'text-purple-400' }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section with Map Background */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Animated Ocean Map Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-blue-900/50 to-black"></div>
          
          {/* Animated Radar Circles */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 2, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute w-96 h-96 border-2 border-cyan-500/30 rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 2, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              className="absolute w-96 h-96 border-2 border-blue-500/30 rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 2, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, delay: 2 }}
              className="absolute w-96 h-96 border-2 border-purple-500/30 rounded-full"
            />
          </div>

          {/* Animated Grid */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{ 
              backgroundImage: 'linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }}
          />
          
          {/* Moving Ships */}
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, 100, 0],
                y: [0, -50, 0],
              }}
              transition={{
                duration: 20 + Math.random() * 10,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            >
              <Icons.Ship className="w-4 h-4 text-cyan-400/40" />
            </motion.div>
          ))}
        </div>

        {/* Hero Content */}
        <motion.div 
          style={{ opacity }}
          className="relative z-10 text-center px-4 max-w-6xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, type: "spring" }}
            className="inline-block mb-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 p-1 rounded-2xl">
                <div className="bg-black/80 backdrop-blur-xl px-6 py-3 rounded-2xl">
                  <span className="text-cyan-400 font-space text-sm tracking-widest uppercase flex items-center gap-2">
                    <Icons.Radar className="w-4 h-4 animate-spin-slow" />
                    Maritime Operations
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-bold font-space mb-4"
          >
            <span className="bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-400 bg-clip-text text-transparent">
              Maritime Services
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-8"
          >
            Real-time vessel tracking, port operations, and maritime intelligence for Sri Lankan waters
          </motion.p>

          {/* Live Metrics */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {maritimeMetrics.map((metric, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
                <metric.icon className={`w-5 h-5 ${metric.color} mb-2`} />
                <div className="text-2xl font-bold text-white font-space">{metric.value}</div>
                <div className="text-xs text-gray-400">{metric.label}</div>
                <div className={`text-xs ${metric.change.startsWith('+') ? 'text-green-400' : 'text-cyan-400'}`}>
                  {metric.change}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Service Tabs */}
      <section className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'tracking', label: 'Vessel Tracking', icon: Icons.Radar },
              { id: 'ports', label: 'Port Information', icon: Icons.Anchor },
              { id: 'weather', label: 'Weather & Navigation', icon: Icons.CloudRain },
              { id: 'safety', label: 'Safety Alerts', icon: Icons.AlertTriangle },
              { id: 'permits', label: 'Permits & Licensing', icon: Icons.FileCheck }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveService(tab.id)}
                className={`py-4 px-2 flex items-center gap-2 font-medium transition-all duration-300 border-b-2 whitespace-nowrap ${
                  activeService === tab.id
                    ? 'text-cyan-400 border-cyan-400'
                    : 'text-gray-400 border-transparent hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Service Content */}
      <AnimatePresence mode="wait">
        {/* Vessel Tracking Section */}
        {activeService === 'tracking' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="py-20 px-4"
          >
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Map View */}
                <div className="lg:col-span-2">
                  <div className="bg-gradient-to-br from-blue-950/50 to-black rounded-2xl p-6 border border-cyan-500/30 relative h-[600px]">
                    {/* Map Controls */}
                    <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                      <button className="p-2 bg-black/80 backdrop-blur rounded-lg border border-white/20 hover:border-cyan-500 transition-all">
                        <Icons.ZoomIn className="w-5 h-5 text-white" />
                      </button>
                      <button className="p-2 bg-black/80 backdrop-blur rounded-lg border border-white/20 hover:border-cyan-500 transition-all">
                        <Icons.ZoomOut className="w-5 h-5 text-white" />
                      </button>
                      <button className="p-2 bg-black/80 backdrop-blur rounded-lg border border-white/20 hover:border-cyan-500 transition-all">
                        <Icons.Maximize2 className="w-5 h-5 text-white" />
                      </button>
                    </div>

                    {/* Map View Selector */}
                    <div className="absolute top-4 left-4 z-20">
                      <select 
                        value={mapView}
                        onChange={(e) => setMapView(e.target.value)}
                        className="px-4 py-2 bg-black/80 backdrop-blur rounded-lg border border-white/20 text-white text-sm focus:outline-none focus:border-cyan-500"
                      >
                        <option value="satellite">Satellite</option>
                        <option value="radar">Radar</option>
                        <option value="depth">Ocean Depth</option>
                      </select>
                    </div>

                    {/* Simulated Map */}
                    <div className="relative w-full h-full rounded-lg overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-cyan-900/20">
                        {/* Grid Overlay */}
                        <div 
                          className="absolute inset-0 opacity-30"
                          style={{ 
                            backgroundImage: 'linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)',
                            backgroundSize: '30px 30px'
                          }}
                        />
                        
                        {/* Vessel Markers */}
                        {vessels.map((vessel, index) => (
                          <motion.div
                            key={vessel.id}
                            className="absolute cursor-pointer"
                            style={{
                              left: `${20 + index * 25}%`,
                              top: `${30 + index * 15}%`,
                            }}
                            whileHover={{ scale: 1.2 }}
                            onClick={() => setSelectedVessel(vessel)}
                          >
                            <div className="relative">
                              <div className={`absolute inset-0 ${
                                vessel.status === 'Active' ? 'bg-green-500' : 
                                vessel.status === 'In Port' ? 'bg-yellow-500' : 
                                'bg-blue-500'
                              } rounded-full blur-xl opacity-50 animate-pulse`}></div>
                              <div className={`relative p-2 rounded-full ${
                                vessel.status === 'Active' ? 'bg-green-500' : 
                                vessel.status === 'In Port' ? 'bg-yellow-500' : 
                                'bg-blue-500'
                              }`}>
                                <Icons.Ship className="w-4 h-4 text-white" />
                              </div>
                            </div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-black/80 backdrop-blur rounded text-xs text-white whitespace-nowrap">
                              {vessel.name}
                            </div>
                          </motion.div>
                        ))}

                        {/* Compass */}
                        <div className="absolute bottom-4 left-4 w-20 h-20">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                            className="w-full h-full"
                          >
                            <Icons.Compass className="w-full h-full text-cyan-400/50" />
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vessel List */}
                <div className="space-y-4">
                  <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Icons.List className="w-5 h-5 text-cyan-400" />
                      Active Vessels
                    </h3>
                    <div className="space-y-3 max-h-[500px] overflow-y-auto">
                      {vessels.map((vessel) => (
                        <motion.div
                          key={vessel.id}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => setSelectedVessel(vessel)}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            selectedVessel?.id === vessel.id 
                              ? 'bg-cyan-500/20 border-cyan-500' 
                              : 'bg-white/5 border-white/10 hover:border-cyan-500/50'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="font-semibold text-white flex items-center gap-2">
                                {vessel.flag} {vessel.name}
                              </div>
                              <div className="text-xs text-gray-400">{vessel.id}</div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              vessel.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                              vessel.status === 'In Port' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-blue-500/20 text-blue-400'
                            }`}>
                              {vessel.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                            <div>
                              <Icons.Navigation className="inline w-3 h-3 mr-1" />
                              {vessel.speed}
                            </div>
                            <div>
                              <Icons.Compass className="inline w-3 h-3 mr-1" />
                              {vessel.heading}
                            </div>
                            <div>
                              <Icons.Users className="inline w-3 h-3 mr-1" />
                              {vessel.crew} crew
                            </div>
                            <div>
                              <Icons.Clock className="inline w-3 h-3 mr-1" />
                              {vessel.lastUpdate}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Selected Vessel Details */}
                  {selectedVessel && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-xl rounded-xl p-4 border border-cyan-500/30"
                    >
                      <h4 className="font-bold text-white mb-3">Vessel Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Type</span>
                          <span className="text-white">{selectedVessel.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Mission</span>
                          <span className="text-cyan-400">{selectedVessel.mission}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Position</span>
                          <span className="text-white">
                            {selectedVessel.position.lat}°N, {selectedVessel.position.lon}°E
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">ETA</span>
                          <span className="text-white">{selectedVessel.eta}</span>
                        </div>
                      </div>
                      <button className="w-full mt-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-white font-medium hover:from-cyan-600 hover:to-blue-700 transition-all">
                        Track Vessel
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Port Information Section */}
        {activeService === 'ports' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="py-20 px-4"
          >
            <div className="max-w-7xl mx-auto">
              <div className="grid md:grid-cols-3 gap-6">
                {ports.map((port, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -10 }}
                    className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-cyan-500 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{port.name}</h3>
                        <p className="text-sm text-gray-400">{port.code}</p>
                      </div>
                      <div className={`p-3 rounded-xl ${
                        port.status === 'Operational' ? 'bg-green-500/20' : 'bg-yellow-500/20'
                      }`}>
                        <port.icon className={`w-6 h-6 ${
                          port.status === 'Operational' ? 'text-green-400' : 'text-yellow-400'
                        }`} />
                      </div>
                    </div>

                    {/* Port Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-black/30 rounded-lg p-3">
                        <div className="text-2xl font-bold text-cyan-400">{port.vessels}</div>
                        <div className="text-xs text-gray-400">Active Vessels</div>
                      </div>
                      <div className="bg-black/30 rounded-lg p-3">
                        <div className="text-2xl font-bold text-purple-400">{port.capacity}</div>
                        <div className="text-xs text-gray-400">Capacity</div>
                      </div>
                    </div>

                    {/* Weather Info */}
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Weather</span>
                        <span className="text-white">{port.weather}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Temperature</span>
                        <span className="text-white">{port.temp}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Wind Speed</span>
                        <span className="text-white">{port.wind}</span>
                      </div>
                    </div>

                    <button className="w-full py-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg text-white font-medium hover:from-blue-700 hover:to-cyan-700 transition-all">
                      View Port Details
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Real-time Maritime Data Stream */}
      <section className="py-20 px-4 bg-gradient-to-b from-black via-blue-950/10 to-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-space mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                Real-time Maritime Intelligence
              </span>
            </h2>
            <p className="text-xl text-gray-400">Advanced monitoring and analytics for maritime operations</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Icons.Satellite, title: "Satellite Tracking", value: "24/7", color: "from-purple-500 to-pink-500" },
              { icon: Icons.Radio, title: "AIS Coverage", value: "100%", color: "from-blue-500 to-cyan-500" },
              { icon: Icons.Shield, title: "Security Alerts", value: "Active", color: "from-green-500 to-teal-500" },
              { icon: Icons.Wifi, title: "Data Streams", value: "Live", color: "from-orange-500 to-red-500" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: index * 0.1, type: "spring" }}
                className="text-center"
              >
                <div className={`inline-flex p-6 rounded-2xl bg-gradient-to-r ${feature.color} mb-4`}>
                  <feature.icon className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <div className="text-3xl font-bold text-cyan-400 font-space">{feature.value}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MaritimeServicesRedesign;