import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import AppImage from '../../components/AppImage';
import * as Icons from 'lucide-react';

const TIMELINE_MEDIA = {
  '1981': 'https://images.unsplash.com/photo-1521207418485-99c705420785?auto=format&fit=crop&w=800&q=80',
  '1986--2000': 'https://images.unsplash.com/photo-1465935343323-d742334bcbda?auto=format&fit=crop&w=800&q=80',
  '1996': 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
  '1997': 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=800&q=80',
  '2012': 'https://images.unsplash.com/photo-1529245856380-49914082df87?auto=format&fit=crop&w=800&q=80',
  '2013': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80',
  '2020': 'https://images.unsplash.com/photo-1470167825433-0d803d281b5e?auto=format&fit=crop&w=800&q=80',
  '2021': 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=800&q=80',
  '2024': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
  '2025': 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=800&q=80'
};

const ACHIEVEMENT_ICONS = [Icons.FlaskConical, Icons.Globe2, Icons.Handshake, Icons.Sparkles];
const LOGO_FEATURE_ICONS = {
  waves: Icons.Waves,
  fish: Icons.Fish,
  globe: Icons.Globe,
  sparkles: Icons.Sparkles
};

const LOGO_FEATURE_STYLES = {
  waves: 'text-cyan-400',
  fish: 'text-blue-400',
  globe: 'text-emerald-400',
  sparkles: 'text-amber-400'
};

const LOGO_FEATURE_TITLE_STYLES = {
  waves: 'text-cyan-300',
  fish: 'text-blue-300',
  globe: 'text-emerald-300',
  sparkles: 'text-amber-300'
};

const LOGO_STAT_ICONS = {
  calendar: Icons.Calendar,
  users: Icons.Users,
  flask: Icons.FlaskConical,
  trophy: Icons.Trophy
};

const DIRECTOR_ICON_MAP = {
  leaf: Icons.Leaf,
  anchor: Icons.Anchor,
  waves: Icons.Waves,
  shell: Icons.Shell,
  fish: Icons.Fish,
  barChart: Icons.BarChart,
  globe: Icons.Globe,
  trendingUp: Icons.TrendingUp,
  briefcase: Icons.Briefcase,
  package: Icons.Package
};
const DEFAULT_TIMELINE_MEDIA = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';

