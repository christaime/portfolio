import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LanguageProvider } from '@/client/context/LanguageContext';
import { CVExperienceBlock } from '@/client/components/cv/CVExperienceBlock';
import { WorkExperience } from '@/client/types';

const mockExperiences: WorkExperience[] = [
  {
    id: 'exp-1',
    role: 'Senior Software Developer',
    company: 'Groupe Baotec',
    location: 'Remote',
    period: '06/2025 - 03/2026',
    description: 'Architected PEPPOL e-invoicing integrations.',
    achievements: ['Engineered Angular 18 reactive frontends.'],
    technologies: ['Angular', 'Spring Boot'],
  },
];

describe('CVExperienceBlock Component', () => {
  it('renders list of experience items', () => {
    render(
      <LanguageProvider>
        <CVExperienceBlock filteredExperiences={mockExperiences} selectedServiceId="all" />
      </LanguageProvider>
    );

    expect(screen.getByText('Senior Software Developer')).toBeInTheDocument();
    expect(screen.getByText('Groupe Baotec')).toBeInTheDocument();
  });

  it('renders empty message when no experiences match filter', () => {
    render(
      <LanguageProvider>
        <CVExperienceBlock filteredExperiences={[]} selectedServiceId="srv-devops" />
      </LanguageProvider>
    );

    expect(screen.getByText(/No work experience entries linked to this specific service/i)).toBeInTheDocument();
  });
});
