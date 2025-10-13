import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { cn } from '../../../utils/cn';

const EmergencyContactCard = ({ contact }) => {
  const handleCall = (number) => {
    window.open(`tel:${number}`, '_self');
  };

  const handleSMS = (number) => {
    window.open(`sms:${number}`, '_self');
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-[0px_35px_70px_rgba(2,6,23,0.55)] transition-all duration-300 hover:-translate-y-1">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_55%)]" />
      <div className="relative flex items-start justify-between mb-5">
        <div className="flex items-start gap-4">
          <div className={cn('rounded-2xl bg-white/10 p-3', contact?.iconColor ?? 'text-primary')}>
            <Icon name={contact?.icon} size={24} />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-headline font-bold text-white">
              {contact?.name}
            </h3>
            <p className="text-sm font-body text-white/60">
              {contact?.description}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-white/50">
              <span>
                <Icon name="Clock" size={12} className="mr-1 inline" />
                {contact?.availability}
              </span>
              {contact?.languages ? (
                <span>
                  <Icon name="Globe" size={12} className="mr-1 inline" />
                  {contact?.languages?.join(', ')}
                </span>
              ) : null}
            </div>
          </div>
        </div>
        {contact?.priority ? (
          <span className="rounded-full border border-red-500/40 bg-red-500/20 px-3 py-1 text-xs font-cta uppercase tracking-[0.3em] text-red-100">
            Priority
          </span>
        ) : null}
      </div>
      <div className="relative space-y-3">
        {contact?.phones?.map((phone, index) => (
          <div
            key={index}
            className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-white/80 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="space-y-1">
              <div className="font-cta-medium text-sm text-white">
                {phone?.label}
              </div>
              <div className="font-mono text-lg text-cyan-300 font-bold">
                {phone?.number}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCall(phone?.number)}
                className="border-white/30 text-emerald-200 hover:bg-emerald-500/20 hover:text-emerald-100"
              >
                <Icon name="Phone" size={16} className="mr-1" />
                Call
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSMS(phone?.number)}
                className="border-white/30 text-sky-200 hover:bg-sky-500/20 hover:text-sky-100"
              >
                <Icon name="MessageSquare" size={16} className="mr-1" />
                SMS
              </Button>
            </div>
          </div>
        ))}
      </div>
      {contact?.email && (
        <div className="relative mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-cta-medium text-sm text-white mb-1">
                Email Contact
              </div>
              <div className="font-mono text-sm text-cyan-200">
                {contact?.email}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`mailto:${contact?.email}`, '_self')}
              className="border-white/30 text-cyan-200 hover:bg-cyan-500/20 hover:text-cyan-100"
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
