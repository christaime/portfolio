import { describe, it, expect } from 'vitest';
import apiRouter from '@/server/routes/api.routes';

describe('API Routes', () => {
  it('registers expected endpoints on the router stack', () => {
    const paths = apiRouter.stack
      .map((layer: any) => layer.route?.path)
      .filter(Boolean);

    expect(paths).toContain('/health');
    expect(paths).toContain('/check-email-status');
    expect(paths).toContain('/send-verification-code');
    expect(paths).toContain('/verify-code');
    expect(paths).toContain('/send-email');
  });
});
