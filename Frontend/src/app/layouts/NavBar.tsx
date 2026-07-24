import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Check } from 'lucide-react';
import whiteLogo from '@/assets/omr_logo_white.webp';
import { useAppStore } from '../store';
import type { Language } from '../store';
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

const languageOptions: Array<{ code: Language; label: string; flag: string }> = [
  { code: 'EN', label: 'English', flag: '/flags/united-kingdom.svg' },
  { code: 'KH', label: 'ខ្មែរ', flag: '/flags/cambodia.svg' },
  { code: 'ZH', label: '中文', flag: '/flags/china.svg' },
  { code: 'KO', label: '한국어', flag: '/flags/south-korea.svg' },
];

function LanguageMenu({ mobile = false }: { mobile?: boolean }) {
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const selectedLanguage = languageOptions.find((option) => option.code === language) || languageOptions[0];

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !menuRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const chooseLanguage = (nextLanguage: Language) => {
    window.dispatchEvent(new Event('omr:before-language-toggle'));
    setLanguage(nextLanguage);
    setOpen(false);
  };

  return (
    <div
      className={`navbar-language-menu ${mobile ? 'navbar-language-menu-mobile' : ''}`}
      ref={menuRef}
    >
      <button
        type="button"
        className={mobile ? 'navbar-mobile-language-button' : 'navbar-language-button'}
        aria-label="Choose language"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <img
          className={`navbar-language-current-flag ${
            language === 'ZH' ? 'navbar-language-current-flag-china' : ''
          } ${language === 'KO' ? 'navbar-language-current-flag-korea' : ''}`}
          src={selectedLanguage.flag}
          alt=""
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="navbar-language-dropdown" role="menu" aria-label="Languages">
          {languageOptions.map((option) => (
            <button
              type="button"
              role="menuitemradio"
              aria-checked={language === option.code}
              className={`navbar-language-option ${language === option.code ? 'navbar-language-option-active' : ''}`}
              key={option.code}
              onClick={() => chooseLanguage(option.code)}
            >
              <img className="navbar-language-option-flag" src={option.flag} alt="" aria-hidden="true" />
              <span>{option.label}</span>
              <Check className="navbar-language-option-check" aria-hidden="true" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const location = useLocation();
  const { t } = useTranslation();

  const {
    language,
    mobileMenuOpen,
    setMobileMenuOpen,
  } = useAppStore();

  const [scrolled, setScrolled] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  const isHomePage = location.pathname === '/';
  const isToulKorkPage =
    location.pathname === '/branches/toul-kork' ||
    location.pathname === '/restaurants/toul-kork';
  const isBoeungKakPage =
    location.pathname === '/branches/boeung-kak' ||
    location.pathname === '/restaurants/boeung-kak';
  const isGalleryPage = location.pathname === '/gallery';
  const isEventsPage = location.pathname === '/events';
  const isMenuPage = location.pathname === '/menu';
  const isTermsPage = location.pathname === '/terms';

  const isReservationPage =
    location.pathname === '/reservations' ||
    location.pathname === '/reservation';

  useEffect(() => {
    if (isReservationPage) {
      setScrolled(false);
      return;
    }

    const handleScroll = () => {
      if (isHomePage || isToulKorkPage || isBoeungKakPage || isGalleryPage || isEventsPage || isMenuPage) {
        const heroSection =
          document.getElementById('home-hero') ||
          document.getElementById('toulkork-hero') ||
          document.getElementById('boeungkak-hero') ||
          document.getElementById('gallery-hero') ||
          document.getElementById('events-hero') ||
          document.getElementById('menu-hero');

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
  }, [isHomePage, isReservationPage, isGalleryPage, isEventsPage, isMenuPage, isToulKorkPage, isBoeungKakPage]);

  useEffect(() => {
    const shouldCompactMenuNav = (isMenuPage || isGalleryPage) && scrolled;
    document.body.classList.toggle('menu-page-nav-compact', shouldCompactMenuNav);

    return () => {
      document.body.classList.remove('menu-page-nav-compact');
    };
  }, [isGalleryPage, isMenuPage, scrolled]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, setMobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const isDesktopCompactDropdown =
      (isMenuPage || isGalleryPage) && scrolled && window.innerWidth >= 1024;
    const previousOverflow = document.body.style.overflow;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (target instanceof Node && !mobileMenuRef.current?.contains(target)) {
        setMobileMenuOpen(false);
      }
    };

    if (!isDesktopCompactDropdown) {
      document.body.style.overflow = 'hidden';
    }

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('pointerdown', handlePointerDown, true);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('pointerdown', handlePointerDown, true);
    };
  }, [isGalleryPage, isMenuPage, mobileMenuOpen, scrolled, setMobileMenuOpen]);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const renderNavigation = (version: NavigationVersion) => {
    const isV2 = version === 'v2';

    return (
      <nav
        className={`navbar navbar-${version} ${(isMenuPage || isGalleryPage) && scrolled ? 'navbar-menu-desktop-compact' : ''} ${isReservationPage ? 'navbar-reservation-static' : ''
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

            <LanguageMenu />
          </div>

          <div className="navbar-mobile-wrapper" ref={mobileMenuRef}>
            <button
              type="button"
              className={`navbar-mobile-menu-button ${mobileMenuOpen ? 'navbar-mobile-menu-button-open' : ''
                }`}
              aria-label={t('nav.aria.openMenu')}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
                  <LanguageMenu mobile />

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
    : renderNavigation(scrolled || isTermsPage ? 'v2' : 'v1');
}
