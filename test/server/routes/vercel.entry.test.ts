import { describe, it, expect } from 'vitest';
import { createApiApp } from '@/server/apiApp';

describe('Vercel API Serverless Entry Point', () => {
  it('exports an initialized Express application instance', () => {
    const vercelApp = createApiApp();
    expect(vercelApp).toBeDefined();
    expect(typeof vercelApp).toBe('function');
    expect(typeof vercelApp.use).toBe('function');
    expect(typeof vercelApp.listen).toBe('function');
  });
});
