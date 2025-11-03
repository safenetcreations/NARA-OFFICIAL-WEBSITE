import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertCard = ({ alert, onViewDetails, onDismiss }) => {
  const getSeverityConfig = (severity) => {
    switch (severity) {
      case 'critical':
        return {
          bgColor: 'bg-red-50 border-red-200',
          iconColor: 'text-red-600',
          textColor: 'text-red-900',
          badgeColor: 'bg-red-600 text-white',
          icon: 'AlertTriangle'
        };
      case 'high':
        return {
          bgColor: 'bg-orange-50 border-orange-200',
          iconColor: 'text-orange-600',
          textColor: 'text-orange-900',
          badgeColor: 'bg-orange-600 text-white',
          icon: 'AlertCircle'
        };
      case 'medium':
        return {
          bgColor: 'bg-yellow-50 border-yellow-200',
          iconColor: 'text-yellow-600',
          textColor: 'text-yellow-900',
          badgeColor: 'bg-yellow-600 text-white',
          icon: 'AlertTriangle'
        };
      default:
        return {
          bgColor: 'bg-blue-50 border-blue-200',
          iconColor: 'text-blue-600',
          textColor: 'text-blue-900',
          badgeColor: 'bg-blue-600 text-white',
          icon: 'Info'
        };
    }
  };

  const config = getSeverityConfig(alert?.severity);

  return (
    <div className={`${config?.bgColor} border-2 rounded-lg p-6 mb-4 animate-depth-reveal`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4">
          <div className={`p-2 rounded-full bg-white ${config?.iconColor}`}>
            <Icon name={config?.icon} size={24} />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className={`text-lg font-headline font-bold ${config?.textColor}`}>
                {alert?.title}
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-cta uppercase tracking-wider ${config?.badgeColor}`}>
                {alert?.severity}
              </span>
            </div>
            <p className={`text-sm font-body ${config?.textColor} opacity-80 mb-3`}>
              {alert?.description}
            </p>
            <div className="flex items-center space-x-4 text-xs font-mono">
              <span className={`${config?.textColor} opacity-70`}>
                <Icon name="MapPin" size={14} className="inline mr-1" />
                {alert?.location}
              </span>
              <span className={`${config?.textColor} opacity-70`}>
                <Icon name="Clock" size={14} className="inline mr-1" />
                {alert?.timestamp}
              </span>
            </div>
          </div>
        </div>
        {alert?.canDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDismiss(alert?.id)}
            className="opacity-60 hover:opacity-100"
          >
            <Icon name="X" size={16} />
          </Button>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {alert?.affectedAreas && (
            <span className={`text-xs font-cta ${config?.textColor} opacity-70`}>
              Affected: {alert?.affectedAreas?.join(', ')}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(alert)}
            className={`border-current ${config?.textColor}`}
          >
            <Icon name="Eye" size={16} className="mr-2" />
            View Details
          </Button>
          {alert?.hasMap && (
            <Button
              variant="default"
              size="sm"
              className={`${config?.badgeColor}`}
            >
              <Icon name="Map" size={16} className="mr-2" />
              View Map
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertCard;