import { Router } from 'express';
import apiRouter from './api.routes';

const rootRouter = Router();

// Mount all /api/* routes
rootRouter.use('/api', apiRouter);

export default rootRouter;
