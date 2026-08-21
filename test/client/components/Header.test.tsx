import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '@/client/context/LanguageContext';
import { Header } from '@/client/components/Header';

describe('Header Component', () => {
  it('renders brand logo and navigation items without overview button or header version badge', () => {
    const handleOpenCall = vi.fn();
    render(
      <LanguageProvider>
        <MemoryRouter>
          <Header onOpenCallModal={handleOpenCall} />
        </MemoryRouter>
      </LanguageProvider>
    );

    expect(screen.getByText('Portfolio.dev')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /cv & experience|cv/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /services/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /projects/i })).toBeInTheDocument();
    expect(screen.queryByTitle(/overview/i)).not.toBeInTheDocument();
  });

  it('renders language select and allows switching language', () => {
    render(
      <LanguageProvider>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </LanguageProvider>
    );

    const langSelect = screen.getByTestId('language-select') as HTMLSelectElement;
    expect(langSelect).toBeInTheDocument();
    expect(langSelect.value).toBe('en');

    fireEvent.change(langSelect, { target: { value: 'fr' } });
    expect(langSelect.value).toBe('fr');
  });
});
