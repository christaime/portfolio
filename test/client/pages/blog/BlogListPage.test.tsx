import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '@/client/context/LanguageContext';
import { BlogListPage } from '@/client/pages/blog/BlogListPage';

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
      expect(
        screen.getByText('Angular Signals: A New Era of Reactivity, But RxJS Still Reigns for APIs')
      ).toBeInTheDocument();
    });
  });
});
