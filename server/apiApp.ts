import express, { Express } from 'express';
import rootRouter from './routes';
/**
 * Creates and configures the Express API application without Vite dependencies.
 * Used for Vercel Serverless Functions, standalone Node servers, and test suites.
 */
export function createApiApp(): Express {
  const app = express();

  // Parse JSON payloads
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  

  // Mount API routes
  app.use(rootRouter);

  return app;
}
