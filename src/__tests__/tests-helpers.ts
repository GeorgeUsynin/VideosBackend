import { app } from '../app';
import { agent } from 'supertest';
import { CreateUpdateVideoErrorViewModel } from '../models';

export const request = agent(app);

type TValues = {
    title?: boolean;
    author?: boolean;
    availableResolutions?: boolean;
};

export const createErrorMessages = (values: TValues) => {
    const { title, author, availableResolutions } = values;

    const errorsMessages: CreateUpdateVideoErrorViewModel['errorsMessages'] = [];

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

    if (availableResolutions) {
        errorsMessages.push({
            message: 'Available resolutions should be null or an array with at least one resolution',
            field: 'availableResolutions',
        });
    }

    return { errorsMessages };
};
