import React, { useMemo, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useTranslation } from 'react-i18next';

const EmergencyAlertBanner = () => {
  const { t, i18n } = useTranslation('maritime');
  const [isVisible, setIsVisible] = useState(true);
  const alertData = useMemo(
    () => ({
      type: 'weather',
      severity: 'moderate',
      title: t('alertsBanner.title'),
      message: t('alertsBanner.message'),
      validUntil: '2025-01-20T18:00:00+05:30',
      affectedAreas: t('alertsBanner.affectedAreas', { returnObjects: true }),
      issuedBy: t('alertsBanner.issuedBy'),
      alertId: 'NARA-WX-2025-001'
    }),
    [t]
  );

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-error text-error-foreground border-error';
      case 'high':
        return 'bg-warning text-warning-foreground border-warning';
      case 'moderate':
        return 'bg-ocean-medium text-white border-ocean-medium';
      default:
        return 'bg-muted text-text-primary border-border';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return 'AlertTriangle';
      case 'high':
        return 'AlertCircle';
      case 'moderate':
        return 'Info';
      default:
        return 'Bell';
    }
  };

  if (!isVisible) return null;

  const locale =
    i18n.language === 'si' ? 'si-LK' : i18n.language === 'ta' ? 'ta-LK' : 'en-US';

  return (
    <div className={`rounded-lg border-2 p-4 mb-6 ${getSeverityColor(alertData?.severity)}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <Icon name={getSeverityIcon(alertData?.severity)} size={24} className="animate-pulse" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-headline text-lg font-bold">{alertData?.title}</h3>
              <div className="px-2 py-1 bg-white/20 rounded-full text-xs font-cta-medium uppercase">
                {t(`alerts.severity.${alertData?.severity}`)}
              </div>
            </div>
            
            <p className="font-body mb-3">{alertData?.message}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-cta-medium mb-1">
                  {t('alertsBanner.labels.affectedAreas')}
                </div>
                <div className="font-body opacity-90">{alertData?.affectedAreas?.join(', ')}</div>
              </div>
              <div>
                <div className="font-cta-medium mb-1">
                  {t('alertsBanner.labels.validUntil')}
                </div>
                <div className="font-body opacity-90">
                  {new Date(alertData.validUntil)?.toLocaleString(locale, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                    timeZone: 'Asia/Colombo'
                  })}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="text-xs opacity-75">
                {t('alertsBanner.labels.issuedBy', {
                  issuer: alertData?.issuedBy,
                  id: alertData?.alertId
                })}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-current hover:bg-white/20"
                  iconName="ExternalLink"
                  iconPosition="right"
                >
                  {t('alertsBanner.buttons.details')}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-current hover:bg-white/20"
                  iconName="Bell"
                >
                  {t('alertsBanner.buttons.subscribe')}
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="text-current hover:bg-white/20 flex-shrink-0"
          onClick={() => setIsVisible(false)}
        >
          <Icon name="X" size={20} />
        </Button>
      </div>
    </div>
  );
};

export default EmergencyAlertBanner;
