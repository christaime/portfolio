import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../context/LanguageContext';
import { ContactPage } from './ContactPage';

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

  it('allows filling and submitting the contact form', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    render(
      <LanguageProvider>
        <MemoryRouter>
          <ContactPage />
        </MemoryRouter>
      </LanguageProvider>
    );

    const nameInput = screen.getByLabelText(/Name/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const subjectInput = screen.getByLabelText(/Subject/i);
    const messageInput = screen.getByLabelText(/Message/i);

    fireEvent.change(nameInput, { target: { value: 'Alice Smith' } });
    fireEvent.change(emailInput, { target: { value: 'alice@example.com' } });
    fireEvent.change(subjectInput, { target: { value: 'Project Consultation' } });
    fireEvent.change(messageInput, { target: { value: 'Hi Christelle, let us discuss a software engineering contract.' } });

    const submitBtn = screen.getByRole('button', { name: /Send Message|Envoyer/i });
    fireEvent.click(submitBtn);

    // Wait for Verification modal to appear
    await waitFor(() => {
      expect(screen.getByText(/Email Verification Required/i)).toBeInTheDocument();
    });

    const codeInput = screen.getByPlaceholderText(/e.g. 482915/i);
    fireEvent.change(codeInput, { target: { value: '100000' } });

    const verifyBtn = screen.getByRole('button', { name: /Verify & Send/i });
    fireEvent.click(verifyBtn);

    await waitFor(() => {
      expect(screen.getByText(/Message Received/i)).toBeInTheDocument();
    });

    vi.restoreAllMocks();
  });
});
