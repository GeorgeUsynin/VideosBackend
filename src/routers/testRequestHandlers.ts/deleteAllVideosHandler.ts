import { db } from '../../db';
import { Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../constants';

export const deleteAllVideosHandler = (req: Request, res: Response) => {
    db.videos = [];
    res.send(HTTP_STATUS_CODES.NO_CONTENT_204);
};
