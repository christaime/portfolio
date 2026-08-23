import { Router } from 'express';
import apiRouter from './api.routes.js';

const rootRouter = Router();

// Mount all /api/* routes
rootRouter.use('/api', apiRouter);

export default rootRouter;
