import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../context/LanguageContext';
import { Footer } from './Footer';

describe('Footer Component', () => {
  it('renders footer brand logo and external links', () => {
    render(
      <LanguageProvider>
        <MemoryRouter>
          <Footer />
        </MemoryRouter>
      </LanguageProvider>
    );

    expect(screen.getByText('Portfolio.dev')).toBeInTheDocument();
    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getByText('LinkedIn')).toBeInTheDocument();
    expect(screen.getByText('Stack Overflow')).toBeInTheDocument();
  });
});
