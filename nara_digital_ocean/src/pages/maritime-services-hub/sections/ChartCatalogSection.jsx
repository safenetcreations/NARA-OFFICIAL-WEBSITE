import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useTranslation } from 'react-i18next';

const categoryIcons = {
  harbour: Icons.Anchor,
  coastal: Icons.Map,
  offshore: Icons.Globe
};

const ChartCatalogSection = () => {
  const { t } = useTranslation('maritime');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const content = t('charts', { returnObjects: true }) || {};
  const categories = content.categories || [];
  const samples = content.samples || [];
  const buttons = content.buttons || {};

  const filteredCharts = samples.filter((chart) => {
    const matchesCategory = selectedCategory === 'all' || chart.category === selectedCategory;
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      chart.title.toLowerCase().includes(query) ||
      chart.chartNumber.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-4 py-2 bg-cyan-100 rounded-full mb-4">
            <Icons.MapPin className="w-4 h-4 text-cyan-600 mr-2" />
            <span className="text-cyan-700 text-sm font-semibold">
              {t('charts.badge', 'Official Nautical Charts')}
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {content.heading}
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {content.subheading}
          </p>
        </motion.div>

        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <Icons.Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={content.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">{content.filters?.all}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-300'
              }`}
            >
              {content.filters?.all}
            </button>
            {categories.map((category) => {
              const IconComponent = categoryIcons[category.id] || Icons.Map;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-300'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCharts.map((chart, index) => (
            <motion.div
              key={chart.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold mb-2">
                    {chart.chartNumber}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{chart.title}</h3>
                </div>
                <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                  {chart.status}
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4">{chart.coverage}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Scale</div>
                  <div className="font-semibold text-gray-900">{chart.scale}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Edition</div>
                  <div className="font-semibold text-gray-900">{chart.edition}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Format</div>
                  <div className="font-semibold text-gray-900">{chart.format}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Price</div>
                  <div className="font-bold text-blue-600">{chart.price}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  {buttons.order}
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                  <Icons.Eye className="w-5 h-5" />
                  <span className="sr-only">{buttons.preview}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-8 text-white text-center"
        >
          <Icons.FileText className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-3">{content.custom?.heading}</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            {content.custom?.description}
          </p>
          <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
            {content.custom?.cta}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ChartCatalogSection;
