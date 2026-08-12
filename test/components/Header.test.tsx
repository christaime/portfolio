import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../../src/context/LanguageContext';
import { Header } from '../../src/components/Header';

describe('Header Component', () => {
  it('renders brand logo and navigation items', () => {
    const handleOpenModal = vi.fn();
    render(
      <LanguageProvider>
        <MemoryRouter>
          <Header onOpenProfileModal={handleOpenModal} />
        </MemoryRouter>
      </LanguageProvider>
    );

    expect(screen.getByText('Portfolio.dev')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /curriculum vitae|cv/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /services/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /projects/i })).toBeInTheDocument();
  });

  it('calls onOpenProfileModal when profile button is clicked', () => {
    const handleOpenModal = vi.fn();
    render(
      <LanguageProvider>
        <MemoryRouter>
          <Header onOpenProfileModal={handleOpenModal} />
        </MemoryRouter>
      </LanguageProvider>
    );

    const profileBtn = screen.getByTitle(/Engineer Overview|Présentation/i);
    fireEvent.click(profileBtn);
    expect(handleOpenModal).toHaveBeenCalledTimes(1);
  });

  it('toggles language when language button is clicked', () => {
    const handleOpenModal = vi.fn();
    render(
      <LanguageProvider>
        <MemoryRouter>
          <Header onOpenProfileModal={handleOpenModal} />
        </MemoryRouter>
      </LanguageProvider>
    );

    const langToggleBtn = screen.getByTitle(/Switch Language/i);
    expect(langToggleBtn).toBeInTheDocument();
    fireEvent.click(langToggleBtn);
  });
});
