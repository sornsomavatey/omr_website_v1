import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CmsLanguageProvider } from './context/CmsLanguageContext';
import { AdminLayout } from './components/AdminLayout';
import { AdminDashboard } from './pages/AdminDashboard';
import { WebsitePages } from './pages/WebsitePages';
import { HomeEditor } from './pages/HomeEditor';
import { MenuEditor } from './pages/MenuEditor';
import { HeaderEditor } from './pages/HeaderEditor';
import { FooterEditor } from './pages/FooterEditor';
import { BranchesEditor } from './pages/BranchesEditor';
import { GalleryEditor } from './pages/GalleryEditor';
import { TestimonialsEditor } from './pages/TestimonialsEditor';
import { EventsEditor } from './pages/EventsEditor';
import { TranslationsEditor } from './pages/TranslationsEditor';

import { ReservationsEditor } from './pages/Reservations';
import { ReservationsContentEditor } from './pages/ReservationsContentEditor';
import { AboutEditor } from './pages/AboutEditor';
import { TermsEditor } from './pages/TermsEditor';

export default function App() {
  return (
    <CmsLanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="pages" element={<WebsitePages />} />
            <Route path="home" element={<HomeEditor />} />
            <Route path="menu" element={<MenuEditor />} />
            <Route path="header" element={<HeaderEditor />} />
            <Route path="footer" element={<FooterEditor />} />
            <Route path="reservations" element={<ReservationsEditor />} />
            <Route path="reservations-editor" element={<ReservationsContentEditor />} />
            <Route path="branches" element={<BranchesEditor />} />
            <Route path="gallery" element={<GalleryEditor />} />
            <Route path="about" element={<AboutEditor />} />
            <Route path="terms" element={<TermsEditor />} />
            <Route path="events" element={<EventsEditor />} />
            <Route path="testimonials" element={<TestimonialsEditor />} />
            <Route path="translations" element={<TranslationsEditor />} />
            <Route path="*" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CmsLanguageProvider>
  );
}
