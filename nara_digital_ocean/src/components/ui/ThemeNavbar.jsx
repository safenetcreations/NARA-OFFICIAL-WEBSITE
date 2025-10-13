import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useThemeStore from '../../store/theme';
import AppImage from '../AppImage';
import { AVAILABLE_LANGUAGES } from '../../i18n';

const ThemeNavbar = () => {
  const navigate = useNavigate();
  const theme = useThemeStore((state) => state?.theme || 'ocean');
  const toggleTheme = useThemeStore((state) => state?.toggleTheme);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const { t, i18n } = useTranslation('common');
  const languageMenuRef = useRef(null);
  const dropdownTimeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const lang = (i18n.language || 'en').split('-')[0];
      document.documentElement.setAttribute('lang', lang);
    }
  }, [i18n.language]);

  useEffect(() => {
    if (!languageMenuOpen) {
      return undefined;
    }

    const handleClickOutside = (event) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setLanguageMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [languageMenuOpen]);

  const menuItems = [
    {
      titleKey: 'navbar.menu.about.title',
      icon: Icons.Info,
      dropdown: [
        { labelKey: 'navbar.menu.about.links.ourStory', path: '/about-nara-our-story', icon: Icons.Heart },
        { labelKey: 'navbar.menu.about.links.mediaGallery', path: '/media-gallery', icon: Icons.Image }
      ]
    },
    {
      titleKey: 'navbar.menu.divisions.title',
      icon: Icons.Layers,
      dropdown: [
        { labelKey: 'navbar.menu.divisions.links.allDivisions', path: '/divisions', icon: Icons.Grid3x3 },
        { labelKey: 'navbar.menu.divisions.links.fisheriesScience', path: '/divisions/marine-inland-fisheries-science', icon: Icons.Fish },
        { labelKey: 'navbar.menu.divisions.links.marineBiology', path: '/divisions/marine-biology-ecosystems', icon: Icons.Waves },
        { labelKey: 'navbar.menu.divisions.links.aquaculture', path: '/divisions/inland-aquatic-aquaculture', icon: Icons.Droplet },
        { labelKey: 'navbar.menu.divisions.links.fishingTechnology', path: '/divisions/fishing-technology', icon: Icons.Anchor },
        { labelKey: 'navbar.menu.divisions.links.qualityAssurance', path: '/divisions/post-harvest-quality', icon: Icons.FlaskConical },
        { labelKey: 'navbar.menu.divisions.links.socioEconomics', path: '/divisions/socio-economics-marketing', icon: Icons.TrendingUp },
        { labelKey: 'navbar.menu.divisions.links.hydrography', path: '/divisions/hydrography-nautical-charts', icon: Icons.Map },
        { labelKey: 'navbar.menu.divisions.links.environmental', path: '/divisions/environmental-monitoring-advisory', icon: Icons.CloudRain },
        { labelKey: 'navbar.menu.divisions.links.information', path: '/divisions/information-outreach', icon: Icons.BookOpen }
      ]
    },
    {
      titleKey: 'navbar.menu.research.title',
      icon: Icons.Microscope,
      dropdown: [
        { labelKey: 'navbar.menu.research.links.researchExcellencePortal', path: '/research-excellence-portal', icon: Icons.Award },
        { labelKey: 'navbar.menu.research.links.researchCollaboration', path: '/research-collaboration-platform', icon: Icons.Users },
        { labelKey: 'navbar.menu.research.links.knowledgeDiscovery', path: '/knowledge-discovery-center', icon: Icons.BookOpen },
        { labelKey: 'navbar.menu.research.links.partnershipInnovation', path: '/partnership-innovation-gateway', icon: Icons.Lightbulb }
      ]
    },
    {
      titleKey: 'navbar.menu.services.title',
      icon: Icons.Briefcase,
      dropdown: [
        { labelKey: 'navbar.menu.services.links.digitalMarketplace', path: '/nara-digital-marketplace', icon: Icons.ShoppingBag },
        { labelKey: 'navbar.menu.services.links.maritimeServices', path: '/maritime-services-hub', icon: Icons.Ship },
        { labelKey: 'navbar.menu.services.links.governmentServices', path: '/government-services-portal', icon: Icons.Building },
        { labelKey: 'navbar.menu.services.links.emergencyResponse', path: '/emergency-response-network', icon: Icons.AlertTriangle }
      ]
    },
    {
      titleKey: 'navbar.menu.resources.title',
      icon: Icons.FolderOpen,
      dropdown: [
        { labelKey: 'navbar.menu.resources.links.digitalProductLibrary', path: '/digital-product-library', icon: Icons.Archive },
        { labelKey: 'navbar.menu.resources.links.learningAcademy', path: '/learning-development-academy', icon: Icons.GraduationCap },
        { labelKey: 'navbar.menu.resources.links.regionalImpact', path: '/regional-impact-network', icon: Icons.Globe },
        { labelKey: 'navbar.menu.resources.links.integrationSystems', path: '/integration-systems-platform', icon: Icons.Network }
      ]
    },
    {
      titleKey: 'navbar.menu.news.title',
      icon: Icons.Newspaper,
      dropdown: [
        { labelKey: 'navbar.menu.about.links.newsUpdates', path: '/nara-news-updates-center', icon: Icons.Newspaper },
        { labelKey: 'navbar.menu.about.links.procurement', path: '/procurement-recruitment-portal', icon: Icons.Briefcase }
      ]
    }
  ];

  const normalizedLanguage = (i18n.language || 'en').split('-')[0];
  const activeLanguage = AVAILABLE_LANGUAGES.find((lang) => lang.code === normalizedLanguage) || AVAILABLE_LANGUAGES[0];

  const handleLanguageChange = (code) => {
    i18n.changeLanguage(code);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('nara-lang', code);
      window.dispatchEvent(new CustomEvent('languageChange', { detail: code }));
    }
    setLanguageMenuOpen(false);
  };

  const cycleLanguage = () => {
    const currentIndex = AVAILABLE_LANGUAGES.findIndex((lang) => lang.code === activeLanguage.code);
    const nextIndex = (currentIndex + 1) % AVAILABLE_LANGUAGES.length;
    handleLanguageChange(AVAILABLE_LANGUAGES[nextIndex].code);
  };

  const handleMouseEnter = (index) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(index);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const handleDropdownMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
  };

  return (
    <nav className={`navbar-theme glass ${scrolled ? 'scrolled' : ''}`} 
         style={{ 
           position: 'fixed', 
           top: 0, 
           left: 0, 
           right: 0, 
           zIndex: 1000,
           margin: '8px',
           width: 'calc(100% - 16px)'
         }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        gap: '1rem',
        width: '100%',
        padding: '0.5rem 1rem'
      }}>
        {/* Logo Section - Compact */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', flexShrink: 0 }}>
          <AppImage
            src="/assets/nara-logo.png"
            alt="NARA logo"
            className="w-10 h-10 md:w-12 md:h-12 object-contain"
          />
          <div className="hidden sm:block">
            <h1 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.2 }}>{t('navbar.brand.title')}</h1>
            <p style={{ margin: 0, fontSize: '0.65rem', opacity: 0.7, color: 'var(--muted)', lineHeight: 1.2 }}>{t('navbar.brand.subtitle')}</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-links" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          {menuItems.map((item, index) => (
            <div
              key={item.titleKey}
              className="relative"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <button className="btn-ghost" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: '999px',
                fontSize: '0.9rem',
                fontWeight: 500,
                transition: 'all 0.3s ease'
              }}>
                <item.icon className="w-4 h-4" />
                {t(item.titleKey)}
                <Icons.ChevronDown className="w-3 h-3" />
              </button>

              <AnimatePresence>
                {activeDropdown === index && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="glass"
                    onMouseEnter={handleDropdownMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      marginTop: '0.5rem',
                      minWidth: '240px',
                      borderRadius: '16px',
                      padding: '0.5rem',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(0, 194, 255, 0.2)'
                    }}
                  >
                    {item.dropdown.map((subItem) => (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        className="dropdown-item"
                        onClick={() => setActiveDropdown(null)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.75rem 1rem',
                          borderRadius: '12px',
                          background: 'transparent',
                          textDecoration: 'none',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0, 194, 255, 0.1), rgba(0, 229, 255, 0.1))';
                          e.currentTarget.style.transform = 'translateX(4px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.transform = 'translateX(0)';
                        }}
                      >
                        <subItem.icon className="w-4 h-4" style={{
                          background: 'linear-gradient(135deg, #0088cc, #00c2ff)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        }} />
                        <span style={{
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          background: 'linear-gradient(135deg, #0088cc, #00c2ff)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        }}>{t(subItem.labelKey)}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Right side actions - Compact */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          {/* Contact Button - Compact */}
          <Link
            to="/contact-us"
            className="btn-ghost hidden lg:flex"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 0.875rem',
              borderRadius: '999px',
              fontSize: '0.85rem',
              fontWeight: 500,
              background: 'var(--primary)',
              color: 'white',
              transition: 'all 0.3s ease',
              textDecoration: 'none',
              whiteSpace: 'nowrap'
            }}
          >
            <Icons.Phone className="w-4 h-4" />
            <span className="hidden xl:inline">{t('navbar.menu.contact.links.getInTouch')}</span>
          </Link>

          {/* Language Selector - Always Visible */}
          <div
            ref={languageMenuRef}
            style={{ position: 'relative' }}
          >
            <button
              onClick={() => setLanguageMenuOpen((prev) => !prev)}
              className="btn-ghost"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 0.75rem',
                borderRadius: '999px',
                fontSize: '0.8rem',
                fontWeight: 500
              }}
              aria-haspopup="listbox"
              aria-expanded={languageMenuOpen}
              title={t('navbar.languageLabel')}
            >
              <Icons.Globe2 className="w-4 h-4" />
              <span style={{ fontWeight: 600 }}>{activeLanguage.code.toUpperCase()}</span>
              <Icons.ChevronDown className={`w-3 h-3 transition-transform ${languageMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {languageMenuOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  role="listbox"
                  className="glass"
                  style={{
                    position: 'absolute',
                    right: 0,
                    marginTop: '0.5rem',
                    borderRadius: '16px',
                    padding: '0.5rem',
                    minWidth: '200px',
                    boxShadow: '0 24px 40px rgba(2, 12, 27, 0.35)'
                  }}
                >
                  {AVAILABLE_LANGUAGES.map((lang) => (
                    <li key={lang.code}>
                      <button
                        onClick={() => handleLanguageChange(lang.code)}
                        className="btn-ghost"
                        style={{
                          display: 'flex',
                          width: '100%',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.5rem',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '12px',
                          fontSize: '0.85rem',
                          background: lang.code === activeLanguage.code ? 'var(--hover)' : 'transparent'
                        }}
                      >
                        <span>{t(lang.labelKey)}</span>
                        {lang.code === activeLanguage.code && (
                          <Icons.Check className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                        )}
                      </button>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle - Always Visible */}
          <button 
            onClick={toggleTheme}
            className="btn-ghost"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 0.75rem',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: 500
            }}
            title={theme === 'ocean' ? t('navbar.themes.ocean') : t('navbar.themes.cosmic')}
            aria-label="Toggle theme"
          >
            {theme === 'ocean' ? (
              <>
                <Icons.Waves className="w-4 h-4" style={{ color: '#00c2ff' }} />
                <span className="hidden sm:inline">{t('navbar.themes.ocean')}</span>
              </>
            ) : (
              <>
                <Icons.Sparkles className="w-4 h-4" style={{ color: '#a78bfa' }} />
                <span className="hidden sm:inline">{t('navbar.themes.cosmic')}</span>
              </>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn-ghost lg:hidden"
            style={{ padding: '0.5rem', borderRadius: '8px' }}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <Icons.X className="w-5 h-5" /> : <Icons.Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass md:hidden"
            style={{
              position: 'absolute',
              top: '100%',
              left: '12px',
              right: '12px',
              marginTop: '0.5rem',
              borderRadius: '16px',
              padding: '1rem',
              background: 'var(--glass-strong)'
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                marginBottom: '1rem'
              }}
            >
              <span
                style={{
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  opacity: 0.6
                }}
              >
                {t('navbar.languageLabel')}
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {AVAILABLE_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    style={{
                      padding: '0.45rem 0.85rem',
                      borderRadius: '999px',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      border: '1px solid var(--border)',
                      background: lang.code === activeLanguage.code ? 'var(--hover)' : 'transparent'
                    }}
                  >
                    {t(lang.labelKey)}
                  </button>
                ))}
              </div>
            </div>

            {menuItems.map((item) => (
              <div key={item.titleKey}>
                <h3 style={{ 
                  fontSize: '0.75rem', 
                  textTransform: 'uppercase', 
                  opacity: 0.6,
                  marginBottom: '0.5rem',
                  marginTop: '1rem'
                }}>
                  {t(item.titleKey)}
                </h3>
                {item.dropdown.map((subItem) => (
                  <Link
                    key={subItem.path}
                    to={subItem.path}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      color: 'var(--text)',
                      textDecoration: 'none'
                    }}
                  >
                    <subItem.icon className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                    <span>{t(subItem.labelKey)}</span>
                  </Link>
                ))}
              </div>
            ))}

            {/* Mobile Contact Us Button */}
            <Link
              to="/contact-us"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.875rem 1.5rem',
                marginTop: '1.5rem',
                borderRadius: '999px',
                fontSize: '0.95rem',
                fontWeight: 600,
                background: 'var(--primary)',
                color: 'white',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(0, 194, 255, 0.3)'
              }}
            >
              <Icons.Phone className="w-5 h-5" />
              {t('navbar.menu.contact.links.getInTouch')}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default ThemeNavbar;
