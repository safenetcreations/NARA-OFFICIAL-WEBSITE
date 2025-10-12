import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, AlertTriangle, Eye, Server, Key, FileWarning, Mail } from 'lucide-react';

const SecurityPolicy = () => {
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
      title: 'Security Policy',
      subtitle: 'Information Security & Cyber Security Practices',
      effectiveDate: 'Last Updated: January 1, 2025',
      
      intro: {
        title: 'Our Security Commitment',
        text: 'NARA is committed to protecting the confidentiality, integrity, and availability of all information assets. This Security Policy outlines our technical and organizational measures to safeguard your data and our digital services in accordance with Sri Lankan cybersecurity standards and international best practices.'
      },

      framework: {
        title: 'Security Framework',
        text: 'Our security program is aligned with:',
        standards: [
          {
            name: 'ISO/IEC 27001',
            description: 'Information Security Management System',
            status: 'Aligned'
          },
          {
            name: 'Sri Lanka CERT|CC Guidelines',
            description: 'National Cybersecurity Standards',
            status: 'Compliant'
          },
          {
            name: 'PDPA Security Requirements',
            description: 'Personal Data Protection Act mandates',
            status: 'Compliant'
          },
          {
            name: 'ICTA Security Standards',
            description: 'Government IT Security Guidelines',
            status: 'Compliant'
          }
        ]
      },

      technical: {
        title: 'Technical Security Measures',
        categories: [
          {
            icon: Lock,
            name: 'Data Encryption',
            measures: [
              'TLS 1.2+ encryption for data in transit',
              'AES-256 encryption for sensitive data at rest',
              'End-to-end encryption for critical communications',
              'Encrypted backups with secure key management',
              'Database encryption for personal information'
            ]
          },
          {
            icon: Shield,
            name: 'Access Control',
            measures: [
              'Multi-factor authentication (MFA) for all accounts',
              'Role-based access control (RBAC)',
              'Principle of least privilege enforcement',
              'Regular access reviews and audits',
              'Strong password policies (min 12 characters)',
              'Automatic session timeout after inactivity'
            ]
          },
          {
            icon: Server,
            name: 'Infrastructure Security',
            measures: [
              'Firewall protection and intrusion detection',
              'Regular security patching and updates',
              'Network segmentation and isolation',
              'DDoS protection and rate limiting',
              'Secure cloud infrastructure (Firebase/GCP)',
              'Redundant systems and failover mechanisms'
            ]
          },
          {
            icon: Eye,
            name: 'Monitoring & Detection',
            measures: [
              '24/7 security monitoring and logging',
              'Real-time threat detection systems',
              'Automated vulnerability scanning',
              'Security Information and Event Management (SIEM)',
              'Regular penetration testing',
              'Incident detection and response procedures'
            ]
          }
        ]
      },

      organizational: {
        title: 'Organizational Security Measures',
        sections: [
          {
            name: 'Security Governance',
            items: [
              'Designated Information Security Officer',
              'Security policies and procedures',
              'Regular security risk assessments',
              'Third-party security audits',
              'Compliance monitoring program'
            ]
          },
          {
            name: 'Personnel Security',
            items: [
              'Background verification for staff',
              'Mandatory security awareness training',
              'Confidentiality and NDA agreements',
              'Clear roles and responsibilities',
              'Insider threat prevention measures'
            ]
          },
          {
            name: 'Physical Security',
            items: [
              'Secure data center facilities',
              'Access control to server rooms',
              'CCTV surveillance',
              'Environmental controls (fire, flood)',
              'Secure disposal of sensitive media'
            ]
          }
        ]
      },

      incident: {
        title: 'Security Incident Response',
        process: [
          {
            phase: 'Detection',
            description: 'Automated monitoring systems and user reports identify potential security incidents',
            icon: Eye
          },
          {
            phase: 'Assessment',
            description: 'Security team evaluates severity and impact of the incident',
            icon: AlertTriangle
          },
          {
            phase: 'Containment',
            description: 'Immediate action taken to isolate and prevent spread of the incident',
            icon: Shield
          },
          {
            phase: 'Notification',
            description: 'Affected users and authorities notified as required by PDPA and CERT|CC',
            icon: Mail
          }
        ],
        breach: {
          title: 'Data Breach Notification',
          text: 'In case of a data breach affecting personal information:',
          timeline: [
            'We notify the Data Protection Authority within 72 hours',
            'Affected individuals are notified without undue delay',
            'We provide details of the breach and mitigation steps',
            'We report to Sri Lanka CERT|CC as required'
          ]
        }
      },

      vulnerabilities: {
        title: 'Vulnerability Disclosure Program',
        text: 'We welcome responsible disclosure of security vulnerabilities. If you discover a security issue:',
        process: [
          'Email security@nara.ac.lk with details',
          'Provide sufficient information to reproduce the issue',
          'Allow us reasonable time to address the vulnerability',
          'Do not exploit the vulnerability or access user data',
          'Do not publicly disclose the vulnerability until we have addressed it'
        ],
        reward: 'We acknowledge security researchers who report vulnerabilities responsibly.',
        pgp: 'PGP Public Key available for encrypted communication'
      },

      user: {
        title: 'User Security Responsibilities',
        text: 'Help us keep your data secure by following these best practices:',
        practices: [
          {
            name: 'Strong Passwords',
            tip: 'Use unique, complex passwords of at least 12 characters. Enable MFA where available.'
          },
          {
            name: 'Suspicious Activity',
            tip: 'Report any unusual account activity or suspected phishing attempts immediately.'
          },
          {
            name: 'Secure Devices',
            tip: 'Keep your devices updated and use reputable antivirus software.'
          },
          {
            name: 'Public Networks',
            tip: 'Avoid accessing sensitive information on public Wi-Fi networks.'
          },
          {
            name: 'Phishing Awareness',
            tip: 'NARA will never ask for your password via email. Verify sender authenticity.'
          }
        ]
      },

      compliance: {
        title: 'Regulatory Compliance',
        laws: [
          {
            name: 'Personal Data Protection Act (PDPA)',
            year: '2022',
            requirement: 'Appropriate technical and organizational security measures'
          },
          {
            name: 'Computer Crimes Act',
            year: '2007',
            requirement: 'Protection against unauthorized access and cyber crimes'
          },
          {
            name: 'Electronic Transactions Act',
            year: '2006',
            requirement: 'Secure electronic communications and transactions'
          }
        ]
      },

      contact: {
        title: 'Security Contact',
        officers: [
          {
            role: 'Information Security Officer (ISO)',
            name: 'Mr. K.L. Perera',
            email: 'security@nara.ac.lk',
            phone: '+94 11 2 521000 Ext. 250',
            pgp: 'PGP Fingerprint: XXXX XXXX XXXX XXXX'
          },
          {
            role: 'CERT|CC Liaison',
            email: 'cert-liaison@nara.ac.lk',
            note: 'For coordinating with Sri Lanka CERT|CC on security incidents'
          }
        ]
      }
    }
  };

  const t = content[language] || content.en;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero */}
      <div className="bg-gradient-to-r from-red-950/40 via-orange-950/40 to-red-950/40 border-b border-red-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/25">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{t.title}</h1>
              <p className="text-orange-300 text-lg">{t.subtitle}</p>
            </div>
          </div>
          <p className="text-sm text-slate-300">{t.effectiveDate}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 md:p-12 space-y-12">
          
          {/* Introduction */}
          <section className="bg-gradient-to-br from-red-950/30 to-orange-950/30 border-2 border-red-500/30 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Shield className="w-6 h-6 text-red-400" />
              {t.intro.title}
            </h2>
            <p className="text-slate-200 text-lg leading-relaxed">{t.intro.text}</p>
          </section>

          {/* Security Framework */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">{t.framework.title}</h2>
            <p className="text-slate-300 mb-6">{t.framework.text}</p>
            <div className="grid md:grid-cols-2 gap-4">
              {t.framework.standards.map((standard, idx) => (
                <div key={idx} className="bg-slate-800/30 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-white">{standard.name}</h3>
                    <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                      {standard.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400">{standard.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Technical Security */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-8">{t.technical.title}</h2>
            <div className="grid gap-6">
              {t.technical.categories.map((category, idx) => {
                const IconComponent = category.icon;
                return (
                  <div key={idx} className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-red-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white">{category.name}</h3>
                    </div>
                    <ul className="grid md:grid-cols-2 gap-2">
                      {category.measures.map((measure, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                          <span className="text-red-400 mt-1">✓</span>
                          {measure}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Organizational Security */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">{t.organizational.title}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {t.organizational.sections.map((section, idx) => (
                <div key={idx} className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
                  <h3 className="font-semibold text-orange-300 mb-3">{section.name}</h3>
                  <ul className="space-y-2">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="text-orange-400 mt-1">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Incident Response */}
          <section className="bg-red-950/20 border border-red-500/30 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              {t.incident.title}
            </h2>
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              {t.incident.process.map((phase, idx) => {
                const IconComponent = phase.icon;
                return (
                  <div key={idx} className="bg-slate-900/50 rounded-lg p-4 text-center">
                    <IconComponent className="w-8 h-8 text-red-400 mx-auto mb-3" />
                    <h3 className="font-semibold text-white mb-2">{phase.phase}</h3>
                    <p className="text-xs text-slate-300">{phase.description}</p>
                  </div>
                );
              })}
            </div>
            <div className="bg-slate-900/50 rounded-lg p-6">
              <h3 className="font-semibold text-red-300 mb-3">{t.incident.breach.title}</h3>
              <p className="text-slate-300 mb-4">{t.incident.breach.text}</p>
              <ul className="space-y-2">
                {t.incident.breach.timeline.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-red-400 mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Vulnerability Disclosure */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <FileWarning className="w-6 h-6 text-orange-400" />
              {t.vulnerabilities.title}
            </h2>
            <p className="text-slate-300 mb-4">{t.vulnerabilities.text}</p>
            <ol className="space-y-2 mb-4">
              {t.vulnerabilities.process.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-300">
                  <span className="flex-shrink-0 w-6 h-6 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-400 text-sm font-bold">
                    {idx + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
            <div className="bg-green-950/20 border border-green-500/30 rounded-lg p-4 space-y-2">
              <p className="text-sm text-green-400">{t.vulnerabilities.reward}</p>
              <p className="text-xs text-slate-400">{t.vulnerabilities.pgp}</p>
            </div>
          </section>

          {/* User Security */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Key className="w-6 h-6 text-cyan-400" />
              {t.user.title}
            </h2>
            <p className="text-slate-300 mb-6">{t.user.text}</p>
            <div className="grid md:grid-cols-2 gap-4">
              {t.user.practices.map((practice, idx) => (
                <div key={idx} className="bg-cyan-950/20 border border-cyan-500/30 rounded-lg p-4">
                  <h3 className="font-semibold text-cyan-300 mb-2">{practice.name}</h3>
                  <p className="text-sm text-slate-300">{practice.tip}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">{t.contact.title}</h2>
            {t.contact.officers.map((officer, idx) => (
              <div key={idx} className="bg-slate-900/50 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-red-300 mb-3">{officer.role}</h3>
                <div className="space-y-1 text-sm text-slate-300">
                  {officer.name && <p>Name: {officer.name}</p>}
                  <p>Email: <a href={`mailto:${officer.email}`} className="text-cyan-400 hover:text-cyan-300">{officer.email}</a></p>
                  {officer.phone && <p>Phone: {officer.phone}</p>}
                  {officer.pgp && <p className="text-xs text-slate-400">{officer.pgp}</p>}
                  {officer.note && <p className="text-xs text-slate-400 italic">{officer.note}</p>}
                </div>
              </div>
            ))}
          </section>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 pt-6 border-t border-slate-800">
            <Link
              to="/"
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              Back to Home
            </Link>
            <Link
              to="/privacy-policy"
              className="px-6 py-3 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors"
            >
              Privacy Policy
            </Link>
            <a
              href="mailto:security@nara.ac.lk"
              className="px-6 py-3 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Report Security Issue
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityPolicy;
