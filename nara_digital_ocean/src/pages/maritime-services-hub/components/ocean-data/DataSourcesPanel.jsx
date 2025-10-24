import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

const freeDataSources = [
  {
    id: 'ioc',
    name: 'IOC Sea Level Monitoring',
    provider: 'UNESCO',
    access: 'Open · No auth',
    pricing: 'FREE',
    description: 'Real-time sea level observations for Colombo and Trincomalee including tidal harmonics, surge, and tsunami alerts.',
    baseUrl: 'https://www.ioc-sealevelmonitoring.org/',
    update: 'Every 6 minutes',
    coverage: 'Sri Lankan tide gauge network',
    formats: ['JSON', 'XML', 'CSV'],
    icon: Icons.Waves,
    color: 'blue',
    endpoints: [
      'https://www.ioc-sealevelmonitoring.org/service.php?query=data&code=colo&format=json',
      'https://www.ioc-sealevelmonitoring.org/service.php?query=data&code=trin&format=json'
    ]
  },
  {
    id: 'noaa',
    name: 'NOAA Tides & Currents',
    provider: 'NOAA',
    access: 'Open · Station selection required',
    pricing: 'FREE',
    description: 'Water level, tide predictions, and meteorological data for the closest reference stations to Sri Lanka coasts.',
    baseUrl: 'https://api.tidesandcurrents.noaa.gov/api/prod/',
    update: '1 minute – hourly',
    coverage: 'Global reference network',
    formats: ['JSON', 'CSV'],
    icon: Icons.Anchor,
    color: 'cyan',
    endpoints: [
      'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=water_level&datum=MLLW&format=json'
    ]
  },
  {
    id: 'copernicus',
    name: 'Copernicus Marine Service',
    provider: 'EU Copernicus',
    access: 'Free · Registration required',
    pricing: 'FREE',
    description: 'Daily satellite and model products covering the Indian Ocean: currents, sea surface height, salinity, waves, and more.',
    baseUrl: 'https://marine.copernicus.eu/',
    update: 'Daily',
    coverage: 'Indian Ocean (0.25°)',
    formats: ['NetCDF', 'CSV'],
    icon: Icons.Satellite,
    color: 'indigo',
    endpoints: ['https://my.cmems-du.eu/thredds/dodsC/']
  },
  {
    id: 'nasa',
    name: 'NASA Ocean Color & EarthData',
    provider: 'NASA',
    access: 'Free · EarthData login',
    pricing: 'FREE',
    description: 'Sea surface temperature, chlorophyll-a, and ocean color observations from MODIS, VIIRS, and SeaWiFS missions.',
    baseUrl: 'https://oceancolor.gsfc.nasa.gov/',
    update: 'Daily to weekly',
    coverage: 'Global',
    formats: ['HDF', 'NetCDF'],
    icon: Icons.Rocket,
    color: 'violet',
    endpoints: ['https://oceandata.sci.gsfc.nasa.gov/api/']
  }
];

const paidDataSources = [
  {
    id: 'stormglass',
    name: 'Stormglass Maritime Weather API',
    pricing: 'Free 50 req/day · $50–500/mo',
    description: 'High-resolution wave, sea temperature, currents, salinity, and tide forecasts for custom coordinates.',
    baseUrl: 'https://api.stormglass.io/v2/',
    sampleEndpoint: 'https://api.stormglass.io/v2/weather/point?lat=6.9271&lng=79.8612&params=waveHeight,waterTemperature,seaLevel',
    notes: 'Requires VITE_STORMGLASS_API_KEY header Authorization.',
    icon: Icons.Cloud,
    color: 'orange',
    tier: 'Basic'
  },
  {
    id: 'weatherapi',
    name: 'WeatherAPI.com Marine',
    pricing: 'Free tier · $10–50/mo',
    description: 'Marine forecasts, tide tables, swell direction, and wave height for Sri Lankan coastal coordinates.',
    baseUrl: 'https://api.weatherapi.com/v1/',
    sampleEndpoint: 'https://api.weatherapi.com/v1/marine.json?key=YOUR_KEY&q=6.9271,79.8612',
    notes: 'Set VITE_WEATHERAPI_KEY for authenticated requests.',
    icon: Icons.CloudRain,
    color: 'blue',
    tier: 'Basic'
  },
  {
    id: 'marine-traffic',
    name: 'Marine Traffic AIS API',
    pricing: '€200–€2000/mo',
    description: 'Vessel tracking, port intelligence, and ocean condition overlays for operational planning.',
    baseUrl: 'https://www.marinetraffic.com/en/ais-api-services',
    sampleEndpoint: 'https://services.marinetraffic.com/en/api/',
    notes: 'Enterprise subscription required. Integrate via secure backend proxy.',
    icon: Icons.Ship,
    color: 'red',
    tier: 'Professional'
  }
];

