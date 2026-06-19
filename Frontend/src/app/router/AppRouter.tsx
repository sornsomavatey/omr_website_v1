import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import MainLayouts from '@/app/layouts/MainLayouts';

import HomePage from '@/pages/Home';
import MenuPage from '@/pages/Menu';
import BranchesPage from '@/pages/Branches';
import GalleryPage from '@/pages/Gallery';
import AboutPage from '@/pages/About';
import ReservationPage from '@/pages/Reservations';
import CareersPage from '@/pages/Careers';
import ContactPage from '@/pages/Contact';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayouts />}>
          <Route index element={<HomePage />} />

          <Route path="/menu" element={<MenuPage />} />
          <Route path="/restaurants" element={<Navigate to="/branches" replace />} />
          <Route path="/branches" element={<BranchesPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/about" element={<AboutPage />} />
          
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/contact" element={<ContactPage />} />

          <Route path="/reservation" element={<ReservationPage />} />
          <Route path="/reservations" element={<ReservationPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
