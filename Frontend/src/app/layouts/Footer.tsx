import { Link } from 'react-router-dom';

import whiteLogo from '@/assets/omr_logo_white.png';
import { useTranslation } from '@/hooks/useTranslation';

import './Footer.css';

const exploreLinks = [
  { labelKey: 'footer.links.menu', path: '/menu' },
  { labelKey: 'footer.links.branches', path: '/branches' },
  { labelKey: 'footer.links.story', path: '/about' },
  { labelKey: 'footer.links.giftCards', path: '/gift-cards' },
];

const legalLinks = [
  { labelKey: 'footer.links.terms', path: '/terms' },
  { labelKey: 'footer.links.privacy', path: '/privacy' },
  { labelKey: 'footer.links.sustainability', path: '/sustainability' },
];

const contactLinks = [
  { labelKey: 'footer.links.bookingInquiry', path: '/reservations' },
  { labelKey: 'footer.links.press', path: '/press' },
  { labelKey: 'footer.links.careers', path: '/careers' },
];

const socialLinks = [
  { labelKey: 'footer.social.instagram', href: 'https://www.instagram.com/' },
  { labelKey: 'footer.social.facebook', href: 'https://www.facebook.com/' },
  { labelKey: 'footer.social.tripAdvisor', href: 'https://www.tripadvisor.com/' },
];

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="site-footer">
      <div className="site-footer-container">
        <div className="site-footer-main">
          <div className="site-footer-brand">
            <Link
              to="/"
              aria-label={t(
                'footer.aria.home',
                undefined,
                'One More Restaurant home'
              )}
              className="site-footer-logo-link"
            >
              <img
                src={whiteLogo}
                alt={t('footer.logoAlt', undefined, 'One More Restaurant')}
                className="site-footer-logo-image"
                draggable={false}
              />
            </Link>

            <p className="site-footer-brand-text">
              {t('footer.brandText')}
            </p>
          </div>

          <nav
            className="site-footer-nav"
            aria-label={t(
              'footer.aria.navigation',
              undefined,
              'Footer navigation'
            )}
          >
            <div className="site-footer-column">
              <h4 className="site-footer-heading">
                {t('footer.headings.explore')}
              </h4>

              <div className="site-footer-links">
                {exploreLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="site-footer-link"
                  >
                    {t(link.labelKey)}
                  </Link>
                ))}
              </div>
            </div>

            <div className="site-footer-column">
              <h4 className="site-footer-heading">
                {t('footer.headings.legal')}
              </h4>

              <div className="site-footer-links">
                {legalLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="site-footer-link"
                  >
                    {t(link.labelKey)}
                  </Link>
                ))}
              </div>
            </div>

            <div className="site-footer-column">
              <h4 className="site-footer-heading">
                {t('footer.headings.contact')}
              </h4>

              <div className="site-footer-links">
                {contactLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="site-footer-link"
                  >
                    {t(link.labelKey)}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </div>

        <div className="site-footer-divider" />

        <div className="site-footer-bottom">
          <p>{t('footer.copyright')}</p>

          <div
            className="site-footer-socials"
            aria-label={t(
              'footer.aria.socialLinks',
              undefined,
              'Social links'
            )}
          >
            {socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="site-footer-social-link"
                target="_blank"
                rel="noreferrer"
              >
                {t(link.labelKey)}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
