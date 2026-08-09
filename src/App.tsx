import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { EngineerOverviewModal } from './components/EngineerOverviewModal';

import { ContactPage } from './pages/ContactPage';
import { CVPage } from './pages/CVPage';
import { ServicesPage } from './pages/ServicesPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { BlogListPage } from './pages/blog/BlogListPage';
import { BlogPostDetailPage } from './pages/blog/BlogPostDetailPage';

export function AppContent() {
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  return (
    <div className="bg-background text-on-background font-body-md antialiased min-h-screen flex flex-col selection:bg-secondary-container selection:text-on-secondary-container">
      {/* Top Header Navigation */}
      <Header onOpenProfileModal={() => setProfileModalOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-grow pt-24 pb-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
        <Routes>
          <Route path="/" element={<Navigate to="/cv" replace />} />
          <Route path="/cv" element={<CVPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blog/:slug" element={<BlogPostDetailPage />} />
          <Route path="*" element={<Navigate to="/cv" replace />} />
        </Routes>
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Overview Modal */}
      <EngineerOverviewModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </LanguageProvider>
  );
}
