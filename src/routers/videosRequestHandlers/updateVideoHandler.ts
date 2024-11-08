import { db } from '../../db';
import { Response } from 'express';
import { HTTP_STATUS_CODES } from '../../constants';
import type { RequestWithParamsAndBody } from '../../types';
import type {
    UpdateVideoInputModel,
    VideoViewModel,
    CreateUpdateVideoErrorViewModel,
    URIParamsVideoIDModel,
} from '../../models';
import { createInputValidation } from './createVideoHandler';

const updateInputValidation = (
    video: UpdateVideoInputModel,
    existedPublicationDate: string
): CreateUpdateVideoErrorViewModel => {
    const { errorsMessages: createErrorMessages } = createInputValidation(video);

    const { canBeDownloaded, minAgeRestriction, publicationDate } = video;

    const updateErrorsMessages: CreateUpdateVideoErrorViewModel['errorsMessages'] = [];

    const isValidCanBeDownloaded = typeof canBeDownloaded === undefined || typeof canBeDownloaded === 'boolean';

    const isValidMinAgeRestriction =
        typeof minAgeRestriction === undefined ||
        typeof minAgeRestriction === null ||
        (typeof minAgeRestriction === 'number' && minAgeRestriction >= 1 && minAgeRestriction <= 18);

    const isValidPublicationDate =
        typeof publicationDate === undefined ||
        (typeof publicationDate === 'string' && publicationDate >= existedPublicationDate);

    if (!isValidCanBeDownloaded) {
        updateErrorsMessages.push({
            message: 'CanBeDownloaded should be a boolean',
            field: 'canBeDownloaded',
        });
    }

    if (!isValidMinAgeRestriction) {
        updateErrorsMessages.push({
            message: 'Incorrect age value. Age should be between 1 and 18',
            field: 'minAgeRestriction',
        });
    }

    if (!isValidPublicationDate) {
        updateErrorsMessages.push({
            message: 'Publication date should be a string and should be more than created date plus one day',
            field: 'publicationDate',
        });
    }

    const getAllErrorMessages = () => {
        if (createErrorMessages) {
            if (updateErrorsMessages.length > 0) {
                return { errorsMessages: createErrorMessages.concat(updateErrorsMessages) };
            }
            return { errorsMessages: createErrorMessages };
        }
        return { errorsMessages: updateErrorsMessages.length > 0 ? updateErrorsMessages : null };
    };

    return getAllErrorMessages();
};

export const updateVideoHandler = (
    req: RequestWithParamsAndBody<URIParamsVideoIDModel, UpdateVideoInputModel>,
    res: Response<VideoViewModel | CreateUpdateVideoErrorViewModel>
) => {
    const id = +req.params.id;
    const payload = req.body;

    const updatedVideo = db.videos.find(video => video.id === id);

    if (!updatedVideo) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
        return;
    }

    const errors = updateInputValidation(payload, updatedVideo.publicationDate);

    if (Array.isArray(errors.errorsMessages)) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST_400).send(errors);
        return;
    }

    const videoAfterUpdate = { ...updatedVideo, ...payload };

    const index = db.videos.findIndex(video => video.id === id);
    db.videos.splice(index, 1, videoAfterUpdate);

    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
};
