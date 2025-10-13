import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { cn } from '../../../utils/cn';

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
          accent: 'text-sky-300',
          chip: 'bg-sky-500/20 border border-sky-500/40 text-sky-100',
          icon: 'BookOpen',
          card: 'from-slate-900/90 via-slate-950/85 to-sky-950/40'
        };
      case 'checklist':
        return {
          accent: 'text-emerald-300',
          chip: 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-100',
          icon: 'CheckSquare',
          card: 'from-slate-900/90 via-slate-950/85 to-emerald-950/40'
        };
      case 'video':
        return {
          accent: 'text-violet-300',
          chip: 'bg-violet-500/20 border border-violet-500/40 text-violet-100',
          icon: 'Play',
          card: 'from-slate-900/90 via-slate-950/85 to-violet-950/40'
        };
      case 'infographic':
        return {
          accent: 'text-amber-300',
          chip: 'bg-amber-500/20 border border-amber-500/40 text-amber-100',
          icon: 'Image',
          card: 'from-slate-900/90 via-slate-950/85 to-amber-950/40'
        };
      default:
        return {
          accent: 'text-slate-300',
          chip: 'bg-slate-500/20 border border-slate-500/40 text-slate-100',
          icon: 'FileText',
          card: 'from-slate-900/90 via-slate-950/85 to-slate-900/40'
        };
    }
  };

  const config = getTypeConfig(resource?.type);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br p-6 shadow-[0px_35px_70px_rgba(2,6,23,0.55)] transition-transform duration-300 hover:-translate-y-1"
      style={{
        backgroundImage: `linear-gradient(135deg, ${config?.card || 'rgba(15,23,42,0.9)'}, rgba(8,10,23,0.8))`
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.06),_transparent_55%)]" />
      <div className="relative mb-5 flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className={cn('rounded-2xl bg-black/30 p-3', config?.accent)}>
            <Icon name={config?.icon} size={24} />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-lg font-headline font-bold text-white">
                {resource?.title}
              </h3>
              <span className={cn('rounded-full px-3 py-1 text-[11px] font-cta uppercase tracking-[0.3em]', config?.chip)}>
                {resource?.type}
              </span>
            </div>
            <p className="text-sm font-body text-white/60">
              {resource?.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-white/45">
              <span>
                <Icon name="Users" size={12} className="mr-1 inline" />
                {resource?.targetAudience}
              </span>
              <span>
                <Icon name="Globe" size={12} className="mr-1 inline" />
                {resource?.languages?.join(', ')}
              </span>
              <span>
                <Icon name="Clock" size={12} className="mr-1 inline" />
                {resource?.duration || resource?.pages}
              </span>
            </div>
          </div>
        </div>
        {resource?.isNew ? (
          <span className="rounded-full border border-emerald-500/40 bg-emerald-500/20 px-3 py-1 text-xs font-cta uppercase tracking-[0.3em] text-emerald-100 animate-pulse">
            New
          </span>
        ) : null}
      </div>
      {/* Key Topics */}
      {resource?.keyTopics && (
        <div className="relative mb-4">
          <h4 className="font-cta-medium text-xs uppercase tracking-[0.3em] text-white/60 mb-2">Key Topics</h4>
          <div className="flex flex-wrap gap-2">
            {resource?.keyTopics?.map((topic, index) => (
              <span
                key={index}
                className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs font-body text-white/60"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}
      {/* Resource Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4 rounded-2xl border border-white/10 bg-black/20 p-3 text-center text-white">
        <div className="text-center">
          <div className="font-mono text-lg font-bold text-white">
            {resource?.downloads || '0'}
          </div>
          <div className="text-[11px] font-body text-white/50">Downloads</div>
        </div>
        <div className="text-center">
          <div className="font-mono text-lg font-bold text-white">
            {resource?.rating || '4.8'}
          </div>
          <div className="text-[11px] font-body text-white/50">Rating</div>
        </div>
        <div className="text-center">
          <div className="font-mono text-lg font-bold text-white">
            {resource?.fileSize || 'N/A'}
          </div>
          <div className="text-[11px] font-body text-white/50">Size</div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-2">
          {resource?.formats?.map((format, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleDownload(format?.url, `${resource?.title}.${format?.type}`)}
              className="border-white/20 text-white hover:bg-white/10"
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
              className="text-white hover:bg-white/10"
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
            className="text-white hover:bg-white/10"
          >
            <Icon name="Share2" size={16} className="mr-1" />
            Share
          </Button>
        </div>
      </div>
      {/* Last Updated */}
      <div className="mt-4 border-t border-white/10 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-white/50">
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
