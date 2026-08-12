import { Redis } from '@upstash/redis';

// In-Memory Fallbacks for environments where UPSTASH_REDIS_REST_URL is not provided
const inMemoryVerifiedEmails = new Map<string, number>(); // email -> expireTimestamp
const inMemoryOtps = new Map<string, { code: string; expireTimestamp: number }>();

function getUpstashClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token && !url.includes('your-upstash-redis-url')) {
    try {
      return new Redis({ url, token });
    } catch (err) {
      console.warn('[Redis] Upstash initialization warning:', err);
      return null;
    }
  }
  return null;
}

export const redisStore = {
  /**
   * Check if an email is verified (stored in Redis cache within the 24h window)
   */
  async isEmailVerified(rawEmail: string): Promise<boolean> {
    const email = rawEmail.toLowerCase().trim();
    const upstash = getUpstashClient();

    if (upstash) {
      try {
        const val = await upstash.get<string>(`verified_email:${email}`);
        if (val === 'true' || val === '1') {
          return true;
        }
      } catch (err) {
        console.warn('[Redis] Failed to query Upstash Redis, checking in-memory fallback:', err);
      }
    }

    // Fallback: Check in-memory store
    const expires = inMemoryVerifiedEmails.get(email);
    if (expires) {
      if (Date.now() < expires) {
        return true;
      } else {
        inMemoryVerifiedEmails.delete(email);
      }
    }

    return false;
  },

  /**
   * Mark an email as verified for 24 hours (86,400 seconds) in Redis
   */
  async setEmailVerified(rawEmail: string): Promise<void> {
    const email = rawEmail.toLowerCase().trim();
    const upstash = getUpstashClient();

    const ONE_DAY_SECONDS = 86400;

    if (upstash) {
      try {
        await upstash.set(`verified_email:${email}`, 'true', { ex: ONE_DAY_SECONDS });
        console.log(`[Redis] Marked ${email} as verified in Upstash Redis for 24 hours (86400s).`);
      } catch (err) {
        console.warn('[Redis] Failed to set key in Upstash Redis, writing to in-memory store:', err);
      }
    }

    // Also write to in-memory store for local persistence / redundancy
    inMemoryVerifiedEmails.set(email, Date.now() + ONE_DAY_SECONDS * 1000);
  },

  /**
   * Store a 6-digit OTP code in Redis for 15 minutes (900 seconds)
   */
  async storeOtp(rawEmail: string, code: string): Promise<void> {
    const email = rawEmail.toLowerCase().trim();
    const upstash = getUpstashClient();
    const FIFTEEN_MINS_SECONDS = 900;

    if (upstash) {
      try {
        await upstash.set(`otp:${email}`, code, { ex: FIFTEEN_MINS_SECONDS });
        console.log(`[Redis] Stored OTP for ${email} in Upstash Redis (EX: 900s).`);
      } catch (err) {
        console.warn('[Redis] Failed to store OTP in Upstash Redis:', err);
      }
    }

    inMemoryOtps.set(email, {
      code,
      expireTimestamp: Date.now() + FIFTEEN_MINS_SECONDS * 1000,
    });
  },

  /**
   * Retrieve the stored OTP code for an email
   */
  async getStoredOtp(rawEmail: string): Promise<string | null> {
    const email = rawEmail.toLowerCase().trim();
    const upstash = getUpstashClient();

    if (upstash) {
      try {
        const val = await upstash.get<string>(`otp:${email}`);
        if (val) return val.toString();
      } catch (err) {
        console.warn('[Redis] Failed to read OTP from Upstash Redis:', err);
      }
    }

    const item = inMemoryOtps.get(email);
    if (item) {
      if (Date.now() < item.expireTimestamp) {
        return item.code;
      } else {
        inMemoryOtps.delete(email);
      }
    }

    return null;
  },

  /**
   * Delete OTP code after successful verification
   */
  async deleteOtp(rawEmail: string): Promise<void> {
    const email = rawEmail.toLowerCase().trim();
    const upstash = getUpstashClient();

    if (upstash) {
      try {
        await upstash.del(`otp:${email}`);
      } catch (err) {
        console.warn('[Redis] Failed to delete OTP from Upstash Redis:', err);
      }
    }

    inMemoryOtps.delete(email);
  },
};
