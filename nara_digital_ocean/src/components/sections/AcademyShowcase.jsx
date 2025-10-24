import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Award, 
  Target,
  ExternalLink,
  School,
  Globe2,
  Monitor,
  ArrowUpRight,
  CheckCircle2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSchoolList } from '../../hooks/useSchoolList';

const AcademyShowcase = () => {
  const { t, i18n } = useTranslation('home');
  const [hoveredCard, setHoveredCard] = useState(null);
  const currentLanguage = i18n.language;
  
  // Fetch school list from Firebase Storage
  const SCHOOL_LIST_URL =
    'https://firebasestorage.googleapis.com/v0/b/nara-aquaschool.appspot.com/o/Tbl20200101.xlsx?alt=media&token=d211f254-5d39-415c-ade5-524031d9287a';
  const { schools, loading: schoolsLoading, stats: schoolStats } = useSchoolList(SCHOOL_LIST_URL);

  const programsData = [
    {
      id: 'aquaSchool',
      url: 'https://nara-aquaschool.web.app/',
      icon: School,
      gradient: 'from-cyan-500 to-blue-500',
      bgGradient: 'from-cyan-500/10 to-blue-500/10'
    },
    {
      id: 'nexus',
      url: 'https://nexus-nara.web.app/',
      icon: GraduationCap,
      gradient: 'from-purple-500 to-indigo-500',
      bgGradient: 'from-purple-500/10 to-indigo-500/10'
    }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.15) 1px, transparent 0)',
            backgroundSize: '48px 48px'
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-slate-900/60 px-4 py-2 text-xs uppercase tracking-[0.35em] text-cyan-200/90 backdrop-blur mb-6">
            <GraduationCap className="h-4 w-4" />
            <span>{t('academy.badge')}</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold font-space mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              {t('academy.titleLine1')}
            </span>
            <br />
            <span className="text-white">{t('academy.titleLine2')}</span>
          </h2>
          
          <p className="text-base md:text-lg text-slate-300/90 max-w-3xl mx-auto">
            {t('academy.subtitle')}
          </p>
        </motion.div>

        {/* Equal-Sized Program Tiles */}
        <div className="grid md:grid-cols-2 gap-6 mb-12" key={currentLanguage}>
          {programsData.map((program, index) => {
            const Icon = program.icon;
            const isHovered = hoveredCard === program.id;
            
            // Get translated content with fallbacks
            const programContent = t(`academy.programs.${program.id}`, { 
              returnObjects: true,
              defaultValue: {
                title: program.id === 'aquaSchool' ? 'Aqua School' : 'Nexus Graduate Program',
                subtitle: program.id === 'aquaSchool' ? 'Marine Education for Young Minds' : 'Advanced Marine Research & Innovation',
                description: '',
                features: [],
                stats: []
              }
            });
            
            // Use real data for Aqua School if available
            let displayStats = programContent.stats;
            if (program.id === 'aquaSchool' && schoolStats && schoolStats.totalSchools > 0) {
              displayStats = [
                { label: programContent.stats?.[0]?.label || 'Students', value: `${schoolStats.totalStudents.toLocaleString()}+` },
                { label: programContent.stats?.[1]?.label || 'Courses', value: programContent.stats?.[1]?.value || '25+' },
                { label: programContent.stats?.[2]?.label || 'Schools', value: `${schoolStats.totalSchools}+` }
              ];
            }
            
            return (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                onMouseEnter={() => setHoveredCard(program.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className="relative group"
              >
                {/* Main Card */}
                <div className="relative h-full rounded-2xl overflow-hidden border border-slate-700/50 bg-slate-900/60 backdrop-blur transition-all duration-300 hover:border-cyan-500/30">
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${program.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  {/* Content Container */}
                  <div className="relative h-full flex flex-col">
                    {/* Website Preview Section */}
                    <div className="relative flex-shrink-0">
                      {/* Browser Header */}
                      <div className="flex items-center justify-between px-4 py-3 bg-slate-800/80 border-b border-slate-700/50">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-700/50">
                          <Monitor className="w-3 h-3 text-slate-400" />
                          <span className="text-xs text-slate-400">{t('academy.preview')}</span>
                        </div>
                      </div>

                      {/* Live iframe Preview */}
                      <div className="relative aspect-[16/9] bg-slate-950 overflow-hidden">
                        <iframe
                          src={program.url}
                          className="w-full h-full"
                          title={`${programContent.title} ${t('academy.preview')}`}
                          sandbox="allow-scripts allow-same-origin"
                          loading="lazy"
                        />
                        
                        {/* Click Overlay */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: isHovered ? 1 : 0 }}
                          className="absolute inset-0 bg-slate-900/95 backdrop-blur-sm flex items-center justify-center cursor-pointer"
                          onClick={() => window.location.href = program.url}
                        >
                          <div className="text-center px-4">
                            <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r ${program.gradient} text-white font-semibold shadow-lg transform transition-transform hover:scale-105`}>
                              <span>{t('academy.visitWebsite')}</span>
                              <ArrowUpRight className="w-5 h-5" />
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </div>

                    {/* Program Details Section */}
                    <div className="flex-1 flex flex-col p-6">
                      {/* Header */}
                      <div className="mb-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${program.gradient} bg-opacity-10 border border-slate-700/50 mb-3`}>
                          <Icon className="w-4 h-4 text-cyan-400" />
                          <span className="text-xs font-medium text-cyan-300">{programContent.subtitle}</span>
                        </div>
                        
                        <h3 className="text-2xl font-bold font-space text-white mb-2">
                          {programContent.title}
                        </h3>
                        
                        <p className="text-sm text-slate-300/80 leading-relaxed">
                          {programContent.description}
                        </p>
                      </div>

                      {/* Stats Row */}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {displayStats?.map((stat, idx) => (
                          <div key={idx} className="text-center p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                            <div className="text-lg font-bold text-white font-space">{stat.value}</div>
                            <div className="text-xs text-slate-400">{stat.label}</div>
                          </div>
                        ))}
                      </div>

                      {/* Features List */}
                      <div className="flex-1 mb-4">
                        <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-3">
                          {t('academy.keyFeatures')}
                        </div>
                        <div className="space-y-2">
                          {programContent.features?.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                              <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 text-cyan-400`} />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CTA Button */}
                      <a
                        href={program.url}
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = program.url;
                        }}
                        className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r ${program.gradient} text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 mt-auto`}
                      >
                        <span>{t('academy.explore')} {programContent.title}</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Info Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center items-center gap-6 md:gap-8"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <Award className="w-5 h-5 text-cyan-400" />
            <span className="text-sm font-medium text-slate-300">{t('academy.badges.accredited')}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <Target className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-medium text-slate-300">{t('academy.badges.industryAligned')}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <Users className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-medium text-slate-300">{t('academy.badges.expertFaculty')}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <Globe2 className="w-5 h-5 text-green-400" />
            <span className="text-sm font-medium text-slate-300">{t('academy.badges.globalRecognition')}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AcademyShowcase;
