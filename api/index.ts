console.log('=== API FUNCTION LOADED ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('VERCEL_ENV:', process.env.VERCEL_ENV);

import { createApiApp } from '../server/apiApp.js';

const app = createApiApp();

console.log('App created, routes mounted:');
console.log('  - /api/health');
console.log('  - /api/check-email-status');
console.log('  - /api/send-verification-code');
console.log('  - /api/verify-code');
console.log('  - /api/send-email');

export default app;

// For local testing
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 API Server running on http://localhost:${PORT}`);
    console.log(`📝 Health: http://localhost:${PORT}/api/health`);
  });
}