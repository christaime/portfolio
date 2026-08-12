/**
 * Server-side HTML Email Templates for Resend
 * Formatted with clean responsive inline CSS.
 */

export interface VerificationTemplateOptions {
  email: string;
  code: string;
}

export interface ContactTemplateOptions {
  name: string;
  email: string;
  subject?: string;
  message: string;
  isVerifiedCached?: boolean;
  timestamp?: string;
}

/**
 * HTML Email Template for Email Verification Code (OTP)
 */
export function getVerificationEmailTemplate({ email, code }: VerificationTemplateOptions): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 520px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #0f172a; padding: 24px; text-align: center; border-bottom: 3px solid #6366f1;">
              <div style="font-size: 18px; font-weight: 700; color: #ffffff; letter-spacing: 0.5px;">
                Christelle Mamekem Ngueguim
              </div>
              <div style="font-size: 12px; color: #94a3b8; margin-top: 4px; text-transform: uppercase; letter-spacing: 1px;">
                Senior Software Engineer • Engineering Portal
              </div>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px 28px;">
              <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 700; color: #0f172a; text-align: center;">
                Verify Your Email Address
              </h2>
              <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #475569; text-align: center;">
                You requested to send a message via the engineering contact portal. Please enter the verification code below to confirm ownership of <strong style="color: #0f172a;">${email}</strong>:
              </p>

              <!-- Code Box -->
              <div style="background-color: #f1f5f9; border: 1px border-style: dashed; border-color: #cbd5e1; border-radius: 10px; padding: 20px; text-align: center; margin: 24px 0;">
                <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #64748b; font-weight: 600; margin-bottom: 8px;">
                  Your Verification Code
                </div>
                <div style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #4f46e5;">
                  ${code}
                </div>
                <div style="font-size: 12px; color: #64748b; margin-top: 8px;">
                  Expires in 15 minutes
                </div>
              </div>

              <!-- Note Box -->
              <div style="background-color: #eef2ff; border-left: 4px solid #6366f1; padding: 12px 16px; border-radius: 4px; font-size: 12px; color: #3730a3; line-height: 1.5; margin-bottom: 24px;">
                <strong>24-Hour Cache Guarantee:</strong> Once verified, your email address will be cached in our secure Redis store for 24 hours. Any further messages you send today will be delivered instantly without re-verification.
              </div>

              <p style="margin: 0; font-size: 12px; color: #94a3b8; text-align: center;">
                If you did not request this verification code, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 16px 28px; border-top: 1px solid #f1f5f9; text-align: center; font-size: 12px; color: #94a3b8;">
              © ${new Date().getFullYear()} Christelle M. Ngueguim • Automated Security Service
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * HTML Email Template for Contact Form Notification
 */
export function getContactEmailTemplate({
  name,
  email,
  subject,
  message,
  isVerifiedCached = true,
  timestamp = new Date().toUTCString(),
}: ContactTemplateOptions): string {
  const safeSubject = subject?.trim() || 'Direct Inquiry / Consulting Contact';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Message</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #0f172a; padding: 24px; border-bottom: 3px solid #10b981;">
              <table role="presentation" width="100%">
                <tr>
                  <td>
                    <div style="font-size: 18px; font-weight: 700; color: #ffffff;">
                      New Direct Portfolio Inquiry
                    </div>
                    <div style="font-size: 12px; color: #94a3b8; margin-top: 2px;">
                      From Christelle's Engineering Contact Form
                    </div>
                  </td>
                  <td align="right">
                    <span style="background-color: #064e3b; color: #34d399; border: 1px solid #059669; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 12px; font-family: monospace;">
                      ${isVerifiedCached ? '✓ VERIFIED (24H REDIS)' : '✓ VERIFIED SENDER'}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Sender Details Section -->
          <tr>
            <td style="padding: 24px 28px 12px 28px;">
              <table role="presentation" width="100%" style="border-collapse: collapse; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                <tr>
                  <td style="padding: 10px 16px; border-bottom: 1px solid #e2e8f0; font-size: 12px; font-weight: 600; color: #64748b; width: 120px;">
                    Sender Name:
                  </td>
                  <td style="padding: 10px 16px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 700; color: #0f172a;">
                    ${name}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 16px; border-bottom: 1px solid #e2e8f0; font-size: 12px; font-weight: 600; color: #64748b;">
                    Sender Email:
                  </td>
                  <td style="padding: 10px 16px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 600; color: #2563eb; font-family: monospace;">
                    <a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 16px; border-bottom: 1px solid #e2e8f0; font-size: 12px; font-weight: 600; color: #64748b;">
                    Subject:
                  </td>
                  <td style="padding: 10px 16px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 600; color: #0f172a;">
                    ${safeSubject}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 16px; font-size: 12px; font-weight: 600; color: #64748b;">
                    Received At:
                  </td>
                  <td style="padding: 10px 16px; font-size: 12px; color: #64748b; font-family: monospace;">
                    ${timestamp}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message Body -->
          <tr>
            <td style="padding: 12px 28px 28px 28px;">
              <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 8px;">
                Message Body:
              </div>
              <div style="background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 18px; font-size: 14px; line-height: 1.6; color: #1e293b; white-space: pre-wrap; font-family: inherit;">
${message}
              </div>

              <!-- Quick Action Reply Button -->
              <div style="margin-top: 24px; text-align: center;">
                <a href="mailto:${email}?subject=Re: ${encodeURIComponent(safeSubject)}" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 600; padding: 12px 24px; border-radius: 8px; box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);">
                  Reply directly to ${name} (${email})
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 16px 28px; border-top: 1px solid #f1f5f9; text-align: center; font-size: 12px; color: #94a3b8;">
              This notification was generated from Christelle Mamekem Ngueguim's Portfolio. Sender verification state managed via Redis.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
