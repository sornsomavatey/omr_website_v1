import { lazy, Suspense, type ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import MainLayouts from '@/app/layouts/MainLayouts';
import HomePage from '@/pages/Home';

const MenuPage = lazy(() => import('@/pages/Menu'));
const BranchesPage = lazy(() => import('@/pages/Branches'));
const ToulKorkPage = lazy(() => import('@/pages/Branches/ToukKork/ToulKork'));
const BoeungKakPage = lazy(() => import('@/pages/Branches/BoeungKak/BoeungKak'));
const GalleryPage = lazy(() => import('@/pages/Gallery'));
const EventsPage = lazy(() => import('@/pages/Events'));
const AboutPage = lazy(() => import('@/pages/About'));
const ReservationPage = lazy(() => import('@/pages/Reservations'));
const CareersPage = lazy(() => import('@/pages/Careers'));
const ContactPage = lazy(() => import('@/pages/Contact'));

function LazyRoute({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen" aria-hidden="true" />}>
      {children}
    </Suspense>
  );
}

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayouts />}>
        <Route index element={<HomePage />} />

        <Route
          path="/menu"
          element={
            <LazyRoute>
              <MenuPage />
            </LazyRoute>
          }
        />
        <Route path="/restaurants" element={<Navigate to="/branches" replace />} />
        <Route path="/restaurants/toul-kork" element={<Navigate to="/branches/toul-kork" replace />} />
        <Route path="/restaurants/boeung-kak" element={<Navigate to="/branches/boeung-kak" replace />} />
        <Route
          path="/branches"
          element={
            <LazyRoute>
              <BranchesPage />
            </LazyRoute>
          }
        />
        <Route
          path="/branches/toul-kork"
          element={
            <LazyRoute>
              <ToulKorkPage />
            </LazyRoute>
          }
        />
        <Route
          path="/branches/boeung-kak"
          element={
            <LazyRoute>
              <BoeungKakPage />
            </LazyRoute>
          }
        />
        <Route
          path="/gallery"
          element={
            <LazyRoute>
              <GalleryPage />
            </LazyRoute>
          }
        />
        <Route
          path="/events"
          element={
            <LazyRoute>
              <EventsPage />
            </LazyRoute>
          }
        />
        <Route
          path="/about"
          element={
            <LazyRoute>
              <AboutPage />
            </LazyRoute>
          }
        />

        <Route
          path="/careers"
          element={
            <LazyRoute>
              <CareersPage />
            </LazyRoute>
          }
        />
        <Route
          path="/contact"
          element={
            <LazyRoute>
              <ContactPage />
            </LazyRoute>
          }
        />

        <Route
          path="/reservation"
          element={
            <LazyRoute>
              <ReservationPage />
            </LazyRoute>
          }
        />
        <Route
          path="/reservations"
          element={
            <LazyRoute>
              <ReservationPage />
            </LazyRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
