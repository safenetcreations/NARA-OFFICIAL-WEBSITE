import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useTranslation } from 'react-i18next';

const archiveConfig = [
  { id: 'nara', icon: Icons.Building, color: 'blue' },
  { id: 'international', icon: Icons.Globe, color: 'green' }
];

const itemIconMap = {
  'tide-gauge': Icons.Waves,
  'cruise-logs': Icons.Ship,
  'research-station': Icons.FlaskConical,
  psmsl: Icons.BarChart,
  ceda: Icons.Database,
  argo: Icons.Thermometer
};

const datasetOptions = ['tide-gauge', 'cruise-logs', 'research-station', 'other'];

const HistoricalDataPanel = () => {
  const { t } = useTranslation('maritime');
  const content = t('historical', { returnObjects: true }) || {};
  const archives = content.archives || [];
  const formText = content.form || {};
  const policy = content.policy || {};

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

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(formText.success);
  };

  const renderArchive = (config, index) => {
    const archive = archives.find((item) => item.id === config.id) || {};
    return (
      <motion.div
        key={config.id}
        initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.2 }}
        className="bg-white rounded-xl p-6 shadow-md border border-gray-200"
      >
        <div className="flex items-start space-x-4 mb-6">
          <div className={`w-14 h-14 bg-${config.color}-100 rounded-xl flex items-center justify-center flex-shrink-0`}>
            <config.icon className={`w-7 h-7 text-${config.color}-600`} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{archive.title}</h3>
            <p className="text-sm text-gray-600">{archive.description}</p>
          </div>
        </div>

        <div className="space-y-3">
          {(archive.items || []).map((item) => {
            const IconComponent =
              itemIconMap[item.iconKey || item.id] || Icons.FileText;
            return (
              <div key={item.name} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-4 h-4 text-gray-600" />
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
                        <span>{t('common:accessData', 'Access Data')}</span>
                        <Icons.ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {archiveConfig.map((config, index) => renderArchive(config, index))}
      </div>

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
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{formText.title}</h3>
            <p className="text-gray-700">{formText.description}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {formText.labels?.name}
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={handleChange('name')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={formText.placeholders?.name}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {formText.labels?.organization}
              </label>
              <input
                type="text"
                required
                value={formData.organization}
                onChange={handleChange('organization')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={formText.placeholders?.organization}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {formText.labels?.email}
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={handleChange('email')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={formText.placeholders?.email}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {formText.labels?.dataset}
              </label>
              <select
                required
                value={formData.dataset}
                onChange={handleChange('dataset')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">{t('common:selectDataset', 'Select dataset...')}</option>
                {(formText.datasets || []).map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {formText.labels?.startDate}
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={handleChange('startDate')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {formText.labels?.endDate}
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={handleChange('endDate')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {formText.labels?.format}
            </label>
            <div className="flex flex-wrap gap-3">
              {(formText.formats || []).map((format) => (
                <label key={format} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    value={format}
                    checked={formData.format === format}
                    onChange={handleChange('format')}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-700">{format}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {formText.labels?.purpose}
            </label>
            <textarea
              required
              value={formData.purpose}
              onChange={handleChange('purpose')}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={formText.placeholders?.purpose}
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
          >
            <Icons.Send className="w-5 h-5" />
            <span>{formText.submit}</span>
          </button>
        </form>
      </motion.div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <Icons.AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-gray-900 mb-2">{policy.title}</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              {(policy.items || []).map((item) => (
                <li key={item} className="flex items-start space-x-2">
                  <Icons.Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoricalDataPanel;
