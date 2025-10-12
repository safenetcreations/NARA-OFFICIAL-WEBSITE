import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import ThemeNavbar from '../../components/ui/ThemeNavbar';
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

  const getTimelineMedia = (year) => TIMELINE_MEDIA[year] || DEFAULT_TIMELINE_MEDIA;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <ThemeNavbar />
      <div style={{ height: '88px' }} />

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
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/40 bg-slate-900/60 px-5 py-2 text-xs uppercase tracking-[0.45em] text-cyan-200/80 shadow-[0_0_25px_rgba(6,182,212,0.25)]">
                <Icons.History className="w-4 h-4" />
                {hero?.badge}
              </div>
              <h1 className="text-4xl md:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-cyan-200 via-blue-200 to-cyan-100 bg-clip-text text-transparent leading-tight">
                {hero?.title}
              </h1>
              <p className="text-2xl md:text-3xl text-cyan-200/90 font-light tracking-wide">
                {hero?.headline}
              </p>
              <p className="text-lg md:text-xl text-slate-200/90 leading-relaxed whitespace-pre-line">
                {hero?.description}
              </p>

              <div className="grid sm:grid-cols-3 gap-6 pt-6">
                {heroStats.map((stat, index) => (
                  <motion.div
                    key={`${stat?.label}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.4 }}
                    className="rounded-2xl border border-cyan-500/20 bg-slate-900/70 backdrop-blur p-6 shadow-[0_15px_40px_-25px_rgba(6,182,212,0.45)]"
                  >
                    <div className="text-3xl font-bold text-cyan-300">{stat?.value}</div>
                    <p className="mt-2 text-sm text-slate-300/90 leading-snug">
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
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-[32px] blur-3xl" />
              <div className="relative bg-slate-900/80 border border-slate-700/50 rounded-[32px] p-6 backdrop-blur-xl shadow-[0_25px_80px_-35px_rgba(6,182,212,0.55)] overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm uppercase tracking-[0.35em] text-cyan-200/70">
                    {history?.timelineTitle}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-cyan-200/80">
                    <Icons.Clock className="w-3.5 h-3.5" />
                    {timeline.length} milestones
                  </div>
                </div>
                <div className="relative h-[780px] overflow-hidden">
                  <motion.div
                    className="space-y-4 pr-2"
                    animate={{ y: ['0%', '-50%'] }}
                    transition={{ duration: timelineScrollDuration, repeat: Infinity, ease: 'linear' }}
                  >
                    {timelineLoop.map((item, idx) => (
                      <div
                        key={`${item?.year}-${item?._loopId || idx}`}
                        className="group relative rounded-2xl overflow-hidden border border-slate-700/60 bg-slate-900/70 min-h-[230px]"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-cyan-500/15 to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="grid grid-cols-[112px_minmax(0,1fr)] gap-4">
                          <div className="relative h-full">
                            <AppImage
                              src={getTimelineMedia(item?.year)}
                              alt={`${item?.year} milestone`}
                              className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/40 to-slate-900/90" />
                            <span className="absolute bottom-3 left-3 text-xs font-semibold text-white/85">
                              {item?.year}
                            </span>
                          </div>
                          <div className="py-5 pr-5">
                            <h3 className="text-lg font-semibold text-cyan-200 mb-2">
                              {item?.title}
                            </h3>
                            <p className="text-sm text-slate-300/90 leading-relaxed line-clamp-4">
                              {item?.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-slate-900 to-transparent" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-slate-900 to-transparent" />
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

      {/* Timeline Section */}
      <section className="py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h3 className="text-4xl md:text-5xl font-semibold mb-4 bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
              {history?.timelineTitle}
            </h3>
            {timelineIntro && (
              <p className="text-lg text-slate-300/90 max-w-3xl mx-auto">
                {timelineIntro}
              </p>
            )}
          </motion.div>

          <div className="relative border-l border-slate-700/60 ml-6">
            {timeline.map((item, idx) => (
              <motion.div
                key={`${item?.year}-${idx}`}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                className="relative pl-10 pb-12"
              >
                <span className="absolute left-0 top-2 -translate-x-1/2 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400/60 animate-ping" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500" />
                </span>
                <div className="rounded-3xl border border-slate-700/60 bg-slate-900/75 backdrop-blur px-6 py-5 shadow-[0_20px_60px_-40px_rgba(37,99,235,0.6)]">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm uppercase tracking-[0.4em] text-cyan-200/70">{item?.year}</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-cyan-400/60 to-transparent" />
                  </div>
                  <h4 className="text-xl font-semibold text-cyan-200 mb-2">{item?.title}</h4>
                  <p className="text-slate-200/90 leading-relaxed text-sm md:text-base">
                    {item?.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
