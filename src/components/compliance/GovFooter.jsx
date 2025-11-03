import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Building2
} from 'lucide-react';
import WaterBubbles from '../ui/WaterBubbles';

const navigationColumns = [
  {
    key: 'missionPillars',
    links: [
      { key: 'dashboard', to: '/', type: 'link' },
      { key: 'research', to: '/research-excellence-portal', type: 'link' },
      { key: 'knowledge', to: '/knowledge-discovery-center', type: 'link' },
      { key: 'partnership', to: '/partnership-innovation-gateway', type: 'link' }
    ]
  },
  {
    key: 'commandCenters',
    links: [
      { key: 'maritime', to: '/maritime-services-hub', type: 'link' },
      { key: 'emergency', to: '/emergency-response-network', type: 'link' },
      { key: 'integration', to: '/integration-systems-platform', type: 'link' },
      { key: 'learning', to: '/learning-development-academy', type: 'link' }
    ]
  },
  {
    key: 'policy',
    links: [
      { key: 'bulletins', to: '/nara-news-updates-center', type: 'link' },
      { key: 'transactions', to: '/payment-gateway-hub', type: 'link' },
      { key: 'charter', href: '#', type: 'anchor' },
      { key: 'accessibility', href: '#', type: 'anchor' }
    ]
  }
];

const socialLinks = [
  { key: 'facebook', href: 'https://facebook.com/nara.lk', icon: Facebook },
  { key: 'twitter', href: 'https://twitter.com/nara_srilanka', icon: Twitter },
  { key: 'linkedin', href: 'https://linkedin.com/company/nara-sri-lanka', icon: Linkedin },
  { key: 'youtube', href: 'https://youtube.com/@narasrilanka', icon: Youtube }
];

const foamParticles = [
  { style: { top: '20%', left: '10%' }, className: 'w-1 h-1 bg-white/20' },
  { style: { top: '40%', left: '25%' }, className: 'w-1.5 h-1.5 bg-cyan-300/10' },
  { style: { top: '60%', left: '45%' }, className: 'w-1 h-1 bg-white/15' },
  { style: { top: '30%', right: '30%' }, className: 'w-2 h-2 bg-cyan-200/10' },
  { style: { top: '70%', right: '15%' }, className: 'w-1 h-1 bg-white/20' }
];

const legalLinks = [
  { key: 'privacy', label: 'Privacy Policy', to: '/privacy-policy' },
  { key: 'terms', label: 'Terms of Use', to: '/terms-of-use' },
  { key: 'transparency', label: 'Transparency', to: '/rti-disclosure' }
];

const shimmerBackground = [
  'radial-gradient(circle at 15% 30%, rgba(6, 182, 212, 0.08) 0%, transparent 40%)',
  'radial-gradient(circle at 85% 70%, rgba(255, 255, 255, 0.05) 0%, transparent 35%)',
  'radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.06) 0%, transparent 45%)'
].join(',');

