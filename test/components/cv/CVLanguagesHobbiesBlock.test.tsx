import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LanguageProvider } from '../../../src/context/LanguageContext';
import { CVLanguagesHobbiesBlock } from '../../../src/components/cv/CVLanguagesHobbiesBlock';
import { SpokenLanguage, Hobby } from '../../../src/types';

const mockLanguages: SpokenLanguage[] = [
  { name: 'French', level: 'Native / Bilingual', flag: '🇫🇷' },
  { name: 'English', level: 'Professional Working Proficiency', flag: '🇬🇧' },
];

const mockHobbies: Hobby[] = [
  {
    name: 'Open Source & Tech Blogging',
    category: 'Technology',
    description: 'Writing technical posts on software architecture.',
    icon: 'menu_book',
  },
];

describe('CVLanguagesHobbiesBlock Component', () => {
  it('renders spoken languages and hobbies', () => {
    render(
      <LanguageProvider>
        <CVLanguagesHobbiesBlock languages={mockLanguages} hobbies={mockHobbies} />
      </LanguageProvider>
    );

    expect(screen.getByText('French')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Open Source & Tech Blogging')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
  });
});
