import { db } from '../../db';
import { Response } from 'express';
import { HTTP_STATUS_CODES } from '../../constants';
import type { RequestWithBody } from '../../types';
import type { CreateVideoInputModel, VideoViewModel, CreateUpdateVideoErrorViewModel } from '../../models';

const inputValidation = (video: CreateVideoInputModel): CreateUpdateVideoErrorViewModel => {
    const { author, title, availableResolutions } = video;

    //why error if CreateUpdateVideoErrorViewModel also null?
    const errorsMessages: CreateUpdateVideoErrorViewModel['errorsMessages'] = [];

    const isValidAvailableResolutions =
        availableResolutions === undefined ||
        availableResolutions === null ||
        (Array.isArray(availableResolutions) && availableResolutions.length > 0);

    const isValidTitle = typeof title === 'string' && Boolean(title.trim());
    const isValidAuthor = typeof author === 'string' && Boolean(author.trim());

    if (!isValidAvailableResolutions) {
        errorsMessages.push({
            message: 'Available resolutions should be null or an array with at least one resolution',
            field: 'availableResolutions',
        });
    }

    if (!isValidAuthor) {
        errorsMessages.push({
            message: 'Author is required and should be a string',
            field: 'author',
        });
    }

    if (!isValidTitle) {
        errorsMessages.push({
            message: 'Title is required and should be a string',
            field: 'title',
        });
    }

    return { errorsMessages: errorsMessages.length > 0 ? errorsMessages : null };
};

const mapRequestedPayloadToViewModel = (payload: CreateVideoInputModel): VideoViewModel => {
    const today = new Date();
    const nextDay = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    return {
        id: +today,
        author: payload.author,
        availableResolutions: payload.availableResolutions ?? null,
        canBeDownloaded: false,
        createdAt: today.toISOString(),
        minAgeRestriction: null,
        publicationDate: nextDay.toISOString(),
        title: payload.title,
    };
};

export const createVideoHandler = (
    req: RequestWithBody<CreateVideoInputModel>,
    res: Response<VideoViewModel | CreateUpdateVideoErrorViewModel>
) => {
    const payload = req.body;
    const errors = inputValidation(payload);

    if (Array.isArray(errors.errorsMessages)) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST_400).send(errors);
        return;
    }

    const createdVideo = mapRequestedPayloadToViewModel(payload);

    db.videos.push(createdVideo);

    res.status(HTTP_STATUS_CODES.CREATED_201).send(createdVideo);
};
