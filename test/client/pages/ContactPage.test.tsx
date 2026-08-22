import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '@/client/context/LanguageContext';
import { ContactPage } from '@/client/pages/ContactPage';

vi.mock('@/client/services/emailService', () => ({
  emailService: {
    checkEmailStatus: vi.fn().mockResolvedValue({ success: true, isVerified: false }),
    sendVerificationCode: vi.fn().mockResolvedValue({ success: true, isVerified: false }),
    verifyCode: vi.fn().mockResolvedValue({ success: true, isVerified: true }),
    sendContactEmail: vi.fn().mockResolvedValue({ success: true, isVerifiedCached: true }),
  },
}));

let mockCaptchaCallback: ((token: string) => void) | null = null;

vi.mock('@/client/components/contact/ContactCaptcha', () => ({
  ContactCaptcha: ({ onVerify, isVerified, required }: any) => {
    mockCaptchaCallback = onVerify;
    return (
      <div data-testid="mock-captcha">
        <label>
          <input
            type="checkbox"
            data-testid="mock-captcha-checkbox"
            required={required}
            checked={Boolean(isVerified)}
            onChange={(e) => onVerify(e.target.checked ? 'mock_recaptcha_token' : '')}
          />
          reCAPTCHA
        </label>
      </div>
    );
  },
}));

describe('ContactPage', () => {
  it('renders contact page form and info', async () => {
    render(
      <LanguageProvider>
        <MemoryRouter>
          <ContactPage />
        </MemoryRouter>
      </LanguageProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('mnchristelle@gmail.com')).toBeInTheDocument();
    });

    expect(screen.getByText('+237 695 282 983')).toBeInTheDocument();
  });

  it('keeps submit button disabled until all required fields and reCAPTCHA are filled', async () => {
    render(
      <LanguageProvider>
        <MemoryRouter>
          <ContactPage />
        </MemoryRouter>
      </LanguageProvider>
    );

    const nameInput = screen.getByRole('textbox', { name: /Name/i });
    const emailInput = screen.getByRole('textbox', { name: /Sender Email|Email/i });
    const messageInput = screen.getByRole('textbox', { name: /Message/i });
    const captchaCheckbox = screen.getByTestId('mock-captcha-checkbox');
    const submitBtn = screen.getByRole('button', { name: /Send Message|Envoyer/i });

    // Initially disabled
    expect(submitBtn).toBeDisabled();

    // Fill name only -> still disabled
    fireEvent.change(nameInput, { target: { value: 'Alice Smith' } });
    expect(submitBtn).toBeDisabled();

    // Fill invalid email -> still disabled
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    expect(submitBtn).toBeDisabled();

    // Fill valid email -> still disabled (message and captcha missing)
    fireEvent.change(emailInput, { target: { value: 'alice@example.com' } });
    expect(submitBtn).toBeDisabled();

    // Fill message -> still disabled (captcha missing)
    fireEvent.change(messageInput, { target: { value: 'Hello Christelle, let us work together.' } });
    expect(submitBtn).toBeDisabled();

    // Check captcha -> now enabled!
    fireEvent.click(captchaCheckbox);
    expect(submitBtn).toBeEnabled();

    // Uncheck captcha -> becomes disabled again
    fireEvent.click(captchaCheckbox);
    expect(submitBtn).toBeDisabled();

    // Re-check captcha -> becomes enabled again
    fireEvent.click(captchaCheckbox);
    expect(submitBtn).toBeEnabled();
  });

  it('allows filling and submitting the contact form', async () => {
    render(
      <LanguageProvider>
        <MemoryRouter>
          <ContactPage />
        </MemoryRouter>
      </LanguageProvider>
    );

    const nameInput = screen.getByRole('textbox', { name: /Name/i });
    const emailInput = screen.getByRole('textbox', { name: /Sender Email|Email/i });
    const subjectInput = screen.getByRole('textbox', { name: /Subject/i });
    const messageInput = screen.getByRole('textbox', { name: /Message/i });
    const captchaCheckbox = screen.getByTestId('mock-captcha-checkbox');

    fireEvent.change(nameInput, { target: { value: 'Alice Smith' } });
    fireEvent.change(emailInput, { target: { value: 'alice@example.com' } });
    fireEvent.change(subjectInput, { target: { value: 'Project Consultation' } });
    fireEvent.change(messageInput, { target: { value: 'Hi Christelle, let us discuss a software engineering contract.' } });
    fireEvent.click(captchaCheckbox);

    const submitBtn = screen.getByRole('button', { name: /Send Message|Envoyer/i });
    expect(submitBtn).toBeEnabled();
    fireEvent.click(submitBtn);

    // Wait for Verification modal to appear
    await waitFor(() => {
      expect(screen.getByText(/Verify Your Email Address|Vérifiez votre adresse email/i)).toBeInTheDocument();
    });

    const codeInput = screen.getByPlaceholderText(/e.g. 482915/i);
    fireEvent.change(codeInput, { target: { value: '100000' } });

    const verifyBtn = screen.getByRole('button', { name: /Confirm & Send Message|Confirmer et envoyer/i });
    fireEvent.click(verifyBtn);

    await waitFor(() => {
      expect(screen.getByText(/Message Dispatched Successfully|Message envoyé avec succès/i)).toBeInTheDocument();
    });
  });

  it('pre-fills subject and message when navigated with service query param', async () => {
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={['/contact?service=backend-engineer']}>
          <ContactPage />
        </MemoryRouter>
      </LanguageProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Inquiry pre-configured for|Demande pré-remplie pour/i)).toBeInTheDocument();
    });

    const subjectInput = screen.getByRole('textbox', { name: /Subject/i }) as HTMLInputElement;
    const messageInput = screen.getByRole('textbox', { name: /Message/i }) as HTMLTextAreaElement;

    await waitFor(() => {
      expect(subjectInput.value).toContain('Backend Engineer');
      expect(messageInput.value).toContain('Backend Engineer');
    });
  });
});
