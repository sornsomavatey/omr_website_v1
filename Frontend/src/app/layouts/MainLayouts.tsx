import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './NavBar';
import Footer from './Footer';

export default function MainLayouts() {
  const location = useLocation();

  const isHomePage = location.pathname === '/';
  const isReservationPage =
    location.pathname === '/reservations' || location.pathname === '/reservation';

  const needsTopPadding = !isHomePage && !isReservationPage && location.pathname !== '/menu';

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

      {!isHomePage && <Footer />}
    </div>
  );
}