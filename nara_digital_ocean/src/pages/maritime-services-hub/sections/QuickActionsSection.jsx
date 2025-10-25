import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { useTranslation } from 'react-i18next';

const actionConfig = [
  { id: 'bookSurvey', icon: Icons.Compass, color: 'blue', link: null },
  { id: 'orderChart', icon: Icons.Map, color: 'cyan', link: null },
  { id: 'accessData', icon: Icons.Database, color: 'indigo', link: '/live-ocean-data' },
  { id: 'stormglassWeather', icon: Icons.Waves, color: 'blue', link: '/stormglass-maritime' },
  { id: 'nasaOcean', icon: Icons.Satellite, color: 'green', link: '/nasa-ocean-color' },
  { id: 'weatherDashboard', icon: Icons.CloudSun, color: 'sky', link: '/weather-dashboard' },
  { id: 'requestData', icon: Icons.Archive, color: 'violet', link: null },
  { id: 'training', icon: Icons.GraduationCap, color: 'purple', link: null },
  { id: 'consultation', icon: Icons.MessageSquare, color: 'orange', link: null }
];

const QuickActionsSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('maritime');
  const quickActions = t('quickActions', { returnObjects: true }) || {};
  const actions = quickActions.actions || [];

  const handleActionClick = (config) => {
    if (config.link) {
      navigate(config.link);
    }
  };

  return (
    <div className="py-12 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-3">{quickActions?.heading}</h2>
          <p className="text-gray-600">{quickActions?.subheading}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actionConfig.map((config, index) => {
            const content = actions.find((item) => item.id === config.id) || {};
            return (
              <motion.button
              key={config.id}
              onClick={() => handleActionClick(config)}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`bg-white rounded-xl p-6 shadow-md border-2 border-transparent hover:border-${config.color}-300 hover:shadow-lg transition-all text-left group ${config.link ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <div className={`w-12 h-12 bg-${config.color}-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <config.icon className={`w-6 h-6 text-${config.color}-600`} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{content.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{content.description}</p>
              <div className={`flex items-center text-${config.color}-600 font-semibold text-sm`}>
                <span>{content.cta}</span>
                <Icons.ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuickActionsSection;
