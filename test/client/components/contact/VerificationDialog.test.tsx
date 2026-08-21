import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { VerificationDialog } from '@/client/components/contact/VerificationDialog';
import { LanguageProvider } from '@/client/context/LanguageContext';

describe('VerificationDialog Component', () => {
  it('renders nothing when isOpen is false', () => {
    render(
      <LanguageProvider>
        <VerificationDialog
          isOpen={false}
          email="test@company.com"
          onClose={vi.fn()}
          onVerify={vi.fn()}
          onResend={vi.fn()}
        />
      </LanguageProvider>
    );

    expect(screen.queryByText(/Verify Your Email Address/i)).not.toBeInTheDocument();
  });

  it('renders verification modal in English and triggers verify action', async () => {
    localStorage.setItem('portfolio_lang', 'en');
    const handleVerify = vi.fn().mockResolvedValue(undefined);
    const handleClose = vi.fn();
    const handleResend = vi.fn().mockResolvedValue(undefined);

    render(
      <LanguageProvider>
        <VerificationDialog
          isOpen={true}
          email="lead@enterprise.com"
          onClose={handleClose}
          onVerify={handleVerify}
          onResend={handleResend}
        />
      </LanguageProvider>
    );

    expect(screen.getByText('Verify Your Email Address')).toBeInTheDocument();
    expect(screen.getByText('lead@enterprise.com')).toBeInTheDocument();
    expect(screen.getByText('Enter 6-Digit Passcode')).toBeInTheDocument();

    const input = screen.getByPlaceholderText('e.g. 482915');
    fireEvent.change(input, { target: { value: '123456' } });

    const confirmBtn = screen.getByRole('button', { name: /Confirm & Send Message/i });
    fireEvent.click(confirmBtn);

    expect(handleVerify).toHaveBeenCalledWith('123456');
  });

  it('renders in French translation and handles resend button', async () => {
    localStorage.setItem('portfolio_lang', 'fr');
    const handleResend = vi.fn().mockResolvedValue(undefined);

    render(
      <LanguageProvider>
        <VerificationDialog
          isOpen={true}
          email="contact@entreprise.fr"
          onClose={vi.fn()}
          onVerify={vi.fn()}
          onResend={handleResend}
        />
      </LanguageProvider>
    );

    expect(screen.getByText('Vérifiez votre adresse email')).toBeInTheDocument();
    expect(screen.getByText('Entrez le code à 6 chiffres')).toBeInTheDocument();

    const resendBtn = screen.getByRole('button', { name: /Renvoyer le code/i });
    expect(resendBtn).toBeInTheDocument();
    fireEvent.click(resendBtn);
    expect(handleResend).toHaveBeenCalledTimes(1);
  });

  it('displays error message when provided', () => {
    render(
      <LanguageProvider>
        <VerificationDialog
          isOpen={true}
          email="test@company.com"
          onClose={vi.fn()}
          onVerify={vi.fn()}
          onResend={vi.fn()}
          error="Invalid verification passcode"
        />
      </LanguageProvider>
    );

    expect(screen.getByText('Invalid verification passcode')).toBeInTheDocument();
  });
});
