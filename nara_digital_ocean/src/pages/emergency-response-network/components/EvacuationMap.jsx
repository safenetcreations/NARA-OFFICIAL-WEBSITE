import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const EvacuationMap = () => {
  const [selectedRegion, setSelectedRegion] = useState('colombo');
  const [mapView, setMapView] = useState('evacuation');

  const regions = [
    { value: 'colombo', label: 'Colombo District' },
    { value: 'galle', label: 'Galle District' },
    { value: 'hambantota', label: 'Hambantota District' },
    { value: 'kalutara', label: 'Kalutara District' },
    { value: 'matara', label: 'Matara District' },
    { value: 'puttalam', label: 'Puttalam District' }
  ];

  const mapViews = [
    { value: 'evacuation', label: 'Evacuation Routes' },
    { value: 'safe-zones', label: 'Safe Zones' },
    { value: 'risk-areas', label: 'Risk Areas' },
    { value: 'facilities', label: 'Emergency Facilities' }
  ];

  const getMapCoordinates = (region) => {
    const coordinates = {
      colombo: '6.9271,79.8612',
      galle: '6.0535,80.2210',
      hambantota: '6.1241,81.1185',
      kalutara: '6.5854,79.9607',
      matara: '5.9549,80.5550',
      puttalam: '8.0362,79.8283'
    };
    return coordinates?.[region] || '6.9271,79.8612';
  };

  const mapLegend = [
    { color: 'bg-red-500', label: 'High Risk Zones', icon: 'AlertTriangle' },
    { color: 'bg-yellow-500', label: 'Medium Risk Zones', icon: 'AlertCircle' },
    { color: 'bg-green-500', label: 'Safe Zones', icon: 'Shield' },
    { color: 'bg-blue-500', label: 'Evacuation Routes', icon: 'Navigation' },
    { color: 'bg-purple-500', label: 'Emergency Facilities', icon: 'Building2' }
  ];

  const emergencyFacilities = [
    {
      name: "Colombo General Hospital",
      type: "Medical Facility",
      distance: "2.3 km",
      capacity: "500+ beds",
      contact: "+94 11 269 1111"
    },
    {
      name: "Galle Face Green Assembly Point",
      type: "Assembly Point",
      distance: "1.8 km",
      capacity: "5000+ people",
      contact: "+94 11 243 7335"
    },
    {
      name: "Mount Lavinia Emergency Shelter",
      type: "Shelter",
      distance: "4.2 km",
      capacity: "1000+ people",
      contact: "+94 11 271 5221"
    }
  ];

  return (
    <div className="bg-white rounded-lg ocean-depth-shadow">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-headline font-bold text-text-primary">
            Interactive Evacuation Maps
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
            >
              <Icon name="Printer" size={16} className="mr-2" />
              Print Map
            </Button>
            <Button
              variant="default"
              size="sm"
              className="bg-accent hover:bg-accent/90"
            >
              <Icon name="Download" size={16} className="mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Select Region"
            options={regions}
            value={selectedRegion}
            onChange={setSelectedRegion}
          />
          <Select
            label="Map View"
            options={mapViews}
            value={mapView}
            onChange={setMapView}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Map Display */}
        <div className="lg:col-span-2">
          <div className="relative bg-slate-100 rounded-lg overflow-hidden" style={{ height: '500px' }}>
            <iframe
              width="100%"
              height="100%"
              loading="lazy"
              title={`Evacuation Map - ${regions?.find(r => r?.value === selectedRegion)?.label}`}
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${getMapCoordinates(selectedRegion)}&z=12&output=embed`}
              className="border-0"
            />
            
            {/* Map Overlay Controls */}
            <div className="absolute top-4 left-4 bg-white rounded-lg p-3 ocean-depth-shadow">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Map" size={16} className="text-primary" />
                <span className="font-cta-medium text-sm text-text-primary">
                  {regions?.find(r => r?.value === selectedRegion)?.label}
                </span>
              </div>
              <div className="text-xs font-body text-text-secondary">
                Viewing: {mapViews?.find(v => v?.value === mapView)?.label}
              </div>
            </div>

            {/* Emergency Alert Overlay */}
            <div className="absolute top-4 right-4 bg-red-600 text-white rounded-lg p-3 animate-pulse">
              <div className="flex items-center space-x-2">
                <Icon name="AlertTriangle" size={16} />
                <span className="font-cta-medium text-sm">
                  Live Emergency Mode
                </span>
              </div>
            </div>
          </div>

          {/* Map Legend */}
          <div className="mt-4 bg-slate-50 rounded-lg p-4">
            <h3 className="font-cta-medium text-sm text-text-primary mb-3">Map Legend</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {mapLegend?.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded ${item?.color}`}></div>
                  <Icon name={item?.icon} size={14} className="text-text-secondary" />
                  <span className="text-xs font-body text-text-secondary">
                    {item?.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Emergency Facilities List */}
        <div className="space-y-4">
          <h3 className="font-headline font-bold text-lg text-text-primary">
            Nearby Emergency Facilities
          </h3>
          
          {emergencyFacilities?.map((facility, index) => (
            <div key={index} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-cta-medium text-sm text-text-primary">
                  {facility?.name}
                </h4>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-cta rounded">
                  {facility?.type}
                </span>
              </div>
              
              <div className="space-y-2 text-xs font-body text-text-secondary">
                <div className="flex items-center space-x-2">
                  <Icon name="MapPin" size={12} />
                  <span>{facility?.distance}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Users" size={12} />
                  <span>{facility?.capacity}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Phone" size={12} />
                  <span className="font-mono">{facility?.contact}</span>
                </div>
              </div>

              <div className="mt-3 flex space-x-2">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => window.open(`tel:${facility?.contact}`, '_self')}
                  className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
                >
                  <Icon name="Phone" size={12} className="mr-1" />
                  Call
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
                >
                  <Icon name="Navigation" size={12} className="mr-1" />
                  Directions
                </Button>
              </div>
            </div>
          ))}

          {/* Quick Actions */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="font-cta-medium text-sm text-orange-900 mb-3">
              Quick Emergency Actions
            </h4>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                fullWidth
                className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
              >
                <Icon name="AlertTriangle" size={16} className="mr-2" />
                Report Emergency
              </Button>
              <Button
                variant="outline"
                size="sm"
                fullWidth
                className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
              >
                <Icon name="MessageSquare" size={16} className="mr-2" />
                Request Help
              </Button>
              <Button
                variant="outline"
                size="sm"
                fullWidth
                className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
              >
                <Icon name="Shield" size={16} className="mr-2" />
                I'm Safe
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvacuationMap;