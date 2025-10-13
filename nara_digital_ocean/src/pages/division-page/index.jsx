import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { getDivisionBySlug } from '../../data/divisionsConfig';
import { getDivisionContent, getProjects, getTeamMembers } from '../../services/divisionsService';

const DivisionPage = () => {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const currentLang = i18n.language;

  const [divisionData, setDivisionData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    const loadDivisionData = async () => {
      try {
        setLoading(true);

        // Load base config
        const configData = getDivisionBySlug(slug);

        if (!configData) {
          console.error('Division not found for slug:', slug);
          setLoading(false);
          return;
        }

        // Set initial data from config
        setDivisionData(configData);

        // Try to load custom content from Firebase (optional)
        try {
          const customContent = await getDivisionContent(configData.id);

          // Merge config with custom content
          if (customContent) {
            setDivisionData({ ...configData, ...customContent });
          }

          // Load projects and team
          const [projectsData, teamData] = await Promise.all([
            getProjects(configData.id),
            getTeamMembers(configData.id)
          ]);

          setProjects(projectsData);
          setTeamMembers(teamData);
        } catch (firebaseError) {
          console.log('Firebase data not available, using config only:', firebaseError);
          // Continue with config data only
        }

      } catch (error) {
        console.error('Error loading division data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDivisionData();
  }, [slug, currentLang, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (!divisionData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LucideIcons.AlertCircle size={64} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Division Not Found</h2>
          <button
            onClick={() => navigate('/divisions')}
            className="text-blue-600 underline"
          >
            Back to Divisions
          </button>
        </div>
      </div>
    );
  }

  const IconComponent = LucideIcons[divisionData.icon] || LucideIcons.Briefcase;

  const sections = [
    { id: 'overview', label: { en: 'Overview', si: 'දළ විශ්ලේෂණය', ta: 'கண்ணோட்டம்' }, icon: 'Info' },
    { id: 'focus', label: { en: 'Focus Areas', si: 'අවධාන ක්ෂේත්‍ර', ta: 'கவன பகுதிகள்' }, icon: 'Target' },
    { id: 'services', label: { en: 'Services', si: 'සේවා', ta: 'சேவைகள்' }, icon: 'Briefcase' },
    { id: 'projects', label: { en: 'Projects', si: 'ව්‍යාපෘති', ta: 'திட்டங்கள்' }, icon: 'FolderOpen' },
    { id: 'team', label: { en: 'Our Team', si: 'අපගේ කණ්ඩායම', ta: 'எங்கள் குழு' }, icon: 'Users' },
    { id: 'contact', label: { en: 'Contact', si: 'අමතන්න', ta: 'தொடர்பு' }, icon: 'Phone' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className={`relative bg-gradient-to-r ${divisionData.gradient} text-white py-24 px-4`}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <button
              onClick={() => navigate('/divisions')}
              className="mb-6 flex items-center gap-2 text-white/90 hover:text-white transition-colors"
            >
              <LucideIcons.ArrowLeft size={20} />
              {currentLang === 'en' && 'Back to Divisions'}
              {currentLang === 'si' && 'අංශ වෙත ආපසු'}
              {currentLang === 'ta' && 'பிரிவுகளுக்குத் திரும்பு'}
            </button>

            <div className="flex items-start gap-6 mb-8">
              <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl">
                <IconComponent size={64} />
              </div>
              <div className="flex-1">
                <h1 className="text-5xl font-bold mb-4">
                  {divisionData.name[currentLang]}
                </h1>
                <p className="text-2xl opacity-90 mb-6">
                  {divisionData.tagline[currentLang]}
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="font-semibold">{divisionData.focusAreas.length}</span> Focus Areas
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="font-semibold">{divisionData.services.length}</span> Services
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="font-semibold">{projects.length}</span> Active Projects
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="sticky top-0 bg-white shadow-md z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto scrollbar-hide">
            {sections.map((section) => {
              const SectionIcon = LucideIcons[section.icon];
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-semibold whitespace-nowrap transition-colors border-b-4 ${
                    activeSection === section.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <SectionIcon size={20} />
                  {section.label[currentLang]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Overview Section */}
        {activeSection === 'overview' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <LucideIcons.Info className="text-blue-600" size={32} />
                {currentLang === 'en' && 'About This Division'}
                {currentLang === 'si' && 'මෙම අංශය ගැන'}
                {currentLang === 'ta' && 'இந்தப் பிரிவு பற்றி'}
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                {divisionData.description[currentLang]}
              </p>
            </div>
          </motion.section>
        )}

        {/* Focus Areas Section */}
        {activeSection === 'focus' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <LucideIcons.Target className="text-blue-600" size={32} />
              {currentLang === 'en' && 'Research Focus Areas'}
              {currentLang === 'si' && 'පර්යේෂණ අවධාන ක්ෂේත්‍ර'}
              {currentLang === 'ta' && 'ஆராய்ச்சி கவன பகுதிகள்'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {divisionData.focusAreas.map((area, index) => {
                const AreaIcon = LucideIcons[area.icon] || LucideIcons.Circle;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`bg-gradient-to-r ${divisionData.gradient} p-3 rounded-xl text-white`}>
                        <AreaIcon size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">
                          {area.title[currentLang]}
                        </h3>
                        <p className="text-gray-600">
                          {area.description[currentLang]}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* Services Section */}
        {activeSection === 'services' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <LucideIcons.Briefcase className="text-blue-600" size={32} />
              {currentLang === 'en' && 'Services We Offer'}
              {currentLang === 'si' && 'අප සපයන සේවා'}
              {currentLang === 'ta' && 'நாங்கள் வழங்கும் சேவைகள்'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {divisionData.services.map((service, index) => {
                const ServiceIcon = LucideIcons[service.icon] || LucideIcons.CheckCircle;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:-translate-y-2"
                  >
                    <div className={`bg-gradient-to-r ${divisionData.gradient} w-16 h-16 rounded-xl flex items-center justify-center text-white mb-4`}>
                      <ServiceIcon size={28} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">
                      {service.title[currentLang]}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {service.description[currentLang]}
                    </p>
                    <button className="text-blue-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                      {currentLang === 'en' && 'Learn More'}
                      {currentLang === 'si' && 'වැඩිදුර දැනගන්න'}
                      {currentLang === 'ta' && 'மேலும் அறிக'}
                      <LucideIcons.ArrowRight size={16} />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* Projects Section */}
        {activeSection === 'projects' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <LucideIcons.FolderOpen className="text-blue-600" size={32} />
              {currentLang === 'en' && 'Active Projects'}
              {currentLang === 'si' && 'ක්‍රියාකාරී ව්‍යාපෘති'}
              {currentLang === 'ta' && 'செயலில் உள்ள திட்டங்கள்'}
            </h2>
            {projects.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <LucideIcons.FolderOpen size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">
                  {currentLang === 'en' && 'No projects available yet'}
                  {currentLang === 'si' && 'තවම ව්‍යාපෘති නොමැත'}
                  {currentLang === 'ta' && 'இன்னும் திட்டங்கள் இல்லை'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-2">
                          {project.title?.[currentLang] || project.titleEN}
                        </h3>
                        <p className="text-gray-600">
                          {project.description?.[currentLang] || project.descriptionEN}
                        </p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        project.status === 'Active' ? 'bg-green-100 text-green-700' :
                        project.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    {project.startDate && (
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-4">
                        <span className="flex items-center gap-1">
                          <LucideIcons.Calendar size={16} />
                          {project.startDate} - {project.endDate || 'Ongoing'}
                        </span>
                        {project.fundingSource && (
                          <span className="flex items-center gap-1">
                            <LucideIcons.DollarSign size={16} />
                            {project.fundingSource}
                          </span>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>
        )}

        {/* Team Section */}
        {activeSection === 'team' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <LucideIcons.Users className="text-blue-600" size={32} />
              {currentLang === 'en' && 'Meet Our Team'}
              {currentLang === 'si' && 'අපගේ කණ්ඩායම හමුවන්න'}
              {currentLang === 'ta' && 'எங்கள் குழுவைச் சந்திக்கவும்'}
            </h2>
            {teamMembers.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <LucideIcons.Users size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">
                  {currentLang === 'en' && 'Team information coming soon'}
                  {currentLang === 'si' && 'කණ්ඩායම් තොරතුරු ඉක්මනින්'}
                  {currentLang === 'ta' && 'குழு தகவல் விரைவில்'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow"
                  >
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold">
                      {member.photoUrl ? (
                        <img src={member.photoUrl} alt={member.name?.[currentLang] || member.nameEN} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        (member.name?.[currentLang] || member.nameEN)?.charAt(0)
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-1">
                      {member.name?.[currentLang] || member.nameEN}
                    </h3>
                    <p className="text-gray-600 mb-2">{member.position}</p>
                    {member.email && (
                      <a href={`mailto:${member.email}`} className="text-blue-600 text-sm flex items-center justify-center gap-1">
                        <LucideIcons.Mail size={14} />
                        {member.email}
                      </a>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>
        )}

        {/* Contact Section */}
        {activeSection === 'contact' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <LucideIcons.Phone className="text-blue-600" size={32} />
              {currentLang === 'en' && 'Get In Touch'}
              {currentLang === 'si' && 'අප හා සම්බන්ධ වන්න'}
              {currentLang === 'ta' && 'தொடர்பு கொள்ளுங்கள்'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold mb-6">
                  {currentLang === 'en' && 'Contact Information'}
                  {currentLang === 'si' && 'සම්බන්ධතා තොරතුරු'}
                  {currentLang === 'ta' && 'தொடர்பு தகவல்'}
                </h3>
                <div className="space-y-4">
                  {(divisionData.contact?.email || divisionData.contactEmail) && (
                    <div className="flex items-center gap-3">
                      <LucideIcons.Mail className="text-blue-600" size={24} />
                      <div>
                        <div className="text-sm text-gray-500">Email</div>
                        <a href={`mailto:${divisionData.contact?.email || divisionData.contactEmail}`} className="text-blue-600 hover:underline">
                          {divisionData.contact?.email || divisionData.contactEmail}
                        </a>
                      </div>
                    </div>
                  )}
                  {(divisionData.contact?.phone || divisionData.contactPhone) && (
                    <div className="flex items-center gap-3">
                      <LucideIcons.Phone className="text-blue-600" size={24} />
                      <div>
                        <div className="text-sm text-gray-500">Phone</div>
                        <a href={`tel:${divisionData.contact?.phone || divisionData.contactPhone}`} className="text-blue-600 hover:underline">
                          {divisionData.contact?.phone || divisionData.contactPhone}
                        </a>
                      </div>
                    </div>
                  )}
                  {(divisionData.contact?.location || divisionData.location) && (
                    <div className="flex items-center gap-3">
                      <LucideIcons.MapPin className="text-blue-600" size={24} />
                      <div>
                        <div className="text-sm text-gray-500">Location</div>
                        <p>{divisionData.contact?.location?.[currentLang] || divisionData.location}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl shadow-lg p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">
                  {currentLang === 'en' && 'Collaborate With Us'}
                  {currentLang === 'si' && 'අප සමඟ සහයෝගයෙන් කටයුතු කරන්න'}
                  {currentLang === 'ta' && 'எங்களுடன் ஒத்துழைக்கவும்'}
                </h3>
                <p className="mb-6">
                  {currentLang === 'en' && 'Interested in partnering with our division? We welcome collaborations from researchers, industry partners, and organizations.'}
                  {currentLang === 'si' && 'අපගේ අංශය සමඟ හවුල් වීමට කැමතිද? පර්යේෂකයන්, කර්මාන්ත හවුල්කරුවන් සහ සංවිධාන වෙතින් අපි සහයෝගීතාවය පිළිගනිමු.'}
                  {currentLang === 'ta' && 'எங்கள் பிரிவுடன் கூட்டு சேர விரும்புகிறீர்களா? ஆராய்ச்சியாளர்கள், தொழில் பங்காளர்கள் மற்றும் நிறுவனங்களிடமிருந்து நாங்கள் ஒத்துழைப்புகளை வரவேற்கிறோம்.'}
                </p>
                <button
                  onClick={() => navigate('/contact')}
                  className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:shadow-xl transition-all flex items-center gap-2"
                >
                  <LucideIcons.Send size={20} />
                  {currentLang === 'en' && 'Send Message'}
                  {currentLang === 'si' && 'පණිවිඩයක් යවන්න'}
                  {currentLang === 'ta' && 'செய்தி அனுப்பவும்'}
                </button>
              </div>
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
};

export default DivisionPage;
