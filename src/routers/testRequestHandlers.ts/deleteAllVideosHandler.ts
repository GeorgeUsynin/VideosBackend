import { db } from '../../db';
import { Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../constants';

export const deleteAllVideosHandler = (req: Request, res: Response) => {
    db.videos = [];
    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
};
