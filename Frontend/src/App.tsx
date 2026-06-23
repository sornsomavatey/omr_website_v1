import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayouts from './app/layouts/MainLayouts';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Reservations from './pages/Reservations';
import Careers from './pages/Careers';
import Branches from './pages/Branches';
import ToulKork from './pages/Branches/ToukKork/ToulKork';
import BoeungKak from './pages/Branches/BoeungKak/BoeungKak';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Contact from './pages/Contact';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayouts />}>
          <Route index element={<Home />} />
          <Route path="menu" element={<Menu />} />
          <Route path="reservations" element={<Reservations />} />
          <Route path="careers" element={<Careers />} />
          <Route path="branches" element={<Branches />} />
          <Route path="branches/toul-kork" element={<ToulKork />} />
          <Route path="branches/boeung-kak" element={<BoeungKak />} />
          <Route path="restaurants" element={<Branches />} />
          <Route path="restaurants/toul-kork" element={<ToulKork />} />
          <Route path="restaurants/boeung-kak" element={<BoeungKak />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          {/* Fallback redirect or route */}
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
