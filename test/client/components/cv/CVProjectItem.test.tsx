import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LanguageProvider } from '@/client/context/LanguageContext';
import { CVProjectItem } from '@/client/components/cv/CVProjectItem';
import { Project } from '@/client/types';

const mockProject: Project = {
  id: 'proj-peppol',
  title: 'PEPPOL E-Invoicing Engine',
  category: 'Enterprise Integration / Fintech',
  description: 'Compliant PEPPOL network access point integration.',
  longDescription: 'Engineered an automated e-invoicing pipeline adhering to UBL 2.1 specs.',
  skills: ['Java 17', 'Spring Boot', 'UBL 2.1', 'AS4 Protocol'],
  featured: true,
  sourceUrl: 'https://github.com/example/peppol',
};

describe('CVProjectItem Component', () => {
  it('renders project title, category, description, and skills', () => {
    render(
      <LanguageProvider>
        <CVProjectItem project={mockProject} />
      </LanguageProvider>
    );

    expect(screen.getByText('PEPPOL E-Invoicing Engine')).toBeInTheDocument();
    expect(screen.getByText('Enterprise Integration / Fintech')).toBeInTheDocument();
    expect(screen.getByText(/Engineered an automated e-invoicing pipeline/i)).toBeInTheDocument();
    expect(screen.getByText('UBL 2.1')).toBeInTheDocument();
    expect(screen.getByText(/Featured|En vedette/i)).toBeInTheDocument();

    const codeRepoLink = screen.getByRole('link', { name: /Source Code|Code source|Code Repo/i });
    expect(codeRepoLink).toHaveAttribute('href', 'https://github.com/example/peppol');
  });
});
