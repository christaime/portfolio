import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LanguageProvider } from '@/client/context/LanguageContext';
import { CVTechStackBlock } from '@/client/components/cv/CVTechStackBlock';
import { SkillCategory } from '@/client/types';

const mockSkillCategories: SkillCategory[] = [
  {
    category: 'Backend & Frameworks',
    skills: [
      { name: 'C# / .NET Core', level: 'Expert', years: '10+ yrs', linkedServices: ['srv-dotnet'] },
      { name: 'Java 17 / Spring Boot', level: 'Expert', years: '8+ yrs', linkedServices: ['srv-java'] },
    ],
  },
];

describe('CVTechStackBlock Component', () => {
  it('renders skill categories and skills', () => {
    const handleSetSearch = vi.fn();
    render(
      <LanguageProvider>
        <CVTechStackBlock
          skillCategories={mockSkillCategories}
          skillSearch=""
          setSkillSearch={handleSetSearch}
          selectedServiceId="all"
          isItemLinkedToService={() => true}
        />
      </LanguageProvider>
    );

    expect(screen.getByText('Backend & Frameworks')).toBeInTheDocument();
    expect(screen.getByText('C# / .NET Core')).toBeInTheDocument();
    expect(screen.getByText('Java 17 / Spring Boot')).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(/Search skills/i);
    fireEvent.change(searchInput, { target: { value: 'Java' } });
    expect(handleSetSearch).toHaveBeenCalledWith('Java');
  });
});
