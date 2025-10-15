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
                    {timeline.length} milestones
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
              The NARA Emblem
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
                <h3 className="text-2xl md:text-3xl font-bold text-cyan-300 mb-6">Symbol of Excellence in Marine Research</h3>

                <div className="text-lg text-slate-200 leading-relaxed space-y-4 text-left">
                  <p>
                    The <span className="text-cyan-400 font-semibold">National Aquatic Resources Research and Development Agency (NARA)</span> emblem represents our commitment to advancing marine science and sustainable aquatic resource management in Sri Lanka.
                  </p>

                  <p className="flex items-start gap-3">
                    <Icons.Waves className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                    <span><strong className="text-cyan-300">The Ocean Waves</strong> symbolize our focus on marine and aquatic ecosystems, representing the vast coastal waters and inland water bodies that are central to our research mission.</span>
                  </p>

                  <p className="flex items-start gap-3">
                    <Icons.Fish className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                    <span><strong className="text-blue-300">Marine Life Elements</strong> embody our dedication to understanding and protecting aquatic biodiversity, from fisheries science to marine biology conservation.</span>
                  </p>

                  <p className="flex items-start gap-3">
                    <Icons.Globe className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
                    <span><strong className="text-emerald-300">The Circular Design</strong> represents our holistic approach to marine research, encompassing oceanography, limnology, aquaculture, and socio-economic studies.</span>
                  </p>

                  <p className="flex items-start gap-3">
                    <Icons.Sparkles className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
                    <span><strong className="text-amber-300">Scientific Excellence</strong> is reflected in every aspect of the emblem, showcasing our commitment to rigorous research, innovation, and sustainable development practices.</span>
                  </p>
                </div>

                {/* Logo History */}
                <div className="mt-8 pt-8 border-t border-cyan-400/20">
                  <h4 className="text-xl font-bold text-cyan-300 mb-4">Emblem History</h4>
                  <p className="text-slate-200 leading-relaxed">
                    Established in <span className="text-cyan-400 font-semibold">1981</span>, NARA's emblem has remained a constant symbol of scientific integrity and marine stewardship.
                    The design reflects our evolution from a nascent research institution to a world-class center for aquatic research excellence,
                    guiding our mission to protect and sustainably manage Sri Lanka's precious marine and aquatic resources for future generations.
                  </p>
                </div>

                {/* Logo Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
                  {[
                    { icon: Icons.Calendar, label: 'Established', value: '1981' },
                    { icon: Icons.Users, label: 'Researchers', value: '200+' },
                    { icon: Icons.FlaskConical, label: 'Research Areas', value: '8' },
                    { icon: Icons.Trophy, label: 'Years of Excellence', value: '40+' }
                  ].map((stat, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.7 + idx * 0.1 }}
                      className="text-center"
                    >
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-cyan-400/10 border border-cyan-400/30 mb-3">
                        <stat.icon className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                      <div className="text-sm text-slate-400">{stat.label}</div>
                    </motion.div>
                  ))}
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
              Leadership & Administration
            </h3>
            <p className="text-xl text-slate-300/90 max-w-3xl mx-auto leading-relaxed">
              Our organizational structure ensures excellence in marine research, with dedicated leaders guiding NARA's mission across Sri Lanka.
            </p>
          </motion.div>

          {/* Chairman - Highest Priority */}
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
                  {/* Photo */}
                  <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
                    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-amber-400/25 to-orange-500/25 border-2 border-amber-500/50 flex items-center justify-center shadow-[0_20px_60px_-30px_rgba(251,191,36,0.8)]">
                      <Icons.Crown className="w-16 h-16 md:w-20 md:h-20 text-amber-400" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-xl">
                      <Icons.Award className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  {/* Info */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                      <h3 className="text-3xl md:text-4xl font-bold text-amber-200">Chairman</h3>
                      <div className="hidden md:block h-px flex-1 bg-gradient-to-r from-amber-400/60 to-transparent" />
                    </div>
                    <p className="text-lg md:text-xl text-white/95 font-semibold mb-2">Prof. Sanath Hettiarachchi</p>
                    <div className="flex flex-col gap-1.5 text-sm text-slate-300/80 mb-3">
                      <div className="flex items-center justify-center md:justify-start gap-2">
                        <Icons.Mail className="w-4 h-4 text-amber-400/70" />
                        <a href="mailto:chairman@nara.ac.lk" className="hover:text-amber-300 transition">chairman@nara.ac.lk</a>
                      </div>
                      <div className="flex items-center justify-center md:justify-start gap-2">
                        <Icons.Phone className="w-4 h-4 text-amber-400/70" />
                        <a href="tel:+94112521881" className="hover:text-amber-300 transition">+94-11-2521881</a>
                      </div>
                    </div>
                    <p className="text-base text-slate-300/80 leading-relaxed">
                      Supreme administrative authority overseeing NARA's strategic direction, governance, and long-term vision for marine research excellence.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Executive Leadership Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-6xl mx-auto">
            {/* Director General */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="group relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition duration-500" />
              <div className="relative bg-slate-900/80 border border-cyan-500/40 rounded-2xl p-6 backdrop-blur shadow-[0_20px_60px_-40px_rgba(6,182,212,0.5)]">
                <div className="flex gap-5 items-start">
                  <div className="w-20 h-20 flex-shrink-0 rounded-xl bg-gradient-to-br from-cyan-400/25 to-blue-500/25 border border-cyan-500/50 flex items-center justify-center">
                    <Icons.User className="w-10 h-10 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-xl font-bold text-cyan-200">Director General</h4>
                      <div className="h-px flex-1 bg-gradient-to-r from-cyan-400/40 to-transparent" />
                    </div>
                    <p className="text-sm text-white/85 font-medium mb-2">Dr. K. Arulananthan</p>
                    <div className="space-y-1 text-xs text-slate-300/70 mb-2">
                      <div className="flex items-center gap-2">
                        <Icons.Mail className="w-3 h-3 text-cyan-400/70" />
                        <a href="mailto:dg@nara.ac.lk" className="hover:text-cyan-300 transition">dg@nara.ac.lk</a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icons.Phone className="w-3 h-3 text-cyan-400/70" />
                        <a href="tel:+94112521932" className="hover:text-cyan-300 transition">+94-11-2521932</a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icons.Smartphone className="w-3 h-3 text-cyan-400/70" />
                        <a href="tel:+94719353627" className="hover:text-cyan-300 transition">+94-71-9353627</a>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300/70 leading-relaxed">
                      Chief executive officer managing day-to-day operations and implementing strategic initiatives.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Deputy Director General */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="group relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/25 to-indigo-500/25 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition duration-500" />
              <div className="relative bg-slate-900/80 border border-blue-500/35 rounded-2xl p-6 backdrop-blur shadow-[0_20px_60px_-40px_rgba(59,130,246,0.5)]">
                <div className="flex gap-5 items-start">
                  <div className="w-20 h-20 flex-shrink-0 rounded-xl bg-gradient-to-br from-blue-400/20 to-indigo-500/20 border border-blue-500/45 flex items-center justify-center">
                    <Icons.UserCheck className="w-10 h-10 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-xl font-bold text-blue-200">Deputy Director General</h4>
                      <div className="h-px flex-1 bg-gradient-to-r from-blue-400/40 to-transparent" />
                    </div>
                    <p className="text-sm text-white/85 font-medium mb-2">Dr. K.H.M.L. Amaralal</p>
                    <p className="text-xs text-blue-200/70 mb-2">Research and Development</p>
                    <div className="space-y-1 text-xs text-slate-300/70 mb-2">
                      <div className="flex items-center gap-2">
                        <Icons.Mail className="w-3 h-3 text-blue-400/70" />
                        <a href="mailto:lalith@nara.ac.lk" className="hover:text-blue-300 transition">lalith@nara.ac.lk</a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icons.Phone className="w-3 h-3 text-blue-400/70" />
                        <a href="tel:+94112529754" className="hover:text-blue-300 transition">+94-11-2529754</a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icons.Smartphone className="w-3 h-3 text-blue-400/70" />
                        <a href="tel:+94719353275" className="hover:text-blue-300 transition">+94-71-9353275</a>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300/70 leading-relaxed">
                      Deputy chief executive supporting operational excellence and strategic planning.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Division Directors */}
          <div className="mb-12 max-w-6xl mx-auto">
            <h4 className="text-2xl font-bold text-slate-200 mb-6 flex items-center gap-3">
              <Icons.Users className="w-6 h-6 text-slate-400" />
              Heads of Divisions
            </h4>
            <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {[
                {
                  name: 'Dr. K.A.W.S. Weerasekara',
                  position: 'Principal Scientist',
                  division: 'Head, Environmental Studies Division',
                  expertise: 'Aquatic pollution, water quality assessment, pesticide residue analysis, harmful marine microalgae',
                  education: 'PhD in Environmental Management, M.Sc. in Natural Resource Management',
                  email: 'shyamalikaww@nara.ac.lk',
                  icon: Icons.Leaf,
                  delay: 0.1
                },
                {
                  name: 'Dr. W.N.C. Priyadarshani',
                  position: 'Principal Scientist',
                  division: 'Acting Head, Fishing Technology Division',
                  expertise: 'Fishing technology, coral-associated fish, marine plankton and benthos diversity',
                  education: 'Specialization in Fishing Technology',
                  email: 'nilanthi_priyadarshani@yahoo.com',
                  icon: Icons.Anchor,
                  delay: 0.15
                },
                {
                  name: 'Mr. S.R.C. Ranaweera',
                  position: 'Chief Hydrographer',
                  division: 'National Hydrographic Office',
                  expertise: 'National Charting Programme, multibeam backscatter technology, hydrographic surveying',
                  education: 'Category A Certification in Hydrographic Surveying, Post Graduate Diploma in Ocean Mapping, Master in Business Studies',
                  email: 'roshanccom@gmail.com',
                  icon: Icons.Waves,
                  delay: 0.2
                },
                {
                  name: 'Dr. P.P.M. Heenatigala',
                  position: 'Principal Scientist',
                  division: 'Head, Inland Aquatic Resources and Aquaculture Division',
                  expertise: 'Aquatic animal health management, bacterial and viral diseases, vaccine development for fish',
                  education: 'PhD in Genetics (Chinese Academy of Science), MSc in Food and Nutrition, BSc in Biological Science',
                  email: 'prajani@nara.ac.lk',
                  icon: Icons.Shell,
                  delay: 0.25
                },
                {
                  name: 'Dr. R.P. Prabath Krishantha Jayasinghe',
                  position: 'Principal Scientist',
                  division: 'Head, Marine Biological Resources Division',
                  expertise: 'Fisheries management, marine biodiversity, coral reefs, tuna and billfish fisheries',
                  education: 'PhD in Marine and Coastal Management (Spain), M.Sc. in Water and Coastal Management (Portugal)',
                  email: 'prabath_jayasinghe@yahoo.com',
                  icon: Icons.Fish,
                  delay: 0.3
                },
                {
                  name: 'Mr. P.A.D. Ajith Kumara',
                  position: 'Director',
                  division: 'Monitoring and Evaluation',
                  expertise: 'Sea cucumber aquaculture, population dynamics, indigenous fish species research',
                  education: 'M.Phil (University of Kelaniya), B.Sc. Special in Zoology',
                  email: 'ajithkumaranara@gmail.com',
                  icon: Icons.BarChart,
                  delay: 0.35
                },
                {
                  name: 'Mr. R.M.R.M. Jayathilaka',
                  position: 'Senior Scientist',
                  division: 'Acting Head, Oceanography Division',
                  expertise: 'Coastal oceanography, climate change impacts, numerical modeling, coastal erosion',
                  education: 'PhD Candidate (Earth Resources Engineering), MSc in Coastal Engineering (IHE Delft, Netherlands)',
                  email: 'ruchira.jayathilaka@gmail.com',
                  icon: Icons.Globe,
                  delay: 0.4
                },
                {
                  name: 'Ms. D.W.L.U. De Silva',
                  position: 'Researcher',
                  division: 'Acting Head, Socio-Economics & Marketing Research Division',
                  expertise: 'Socio-economic analysis, seafood value chains, climate change vulnerability, fish demand modeling',
                  education: 'Master of Science in Applied Statistics (University of Peradeniya)',
                  email: 'lasamiupsala@gmail.com',
                  icon: Icons.TrendingUp,
                  delay: 0.45
                },
                {
                  name: 'Mr. R.D.P.P. Ranasinghe',
                  position: 'Director',
                  division: 'Administration & Human Resources Management',
                  expertise: 'Personnel management, administrative functions, human resource operations',
                  education: 'MBA, BSc, Diploma in HR',
                  email: 'directoradmin@nara.ac.lk',
                  icon: Icons.Briefcase,
                  delay: 0.5
                },
                {
                  name: 'Vacant',
                  position: 'Position Open',
                  division: 'Post Harvest Technology Division',
                  expertise: 'Seeking qualified candidate',
                  education: '',
                  email: '',
                  icon: Icons.Package,
                  delay: 0.55
                }
              ].map((director, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: director.delay }}
                  className="group relative"
                >
                  <div className="absolute -inset-1 bg-slate-500/10 rounded-xl opacity-0 group-hover:opacity-100 blur-lg transition" />
                  <div className={`relative bg-slate-900/70 border ${director.name === 'Vacant' ? 'border-slate-700/20' : 'border-slate-700/50'} rounded-2xl p-6 hover:border-slate-600/70 transition-all duration-300`}>
                    <div className="flex gap-4">
                      <div className="w-14 h-14 flex-shrink-0 rounded-xl bg-slate-800/80 border border-slate-600/60 flex items-center justify-center">
                        <director.icon className="w-6 h-6 text-slate-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className={`text-base font-bold ${director.name === 'Vacant' ? 'text-slate-500' : 'text-slate-100'} mb-1`}>{director.name}</h5>
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

                        <div className="mb-3 p-2.5 bg-slate-800/30 rounded-lg">
                          <div className="flex items-start gap-1.5">
                            <Icons.Lightbulb className="w-3.5 h-3.5 text-amber-400/70 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-slate-300/80 leading-relaxed">{director.expertise}</p>
                          </div>
                        </div>

                        {director.email && (
                          <div className="flex items-center gap-2">
                            <Icons.Mail className="w-3.5 h-3.5 text-cyan-400/70 flex-shrink-0" />
                            <a href={`mailto:${director.email}`} className="text-xs text-cyan-400/80 hover:text-cyan-300 transition truncate">{director.email}</a>
                          </div>
                        )}
                        {!director.email && (
                          <p className="text-xs text-slate-500 italic flex items-center gap-1.5">
                            <Icons.AlertCircle className="w-3.5 h-3.5" />
                            Position currently vacant
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Governing Board Members */}
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Icons.Shield className="w-6 h-6 text-emerald-400" />
              <h4 className="text-2xl font-bold text-slate-200">Governing Board Members</h4>
              <div className="h-px flex-1 bg-gradient-to-r from-emerald-400/30 to-transparent" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Prof. Sanath Hettiarachchi', role: 'Chairman', delay: 0.1 },
                { name: 'Dr. Keerthi Sri Senarathna Atapaththu', role: 'Member', delay: 0.15 },
                { name: 'Prof. M.P.K.S.K. De Silva', role: 'Member', delay: 0.2 },
                { name: 'Dr. Cdr. S. U. Lanka Prasada', role: 'Member', delay: 0.25 },
                { name: 'Mr. Kapila R.A. Tissera', role: 'Member', delay: 0.3 },
                { name: 'Mr. Perera Shanaka Paththinigama', role: 'Member', delay: 0.35 },
                { name: 'Mr. Kithsiri Dharmapriya', role: 'Chairman, National Aquaculture Development Authority', delay: 0.4 },
                { name: 'Mr. Udayakantha Wickramasinghe', role: 'Member', delay: 0.45 },
                { name: 'Mr. G.L. Wernon Perera', role: 'Additional Secretary, Ministry of Fisheries and Ocean Resources', delay: 0.5 }
              ].map((member, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: member.delay }}
                  className="bg-slate-900/40 border border-emerald-500/15 rounded-lg p-4 hover:border-emerald-500/30 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <Icons.UserCheck className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-semibold text-slate-200 mb-0.5 truncate">{member.name}</h5>
                      <p className="text-xs text-slate-400 leading-relaxed">{member.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
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
