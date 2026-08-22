import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { LanguageProvider } from '@/client/context/LanguageContext';
import { BlogPostDetailPage } from '@/client/pages/blog/BlogPostDetailPage';

describe('BlogPostDetailPage', () => {
  it('renders blog post details with full markdown rendering including bold, inline code, and code blocks', async () => {
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={['/blog/angular-signals-vs-rxjs-state-management']}>
          <Routes>
            <Route path="/blog/:slug" element={<BlogPostDetailPage />} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByText('Angular Signals: A New Era of Reactivity, But RxJS Still Reigns for APIs')
      ).toBeInTheDocument();
    });

    // Verify Headings
    expect(screen.getByText('The Flicker Problem in Modern SPAs')).toBeInTheDocument();
    expect(screen.getByText('What Are Angular Signals?')).toBeInTheDocument();
    expect(screen.getByText('Why RxJS Still Matters for API Calls')).toBeInTheDocument();

    // Verify Bold elements (**Existing Ecosystem:**, **Asynchronous Handling:**, etc.)
    expect(screen.getByText('Existing Ecosystem:')).toBeInTheDocument();
    expect(screen.getByText('Asynchronous Handling:')).toBeInTheDocument();

    // Verify Inline Code (`catchError`, `takeUntil`, `map`)
    expect(screen.getByText('catchError')).toBeInTheDocument();
    expect(screen.getByText('takeUntil')).toBeInTheDocument();
    expect(screen.getByText('const user = signal<User | null>(null);')).toBeInTheDocument();

    // Verify Code Block with multiline typescript code
    expect(screen.getByText(/this\.http\.get\('\/api\/users'\)/i)).toBeInTheDocument();
    expect(screen.getByText(/typescript/i)).toBeInTheDocument();
  });

  it('allows copying code block content to clipboard', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={['/blog/angular-signals-vs-rxjs-state-management']}>
          <Routes>
            <Route path="/blog/:slug" element={<BlogPostDetailPage />} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Copy code to clipboard/i })).toBeInTheDocument();
    });

    const copyBtn = screen.getByRole('button', { name: /Copy code to clipboard/i });
    fireEvent.click(copyBtn);

    expect(writeTextMock).toHaveBeenCalledWith(expect.stringContaining("this.http.get('/api/users')"));
    await waitFor(() => {
      expect(screen.getByText('Copied')).toBeInTheDocument();
    });
  });

  it('renders existing blog post correctly', async () => {
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={['/blog/building-resilient-peppol-einvoicing-pipeline-java-spring']}>
          <Routes>
            <Route path="/blog/:slug" element={<BlogPostDetailPage />} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByText('Building a Resilient PEPPOL E-Invoicing Pipeline with Java and Spring Boot')
      ).toBeInTheDocument();
    });

    expect(screen.getByText(/The Challenge of E-Invoicing Compliance/i)).toBeInTheDocument();

    // Verify translated Bottom CTA elements
    expect(screen.getByText('Need Expert Architecture Consultation?')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Discuss system integration, PEPPOL compliance pipelines, or microservices scalability directly.'
      )
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Contact the Architect' })).toBeInTheDocument();
  });
});
