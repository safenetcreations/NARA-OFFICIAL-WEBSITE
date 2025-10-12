import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, AlertCircle, Shield, Scale, Users, Globe } from 'lucide-react';

const TermsOfUse = () => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    window.scrollTo(0, 0);
    const lang = localStorage.getItem('nara-lang') || 'en';
    setLanguage(lang);
    const handleLanguageChange = (e) => setLanguage(e.detail);
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const content = {
    en: {
      title: 'Terms of Use',
      subtitle: 'Digital Services - National Aquatic Resources Research & Development Agency',
      effectiveDate: 'Effective Date: January 1, 2025',
      lastUpdated: 'Last Updated: January 1, 2025',
      
      intro: {
        title: 'Introduction',
        text: 'Welcome to the National Aquatic Resources Research and Development Agency (NARA) digital platform. These Terms of Use govern your access to and use of our website, mobile applications, and digital services (collectively, "Services"). By accessing or using our Services, you agree to be bound by these Terms and all applicable laws and regulations of Sri Lanka.'
      },

      acceptance: {
        title: 'Acceptance of Terms',
        points: [
          'You must be at least 18 years old to use our Services independently.',
          'By using our Services, you represent that you have the legal capacity to enter into this agreement.',
          'If you are using our Services on behalf of an organization, you represent that you have authority to bind that organization to these Terms.',
          'Your continued use of the Services constitutes acceptance of any updated Terms.'
        ]
      },

      services: {
        title: 'Description of Services',
        text: 'NARA provides the following digital services:',
        items: [
          'Research data and publications access',
          'Educational resources and training materials',
          'Online application and registration portals',
          'Marketplace and trading platforms',
          'Data analytics and intelligence dashboards',
          'Emergency response and notification systems',
          'Collaboration and partnership platforms'
        ]
      },

      user: {
        title: 'User Responsibilities',
        sections: [
          {
            name: 'Account Security',
            text: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.'
          },
          {
            name: 'Accurate Information',
            text: 'You must provide accurate, current, and complete information when registering and using our Services.'
          },
          {
            name: 'Lawful Use',
            text: 'You agree to use our Services only for lawful purposes and in accordance with these Terms and all applicable Sri Lankan laws.'
          },
          {
            name: 'Prohibited Activities',
            text: 'You must not engage in unauthorized access, data scraping, transmission of malicious code, or any activity that disrupts our Services.'
          }
        ]
      },

      intellectual: {
        title: 'Intellectual Property Rights',
        text: 'All content, features, and functionality of our Services are owned by NARA or its licensors and are protected by:',
        rights: [
          'Copyright laws of Sri Lanka and international treaties',
          'Trademark and service mark protections',
          'Database rights and compilations',
          'Proprietary algorithms and methodologies'
        ],
        usage: 'You may access and use our content for personal, non-commercial purposes only. Commercial use requires prior written authorization from NARA.'
      },

      government: {
        title: 'Government Authority',
        text: 'As a Sri Lankan government agency, NARA operates under specific statutory obligations:',
        points: [
          'We may modify or discontinue Services based on government directives.',
          'Access to certain Services may be restricted based on national security considerations.',
          'We cooperate fully with law enforcement and regulatory agencies.',
          'Government policies and regulations supersede these Terms where applicable.'
        ]
      },

      data: {
        title: 'Data Collection and Privacy',
        text: 'Our collection and use of personal data is governed by:',
        laws: [
          'Personal Data Protection Act, No. 9 of 2022 (PDPA)',
          'Right to Information Act, No. 12 of 2016',
          'Electronic Transactions Act, No. 19 of 2006',
          'Computer Crimes Act, No. 24 of 2007'
        ],
        policy: 'Please review our Privacy Policy for detailed information about data practices.'
      },

      disclaimer: {
        title: 'Disclaimers and Limitations',
        sections: [
          {
            name: 'Service Availability',
            text: 'Services are provided "as is" without warranties. We do not guarantee uninterrupted or error-free operation.'
          },
          {
            name: 'Information Accuracy',
            text: 'While we strive for accuracy, we do not warrant that all information is current, complete, or error-free.'
          },
          {
            name: 'Third-Party Links',
            text: 'We are not responsible for content or practices of third-party websites linked from our Services.'
          },
          {
            name: 'Limitation of Liability',
            text: 'To the extent permitted by law, NARA shall not be liable for indirect, incidental, or consequential damages arising from use of our Services.'
          }
        ]
      },

      termination: {
        title: 'Termination',
        text: 'We reserve the right to:',
        rights: [
          'Suspend or terminate your access for violation of these Terms',
          'Modify or discontinue Services with or without notice',
          'Refuse service to anyone for any lawful reason',
          'Remove content that violates these Terms or applicable laws'
        ]
      },

      governing: {
        title: 'Governing Law and Jurisdiction',
        text: 'These Terms are governed by the laws of the Democratic Socialist Republic of Sri Lanka. Any disputes arising from these Terms or use of our Services shall be subject to the exclusive jurisdiction of the courts of Sri Lanka.'
      },

      changes: {
        title: 'Changes to Terms',
        text: 'We may update these Terms from time to time. Material changes will be notified through our website or by email. Your continued use after changes constitutes acceptance of the updated Terms.'
      },

      contact: {
        title: 'Contact Information',
        text: 'For questions about these Terms of Use:',
        org: 'National Aquatic Resources Research & Development Agency',
        address: 'Crow Island, Colombo 15, Sri Lanka',
        email: 'legal@nara.ac.lk',
        phone: '+94 11 2 521000'
      }
    },
    si: {
      title: 'භාවිත කොන්දේසි',
      subtitle: 'ඩිජිටල් සේවා - ජාතික ජලජ සම්පත් පර්යේෂණ හා සංවර්ධන ඒජන්සිය',
      // ... (abbreviated for space)
    },
    ta: {
      title: 'பயன்பாட்டு விதிமுறைகள்',
      subtitle: 'டிஜிட்டல் சேவைகள் - தேசிய நீர்வள ஆராய்ச்சி மற்றும் மேம்பாட்டு முகமை',
      // ... (abbreviated for space)
    }
  };

  const t = content[language] || content.en;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-blue-950/40 to-cyan-950/40 border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{t.title}</h1>
              <p className="text-cyan-300 text-lg">{t.subtitle}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-slate-300">
            <span>{t.effectiveDate}</span>
            <span>{t.lastUpdated}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 md:p-12 space-y-12">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <FileText className="w-6 h-6 text-cyan-400" />
              {t.intro.title}
            </h2>
            <p className="text-slate-300 leading-relaxed">{t.intro.text}</p>
          </section>

          {/* Acceptance */}
          <section className="bg-cyan-950/20 border border-cyan-500/20 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-cyan-400" />
              {t.acceptance.title}
            </h2>
            <ul className="space-y-2 text-slate-300">
              {t.acceptance.points.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-cyan-400 mt-1">•</span>
                  {point}
                </li>
              ))}
            </ul>
          </section>

          {/* Services */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">{t.services.title}</h2>
            <p className="text-slate-300 mb-4">{t.services.text}</p>
            <ul className="grid md:grid-cols-2 gap-3">
              {t.services.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-300 bg-slate-800/30 rounded-lg p-3">
                  <span className="text-cyan-400">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* User Responsibilities */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Users className="w-6 h-6 text-cyan-400" />
              {t.user.title}
            </h2>
            <div className="grid gap-4">
              {t.user.sections.map((section, idx) => (
                <div key={idx} className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
                  <h3 className="font-semibold text-cyan-300 mb-2">{section.name}</h3>
                  <p className="text-slate-300 text-sm">{section.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">{t.intellectual.title}</h2>
            <p className="text-slate-300 mb-4">{t.intellectual.text}</p>
            <ul className="space-y-2 mb-4">
              {t.intellectual.rights.map((right, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-300">
                  <span className="text-cyan-400">•</span>
                  {right}
                </li>
              ))}
            </ul>
            <p className="text-sm text-slate-400 italic bg-slate-800/30 rounded-lg p-4">
              {t.intellectual.usage}
            </p>
          </section>

          {/* Government Authority */}
          <section className="bg-gradient-to-br from-amber-950/20 to-orange-950/20 border border-amber-500/20 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Shield className="w-6 h-6 text-amber-400" />
              {t.government.title}
            </h2>
            <p className="text-slate-300 mb-4">{t.government.text}</p>
            <ul className="space-y-2">
              {t.government.points.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-300">
                  <span className="text-amber-400">•</span>
                  {point}
                </li>
              ))}
            </ul>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Scale className="w-6 h-6 text-cyan-400" />
              {t.governing.title}
            </h2>
            <p className="text-slate-300">{t.governing.text}</p>
          </section>

          {/* Contact */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">{t.contact.title}</h2>
            <p className="text-slate-300 mb-4">{t.contact.text}</p>
            <div className="space-y-2 text-slate-300">
              <p className="font-semibold text-cyan-300">{t.contact.org}</p>
              <p>{t.contact.address}</p>
              <p>Email: <a href={`mailto:${t.contact.email}`} className="text-cyan-400 hover:text-cyan-300">{t.contact.email}</a></p>
              <p>Phone: {t.contact.phone}</p>
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 pt-6 border-t border-slate-800">
            <Link
              to="/"
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
            >
              Back to Home
            </Link>
            <Link
              to="/privacy-policy"
              className="px-6 py-3 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;
