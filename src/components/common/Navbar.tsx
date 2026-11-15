import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, ShieldCheck, X } from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import { useAuth } from '../../context/AuthContext';
import { LanguageToggle, useLanguage } from '../../context/LanguageContext';

export const Navbar: React.FC = () => {
  const { settings } = useWedding();
  const { isAdmin } = useAuth();
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/our-story', label: t('nav.ourStory') },
    { to: '/events', label: t('nav.events') },
    { to: '/schedule', label: t('nav.schedule') },
    { to: '/gallery', label: t('nav.gallery') },
    { to: '/videos', label: t('nav.videos') },
    { to: '/family', label: t('nav.family') },
    { to: '/venue', label: t('nav.venue') },
    { to: '/contact', label: t('nav.contact') }
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-maroon-900/95 backdrop-blur-md shadow-royal border-b border-gold-400/30 py-2.5'
          : 'bg-gradient-to-b from-maroon-950/90 via-maroon-900/65 to-transparent py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">
        {/* Brand / Couple Monogram */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <img
            src="/images/wedding-logo.png"
            alt={`${settings.coupleDisplayName} Wedding Crest`}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border border-gold-400/70 shadow-gold transition-transform group-hover:scale-105"
          />
          <div className="leading-tight">
            <span className="block font-serif text-lg sm:text-xl font-semibold text-ivory-pure tracking-wide">
              {settings.coupleDisplayName}
            </span>
            <span className="block text-[10px] uppercase tracking-[0.22em] text-gold-300">
              {settings.weddingDateFormatted}
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-full text-xs xl:text-sm font-medium tracking-wide transition-all ${
                  isActive
                    ? 'bg-gold-500/20 text-gold-300 border border-gold-400/50'
                    : 'text-ivory-pure/90 hover:text-gold-300 hover:bg-white/5'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Right Controls (Language Switcher, Admin & RSVP) */}
        <div className="hidden lg:flex items-center gap-2.5 shrink-0">
          <LanguageToggle />

          <Link
            to={isAdmin ? '/admin' : '/admin/login'}
            title={isAdmin ? t('nav.adminDashboard') : t('nav.adminPortal')}
            className="p-2 rounded-full text-gold-300/85 hover:text-gold-200 hover:bg-white/10 transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
          </Link>
          <Link to="/rsvp" className="btn-gold !py-2 !px-4 !text-xs uppercase tracking-wider">
            {t('nav.rsvpNow')}
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="flex lg:hidden items-center gap-2">
          <LanguageToggle className="!scale-90" />
          <Link to="/rsvp" className="btn-gold !py-1.5 !px-3 !text-xs">
            {t('nav.rsvp')}
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="p-2 rounded-lg text-ivory-pure border border-gold-400/40 bg-maroon-950/50"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-maroon-950/98 border-t border-gold-400/30 px-4 py-4 space-y-2 shadow-2xl">
          <div className="flex items-center justify-between pb-2 border-b border-gold-400/20">
            <span className="text-xs uppercase tracking-wider text-gold-300 font-medium">
              {t('lang.label')}
            </span>
            <LanguageToggle />
          </div>

          <div className="space-y-1">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-gold-500/20 text-gold-300 border border-gold-400/40'
                      : 'text-ivory-pure/90 hover:bg-white/5'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="pt-2 border-t border-gold-400/20 flex items-center justify-between gap-2">
            <Link
              to={isAdmin ? '/admin' : '/admin/login'}
              className="flex items-center gap-2 px-4 py-2 text-xs text-gold-300 hover:underline"
            >
              <ShieldCheck className="w-4 h-4" />
              {isAdmin ? t('nav.adminDashboard') : t('nav.adminPortal')}
            </Link>
            <Link to="/rsvp" className="btn-gold !py-2 !px-4 !text-xs">
              {t('nav.confirmAttendance')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
