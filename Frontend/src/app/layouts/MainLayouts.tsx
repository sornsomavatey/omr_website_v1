import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './NavBar';
import Footer from './Footer';
import ScrollToTop from '../../components/ScrollToTop';
import { useTranslation } from '@/hooks/useTranslation';
import { getSEOMetadata } from '@/lib/seo';

export default function MainLayouts() {
  const location = useLocation();
  const { isKhmer } = useTranslation();

  // Dynamic SEO handler 
  useEffect(() => {
    const seo = getSEOMetadata(location.pathname, isKhmer);
    
    // 1. Title
    document.title = seo.title;

    
    const setMetaTag = (attributeName: string, attributeValue: string, content: string) => {
      const element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      if (element) {
        element.setAttribute('content', content);
      }
    };

    // 2. Description & Keywords
    setMetaTag('name', 'description', seo.description);
    setMetaTag('name', 'keywords', seo.keywords);

    // 3. Open Graph (og:*)
    setMetaTag('property', 'og:title', seo.title);
    setMetaTag('property', 'og:description', seo.description);
    setMetaTag('property', 'og:image', seo.ogImage);
    setMetaTag('property', 'og:url', window.location.href);

    // 4. Twitter (twitter:*)
    setMetaTag('name', 'twitter:title', seo.title);
    setMetaTag('name', 'twitter:description', seo.description);
    setMetaTag('name', 'twitter:image', seo.ogImage);

  }, [location.pathname, isKhmer]);

  useEffect(() => {
    if (location.hash) {
      const targetId = decodeURIComponent(location.hash.slice(1));
      const frame = window.requestAnimationFrame(() => {
        document.getElementById(targetId)?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });

      return () => window.cancelAnimationFrame(frame);
    }

    window.scrollTo(0, 0);
    return undefined;
  }, [location.pathname, location.hash]);

  const isHomePage = location.pathname === '/';

  const isReservationPage =
    location.pathname === '/reservations' ||
    location.pathname === '/reservation';

  const isMenuPage = location.pathname === '/menu';
  const isRestaurantsPage =
    location.pathname === '/restaurants' ||
    location.pathname === '/branches';
  const isToulKorkPage =
    location.pathname === '/branches/toul-kork' ||
    location.pathname === '/restaurants/toul-kork';
  const isBoeungKakPage =
    location.pathname === '/branches/boeung-kak' ||
    location.pathname === '/restaurants/boeung-kak';
  
  const isGalleryPage = location.pathname === '/gallery';
  const isEventsPage = location.pathname === '/events';
  const isAboutPage = location.pathname === '/about';
  const isCareersPage = location.pathname === '/careers';
  const isContactPage = location.pathname === '/contact';

  const needsTopPadding =
    !isHomePage &&
    !isReservationPage &&
    !isMenuPage &&
    !isRestaurantsPage &&
    !isToulKorkPage &&
    !isBoeungKakPage &&
    !isGalleryPage &&
    !isEventsPage &&
    !isAboutPage &&
    !isCareersPage &&
    !isContactPage;

  return (
    <div
      className={`min-h-screen flex flex-col bg-cream text-dark-green font-sans ${
        needsTopPadding ? 'pt-[82px]' : ''
      }`}
    >
      <Navbar />

      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