const costTiers = [
  {
    tier: 'Free Tier',
    price: '$0 / month',
    icon: Icons.Gift,
    color: 'green',
    inclusions: ['IOC sea level feed', 'Copernicus (registered)', 'NASA Ocean Color', 'NOAA reference stations']
  },
  {
    tier: 'Basic Tier',
    price: '$60 / month',
    icon: Icons.Zap,
    color: 'blue',
    inclusions: ['Stormglass Basic', 'WeatherAPI Marine', 'Email alert automations']
  },
  {
    tier: 'Professional Tier',
    price: '≈ $900 / month',
    icon: Icons.Crown,
    color: 'purple',
    inclusions: ['Stormglass Pro', 'Marine Traffic API', 'Dedicated processing budget']
  }
];

const DataSourcesPanel = () => {
  const [selectedSource, setSelectedSource] = useState(null);
  const [activeTab, setActiveTab] = useState('free');

  return (
    <div className="space-y-8">
      {/* Tab Selector */}
      <div className="flex items-center space-x-4 p-1 bg-gray-100 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('free')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'free'
              ? 'bg-white text-blue-600 shadow-md'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Icons.Gift className="w-4 h-4" />
            <span>Free Sources</span>
            <span className="ml-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-bold">
              {freeDataSources.length}
            </span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('paid')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'paid'
              ? 'bg-white text-blue-600 shadow-md'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Icons.DollarSign className="w-4 h-4" />
            <span>Premium Sources</span>
            <span className="ml-1 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">
              {paidDataSources.length}
            </span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('pricing')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'pricing'
              ? 'bg-white text-blue-600 shadow-md'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Icons.Calculator className="w-4 h-4" />
            <span>Pricing Tiers</span>
          </div>
        </button>
      </div>

      {/* Free Data Sources */}
      {activeTab === 'free' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {freeDataSources.map((source, index) => (
            <motion.div
              key={source.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-${source.color}-100 rounded-lg flex items-center justify-center`}>
                  <source.icon className={`w-6 h-6 text-${source.color}-600`} />
                </div>
                <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                  FREE ✓
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-1">{source.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{source.provider}</p>
              <p className="text-gray-700 text-sm mb-4">{source.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Update:</span>
                  <span className="font-semibold text-gray-900">{source.update}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Coverage:</span>
                  <span className="font-semibold text-gray-900">{source.coverage}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Access:</span>
                  <span className="font-semibold text-blue-600">{source.access}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {source.formats.map((format) => (
                  <span
                    key={format}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
                  >
                    {format}
                  </span>
                ))}
              </div>

              <button
                onClick={() => setSelectedSource(source)}
                className={`w-full py-2 bg-${source.color}-600 text-white rounded-lg font-semibold hover:bg-${source.color}-700 transition-colors`}
              >
                View API Details
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Paid Data Sources */}
      {activeTab === 'paid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paidDataSources.map((source, index) => (
            <motion.div
              key={source.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-md border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-${source.color}-100 rounded-lg flex items-center justify-center`}>
                  <source.icon className={`w-6 h-6 text-${source.color}-600`} />
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                  source.tier === 'Basic'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  {source.tier}
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">{source.name}</h3>
              <div className="text-sm font-semibold text-orange-600 mb-3">{source.pricing}</div>
              <p className="text-gray-700 text-sm mb-4">{source.description}</p>

              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="text-xs text-gray-500 mb-1">Integration Note:</div>
                <div className="text-xs text-gray-700">{source.notes}</div>
              </div>

              <button className="w-full py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all">
                View Pricing
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pricing Tiers */}
      {activeTab === 'pricing' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {costTiers.map((tier, index) => (
            <motion.div
              key={tier.tier}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-xl p-8 shadow-lg border-2 ${
                index === 1 ? 'border-blue-500 relative' : 'border-gray-200'
              }`}
            >
              {index === 1 && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="px-4 py-1 bg-blue-500 text-white rounded-full text-xs font-bold">
                    RECOMMENDED
                  </div>
                </div>
              )}

              <div className={`w-16 h-16 bg-${tier.color}-100 rounded-xl flex items-center justify-center mb-6`}>
                <tier.icon className={`w-8 h-8 text-${tier.color}-600`} />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.tier}</h3>
              <div className="text-4xl font-bold text-gray-900 mb-6">{tier.price}</div>

              <div className="space-y-3 mb-8">
                {tier.inclusions.map((item) => (
                  <div key={item} className="flex items-start space-x-3">
                    <Icons.Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  index === 1
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {index === 0 ? 'Get Started Free' : 'Contact Sales'}
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Bottom Info */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-start space-x-4">
          <Icons.Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-gray-900 mb-2">Integration Support Available</h4>
            <p className="text-gray-700 text-sm">
              Need help integrating these data sources into your systems? Our team can assist with
              API setup, authentication configuration, data processing pipelines, and custom dashboard development.
            </p>
            <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Request Technical Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSourcesPanel;
