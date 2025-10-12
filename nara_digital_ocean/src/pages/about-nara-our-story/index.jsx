import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Header from '../../components/ui/Header';
import * as Icons from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <Header />
      <div style={{ height: '72px' }} />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-900 to-cyan-950">
          <div className="absolute inset-0 opacity-30">
            <motion.div
              animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
              transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
              className="w-full h-full"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.1) 0%, transparent 50%), " +
                  "radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)"
              }}
            />
          </div>
          {[...Array(30)].map((_, index) => (
            <motion.div
              key={index}
              className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
              animate={{
                y: [0, -120, 0],
                x: [0, Math.random() * 80 - 40, 0],
                opacity: [0, 0.8, 0]
              }}
              transition={{
                duration: Math.random() * 8 + 6,
                repeat: Infinity,
                delay: Math.random() * 5
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, type: 'spring' }}
              className="mb-8 inline-block"
            >
              <Icons.Waves className="w-24 h-24 text-cyan-400 drop-shadow-[0_0_30px_rgba(6,182,212,0.6)]" />
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent animate-gradient">
              {t('about.hero.title')}
            </h1>

            <p className="text-2xl md:text-3xl mb-12 text-cyan-100/90 font-light tracking-wide">
              {t('about.hero.subtitle')}
            </p>

            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="inline-flex flex-col items-center gap-2 text-cyan-300/60"
            >
              <span className="text-sm uppercase tracking-widest">Scroll to Explore</span>
              <Icons.ChevronDown className="w-6 h-6" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-32 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/20 to-transparent" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
              {t('about.overview.title')}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur-xl" />
            <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-3xl p-12 border border-slate-700/50">
              <p className="text-xl md:text-2xl text-slate-200 leading-relaxed font-light">
                {t('about.overview.content')}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-32 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500" />
              <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-10 border border-slate-700/50 h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-cyan-500/10 rounded-2xl">
                    <Icons.Eye className="w-10 h-10 text-cyan-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-cyan-300">
                    {t('about.vision.title')}
                  </h3>
                </div>
                <p className="text-lg text-slate-300 leading-relaxed">
                  {t('about.vision.content')}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500" />
              <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-10 border border-slate-700/50 h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-blue-500/10 rounded-2xl">
                    <Icons.Target className="w-10 h-10 text-blue-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-blue-300">
                    {t('about.mission.title')}
                  </h3>
                </div>
                <p className="text-lg text-slate-300 leading-relaxed">
                  {t('about.mission.content')}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Logo Story Section */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/30 via-blue-950/30 to-transparent" />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="inline-block mb-8"
            >
              <div className="w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(6,182,212,0.5)]">
                <Icons.Fish className="w-16 h-16 text-white" />
              </div>
            </motion.div>

            <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
              {t('about.logo.title')}
            </h2>

            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-3xl blur-xl" />
              <div className="relative bg-slate-900/60 backdrop-blur-xl rounded-3xl p-10 border border-slate-700/30">
                <p className="text-xl text-slate-200 leading-relaxed font-light">
                  {t('about.logo.content')}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Legacy Timeline Section */}
      <section className="py-32 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
              {t('about.legacy.title')}
            </h2>
            <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
              {t('about.legacy.intro')}
            </p>
          </motion.div>

          <div className="space-y-12">
            {['1981', '1996', '2000s', '2010s'].map((period, index) => (
              <motion.div
                key={period}
                initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                <div className="flex items-start gap-8">
                  <div className="flex-shrink-0 w-32 text-right">
                    <span className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      {period}
                    </span>
                  </div>

                  <div className="flex-grow">
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-all duration-300" />
                      <div className="relative bg-slate-900/80 backdrop-blur border border-slate-700/50 rounded-2xl p-8">
                        <p className="text-lg text-slate-200 leading-relaxed">
                          {t(`about.legacy.periods.${period}`)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mandate Section */}
      <section className="py-32 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/20 to-transparent" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
              {t('about.mandate.title')}
            </h2>
            <p className="text-xl text-slate-300 max-w-4xl mx-auto">
              {t('about.mandate.intro')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[0, 1, 2, 3, 4, 5, 6].map((index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-all duration-300" />
                <div className="relative bg-slate-900 border border-slate-700/50 rounded-2xl p-8 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                    <h3 className="text-xl font-bold text-cyan-300">
                      {t(`about.mandate.pillars.${index}.title`)}
                    </h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {t(`about.mandate.pillars.${index}.text`)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <p className="text-2xl text-cyan-300 font-light italic">
              {t('about.mandate.closing')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/40 via-blue-950/40 to-cyan-950/40" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
              {t('about.cta.title')}
            </h2>
            <p className="text-2xl text-slate-300 mb-12 font-light">
              {t('about.cta.description')}
            </p>

            <motion.a
              href="http://www.nara.ac.lk"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-12 py-5 rounded-full text-xl font-semibold shadow-[0_0_40px_rgba(6,182,212,0.4)] hover:shadow-[0_0_60px_rgba(6,182,212,0.6)] transition-all duration-300"
            >
              {t('about.cta.button')}
              <Icons.ArrowRight className="w-6 h-6" />
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutNARAStoryPage;
