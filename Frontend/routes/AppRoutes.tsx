import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import MainLayouts from '@/app/layouts/MainLayouts';

import HomePage from '@/pages/Home';
import MenuPage from '@/pages/Menu';
import RestaurantsPage from '@/pages/Restaurants';
import GalleryPage from '@/pages/Gallery';
import AboutPage from '@/pages/About';
import ReservationPage from '@/pages/Reservations';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayouts />}>
          <Route index element={<HomePage />} />

          <Route path="/menu" element={<MenuPage />} />
          <Route path="/restaurants" element={<RestaurantsPage />} />
          <Route path="/branches" element={<Navigate to="/restaurants" replace />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/about" element={<AboutPage />} />

          <Route path="/reservation" element={<ReservationPage />} />
          <Route path="/reservations" element={<ReservationPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}