import React from 'react';
import Icon from '../../../components/AppIcon';

const ServiceAvailabilityWidget = () => {
  const availabilityData = [
    {
      service: 'Water Quality Testing',
      status: 'Available',
      nextSlot: 'Today 2:30 PM',
      queue: 0,
      icon: 'Droplets'
    },
    {
      service: 'Environmental Assessment',
      status: 'Limited',
      nextSlot: 'Tomorrow 9:00 AM',
      queue: 3,
      icon: 'Leaf'
    },
    {
      service: 'Marine Survey',
      status: 'Busy',
      nextSlot: 'Dec 22, 10:00 AM',
      queue: 8,
      icon: 'Map'
    },
    {
      service: 'Equipment Calibration',
      status: 'Available',
      nextSlot: 'Today 4:00 PM',
      queue: 1,
      icon: 'Settings'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'text-success bg-success/10 border-success/20';
      case 'Limited':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'Busy':
        return 'text-error bg-error/10 border-error/20';
      default:
        return 'text-text-secondary bg-muted border-border';
    }
  };

  return (
    <div className="bg-card rounded-lg scientific-border ocean-depth-shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-ocean-deep to-ocean-medium rounded-lg flex items-center justify-center">
            <Icon name="Clock" size={20} color="white" />
          </div>
          <div>
            <h3 className="font-headline text-lg font-bold text-text-primary">Real-Time Availability</h3>
            <p className="text-sm text-text-secondary">Current service status and queue times</p>
          </div>
        </div>
        <div className="text-xs text-text-secondary">
          Updated: {new Date()?.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
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
                <div className="text-xs text-text-secondary">Next: {item?.nextSlot}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {item?.queue > 0 && (
                <div className="flex items-center space-x-1 text-xs text-text-secondary">
                  <Icon name="Users" size={12} />
                  <span>{item?.queue} in queue</span>
                </div>
              )}
              <div className={`px-2 py-1 rounded-full text-xs font-cta-medium border ${getStatusColor(item?.status)}`}>
                {item?.status}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-ocean-deep/5 rounded-lg border border-ocean-deep/10">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={16} className="text-ocean-deep mt-0.5" />
          <div>
            <div className="font-cta-medium text-sm text-text-primary mb-1">Quick Booking Tips</div>
            <ul className="text-xs text-text-secondary space-y-1">
              <li>• Book 2-3 days in advance for standard services</li>
              <li>• Priority booking available for urgent needs (+50% fee)</li>
              <li>• Group discounts available for fishing cooperatives</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceAvailabilityWidget;