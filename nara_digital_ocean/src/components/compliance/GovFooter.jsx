import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Phone, Mail, MapPin, ExternalLink, Lock, FileText, Eye, Globe } from 'lucide-react';

const GovFooter = () => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const lang = localStorage.getItem('nara-lang') || 'en';
    setLanguage(lang);
    const handleLanguageChange = (e) => setLanguage(e.detail);
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const content = {
    en: {
      govBadge: 'This is an Official Sri Lanka Government Website',
      ministry: 'Ministry of Fisheries',
      contact: 'Contact Information',
      address: 'Maligawatta New Town, Colombo 10, Sri Lanka',
      phone: '+94 11 2 446183',
      email: 'info@fisheries.gov.lk',
      hours: 'Monday - Friday: 8:30 AM - 4:15 PM',
      legal: 'Legal & Compliance',
      privacy: 'Privacy Policy',
      terms: 'Terms of Use',
      cookies: 'Cookie Policy',
      accessibility: 'Accessibility',
      dataRights: 'Data Subject Rights',
      rti: 'RTI Disclosure',
      security: 'Security Policy',
      govt: 'Government Portals',
      naraMain: 'NARA Main Website',
      govPortal: 'Sri Lanka Government Portal',
      icta: 'ICTA Sri Lanka',
      certcc: 'Sri Lanka CERT|CC',
      compliance: 'Compliance & Standards',
      pdpa: 'PDPA Compliant',
      wcag: 'WCAG 2.1 AA',
      iso: 'ISO 27001 Aligned',
      govcert: 'GovCERT SL Aligned',
      copyright: '© 2025 National Aquatic Resources Research & Development Agency',
      rights: 'All rights reserved',
      poweredBy: 'Crafted by',
      safenet: 'SafeNet Creations'
    },
    si: {
      govBadge: 'මෙය නිල ශ්‍රී ලංකා රජයේ වෙබ් අඩවියකි',
      ministry: 'ධීවර අමාත්‍යාංශය',
      contact: 'සම්බන්ධතා තොරතුරු',
      address: 'මාලිගාවත්ත නව නගරය, කොළඹ 10, ශ්‍රී ලංකාව',
      phone: '+94 11 2 446183',
      email: 'info@fisheries.gov.lk',
      hours: 'සඳුදා - සිකුරාදා: පෙ.ව. 8:30 - ප.ව. 4:15',
      legal: 'නීතිමය සහ අනුකූලතාවය',
      privacy: 'පෞද්ගලිකත්ව ප්‍රතිපත්තිය',
      terms: 'භාවිත කොන්දේසි',
      cookies: 'කුකී ප්‍රතිපත්තිය',
      accessibility: 'ප්‍රවේශ්‍යතාව',
      dataRights: 'දත්ත විෂය අයිතිවාසිකම්',
      rti: 'RTI අනාවරණය',
      security: 'ආරක්ෂණ ප්‍රතිපත්තිය',
      govt: 'රජයේ ද්වාර',
      naraMain: 'NARA ප්‍රධාන වෙබ් අඩවිය',
      govPortal: 'ශ්‍රී ලංකා රජයේ ද්වාරය',
      icta: 'ICTA ශ්‍රී ලංකාව',
      certcc: 'ශ්‍රී ලංකා CERT|CC',
      compliance: 'අනුකූලතාවය සහ ප්‍රමිතීන්',
      pdpa: 'PDPA අනුකූල',
      wcag: 'WCAG 2.1 AA',
      iso: 'ISO 27001 හා එක්ව',
      govcert: 'GovCERT SL හා එක්ව',
      copyright: '© 2025 ජාතික ජලජ සම්පත් පර්යේෂණ හා සංවර්ධන ඒජන්සිය',
      rights: 'සියලු හිමිකම් ඇවිරිණි',
      poweredBy: 'නිර්මාණය කළේ',
      safenet: 'SafeNet Creations'
    },
    ta: {
      govBadge: 'இது இலங்கை அரசாங்கத்தின் அதிகாரப்பூர்வ வலைத்தளம்',
      ministry: 'மீன்பிடி அமைச்சு',
      contact: 'தொடர்பு தகவல்',
      address: 'மாளிகாவத்த புதிய நகரம், கொழும்பு 10, இலங்கை',
      phone: '+94 11 2 446183',
      email: 'info@fisheries.gov.lk',
      hours: 'திங்கள் - வெள்ளி: காலை 8:30 - மாலை 4:15',
      legal: 'சட்ட & இணக்கம்',
      privacy: 'தனியுரிமைக் கொள்கை',
      terms: 'பயன்பாட்டு விதிமுறைகள்',
      cookies: 'குக்கீ கொள்கை',
      accessibility: 'அணுகல்தன்மை',
      dataRights: 'தரவு பாதுகாப்பு உரிமைகள்',
      rti: 'RTI வெளிப்படுத்தல்',
      security: 'பாதுகாப்புக் கொள்கை',
      govt: 'அரசாங்க நுழைவாயில்கள்',
      naraMain: 'NARA பிரதான வலைத்தளம்',
      govPortal: 'இலங்கை அரசாங்க நுழைவாயில்',
      icta: 'ICTA இலங்கை',
      certcc: 'இலங்கை CERT|CC',
      compliance: 'இணக்கம் & தரநிலைகள்',
      pdpa: 'PDPA இணக்கம்',
      wcag: 'WCAG 2.1 AA',
      iso: 'ISO 27001 சீரமைவு',
      govcert: 'GovCERT SL சீரமைவு',
      copyright: '© 2025 தேசிய நீர்வள ஆராய்ச்சி மற்றும் மேம்பாட்டு முகமை',
      rights: 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை',
      poweredBy: 'உருவாக்கியவர்',
      safenet: 'SafeNet Creations'
    }
  };

  const t = content[language] || content.en;

  return (
    <footer className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-t border-slate-800">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              {t.contact}
            </h3>
            <div className="space-y-3 text-sm text-slate-300">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-slate-400 flex-shrink-0" />
                <span>{t.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" />
                <a href={`tel:${t.phone}`} className="hover:text-cyan-400 transition-colors">{t.phone}</a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <a href={`mailto:${t.email}`} className="hover:text-cyan-400 transition-colors">{t.email}</a>
              </p>
              <p className="text-xs text-slate-400">{t.hours}</p>
            </div>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              {t.legal}
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy-policy" className="text-slate-300 hover:text-cyan-400 transition-colors">{t.privacy}</Link></li>
              <li><Link to="/terms-of-use" className="text-slate-300 hover:text-cyan-400 transition-colors">{t.terms}</Link></li>
              <li><Link to="/cookie-policy" className="text-slate-300 hover:text-cyan-400 transition-colors">{t.cookies}</Link></li>
              <li><Link to="/accessibility-statement" className="text-slate-300 hover:text-cyan-400 transition-colors">{t.accessibility}</Link></li>
              <li><Link to="/data-subject-rights" className="text-slate-300 hover:text-cyan-400 transition-colors">{t.dataRights}</Link></li>
              <li><Link to="/rti-disclosure" className="text-slate-300 hover:text-cyan-400 transition-colors">{t.rti}</Link></li>
              <li><Link to="/security-policy" className="text-slate-300 hover:text-cyan-400 transition-colors">{t.security}</Link></li>
            </ul>
          </div>

          {/* Government Portals */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              {t.govt}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="http://www.nara.ac.lk" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-1">
                  {t.naraMain} <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://www.gov.lk" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-1">
                  {t.govPortal} <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://www.icta.lk" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-1">
                  {t.icta} <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://www.cert.gov.lk" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-1">
                  {t.certcc} <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Compliance Badges */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              {t.compliance}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
                <Lock className="w-4 h-4" />
                <span className="font-medium">{t.pdpa}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-2">
                <Eye className="w-4 h-4" />
                <span className="font-medium">{t.wcag}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-purple-400 bg-purple-500/10 border border-purple-500/20 rounded-lg px-3 py-2">
                <Shield className="w-4 h-4" />
                <span className="font-medium">{t.iso}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
                <Shield className="w-4 h-4" />
                <span className="font-medium">{t.govcert}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Section - Government Badge & Legal */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
          {/* Government Badge with Official Emblem & Flag */}
          <div className="flex items-center justify-center gap-4 pb-4 border-b border-slate-700">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/nara-web-73384.firebasestorage.app/o/sri%20lankan%20goverment%2Fsrilankan%20embelm.png?alt=media&token=f8e4b9e8-1e4d-4350-bbee-76d04b7d0928"
              alt="Sri Lanka Government Emblem"
              className="h-16 w-16 object-contain drop-shadow-lg"
              loading="eager"
            />
            <span className="text-slate-200 font-semibold text-sm uppercase tracking-wider">
              {t.govBadge}
            </span>
            <img
              src="/assets/images/sri-lanka-flag.png"
              alt="Sri Lanka Flag"
              className="h-10 w-16 object-cover rounded shadow-lg"
              loading="eager"
            />
          </div>

          {/* Quick Legal Links */}
          <div className="flex flex-wrap justify-center items-center gap-2 text-xs text-slate-400">
            <Link to="/privacy-policy" className="hover:text-cyan-400 transition-colors">Privacy & Data Ethics</Link>
            <span className="text-slate-600">•</span>
            <Link to="/terms-of-use" className="hover:text-cyan-400 transition-colors">Terms of Collaboration</Link>
            <span className="text-slate-600">•</span>
            <Link to="/rti-disclosure" className="hover:text-cyan-400 transition-colors">Transparency Portal</Link>
            <span className="text-slate-600">•</span>
            <span className="text-green-400">{t.iso}</span>
            <span className="text-slate-600">|</span>
            <span className="text-amber-400">{t.govcert}</span>
          </div>

          {/* Copyright & Powered By */}
          <div className="text-center text-xs text-slate-500">
            <span>{t.copyright}. </span>
            <span>{t.poweredBy}{' '}
              <a 
                href="https://www.safenetcreations.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                www.safenetcreations.com
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default GovFooter;
