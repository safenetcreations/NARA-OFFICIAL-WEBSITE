import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmergencyAlertBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [alertData] = useState({
    type: 'weather',
    severity: 'moderate',
    title: 'Moderate Sea Conditions Advisory',
    message: 'Southwest monsoon conditions expected. Wave heights 2-3m in deep sea areas. Small fishing boats advised to stay close to shore.',
    validUntil: '2025-01-20 18:00',
    affectedAreas: ['Colombo', 'Galle', 'Matara', 'Hambantota'],
    issuedBy: 'NARA Marine Weather Division',
    alertId: 'NARA-WX-2025-001'
  });

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
                {alertData?.severity}
              </div>
            </div>
            
            <p className="font-body mb-3">{alertData?.message}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-cta-medium mb-1">Affected Areas:</div>
                <div className="font-body opacity-90">{alertData?.affectedAreas?.join(', ')}</div>
              </div>
              <div>
                <div className="font-cta-medium mb-1">Valid Until:</div>
                <div className="font-body opacity-90">
                  {new Date(alertData.validUntil)?.toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="text-xs opacity-75">
                Issued by {alertData?.issuedBy} • Alert ID: {alertData?.alertId}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-current hover:bg-white/20"
                  iconName="ExternalLink"
                  iconPosition="right"
                >
                  Full Details
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-current hover:bg-white/20"
                  iconName="Bell"
                >
                  Subscribe
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