import { Router } from 'express';
import * as RequestHandler from './videosRequestHandlers';

export const VideosRouter = Router();

const VideosController = {
    getAllVideos: RequestHandler.getAllVideosHandler,
    getVideoByID: RequestHandler.getVideoByIDHandler,
    createVideo: RequestHandler.createVideoHandler,
    updateVideo: RequestHandler.updateVideoHandler,
    deleteVideo: RequestHandler.deleteVideoByID,
};

VideosRouter.get('/', VideosController.getAllVideos);
VideosRouter.get('/:id', VideosController.getVideoByID);
VideosRouter.post('/', VideosController.createVideo);
VideosRouter.put('/:id', VideosController.updateVideo);
VideosRouter.delete('/:id', VideosController.deleteVideo);
