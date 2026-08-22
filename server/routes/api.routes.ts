import { Router } from 'express';
import { EmailController } from '../controllers/email.controller';
import { HealthController } from '../controllers/health.controller';

const router = Router();

// Health Check
router.get('/health', HealthController.getHealth);

// Email Verification & Contact Form Routes
router.post('/check-email-status', EmailController.checkEmailStatus);
router.post('/send-verification-code', EmailController.sendVerificationCode);
router.post('/verify-code', EmailController.verifyCode);
router.post('/send-email', EmailController.sendContactEmail);

export default router;
