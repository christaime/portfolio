import { describe, it, expect } from 'vitest';
import vercelApp from '@/vercel-entrypoint';

describe('Vercel API Serverless Entry Point', () => {
  it('exports an initialized Express application instance', () => {
    expect(vercelApp).toBeDefined();
    expect(typeof vercelApp).toBe('function');
    expect(typeof vercelApp.use).toBe('function');
    expect(typeof vercelApp.listen).toBe('function');
  });
});

