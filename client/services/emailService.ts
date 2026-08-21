export interface SendEmailPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
  code?: string;
  recaptchaToken?: string;
}

export interface EmailServiceResponse {
  success: boolean;
  isVerified?: boolean;
  isVerifiedCached?: boolean;
  requiresVerification?: boolean;
  mode?: string;
  code?: string;
  message?: string;
  error?: string;
  warning?: string;
}

export const emailService = {
  async checkEmailStatus(email: string, recaptchaToken?: string): Promise<EmailServiceResponse> {
    try {
      const resp = await fetch('/api/check-email-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, recaptchaToken }),
      });
      return await resp.json();
    } catch {
      return { success: false, error: 'Failed to communicate with email verification service' };
    }
  },

  async sendVerificationCode(email: string, recaptchaToken?: string): Promise<EmailServiceResponse> {
    try {
      const resp = await fetch('/api/send-verification-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, recaptchaToken }),
      });
      return await resp.json();
    } catch {
      return { success: false, error: 'Failed to send verification code' };
    }
  },

  async verifyCode(email: string, code: string): Promise<EmailServiceResponse> {
    try {
      const resp = await fetch('/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      return await resp.json();
    } catch {
      return { success: false, error: 'Failed to verify OTP code' };
    }
  },

  async sendEmail(payload: SendEmailPayload): Promise<EmailServiceResponse> {
    try {
      const resp = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return await resp.json();
    } catch {
      return { success: false, error: 'Failed to send contact message' };
    }
  },

  async sendContactEmail(payload: SendEmailPayload): Promise<EmailServiceResponse> {
    return this.sendEmail(payload);
  },
};
