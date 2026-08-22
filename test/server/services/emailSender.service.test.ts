import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EmailSenderService } from '@/server/services/emailSender.service';

describe('EmailSenderService', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  describe('Subject and Header Sanitization', () => {
    it('strips CRLF line breaks and prevents header injection in subject', () => {
      const maliciousSubject = 'Inquiry\r\nBcc: evil@hacker.com\nSubject: Injected';
      const sanitized = EmailSenderService.sanitizeSubject(maliciousSubject, 'Alice');

      expect(sanitized).not.toContain('\r');
      expect(sanitized).not.toContain('\n');
      expect(sanitized).toBe('Inquiry Bcc: evil@hacker.com Subject: Injected');
    });

    it('strips HTML and script tags from subject', () => {
      const htmlSubject = 'Urgent <script>alert("xss")</script> Project <b>Opportunity</b>';
      const sanitized = EmailSenderService.sanitizeSubject(htmlSubject, 'Alice');

      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('</script>');
      expect(sanitized).not.toContain('<b>');
      expect(sanitized).toBe('Urgent alert("xss") Project Opportunity');
    });

    it('collapses consecutive whitespace and trims subject', () => {
      const messySubject = '   Architecture    Review   Session   ';
      const sanitized = EmailSenderService.sanitizeSubject(messySubject, 'Alice');

      expect(sanitized).toBe('Architecture Review Session');
    });

    it('enforces maximum length boundary on subject', () => {
      const longSubject = 'A'.repeat(200);
      const sanitized = EmailSenderService.sanitizeSubject(longSubject, 'Alice');

      expect(sanitized.length).toBeLessThanOrEqual(150);
      expect(sanitized.endsWith('...')).toBe(true);
    });

    it('provides clean default fallback subject if subject is undefined or empty', () => {
      expect(EmailSenderService.sanitizeSubject('', 'Bob')).toBe('New Direct Portfolio Inquiry from Bob');
      expect(EmailSenderService.sanitizeSubject(undefined, 'Bob')).toBe('New Direct Portfolio Inquiry from Bob');
      expect(EmailSenderService.sanitizeSubject('   ', '')).toBe('New Direct Portfolio Inquiry from Visitor');
    });

    it('sanitizes header fields cleanly', () => {
      const maliciousName = 'Alice\r\nAdmin: true<script>';
      const sanitized = EmailSenderService.sanitizeHeaderField(maliciousName, 50);

      expect(sanitized).not.toContain('\r');
      expect(sanitized).not.toContain('\n');
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toBe('Alice Admin: true');
    });
  });

  describe('Email Sending & Mode Detection', () => {
    it('runs in simulated mode when no email provider keys are set', async () => {
      delete process.env.EMAILJS_SERVICE_ID;
      delete process.env.EMAILJS_PUBLIC_KEY;

      expect(EmailSenderService.isConfigured()).toBe(false);
      expect(EmailSenderService.getProvider()).toBe('simulated');

      const otpRes = await EmailSenderService.sendVerificationOtp({
        email: 'test@example.com',
        code: '123456',
      });

      expect(otpRes.success).toBe(true);
      expect(otpRes.provider).toBe('simulated');
      expect(otpRes.code).toBe('123456');

      const contactRes = await EmailSenderService.sendContactNotification({
        name: 'John Doe',
        email: 'test@example.com',
        subject: 'Consulting',
        message: 'Hello world',
      });

      expect(contactRes.success).toBe(true);
      expect(contactRes.provider).toBe('simulated');
    });

    it('detects and uses EmailJS when EmailJS credentials are configured and passes sanitized subject', async () => {
      process.env.EMAILJS_SERVICE_ID = 'service_test123';
      process.env.EMAILJS_PUBLIC_KEY = 'user_pubkey123';
      process.env.EMAILJS_TEMPLATE_ID = 'template_test123';

      expect(EmailSenderService.isEmailJSConfigured()).toBe(true);
      expect(EmailSenderService.getProvider()).toBe('emailjs');

      // Mock global fetch for EmailJS
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        text: async () => 'OK',
      });
      vi.stubGlobal('fetch', fetchMock);

      const contactRes = await EmailSenderService.sendContactNotification({
        name: 'Alice Cooper',
        email: 'alice@example.com',
        subject: 'Project\r\nBcc: spy@domain.com',
        message: 'Let us build a fullstack application.',
      });

      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.emailjs.com/api/v1.0/email/send',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
          body: expect.stringContaining('"subject":"Project Bcc: spy@domain.com"'),
        })
      );
      expect(contactRes.success).toBe(true);
      expect(contactRes.provider).toBe('emailjs');
      expect(contactRes.mode).toBe('live');
    });
  });
});
