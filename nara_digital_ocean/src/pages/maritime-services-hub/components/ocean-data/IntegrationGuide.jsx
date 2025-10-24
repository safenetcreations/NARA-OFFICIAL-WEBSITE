import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

const toolkitPackages = [
  { name: 'axios', purpose: 'HTTP client for authenticated backend proxies' },
  { name: 'react-apexcharts / apexcharts', purpose: 'High-frequency time series visualization' },
  { name: 'leaflet / react-leaflet', purpose: 'Interactive map overlays for station coverage' },
  { name: '@turf/turf', purpose: 'Geospatial calculations and EEZ analytics' },
  { name: 'date-fns', purpose: 'Reliable time-range handling in the browser' },
  { name: 'swr', purpose: 'Stale-while-revalidate data fetching for dashboards' }
];

const roadmapPhases = [
  {
    title: 'Phase 1 · Free Data (Month 1–2)',
    color: 'blue',
    items: [
      'Integrate IOC sea level feed with live dashboards',
      'Display real-time charts with alert thresholds',
      'Launch interactive station map',
      'Provide basic historical downloads'
    ]
  },
  {
    title: 'Phase 2 · Enhanced Products (Month 3–4)',
    color: 'cyan',
    items: [
      'Add NASA SST and Copernicus currents & salinity',
      'Expand historical archival search and request flow',
      'Enable CSV/NetCDF packaging with notifications',
      'Introduce automated event alerts'
    ]
  },
  {
    title: 'Phase 3 · Advanced Intelligence (Month 5–6)',
    color: 'violet',
    items: [
      'Integrate paid APIs for wave forecasting & AIS traffic',
      'Deliver mobile app companion dashboards',
      'Launch research portal with analyst workbench',
      'Support premium decision-support services'
    ]
  }
];

const codeExamples = [
  {
    title: 'Fetch IOC Sea Level Data',
    language: 'javascript',
    code: `// Fetch real-time sea level from Colombo station
const fetchSeaLevel = async () => {
  const response = await fetch(
    'https://www.ioc-sealevelmonitoring.org/service.php?query=data&code=colo&format=json'
  );
  const data = await response.json();

  return data.map(item => ({
    timestamp: item.stime,
    level: parseFloat(item.slevel),
    quality: item.qc
  }));
};`
  },
  {
    title: 'Copernicus Marine Data (Backend)',
    language: 'javascript',
    code: `// Backend API route for Copernicus authentication
export default async function handler(req, res) {
  const response = await axios.get(
    'https://my.cmems-du.eu/thredds/dodsC/dataset',
    {
      auth: {
        username: process.env.COPERNICUS_USERNAME,
        password: process.env.COPERNICUS_PASSWORD
      },
      params: {
        latitude: 6.9271,
        longitude: 79.8612,
        start: req.query.startDate,
        end: req.query.endDate
      }
    }
  );

  res.json(response.data);
}`
  },
  {
    title: 'Chart Visualization with ApexCharts',
    language: 'jsx',
    code: `import Chart from 'react-apexcharts';

const SeaLevelChart = ({ data }) => {
  const options = {
    chart: { type: 'line', zoom: { enabled: true } },
    xaxis: { type: 'datetime' },
    yaxis: { title: { text: 'Sea Level (m)' } },
    stroke: { curve: 'smooth', width: 2 }
  };

  const series = [{
    name: 'Sea Level',
    data: data.map(d => ({
      x: new Date(d.timestamp),
      y: d.level
    }))
  }];

  return <Chart options={options} series={series} type="line" height={400} />;
};`
  }
];

const IntegrationGuide = () => {
  const [selectedExample, setSelectedExample] = useState(codeExamples[0]);
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(selectedExample.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Quick Start */}
      <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-8 text-white">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-3xl font-bold mb-2">Developer Integration Guide</h3>
            <p className="text-blue-100">
              Everything you need to integrate ocean data into your applications
            </p>
          </div>
          <Icons.Code className="w-12 h-12 opacity-50" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <Icons.Zap className="w-6 h-6 mb-2" />
            <div className="text-2xl font-bold mb-1">5 min</div>
            <div className="text-sm text-blue-100">Quick setup time</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <Icons.Database className="w-6 h-6 mb-2" />
            <div className="text-2xl font-bold mb-1">4 APIs</div>
            <div className="text-sm text-blue-100">Free data sources</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <Icons.BookOpen className="w-6 h-6 mb-2" />
            <div className="text-2xl font-bold mb-1">REST</div>
            <div className="text-sm text-blue-100">Simple integration</div>
          </div>
        </div>
      </div>

      {/* NPM Packages */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Icons.Package className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Required NPM Packages</h3>
            <p className="text-sm text-gray-600">Install these dependencies for full functionality</p>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-4 mb-4">
          <code className="text-green-400 text-sm">
            npm install axios react-apexcharts apexcharts leaflet react-leaflet @turf/turf date-fns swr
          </code>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {toolkitPackages.map((pkg) => (
            <div key={pkg.name} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <Icons.CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-mono text-sm font-semibold text-gray-900">{pkg.name}</div>
                <div className="text-xs text-gray-600 mt-0.5">{pkg.purpose}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Code Examples */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h3 className="text-xl font-bold text-gray-900">Code Examples</h3>
        </div>

        <div className="flex border-b border-gray-200">
          {codeExamples.map((example) => (
            <button
              key={example.title}
              onClick={() => setSelectedExample(example)}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                selectedExample.title === example.title
                  ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {example.title}
            </button>
          ))}
        </div>

        <div className="p-6">
          <div className="relative">
            <div className="absolute top-3 right-3 z-10">
              <button
                onClick={copyCode}
                className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded text-xs font-medium transition-colors flex items-center space-x-1"
              >
                {copied ? (
                  <>
                    <Icons.Check className="w-3 h-3" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Icons.Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm">
                <code className="text-gray-300">{selectedExample.code}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Implementation Roadmap */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Icons.Map className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Implementation Roadmap</h3>
            <p className="text-sm text-gray-600">Suggested phased approach for integration</p>
          </div>
        </div>

        <div className="space-y-6">
          {roadmapPhases.map((phase, index) => (
            <motion.div
              key={phase.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`border-l-4 border-${phase.color}-600 bg-${phase.color}-50 rounded-r-lg p-6`}
            >
              <h4 className="text-lg font-bold text-gray-900 mb-4">{phase.title}</h4>
              <ul className="space-y-2">
                {phase.items.map((item) => (
                  <li key={item} className="flex items-start space-x-3">
                    <Icons.CheckCircle className={`w-5 h-5 text-${phase.color}-600 flex-shrink-0 mt-0.5`} />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Environment Variables */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <Icons.Key className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 mb-3">Required Environment Variables</h4>
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
              <div className="space-y-1 text-gray-300">
                <div><span className="text-cyan-400">VITE_STORMGLASS_API_KEY</span>=your_stormglass_key</div>
                <div><span className="text-cyan-400">VITE_WEATHERAPI_KEY</span>=your_weatherapi_key</div>
                <div><span className="text-cyan-400">VITE_COPERNICUS_USERNAME</span>=your_username</div>
                <div><span className="text-cyan-400">VITE_COPERNICUS_PASSWORD</span>=your_password</div>
                <div><span className="text-cyan-400">VITE_NASA_EARTHDATA_TOKEN</span>=your_nasa_token</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Support CTA */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 text-center">
        <Icons.Headphones className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-3">Need Development Support?</h3>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
          Our technical team can provide integration assistance, custom API development,
          and ongoing support for your ocean data projects.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-6 py-3 bg-cyan-500 text-white rounded-lg font-semibold hover:bg-cyan-400 transition-colors">
            Schedule Consultation
          </button>
          <button className="px-6 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/20">
            View Full Documentation
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntegrationGuide;
