import express, { Express } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { createApiApp } from './apiApp.js';

export { createApiApp };

/**
 * Creates and configures the full Express application with Vite dev middleware or production static asset hosting
 */
export async function createApp(): Promise<Express> {
  const app = createApiApp();

  // Development: Vite middleware
  // Production: Static assets from dist/
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  return app;
}
