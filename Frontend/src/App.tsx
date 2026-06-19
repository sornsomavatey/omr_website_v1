import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayouts from './app/layouts/MainLayouts';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Reservations from './pages/Reservations';
import Careers from './pages/Careers';
import Restaurants from './pages/Restaurants';
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
          <Route path="restaurants" element={<Restaurants />} />
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
