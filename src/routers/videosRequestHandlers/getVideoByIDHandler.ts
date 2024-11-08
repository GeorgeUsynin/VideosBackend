import { db } from '../../db';
import { Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../constants';
import type { URIParamsVideoIDModel, VideoViewModel } from '../../models';

export const getVideoByIDHandler = (req: Request<URIParamsVideoIDModel>, res: Response<VideoViewModel>) => {
    const id = +req.params.id;

    const foundVideo = db.videos.find(video => video.id === id);

    if (!foundVideo) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
        return;
    }

    res.send(foundVideo);
};
