import { Navigate, Route, Routes } from 'react-router-dom';

import MainLayouts from '@/app/layouts/MainLayouts';
import HomePage from '@/pages/Home';
import MenuPage from '@/pages/Menu';
import BranchesPage from '@/pages/Branches';
import ToulKorkPage from '@/pages/Branches/ToukKork/ToulKork';
import BoeungKakPage from '@/pages/Branches/BoeungKak/BoeungKak';
import GalleryPage from '@/pages/Gallery';
import EventsPage from '@/pages/Events';
import AboutPage from '@/pages/About';
import ReservationPage from '@/pages/Reservations';
import CareersPage from '@/pages/Careers';
import ContactPage from '@/pages/Contact';
import TermsPage from '@/pages/Terms';

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayouts />}>
        <Route index element={<HomePage />} />

        <Route
          path="/menu"
          element={<MenuPage />}
        />
        <Route path="/restaurants" element={<Navigate to="/branches" replace />} />
        <Route path="/restaurants/toul-kork" element={<Navigate to="/branches/toul-kork" replace />} />
        <Route path="/restaurants/boeung-kak" element={<Navigate to="/branches/boeung-kak" replace />} />
        <Route
          path="/branches"
          element={<BranchesPage />}
        />
        <Route
          path="/branches/toul-kork"
          element={<ToulKorkPage />}
        />
        <Route
          path="/branches/boeung-kak"
          element={<BoeungKakPage />}
        />
        <Route
          path="/gallery"
          element={<GalleryPage />}
        />
        <Route
          path="/events"
          element={<EventsPage />}
        />
        <Route
          path="/about"
          element={<AboutPage />}
        />

        <Route
          path="/careers"
          element={<CareersPage />}
        />
        <Route
          path="/contact"
          element={<ContactPage />}
        />

        <Route
          path="/terms"
          element={<TermsPage />}
        />

        <Route
          path="/reservation"
          element={<ReservationPage />}
        />
        <Route
          path="/reservations"
          element={<ReservationPage />}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
