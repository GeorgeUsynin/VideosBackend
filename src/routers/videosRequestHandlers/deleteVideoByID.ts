import { db } from '../../db';
import { Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../constants';
import type { URIParamsVideoIDModel } from '../../models';

export const deleteVideoByID = (req: Request<URIParamsVideoIDModel>, res: Response) => {
    const id = +req.params.id;

    const foundVideo = db.videos.find(video => video.id === id);

    if (!foundVideo) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
        return;
    }

    const index = db.videos.findIndex(video => video.id === id);
    db.videos.splice(index, 1);

    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
};
