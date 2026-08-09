import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CVExperienceItem } from './CVExperienceItem';
import { WorkExperience } from '../../types';

const mockExperience: WorkExperience = {
  id: 'exp-1',
  role: 'Senior Software Developer',
  company: 'Groupe Baotec',
  companyUrl: 'https://www.baotec.com/',
  location: 'Remote',
  period: '06/2025 - 03/2026',
  description: 'Architected PEPPOL e-invoicing integrations.',
  achievements: ['Engineered Angular 18 reactive frontends.', 'Built Spring Boot microservices.'],
  technologies: ['Angular', 'Spring Boot', 'Java 17', 'PEPPOL'],
};

describe('CVExperienceItem Component', () => {
  it('renders role, company with link, location, period and skills', () => {
    render(<CVExperienceItem experience={mockExperience} />);

    expect(screen.getByText('Senior Software Developer')).toBeInTheDocument();
    expect(screen.getByText('Groupe Baotec')).toBeInTheDocument();
    expect(screen.getByText(/Remote/i)).toBeInTheDocument();
    expect(screen.getByText('06/2025 - 03/2026')).toBeInTheDocument();
    expect(screen.getByText('Architected PEPPOL e-invoicing integrations.')).toBeInTheDocument();
    expect(screen.getByText('Engineered Angular 18 reactive frontends.')).toBeInTheDocument();
    expect(screen.getByText('PEPPOL')).toBeInTheDocument();

    const link = screen.getByRole('link', { name: /Groupe Baotec/i });
    expect(link).toHaveAttribute('href', 'https://www.baotec.com/');
  });
});
