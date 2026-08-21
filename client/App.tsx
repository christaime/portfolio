import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CVPage } from './pages/CVPage';
import { ServicesPage } from './pages/ServicesPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ContactPage } from './pages/ContactPage';
import { BlogListPage } from './pages/blog/BlogListPage';
import { BlogPostDetailPage } from './pages/blog/BlogPostDetailPage';
import { RequestCallModal } from './components/contact/RequestCallModal';

const MainLayout: React.FC = () => {
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#051424] text-[#d4e4fa]">
      <Header
        onOpenCallModal={() => setIsCallModalOpen(true)}
      />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<CVPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blog/:slug" element={<BlogPostDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      {/* Global Advisory Call Modal */}
      <RequestCallModal
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <BrowserRouter>
          <MainLayout />
        </BrowserRouter>
      </LanguageProvider>
    </ErrorBoundary>
  );
};

export default App;
