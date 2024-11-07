import { Router } from 'express';
import * as RequestHandler from './videosRequestHandlers';

export const VideosRouter = Router();

const VideosController = {
    getAllVideos: RequestHandler.getAllVideosHandler,
    createVideo: RequestHandler.createVideoHandler,
};

VideosRouter.get('/', VideosController.getAllVideos);
VideosRouter.post('/', VideosController.createVideo);
