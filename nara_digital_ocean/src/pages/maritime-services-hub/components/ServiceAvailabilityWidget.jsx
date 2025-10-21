import React, { useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import { useTranslation } from 'react-i18next';

const ServiceAvailabilityWidget = () => {
  const { t, i18n } = useTranslation('maritime');

  const availabilityData = useMemo(() => {
    const items = [
      {
        key: 'waterQuality',
        status: 'available',
        nextSlotKey: 'today230',
        queue: 0,
        icon: 'Droplets'
      },
      {
        key: 'environmentalAssessment',
        status: 'limited',
        nextSlotKey: 'tomorrow900',
        queue: 3,
        icon: 'Leaf'
      },
      {
        key: 'marineSurvey',
        status: 'busy',
        nextSlotKey: 'dec22',
        queue: 8,
        icon: 'Map'
      },
      {
        key: 'equipmentCalibration',
        status: 'available',
        nextSlotKey: 'today400',
        queue: 1,
        icon: 'Settings'
      }
    ];

    return items.map((item) => ({
      ...item,
      service: t(`serviceAvailability.items.${item.key}.service`),
      nextSlot: t(`serviceAvailability.items.${item.key}.nextSlot`),
      statusLabel: t(`serviceCard.status.${item.status}`),
      queueLabel: t('serviceAvailability.queue', { count: item.queue })
    }));
  }, [t]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'text-success bg-success/10 border-success/20';
      case 'limited':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'busy':
        return 'text-error bg-error/10 border-error/20';
      default:
        return 'text-text-secondary bg-muted border-border';
    }
  };

  const locale =
    i18n.language === 'si' ? 'si-LK' : i18n.language === 'ta' ? 'ta-LK' : 'en-US';

  return (
    <div className="bg-card rounded-lg scientific-border ocean-depth-shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-ocean-deep to-ocean-medium rounded-lg flex items-center justify-center">
            <Icon name="Clock" size={20} color="white" />
          </div>
          <div>
            <h3 className="font-headline text-lg font-bold text-text-primary">
              {t('serviceAvailability.title')}
            </h3>
            <p className="text-sm text-text-secondary">
              {t('serviceAvailability.subtitle')}
            </p>
          </div>
        </div>
        <div className="text-xs text-text-secondary">
          {t('serviceAvailability.updated', {
            time: new Date()?.toLocaleTimeString(locale, {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
              timeZone: 'Asia/Colombo'
            })
          })}
        </div>
      </div>
      <div className="space-y-4">
        {availabilityData?.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-ocean-light to-ocean-medium rounded-lg flex items-center justify-center">
                <Icon name={item?.icon} size={16} color="white" />
              </div>
              <div>
                <div className="font-cta-medium text-sm text-text-primary">{item?.service}</div>
                <div className="text-xs text-text-secondary">
                  {t('serviceAvailability.next', { slot: item?.nextSlot })}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {item?.queue > 0 && (
                <div className="flex items-center space-x-1 text-xs text-text-secondary">
                  <Icon name="Users" size={12} />
                  <span>{item?.queueLabel}</span>
                </div>
              )}
              <div className={`px-2 py-1 rounded-full text-xs font-cta-medium border ${getStatusColor(item?.status)}`}>
                {item?.statusLabel}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-ocean-deep/5 rounded-lg border border-ocean-deep/10">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={16} className="text-ocean-deep mt-0.5" />
          <div>
            <div className="font-cta-medium text-sm text-text-primary mb-1">
              {t('serviceAvailability.tips.title')}
            </div>
            <ul className="text-xs text-text-secondary space-y-1">
              {t('serviceAvailability.tips.items', { returnObjects: true })?.map((tip, idx) => (
                <li key={idx}>• {tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceAvailabilityWidget;
