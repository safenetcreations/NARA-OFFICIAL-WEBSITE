import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, Settings, Eye, Shield, Trash2, Info } from 'lucide-react';

const CookiePolicy = () => {
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
      title: 'Cookie Policy',
      subtitle: 'How We Use Cookies and Similar Technologies',
      effectiveDate: 'Effective Date: January 1, 2025',
      
      intro: {
        title: 'What Are Cookies?',
        text: 'Cookies are small text files stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our services. This Cookie Policy explains what cookies we use, why we use them, and how you can control them.'
      },

      types: {
        title: 'Types of Cookies We Use',
        categories: [
          {
            name: 'Essential Cookies',
            icon: Shield,
            color: 'green',
            required: true,
            description: 'These cookies are strictly necessary for the website to function and cannot be disabled.',
            examples: [
              'Authentication tokens for logged-in users',
              'Security cookies to protect against fraud',
              'Session management cookies',
              'Language preference cookies',
              'Cookie consent preferences'
            ],
            retention: 'Session or up to 1 year'
          },
          {
            name: 'Analytics Cookies',
            icon: Eye,
            color: 'blue',
            required: false,
            description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.',
            examples: [
              'Google Analytics tracking',
              'Page view statistics',
              'User journey mapping',
              'Performance metrics',
              'Error logging and diagnostics'
            ],
            retention: 'Up to 2 years'
          },
          {
            name: 'Functional Cookies',
            icon: Settings,
            color: 'purple',
            required: false,
            description: 'These cookies enable enhanced functionality and personalization, such as videos and live chat.',
            examples: [
              'Video player preferences',
              'Font size and accessibility settings',
              'Regional or language preferences',
              'UI customization preferences',
              'Form auto-fill data'
            ],
            retention: 'Up to 1 year'
          }
        ]
      },

      specific: {
        title: 'Specific Cookies We Use',
        cookies: [
          {
            name: 'nara-cookie-consent',
            type: 'Essential',
            purpose: 'Stores your cookie consent preferences',
            duration: 'Permanent',
            provider: 'NARA (First-party)'
          },
          {
            name: 'nara-lang',
            type: 'Essential',
            purpose: 'Remembers your language preference (EN/SI/TA)',
            duration: 'Permanent',
            provider: 'NARA (First-party)'
          },
          {
            name: 'nara-session',
            type: 'Essential',
            purpose: 'Maintains your login session',
            duration: 'Session',
            provider: 'NARA (First-party)'
          },
          {
            name: '_ga, _gid, _gat',
            type: 'Analytics',
            purpose: 'Google Analytics - tracks user behavior',
            duration: '2 years / 24 hours / 1 minute',
            provider: 'Google (Third-party)'
          },
          {
            name: 'theme-preference',
            type: 'Functional',
            purpose: 'Stores your theme/display preferences',
            duration: '1 year',
            provider: 'NARA (First-party)'
          }
        ]
      },

      thirdParty: {
        title: 'Third-Party Cookies',
        text: 'We use carefully selected third-party services that may set cookies:',
        services: [
          {
            name: 'Google Analytics',
            purpose: 'Website analytics and performance monitoring',
            privacy: 'https://policies.google.com/privacy',
            optout: 'https://tools.google.com/dlpage/gaoptout'
          },
          {
            name: 'Firebase',
            purpose: 'Authentication, hosting, and database services',
            privacy: 'https://firebase.google.com/support/privacy',
            optout: 'Managed through cookie preferences'
          }
        ]
      },

      control: {
        title: 'How to Control Cookies',
        methods: [
          {
            name: 'Cookie Consent Banner',
            icon: Cookie,
            description: 'When you first visit our website, you can choose which types of cookies to accept or reject.',
            action: 'Click "Customize" in the cookie banner to manage your preferences.'
          },
          {
            name: 'Browser Settings',
            icon: Settings,
            description: 'Most browsers allow you to control cookies through their settings.',
            action: 'Check your browser help section for instructions on blocking or deleting cookies.'
          },
          {
            name: 'Privacy Settings',
            icon: Shield,
            description: 'Visit your account privacy settings to manage data preferences.',
            action: 'Access settings through your user profile or contact us for assistance.'
          }
        ],
        warning: 'Note: Blocking essential cookies may prevent certain features from working correctly.'
      },

      browserGuide: {
        title: 'Browser-Specific Cookie Management',
        browsers: [
          { name: 'Google Chrome', url: 'https://support.google.com/chrome/answer/95647' },
          { name: 'Mozilla Firefox', url: 'https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer' },
          { name: 'Safari', url: 'https://support.apple.com/en-us/HT201265' },
          { name: 'Microsoft Edge', url: 'https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09' },
          { name: 'Opera', url: 'https://help.opera.com/en/latest/web-preferences/#cookies' }
        ]
      },

      legal: {
        title: 'Legal Compliance',
        text: 'Our cookie practices comply with:',
        laws: [
          'Personal Data Protection Act, No. 9 of 2022 (PDPA)',
          'Electronic Transactions Act, No. 19 of 2006',
          'Sri Lanka CERT|CC Security Guidelines',
          'ICTA Web Governance Standards'
        ]
      },

      updates: {
        title: 'Updates to This Policy',
        text: 'We may update this Cookie Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting a notice on our website or by email.'
      },

      contact: {
        title: 'Questions About Cookies?',
        text: 'If you have questions about our use of cookies:',
        email: 'privacy@nara.ac.lk',
        dpo: 'Data Protection Officer: dpo@nara.ac.lk',
        phone: '+94 11 2 521000'
      }
    }
  };

  const t = content[language] || content.en;

  const getColorClasses = (color) => {
    const colors = {
      green: 'from-green-500 to-emerald-600 border-green-500/30 bg-green-950/20',
      blue: 'from-blue-500 to-cyan-600 border-blue-500/30 bg-blue-950/20',
      purple: 'from-purple-500 to-pink-600 border-purple-500/30 bg-purple-950/20'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-blue-950/40 to-cyan-950/40 border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <Cookie className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{t.title}</h1>
              <p className="text-cyan-300 text-lg">{t.subtitle}</p>
            </div>
          </div>
          <p className="text-sm text-slate-300">{t.effectiveDate}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 md:p-12 space-y-12">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Info className="w-6 h-6 text-cyan-400" />
              {t.intro.title}
            </h2>
            <p className="text-slate-300 leading-relaxed">{t.intro.text}</p>
          </section>

          {/* Types of Cookies */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-8">{t.types.title}</h2>
            <div className="grid gap-6">
              {t.types.categories.map((category, idx) => {
                const IconComponent = category.icon;
                return (
                  <div
                    key={idx}
                    className={`border-2 rounded-xl p-6 ${getColorClasses(category.color)}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 bg-gradient-to-br ${category.color === 'green' ? 'from-green-500 to-emerald-600' : category.color === 'blue' ? 'from-blue-500 to-cyan-600' : 'from-purple-500 to-pink-600'} rounded-xl flex items-center justify-center`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{category.name}</h3>
                          {category.required && (
                            <span className="text-xs px-2 py-1 bg-amber-500 text-white rounded-full font-semibold">
                              Required
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-200 mb-4">{category.description}</p>
                    <div className="bg-slate-900/30 rounded-lg p-4 mb-3">
                      <p className="text-sm font-semibold text-slate-300 mb-2">Examples:</p>
                      <ul className="space-y-1">
                        {category.examples.map((example, i) => (
                          <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                            <span className={`${category.color === 'green' ? 'text-green-400' : category.color === 'blue' ? 'text-blue-400' : 'text-purple-400'} mt-1`}>•</span>
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p className="text-xs text-slate-400">
                      Retention: {category.retention}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Specific Cookies Table */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">{t.specific.title}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800 border-b-2 border-cyan-500/30">
                    <th className="p-4 text-cyan-300 font-semibold">Cookie Name</th>
                    <th className="p-4 text-cyan-300 font-semibold">Type</th>
                    <th className="p-4 text-cyan-300 font-semibold">Purpose</th>
                    <th className="p-4 text-cyan-300 font-semibold">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {t.specific.cookies.map((cookie, idx) => (
                    <tr key={idx} className="border-b border-slate-800 hover:bg-slate-800/30">
                      <td className="p-4 font-mono text-sm text-white">{cookie.name}</td>
                      <td className="p-4 text-slate-300">
                        <span className={`px-2 py-1 rounded text-xs ${
                          cookie.type === 'Essential' ? 'bg-green-500/20 text-green-400' :
                          cookie.type === 'Analytics' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-purple-500/20 text-purple-400'
                        }`}>
                          {cookie.type}
                        </span>
                      </td>
                      <td className="p-4 text-slate-300 text-sm">{cookie.purpose}</td>
                      <td className="p-4 text-slate-400 text-sm">{cookie.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* How to Control */}
          <section className="bg-gradient-to-br from-cyan-950/30 to-blue-950/30 border-2 border-cyan-500/30 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">{t.control.title}</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              {t.control.methods.map((method, idx) => {
                const IconComponent = method.icon;
                return (
                  <div key={idx} className="bg-slate-900/50 rounded-lg p-4">
                    <IconComponent className="w-8 h-8 text-cyan-400 mb-3" />
                    <h3 className="font-semibold text-white mb-2">{method.name}</h3>
                    <p className="text-sm text-slate-300 mb-3">{method.description}</p>
                    <p className="text-xs text-cyan-400">{method.action}</p>
                  </div>
                );
              })}
            </div>
            <div className="bg-amber-950/30 border border-amber-500/30 rounded-lg p-4">
              <p className="text-sm text-amber-300 flex items-start gap-2">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                {t.control.warning}
              </p>
            </div>
          </section>

          {/* Browser Guide */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">{t.browserGuide.title}</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {t.browserGuide.browsers.map((browser, idx) => (
                <a
                  key={idx}
                  href={browser.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700 rounded-lg p-4 transition-colors group"
                >
                  <span className="text-slate-300 group-hover:text-cyan-400">{browser.name}</span>
                  <Settings className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
                </a>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">{t.contact.title}</h2>
            <p className="text-slate-300 mb-4">{t.contact.text}</p>
            <div className="space-y-2 text-slate-300">
              <p>Email: <a href={`mailto:${t.contact.email}`} className="text-cyan-400 hover:text-cyan-300">{t.contact.email}</a></p>
              <p>{t.contact.dpo}</p>
              <p>Phone: {t.contact.phone}</p>
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 pt-6 border-t border-slate-800">
            <Link
              to="/"
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              Back to Home
            </Link>
            <Link
              to="/privacy-policy"
              className="px-6 py-3 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors"
            >
              Privacy Policy
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem('nara-cookie-consent');
                window.location.reload();
              }}
              className="px-6 py-3 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Reset Cookie Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
