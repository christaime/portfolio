import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LanguageProvider } from '../../../src/context/LanguageContext';
import { CVTrainingBlock } from '../../../src/components/cv/CVTrainingBlock';
import { EducationItem } from '../../../src/types';

const mockEducation: EducationItem[] = [
  {
    degree: 'Master of Science in Computer Science',
    institution: 'University of Yaoundé I',
    year: '2014',
    details: 'Specialization in Software Engineering and Distributed Systems.',
  },
];

describe('CVTrainingBlock Component', () => {
  it('renders education and training block', () => {
    render(
      <LanguageProvider>
        <CVTrainingBlock filteredEducation={mockEducation} selectedServiceId="all" />
      </LanguageProvider>
    );

    expect(screen.getByText('Master of Science in Computer Science')).toBeInTheDocument();
    expect(screen.getByText('University of Yaoundé I')).toBeInTheDocument();
  });

  it('renders empty message when no education matches filter', () => {
    render(
      <LanguageProvider>
        <CVTrainingBlock filteredEducation={[]} selectedServiceId="srv-dotnet" />
      </LanguageProvider>
    );

    expect(screen.getByText(/No training\/education entries linked to this specific service/i)).toBeInTheDocument();
  });
});
