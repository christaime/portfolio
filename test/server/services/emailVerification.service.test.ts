import { describe, it, expect, beforeEach } from 'vitest';
import { EmailVerificationService } from '@/server/services/emailVerification.service';

describe('EmailVerificationService', () => {
  const testEmail = 'verify.test@example.com';

  it('generates a 6-digit OTP code and stores it', async () => {
    const code = await EmailVerificationService.generateAndStoreOtp(testEmail);
    expect(code).toBeDefined();
    expect(code.length).toBe(6);
    expect(/^\d{6}$/.test(code)).toBe(true);
  });

  it('validates a correct OTP and returns success', async () => {
    const code = await EmailVerificationService.generateAndStoreOtp(testEmail);
    const result = await EmailVerificationService.verifyOtp(testEmail, code);

    expect(result.success).toBe(true);
    expect(result.isVerified).toBe(true);

    const isVerifiedNow = await EmailVerificationService.isEmailVerified(testEmail);
    expect(isVerifiedNow).toBe(true);
  });

  it('rejects an invalid OTP code', async () => {
    await EmailVerificationService.generateAndStoreOtp(testEmail);
    const result = await EmailVerificationService.verifyOtp(testEmail, '999999');

    expect(result.success).toBe(false);
    expect(result.isVerified).toBe(false);
    expect(result.error).toContain('Invalid or expired');
  });
});
