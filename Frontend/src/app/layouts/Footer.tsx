import { Link } from 'react-router-dom';
import whiteLogo from '@/assets/omr_logo_white.webp';
import { useTranslation } from '@/hooks/useTranslation';
import './Footer.css';

const footerLinkKeys: Record<string, string> = {
  'Menu': 'footer.links.menu',
  'Branches': 'footer.links.branches',
  'Story': 'footer.links.story',
  'Gift Cards': 'footer.links.webptCards',
  'Terms': 'footer.links.terms',
  'Privacy': 'footer.links.privacy',
  'Booking Inquiry': 'footer.links.bookingInquiry',
  'Press': 'footer.links.press',
  'Careers': 'footer.links.careers',
  'Instagram': 'footer.social.instagram',
  'Facebook': 'footer.social.facebook',
  'TripAdvisor': 'footer.social.tripAdvisor',
};

const exploreLinks = [
  { name: 'Menu', path: '/menu' },
  { name: 'Branches', path: '/branches' },
  { name: 'Story', path: '/about' },
  { name: 'Gift Cards', path: '/gift-cards' },
];

const legalLinks = [
  { name: 'Terms', path: '/terms' },
  { name: 'Privacy', path: '/privacy' },
];

const contactLinks = [
  { name: 'Booking Inquiry', path: '/reservations' },
  { name: 'Press', path: '/press' },
  { name: 'Careers', path: '/careers' },
];

const socialLinks = [
  { name: 'Instagram', href: 'https://www.instagram.com/' },
  { name: 'Facebook', href: 'https://www.facebook.com/' },
  { name: 'TripAdvisor', href: 'https://www.tripadvisor.com/' },
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
              aria-label={t('footer.aria.home')}
              className="site-footer-logo-link"
            >
              <img
                src={whiteLogo}
                alt={t('footer.logoAlt')}
                className="site-footer-logo-image"
                draggable={false}
              />
            </Link>

            <p className="site-footer-brand-text">
              {t('footer.brandText')}
            </p>
          </div>

          <nav className="site-footer-nav" aria-label={t('footer.aria.navigation')}>
            <div className="site-footer-column">
              <h4 className="site-footer-heading">{t('footer.headings.explore')}</h4>

              <div className="site-footer-links">
                {exploreLinks.map((link) => (
                  <Link key={link.name} to={link.path} className="site-footer-link">
                    {t(footerLinkKeys[link.name] || link.name)}
                  </Link>
                ))}
              </div>
            </div>

            <div className="site-footer-column">
              <h4 className="site-footer-heading">{t('footer.headings.legal')}</h4>

              <div className="site-footer-links">
                {legalLinks.map((link) => (
                  <Link key={link.name} to={link.path} className="site-footer-link">
                    {t(footerLinkKeys[link.name] || link.name)}
                  </Link>
                ))}
              </div>
            </div>

            <div className="site-footer-column">
              <h4 className="site-footer-heading">{t('footer.headings.contact')}</h4>

              <div className="site-footer-links">
                {contactLinks.map((link) => (
                  <Link key={link.name} to={link.path} className="site-footer-link">
                    {t(footerLinkKeys[link.name] || link.name)}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </div>

        <div className="site-footer-divider" />

        <div className="site-footer-bottom">
          <p>{t('footer.copyright')}</p>

          <div className="site-footer-socials" aria-label={t('footer.aria.socialLinks')}>
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="site-footer-social-link"
                target="_blank"
                rel="noreferrer"
              >
                {t(footerLinkKeys[link.name] || link.name)}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
