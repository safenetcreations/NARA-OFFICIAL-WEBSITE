import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

const historicalArchives = [
  {
    title: 'NARA Internal Archives',
    description: 'Confidential datasets curated by the Hydrographic Division for Sri Lankan waters',
    icon: Icons.Building,
    color: 'blue',
    items: [
      {
        name: 'Tide Gauge Records',
        detail: 'Colombo, Trincomalee, Galle · Since 1990s',
        format: 'CSV, SQL backups',
        icon: Icons.Waves
      },
      {
        name: 'Samudra Maru Cruise Logs',
        detail: 'Physical & digital oceanography campaigns',
        format: 'NetCDF, XLS, PDF',
        icon: Icons.Ship
      },
      {
        name: 'Research Station Measurements',
        detail: 'Mannar, Jaffna, Kalpitiya laboratories',
        format: 'Excel, CSV',
        icon: Icons.FlaskConical
      }
    ]
  },
  {
    title: 'International Repositories',
    description: 'Freely accessible archives for historical baselines and climate analysis',
    icon: Icons.Globe,
    color: 'green',
    items: [
      {
        name: 'PSMSL · Station 1283 (Colombo)',
        detail: 'Monthly & annual mean sea level · 1986–present',
        link: 'https://www.psmsl.org/data/obtaining/',
        icon: Icons.BarChart
      },
      {
        name: 'CEDA Environmental Data',
        detail: 'Historical ocean temperature, salinity, currents',
        link: 'https://data.ceda.ac.uk/',
        icon: Icons.Database
      },
      {
        name: 'ARGO Global Floats',
        detail: 'Temperature & salinity profiles · 0–2000m depth',
        link: 'https://argo.ucsd.edu/data/',
        icon: Icons.Thermometer
      }
    ]
  }
];

const HistoricalDataPanel = () => {
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    email: '',
    dataset: '',
    startDate: '',
    endDate: '',
    purpose: '',
    format: 'CSV'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Historical data request:', formData);
    alert('Your data access request has been submitted. Our team will contact you within 2 business days.');
  };

  return (
    <div className="space-y-8">
      {/* Archives Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {historicalArchives.map((archive, index) => (
          <motion.div
            key={archive.title}
            initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
            className="bg-white rounded-xl p-6 shadow-md border border-gray-200"
          >
            <div className="flex items-start space-x-4 mb-6">
              <div className={`w-14 h-14 bg-${archive.color}-100 rounded-xl flex items-center justify-center flex-shrink-0`}>
                <archive.icon className={`w-7 h-7 text-${archive.color}-600`} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{archive.title}</h3>
                <p className="text-sm text-gray-600">{archive.description}</p>
              </div>
            </div>

            <div className="space-y-3">
              {archive.items.map((item) => (
                <div
                  key={item.name}
                  className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{item.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{item.detail}</p>
                      {item.format && (
                        <div className="flex flex-wrap gap-1">
                          {item.format.split(', ').map((format) => (
                            <span
                              key={format}
                              className="px-2 py-0.5 bg-white border border-gray-300 rounded text-xs font-medium text-gray-700"
                            >
                              {format}
                            </span>
                          ))}
                        </div>
                      )}
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700 font-medium mt-2"
                        >
                          <span>Access Data</span>
                          <Icons.ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Data Request Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-8 border border-blue-100"
      >
        <div className="flex items-start space-x-4 mb-6">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Icons.FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Historical Data Access</h3>
            <p className="text-gray-700">
              Submit a request to access NARA's historical oceanographic datasets. Our team will review
              and provide access within 2-3 business days.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Dr. John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Organization *
              </label>
              <input
                type="text"
                required
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="University of Colombo"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="john.doe@university.edu"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Dataset Requested *
              </label>
              <select
                required
                value={formData.dataset}
                onChange={(e) => setFormData({ ...formData, dataset: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select dataset...</option>
                <option value="tide-gauge">Tide Gauge Records</option>
                <option value="cruise-logs">Samudra Maru Cruise Logs</option>
                <option value="research-station">Research Station Measurements</option>
                <option value="other">Other (specify in purpose)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Preferred Format
            </label>
            <div className="flex flex-wrap gap-3">
              {['CSV', 'NetCDF', 'Excel', 'SQL', 'PDF'].map((format) => (
                <label
                  key={format}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="format"
                    value={format}
                    checked={formData.format === format}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-700">{format}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Research Purpose *
            </label>
            <textarea
              required
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe how you plan to use this data..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
          >
            <Icons.Send className="w-5 h-5" />
            <span>Submit Data Request</span>
          </button>
        </form>
      </motion.div>

      {/* Info Box */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <Icons.AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-gray-900 mb-2">Data Access Policy</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start space-x-2">
                <Icons.Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Free access for academic research and non-commercial purposes</span>
              </li>
              <li className="flex items-start space-x-2">
                <Icons.Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Commercial usage requires separate licensing agreement</span>
              </li>
              <li className="flex items-start space-x-2">
                <Icons.Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Proper citation of NARA datasets is mandatory in publications</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoricalDataPanel;
