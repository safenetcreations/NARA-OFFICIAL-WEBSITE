import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import useThemeStore from '../../store/theme';
import AppImage from '../AppImage';

const ThemeNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useThemeStore((state) => state?.theme || 'ocean');
  const toggleTheme = useThemeStore((state) => state?.toggleTheme);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownTimeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    {
      title: 'Research & Intelligence',
      icon: Icons.Microscope,
      dropdown: [
        { name: 'Research Excellence Portal', path: '/research-excellence-portal', icon: Icons.Award },
        { name: 'Research Collaboration', path: '/research-collaboration-platform', icon: Icons.Users },
        { name: 'Knowledge Discovery', path: '/knowledge-discovery-center', icon: Icons.BookOpen },
        { name: 'Partnership Innovation', path: '/partnership-innovation-gateway', icon: Icons.Lightbulb }
      ]
    },
    {
      title: 'Services & Operations',
      icon: Icons.Settings,
      dropdown: [
        { name: 'Digital Marketplace', path: '/nara-digital-marketplace', icon: Icons.ShoppingBag },
        { name: 'Maritime Services', path: '/maritime-services-hub', icon: Icons.Ship },
        { name: 'Government Services', path: '/government-services-portal', icon: Icons.Building },
        { name: 'Emergency Response', path: '/emergency-response-network', icon: Icons.AlertTriangle }
      ]
    },
    {
      title: 'Resources',
      icon: Icons.Folder,
      dropdown: [
        { name: 'Digital Product Library', path: '/digital-product-library', icon: Icons.Archive },
        { name: 'Learning Academy', path: '/learning-development-academy', icon: Icons.GraduationCap },
        { name: 'Regional Impact', path: '/regional-impact-network', icon: Icons.Globe },
        { name: 'Integration Systems', path: '/integration-systems-platform', icon: Icons.Network }
      ]
    },
    {
      title: 'About',
      icon: Icons.Info,
      dropdown: [
        { name: 'Our Story', path: '/about-nara-our-story', icon: Icons.Heart },
        { name: 'News & Updates', path: '/nara-news-updates-center', icon: Icons.Newspaper },
        { name: 'Procurement', path: '/procurement-recruitment-portal', icon: Icons.Briefcase }
      ]
    }
  ];

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
           margin: '12px',
           width: 'calc(100% - 24px)'
         }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', width: '100%' }}>
        {/* Back + Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => { if (window.history.length > 1) navigate(-1); else navigate('/'); }}
            className="btn-ghost"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', borderRadius: '999px' }}
            aria-label="Go back"
            title="Back"
          >
            <Icons.ArrowLeft className="w-5 h-5" />
            <span className="hidden md:inline" style={{ fontSize: '0.85rem' }}>Back</span>
          </button>

          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <div className="glass" style={{ padding: '6px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AppImage
                src="/assets/nara-logo.png"
                alt="NARA logo"
                className="w-10 h-10 object-contain"
              />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)' }}>NARA</h1>
              <p style={{ margin: 0, fontSize: '0.65rem', opacity: 0.7, color: 'var(--muted)' }}>Ocean Research</p>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="nav-links" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          {menuItems.map((item, index) => (
            <div
              key={item.title}
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
                {item.title}
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
                      boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
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
                          color: 'var(--text)',
                          textDecoration: 'none',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--hover)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <subItem.icon className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                        <span style={{ fontSize: '0.9rem' }}>{subItem.name}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Right side actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="btn-ghost"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '999px',
              fontSize: '0.85rem'
            }}
          >
            {theme === 'ocean' ? (
              <>
                <Icons.Waves className="w-4 h-4" style={{ color: '#00c2ff' }} />
                <span>Ocean</span>
              </>
            ) : (
              <>
                <Icons.Sparkles className="w-4 h-4" style={{ color: '#a78bfa' }} />
                <span>Cosmic</span>
              </>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn-ghost md:hidden"
            style={{ padding: '0.5rem' }}
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
            {menuItems.map((item) => (
              <div key={item.title}>
                <h3 style={{ 
                  fontSize: '0.75rem', 
                  textTransform: 'uppercase', 
                  opacity: 0.6,
                  marginBottom: '0.5rem',
                  marginTop: '1rem'
                }}>
                  {item.title}
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
                    <span>{subItem.name}</span>
                  </Link>
                ))}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default ThemeNavbar;
