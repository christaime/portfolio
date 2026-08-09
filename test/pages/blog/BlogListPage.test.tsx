import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../../context/LanguageContext';
import { BlogListPage } from './BlogListPage';

describe('BlogListPage', () => {
  it('renders blog post articles list', async () => {
    render(
      <LanguageProvider>
        <MemoryRouter>
          <BlogListPage />
        </MemoryRouter>
      </LanguageProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Architecting Zero-Flicker SPAs in 2026: Modern Hydration Patterns')).toBeInTheDocument();
    });
  });
});
