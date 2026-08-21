import { Request, Response } from 'express';

export class HealthController {
  /**
   * Health and service configuration check
   * GET /api/health
   */
  public static async getHealth(_req: Request, res: Response): Promise<Response> {
    const resendConfigured = Boolean(
      process.env.RESEND_API_KEY &&
      process.env.RESEND_API_KEY.startsWith('re_') &&
      !process.env.RESEND_API_KEY.includes('your_')
    );

    const upstashConfigured = Boolean(
      process.env.UPSTASH_REDIS_REST_URL &&
      process.env.UPSTASH_REDIS_REST_TOKEN &&
      !process.env.UPSTASH_REDIS_REST_URL.includes('your-upstash-redis-url')
    );

    const recaptchaConfigured = Boolean(
      process.env.RECAPTCHA_SECRET_KEY &&
      !process.env.RECAPTCHA_SECRET_KEY.includes('your_')
    );

    return res.status(200).json({
      status: 'ok',
      resendConfigured,
      upstashConfigured,
      recaptchaConfigured,
      timestamp: new Date().toISOString(),
    });
  }
}
