import { Router } from 'express';
import * as RequestHandler from './testRequestHandlers.ts';

export const TestRouter = Router();

const TestController = {
    deleteAllVideos: RequestHandler.deleteAllVideosHandler,
};

TestRouter.delete('/', TestController.deleteAllVideos);
