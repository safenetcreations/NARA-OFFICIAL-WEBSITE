import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const IndustryInsightCard = ({ insight }) => {
  const getInsightTypeColor = (type) => {
    switch (type) {
      case 'Fishing':
        return 'text-ocean-medium bg-ocean-medium/10';
      case 'Aquaculture':
        return 'text-ocean-light bg-ocean-light/10';
      case 'Shipping':
        return 'text-coral-warm bg-coral-warm/10';
      default:
        return 'text-text-secondary bg-muted';
    }
  };

  return (
    <div className="bg-card rounded-lg scientific-border ocean-depth-shadow interactive-lift p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-ocean-deep to-ocean-medium rounded-lg flex items-center justify-center">
            <Icon name={insight?.icon} size={20} color="white" />
          </div>
          <div>
            <h3 className="font-headline text-lg font-bold text-text-primary">{insight?.title}</h3>
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-cta-medium ${getInsightTypeColor(insight?.type)}`}>
              {insight?.type}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-text-secondary">Updated</div>
          <div className="font-cta-medium text-sm text-text-primary">{insight?.lastUpdated}</div>
        </div>
      </div>
      <p className="font-body text-text-secondary mb-4">{insight?.description}</p>
      <div className="space-y-3 mb-6">
        {insight?.keyMetrics?.map((metric, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="font-cta text-sm text-text-secondary">{metric?.label}:</span>
            <span className={`font-cta-medium text-sm ${metric?.trend === 'up' ? 'text-success' : metric?.trend === 'down' ? 'text-error' : 'text-text-primary'}`}>
              {metric?.value}
              {metric?.trend && (
                <Icon 
                  name={metric?.trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                  size={14} 
                  className="inline ml-1" 
                />
              )}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          className="flex-1"
          iconName="ExternalLink"
          iconPosition="right"
        >
          View Full Report
        </Button>
        <Button
          variant="ghost"
          size="default"
          iconName="Download"
        >
        </Button>
      </div>
    </div>
  );
};

export default IndustryInsightCard;