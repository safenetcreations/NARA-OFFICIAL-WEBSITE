import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useTranslation } from 'react-i18next';

const serviceConfig = [
  { id: 'hydrographic-survey', icon: Icons.Ship, color: 'blue' },
  { id: 'chart-supply', icon: Icons.Map, color: 'cyan' },
  { id: 'data-processing', icon: Icons.Database, color: 'indigo' },
  { id: 'vessel-positioning', icon: Icons.Navigation, color: 'green' },
  { id: 'training', icon: Icons.GraduationCap, color: 'violet' },
  { id: 'consultation', icon: Icons.Users, color: 'orange' }
];

const reasonsConfig = [
  { id: 'experience', icon: Icons.Award, color: 'blue' },
  { id: 'certified', icon: Icons.Shield, color: 'green' },
  { id: 'team', icon: Icons.Users, color: 'purple' },
  { id: 'support', icon: Icons.Clock, color: 'orange' }
];

const ServicesSection = () => {
  const { t } = useTranslation('maritime');
  const servicesContent = t('services', { returnObjects: true }) || {};
  const services = servicesContent.items || [];
  const statusLabels = servicesContent.statusLabels || {};
  const reasons = servicesContent.reasons || [];

  const getService = (id) => services.find((service) => service.id === id) || {};
  const getReason = (id) => reasons.find((reason) => reason.id === id) || {};

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full mb-4">
            <Icons.Briefcase className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-blue-700 text-sm font-semibold">
              {t('services.badge', 'Professional Maritime Services')}
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {servicesContent.heading}
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {servicesContent.subheading}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {serviceConfig.map((config, index) => {
            const service = getService(config.id);
            const IconComponent = config.icon || Icons.Briefcase;
            const isAvailable = service.status === statusLabels.available;
            const statusClass = isAvailable
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700';

            return (
              <motion.div
                key={config.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-xl hover:border-blue-300 transition-all"
              >
                <div className={`w-14 h-14 bg-${config.color}-100 rounded-xl flex items-center justify-center mb-4`}>
                  <IconComponent className={`w-7 h-7 text-${config.color}-600`} />
                </div>

                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{service.name}</h3>
                  <div className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClass}`}>
                    {service.status}
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{service.startingFrom}</span>
                    <span className={`font-bold text-${config.color}-600`}>{service.price}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{servicesContent.labels?.duration}</span>
                    <span className="font-semibold text-gray-900">{service.duration}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="flex flex-wrap gap-1">
                    {(service.features || []).slice(0, 3).map((feature) => (
                      <span key={feature} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        {feature}
                      </span>
                    ))}
                    {(service.features || []).length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        +{(service.features || []).length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <button className={`w-full py-3 bg-${config.color}-600 text-white rounded-lg font-semibold hover:bg-${config.color}-700 transition-colors flex items-center justify-center space-x-2`}>
                  <Icons.Calendar className="w-4 h-4" />
                  <span>{service.cta}</span>
                </button>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {reasonsConfig.map((config, index) => {
            const reason = getReason(config.id);
            const IconComponent = config.icon || Icons.Award;
            return (
              <motion.div
                key={config.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 text-center border border-gray-200"
              >
                <div className={`w-12 h-12 bg-${config.color}-100 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <IconComponent className={`w-6 h-6 text-${config.color}-600`} />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{reason.title}</div>
                <div className="text-sm text-gray-600">{reason.description}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;
