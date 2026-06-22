import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

import whiteLogo from '@/assets/omr_logo_white.png';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '../store';

import './NavBar.css';

const navLinks = [
  { labelKey: 'nav.home', path: '/' },
  { labelKey: 'nav.menu', path: '/menu' },
  { labelKey: 'nav.events', path: '/events' },
  { labelKey: 'nav.branches', path: '/branches' },
  { labelKey: 'nav.gallery', path: '/gallery' },
  { labelKey: 'nav.about', path: '/about' },
];

const mobileNavLinks = [
  { labelKey: 'nav.home', path: '/' },
  { labelKey: 'nav.menu', path: '/menu' },
  { labelKey: 'nav.events', path: '/events' },
  { labelKey: 'nav.gallery', path: '/gallery' },
  { labelKey: 'nav.branches', path: '/branches' },
  { labelKey: 'nav.about', path: '/about' },
];

type NavigationVersion = 'v1' | 'v2';

type LogoStyle = CSSProperties & {
  '--navbar-logo-image': string;
};

function NavbarLogo({ mobile = false }: { mobile?: boolean }) {
  const logoStyle: LogoStyle = {
    '--navbar-logo-image': `url("${whiteLogo}")`,
  };

  return (
    <span
      aria-hidden="true"
      className={mobile ? 'navbar-mobile-logo-icon' : 'navbar-logo-icon'}
      style={logoStyle}
    />
  );
}

function LanguageFlag({ language }: { language: string }) {
  if (language === 'EN') {
    return (
      <svg className="navbar-language-flag" viewBox="0 0 60 40" fill="none">
        <rect width="60" height="40" fill="#00247D" />
        <path
          d="M0 0 L60 40 M60 0 L0 40"
          stroke="#FFFFFF"
          strokeWidth="6"
        />
        <path
          d="M0 0 L60 40 M60 0 L0 40"
          stroke="#CF142B"
          strokeWidth="4"
        />
        <path
          d="M30 0 V40 M0 20 H60"
          stroke="#FFFFFF"
          strokeWidth="10"
        />
        <path
          d="M30 0 V40 M0 20 H60"
          stroke="#CF142B"
          strokeWidth="6"
        />
      </svg>
    );
  }

  return (
    <svg className="navbar-language-flag" viewBox="0 0 40 24" fill="none">
      <rect width="40" height="24" fill="#E52B50" />
      <rect width="40" height="6" fill="#032A75" />
      <rect y="18" width="40" height="6" fill="#032A75" />
      <path
        d="M14 16 h12 v-1.5 h-2 v-2.5 h-1.5 v2.5 h-1.5 v-4.5 h-2 v4.5 h-1.5 v-2.5 h-1.5 v2.5 h-2 v1.5 z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export default function Navbar() {
  const location = useLocation();
  const { t } = useTranslation();

  const {
    language,
    setLanguage,
    mobileMenuOpen,
    setMobileMenuOpen,
  } = useAppStore();

  const [scrolled, setScrolled] = useState(false);

  const isHomePage = location.pathname === '/';
  const isToulKorkPage =
    location.pathname === '/branches/toul-kork' ||
    location.pathname === '/restaurants/toul-kork';

  const isReservationPage =
    location.pathname === '/reservations' ||
    location.pathname === '/reservation';

  useEffect(() => {
    if (isReservationPage) {
      setScrolled(false);
      return;
    }

    const handleScroll = () => {
      if (isHomePage || isToulKorkPage) {
        const heroSection =
          document.getElementById('home-hero') ||
          document.getElementById('toulkork-hero');

        if (!heroSection) {
          setScrolled(false);
          return;
        }

        setScrolled(heroSection.getBoundingClientRect().bottom <= 0);
        return;
      }

      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isHomePage, isReservationPage]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, setMobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleEscape);
    };
  }, [mobileMenuOpen, setMobileMenuOpen]);

  const toggleLanguage = () => {
    setLanguage(language === 'EN' ? 'KH' : 'EN');
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const languageButtonLabel =
    language === 'EN'
      ? t('language.switchToKhmer', undefined, 'Switch to Khmer')
      : t('language.switchToEnglish', undefined, 'Switch to English');

  const renderNavigation = (version: NavigationVersion) => {
    const isV2 = version === 'v2';

    return (
      <nav
        className={`navbar navbar-${version} ${
          isReservationPage ? 'navbar-reservation-static' : ''
        }`}
      >
        <div className="navbar-inner">
          <Link
            to="/"
            aria-label={t('nav.aria.home', undefined, 'Go to homepage')}
            className="navbar-logo-link"
            onClick={closeMobileMenu}
          >
            <span className="navbar-logo-frame">
              <NavbarLogo />
            </span>
          </Link>

          <div className="navbar-desktop-nav">
            {navLinks.map((link) => (
              <NavLink
                key={`${version}-${link.path}`}
                to={link.path}
                className={({ isActive }) =>
                  `navbar-desktop-link ${
                    isActive ? 'navbar-desktop-link-active' : ''
                  }`
                }
              >
                {t(link.labelKey)}
              </NavLink>
            ))}
          </div>

          <div className="navbar-desktop-actions">
            {isV2 && (
              <Link
                to="/reservations"
                className="navbar-reservation-button"
              >
                {t('nav.reservation')}
              </Link>
            )}

            <button
              type="button"
              onClick={toggleLanguage}
              className="navbar-language-button"
              aria-label={languageButtonLabel}
              title={languageButtonLabel}
            >
              <LanguageFlag language={language} />
            </button>
          </div>

          <div className="navbar-mobile-wrapper">
            <button
              type="button"
              className={`navbar-mobile-menu-button ${
                mobileMenuOpen ? 'navbar-mobile-menu-button-open' : ''
              }`}
              aria-label={t('nav.aria.openMenu', undefined, 'Open navigation menu')}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="navbar-mobile-menu-icon">
                <span />
                <span />
                <span />
              </span>
            </button>

            <div
              className={`navbar-mobile-menu ${
                mobileMenuOpen ? 'navbar-mobile-menu-open' : ''
              }`}
              aria-hidden={!mobileMenuOpen}
            >
              <div className="navbar-mobile-menu-header">
                <Link
                  to="/"
                  aria-label={t('nav.aria.home', undefined, 'Go to homepage')}
                  className="navbar-mobile-logo-link"
                  onClick={closeMobileMenu}
                >
                  <span className="navbar-mobile-logo-frame">
                    <NavbarLogo mobile />
                  </span>
                </Link>

                <div className="navbar-mobile-header-actions">
                  <button
                    type="button"
                    onClick={toggleLanguage}
                    className="navbar-mobile-language-button"
                    aria-label={languageButtonLabel}
                    title={languageButtonLabel}
                  >
                    <LanguageFlag language={language} />
                  </button>

                  <button
                    type="button"
                    className="navbar-mobile-close-button"
                    aria-label={t('nav.aria.closeMenu', undefined, 'Close navigation menu')}
                    onClick={closeMobileMenu}
                  >
                    <span />
                    <span />
                  </button>
                </div>
              </div>

              <div className="navbar-mobile-menu-content">
                <div className="navbar-mobile-links">
                  {mobileNavLinks.map((link) => (
                    <NavLink
                      key={`mobile-${version}-${link.path}`}
                      to={link.path}
                      onClick={closeMobileMenu}
                      className={({ isActive }) =>
                        `navbar-mobile-link ${
                          isActive ? 'navbar-mobile-link-active' : ''
                        }`
                      }
                    >
                      {t(link.labelKey)}
                    </NavLink>
                  ))}
                </div>

                <Link
                  to="/reservations"
                  onClick={closeMobileMenu}
                  className="navbar-mobile-reservation-button navbar-reservation-button"
                >
                  {t('nav.reservation')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  };

  return isReservationPage
    ? renderNavigation('v1')
    : renderNavigation(scrolled ? 'v2' : 'v1');
}
