import { Redis } from '@upstash/redis';

// In-Memory Store for fallback and fast access
const inMemoryVerifiedEmails = new Map<string, number>(); // email -> expireTimestamp
const inMemoryOtps = new Map<string, { code: string; expireTimestamp: number }>();

let upstashClient: Redis | null = null;
let isUpstashDisabled = false;
let nextUpstashRetryTime = 0;

function getUpstashClient(): Redis | null {
  if (isUpstashDisabled && Date.now() < nextUpstashRetryTime) {
    return null;
  }

  if (upstashClient) {
    return upstashClient;
  }

  const url = (process.env.UPSTASH_REDIS_REST_URL || '').trim();
  const token = (process.env.UPSTASH_REDIS_REST_TOKEN || '').trim();

  // Validate URL structure
  if (
    url &&
    token &&
    !url.includes('your-upstash-redis-url') &&
    !url.includes('example.com') &&
    (url.startsWith('https://') || url.startsWith('http://'))
  ) {
    try {
      upstashClient = new Redis({ url, token });
      return upstashClient;
    } catch {
      isUpstashDisabled = true;
      nextUpstashRetryTime = Date.now() + 5 * 60 * 1000;
      return null;
    }
  }
  return null;
}

function handleUpstashFailure(err: any) {
  // If DNS resolution fails (ENOTFOUND) or connection is refused/timed out, back off Upstash
  const errMsg = err?.message || String(err);
  const isNetworkOrDnsError =
    errMsg.includes('ENOTFOUND') ||
    errMsg.includes('fetch failed') ||
    errMsg.includes('ECONNREFUSED') ||
    errMsg.includes('ETIMEDOUT') ||
    errMsg.includes('UND_ERR');

  if (isNetworkOrDnsError) {
    isUpstashDisabled = true;
    nextUpstashRetryTime = Date.now() + 5 * 60 * 1000; // Backoff for 5 minutes
  }
}

export const redisStore = {
  /**
   * Check if an email is verified (stored in Redis cache or in-memory fallback within 24h window)
   */
  async isEmailVerified(rawEmail: string): Promise<boolean> {
    const email = rawEmail.toLowerCase().trim();
    const upstash = getUpstashClient();

    if (upstash) {
      try {
        const val = await Promise.race([
          upstash.get<string>(`verified_email:${email}`),
          new Promise<null>((_, reject) => setTimeout(() => reject(new Error('ETIMEDOUT')), 1500)),
        ]);
        if (val === 'true' || val === '1') {
          return true;
        }
      } catch (err) {
        handleUpstashFailure(err);
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
   * Mark an email as verified for 24 hours (86,400 seconds) in Redis & memory
   */
  async setEmailVerified(rawEmail: string): Promise<void> {
    const email = rawEmail.toLowerCase().trim();
    const upstash = getUpstashClient();
    const ONE_DAY_SECONDS = 86400;

    // Always update in-memory store for instant zero-latency access and persistence
    inMemoryVerifiedEmails.set(email, Date.now() + ONE_DAY_SECONDS * 1000);

    if (upstash) {
      try {
        await Promise.race([
          upstash.set(`verified_email:${email}`, 'true', { ex: ONE_DAY_SECONDS }),
          new Promise<null>((_, reject) => setTimeout(() => reject(new Error('ETIMEDOUT')), 1500)),
        ]);
      } catch (err) {
        handleUpstashFailure(err);
      }
    }
  },

  /**
   * Store a 6-digit OTP code in Redis & memory for 15 minutes (900 seconds)
   */
  async storeOtp(rawEmail: string, code: string): Promise<void> {
    const email = rawEmail.toLowerCase().trim();
    const upstash = getUpstashClient();
    const FIFTEEN_MINS_SECONDS = 900;

    inMemoryOtps.set(email, {
      code,
      expireTimestamp: Date.now() + FIFTEEN_MINS_SECONDS * 1000,
    });

    if (upstash) {
      try {
        await Promise.race([
          upstash.set(`otp:${email}`, code, { ex: FIFTEEN_MINS_SECONDS }),
          new Promise<null>((_, reject) => setTimeout(() => reject(new Error('ETIMEDOUT')), 1500)),
        ]);
      } catch (err) {
        handleUpstashFailure(err);
      }
    }
  },

  /**
   * Retrieve the stored OTP code for an email
   */
  async getStoredOtp(rawEmail: string): Promise<string | null> {
    const email = rawEmail.toLowerCase().trim();
    const upstash = getUpstashClient();

    if (upstash) {
      try {
        const val = await Promise.race([
          upstash.get<string>(`otp:${email}`),
          new Promise<null>((_, reject) => setTimeout(() => reject(new Error('ETIMEDOUT')), 1500)),
        ]);
        if (val) return val.toString();
      } catch (err) {
        handleUpstashFailure(err);
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

    inMemoryOtps.delete(email);

    if (upstash) {
      try {
        await Promise.race([
          upstash.del(`otp:${email}`),
          new Promise<null>((_, reject) => setTimeout(() => reject(new Error('ETIMEDOUT')), 1500)),
        ]);
      } catch (err) {
        handleUpstashFailure(err);
      }
    }
  },
};
