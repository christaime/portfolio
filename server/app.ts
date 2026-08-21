import express, { Express } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import rootRouter from './routes';

/**
 * Creates and configures the Express application
 */
export async function createApp(): Promise<Express> {
  const app = express();

  // Parse JSON payloads
  app.use(express.json());

  // Mount API routes
  app.use(rootRouter);

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
