import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { DIVISIONS_CONFIG, getDivisionById } from '../../data/divisionsConfig';

const DivisionsHub = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDivisions, setFilteredDivisions] = useState(DIVISIONS_CONFIG);
  const currentLang = i18n.language;

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredDivisions(DIVISIONS_CONFIG);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = DIVISIONS_CONFIG.filter(division => {
        const name = division.name[currentLang]?.toLowerCase() || '';
        const tagline = division.tagline[currentLang]?.toLowerCase() || '';
        const description = division.description[currentLang]?.toLowerCase() || '';
        return name.includes(query) || tagline.includes(query) || description.includes(query);
      });
      setFilteredDivisions(filtered);
    }
  }, [searchQuery, currentLang]);

  const handleDivisionClick = (slug) => {
    navigate(`/divisions/${slug}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-20 px-4">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {currentLang === 'en' && 'NARA Divisions'}
              {currentLang === 'si' && 'NARA අංශ'}
              {currentLang === 'ta' && 'NARA பிரிவுகள்'}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              {currentLang === 'en' && 'Explore our 9 specialized divisions dedicated to marine research, aquatic conservation, and sustainable development'}
              {currentLang === 'si' && 'සමුද්‍ර පර්යේෂණ, ජලජ සංරක්ෂණ සහ තිරසාර සංවර්ධනය සඳහා කැප වූ අපගේ විශේෂිත අංශ 9 ගවේෂණය කරන්න'}
              {currentLang === 'ta' && 'கடல் ஆராய்ச்சி, நீர்வாழ் பாதுகாப்பு மற்றும் நிலையான வளர்ச்சிக்கு அர்ப்பணிக்கப்பட்ட எங்கள் 9 சிறப்புப் பிரிவுகளை ஆராயுங்கள்'}
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <LucideIcons.Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
                <input
                  type="text"
                  placeholder={
                    currentLang === 'en' ? 'Search divisions...' :
                    currentLang === 'si' ? 'අංශ සොයන්න...' :
                    'பிரிவுகளைத் தேடுங்கள்...'
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 rounded-full text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-xl"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Divisions Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        {filteredDivisions.length === 0 ? (
          <div className="text-center py-20">
            <LucideIcons.SearchX size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-xl text-gray-600">
              {currentLang === 'en' && 'No divisions found matching your search'}
              {currentLang === 'si' && 'ඔබේ සෙවුමට ගැලපෙන අංශ කිසිවක් හමු නොවීය'}
              {currentLang === 'ta' && 'உங்கள் தேடலுக்குப் பொருந்தும் பிரிவுகள் எதுவும் இல்லை'}
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredDivisions.map((division) => {
              const IconComponent = LucideIcons[division.icon] || LucideIcons.Briefcase;

              return (
                <motion.div
                  key={division.id}
                  variants={cardVariants}
                  whileHover={{ y: -8, scale: 1.02 }}
                  onClick={() => handleDivisionClick(division.slug)}
                  className="cursor-pointer"
                >
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full">
                    {/* Card Header with Gradient */}
                    <div className={`bg-gradient-to-r ${division.gradient} p-6 text-white`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                          <IconComponent size={32} />
                        </div>
                        <LucideIcons.ArrowRight size={24} className="opacity-70" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">
                        {division.name[currentLang]}
                      </h3>
                      <p className="text-sm opacity-90">
                        {division.tagline[currentLang]}
                      </p>
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                      <p className="text-gray-600 mb-6 line-clamp-3">
                        {division.description[currentLang]}
                      </p>

                      {/* Key Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                        <div>
                          <div className="text-2xl font-bold text-blue-600">
                            {division.focusAreas.length}
                          </div>
                          <div className="text-xs text-gray-500">
                            {currentLang === 'en' && 'Focus Areas'}
                            {currentLang === 'si' && 'අවධානය'}
                            {currentLang === 'ta' && 'கவனம்'}
                          </div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">
                            {division.services.length}
                          </div>
                          <div className="text-xs text-gray-500">
                            {currentLang === 'en' && 'Services'}
                            {currentLang === 'si' && 'සේවා'}
                            {currentLang === 'ta' && 'சேவைகள்'}
                          </div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">
                            <LucideIcons.Users size={24} className="mx-auto" />
                          </div>
                          <div className="text-xs text-gray-500">
                            {currentLang === 'en' && 'Team'}
                            {currentLang === 'si' && 'කණ්ඩායම'}
                            {currentLang === 'ta' && 'குழு'}
                          </div>
                        </div>
                      </div>

                      {/* Learn More Button */}
                      <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                        {currentLang === 'en' && 'Learn More'}
                        {currentLang === 'si' && 'වැඩිදුර දැනගන්න'}
                        {currentLang === 'ta' && 'மேலும் அறிக'}
                        <LucideIcons.ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            {currentLang === 'en' && 'Partner With Us'}
            {currentLang === 'si' && 'අප සමඟ හවුල් වන්න'}
            {currentLang === 'ta' && 'எங்களுடன் கூட்டு சேருங்கள்'}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {currentLang === 'en' && 'Collaborate with NARA\'s expert divisions for cutting-edge marine research and sustainable solutions'}
            {currentLang === 'si' && 'අති නවීන සමුද්‍ර පර්යේෂණ සහ තිරසාර විසඳුම් සඳහා NARA හි විශේෂඥ අංශ සමඟ සහයෝගයෙන් කටයුතු කරන්න'}
            {currentLang === 'ta' && 'அதிநவீன கடல் ஆராய்ச்சி மற்றும் நிலையான தீர்வுகளுக்காக NARA இன் நிபுணர் பிரிவுகளுடன் ஒத்துழைக்கவும்'}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => navigate('/contact')}
              className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            >
              <LucideIcons.Mail size={20} />
              {currentLang === 'en' && 'Contact Us'}
              {currentLang === 'si' && 'අප අමතන්න'}
              {currentLang === 'ta' && 'தொடர்பு கொள்ளுங்கள்'}
            </button>
            <button
              onClick={() => navigate('/research-excellence-portal')}
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center gap-2"
            >
              <LucideIcons.FileText size={20} />
              {currentLang === 'en' && 'View Research'}
              {currentLang === 'si' && 'පර්යේෂණ බලන්න'}
              {currentLang === 'ta' && 'ஆராய்ச்சியைப் பார்க்கவும்'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DivisionsHub;
