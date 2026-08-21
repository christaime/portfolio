import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LanguageProvider } from '@/client/context/LanguageContext';
import { CVCertificationsBlock } from '@/client/components/cv/CVCertificationsBlock';
import { CertificationItem } from '@/client/types';

const mockCertifications: CertificationItem[] = [
  {
    id: 'cert-1',
    name: 'Microsoft Certified: Azure Developer Associate',
    issuer: 'Microsoft',
    year: '2023',
    credentialId: 'AZ-204-12345',
    icon: 'cloud',
  },
];

describe('CVCertificationsBlock Component', () => {
  it('renders list of certifications', () => {
    render(
      <LanguageProvider>
        <CVCertificationsBlock filteredCertifications={mockCertifications} selectedServiceId="all" />
      </LanguageProvider>
    );

    expect(screen.getByText('Microsoft Certified: Azure Developer Associate')).toBeInTheDocument();
    expect(screen.getByText('Microsoft')).toBeInTheDocument();
    expect(screen.getByText(/Year: 2023/i)).toBeInTheDocument();
  });

  it('renders empty message when no certifications match filter', () => {
    render(
      <LanguageProvider>
        <CVCertificationsBlock filteredCertifications={[]} selectedServiceId="srv-dotnet" />
      </LanguageProvider>
    );

    expect(screen.getByText(/No certifications linked to this specific service/i)).toBeInTheDocument();
  });
});
