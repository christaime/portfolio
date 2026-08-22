import { redisStore } from './redisStore';

export interface VerifyOtpResult {
  success: boolean;
  isVerified: boolean;
  error?: string;
  message?: string;
}

export class EmailVerificationService {
  /**
   * Check if an email address is already verified in 24-hour Redis cache
   */
  public static async isEmailVerified(email: string): Promise<boolean> {
    const normalizedEmail = email.toLowerCase().trim();
    return await redisStore.isEmailVerified(normalizedEmail);
  }

  /**
   * Mark an email address as verified in 24-hour Redis cache
   */
  public static async markEmailVerified(email: string): Promise<void> {
    const normalizedEmail = email.toLowerCase().trim();
    await redisStore.setEmailVerified(normalizedEmail);
  }

  /**
   * Generate a fresh 6-digit OTP code and store in Redis for 15 minutes
   */
  public static async generateAndStoreOtp(email: string): Promise<string> {
    const normalizedEmail = email.toLowerCase().trim();
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await redisStore.storeOtp(normalizedEmail, code);
    return code;
  }

  /**
   * Verify an OTP code for an email and cache verification for 24 hours upon success
   */
  public static async verifyOtp(email: string, code: string): Promise<VerifyOtpResult> {
    const normalizedEmail = email.toLowerCase().trim();
    const storedOtp = await redisStore.getStoredOtp(normalizedEmail);

    if (!storedOtp || storedOtp !== code.toString().trim()) {
      return {
        success: false,
        isVerified: false,
        error: 'Invalid or expired verification code. Please check your email and try again.',
      };
    }

    // Mark verified in Redis for 24h & cleanup used OTP
    await redisStore.setEmailVerified(normalizedEmail);
    await redisStore.deleteOtp(normalizedEmail);

    return {
      success: true,
      isVerified: true,
      message: 'Email verified successfully and stored in 24-hour Redis cache.',
    };
  }
}
