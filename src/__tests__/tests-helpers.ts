import { app } from '../app';
import { agent } from 'supertest';
import { CreateUpdateVideoErrorViewModel } from '../models';

export const request = agent(app);

type TValues = {
    title?: boolean;
    author?: boolean;
    availableResolutions?: boolean;
    canBeDownloaded?: boolean;
    minAgeRestriction?: boolean;
    publicationDate?: boolean;
};

export const createErrorMessages = (values: TValues) => {
    const { title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate } = values;

    const errorsMessages: CreateUpdateVideoErrorViewModel['errorsMessages'] = [];

    if (availableResolutions) {
        errorsMessages.push({
            message: 'Available resolutions should be null or an array with at least one resolution',
            field: 'availableResolutions',
        });
    }

    if (author) {
        errorsMessages.push({
            message: 'Author is required and should be a string',
            field: 'author',
        });
    }

    if (title) {
        errorsMessages.push({
            message: 'Title is required and should be a string',
            field: 'title',
        });
    }

    if (canBeDownloaded) {
        errorsMessages.push({
            message: 'CanBeDownloaded should be a boolean',
            field: 'canBeDownloaded',
        });
    }

    if (minAgeRestriction) {
        errorsMessages.push({
            message: 'Incorrect age value. Age should be between 1 and 18',
            field: 'minAgeRestriction',
        });
    }

    if (publicationDate) {
        errorsMessages.push({
            message: 'Publication date should be a string and should be more than created date plus one day',
            field: 'publicationDate',
        });
    }

    return { errorsMessages };
};
