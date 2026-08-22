import { Router } from 'express';
import apiRouter from './api.routes';

const rootRouter = Router();

// Mount all /api/* routes
rootRouter.use('/api', apiRouter);

// Also mount at root for direct serverless function calls where /api prefix may be stripped
rootRouter.use('/', apiRouter);

export default rootRouter;
