import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ContactCaptcha } from '@/client/components/contact/ContactCaptcha';
import { LanguageProvider } from '@/client/context/LanguageContext';

describe('ContactCaptcha Component', () => {
  it('renders required captcha checkbox and calls onVerify with token on check', () => {
    const handleVerify = vi.fn();
    render(
      <LanguageProvider>
        <ContactCaptcha onVerify={handleVerify} required={true} />
      </LanguageProvider>
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
    expect(checkbox).toBeRequired();

    fireEvent.click(checkbox);

    expect(checkbox).toBeChecked();
    expect(handleVerify).toHaveBeenCalledWith(expect.stringContaining('verified_client_token_'));

    // Uncheck
    fireEvent.click(checkbox);
    expect(handleVerify).toHaveBeenCalledWith('');
  });

  it('respects isVerified prop for controlled reset', () => {
    const handleVerify = vi.fn();
    const { rerender } = render(
      <LanguageProvider>
        <ContactCaptcha onVerify={handleVerify} isVerified={true} required={true} />
      </LanguageProvider>
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();

    rerender(
      <LanguageProvider>
        <ContactCaptcha onVerify={handleVerify} isVerified={false} required={true} />
      </LanguageProvider>
    );

    expect(checkbox).not.toBeChecked();
  });
});
