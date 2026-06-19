import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './NavBar';
import Footer from './Footer';
import ScrollToTop from '../../components/ScrollToTop';

export default function MainLayouts() {
  const location = useLocation();

  useEffect(() => {
    // Automatically scroll to the top of the page on route changes
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isHomePage = location.pathname === '/';

  const isReservationPage =
    location.pathname === '/reservations' ||
    location.pathname === '/reservation';

  const isMenuPage = location.pathname === '/menu';
  const isRestaurantsPage =
    location.pathname === '/restaurants' ||
    location.pathname === '/branches';

  const needsTopPadding = !isHomePage && !isReservationPage && !isMenuPage && !isRestaurantsPage;

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