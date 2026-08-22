import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LanguageProvider } from '@/client/context/LanguageContext';
import { CVSidebar } from '@/client/components/cv/CVSidebar';
import { EngineerInfo, ServiceItem } from '@/client/types';

const mockEngineer: EngineerInfo = {
  name: 'Christelle Mamekem Ngueguim',
  title: 'Senior Software Engineer',
  avatarUrl: '/avatar.jpg',
  email: 'mnchristelle@gmail.com',
  phone: '+237 695 282 983',
  location: 'Limbé, Cameroon',
  remoteAvailable: true,
  introduction: 'Senior Software Engineer.',
  github: 'https://github.com',
  linkedin: 'https://linkedin.com',
  stackoverflow: 'https://stackoverflow.com',
};

const mockServices: ServiceItem[] = [
  {
    id: 'srv-dotnet',
    title: '.NET & C# Enterprise Solutions',
    icon: 'code',
    shortDesc: 'Custom RESTful Web APIs.',
    description: 'Custom RESTful Web APIs.',
    features: ['C# .NET Core'],
    estimatedDuration: '2 weeks',
    baseRate: '€650/day',
  },
];

describe('CVSidebar Component', () => {
  it('renders engineer sidebar info, contact details, and service filters', () => {
    const handleSelectService = vi.fn();
    render(
      <LanguageProvider>
        <CVSidebar
          engineer={mockEngineer}
          services={mockServices}
          selectedServiceId="all"
          setSelectedServiceId={handleSelectService}
        />
      </LanguageProvider>
    );

    expect(screen.getByText('Christelle Mamekem Ngueguim')).toBeInTheDocument();
    expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Limbé, Cameroon')).toBeInTheDocument();
    expect(screen.getByText('mnchristelle@gmail.com')).toBeInTheDocument();
    expect(screen.getByText('.NET & C# Enterprise Solutions')).toBeInTheDocument();

    const serviceBtn = screen.getByText('.NET & C# Enterprise Solutions');
    fireEvent.click(serviceBtn);
    expect(handleSelectService).toHaveBeenCalledWith('srv-dotnet');
  });

  it('triggers onOpenPdfModal when PDF button is clicked in sidebar', () => {
    const handleOpenPdf = vi.fn();
    render(
      <LanguageProvider>
        <CVSidebar
          engineer={mockEngineer}
          services={mockServices}
          selectedServiceId="all"
          setSelectedServiceId={vi.fn()}
          onOpenPdfModal={handleOpenPdf}
        />
      </LanguageProvider>
    );

    const pdfBtn = screen.getByRole('button', { name: /pdf cv/i });
    expect(pdfBtn).toBeInTheDocument();
    fireEvent.click(pdfBtn);
    expect(handleOpenPdf).toHaveBeenCalledTimes(1);
  });
});
