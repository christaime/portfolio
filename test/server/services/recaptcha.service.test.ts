import { describe, it, expect } from 'vitest';
import { RecaptchaService } from '@/server/services/recaptcha.service';

describe('RecaptchaService', () => {
  it('automatically passes test or sandbox tokens', async () => {
    const testResult = await RecaptchaService.verifyToken('test_recaptcha_token');
    expect(testResult.success).toBe(true);
    expect(testResult.score).toBe(1.0);

    const mockResult = await RecaptchaService.verifyToken('mock_token_123');
    expect(mockResult.success).toBe(true);

    const clientTokenResult = await RecaptchaService.verifyToken('verified_client_token_12345');
    expect(clientTokenResult.success).toBe(true);
    expect(clientTokenResult.score).toBe(1.0);
  });

  it('handles empty or undefined token gracefully in dev/preview', async () => {
    const result = await RecaptchaService.verifyToken(undefined);
    expect(result.success).toBe(true);
  });
});
