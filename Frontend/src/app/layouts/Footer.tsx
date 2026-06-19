import { Link } from 'react-router-dom';
import whiteLogo from '@/assets/omr_logo_white.png';
import './Footer.css';

const exploreLinks = [
  { name: 'Menu', path: '/menu' },
  { name: 'Branches', path: '/restaurants' },
  { name: 'Story', path: '/about' },
  { name: 'Gift Cards', path: '/gift-cards' },
];

const legalLinks = [
  { name: 'Terms', path: '/terms' },
  { name: 'Privacy', path: '/privacy' },
  { name: 'Sustainability', path: '/sustainability' },
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
  return (
    <footer className="site-footer">
      <div className="site-footer-container">
        <div className="site-footer-main">
          <div className="site-footer-brand">
            <Link
              to="/"
              aria-label="One More Restaurant home"
              className="site-footer-logo-link"
            >
              <img
                src={whiteLogo}
                alt="One More Restaurant"
                className="site-footer-logo-image"
                draggable={false}
              />
            </Link>

            <p className="site-footer-brand-text">
              Redefining the boundaries of Khmer gastronomy through a commitment
              to heritage and innovation.
            </p>
          </div>

          <nav className="site-footer-nav" aria-label="Footer navigation">
            <div className="site-footer-column">
              <h4 className="site-footer-heading">Explore</h4>

              <div className="site-footer-links">
                {exploreLinks.map((link) => (
                  <Link key={link.name} to={link.path} className="site-footer-link">
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="site-footer-column">
              <h4 className="site-footer-heading">Legal</h4>

              <div className="site-footer-links">
                {legalLinks.map((link) => (
                  <Link key={link.name} to={link.path} className="site-footer-link">
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="site-footer-column">
              <h4 className="site-footer-heading">Contact</h4>

              <div className="site-footer-links">
                {contactLinks.map((link) => (
                  <Link key={link.name} to={link.path} className="site-footer-link">
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </div>

        <div className="site-footer-divider" />

        <div className="site-footer-bottom">
          <p>© 2024 One More Restaurant. All Rights Reserved.</p>

          <div className="site-footer-socials" aria-label="Social links">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="site-footer-social-link"
                target="_blank"
                rel="noreferrer"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
