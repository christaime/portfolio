import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ContactDirectInfo } from '@/client/components/contact/ContactDirectInfo';
import { LanguageProvider } from '@/client/context/LanguageContext';
import { EngineerInfo } from '@/client/types';

const mockEngineer: EngineerInfo = {
  name: 'Christelle Mamekem Ngueguim',
  title: 'Senior Software Engineer',
  avatarUrl: '/avatar.jpg',
  email: 'test.engineer@example.com',
  phone: '+237 600 000 000',
  location: 'Douala, Cameroon',
  remoteAvailable: true,
  introduction: 'Senior Engineer',
  github: 'https://github.com/christaime',
  linkedin: 'https://linkedin.com',
};

describe('ContactDirectInfo Component', () => {
  it('renders contact details with custom engineer data in English', () => {
    localStorage.setItem('portfolio_lang', 'en');
    render(
      <LanguageProvider>
        <ContactDirectInfo engineer={mockEngineer} />
      </LanguageProvider>
    );

    expect(screen.getByText('Direct & Consulting Channels')).toBeInTheDocument();
    expect(screen.getByText('Immediate Availability')).toBeInTheDocument();
    expect(screen.getByText('test.engineer@example.com')).toBeInTheDocument();
    expect(screen.getByText('+237 600 000 000')).toBeInTheDocument();
    expect(screen.getByText('Douala, Cameroon')).toBeInTheDocument();
    expect(screen.getByText('Anti-Abuse & Rate Limiting')).toBeInTheDocument();
  });

  it('renders correctly in French translation', () => {
    localStorage.setItem('portfolio_lang', 'fr');
    render(
      <LanguageProvider>
        <ContactDirectInfo engineer={mockEngineer} />
      </LanguageProvider>
    );

    expect(screen.getByText('Canaux Directs & Conseil')).toBeInTheDocument();
    expect(screen.getByText('Disponibilité Immédiate')).toBeInTheDocument();
    expect(screen.getByText('Email Direct')).toBeInTheDocument();
    expect(screen.getByText('Téléphone / WhatsApp')).toBeInTheDocument();
    expect(screen.getByText('Localisation Principale')).toBeInTheDocument();
    expect(screen.getByText('Protection Anti-Abus & Limitation de Débit')).toBeInTheDocument();
  });

  it('falls back to default contact information when engineer prop is omitted', () => {
    localStorage.setItem('portfolio_lang', 'en');
    render(
      <LanguageProvider>
        <ContactDirectInfo />
      </LanguageProvider>
    );

    expect(screen.getByText('mnchristelle@gmail.com')).toBeInTheDocument();
    expect(screen.getByText('+237 695 282 983')).toBeInTheDocument();
  });
});
