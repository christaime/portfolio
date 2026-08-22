import { createApiApp } from '../server/apiApp';

// Export the Express instance as the default handler for Vercel Serverless Functions
const app = createApiApp();

export default app;
