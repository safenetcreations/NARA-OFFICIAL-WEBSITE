/**
 * Marine Spatial Planning Viewer
 *
 * Interactive public viewer for marine spatial planning zones
 * Features:
 * - Interactive map with zone visualization
 * - Zone filtering by type and status
 * - Zone details and information
 * - Conflict visualization
 * - Public proposal submission
 * - Stakeholder feedback
 */

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, LayersControl, Circle } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Map,
  Layers,
  Filter,
  AlertTriangle,
  Info,
  FileText,
  MessageSquare,
  Ship,
  Anchor,
  Fish,
  Shield,
  Zap,
  Factory,
  Home,
  Search,
  Download
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';

import {
  spatialZoneService,
  conflictDetectionService,
  planningProposalService,
  mspExportService
} from '../../services/marineSpatialPlanningService';

const MarineSpatialPlanningViewer = () => {
  const [activeView, setActiveView] = useState('map');
  const [zones, setZones] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [filters, setFilters] = useState({
    zoneType: 'all',
    status: 'all',
    showConflicts: false
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [proposalForm, setProposalForm] = useState({
    proposalName: '',
    proposerName: '',
    proposerEmail: '',
    proposalType: '',
    description: ''
  });

  // Zone type configurations
  const zoneTypeConfig = {
    fishing_zone: { color: '#3b82f6', icon: Fish, label: 'Fishing Zone' },
    protected_area: { color: '#10b981', icon: Shield, label: 'Protected Area' },
    shipping_lane: { color: '#8b5cf6', icon: Ship, label: 'Shipping Lane' },
    anchorage: { color: '#f59e0b', icon: Anchor, label: 'Anchorage' },
    military_zone: { color: '#ef4444', icon: Zap, label: 'Military Zone' },
    oil_exploration: { color: '#f97316', icon: Factory, label: 'Oil Exploration' },
    aquaculture: { color: '#14b8a6', icon: Home, label: 'Aquaculture' }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: zonesData } = await spatialZoneService.getAll();
    const { data: conflictsData } = await conflictDetectionService.getAllConflicts();

    if (zonesData) setZones(zonesData);
    if (conflictsData) setConflicts(conflictsData);

    setLoading(false);
  };

  const filteredZones = zones.filter(zone => {
    const matchesType = filters.zoneType === 'all' || zone.zoneType === filters.zoneType;
    const matchesStatus = filters.status === 'all' || zone.status === filters.status;
    const matchesSearch = zone.zoneName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          zone.description?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesType && matchesStatus && matchesSearch;
  });

  const handleSubmitProposal = async (e) => {
    e.preventDefault();

    const proposalData = {
      ...proposalForm,
      submittedBy: proposalForm.proposerName,
      submitterEmail: proposalForm.proposerEmail
    };

    const { data, error } = await planningProposalService.submit(proposalData);

    if (error) {
      alert('Error submitting proposal: ' + error);
      return;
    }

    alert('Proposal submitted successfully! Proposal ID: ' + data.proposalId);
    setProposalForm({
      proposalName: '',
      proposerName: '',
      proposerEmail: '',
      proposalType: '',
      description: ''
    });
  };

  const handleExport = async (format) => {
    let result;
    if (format === 'geojson') {
      result = await mspExportService.exportGeoJSON(filters);
    } else if (format === 'kml') {
      result = await mspExportService.exportKML(filters);
    }

    if (result.data) {
      const blob = new Blob([format === 'geojson' ? result.data.geojson : result.data.kml], {
        type: format === 'geojson' ? 'application/json' : 'application/vnd.google-earth.kml+xml'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.data.filename;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const getZoneColor = (zoneType) => {
    return zoneTypeConfig[zoneType]?.color || '#64748b';
  };

  const getZoneIcon = (zoneType) => {
    const IconComponent = zoneTypeConfig[zoneType]?.icon || Map;
    return IconComponent;
  };

  const getStatusColor = (status) => {
    const colors = {
      proposed: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // ========== RENDER FUNCTIONS ==========

  const renderDashboard = () => {
    const totalZones = zones.length;
    const activeZones = zones.filter(z => z.status === 'active').length;
    const totalAreaKm2 = zones.reduce((sum, z) => sum + (z.areaKm2 || 0), 0);
    const conflictZones = zones.filter(z => z.hasConflicts).length;

    const zoneTypeBreakdown = {};
    zones.forEach(zone => {
      zoneTypeBreakdown[zone.zoneType] = (zoneTypeBreakdown[zone.zoneType] || 0) + 1;
    });

    return (
      <div className="p-8 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">
              Marine Spatial Planning Viewer
            </h1>
            <p className="text-xl text-blue-200">
              Explore Sri Lanka's Marine Spatial Planning Zones
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-between mb-4">
                <Map className="w-8 h-8 text-blue-400" />
                <span className="text-3xl font-bold text-white">{totalZones}</span>
              </div>
              <p className="text-blue-200">Total Zones</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-between mb-4">
                <Layers className="w-8 h-8 text-green-400" />
                <span className="text-3xl font-bold text-white">{activeZones}</span>
              </div>
              <p className="text-blue-200">Active Zones</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-between mb-4">
                <Map className="w-8 h-8 text-purple-400" />
                <span className="text-3xl font-bold text-white">{Math.round(totalAreaKm2)}</span>
              </div>
              <p className="text-blue-200">Total Area (km²)</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-between mb-4">
                <AlertTriangle className="w-8 h-8 text-yellow-400" />
                <span className="text-3xl font-bold text-white">{conflictZones}</span>
              </div>
              <p className="text-blue-200">Zones with Conflicts</p>
            </motion.div>
          </div>

          {/* Zone Type Breakdown */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Layers className="w-6 h-6 text-blue-400" />
              Zone Type Distribution
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(zoneTypeBreakdown).map(([type, count]) => {
                const IconComponent = getZoneIcon(type);
                const config = zoneTypeConfig[type];

                return (
                  <div key={type} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center gap-3 mb-2">
                      <IconComponent className="w-5 h-5" style={{ color: config?.color }} />
                      <span className="text-white font-semibold">{count}</span>
                    </div>
                    <p className="text-sm text-blue-200">{config?.label || type}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  const renderInteractiveMap = () => {
    return (
      <div className="h-screen bg-slate-900">
        {/* Map Controls */}
        <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur-lg rounded-lg p-4 shadow-xl max-w-md">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            Filters
          </h3>

          {/* Search */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Zones</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Zone Type Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Zone Type</label>
            <select
              value={filters.zoneType}
              onChange={(e) => setFilters({ ...filters, zoneType: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              {Object.entries(zoneTypeConfig).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="proposed">Proposed</option>
              <option value="approved">Approved</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Show Conflicts Toggle */}
          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.showConflicts}
                onChange={(e) => setFilters({ ...filters, showConflicts: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Show Conflicts Only</span>
            </label>
          </div>

          {/* Export Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Export Data</label>
            <div className="flex gap-2">
              <button
                onClick={() => handleExport('geojson')}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                GeoJSON
              </button>
              <button
                onClick={() => handleExport('kml')}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                KML
              </button>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <MapContainer
          center={[7.8731, 80.7718]}
          zoom={8}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          {/* Render Zones */}
          {filteredZones
            .filter(zone => !filters.showConflicts || zone.hasConflicts)
            .map((zone) => {
              if (!zone.boundaries || zone.boundaries.length === 0) return null;

              const positions = zone.boundaries.map(gp => [gp.latitude, gp.longitude]);
              const color = getZoneColor(zone.zoneType);

              return (
                <Polygon
                  key={zone.id}
                  positions={positions}
                  pathOptions={{
                    color: color,
                    fillColor: color,
                    fillOpacity: zone.hasConflicts ? 0.6 : 0.3,
                    weight: zone.hasConflicts ? 3 : 2
                  }}
                  eventHandlers={{
                    click: () => setSelectedZone(zone)
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold text-lg mb-2">{zone.zoneName}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Type:</strong> {zoneTypeConfig[zone.zoneType]?.label || zone.zoneType}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Status:</strong> {zone.status}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Area:</strong> {Math.round(zone.areaKm2)} km²
                      </p>
                      {zone.hasConflicts && (
                        <p className="text-sm text-red-600 font-semibold flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4" />
                          {zone.conflictCount} Conflict(s)
                        </p>
                      )}
                      <button
                        onClick={() => {
                          setSelectedZone(zone);
                          setActiveView('zones');
                        }}
                        className="mt-2 w-full px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        View Details
                      </button>
                    </div>
                  </Popup>
                </Polygon>
              );
            })}

          {/* Render Conflict Markers */}
          {filters.showConflicts && conflicts.map((conflict, idx) => {
            const zone1 = zones.find(z => z.id === conflict.zoneId1);
            if (!zone1 || !zone1.boundaries || zone1.boundaries.length === 0) return null;

            const centerLat = zone1.boundaries.reduce((sum, gp) => sum + gp.latitude, 0) / zone1.boundaries.length;
            const centerLng = zone1.boundaries.reduce((sum, gp) => sum + gp.longitude, 0) / zone1.boundaries.length;

            return (
              <Circle
                key={`conflict-${idx}`}
                center={[centerLat, centerLng]}
                radius={1000}
                pathOptions={{
                  color: conflict.severity === 'high' ? '#ef4444' : '#f59e0b',
                  fillColor: conflict.severity === 'high' ? '#ef4444' : '#f59e0b',
                  fillOpacity: 0.5
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold text-red-600 flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5" />
                      Zone Conflict
                    </h3>
                    <p className="text-sm mb-1"><strong>Zone 1:</strong> {conflict.zoneName1}</p>
                    <p className="text-sm mb-1"><strong>Zone 2:</strong> {conflict.zoneName2}</p>
                    <p className="text-sm mb-1"><strong>Severity:</strong> {conflict.severity}</p>
                    <p className="text-sm"><strong>Overlap:</strong> {conflict.overlapPercentage}%</p>
                  </div>
                </Popup>
              </Circle>
            );
          })}
        </MapContainer>
      </div>
    );
  };

  const renderZoneBrowser = () => {
    return (
      <div className="p-8 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-8 flex items-center gap-3">
            <Layers className="w-8 h-8 text-blue-400" />
            Browse Planning Zones
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredZones.map((zone) => {
              const IconComponent = getZoneIcon(zone.zoneType);
              const config = zoneTypeConfig[zone.zoneType];

              return (
                <motion.div
                  key={zone.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 cursor-pointer"
                  onClick={() => setSelectedZone(zone)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: config?.color + '33' }}
                      >
                        <IconComponent className="w-6 h-6" style={{ color: config?.color }} />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{zone.zoneName}</h3>
                        <p className="text-sm text-blue-200">{config?.label}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(zone.status)}`}>
                      {zone.status}
                    </span>
                  </div>

                  <p className="text-sm text-blue-200 mb-4 line-clamp-2">
                    {zone.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-blue-300 font-semibold">Area</p>
                      <p className="text-white">{Math.round(zone.areaKm2)} km²</p>
                    </div>
                    <div>
                      <p className="text-blue-300 font-semibold">Depth Range</p>
                      <p className="text-white">{zone.depthRange || 'N/A'}</p>
                    </div>
                  </div>

                  {zone.hasConflicts && (
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <p className="text-sm text-yellow-400 font-semibold flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        {zone.conflictCount} Conflict(s) Detected
                      </p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Zone Details Modal */}
        <AnimatePresence>
          {selectedZone && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedZone(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedZone.zoneName}</h2>
                      <p className="text-gray-600">{zoneTypeConfig[selectedZone.zoneType]?.label}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(selectedZone.status)}`}>
                      {selectedZone.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <p className="text-sm font-semibold text-gray-600 mb-1">Area</p>
                      <p className="text-lg text-gray-900">{Math.round(selectedZone.areaKm2)} km²</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600 mb-1">Depth Range</p>
                      <p className="text-lg text-gray-900">{selectedZone.depthRange || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600 mb-1">Managing Authority</p>
                      <p className="text-lg text-gray-900">{selectedZone.managingAuthority || 'NARA'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600 mb-1">Consultations</p>
                      <p className="text-lg text-gray-900">{selectedZone.stakeholderConsultations || 0}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-bold text-lg mb-2">Description</h3>
                    <p className="text-gray-700">{selectedZone.description}</p>
                  </div>

                  {selectedZone.regulations && (
                    <div className="mb-6">
                      <h3 className="font-bold text-lg mb-2">Regulations</h3>
                      <p className="text-gray-700">{selectedZone.regulations}</p>
                    </div>
                  )}

                  {selectedZone.hasConflicts && (
                    <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-yellow-800">
                        <AlertTriangle className="w-5 h-5" />
                        Conflicts Detected
                      </h3>
                      <p className="text-yellow-700">
                        This zone has {selectedZone.conflictCount} conflict(s) with other planning zones.
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedZone(null)}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderProposalForm = () => {
    return (
      <div className="p-8 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 min-h-screen">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20"
          >
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-400" />
              Submit Planning Proposal
            </h2>

            <form onSubmit={handleSubmitProposal} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Proposal Name *
                </label>
                <input
                  type="text"
                  value={proposalForm.proposalName}
                  onChange={(e) => setProposalForm({ ...proposalForm, proposalName: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter proposal name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={proposalForm.proposerName}
                    onChange={(e) => setProposalForm({ ...proposalForm, proposerName: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-500"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    value={proposalForm.proposerEmail}
                    onChange={(e) => setProposalForm({ ...proposalForm, proposerEmail: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-500"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Proposal Type *
                </label>
                <select
                  value={proposalForm.proposalType}
                  onChange={(e) => setProposalForm({ ...proposalForm, proposalType: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select type...</option>
                  <option value="new_zone">New Zone Proposal</option>
                  <option value="zone_modification">Zone Modification</option>
                  <option value="zone_removal">Zone Removal</option>
                  <option value="regulation_change">Regulation Change</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Description *
                </label>
                <textarea
                  value={proposalForm.description}
                  onChange={(e) => setProposalForm({ ...proposalForm, description: e.target.value })}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your proposal in detail..."
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg flex items-center justify-center gap-2"
              >
                <FileText className="w-5 h-5" />
                Submit Proposal
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    );
  };

  // ========== MAIN RENDER ==========

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading Marine Spatial Planning Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-slate-900 border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Map className="w-8 h-8 text-blue-400" />
              <span className="text-white font-bold text-xl">Marine Spatial Planning</span>
            </div>

            <div className="flex gap-2">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: Map },
                { id: 'map', label: 'Interactive Map', icon: Layers },
                { id: 'zones', label: 'Browse Zones', icon: Info },
                { id: 'proposal', label: 'Submit Proposal', icon: FileText }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                    activeView === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-blue-200 hover:bg-white/10'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeView === 'dashboard' && renderDashboard()}
        {activeView === 'map' && renderInteractiveMap()}
        {activeView === 'zones' && renderZoneBrowser()}
        {activeView === 'proposal' && renderProposalForm()}
      </AnimatePresence>
    </div>
  );
};

export default MarineSpatialPlanningViewer;
