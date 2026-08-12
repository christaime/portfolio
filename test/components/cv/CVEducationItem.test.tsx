import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CVEducationItem } from '../../../src/components/cv/CVEducationItem';
import { EducationItem } from '../../../src/types';

const mockEducation: EducationItem = {
  degree: 'Master of Science in Computer Science',
  institution: 'University of Yaoundé I',
  year: '2014',
  details: 'Specialization in Software Engineering and Distributed Systems.',
};

describe('CVEducationItem Component', () => {
  it('renders degree, institution, details, and year', () => {
    render(<CVEducationItem education={mockEducation} />);

    expect(screen.getByText('Master of Science in Computer Science')).toBeInTheDocument();
    expect(screen.getByText('University of Yaoundé I')).toBeInTheDocument();
    expect(screen.getByText('Specialization in Software Engineering and Distributed Systems.')).toBeInTheDocument();
    expect(screen.getByText('2014')).toBeInTheDocument();
  });
});
