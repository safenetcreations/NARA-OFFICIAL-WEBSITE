import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import AlertCard from './components/AlertCard';
import EmergencyContactCard from './components/EmergencyContactCard';
import PreparednessResourceCard from './components/PreparednessResourceCard';
import SystemStatusIndicator from './components/SystemStatusIndicator';
import EvacuationMap from './components/EvacuationMap';
import usePageContent from '../../hooks/usePageContent';
import { EMERGENCY_RESPONSE_CONTENT } from './content';
import {
  submitEmergencyIncident,
  submitNonEmergencyRequest,
  submitEnvironmentalIncident
} from '../../services/emergencyResponseService';
import { cn } from '../../utils/cn';

const DEFAULT_HERO_IMAGE = 'https://images.unsplash.com/photo-1526481280695-3c46917d3e05?w=1600&h=900&fit=crop&auto=format&q=80';

const HeroCarousel = ({ images = [], title }) => {
  const validImages = images.filter(Boolean);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (validImages.length <= 1) return undefined;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % validImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [validImages.length]);

  const goTo = (direction) => {
    if (validImages.length <= 1) return;
    setIndex((prev) => {
      const next = prev + direction;
      if (next < 0) return validImages.length - 1;
      return next % validImages.length;
    });
  };

  const currentImages = validImages.length ? validImages : [DEFAULT_HERO_IMAGE];

  return (
    <div className="relative h-[320px] lg:h-[420px] overflow-hidden rounded-3xl border border-white/10 shadow-[0px_40px_90px_rgba(8,12,23,0.55)]">
      {currentImages.map((src, idx) => (
        <img
          key={`${src}-${idx}`}
          src={src}
          alt={`${title ?? 'Emergency response'} ${idx + 1}`}
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition-opacity duration-700',
            idx === index ? 'opacity-100' : 'opacity-0'
          )}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-black/30" />
      {currentImages.length > 1 ? (
        <>
          <button
            type="button"
            onClick={() => goTo(-1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-black/40 p-2 text-white backdrop-blur-sm transition hover:bg-black/70"
          >
            <Icon name="ChevronLeft" size={18} />
          </button>
          <button
            type="button"
            onClick={() => goTo(1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-black/40 p-2 text-white backdrop-blur-sm transition hover:bg-black/70"
          >
            <Icon name="ChevronRight" size={18} />
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
            {currentImages.map((_, dotIndex) => (
              <span
                key={dotIndex}
                className={cn(
                  'h-1.5 w-6 rounded-full bg-white/30 transition-all duration-300',
                  dotIndex === index && 'bg-white'
                )}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
};

const ReportsLayout = ({ children }) => (
  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start" id="incident-reporting">
    {children}
  </div>
);

const toneStyles = {
  default: {
    card: 'bg-slate-900/80 border border-white/10 text-white shadow-[0px_25px_65px_rgba(15,23,42,0.45)] backdrop-blur-md',
    heading: 'text-white',
    subheading: 'text-white/70',
    label: 'text-white/80',
    input: 'bg-slate-900/60 border border-white/15 text-white placeholder:text-white/40 focus:border-primary focus:ring-primary/30',
    file: 'bg-slate-900/60 border border-dashed border-white/20 text-white/70',
    support: 'text-white/60',
    buttonVariant: 'secondary',
    buttonClass: 'shadow-lg shadow-primary/20 border border-white/10',
    success: 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-200',
    successIcon: 'text-emerald-300',
    error: 'bg-red-500/10 border border-red-500/30 text-red-200',
    errorIcon: 'text-red-200'
  },
  critical: {
    card: 'bg-[#1b0c0c]/90 border border-red-500/40 text-rose-100 shadow-[0px_25px_65px_rgba(56,11,11,0.55)] backdrop-blur-md',
    heading: 'text-rose-100',
    subheading: 'text-rose-200/80',
    label: 'text-rose-200',
    input: 'bg-[#2a1414]/70 border border-red-500/40 text-rose-100 placeholder:text-rose-100/40 focus:border-red-400 focus:ring-red-400/30',
    file: 'bg-[#2a1414]/70 border border-dashed border-red-500/30 text-rose-100/70',
    support: 'text-rose-200/80',
    buttonVariant: 'danger',
    buttonClass: 'shadow-lg shadow-red-500/30 border border-red-500/40',
    success: 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-200',
    successIcon: 'text-emerald-300',
    error: 'bg-red-500/15 border border-red-500/40 text-red-100',
    errorIcon: 'text-red-200'
  },
  environmental: {
    card: 'bg-teal-950/80 border border-teal-500/30 text-teal-100 shadow-[0px_25px_65px_rgba(12,39,39,0.5)] backdrop-blur-md',
    heading: 'text-teal-100',
    subheading: 'text-teal-200/80',
    label: 'text-teal-200',
    input: 'bg-teal-950/60 border border-teal-500/30 text-teal-100 placeholder:text-teal-100/40 focus:border-emerald-400 focus:ring-emerald-400/30',
    file: 'bg-teal-950/60 border border-dashed border-teal-500/30 text-teal-100/70',
    support: 'text-teal-200/80',
    buttonVariant: 'secondary',
    buttonClass: 'shadow-lg shadow-emerald-500/25 border border-emerald-500/30 text-teal-100',
    success: 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-200',
    successIcon: 'text-emerald-300',
    error: 'bg-red-500/15 border border-red-500/30 text-red-100',
    errorIcon: 'text-red-200'
  }
};

const createInitialFormState = (fields) => {
  return fields?.reduce((acc, field) => {
    acc[field?.id] = field?.type === 'file' ? null : '';
    return acc;
  }, {}) ?? {};
};

const ReportForm = ({ formId, config, tone = 'default', language = 'en', onSubmit }) => {
  const [values, setValues] = useState(() => createInitialFormState(config?.fields));
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const styles = toneStyles[tone] ?? toneStyles.default;

  useEffect(() => {
    setValues(createInitialFormState(config?.fields));
    setSubmitted(false);
    setSubmitting(false);
    setError(null);
  }, [config]);

  const handleChange = (field, event) => {
    const { type, files, value } = event?.target ?? {};
    setValues((prev) => ({
      ...prev,
      [field?.id]: type === 'file' ? files : value
    }));
  };

  const handleSubmit = (event) => {
    event?.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    const payload = {};
    const attachments = [];

    config?.fields?.forEach((field) => {
      if (field?.type === 'file') {
        if (values?.[field?.id]) {
          attachments.push(...Array.from(values[field.id] ?? []));
        }
      } else {
        payload[field?.id] = values?.[field?.id] ?? '';
      }
    });

    const submissionData = {
      ...payload,
      formId,
      language,
      submittedAt: new Date().toISOString()
    };

    const submitPromise = typeof onSubmit === 'function'
      ? onSubmit(submissionData, attachments)
      : Promise.resolve();

    submitPromise
      .then(() => {
        setSubmitted(true);
        setValues(createInitialFormState(config?.fields));
      })
      .catch((submitError) => {
        console.error('Failed to submit report form:', submitError);
        setError(submitError?.message || 'Unable to submit the report. Please try again or contact the operations centre.');
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <section
      id={formId}
      className={cn(
        'relative overflow-hidden rounded-2xl p-6 transition-transform duration-300',
        styles.card
      )}
    >
      <div className="absolute inset-0 pointer-events-none" style={{
        background: tone === 'critical'
          ? 'radial-gradient(circle at top, rgba(248,113,113,0.08), transparent 55%)'
          : tone === 'environmental'
          ? 'radial-gradient(circle at top, rgba(45,212,191,0.08), transparent 55%)'
          : 'radial-gradient(circle at top, rgba(59,130,246,0.08), transparent 55%)'
      }} />
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className={cn('text-xl font-headline font-bold', styles.heading)}>{config?.title}</h3>
          {config?.description && (
            <p className={cn('text-sm font-body mt-1 max-w-2xl', styles.subheading)}>{config?.description}</p>
          )}
        </div>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {config?.fields?.map((field) => {
          const value = values?.[field?.id] ?? '';

          return (
            <div key={field?.id} className="space-y-1">
              <label
                htmlFor={`${formId}-${field?.id}`}
                className={cn('block text-sm font-cta-medium', styles.label)}
              >
                {field?.label}
                {field?.required ? <span className="text-red-500"> *</span> : null}
              </label>
              {field?.type === 'textarea' ? (
                <textarea
                  id={`${formId}-${field?.id}`}
                  name={field?.id}
                  required={field?.required}
                  value={value}
                  placeholder={field?.placeholder}
                  className={cn(
                    'w-full min-h-[120px] rounded-lg px-4 py-3 text-sm font-body focus:outline-none focus:ring-2',
                    styles.input
                  )}
                  onChange={(event) => handleChange(field, event)}
                />
              ) : field?.type === 'select' ? (
                <select
                  id={`${formId}-${field?.id}`}
                  name={field?.id}
                  required={field?.required}
                  value={value}
                  className={cn(
                    'w-full rounded-lg px-4 py-3 text-sm font-body focus:outline-none focus:ring-2',
                    styles.input
                  )}
                  onChange={(event) => handleChange(field, event)}
                >
                  <option value="" disabled>
                    {field?.placeholder}
                  </option>
                  {field?.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : field?.type === 'file' ? (
                <input
                  id={`${formId}-${field?.id}`}
                  name={field?.id}
                  type="file"
                  accept={field?.accept ?? '*'}
                  multiple
                  className={cn(
                    'w-full rounded-lg px-4 py-6 text-sm font-body focus:outline-none focus:ring-2',
                    styles.file
                  )}
                  onChange={(event) => handleChange(field, event)}
                />
              ) : (
                <input
                  id={`${formId}-${field?.id}`}
                  name={field?.id}
                  type={field?.type ?? 'text'}
                  required={field?.required}
                  value={value}
                  placeholder={field?.placeholder}
                  className={cn(
                    'w-full rounded-lg px-4 py-3 text-sm font-body focus:outline-none focus:ring-2',
                    styles.input
                  )}
                  onChange={(event) => handleChange(field, event)}
                />
              )}
            </div>
          );
        })}

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <div className={cn('text-xs font-body', styles.support)}>
            {config?.supportText}
          </div>
          <Button
            type="submit"
            size="lg"
            loading={submitting}
            iconName="Send"
            iconPosition="right"
            variant={styles.buttonVariant ?? 'secondary'}
            className={styles.buttonClass}
          >
            {config?.submitLabel}
          </Button>
        </div>
      </form>

      {error ? (
        <div className={cn('mt-4 flex items-start gap-2 rounded-lg px-4 py-3 text-sm', styles.error)}>
          <Icon name="AlertTriangle" size={16} className={cn('mt-0.5', styles.errorIcon)} />
          {error}
        </div>
      ) : null}

      {submitted ? (
        <div className={cn('mt-4 flex items-start gap-2 rounded-lg px-4 py-3 text-sm', styles.success)}>
          <Icon name="CheckCircle" size={16} className={cn('mt-0.5', styles.successIcon)} />
          {config?.acknowledgement}
        </div>
      ) : null}
    </section>
  );
};

const QuickActionCard = ({ action }) => (
  <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/75 p-6 shadow-[0px_35px_70px_rgba(2,6,23,0.45)] transition-transform duration-300 hover:-translate-y-1">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_55%)]" />
    <div className="relative mb-4 flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-cyan-300">
        <Icon name={action?.primary?.icon ?? 'AlertCircle'} size={20} />
      </div>
      <div>
        <h3 className="text-lg font-headline font-bold text-white">{action?.title}</h3>
        <p className="text-sm font-body text-white/60">{action?.summary}</p>
      </div>
    </div>
    <div className="relative flex flex-col gap-3 sm:flex-row">
      {action?.primary ? (
        <Button
          asChild
          size="sm"
          variant="secondary"
          iconName={action?.primary?.icon}
          className="border-white/20 text-white"
        >
          <a href={action?.primary?.href}>{action?.primary?.label}</a>
        </Button>
      ) : null}
      {action?.secondary ? (
        <Button
          asChild
          size="sm"
          variant="ghost"
          iconName={action?.secondary?.icon}
          className="text-white hover:bg-white/10"
        >
          <a href={action?.secondary?.href}>{action?.secondary?.label}</a>
        </Button>
      ) : null}
    </div>
  </div>
);

const EmergencyResponseNetwork = () => {
  const { i18n } = useTranslation();
  const language = i18n?.language ?? 'en';
  const localizedContent = EMERGENCY_RESPONSE_CONTENT?.[language] ?? EMERGENCY_RESPONSE_CONTENT?.en;
  const { content: cmsContent } = usePageContent('emergency', { enabled: true });

  const heroOverride = cmsContent?.hero?.translations?.[language] ?? cmsContent?.hero?.translations?.en ?? cmsContent?.hero ?? {};

  const hero = useMemo(() => {
    const base = localizedContent?.hero ?? {};
    const overrideImages = (heroOverride?.images ?? []).filter(Boolean);
    const cmsImages = (cmsContent?.hero?.images ?? []).filter(Boolean);
    const baseImages = (base?.images ?? []).filter(Boolean);
    const singularFallback = [heroOverride?.image, base?.image, DEFAULT_HERO_IMAGE].filter(Boolean);
    const gallery = Array.from(new Set([...overrideImages, ...cmsImages, ...baseImages, ...singularFallback]));

    return {
      badge: heroOverride?.badge ?? base?.badge,
      subheading: heroOverride?.subheading ?? base?.subheading,
      title: heroOverride?.title ?? base?.title,
      highlight: heroOverride?.highlight ?? base?.highlight,
      description: heroOverride?.description ?? base?.description,
      primaryCta: {
        label: heroOverride?.primaryCtaLabel ?? base?.primaryCta?.label,
        icon: base?.primaryCta?.icon ?? 'AlertOctagon',
        href: cmsContent?.hero?.ctaLink ?? '#emergency-reporting'
      },
      secondaryCta: {
        label: heroOverride?.secondaryCtaLabel ?? base?.secondaryCta?.label,
        icon: base?.secondaryCta?.icon ?? 'LayoutDashboard',
        href: cmsContent?.hero?.secondaryCtaLink ?? '#situation-room'
      },
      leftStat: {
        value: heroOverride?.leftStatValue ?? base?.leftStat?.value,
        label: heroOverride?.leftStatLabel ?? base?.leftStat?.label
      },
      rightStat: {
        value: heroOverride?.rightStatValue ?? base?.rightStat?.value,
        label: heroOverride?.rightStatLabel ?? base?.rightStat?.label
      },
      image: gallery?.[0] ?? DEFAULT_HERO_IMAGE,
      images: gallery
    };
  }, [heroOverride, cmsContent, localizedContent]);

  const [alerts, setAlerts] = useState(localizedContent?.alerts?.items ?? []);

  useEffect(() => {
    setAlerts(localizedContent?.alerts?.items ?? []);
  }, [localizedContent?.alerts?.items]);

  const scrollToAnchor = (href) => {
    if (!href) return;
    if (href.startsWith('#')) {
      const element = document?.querySelector(href);
      element?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.open(href, '_blank');
    }
  };

  const handleEmergencySubmit = async (payload, files = []) => {
    await submitEmergencyIncident(payload, files);
  };

  const handleNonEmergencySubmit = async (payload, files = []) => {
    await submitNonEmergencyRequest(payload, files);
  };

  const handleEnvironmentalSubmit = async (payload, files = []) => {
    await submitEnvironmentalIncident(payload, files);
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{localizedContent?.meta?.title}</title>
        <meta name="description" content={localizedContent?.meta?.description} />
        {localizedContent?.meta?.keywords ? (
          <meta name="keywords" content={localizedContent?.meta?.keywords} />
        ) : null}
      </Helmet>

      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
          <div className="absolute inset-0">
            <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(56,189,248,0.25), transparent 45%)' }}></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-3xl rounded-full"></div>
            <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-secondary/10 blur-3xl rounded-full"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-28">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1 text-xs uppercase tracking-[0.2em] font-cta">
                  <Icon name="Shield" size={14} />
                  {hero?.badge}
                </span>
                <h1 className="text-4xl lg:text-5xl font-headline font-bold leading-tight">
                  {hero?.title} <span className="text-cyan-300">{hero?.highlight}</span>
                </h1>
                <p className="text-base lg:text-lg font-body text-white/80 max-w-2xl">{hero?.description}</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    size="lg"
                    iconName={hero?.primaryCta?.icon}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => scrollToAnchor(hero?.primaryCta?.href)}
                  >
                    {hero?.primaryCta?.label}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    iconName={hero?.secondaryCta?.icon}
                    className="border-white text-white hover:bg-white hover:text-slate-900"
                    onClick={() => scrollToAnchor(hero?.secondaryCta?.href)}
                  >
                    {hero?.secondaryCta?.label}
                  </Button>
                </div>

                <div className="flex items-center gap-6 pt-4">
                  <div>
                    <div className="text-2xl font-headline font-bold text-white">{hero?.leftStat?.value}</div>
                    <div className="text-sm text-white/70 font-body">{hero?.leftStat?.label}</div>
                  </div>
                  <div className="w-px h-10 bg-white/20" />
                  <div>
                    <div className="text-2xl font-headline font-bold text-white">{hero?.rightStat?.value}</div>
                    <div className="text-sm text-white/70 font-body">{hero?.rightStat?.label}</div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <HeroCarousel images={hero?.images} title={hero?.title} />
                <div className="absolute -bottom-6 -left-6 hidden w-48 rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white shadow-xl backdrop-blur-md lg:flex">
                  <div>
                    <div className="text-2xl font-headline font-bold">{hero?.leftStat?.value}</div>
                    <div className="text-xs font-body text-white/70">{hero?.leftStat?.label}</div>
                  </div>
                </div>
                <div className="absolute -top-6 -right-6 hidden w-48 rounded-xl border border-white/10 bg-primary/80 px-4 py-3 text-white shadow-xl backdrop-blur-md lg:flex">
                  <div>
                    <div className="text-2xl font-headline font-bold">{hero?.rightStat?.value}</div>
                    <div className="text-xs font-body text-white/80">{hero?.rightStat?.label}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 py-12" id="quick-actions">
          <h2 className="text-2xl font-headline font-bold text-text-primary mb-3">
            Quick command actions
          </h2>
          <p className="text-sm text-text-secondary font-body mb-6">
            Signal the right workflow instantly—hotlines, reporting, and admin tools are one click away.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {localizedContent?.quickActions?.map((action) => (
              <QuickActionCard key={action?.id} action={action} />
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 py-12" id="emergency-reporting">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-6 py-10 shadow-[0px_35px_90px_rgba(15,23,42,0.55)] text-white">
            <div className="pointer-events-none absolute inset-0" style={{
              background:
                'radial-gradient(circle at top left, rgba(59,130,246,0.18), transparent 55%), radial-gradient(circle at bottom right, rgba(8,145,178,0.12), transparent 45%)'
            }} />
            <div className="relative space-y-6">
              <div className="space-y-3 max-w-3xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1 text-[11px] font-cta uppercase tracking-[0.3em] text-white/60">
                  <Icon name="Activity" size={14} />
                  Incident Command
                </span>
                <h2 className="text-3xl font-headline font-bold text-white sm:text-4xl">
                  Incident reporting hub
                </h2>
                <p className="text-sm font-body text-white/70">
                  Capture every detail with scientifically robust forms. Automatic notifications dispatch to command, enforcement, and environmental partners without overwhelming your frontline teams.
                </p>
              </div>

              <ReportsLayout>
                <ReportForm
                  formId="emergency-reporting"
                  config={{
                    ...localizedContent?.reporting?.emergency?.form,
                description: localizedContent?.reporting?.emergency?.description,
                acknowledgement: localizedContent?.reporting?.emergency?.form?.acknowledgement,
                submitLabel: localizedContent?.reporting?.emergency?.form?.submitLabel,
                title: localizedContent?.reporting?.emergency?.form?.title,
                supportText: localizedContent?.reporting?.emergency?.targetResponse
                  }}
                  tone="critical"
                  language={language}
                  onSubmit={handleEmergencySubmit}
                />
                <ReportForm
                  formId="non-emergency-reporting"
                  config={{
                    ...localizedContent?.reporting?.nonEmergency?.form,
                description: localizedContent?.reporting?.nonEmergency?.description,
                acknowledgement: localizedContent?.reporting?.nonEmergency?.form?.acknowledgement,
                supportText: localizedContent?.reporting?.nonEmergency?.supportText,
                submitLabel: localizedContent?.reporting?.nonEmergency?.form?.submitLabel,
                title: localizedContent?.reporting?.nonEmergency?.form?.title
              }}
                  language={language}
                  onSubmit={handleNonEmergencySubmit}
                />
              </ReportsLayout>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 pb-12 space-y-6" id="environmental-reporting">
          <h2 className="text-2xl font-headline font-bold text-text-primary">
            {localizedContent?.reporting?.environmental?.title}
          </h2>
          <p className="text-sm font-body text-text-secondary max-w-3xl">
            {localizedContent?.reporting?.environmental?.description}
          </p>
          <div className="bg-primary/5 border border-primary/20 rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm font-body text-primary">
            <span>{localizedContent?.reporting?.environmental?.hotline}</span>
            <Button
              variant="ghost"
              size="sm"
              iconName="PhoneCall"
              onClick={() => window.open(`tel:${localizedContent?.reporting?.environmental?.hotline?.match(/\+?\d[\d\s]+/g)?.[0]?.replace(/\s/g, '')}`, '_self')}
            >
              Call duty officer
            </Button>
          </div>
          <ReportForm
            formId="environmental-reporting-form"
            config={{
              ...localizedContent?.reporting?.environmental?.form,
              acknowledgement: localizedContent?.reporting?.environmental?.form?.acknowledgement,
              title: localizedContent?.reporting?.environmental?.form?.title,
              description: localizedContent?.reporting?.environmental?.description,
              submitLabel: localizedContent?.reporting?.environmental?.form?.submitLabel
            }}
            tone="environmental"
            language={language}
            onSubmit={handleEnvironmentalSubmit}
          />
        </section>

        <section className="max-w-7xl mx-auto px-4 pb-12 grid grid-cols-1 xl:grid-cols-3 gap-6" id="live-updates">
          <div className="xl:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-headline font-bold text-text-primary">
                {localizedContent?.alerts?.title}
              </h2>
              <Button asChild variant="ghost" size="sm" iconName="History">
                <a href="#alerts-archive">{localizedContent?.alerts?.viewArchiveLabel}</a>
              </Button>
            </div>
            {alerts?.map((alert) => (
              <AlertCard
                key={alert?.id}
                alert={alert}
                onViewDetails={(selected) => {
                  window?.alert(`${selected?.title}\n\n${selected?.description}`);
                }}
                onDismiss={(id) => {
                  setAlerts((prev) => prev?.filter((item) => item?.id !== id));
                }}
              />
            ))}
            {alerts?.length === 0 ? (
              <div className="border border-dashed border-slate-300 rounded-lg p-6 text-center text-sm text-text-secondary font-body">
                <Icon name="CheckCircle" size={20} className="mx-auto mb-2 text-success" />
                All alerts cleared. Monitoring continues 24/7.
              </div>
            ) : null}
          </div>

          <div className="space-y-6">
            <SystemStatusIndicator systems={localizedContent?.systemStatus?.systems ?? []} />
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 pb-12 grid grid-cols-1 xl:grid-cols-3 gap-6" id="contacts">
          <div className="space-y-2 xl:col-span-3">
            <h2 className="text-2xl font-headline font-bold text-text-primary">
              {localizedContent?.contacts?.title}
            </h2>
            <p className="text-sm font-body text-text-secondary max-w-3xl">
              {localizedContent?.contacts?.description}
            </p>
          </div>
          {localizedContent?.contacts?.items?.map((contact) => (
            <EmergencyContactCard key={contact?.name} contact={contact} />
          ))}
        </section>

        <section className="max-w-7xl mx-auto px-4 pb-12" id="evacuation-map">
          <EvacuationMap />
        </section>

        <section className="max-w-7xl mx-auto px-4 pb-12 space-y-6" id="preparedness">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-headline font-bold text-text-primary">
                {localizedContent?.preparedness?.title}
              </h2>
              <p className="text-sm font-body text-text-secondary max-w-3xl">
                {localizedContent?.preparedness?.description}
              </p>
            </div>
            <Button variant="ghost" iconName="Download">
              Download resource index
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {localizedContent?.preparedness?.items?.map((resource) => (
              <PreparednessResourceCard key={resource?.title} resource={resource} />
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 pb-12 bg-card border-t border-b border-border rounded-3xl py-12" id="situation-room">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-cta uppercase tracking-wider">
                <Icon name="Cpu" size={14} />
                Command Centre
              </span>
              <h2 className="mt-3 text-3xl font-headline font-bold text-text-primary">
                {localizedContent?.situationRoom?.title}
              </h2>
              <p className="mt-3 text-sm font-body text-text-secondary leading-relaxed">
                {localizedContent?.situationRoom?.description}
              </p>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {localizedContent?.situationRoom?.actions?.map((action) => (
                  <Button asChild key={action?.label} size="sm" variant="outline" iconName={action?.icon}>
                    <a href={action?.href}>{action?.label}</a>
                  </Button>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl p-8 border border-primary/20">
              <h3 className="text-lg font-headline font-bold text-text-primary mb-3">
                Environmental intelligence snapshot
              </h3>
              <p className="text-sm font-body text-text-secondary mb-6">
                {localizedContent?.environmentWatch?.description}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {localizedContent?.environmentWatch?.stats?.map((stat) => (
                  <div key={stat?.label} className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                    <div className="text-xl font-headline font-bold text-primary">{stat?.value}</div>
                    <div className="text-xs font-body text-text-secondary mt-1">{stat?.label}</div>
                    <div className="text-[11px] font-cta text-success mt-1">{stat?.trend}</div>
                  </div>
                ))}
              </div>
              <Button asChild variant="secondary" size="sm" iconName={localizedContent?.environmentWatch?.cta?.icon ?? 'Globe2'}>
                <a href={localizedContent?.environmentWatch?.cta?.href ?? '#'}>{localizedContent?.environmentWatch?.cta?.label}</a>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default EmergencyResponseNetwork;
