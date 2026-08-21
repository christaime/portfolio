import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RequestCallModal } from '@/client/components/contact/RequestCallModal';
import { LanguageProvider } from '@/client/context/LanguageContext';
import { emailService } from '@/client/services/emailService';

vi.mock('@/client/services/emailService', () => ({
  emailService: {
    sendEmail: vi.fn(),
  },
}));

describe('RequestCallModal Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when isOpen is false', () => {
    render(
      <LanguageProvider>
        <RequestCallModal isOpen={false} onClose={vi.fn()} />
      </LanguageProvider>
    );

    expect(screen.queryByText(/Schedule Technical Advisory Call/i)).not.toBeInTheDocument();
  });

  it('renders modal in English and handles successful form submission', async () => {
    localStorage.setItem('portfolio_lang', 'en');
    const handleClose = vi.fn();
    vi.mocked(emailService.sendEmail).mockResolvedValueOnce({
      success: true,
      message: 'Email sent successfully',
    });

    render(
      <LanguageProvider>
        <RequestCallModal isOpen={true} onClose={handleClose} />
      </LanguageProvider>
    );

    expect(screen.getByText('Schedule Technical Advisory Call')).toBeInTheDocument();
    expect(screen.getByText('Your Name')).toBeInTheDocument();
    expect(screen.getByText('Work Email')).toBeInTheDocument();
    expect(screen.getByText('Consulting Topic')).toBeInTheDocument();
    expect(screen.getByText('Preferred Date')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('Alice Smith'), {
      target: { value: 'Sarah Connor' },
    });
    fireEvent.change(screen.getByPlaceholderText('alice@company.com'), {
      target: { value: 'sarah@skynet-resilience.io' },
    });
    fireEvent.change(screen.getByPlaceholderText('e.g. Next Tuesday morning'), {
      target: { value: 'Thursday 2 PM' },
    });

    const submitBtn = screen.getByRole('button', { name: /Confirm Advisory Session/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(emailService.sendEmail).toHaveBeenCalledWith({
        name: 'Sarah Connor',
        email: 'sarah@skynet-resilience.io',
        subject: expect.stringContaining('[Advisory Call Request]'),
        message: expect.stringContaining('Thursday 2 PM'),
      });
    });

    await waitFor(() => {
      expect(screen.getByText('Advisory Call Requested!')).toBeInTheDocument();
      expect(screen.getByText('sarah@skynet-resilience.io')).toBeInTheDocument();
    });

    const closeBtn = screen.getByRole('button', { name: /Close Window/i });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('renders localized modal in French', () => {
    localStorage.setItem('portfolio_lang', 'fr');
    render(
      <LanguageProvider>
        <RequestCallModal isOpen={true} onClose={vi.fn()} />
      </LanguageProvider>
    );

    expect(screen.getByText('Planifier un Appel de Conseil Technique')).toBeInTheDocument();
    expect(screen.getByText('Votre Nom')).toBeInTheDocument();
    expect(screen.getByText('Email Professionnel')).toBeInTheDocument();
    expect(screen.getByText('Sujet du Conseil')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Confirmer la Session/i })).toBeInTheDocument();
  });
});