const GovFooter = () => {
  const { t } = useTranslation(['home', 'common']);
  const navigationContent = t('navigation', { ns: 'home', returnObjects: true }) || {};
  const contactContent = t('contact', { ns: 'home', returnObjects: true }) || {};
  const footerContent = t('footer', { ns: 'home', returnObjects: true }) || {};
  const socialAlt = contactContent.socialAlt || {};
  const socialLabels = contactContent.social || {};

  return (
    <footer className="relative mt-16 overflow-hidden">
      {/* Ocean-themed gradient background matching navbar */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-blue-900/40 to-slate-950"
        style={{
          background: 'linear-gradient(180deg, rgba(50, 130, 210, 0.15) 0%, rgba(30, 58, 95, 0.95) 40%, rgba(15, 23, 42, 0.98) 100%)'
        }}
      />

      {/* Spinning NARA Logo Background - Horizontal Spin */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden" style={{ opacity: 0.1 }}>
        <img
          src="/assets/nara-logo.png"
          alt="NARA Logo"
          style={{
            width: '500px',
            height: '500px',
            objectFit: 'contain',
            animation: 'spinHorizontal 8s linear infinite',
            transformStyle: 'preserve-3d'
          }}
        />
      </div>

      {/* Ocean effects layer */}
      <div className="absolute inset-0 pointer-events-none overflow-visible" style={{ zIndex: 100 }}>
        {/* Water bubbles animation */}
        <WaterBubbles count={15} />

        {/* Wave overlay effect */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, rgba(100, 180, 240, 0.08) 50%, transparent 100%)',
            animation: 'wave 10s ease-in-out infinite',
            opacity: 0.4
          }}
        />
      </div>

      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: shimmerBackground }} />

      {/* Enhanced wave SVG with ocean colors */}
      <svg className="absolute bottom-0 w-full h-[100px] opacity-50" viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path d="M0,60 C240,90 480,30 720,60 C960,90 1200,40 1440,70 L1440,120 L0,120 Z" fill="rgba(70, 150, 220, 0.3)" />
        <path d="M0,75 C180,95 360,60 540,80 C720,100 900,65 1080,85 C1260,70 1350,75 1440,80 L1440,120 L0,120 Z" fill="rgba(100, 180, 240, 0.2)" />
        <path d="M0,85 C120,105 360,75 540,90 C720,105 900,80 1080,95 C1260,85 1350,90 1440,92 L1440,120 L0,120 Z" fill="rgba(50, 130, 210, 0.15)" />
      </svg>

      <div className="absolute inset-0 overflow-hidden">
        {foamParticles.map((particle, index) => (
          <div
            key={index}
            className={`absolute rounded-full ${particle.className}`}
            style={particle.style}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-slate-100">
        <div className="grid gap-6 lg:grid-cols-4">
          {navigationColumns.map(({ key, links }) => {
            const columnCopy = navigationContent[key] || {};
            return (
              <div key={key} className="space-y-1">
                <h4 className="text-sm font-semibold uppercase text-cyan-200 mb-2 pl-3">
                  {columnCopy.heading || ''}
                </h4>
                <ul className="text-sm text-slate-300 leading-tight space-y-1 list-none">
                  {links.map((link) => {
                    const label = columnCopy.links?.[link.key];
                    if (!label) {
                      return null;
                    }
                    if (link.type === 'anchor') {
                      return (
                        <li key={link.key}>
                          <a href={link.href || '#'} className="block hover:text-cyan-300 transition">
                            {label}
                          </a>
                        </li>
                      );
                    }
                    return (
                      <li key={link.key}>
                        <Link to={link.to || '#'} className="block hover:text-cyan-300 transition">
                          {label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
          <div className="space-y-1">
            <h4 className="text-sm font-semibold uppercase text-cyan-200 mb-2">
              {contactContent.heading || 'Contact & Duty Desk'}
            </h4>
            <div className="text-sm text-slate-300 leading-tight space-y-1.5">
              <p className="flex items-start gap-3">
                <MapPin className="mt-0.5 w-4 h-4 text-cyan-300" />
                <span>{contactContent.address || 'Crow Island, Colombo 15, Sri Lanka'}</span>
              </p>
              <p className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-cyan-300" />
                <a href={`tel:${contactContent.phoneValue || '+94 11 234 5678'}`} className="hover:text-cyan-300 transition">
                  {contactContent.phoneValue || '+94 11 234 5678'}
                </a>
              </p>
              <p className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-cyan-300" />
                <a href={`mailto:${contactContent.emailValue || 'info@nara.gov.lk'}`} className="hover:text-cyan-300 transition">
                  {contactContent.emailValue || 'info@nara.gov.lk'}
                </a>
              </p>
              <p className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-cyan-300" />
                <span>{contactContent.hours || 'Mission operations: 08:30 - 18:00 IST'}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 mt-6 border-t border-slate-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-400">
                {contactContent.follow || 'Follow Us'}:
              </span>
              {socialLinks.map(({ key, href, icon: Icon }) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-800 hover:bg-cyan-500/20 transition-all"
                  aria-label={socialAlt[key] || `Visit NARA on ${socialLabels[key] || key}`}
                >
                  <Icon className="w-5 h-5 text-slate-400 hover:text-cyan-400 transition-colors" />
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Building2 className="w-4 h-4" />
              <span>{footerContent.ministry || 'Under the Ministry of Fisheries, Sri Lanka'}</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800">
          <div className="flex flex-row items-center justify-center gap-3 mb-2">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/nara-web-73384.firebasestorage.app/o/sri%20lankan%20goverment%2Fsrilankan%20embelm.png?alt=media&token=f8e4b9e8-1e4d-4350-bbee-76d04b7d0928"
              alt="Sri Lanka Government Emblem"
              className="h-16 w-16 object-contain drop-shadow-lg flex-shrink-0"
              loading="eager"
            />
            <span className="text-slate-200 font-semibold text-sm uppercase tracking-wider whitespace-nowrap">
              {footerContent.badge || 'This is an Official Sri Lanka Government Website'}
            </span>
            <img
              src="/assets/images/sri-lanka-flag.png"
              alt="Sri Lanka Flag"
              className="h-10 w-16 object-cover rounded shadow-lg flex-shrink-0"
              loading="eager"
            />
          </div>

          <div className="flex flex-wrap justify-center items-center text-xs text-slate-400 gap-1 mb-1">
            {legalLinks.map(({ key, to }, index) => (
              <React.Fragment key={key}>
                {index > 0 && <span className="text-slate-600">•</span>}
                <Link to={to} className="hover:text-cyan-400 transition-colors">
                  {footerContent.legal?.[key] || key}
                </Link>
              </React.Fragment>
            ))}
            <span className="text-slate-600">•</span>
            <span className="text-green-400">{footerContent.legal?.compliance || 'ISO 27001 | GovCERT SL'}</span>
          </div>

          <div className="text-center text-xs text-slate-500">
            <span>{footerContent.copyright || '© 2025 National Aquatic Resources Research & Development Agency.'} </span>
            <span>
              {footerContent.craftedBy || 'Crafted by'}{' '}
              <a
                href={footerContent.craftedLink || 'https://www.safenetcreations.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                {footerContent.craftedLinkLabel || 'www.safenetcreations.com'}
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default GovFooter;
