import { db } from '../../db';
import { Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../constants';

export const getAllVideosHandler = (req: Request, res: Response) => {
    const allVideos = db.videos;

    res.status(HTTP_STATUS_CODES.OK_200).send(allVideos);
};
