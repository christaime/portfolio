import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../../src/context/LanguageContext';
import { ServicesPage } from '../../src/pages/ServicesPage';

describe('ServicesPage', () => {
  it('renders services list', async () => {
    render(
      <LanguageProvider>
        <MemoryRouter>
          <ServicesPage />
        </MemoryRouter>
      </LanguageProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Backend Engineer (.NET / Java Spring Boot)')).toBeInTheDocument();
    });

    expect(screen.getByText('Frontend Engineer (Angular / React)')).toBeInTheDocument();
  });
});
