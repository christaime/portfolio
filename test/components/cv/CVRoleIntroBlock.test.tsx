import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LanguageProvider } from '../../context/LanguageContext';
import { CVRoleIntroBlock } from './CVRoleIntroBlock';
import { EngineerInfo, ServiceItem } from '../../types';

const mockEngineer: EngineerInfo = {
  name: 'Christelle Mamekem Ngueguim',
  title: 'Senior Software Engineer (.NET C# / Java EE / Angular / DevOps)',
  avatarUrl: '/avatar.jpg',
  email: 'mnchristelle@gmail.com',
  phone: '+237 695 282 983',
  location: 'Limbé, Cameroon',
  remoteAvailable: true,
  introduction: 'Senior Software Engineer with 12+ years experience.',
  github: 'https://github.com',
  linkedin: 'https://linkedin.com',
  stackoverflow: 'https://stackoverflow.com',
};

const mockService: ServiceItem = {
  id: 'srv-dotnet',
  title: '.NET & C# Enterprise Solutions',
  icon: 'code',
  shortDesc: 'RESTful Web APIs with .NET Core.',
  description: 'Custom RESTful Web APIs with .NET Core.',
  features: ['C# .NET Core', 'Entity Framework Core'],
  estimatedDuration: '2-4 weeks',
  baseRate: '€650 / day',
};

describe('CVRoleIntroBlock Component', () => {
  it('renders default role intro when no active service selected', () => {
    render(
      <LanguageProvider>
        <CVRoleIntroBlock
          activeService={undefined}
          selectedServiceId="all"
          setSelectedServiceId={vi.fn()}
          engineer={mockEngineer}
          filteredExperiencesCount={4}
          filteredCertificationsCount={2}
        />
      </LanguageProvider>
    );

    expect(screen.getAllByText(/Senior Software Engineer/i)[0]).toBeInTheDocument();
    expect(screen.getByText('Senior Software Engineer with 12+ years experience.')).toBeInTheDocument();
    expect(screen.getByText('4 Roles')).toBeInTheDocument();
    expect(screen.getByText('2 Badges')).toBeInTheDocument();
  });

  it('renders targeted offer when service is selected and allows resetting view', () => {
    const handleReset = vi.fn();
    render(
      <LanguageProvider>
        <CVRoleIntroBlock
          activeService={mockService}
          selectedServiceId="srv-dotnet"
          setSelectedServiceId={handleReset}
          engineer={mockEngineer}
          filteredExperiencesCount={2}
          filteredCertificationsCount={1}
        />
      </LanguageProvider>
    );

    expect(screen.getByText(/Targeted Offer: .NET & C# Enterprise Solutions/i)).toBeInTheDocument();
    expect(screen.getByText('Custom RESTful Web APIs with .NET Core.')).toBeInTheDocument();

    const resetBtn = screen.getByRole('button', { name: /Reset View/i });
    fireEvent.click(resetBtn);
    expect(handleReset).toHaveBeenCalledWith('all');
  });
});
