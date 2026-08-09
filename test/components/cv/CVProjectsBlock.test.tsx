import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LanguageProvider } from '../../context/LanguageContext';
import { CVProjectsBlock } from './CVProjectsBlock';
import { Project } from '../../types';

const mockProjects: Project[] = [
  {
    id: 'proj-peppol',
    title: 'PEPPOL E-Invoicing Engine',
    category: 'Enterprise Integration',
    description: 'Compliant PEPPOL network integration.',
    skills: ['Java 17', 'Spring Boot'],
    featured: true,
  },
];

describe('CVProjectsBlock Component', () => {
  it('renders list of projects', () => {
    render(
      <LanguageProvider>
        <CVProjectsBlock filteredProjects={mockProjects} selectedServiceId="all" />
      </LanguageProvider>
    );

    expect(screen.getByText('PEPPOL E-Invoicing Engine')).toBeInTheDocument();
  });

  it('renders null when filteredProjects is empty', () => {
    const { container } = render(
      <LanguageProvider>
        <CVProjectsBlock filteredProjects={[]} selectedServiceId="all" />
      </LanguageProvider>
    );

    expect(container.firstChild).toBeNull();
  });
});
