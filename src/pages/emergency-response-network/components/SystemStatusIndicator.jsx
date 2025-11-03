import React from 'react';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';

const STATUS_THEMES = {
  operational: {
    label: 'Operational',
    chip: 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-200',
    icon: 'CheckCircle',
    accent: 'text-emerald-300',
    card: 'bg-slate-900/70 border border-emerald-500/20 shadow-[0px_20px_40px_rgba(16,185,129,0.15)]'
  },
  degraded: {
    label: 'Degraded',
    chip: 'bg-amber-500/20 border border-amber-500/40 text-amber-200',
    icon: 'AlertCircle',
    accent: 'text-amber-300',
    card: 'bg-slate-900/70 border border-amber-500/20 shadow-[0px_20px_40px_rgba(245,158,11,0.15)]'
  },
  outage: {
    label: 'Outage',
    chip: 'bg-rose-500/20 border border-rose-500/40 text-rose-200',
    icon: 'XCircle',
    accent: 'text-rose-300',
    card: 'bg-slate-900/70 border border-rose-500/20 shadow-[0px_20px_40px_rgba(244,63,94,0.2)]'
  },
  maintenance: {
    label: 'Maintenance',
    chip: 'bg-sky-500/20 border border-sky-500/40 text-sky-200',
    icon: 'Settings',
    accent: 'text-sky-300',
    card: 'bg-slate-900/70 border border-sky-500/20 shadow-[0px_20px_40px_rgba(56,189,248,0.18)]'
  },
  default: {
    label: 'Unknown',
    chip: 'bg-slate-500/20 border border-slate-500/40 text-slate-200',
    icon: 'HelpCircle',
    accent: 'text-slate-300',
    card: 'bg-slate-900/70 border border-white/10'
  }
};

const SystemStatusIndicator = ({ systems }) => {
  const getStatusTheme = (status) => STATUS_THEMES[status] ?? STATUS_THEMES.default;

  const overallStatus = systems?.every((system) => system?.status === 'operational')
    ? 'operational'
    : systems?.some((system) => system?.status === 'outage')
    ? 'outage'
    : systems?.some((system) => system?.status === 'degraded')
    ? 'degraded'
    : 'maintenance';

  const overallTheme = getStatusTheme(overallStatus);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/85 shadow-[0px_45px_90px_rgba(2,6,23,0.55)] backdrop-blur-lg">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_60%)]" />
      <div className="relative border-b border-white/10 px-6 py-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-headline font-bold text-white">System Status</h2>
          <div className={cn('flex items-center gap-2 rounded-full px-3 py-1 text-xs font-cta uppercase tracking-[0.25em]', overallTheme.chip)}>
            <Icon name={overallTheme.icon} size={14} />
            {overallTheme.label}
          </div>
        </div>
        <p className="mt-2 text-xs font-body text-white/60">
          Real-time status of emergency response systems and communication networks
        </p>
      </div>

      <div className="relative px-6 py-6 space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {systems?.map((system, index) => {
            const theme = getStatusTheme(system?.status);

            return (
              <div key={index} className={cn('rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1', theme.card)}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={cn('rounded-xl bg-white/10 p-2', theme.accent)}>
                      <Icon name={system?.icon} size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-cta-medium text-white">{system?.name}</h3>
                      <p className="mt-1 text-xs font-body text-white/60">{system?.description}</p>
                    </div>
                  </div>
                  <span className={cn('rounded-full px-2 py-1 text-[11px] font-cta', theme.chip)}>
                    <Icon name={theme.icon} size={12} className="mr-1 inline" />
                    {theme.label}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-black/20 p-2 text-center">
                    <div className="font-mono text-sm font-bold text-white">{system?.uptime}</div>
                    <div className="text-[11px] text-white/50">Uptime</div>
                  </div>
                  <div className="rounded-lg bg-black/20 p-2 text-center">
                    <div className="font-mono text-sm font-bold text-white">{system?.responseTime}</div>
                    <div className="text-[11px] text-white/50">Response</div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-white/50">
                  <span>Last check: {system?.lastCheck}</span>
                  {system?.nextMaintenance ? <span>Next maintenance: {system?.nextMaintenance}</span> : null}
                </div>

                {system?.statusMessage ? (
                  <div className="mt-3 rounded-lg bg-black/20 px-3 py-2 text-[11px] text-white/70">
                    {system?.statusMessage}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-4 shadow-inner">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-cta-medium uppercase tracking-[0.25em] text-white/60">
                  System Testing Schedule
                </h3>
                <p className="mt-1 text-sm font-body text-white/70">
                  Regular testing ensures reliability during emergencies
                </p>
              </div>
              <div className="text-right">
                <div className="font-mono text-sm font-bold text-white">Next Test: Dec 25, 2025</div>
                <div className="text-xs text-white/50">Monthly drill at 10:00 AM</div>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/40 px-4 py-4 shadow-inner">
            <h3 className="text-xs font-cta-medium uppercase tracking-[0.25em] text-emerald-200">
              30-Day Performance
            </h3>
            <div className="mt-3 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="font-mono text-lg font-bold text-white">99.8%</div>
                <div className="text-[11px] text-emerald-200/80">Average Uptime</div>
              </div>
              <div>
                <div className="font-mono text-lg font-bold text-white">1.2s</div>
                <div className="text-[11px] text-emerald-200/80">Avg Response</div>
              </div>
              <div>
                <div className="font-mono text-lg font-bold text-white">0</div>
                <div className="text-[11px] text-emerald-200/80">Critical Issues</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemStatusIndicator;
