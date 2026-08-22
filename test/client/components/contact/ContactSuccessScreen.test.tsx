import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ContactSuccessScreen } from '@/client/components/contact/ContactSuccessScreen';
import { LanguageProvider } from '@/client/context/LanguageContext';

describe('ContactSuccessScreen Component', () => {
  it('renders success message with sender details in English', () => {
    localStorage.setItem('portfolio_lang', 'en');
    const handleReset = vi.fn();

    render(
      <LanguageProvider>
        <ContactSuccessScreen
          senderName="Alice Tech"
          senderEmail="alice@techcorp.io"
          onReset={handleReset}
        />
      </LanguageProvider>
    );

    expect(screen.getByText('Message Dispatched Successfully!')).toBeInTheDocument();
    expect(screen.getByText('alice@techcorp.io')).toBeInTheDocument();
    expect(screen.getByText(/Alice Tech/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send Another Message/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Send Another Message/i }));
    expect(handleReset).toHaveBeenCalledTimes(1);
  });

  it('renders localized messages in French', () => {
    localStorage.setItem('portfolio_lang', 'fr');
    const handleReset = vi.fn();

    render(
      <LanguageProvider>
        <ContactSuccessScreen
          senderName="Jean Dupont"
          senderEmail="jean@dupont.fr"
          onReset={handleReset}
        />
      </LanguageProvider>
    );

    expect(screen.getByText('Message envoyé avec succès !')).toBeInTheDocument();
    expect(screen.getByText('jean@dupont.fr')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Envoyer un autre message/i })).toBeInTheDocument();
  });
});
