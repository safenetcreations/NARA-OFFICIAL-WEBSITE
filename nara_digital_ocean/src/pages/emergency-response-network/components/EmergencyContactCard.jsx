import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmergencyContactCard = ({ contact }) => {
  const handleCall = (number) => {
    window.open(`tel:${number}`, '_self');
  };

  const handleSMS = (number) => {
    window.open(`sms:${number}`, '_self');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 ocean-depth-shadow hover:shadow-lg transition-all duration-ocean">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4">
          <div className={`p-3 rounded-full ${contact?.bgColor}`}>
            <Icon name={contact?.icon} size={24} className={contact?.iconColor} />
          </div>
          <div>
            <h3 className="text-lg font-headline font-bold text-text-primary mb-1">
              {contact?.name}
            </h3>
            <p className="text-sm font-body text-text-secondary mb-2">
              {contact?.description}
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-xs font-mono text-text-secondary">
                <Icon name="Clock" size={12} className="inline mr-1" />
                {contact?.availability}
              </span>
              {contact?.languages && (
                <span className="text-xs font-mono text-text-secondary">
                  <Icon name="Globe" size={12} className="inline mr-1" />
                  {contact?.languages?.join(', ')}
                </span>
              )}
            </div>
          </div>
        </div>
        {contact?.priority && (
          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-cta rounded-full">
            Priority
          </span>
        )}
      </div>
      <div className="space-y-3">
        {contact?.phones?.map((phone, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div>
              <div className="font-cta-medium text-sm text-text-primary">
                {phone?.label}
              </div>
              <div className="font-mono text-lg text-primary font-bold">
                {phone?.number}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCall(phone?.number)}
                className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
              >
                <Icon name="Phone" size={16} className="mr-1" />
                Call
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSMS(phone?.number)}
                className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
              >
                <Icon name="MessageSquare" size={16} className="mr-1" />
                SMS
              </Button>
            </div>
          </div>
        ))}
      </div>
      {contact?.email && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-cta-medium text-sm text-text-primary mb-1">
                Email Contact
              </div>
              <div className="font-mono text-sm text-blue-700">
                {contact?.email}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`mailto:${contact?.email}`, '_self')}
              className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
            >
              <Icon name="Mail" size={16} className="mr-1" />
              Email
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyContactCard;