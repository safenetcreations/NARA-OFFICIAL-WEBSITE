import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useTranslation } from 'react-i18next';

const metricIconMap = [Icons.Zap, Icons.Database, Icons.BookOpen];
const packageIcon = Icons.Package;
const roadmapColorMap = {
  phase1: 'blue',
  phase2: 'cyan',
  phase3: 'violet'
};
const exampleCode = {
  'sea-level': `// Fetch real-time sea level from Colombo station
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
};`,
  copernicus: `// Backend API route for Copernicus authentication
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
}`,
  chart: `import Chart from 'react-apexcharts';

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

  return <Chart options={options} series={series} type=\"line\" height={400} />;
};`
};

const IntegrationGuide = () => {
  const { t } = useTranslation('maritime');
  const content = t('integrationGuide', { returnObjects: true }) || {};
  const metrics = content.quickStart?.metrics || [];
  const packages = content.packages || [];
  const codeExamples = content.codeExamples || [];
  const roadmap = content.roadmap || [];
  const envVars = content.env?.items || [];
  const support = content.support || {};
  const [selectedExample, setSelectedExample] = useState(codeExamples[0] || {});
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (selectedExample?.id) {
      navigator.clipboard.writeText(exampleCode[selectedExample.id] || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-8 text-white">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-3xl font-bold mb-2">{content.quickStart?.title}</h3>
            <p className="text-blue-100">{content.quickStart?.subtitle}</p>
          </div>
          <Icons.Code className="w-12 h-12 opacity-50" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metrics.map((metric, index) => {
            const MetricIcon = metricIconMap[index] || Icons.Info;
            return (
              <div key={metric.label} className="bg-white/10 backdrop-blur rounded-lg p-4">
                <MetricIcon className="w-6 h-6 mb-2" />
                <div className="text-2xl font-bold mb-1">{metric.value}</div>
                <div className="text-sm text-blue-100">{metric.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <packageIcon className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{t('integrationGuide.packagesTitle', 'Required NPM Packages')}</h3>
            <p className="text-sm text-gray-600">{t('integrationGuide.packagesSubtitle', 'Install these dependencies for full functionality')}</p>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-4 mb-4">
          <code className="text-green-400 text-sm">{content.npmCommand}</code>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {packages.map((pkg) => (
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

      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h3 className="text-xl font-bold text-gray-900">{t('integrationGuide.codeTitle', 'Code Examples')}</h3>
        </div>

        <div className="flex border-b border-gray-200">
          {codeExamples.map((example) => (
            <button
              key={example.id}
              onClick={() => setSelectedExample(example)}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                selectedExample?.id === example.id
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
                onClick={handleCopy}
                className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded text-xs font-medium transition-colors flex items-center space-x-1"
              >
                {copied ? (
                  <>
                    <Icons.Check className="w-3 h-3" />
                    <span>{content.buttons?.copied}</span>
                  </>
                ) : (
                  <>
                    <Icons.Copy className="w-3 h-3" />
                    <span>{content.buttons?.copy}</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm text-gray-300">
                <code>{exampleCode[selectedExample?.id] || ''}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Icons.Map className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{content.roadmapTitle || 'Implementation Roadmap'}</h3>
            <p className="text-sm text-gray-600">{content.roadmapSubtitle || 'Suggested phased approach for integration'}</p>
          </div>
        </div>

        <div className="space-y-6">
          {roadmap.map((phase) => {
            const color = roadmapColorMap[phase.id] || 'blue';
            return (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={`border-l-4 border-${color}-600 bg-${color}-50 rounded-r-lg p-6`}
              >
                <h4 className="text-lg font-bold text-gray-900 mb-4">{phase.title}</h4>
                <ul className="space-y-2">
                  {(phase.items || []).map((item) => (
                    <li key={item} className="flex items-start space-x-3">
                      <Icons.CheckCircle className={`w-5 h-5 text-${color}-600 flex-shrink-0 mt-0.5`} />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <Icons.Key className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-gray-900 mb-2">{content.env?.title}</h4>
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-300 space-y-1">
              {envVars.map((env) => (
                <div key={env}>
                  <span className="text-cyan-400">{env}</span>=your_value
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 text-center">
        <Icons.Headphones className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-3">{support.heading}</h3>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">{support.description}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-6 py-3 bg-cyan-500 text-white rounded-lg font-semibold hover:bg-cyan-400 transition-colors">
            {support.primary}
          </button>
          <button className="px-6 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/20">
            {support.secondary}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntegrationGuide;
