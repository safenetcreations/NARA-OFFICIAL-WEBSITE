/**
 * Enhanced Marine Spatial Planning Viewer
 *
 * NEW FEATURES:
 * ✅ Easy drawing tools (Polygon, Rectangle, Circle)
 * ✅ Zone presets/templates (One-click zone creation)
 * ✅ Undo/Redo functionality
 * ✅ Area measurement
 * ✅ Save/Export drawings
 * ✅ Improved UI with quick actions
 */

import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, Polyline, Circle, useMapEvents } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Map, Edit3, Square, Circle as CircleIcon, Pentagon, Ruler,
  Trash2, Undo, Redo, Save, Info, Target, Ship, Anchor,
  Fish, Shield, Zap, Factory, Home
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';

import {
  spatialZoneService,
  conflictDetectionService
} from '../../services/marineSpatialPlanningService';

const EnhancedMarineSpatialPlanning = () => {
  // Data state
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);

  // Drawing state
  const [drawingMode, setDrawingMode] = useState(null);
  const [drawnShapes, setDrawnShapes] = useState([]);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [showPresets, setShowPresets] = useState(false);
  const mapRef = useRef(null);

  // Zone presets - Easy templates
  const zonePresets = [
    {
      id: 'fishing_standard',
      name: 'Standard Fishing Zone',
      type: 'fishing_zone',
      description: '5km² fishing area',
      shape: 'rectangle',
      size: { width: 2500, height: 2000 },
      color: '#3b82f6',
      icon: Fish
    },
    {
      id: 'protected_circular',
      name: 'Circular Protected Area',
      type: 'protected_area',
      description: 'Marine sanctuary',
      shape: 'circle',
      size: { radius: 1500 },
      color: '#10b981',
      icon: Shield
    },
    {
      id: 'shipping_corridor',
      name: 'Shipping Lane',
      type: 'shipping_lane',
      description: 'Standard shipping corridor',
      shape: 'corridor',
      size: { width: 500, length: 5000 },
      color: '#8b5cf6',
      icon: Ship
    },
    {
      id: 'anchorage',
      name: 'Anchorage Zone',
      type: 'anchorage',
      description: 'Circular anchorage',
      shape: 'circle',
      size: { radius: 800 },
      color: '#f59e0b',
      icon: Anchor
    },
    {
      id: 'aquaculture',
      name: 'Aquaculture Grid',
      type: 'aquaculture',
      description: 'Fish farming area',
      shape: 'rectangle',
      size: { width: 1000, height: 1000 },
      color: '#14b8a6',
      icon: Home
    },
    {
      id: 'military',
      name: 'Military Zone',
      type: 'military_zone',
      description: 'Restricted area',
      shape: 'rectangle',
      size: { width: 3000, height: 3000 },
      color: '#ef4444',
      icon: Zap
    }
  ];

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
    if (zonesData) setZones(zonesData);
    setLoading(false);
  };

  // Drawing functions
  const startDrawing = (mode) => {
    setDrawingMode(mode);
  };

  const addShape = (shape) => {
    const newShape = {
      id: Date.now(),
      ...shape,
      timestamp: new Date().toISOString()
    };
    setUndoStack([...undoStack, drawnShapes]);
    setDrawnShapes([...drawnShapes, newShape]);
    setRedoStack([]);
  };

  const removeShape = (shapeId) => {
    setUndoStack([...undoStack, drawnShapes]);
    setDrawnShapes(drawnShapes.filter(s => s.id !== shapeId));
    setRedoStack([]);
  };

  const clearAllShapes = () => {
    if (drawnShapes.length > 0) {
      setUndoStack([...undoStack, drawnShapes]);
      setDrawnShapes([]);
    }
  };

  const undo = () => {
    if (undoStack.length > 0) {
      const previousState = undoStack[undoStack.length - 1];
      setRedoStack([...redoStack, drawnShapes]);
      setDrawnShapes(previousState);
      setUndoStack(undoStack.slice(0, -1));
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[redoStack.length - 1];
      setUndoStack([...undoStack, drawnShapes]);
      setDrawnShapes(nextState);
      setRedoStack(redoStack.slice(0, -1));
    }
  };

  const applyPreset = (preset) => {
    const mapCenter = mapRef.current?.getCenter() || { lat: 7.8731, lng: 80.7718 };

    let shape;
    if (preset.shape === 'circle') {
      shape = {
        type: 'circle',
        center: [mapCenter.lat, mapCenter.lng],
        radius: preset.size.radius,
        color: preset.color,
        zoneType: preset.type,
        name: preset.name
      };
    } else {
      const latOffset = (preset.size.height || preset.size.length) / 111000;
      const lngOffset = preset.size.width / (111000 * Math.cos(mapCenter.lat * Math.PI / 180));

      shape = {
        type: 'polygon',
        positions: [
          [mapCenter.lat - latOffset/2, mapCenter.lng - lngOffset/2],
          [mapCenter.lat + latOffset/2, mapCenter.lng - lngOffset/2],
          [mapCenter.lat + latOffset/2, mapCenter.lng + lngOffset/2],
          [mapCenter.lat - latOffset/2, mapCenter.lng + lngOffset/2]
        ],
        color: preset.color,
        zoneType: preset.type,
        name: preset.name
      };
    }

    addShape(shape);
    setShowPresets(false);
  };

  const calculateArea = (positions) => {
    if (!positions || positions.length < 3) return 0;
    let area = 0;
    for (let i = 0; i < positions.length; i++) {
      const j = (i + 1) % positions.length;
      area += positions[i][1] * positions[j][0];
      area -= positions[j][1] * positions[i][0];
    }
    return Math.abs(area / 2) * 12364; // Rough km²
  };

  const saveDrawing = () => {
    const data = {
      shapes: drawnShapes,
      timestamp: new Date().toISOString(),
      totalShapes: drawnShapes.length
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marine-zones-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Drawing handler component
  const DrawingHandler = () => {
    const [tempPoints, setTempPoints] = useState([]);

    useMapEvents({
      click(e) {
        if (drawingMode === 'polygon') {
          setTempPoints([...tempPoints, [e.latlng.lat, e.latlng.lng]]);
        } else if (drawingMode === 'rectangle') {
          if (tempPoints.length === 0) {
            setTempPoints([[e.latlng.lat, e.latlng.lng]]);
          } else {
            const [lat1, lng1] = tempPoints[0];
            addShape({
              type: 'polygon',
              positions: [
                [lat1, lng1],
                [e.latlng.lat, lng1],
                [e.latlng.lat, e.latlng.lng],
                [lat1, e.latlng.lng]
              ],
              color: '#3b82f6',
              name: 'Custom Rectangle'
            });
            setTempPoints([]);
            setDrawingMode(null);
          }
        } else if (drawingMode === 'circle') {
          addShape({
            type: 'circle',
            center: [e.latlng.lat, e.latlng.lng],
            radius: 1000,
            color: '#10b981',
            name: 'Custom Circle'
          });
          setDrawingMode(null);
        }
      },
      dblclick() {
        if (drawingMode === 'polygon' && tempPoints.length >= 3) {
          addShape({
            type: 'polygon',
            positions: tempPoints,
            color: '#8b5cf6',
            name: 'Custom Polygon'
          });
          setTempPoints([]);
          setDrawingMode(null);
        }
      }
    });

    return tempPoints.length > 0 ? (
      <Polyline positions={tempPoints} pathOptions={{ color: '#3b82f6', weight: 2, dashArray: '5, 5' }} />
    ) : null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading Marine Spatial Planning...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <nav className="bg-slate-900 border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Map className="w-8 h-8 text-blue-400" />
              <span className="text-white font-bold text-xl">Enhanced Marine Spatial Planning</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Map */}
      <div className="h-[calc(100vh-64px)] bg-slate-900 relative">
        {/* Drawing Toolbar */}
        <div className="absolute top-4 left-4 z-[1000] bg-white/95 backdrop-blur-lg rounded-xl p-4 shadow-2xl w-80">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-blue-600" />
            Drawing Tools
          </h3>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <button
              onClick={() => startDrawing('polygon')}
              className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 flex flex-col items-center gap-1"
              title="Draw Polygon"
            >
              <Pentagon className="w-5 h-5" />
              <span className="text-xs">Polygon</span>
            </button>
            <button
              onClick={() => startDrawing('rectangle')}
              className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 flex flex-col items-center gap-1"
              title="Draw Rectangle"
            >
              <Square className="w-5 h-5" />
              <span className="text-xs">Rectangle</span>
            </button>
            <button
              onClick={() => startDrawing('circle')}
              className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 flex flex-col items-center gap-1"
              title="Draw Circle"
            >
              <CircleIcon className="w-5 h-5" />
              <span className="text-xs">Circle</span>
            </button>
            <button
              onClick={() => setShowPresets(true)}
              className="bg-pink-600 text-white px-3 py-2 rounded-lg hover:bg-pink-700 flex flex-col items-center gap-1"
              title="Zone Templates"
            >
              <Target className="w-5 h-5" />
              <span className="text-xs">Templates</span>
            </button>
            <button
              onClick={clearAllShapes}
              className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 flex flex-col items-center gap-1"
              title="Clear All"
            >
              <Trash2 className="w-5 h-5" />
              <span className="text-xs">Clear</span>
            </button>
            <button
              onClick={saveDrawing}
              disabled={drawnShapes.length === 0}
              className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex flex-col items-center gap-1"
              title="Save Drawing"
            >
              <Save className="w-5 h-5" />
              <span className="text-xs">Save</span>
            </button>
          </div>

          {/* Undo/Redo */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={undo}
              disabled={undoStack.length === 0}
              className="flex-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Undo className="w-4 h-4" />
              <span className="text-sm">Undo</span>
            </button>
            <button
              onClick={redo}
              disabled={redoStack.length === 0}
              className="flex-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Redo className="w-4 h-4" />
              <span className="text-sm">Redo</span>
            </button>
          </div>

          {/* Drawing Mode Indicator */}
          {drawingMode && (
            <div className="p-3 bg-blue-50 rounded-lg border-2 border-blue-300 mb-4">
              <p className="text-sm font-semibold text-blue-900 mb-1">
                Drawing: {drawingMode}
              </p>
              <p className="text-xs text-blue-700 mb-2">
                {drawingMode === 'polygon' ? 'Click to add points, double-click to finish' :
                 drawingMode === 'rectangle' ? 'Click two opposite corners' :
                 'Click to place circle'}
              </p>
              <button
                onClick={() => setDrawingMode(null)}
                className="w-full px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Shapes List */}
          {drawnShapes.length > 0 && (
            <div className="border-t pt-4">
              <h4 className="font-semibold text-sm mb-2">Shapes ({drawnShapes.length})</h4>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {drawnShapes.map(shape => (
                  <div key={shape.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: shape.color }} />
                      <span className="text-xs font-medium">{shape.name}</span>
                    </div>
                    <button
                      onClick={() => removeShape(shape.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Zone Presets Panel */}
        <AnimatePresence>
          {showPresets && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="absolute top-4 right-4 z-[1000] bg-white/95 backdrop-blur-lg rounded-xl p-6 shadow-2xl w-96"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Zone Templates
                </h3>
                <button
                  onClick={() => setShowPresets(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {zonePresets.map(preset => (
                  <motion.div
                    key={preset.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 cursor-pointer"
                    onClick={() => applyPreset(preset)}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: preset.color + '33' }}
                      >
                        <preset.icon className="w-6 h-6" style={{ color: preset.color }} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{preset.name}</h4>
                        <p className="text-xs text-gray-600 mt-1">{preset.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-900">
                  💡 <strong>Tip:</strong> Click any template to add it instantly to the map center.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Help Panel */}
        <div className="absolute bottom-4 right-4 z-[1000] bg-white/95 backdrop-blur-lg rounded-lg p-4 shadow-xl max-w-xs">
          <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600" />
            Quick Help
          </h4>
          <ul className="text-xs space-y-1 text-gray-700">
            <li>• <strong>Polygon:</strong> Click points, double-click done</li>
            <li>• <strong>Rectangle:</strong> Click 2 corners</li>
            <li>• <strong>Circle:</strong> Click center</li>
            <li>• <strong>Templates:</strong> One-click zones</li>
            <li>• <strong>Undo/Redo:</strong> Step through changes</li>
            <li>• <strong>Save:</strong> Download as JSON</li>
          </ul>
        </div>

        {/* Map */}
        <MapContainer
          center={[7.8731, 80.7718]}
          zoom={8}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap'
          />

          <DrawingHandler />

          {/* Existing zones */}
          {zones.map((zone) => {
            if (!zone.boundaries || zone.boundaries.length === 0) return null;
            const positions = zone.boundaries.map(gp => [gp.latitude, gp.longitude]);
            const color = zoneTypeConfig[zone.zoneType]?.color || '#64748b';

            return (
              <Polygon
                key={zone.id}
                positions={positions}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: 0.3,
                  weight: 2
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold">{zone.zoneName}</h3>
                    <p className="text-sm">{zoneTypeConfig[zone.zoneType]?.label}</p>
                  </div>
                </Popup>
              </Polygon>
            );
          })}

          {/* Drawn shapes */}
          {drawnShapes.map(shape => {
            if (shape.type === 'polygon') {
              return (
                <Polygon
                  key={shape.id}
                  positions={shape.positions}
                  pathOptions={{
                    color: shape.color,
                    fillColor: shape.color,
                    fillOpacity: 0.4,
                    weight: 3
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold mb-2">{shape.name}</h3>
                      <p className="text-sm">Area: ~{calculateArea(shape.positions).toFixed(2)} km²</p>
                      <button
                        onClick={() => removeShape(shape.id)}
                        className="mt-2 w-full px-3 py-1 bg-red-500 text-white rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </Popup>
                </Polygon>
              );
            } else if (shape.type === 'circle') {
              return (
                <Circle
                  key={shape.id}
                  center={shape.center}
                  radius={shape.radius}
                  pathOptions={{
                    color: shape.color,
                    fillColor: shape.color,
                    fillOpacity: 0.4,
                    weight: 3
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold mb-2">{shape.name}</h3>
                      <p className="text-sm">Radius: {shape.radius}m</p>
                      <p className="text-sm">Area: ~{(Math.PI * shape.radius * shape.radius / 1000000).toFixed(2)} km²</p>
                      <button
                        onClick={() => removeShape(shape.id)}
                        className="mt-2 w-full px-3 py-1 bg-red-500 text-white rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </Popup>
                </Circle>
              );
            }
            return null;
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default EnhancedMarineSpatialPlanning;
