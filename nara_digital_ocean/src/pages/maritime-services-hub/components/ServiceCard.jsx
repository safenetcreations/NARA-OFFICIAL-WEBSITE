import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ServiceCard = ({ service, onBookService }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'text-success bg-success/10';
      case 'Limited':
        return 'text-warning bg-warning/10';
      case 'Busy':
        return 'text-error bg-error/10';
      default:
        return 'text-text-secondary bg-muted';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(price);
  };

  return (
    <div className="bg-card rounded-lg scientific-border ocean-depth-shadow interactive-lift p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-ocean-deep to-ocean-medium rounded-lg flex items-center justify-center">
            <Icon name={service?.icon} size={24} color="white" />
          </div>
          <div>
            <h3 className="font-headline text-lg font-bold text-text-primary">{service?.name}</h3>
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-cta-medium ${getStatusColor(service?.status)}`}>
              <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
              {service?.status}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-headline text-xl font-bold text-primary">{formatPrice(service?.price)}</div>
          <div className="text-sm text-text-secondary">{service?.duration}</div>
        </div>
      </div>
      <p className="font-body text-text-secondary mb-4 line-clamp-3">{service?.description}</p>
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="font-cta text-text-secondary">Turnaround Time:</span>
          <span className="font-cta-medium text-text-primary">{service?.turnaroundTime}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="font-cta text-text-secondary">Next Available:</span>
          <span className="font-cta-medium text-text-primary">{service?.nextAvailable}</span>
        </div>
        {service?.queueTime && (
          <div className="flex items-center justify-between text-sm">
            <span className="font-cta text-text-secondary">Current Queue:</span>
            <span className="font-cta-medium text-warning">{service?.queueTime}</span>
          </div>
        )}
      </div>
      <div className="flex items-center space-x-3">
        <Button
          variant="default"
          className="flex-1"
          iconName="Calendar"
          iconPosition="left"
          onClick={() => onBookService(service)}
        >
          Book Service
        </Button>
        <Button
          variant="outline"
          size="default"
          iconName="Info"
          onClick={() => window.open(`#service-${service?.id}`, '_self')}
        >
        </Button>
      </div>
      {service?.specialOffer && (
        <div className="mt-4 p-3 bg-accent/10 rounded-lg border border-accent/20">
          <div className="flex items-center space-x-2">
            <Icon name="Tag" size={16} className="text-accent" />
            <span className="font-cta-medium text-sm text-accent">{service?.specialOffer}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceCard;