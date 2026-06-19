import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import whiteLogo from '@/assets/omr_logo_white.png';
import { useAppStore } from '../store';
import './NavBar.css';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Menu', path: '/menu' },
  { name: 'Events', path: '/events' },
  { name: 'Branches', path: '/branches' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'About Us', path: '/about' },
];

const mobileNavLinks = [
  { name: 'Home', path: '/' },
  { name: 'Menu', path: '/menu' },
  { name: 'Events', path: '/events' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Branches', path: '/branches' },
  { name: 'About Us', path: '/about' },
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

  const {
    language,
    setLanguage,
    mobileMenuOpen,
    setMobileMenuOpen,
  } = useAppStore();

  const [scrolled, setScrolled] = useState(false);

  const isHomePage = location.pathname === '/';

  const isReservationPage =
    location.pathname === '/reservations' ||
    location.pathname === '/reservation';

  useEffect(() => {
    if (isReservationPage) {
      setScrolled(false);
      return;
    }

    const handleScroll = () => {
      if (isHomePage) {
        const heroSection = document.getElementById('home-hero');

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
            aria-label="Go to homepage"
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
                key={`${version}-${link.name}`}
                to={link.path}
                className={({ isActive }) =>
                  `navbar-desktop-link ${
                    isActive ? 'navbar-desktop-link-active' : ''
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="navbar-desktop-actions">
            {isV2 && (
              <Link
                to="/reservations"
                className="navbar-reservation-button"
              >
                Reservation
              </Link>
            )}

            <button
              type="button"
              onClick={toggleLanguage}
              className="navbar-language-button"
              aria-label="Change language"
              title={
                language === 'EN'
                  ? 'Switch to Khmer'
                  : 'Switch to English'
              }
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
              aria-label="Open navigation menu"
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
                  aria-label="Go to homepage"
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
                    aria-label="Change language"
                    title={
                      language === 'EN'
                        ? 'Switch to Khmer'
                        : 'Switch to English'
                    }
                  >
                    <LanguageFlag language={language} />
                  </button>

                  <button
                    type="button"
                    className="navbar-mobile-close-button"
                    aria-label="Close navigation menu"
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
                      key={`mobile-${version}-${link.name}`}
                      to={link.path}
                      onClick={closeMobileMenu}
                      className={({ isActive }) =>
                        `navbar-mobile-link ${
                          isActive ? 'navbar-mobile-link-active' : ''
                        }`
                      }
                    >
                      {link.name}
                    </NavLink>
                  ))}
                </div>

                <Link
                  to="/reservations"
                  onClick={closeMobileMenu}
                  className="navbar-mobile-reservation-button navbar-reservation-button"
                >
                  Reservation
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