const AboutNARAStoryPage = () => {
  const { t, i18n } = useTranslation('about');
  const [language, setLanguage] = useState(() => {
    if (typeof window === 'undefined') {
      return 'en';
    }
    return window.localStorage.getItem('nara-lang') || 'en';
  });

  useEffect(() => {
    const handleLanguageChange = (event) => {
      const nextLang = event.detail || 'en';
      setLanguage(nextLang);
      i18n.changeLanguage(nextLang);
    };

    if (language) {
      i18n.changeLanguage(language);
    }

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, [i18n, language]);

  const hero = t('about.hero', { returnObjects: true });
  const history = t('about.history', { returnObjects: true });
  const achievements = t('about.achievements', { returnObjects: true });
  const cta = t('about.cta', { returnObjects: true });
  const logo = t('about.logo', { returnObjects: true });
  const leadership = t('about.leadership', { returnObjects: true });

  const heroStats = Array.isArray(hero?.stats) ? hero.stats : [];
  const historyBody = Array.isArray(history?.body) ? history.body : [];
  const timeline = useMemo(() => (Array.isArray(history?.timeline) ? history.timeline : []), [history]);
  const timelineLoop = useMemo(() => {
    if (!timeline.length) {
      return [];
    }
    const duplicated = timeline.map((item, index) => ({ ...item, _loopId: `dup-${index}` }));
    return [...timeline, ...duplicated];
  }, [timeline]);
  const timelineScrollDuration = Math.max(24, timeline.length * 6);
  const achievementItems = Array.isArray(achievements?.items) ? achievements.items : [];
  const timelineIntro = history?.timelineIntro || '';
  const milestoneCountLabel = t('about.history.milestoneCount', { count: timeline.length });
  const logoDescription = Array.isArray(logo?.description) ? logo.description : [];
  const logoFeatures = Array.isArray(logo?.features) ? logo.features : [];
  const logoStats = Array.isArray(logo?.stats) ? logo.stats : [];
  const logoHistory = logo?.history || {};
  const logoHistoryBody = Array.isArray(logoHistory?.body) ? logoHistory.body : [];
  const leadershipExecutives = Array.isArray(leadership?.executives) ? leadership.executives : [];
  const leadershipDirectors = Array.isArray(leadership?.directors) ? leadership.directors : [];
  const boardMinisterAppointed = Array.isArray(leadership?.board?.ministerAppointed?.members) ? leadership.board.ministerAppointed.members : [];
  const boardExOfficio = Array.isArray(leadership?.board?.exOfficioMembers?.members) ? leadership.board.exOfficioMembers.members : [];
  const boardTitle = leadership?.board?.title || '';
  const boardDescription = leadership?.board?.description || '';
  const ministerAppointedTitle = leadership?.board?.ministerAppointed?.title || 'Members Appointed by the Minister';
  const exOfficioTitle = leadership?.board?.exOfficioMembers?.title || 'Ex-Officio Members';
  const vacancyNotice = leadership?.vacancyNotice || '';
  const orgStructure = leadership?.organizationalStructure || null;
  const executiveStyles = [
    {
      gradient: 'from-cyan-500/30 to-blue-500/30',
      border: 'border-cyan-500/40',
      iconBg: 'from-cyan-400/25 to-blue-500/25 border-cyan-500/50',
      icon: Icons.User,
      textClass: 'text-cyan-200',
      accentBar: 'from-cyan-400/40',
      iconColor: 'text-cyan-400'
    },
    {
      gradient: 'from-blue-500/25 to-indigo-500/25',
      border: 'border-blue-500/35',
      iconBg: 'from-blue-400/20 to-indigo-500/20 border-blue-500/45',
      icon: Icons.UserCheck,
      textClass: 'text-blue-200',
      accentBar: 'from-blue-400/40',
      iconColor: 'text-blue-400'
    }
  ];

  const getTimelineMedia = (year) => TIMELINE_MEDIA[year] || DEFAULT_TIMELINE_MEDIA;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-900 to-cyan-950" />
        <div className="absolute inset-0 opacity-30">
          <motion.div
            animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
            transition={{ duration: 25, repeat: Infinity, repeatType: 'reverse' }}
            className="w-full h-full"
            style={{
              backgroundImage:
                'radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.15) 0%, transparent 60%),' +
                'radial-gradient(circle at 85% 20%, rgba(59, 130, 246, 0.12) 0%, transparent 55%)'
            }}
          />
          {[...Array(40)].map((_, index) => (
            <motion.span
              key={index}
              className="absolute w-1 h-1 bg-cyan-400/40 rounded-full"
              animate={{
                y: [0, -140, 0],
                opacity: [0, 0.9, 0]
              }}
              transition={{
                duration: 12 + Math.random() * 6,
                repeat: Infinity,
                delay: Math.random() * 6
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col gap-8 min-h-[760px]"
            >
              <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/40 bg-slate-900/60 px-5 py-2 text-xs uppercase tracking-[0.45em] text-cyan-200/80 shadow-[0_0_25px_rgba(6,182,212,0.25)]">
                <Icons.History className="w-4 h-4" />
                {hero?.badge}
              </div>
              <h1 className="text-3xl md:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-cyan-200 via-blue-200 to-cyan-100 bg-clip-text text-transparent leading-tight">
                {hero?.title}
              </h1>
              <p className="text-xl md:text-2xl text-cyan-200/90 font-light tracking-wide">
                {hero?.headline}
              </p>
              <p className="text-base md:text-lg text-slate-200/90 leading-relaxed whitespace-pre-line">
                {hero?.description}
              </p>

              <div className="grid sm:grid-cols-3 gap-6 pt-6 mt-auto">
                {heroStats.map((stat, index) => (
                  <motion.div
                    key={`${stat?.label}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.4 }}
                    className="rounded-2xl border border-cyan-500/20 bg-slate-900/70 backdrop-blur p-5 shadow-[0_15px_40px_-25px_rgba(6,182,212,0.45)]"
                  >
                    <div className="text-2xl font-bold text-cyan-300">{stat?.value}</div>
                    <p className="mt-2 text-xs text-slate-300/90 leading-snug">
                      {stat?.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="relative flex flex-col min-h-[700px] justify-between"
            >
              <div className="absolute -inset-4 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-[32px] blur-3xl" />
              <div className="relative flex flex-col bg-slate-900/80 border border-slate-700/50 rounded-[32px] p-6 backdrop-blur-xl shadow-[0_25px_80px_-35px_rgba(6,182,212,0.55)]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm uppercase tracking-[0.35em] text-cyan-200/70">
                    {history?.timelineTitle}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-cyan-200/80">
                    <Icons.Clock className="w-3.5 h-3.5" />
                    {milestoneCountLabel}
                  </div>
                </div>
                <div className="relative h-[520px] md:h-[600px] overflow-hidden mt-auto">
                  <motion.div
                    className="space-y-4 pr-2"
                    animate={{ y: ['0%', '-50%'] }}
                    transition={{ duration: timelineScrollDuration, repeat: Infinity, ease: 'linear' }}
                  >
                    {timelineLoop.map((item, idx) => (
                      <div
                        key={`${item?.year}-${item?._loopId || idx}`}
                        className="group relative flex rounded-2xl overflow-hidden border border-slate-700/60 bg-slate-900/70 min-h-[190px]"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-cyan-500/15 to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="flex gap-3 items-stretch w-full">
                          <div className="relative w-[128px] h-[128px] flex-shrink-0 self-center ml-4">
                            <AppImage
                              src={getTimelineMedia(item?.year)}
                              alt={`${item?.year} milestone`}
                              className="h-full w-full object-cover rounded-2xl"
                            />
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-transparent via-slate-900/30 to-slate-900/80" />
                            <span className="absolute bottom-3 left-3 text-xs font-semibold text-white/90">
                              {item?.year}
                            </span>
                          </div>
                          <div className="py-5 pr-5 flex-1 min-w-0">
                            <h3 className="text-base md:text-lg font-semibold text-cyan-200 mb-2">
                              {item?.title}
                            </h3>
                            <p className="text-sm md:text-base text-slate-200/80 leading-relaxed line-clamp-4">
                              {item?.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-slate-900 to-transparent" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-slate-900 to-transparent" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* History Narrative */}
      <section className="py-28 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/30 to-transparent" />
        <div className="relative max-w-7xl mx-auto space-y-14">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
              {history?.title}
            </h2>
            <p className="text-xl text-slate-200/90 leading-relaxed max-w-4xl mx-auto">
              {history?.intro}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-10">
            {historyBody.map((paragraph, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="relative"
              >
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-3xl opacity-0 hover:opacity-100 blur-xl transition" />
                <div className="relative bg-slate-900/70 border border-slate-700/50 rounded-3xl p-8 shadow-[0_20px_60px_-40px_rgba(6,182,212,0.6)]">
                  <p className="text-lg text-slate-200/90 leading-relaxed">{paragraph}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NARA Logo Hero Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-900 to-cyan-950" />
        <div className="absolute inset-0 opacity-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]"
            style={{
              background: 'radial-gradient(circle, rgba(14,165,233,0.3) 0%, transparent 70%)'
            }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Logo Container with Spinning Animation */}
            <div className="flex justify-center mb-12">
              <motion.div
                animate={{ rotateY: 360 }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'linear'
                }}
                className="relative"
              >
                {/* Glow effect behind logo */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 rounded-full opacity-40 blur-3xl scale-110" />

                {/* Logo */}
                <div className="relative bg-white/10 backdrop-blur-xl rounded-full p-8 border-4 border-cyan-400/30 shadow-[0_0_80px_rgba(34,211,238,0.4)]">
                  <img
                    src="/assets/nara-logo.png"
                    alt="NARA Logo"
                    className="w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-2xl"
                  />
                </div>
              </motion.div>
            </div>

            {/* Logo Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-400 bg-clip-text text-transparent"
          >
              {logo?.title || 'The NARA Emblem'}
          </motion.h2>

          {/* Logo Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-cyan-400/20 shadow-2xl">
                <h3 className="text-2xl md:text-3xl font-bold text-cyan-300 mb-6">{logo?.subtitle}</h3>

                <div className="text-lg text-slate-200 leading-relaxed space-y-4 text-left">
                  {logoDescription.map((paragraph, idx) => (
                    <p key={`logo-desc-${idx}`}>{paragraph}</p>
                  ))}

                  {logoFeatures.map((feature, idx) => {
                    const FeatureIcon = LOGO_FEATURE_ICONS[feature.icon] || Icons.Sparkles;
                    const iconClass = LOGO_FEATURE_STYLES[feature.icon] || 'text-cyan-400';
                    const titleClass = LOGO_FEATURE_TITLE_STYLES[feature.icon] || 'text-cyan-300';

                    return (
                      <div key={`logo-feature-${idx}`} className="flex items-start gap-3">
                        <FeatureIcon className={`w-6 h-6 flex-shrink-0 mt-1 ${iconClass}`} />
                        <span>
                          <strong className={`${titleClass}`}>{feature.title}</strong> {feature.description}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Logo History */}
                <div className="mt-8 pt-8 border-t border-cyan-400/20">
                  <h4 className="text-xl font-bold text-cyan-300 mb-4">{logoHistory?.title}</h4>
                  <div className="space-y-3 text-slate-200 leading-relaxed">
                    {logoHistoryBody.map((paragraph, idx) => (
                      <p key={`logo-history-${idx}`}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                {/* Logo Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
                  {logoStats.map((stat, idx) => {
                    const StatIcon = LOGO_STAT_ICONS[stat.icon] || Icons.Info;
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.7 + idx * 0.1 }}
                        className="text-center"
                      >
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-cyan-400/10 border border-cyan-400/30 mb-3">
                          <StatIcon className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                        <div className="text-sm text-slate-400">{stat.label}</div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Administrative Structure Section */}
      <section className="py-28 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-950/10 to-transparent" />
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-300 via-orange-300 to-amber-400 bg-clip-text text-transparent">
              {leadership?.title || 'Leadership & Administration'}
            </h3>
            <p className="text-xl text-slate-300/90 max-w-3xl mx-auto leading-relaxed">
              {leadership?.intro}
            </p>
          </motion.div>

          {leadership?.chairman && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto mb-12"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/40 to-orange-500/40 rounded-3xl opacity-75 group-hover:opacity-100 blur-2xl transition duration-500" />
                <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 border border-amber-500/40 rounded-3xl p-8 md:p-10 shadow-[0_30px_90px_-50px_rgba(251,191,36,0.6)] backdrop-blur">
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
                      <div className="w-full h-full rounded-2xl bg-gradient-to-br from-amber-400/25 to-orange-500/25 border-2 border-amber-500/50 flex items-center justify-center shadow-[0_20px_60px_-30px_rgba(251,191,36,0.8)]">
                        <Icons.Crown className="w-16 h-16 md:w-20 md:h-20 text-amber-400" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-xl">
                        <Icons.Award className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                        <h3 className="text-3xl md:text-4xl font-bold text-amber-200">{leadership.chairman.title}</h3>
                        <div className="hidden md:block h-px flex-1 bg-gradient-to-r from-amber-400/60 to-transparent" />
                      </div>
                      <p className="text-lg md:text-xl text-white/95 font-semibold mb-2">{leadership.chairman.name}</p>
                      <div className="flex flex-col gap-1.5 text-sm text-slate-300/80 mb-3">
                        {leadership.chairman.email && (
                          <div className="flex items-center justify-center md:justify-start gap-2">
                            <Icons.Mail className="w-4 h-4 text-amber-400/70" />
                            <a href={`mailto:${leadership.chairman.email}`} className="hover:text-amber-300 transition">{leadership.chairman.email}</a>
                          </div>
                        )}
                        {leadership.chairman.phone && (
                          <div className="flex items-center justify-center md:justify-start gap-2">
                            <Icons.Phone className="w-4 h-4 text-amber-400/70" />
                            <a href={`tel:${leadership.chairman.phone.replace(/[^+\d]/g, '')}`} className="hover:text-amber-300 transition">{leadership.chairman.phone}</a>
                          </div>
                        )}
                      </div>
                      <p className="text-base text-slate-300/80 leading-relaxed">{leadership.chairman.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {leadershipExecutives.length > 0 && (
            <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-6xl mx-auto">
              {leadershipExecutives.map((executive, idx) => {
                const style = executiveStyles[idx] || executiveStyles[executiveStyles.length - 1];
                const IconComponent = style.icon;
                const contacts = [
                  executive.email ? { id: 'email', icon: Icons.Mail, value: executive.email, href: `mailto:${executive.email}` } : null,
                  executive.phone ? { id: 'phone', icon: Icons.Phone, value: executive.phone, href: `tel:${executive.phone.replace(/[^+\d]/g, '')}` } : null,
                  executive.mobile ? { id: 'mobile', icon: Icons.Smartphone, value: executive.mobile, href: `tel:${executive.mobile.replace(/[^+\d]/g, '')}` } : null
                ].filter(Boolean);

                return (
                  <motion.div
                    key={`executive-${idx}`}
                    initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="group relative"
                  >
                    <div className={`absolute -inset-1 bg-gradient-to-r ${style.gradient} rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition duration-500`} />
                    <div className={`relative bg-slate-900/80 border ${style.border} rounded-2xl p-6 backdrop-blur shadow-[0_20px_60px_-40px_rgba(6,182,212,0.5)]`}>
                      <div className="flex gap-5 items-start">
                        <div className={`w-20 h-20 flex-shrink-0 rounded-xl bg-gradient-to-br ${style.iconBg} flex items-center justify-center`}>
                          <IconComponent className={`w-10 h-10 ${style.iconColor}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className={`text-xl font-bold ${style.textClass}`}>{executive.title}</h4>
                            <div className={`h-px flex-1 bg-gradient-to-r ${style.accentBar}`} />
                          </div>
                          <p className="text-sm text-white/85 font-medium mb-2">{executive.name}</p>
                          {executive.subtitle && (
                            <p className="text-xs text-slate-300/70 mb-2">{executive.subtitle}</p>
                          )}
                          <div className="space-y-1 text-xs text-slate-300/70 mb-3">
                            {contacts.map(contact => (
                              <div key={`${executive.name}-${contact.id}`} className="flex items-center gap-2">
                                <contact.icon className="w-3 h-3 text-slate-300/70" />
                                <a href={contact.href} className="hover:text-white/80 transition">{contact.value}</a>
                              </div>
                            ))}
                          </div>
                          <p className="text-sm text-slate-300/70 leading-relaxed">{executive.description}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {leadershipDirectors.length > 0 && (
            <div className="mb-12 max-w-6xl mx-auto">
              <h4 className="text-2xl font-bold text-slate-200 mb-6 flex items-center gap-3">
                <Icons.Users className="w-6 h-6 text-slate-400" />
                {leadership?.directorsTitle || 'Division Heads'}
              </h4>
              <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {leadershipDirectors.map((director, idx) => {
                  const DirectorIcon = DIRECTOR_ICON_MAP[director.icon] || Icons.User;
                  const isVacant = director.vacant;
                  return (
                    <motion.div
                      key={`${director.name}-${idx}`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 * idx }}
                      className="group relative"
                    >
                      <div className="absolute -inset-1 bg-slate-500/10 rounded-xl opacity-0 group-hover:opacity-100 blur-lg transition" />
                      <div className={`relative bg-slate-900/70 border ${isVacant ? 'border-slate-700/20' : 'border-slate-700/50'} rounded-2xl p-6 hover:border-slate-600/70 transition-all duration-300`}>
                        <div className="flex gap-4">
                          <div className="w-14 h-14 flex-shrink-0 rounded-xl bg-slate-800/80 border border-slate-600/60 flex items-center justify-center">
                            <DirectorIcon className="w-6 h-6 text-slate-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className={`text-base font-bold ${isVacant ? 'text-slate-500' : 'text-slate-100'} mb-1`}>{director.name}</h5>
                            <p className="text-xs text-slate-400 font-medium mb-2">{director.position}</p>
                            <p className="text-xs text-cyan-300/80 mb-3 leading-relaxed">{director.division}</p>

                            {director.education && (
                              <div className="mb-3 p-2.5 bg-slate-800/50 rounded-lg border border-slate-700/30">
                                <div className="flex items-start gap-1.5 mb-1.5">
                                  <Icons.GraduationCap className="w-3.5 h-3.5 text-blue-400/70 flex-shrink-0 mt-0.5" />
                                  <p className="text-xs text-slate-300/90 leading-relaxed">{director.education}</p>
                                </div>
                              </div>
                            )}

                            {director.expertise && (
                              <div className="mb-3 p-2.5 bg-slate-800/30 rounded-lg">
                                <div className="flex items-start gap-1.5">
                                  <Icons.Lightbulb className="w-3.5 h-3.5 text-amber-400/70 flex-shrink-0 mt-0.5" />
                                  <p className="text-xs text-slate-300/80 leading-relaxed">{director.expertise}</p>
                                </div>
                              </div>
                            )}

                            {director.email ? (
                              <div className="flex items-center gap-2">
                                <Icons.Mail className="w-3.5 h-3.5 text-cyan-400/70 flex-shrink-0" />
                                <a href={`mailto:${director.email}`} className="text-xs text-cyan-400/80 hover:text-cyan-300 transition truncate">{director.email}</a>
                              </div>
                            ) : (
                              <p className="text-xs text-slate-500 italic flex items-center gap-1.5">
                                <Icons.AlertCircle className="w-3.5 h-3.5" />
                                {vacancyNotice || 'Position currently vacant'}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {(boardMinisterAppointed.length > 0 || boardExOfficio.length > 0) && (
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Icons.Shield className="w-8 h-8 text-emerald-400" />
                  <h4 className="text-3xl font-bold text-slate-200">{boardTitle || 'Governing Board Members of NARA 2023'}</h4>
                </div>
                {boardDescription && (
                  <p className="text-slate-400 text-sm max-w-3xl mx-auto">{boardDescription}</p>
                )}
              </div>

              {/* Minister-Appointed Members */}
              {boardMinisterAppointed.length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <Icons.Crown className="w-6 h-6 text-amber-400" />
                    <h5 className="text-xl font-bold text-amber-300">{ministerAppointedTitle}</h5>
                    <div className="h-px flex-1 bg-gradient-to-r from-amber-400/30 to-transparent" />
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
                    {boardMinisterAppointed.map((member, idx) => (
                      <motion.div
                        key={`minister-${member.name}-${idx}`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.05 * idx }}
                        className="bg-gradient-to-br from-slate-900/70 to-slate-800/70 border border-amber-500/20 rounded-xl p-5 hover:border-amber-500/40 transition-all hover:shadow-[0_0_30px_rgba(251,191,36,0.15)]"
                      >
                        <div className="flex gap-4">
                          <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                            <Icons.UserCheck className="w-6 h-6 text-amber-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h6 className="text-base font-bold text-white mb-1">{member.name}</h6>
                            <p className="text-xs text-amber-300/80 font-medium mb-2">{member.role}</p>
                            {member.designation && (
                              <p className="text-xs text-slate-300/70 mb-2">{member.designation}</p>
                            )}
                            {member.address && (
                              <div className="flex items-start gap-1.5 mb-2">
                                <Icons.MapPin className="w-3 h-3 text-slate-400 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-slate-400 leading-relaxed">{member.address}</p>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-xs">
                              <Icons.Calendar className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400 font-medium">{member.appointmentDate}</span>
                            </div>
                            {member.note && (
                              <p className="text-xs text-slate-500 italic mt-2 pt-2 border-t border-slate-700">{member.note}</p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ex-Officio Members */}
              {boardExOfficio.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <Icons.Briefcase className="w-6 h-6 text-cyan-400" />
                    <h5 className="text-xl font-bold text-cyan-300">{exOfficioTitle}</h5>
                    <div className="h-px flex-1 bg-gradient-to-r from-cyan-400/30 to-transparent" />
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
                    {boardExOfficio.map((member, idx) => (
                      <motion.div
                        key={`exofficio-${member.name}-${idx}`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.05 * idx }}
                        className="bg-gradient-to-br from-slate-900/70 to-slate-800/70 border border-cyan-500/20 rounded-xl p-5 hover:border-cyan-500/40 transition-all hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]"
                      >
                        <div className="flex gap-4">
                          <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                            <Icons.Award className="w-6 h-6 text-cyan-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h6 className="text-base font-bold text-white mb-1">{member.name}</h6>
                            <p className="text-xs text-cyan-300/80 font-medium mb-2">{member.role}</p>
                            {member.designation && (
                              <p className="text-xs text-slate-300/70 mb-2">{member.designation}</p>
                            )}
                            {member.address && (
                              <div className="flex items-start gap-1.5 mb-2">
                                <Icons.MapPin className="w-3 h-3 text-slate-400 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-slate-400 leading-relaxed">{member.address}</p>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-xs">
                              <Icons.Calendar className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400 font-medium">{member.appointmentDate}</span>
                            </div>
                            {member.note && (
                              <p className="text-xs text-slate-500 italic mt-2 pt-2 border-t border-slate-700">{member.note}</p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Organizational Structure Section */}
      {orgStructure && (
        <section className="py-28 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/20 to-transparent" />
          <div className="relative max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h3 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
                {orgStructure.title}
              </h3>
              <p className="text-xl text-slate-300/90 max-w-3xl mx-auto leading-relaxed">
                {orgStructure.description}
              </p>
            </motion.div>

            {/* Divisions Grid */}
            <div className="mb-12">
              <h4 className="text-2xl font-bold text-indigo-300 mb-6 flex items-center gap-3">
                <Icons.Building className="w-6 h-6" />
                Research & Administrative Divisions
              </h4>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {orgStructure.divisions?.map((division, idx) => (
                  <motion.div
                    key={`division-${idx}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="bg-slate-900/50 border border-indigo-500/20 rounded-xl p-4 hover:border-indigo-500/40 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
                        <Icons.Layers className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-bold text-white mb-1">{division.name}</h5>
                        <p className="text-xs text-slate-400 leading-relaxed">{division.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Regional Research Centers */}
            <div className="mb-12">
              <h4 className="text-2xl font-bold text-cyan-300 mb-6 flex items-center gap-3">
                <Icons.MapPin className="w-6 h-6" />
                Regional Research Centers
              </h4>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {orgStructure.regionalCenters?.map((center, idx) => (
                  <motion.div
                    key={`center-${idx}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="bg-gradient-to-br from-slate-900/60 to-slate-800/60 border border-cyan-500/20 rounded-xl p-5 hover:border-cyan-500/40 transition-all hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                        <Icons.Home className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-base font-bold text-white mb-1">{center.name}</h5>
                        <div className="flex items-center gap-1.5 mb-2">
                          <Icons.MapPin className="w-3 h-3 text-cyan-400" />
                          <span className="text-xs text-cyan-300 font-medium">{center.location}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{center.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Hierarchy Diagram */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-slate-900/70 to-slate-800/70 border-2 border-indigo-500/30 rounded-2xl p-8"
            >
              <h4 className="text-2xl font-bold text-indigo-300 mb-6 text-center flex items-center justify-center gap-3">
                <Icons.Network className="w-6 h-6" />
                Organizational Hierarchy
              </h4>
              <div className="space-y-4">
                {orgStructure.hierarchy?.map((level, idx) => (
                  <motion.div
                    key={`hierarchy-${idx}`}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="flex items-center gap-4"
                    style={{ paddingLeft: `${(level.level - 1) * 40}px` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 border-2 border-indigo-500 flex items-center justify-center">
                        <span className="text-xs font-bold text-indigo-300">{level.level}</span>
                      </div>
                      <div className="px-6 py-3 bg-slate-800/50 border border-indigo-500/30 rounded-lg">
                        <p className="text-white font-semibold">{level.position}</p>
                      </div>
                    </div>
                    {idx < orgStructure.hierarchy.length - 1 && (
                      <Icons.ArrowDown className="w-4 h-4 text-indigo-400/50 absolute left-4" style={{ top: '100%' }} />
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Achievements Section */}
      <section className="py-28 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/25 via-slate-950/20 to-transparent" />
        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl md:text-5xl font-semibold mb-4 bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
              {achievements?.title}
            </h3>
            <p className="text-lg text-slate-300/90 max-w-3xl mx-auto">
              {achievements?.intro}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {achievementItems.map((item, idx) => {
              const IconComponent = ACHIEVEMENT_ICONS[idx] || Icons.Star;
              return (
                <motion.div
                  key={`${item?.title}-${idx}`}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="relative group"
                >
                  <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-cyan-500/60 to-blue-600/60 opacity-0 group-hover:opacity-100 blur-xl transition" />
                  <div className="relative rounded-3xl border border-slate-700/50 bg-slate-900/80 p-8 h-full flex flex-col gap-4">
                    <div className="inline-flex items-center gap-3 text-cyan-200">
                      <div className="p-3 rounded-2xl bg-cyan-500/15">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <h4 className="text-xl font-semibold text-cyan-100">{item?.title}</h4>
                    </div>
                    <p className="text-slate-200/90 leading-relaxed text-sm md:text-base">
                      {item?.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/40 via-blue-950/40 to-cyan-950/40" />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-slate-900/80 border border-cyan-500/30 rounded-[40px] px-10 py-14 shadow-[0_25px_80px_-40px_rgba(6,182,212,0.65)]"
          >
            <h3 className="text-4xl md:text-5xl font-semibold mb-6 bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
              {cta?.title}
            </h3>
            <p className="text-xl text-slate-200/90 mb-10">
              {cta?.description}
            </p>
            <motion.a
              href="https://www.nara.ac.lk"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-12 py-5 rounded-full text-lg font-semibold shadow-[0_0_45px_rgba(6,182,212,0.45)] hover:shadow-[0_0_60px_rgba(6,182,212,0.65)] transition"
            >
              {cta?.button}
              <Icons.ArrowRight className="w-6 h-6" />
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutNARAStoryPage;
