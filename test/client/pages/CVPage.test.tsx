import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '@/client/context/LanguageContext';
import { CVPage } from '@/client/pages/CVPage';

describe('CVPage', () => {
  it('renders CV page blocks after loading data', async () => {
    render(
      <LanguageProvider>
        <MemoryRouter>
          <CVPage />
        </MemoryRouter>
      </LanguageProvider>
    );

    await waitFor(() => {
      expect(screen.getAllByText('Christelle Mamekem Ngueguim')[0]).toBeInTheDocument();
    });

    expect(screen.getAllByText(/Senior Software Engineer/i)[0]).toBeInTheDocument();
    expect(screen.getByText('Groupe Baotec')).toBeInTheDocument();
  });
});
