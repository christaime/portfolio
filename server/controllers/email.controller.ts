import { Request, Response } from 'express';
import { RecaptchaService } from '../services/recaptcha.service.js';
import { EmailVerificationService } from '../services/emailVerification.service.js';
import { EmailSenderService } from '../services/emailSender.service.js';

export class EmailController {
  /**
   * Check if an email address is already verified in 24h Redis cache
   * Validates reCAPTCHA token and returns cache verification status
   * POST /api/check-email-status
   */
  public static async checkEmailStatus(req: Request, res: Response): Promise<Response> {
    try {
      const { email, recaptchaToken } = req.body || {};
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ error: 'Email address is required' });
      }

      // 1. Verify reCAPTCHA token
      const captchaVerify = await RecaptchaService.verifyToken(recaptchaToken);
      if (!captchaVerify.success) {
        return res.status(400).json({ error: captchaVerify.error || 'reCAPTCHA verification failed' });
      }

      const isVerified = await EmailVerificationService.isEmailVerified(email);
      return res.status(200).json({
        success: true,
        email: email.toLowerCase().trim(),
        isVerified,
      });
    } catch (err: any) {
      console.error('[EmailController.checkEmailStatus Error]', err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
  }

  /**
   * Send a 6-digit OTP verification code via email
   * Validates reCAPTCHA token, checks Redis cache, and sends email
   * POST /api/send-verification-code
   */
  public static async sendVerificationCode(req: Request, res: Response): Promise<Response> {
    try {
      const { email, recaptchaToken } = req.body || {};

      if (!email || typeof email !== 'string') {
        return res.status(400).json({ error: 'Email address is required' });
      }

      // 1. Verify reCAPTCHA token
      const captchaVerify = await RecaptchaService.verifyToken(recaptchaToken);
      if (!captchaVerify.success) {
        return res.status(400).json({ error: captchaVerify.error || 'reCAPTCHA verification failed' });
      }

      const normalizedEmail = email.toLowerCase().trim();

      // 2. Check if email is ALREADY verified in Redis cache (24h)
      const alreadyVerified = await EmailVerificationService.isEmailVerified(normalizedEmail);
      if (alreadyVerified) {
        return res.status(200).json({
          success: true,
          isVerified: true,
          message: 'Email address is already verified in Redis cache for 24 hours. No verification email needed.',
        });
      }

      // 3. Generate & store fresh 6-digit OTP in Redis (15m)
      const code = await EmailVerificationService.generateAndStoreOtp(normalizedEmail);

      // 4. Send verification email
      const sendResult = await EmailSenderService.sendVerificationOtp({
        email: normalizedEmail,
        code,
      });

      if (!sendResult.success) {
        return res.status(400).json({ error: sendResult.error || 'Failed to send verification email' });
      }

      return res.status(200).json(sendResult);
    } catch (err: any) {
      console.error('[EmailController.sendVerificationCode Error]', err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
  }

  /**
   * Confirm OTP Verification Code & Store in Redis Cache for 24 hours
   * POST /api/verify-code
   */
  public static async verifyCode(req: Request, res: Response): Promise<Response> {
    try {
      const { email, code } = req.body || {};

      if (!email || !code) {
        return res.status(400).json({ error: 'Email and verification code are required' });
      }

      const result = await EmailVerificationService.verifyOtp(email, code);

      if (!result.success) {
        return res.status(400).json(result);
      }

      return res.status(200).json(result);
    } catch (err: any) {
      console.error('[EmailController.verifyCode Error]', err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
  }

  /**
   * Send Contact Notification Email to the Engineer
   * Validates reCAPTCHA, checks sender verification status, and sends email
   * POST /api/send-email
   */
  public static async sendContactEmail(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, subject, message, code, recaptchaToken } = req.body || {};

      if (!name || !email || !message) {
        return res.status(400).json({ error: 'Missing required fields: name, email, or message' });
      }

      // 1. Verify reCAPTCHA token
      const captchaVerify = await RecaptchaService.verifyToken(recaptchaToken);
      if (!captchaVerify.success) {
        return res.status(400).json({ error: captchaVerify.error || 'reCAPTCHA verification failed' });
      }

      const normalizedEmail = email.toLowerCase().trim();

      // 2. If user supplied an OTP code directly with submission, verify it
      if (code) {
        await EmailVerificationService.verifyOtp(normalizedEmail, code);
      }

      // 3. Verify sender verification status in Redis cache
      let isVerified = await EmailVerificationService.isEmailVerified(normalizedEmail);

      // Auto-verify in simulation / development mode if live email dispatch is unconfigured
      const isLiveEmailConfigured = EmailSenderService.isConfigured();
      if (!isVerified && !isLiveEmailConfigured) {
        await EmailVerificationService.markEmailVerified(normalizedEmail);
        isVerified = true;
      }

      if (!isVerified) {
        return res.status(403).json({
          error: 'Email verification required before sending message.',
          requiresVerification: true,
        });
      }

      // 4. Send contact notification email
      const sendResult = await EmailSenderService.sendContactNotification({
        name,
        email: normalizedEmail,
        subject,
        message,
        isVerifiedCached: true,
      });

      if (!sendResult.success) {
        return res.status(400).json({ error: sendResult.error || 'Failed to send contact email' });
      }

      return res.status(200).json(sendResult);
    } catch (err: any) {
      console.error('[EmailController.sendContactEmail Error]', err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
  }
}
