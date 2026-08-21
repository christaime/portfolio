import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { LanguageProvider } from '@/client/context/LanguageContext';
import { BlogPostDetailPage } from '@/client/pages/blog/BlogPostDetailPage';

describe('BlogPostDetailPage', () => {
  it('renders blog post details when slug matches', async () => {
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={['/blog/zero-flicker-spas-hydration']}>
          <Routes>
            <Route path="/blog/:slug" element={<BlogPostDetailPage />} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Architecting Zero-Flicker SPAs in 2026: Modern Hydration Patterns')).toBeInTheDocument();
    });

    expect(screen.getByText(/How to achieve instant layout stability/i)).toBeInTheDocument();
  });
});
