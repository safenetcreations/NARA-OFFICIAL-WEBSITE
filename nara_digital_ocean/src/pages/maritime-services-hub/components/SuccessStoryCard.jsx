import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const SuccessStoryCard = ({ story }) => {
  const getBusinessTypeColor = (type) => {
    switch (type) {
      case 'Fishing Cooperative':
        return 'text-ocean-medium bg-ocean-medium/10';
      case 'Aquaculture':
        return 'text-ocean-light bg-ocean-light/10';
      case 'Shipping Company':
        return 'text-coral-warm bg-coral-warm/10';
      case 'Marine Tourism':
        return 'text-success bg-success/10';
      default:
        return 'text-text-secondary bg-muted';
    }
  };

  return (
    <div className="bg-card rounded-lg scientific-border ocean-depth-shadow interactive-lift overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={story?.image}
          alt={story?.businessName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-cta-medium ${getBusinessTypeColor(story?.businessType)} mb-2`}>
            {story?.businessType}
          </div>
          <h3 className="font-headline text-lg font-bold text-white">{story?.businessName}</h3>
          <p className="text-sm text-white/80">{story?.location}</p>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Quote" size={20} className="text-accent" />
          <span className="font-cta text-sm text-text-secondary">Success Story</span>
        </div>

        <p className="font-body text-text-secondary mb-4 line-clamp-3">{story?.testimonial}</p>

        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <span className="font-cta text-sm text-text-secondary">Service Used:</span>
            <span className="font-cta-medium text-sm text-text-primary">{story?.serviceUsed}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-cta text-sm text-text-secondary">Impact:</span>
            <span className="font-cta-medium text-sm text-success">{story?.impact}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-cta text-sm text-text-secondary">Timeline:</span>
            <span className="font-cta-medium text-sm text-text-primary">{story?.timeline}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-ocean-deep to-ocean-medium rounded-full flex items-center justify-center">
              <Icon name="User" size={16} color="white" />
            </div>
            <div>
              <div className="font-cta-medium text-sm text-text-primary">{story?.contactPerson}</div>
              <div className="text-xs text-text-secondary">{story?.position}</div>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-warning">
            {[...Array(5)]?.map((_, i) => (
              <Icon
                key={i}
                name="Star"
                size={14}
                className={i < story?.rating ? 'text-warning' : 'text-muted'}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessStoryCard;