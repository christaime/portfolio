import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../context/LanguageContext';
import { ProjectsPage } from './ProjectsPage';

describe('ProjectsPage', () => {
  it('renders projects grid', async () => {
    render(
      <LanguageProvider>
        <MemoryRouter>
          <ProjectsPage />
        </MemoryRouter>
      </LanguageProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/PEPPOL International E-Invoicing Engine/i)).toBeInTheDocument();
    });
  });
});
