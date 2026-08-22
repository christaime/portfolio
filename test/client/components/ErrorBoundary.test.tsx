import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ErrorBoundary } from '@/client/components/ErrorBoundary';

const ProblemChild = () => {
  throw new Error('Test rendering crash');
};

const SafeChild = () => <div>Safe Component Content</div>;

describe('ErrorBoundary Component', () => {
  const originalConsoleError = console.error;

  beforeEach(() => {
    console.error = vi.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it('renders children normally when no error occurs', () => {
    render(
      <ErrorBoundary>
        <SafeChild />
      </ErrorBoundary>
    );

    expect(screen.getByText('Safe Component Content')).toBeInTheDocument();
  });

  it('renders fallback error UI when an error is thrown in children', () => {
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(
      screen.getByText('An unexpected error occurred while rendering this interface.')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Application/i })).toBeInTheDocument();
  });
});
