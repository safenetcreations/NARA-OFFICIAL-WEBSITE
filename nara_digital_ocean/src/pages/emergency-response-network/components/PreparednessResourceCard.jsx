import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PreparednessResourceCard = ({ resource }) => {
  const handleDownload = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
  };

  const getTypeConfig = (type) => {
    switch (type) {
      case 'guide':
        return {
          bgColor: 'bg-blue-50 border-blue-200',
          iconColor: 'text-blue-600',
          icon: 'BookOpen',
          badgeColor: 'bg-blue-600 text-white'
        };
      case 'checklist':
        return {
          bgColor: 'bg-green-50 border-green-200',
          iconColor: 'text-green-600',
          icon: 'CheckSquare',
          badgeColor: 'bg-green-600 text-white'
        };
      case 'video':
        return {
          bgColor: 'bg-purple-50 border-purple-200',
          iconColor: 'text-purple-600',
          icon: 'Play',
          badgeColor: 'bg-purple-600 text-white'
        };
      case 'infographic':
        return {
          bgColor: 'bg-orange-50 border-orange-200',
          iconColor: 'text-orange-600',
          icon: 'Image',
          badgeColor: 'bg-orange-600 text-white'
        };
      default:
        return {
          bgColor: 'bg-slate-50 border-slate-200',
          iconColor: 'text-slate-600',
          icon: 'FileText',
          badgeColor: 'bg-slate-600 text-white'
        };
    }
  };

  const config = getTypeConfig(resource?.type);

  return (
    <div className={`${config?.bgColor} border rounded-lg p-6 interactive-lift`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4">
          <div className={`p-3 bg-white rounded-lg ${config?.iconColor}`}>
            <Icon name={config?.icon} size={24} />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-headline font-bold text-text-primary">
                {resource?.title}
              </h3>
              <span className={`px-2 py-1 rounded text-xs font-cta uppercase tracking-wider ${config?.badgeColor}`}>
                {resource?.type}
              </span>
            </div>
            <p className="text-sm font-body text-text-secondary mb-3">
              {resource?.description}
            </p>
            <div className="flex items-center space-x-4 text-xs font-mono text-text-secondary">
              <span>
                <Icon name="Users" size={12} className="inline mr-1" />
                {resource?.targetAudience}
              </span>
              <span>
                <Icon name="Globe" size={12} className="inline mr-1" />
                {resource?.languages?.join(', ')}
              </span>
              <span>
                <Icon name="Clock" size={12} className="inline mr-1" />
                {resource?.duration || resource?.pages}
              </span>
            </div>
          </div>
        </div>
        {resource?.isNew && (
          <span className="px-2 py-1 bg-coral-warm text-white text-xs font-cta rounded-full animate-pulse">
            New
          </span>
        )}
      </div>
      {/* Key Topics */}
      {resource?.keyTopics && (
        <div className="mb-4">
          <h4 className="font-cta-medium text-sm text-text-primary mb-2">Key Topics Covered:</h4>
          <div className="flex flex-wrap gap-2">
            {resource?.keyTopics?.map((topic, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-white text-text-secondary text-xs font-body rounded border"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}
      {/* Resource Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-white rounded-lg">
        <div className="text-center">
          <div className="font-mono text-lg font-bold text-primary">
            {resource?.downloads || '0'}
          </div>
          <div className="text-xs font-body text-text-secondary">Downloads</div>
        </div>
        <div className="text-center">
          <div className="font-mono text-lg font-bold text-primary">
            {resource?.rating || '4.8'}
          </div>
          <div className="text-xs font-body text-text-secondary">Rating</div>
        </div>
        <div className="text-center">
          <div className="font-mono text-lg font-bold text-primary">
            {resource?.fileSize || 'N/A'}
          </div>
          <div className="text-xs font-body text-text-secondary">Size</div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {resource?.formats?.map((format, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleDownload(format?.url, `${resource?.title}.${format?.type}`)}
              className="text-primary border-primary hover:bg-primary hover:text-white"
            >
              <Icon name="Download" size={14} className="mr-1" />
              {format?.type?.toUpperCase()}
            </Button>
          ))}
        </div>
        
        <div className="flex items-center space-x-2">
          {resource?.previewUrl && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(resource?.previewUrl, '_blank')}
            >
              <Icon name="Eye" size={16} className="mr-1" />
              Preview
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigator.share && navigator.share({
              title: resource?.title,
              text: resource?.description,
              url: window.location?.href
            })}
          >
            <Icon name="Share2" size={16} className="mr-1" />
            Share
          </Button>
        </div>
      </div>
      {/* Last Updated */}
      <div className="mt-4 pt-4 border-t border-white/50">
        <div className="flex items-center justify-between text-xs font-mono text-text-secondary">
          <span>
            Last updated: {resource?.lastUpdated}
          </span>
          <span>
            Version: {resource?.version}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PreparednessResourceCard;