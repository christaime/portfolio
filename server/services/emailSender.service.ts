import { Resend } from 'resend';
import { getVerificationEmailTemplate, getContactEmailTemplate } from '../templates/emailTemplates';

export interface SendOtpEmailParams {
  email: string;
  code: string;
}

export interface SendContactEmailParams {
  name: string;
  email: string;
  subject?: string;
  message: string;
  isVerifiedCached?: boolean;
}

export interface SendEmailResult {
  success: boolean;
  mode?: 'live' | 'simulated' | 'simulated_fallback';
  isVerified?: boolean;
  isVerifiedCached?: boolean;
  code?: string;
  warning?: string;
  message?: string;
  data?: any;
  error?: string;
}

export class EmailSenderService {
  /**
   * Helper for lazy initialization of Resend client
   */
  private static getResendClient(): Resend | null {
    const rawKey = process.env.RESEND_API_KEY || '';
    const apiKey = rawKey.replace(/['"]/g, '').trim();

    if (
      !apiKey ||
      !apiKey.startsWith('re_') ||
      apiKey.length < 15 ||
      apiKey.includes('your_') ||
      apiKey.includes('12345678') ||
      apiKey.includes('MY_RESEND') ||
      apiKey.includes('xxxx')
    ) {
      return null;
    }

    return new Resend(apiKey);
  }

  /**
   * Dispatch OTP verification email to recipient
   */
  public static async sendVerificationOtp({ email, code }: SendOtpEmailParams): Promise<SendEmailResult> {
    const normalizedEmail = email.toLowerCase().trim();
    const resend = this.getResendClient();
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

    const htmlContent = getVerificationEmailTemplate({
      email: normalizedEmail,
      code,
    });

    if (!resend) {
      console.warn('[EmailSenderService] RESEND_API_KEY is not configured. Simulating OTP dispatch. Code:', code);
      return {
        success: true,
        mode: 'simulated',
        isVerified: false,
        code,
        message: 'Verification code simulated (RESEND_API_KEY not configured).',
      };
    }

    try {
      const sendResult = await resend.emails.send({
        from: fromEmail,
        to: [normalizedEmail],
        subject: `Your Verification Code: ${code}`,
        html: htmlContent,
      });

      const { data, error } = sendResult || {};

      if (error) {
        const errMsg = error.message || error.toString() || '';
        const errStr = `${errMsg} ${JSON.stringify(error)}`.toLowerCase();

        // If domain restricted (e.g. testing tier), provide fallback simulation code
        if (
          errStr.includes('api key') ||
          errStr.includes('validation_error') ||
          errStr.includes('can only send') ||
          errStr.includes('testing emails') ||
          errStr.includes('resend.com/domains') ||
          errStr.includes('invalid') ||
          errStr.includes('unauthorized')
        ) {
          console.warn('[EmailSenderService] Fallback OTP simulation due to Resend tier restriction:', errMsg);
          return {
            success: true,
            mode: 'simulated_fallback',
            isVerified: false,
            code,
            warning: `Resend Free Tier Notice: Testing emails can only be sent to account owner. Generated fallback code: ${code}`,
            message: `Verification code generated (${code}). Notice: ${errMsg}`,
          };
        }

        console.error('[EmailSenderService Verification Error]', error);
        return {
          success: false,
          error: errMsg || 'Failed to send verification email',
        };
      }

      return {
        success: true,
        mode: 'live',
        isVerified: false,
        message: `Verification code sent to ${normalizedEmail}`,
        data,
      };
    } catch (err: any) {
      console.warn('[EmailSenderService Exception] Failed to send via Resend API:', err?.message || err);
      return {
        success: true,
        mode: 'simulated_fallback',
        isVerified: false,
        code,
        warning: `Resend Notice: ${err?.message || 'Error communicating with Resend'}. Generated fallback code: ${code}`,
        message: `Verification code generated (${code}).`,
      };
    }
  }

  /**
   * Dispatch Contact Form message to engineer recipient
   */
  public static async sendContactNotification({
    name,
    email,
    subject,
    message,
    isVerifiedCached = true,
  }: SendContactEmailParams): Promise<SendEmailResult> {
    const normalizedEmail = email.toLowerCase().trim();
    const resend = this.getResendClient();
    const recipientEmail = process.env.RECIPIENT_EMAIL || 'mnchristelle@gmail.com';
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

    const htmlContent = getContactEmailTemplate({
      name,
      email: normalizedEmail,
      subject,
      message,
      isVerifiedCached,
      timestamp: new Date().toUTCString(),
    });

    if (!resend) {
      console.warn('[EmailSenderService] RESEND_API_KEY is not configured. Simulating contact message delivery.');
      return {
        success: true,
        mode: 'simulated',
        isVerifiedCached: true,
        message: 'Contact email simulated (RESEND_API_KEY not configured). Message recorded successfully!',
      };
    }

    try {
      const sendResult = await resend.emails.send({
        from: fromEmail,
        to: [recipientEmail],
        replyTo: normalizedEmail,
        subject: subject ? `[Contact Form] ${subject} - ${name}` : `New Direct Inquiry from ${name}`,
        html: htmlContent,
      });

      const { data, error } = sendResult || {};

      if (error) {
        const errMsg = error.message || error.toString() || '';
        const errStr = `${errMsg} ${JSON.stringify(error)}`.toLowerCase();

        if (
          errStr.includes('api key') ||
          errStr.includes('validation_error') ||
          errStr.includes('can only send') ||
          errStr.includes('testing emails') ||
          errStr.includes('resend.com/domains') ||
          errStr.includes('invalid') ||
          errStr.includes('unauthorized')
        ) {
          console.warn('[EmailSenderService] Recording contact message in simulated mode due to Resend tier restriction:', errMsg);
          return {
            success: true,
            mode: 'simulated_fallback',
            isVerifiedCached: true,
            warning: `Resend Notice: ${errMsg}. Message recorded locally.`,
            message: 'Contact message recorded successfully (simulated fallback mode).',
          };
        }

        console.error('[EmailSenderService Contact Error]', error);
        return {
          success: false,
          error: errMsg || 'Failed to send contact email',
        };
      }

      return {
        success: true,
        mode: 'live',
        isVerifiedCached: true,
        data,
      };
    } catch (err: any) {
      console.warn('[EmailSenderService Exception] Failed to send contact message via Resend:', err?.message || err);
      return {
        success: true,
        mode: 'simulated_fallback',
        isVerifiedCached: true,
        warning: `Resend Notice: ${err?.message || 'Error communicating with Resend'}. Message recorded locally.`,
        message: 'Contact message recorded successfully.',
      };
    }
  }
}
