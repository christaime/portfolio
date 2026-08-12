import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../../src/context/LanguageContext';
import { EngineerOverviewModal } from '../../src/components/EngineerOverviewModal';
import { EngineerInfo } from '../../src/types';

const mockEngineer: EngineerInfo = {
  name: 'Christelle Mamekem Ngueguim',
  title: 'Senior Software Engineer',
  avatarUrl: '/avatar.jpg',
  email: 'mnchristelle@gmail.com',
  phone: '+237 695 282 983',
  location: 'Limbé, Cameroon',
  remoteAvailable: true,
  introduction: 'Senior Software Engineer with experience in .NET, Java, and Angular.',
  github: 'https://github.com',
  linkedin: 'https://linkedin.com',
  stackoverflow: 'https://stackoverflow.com',
};

describe('EngineerOverviewModal Component', () => {
  it('does not render when isOpen is false', () => {
    render(
      <LanguageProvider>
        <MemoryRouter>
          <EngineerOverviewModal isOpen={false} onClose={vi.fn()} engineer={mockEngineer} />
        </MemoryRouter>
      </LanguageProvider>
    );

    expect(screen.queryByText('Christelle Mamekem Ngueguim')).not.toBeInTheDocument();
  });

  it('renders modal header and content when isOpen is true', () => {
    render(
      <LanguageProvider>
        <MemoryRouter>
          <EngineerOverviewModal isOpen={true} onClose={vi.fn()} engineer={mockEngineer} />
        </MemoryRouter>
      </LanguageProvider>
    );

    expect(screen.getByText('Christelle Mamekem Ngueguim')).toBeInTheDocument();
    expect(screen.getByText(/Senior Software Engineer/i)).toBeInTheDocument();
  });

  it('triggers onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <LanguageProvider>
        <MemoryRouter>
          <EngineerOverviewModal isOpen={true} onClose={handleClose} engineer={mockEngineer} />
        </MemoryRouter>
      </LanguageProvider>
    );

    const closeBtn = screen.getByRole('button', { name: /Close|Fermer/i });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
