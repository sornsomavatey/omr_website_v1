import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CmsLanguageProvider } from './context/CmsLanguageContext';
import { AdminLayout } from './components/AdminLayout';
import { AdminDashboard } from './pages/AdminDashboard';
import { HomeEditor } from './pages/HomeEditor';
import { MenuEditor } from './pages/MenuEditor';
import { EventsEditor } from './pages/EventsEditor';
import { BranchesEditor } from './pages/BranchesEditor';
import { GalleryEditor } from './pages/GalleryEditor';
import { TestimonialsEditor } from './pages/TestimonialsEditor';
import { TranslationsEditor } from './pages/TranslationsEditor';

export default function App() {
  return (
    <CmsLanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="home" element={<HomeEditor />} />
            <Route path="menu" element={<MenuEditor />} />
            <Route path="events" element={<EventsEditor />} />
            <Route path="branches" element={<BranchesEditor />} />
            <Route path="gallery" element={<GalleryEditor />} />
            <Route path="testimonials" element={<TestimonialsEditor />} />
            <Route path="translations" element={<TranslationsEditor />} />
            <Route path="*" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CmsLanguageProvider>
  );
}
