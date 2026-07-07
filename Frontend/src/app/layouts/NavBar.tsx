import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import whiteLogo from '@/assets/omr_logo_white.webp';
import { useAppStore } from '../store';
import { useTranslation } from '@/hooks/useTranslation';
import './NavBar.css';

const navLinksKeys: Record<string, string> = {
  'Home': 'nav.home',
  'Menu': 'nav.menu',
  'Events': 'nav.events',
  'Branches': 'nav.branches',
  'Gallery': 'nav.gallery',
  'About Us': 'nav.about',
};

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
  const flagSrc = language === 'EN'
    ? '/flags/cambodia.svg'
    : '/flags/united-kingdom.svg';

  return (
    <img className="navbar-language-flag" src={flagSrc} alt="" />
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
  const isBoeungKakPage =
    location.pathname === '/branches/boeung-kak' ||
    location.pathname === '/restaurants/boeung-kak';
  const isGalleryPage = location.pathname === '/gallery';
  const isEventsPage = location.pathname === '/events';

  const isReservationPage =
    location.pathname === '/reservations' ||
    location.pathname === '/reservation';

  useEffect(() => {
    if (isReservationPage) {
      setScrolled(false);
      return;
    }

    const handleScroll = () => {
      if (isHomePage || isToulKorkPage || isBoeungKakPage || isGalleryPage || isEventsPage) {
        const heroSection =
          document.getElementById('home-hero') ||
          document.getElementById('toulkork-hero') ||
          document.getElementById('boeungkak-hero') ||
          document.getElementById('gallery-hero') ||
          document.getElementById('events-hero');

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
  }, [isHomePage, isReservationPage, isGalleryPage, isEventsPage, isToulKorkPage, isBoeungKakPage]);

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
        className={`navbar navbar-${version} ${isReservationPage ? 'navbar-reservation-static' : ''
          }`}
      >
        <div className="navbar-inner">
          <div className="flex items-center gap-3 justify-self-start">
            <Link
              to="/"
              aria-label={t('nav.aria.home')}
              className="navbar-logo-link"
              onClick={closeMobileMenu}
            >
              <span className="navbar-logo-frame">
                <NavbarLogo />
              </span>
            </Link>
          </div>

          <div className="navbar-desktop-nav">
            {navLinks.map((link) => (
              <NavLink
                key={`${version}-${link.name}`}
                to={link.path}
                className={({ isActive }) =>
                  `navbar-desktop-link ${isActive ? 'navbar-desktop-link-active' : ''
                  }`
                }
              >
                {t(navLinksKeys[link.name] || link.name)}
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
              aria-label="Change language"
              title={
                language === 'EN'
                  ? t('language.switchToKhmer')
                  : t('language.switchToEnglish')
              }
            >
              <LanguageFlag language={language} />
            </button>
          </div>

          <div className="navbar-mobile-wrapper">
            <button
              type="button"
              className={`navbar-mobile-menu-button ${mobileMenuOpen ? 'navbar-mobile-menu-button-open' : ''
                }`}
              aria-label={t('nav.aria.openMenu')}
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
              className={`navbar-mobile-menu ${mobileMenuOpen ? 'navbar-mobile-menu-open' : ''
                }`}
              aria-hidden={!mobileMenuOpen}
            >
              <div className="navbar-mobile-menu-header">
                <Link
                  to="/"
                  aria-label={t('nav.aria.home')}
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
                        ? t('language.switchToKhmer')
                        : t('language.switchToEnglish')
                    }
                  >
                    <LanguageFlag language={language} />
                  </button>

                  <button
                    type="button"
                    className="navbar-mobile-close-button"
                    aria-label={t('nav.aria.closeMenu')}
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
                        `navbar-mobile-link ${isActive ? 'navbar-mobile-link-active' : ''
                        }`
                      }
                    >
                      {t(navLinksKeys[link.name] || link.name)}
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
