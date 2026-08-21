import { describe, it, expect, beforeEach } from 'vitest';
import { redisStore } from '@/server/services/redisStore';

describe('redisStore', () => {
  const testEmail = 'dev.tester@example.com';

  beforeEach(async () => {
    await redisStore.deleteOtp(testEmail);
  });

  it('stores and checks email verification in cache', async () => {
    expect(await redisStore.isEmailVerified(testEmail)).toBe(false);

    await redisStore.setEmailVerified(testEmail);
    expect(await redisStore.isEmailVerified(testEmail)).toBe(true);
  });

  it('stores, retrieves, and deletes OTP code', async () => {
    await redisStore.storeOtp(testEmail, '654321');
    const code = await redisStore.getStoredOtp(testEmail);
    expect(code).toBe('654321');

    await redisStore.deleteOtp(testEmail);
    const codeAfterDelete = await redisStore.getStoredOtp(testEmail);
    expect(codeAfterDelete).toBeNull();
  });
});
