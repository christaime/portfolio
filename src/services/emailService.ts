export interface SendEmailPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
  code?: string;
  recaptchaToken?: string;
}

export interface SendVerificationCodePayload {
  email: string;
  recaptchaToken?: string;
}

export interface VerifyCodePayload {
  email: string;
  code: string;
}

export const emailService = {
  /**
   * Check if an email is verified in the 24-hour Redis cache
   */
  async checkEmailStatus(email: string): Promise<{ success: boolean; isVerified: boolean }> {
    try {
      const response = await fetch('/api/check-email-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        return { success: false, isVerified: false };
      }
      return data;
    } catch (err) {
      console.error('emailService.checkEmailStatus error:', err);
      return { success: false, isVerified: false };
    }
  },

  /**
   * Request sending a 6-digit OTP verification code via Resend.
   * If already verified in Redis, returns isVerified: true immediately without sending an email!
   */
  async sendVerificationCode(payload: SendVerificationCodePayload) {
    try {
      const response = await fetch('/api/send-verification-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification code');
      }

      return data;
    } catch (err: any) {
      console.error('emailService.sendVerificationCode error:', err);
      throw err;
    }
  },

  /**
   * Verify 6-digit OTP code with server and store in 24h Redis cache
   */
  async verifyCode(payload: VerifyCodePayload) {
    try {
      const response = await fetch('/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Invalid or expired verification code');
      }

      return data;
    } catch (err: any) {
      console.error('emailService.verifyCode error:', err);
      throw err;
    }
  },

  /**
   * Send final contact form email
   */
  async sendContactEmail(payload: SendEmailPayload) {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      return data;
    } catch (err: any) {
      console.error('emailService.sendContactEmail error:', err);
      throw err;
    }
  },
};
