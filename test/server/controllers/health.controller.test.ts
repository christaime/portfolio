import { describe, it, expect, vi } from 'vitest';
import { Request, Response } from 'express';
import { HealthController } from '@/server/controllers/health.controller';

describe('HealthController', () => {
  it('returns 200 with health status and configuration flags', async () => {
    const req = {} as Request;
    const jsonMock = vi.fn();
    const statusMock = vi.fn().mockReturnValue({ json: jsonMock });
    const res = { status: statusMock } as unknown as Response;

    await HealthController.getHealth(req, res);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'ok',
        resendConfigured: expect.any(Boolean),
        upstashConfigured: expect.any(Boolean),
        recaptchaConfigured: expect.any(Boolean),
        timestamp: expect.any(String),
      })
    );
  });
});
