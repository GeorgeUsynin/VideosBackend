import { createErrorMessages, request } from './tests-helpers';
import { setDB } from '../db';
import { SETTINGS } from '../settings';
import { dataset } from './dataset';
import { Resolutions, HTTP_STATUS_CODES } from '../constants';
import { CreateVideoInputModel, VideoViewModel, UpdateVideoInputModel } from '../models';

describe('/videos', () => {
    beforeEach(() => {
        setDB();
    });

    it('deletes all videos from database', async () => {
        //populating the database with 3 videos
        setDB(dataset);

        // checking if all videos are in the database
        await request.get(SETTINGS.PATH.VIDEOS).expect(HTTP_STATUS_CODES.OK_200, [...dataset.videos]);

        // deleting all videos
        await request.delete(SETTINGS.PATH.TESTING).expect(HTTP_STATUS_CODES.NO_CONTENT_204);
    });

    it('gets all available videos', async () => {
        // checking that there are no videos in the database
        await request.get(SETTINGS.PATH.VIDEOS).expect(HTTP_STATUS_CODES.OK_200, []);

        //populating the database with 3 videos
        setDB(dataset);

        // checking if all videos are in the database
        await request.get(SETTINGS.PATH.VIDEOS).expect(HTTP_STATUS_CODES.OK_200, [...dataset.videos]);
    });

    describe('video creation', () => {
        it('creates a new video', async () => {
            const newVideo: CreateVideoInputModel = {
                author: 'George Usynin',
                title: 'How to learn Node',
                availableResolutions: [Resolutions.P144],
            };

            const createdVideo: VideoViewModel = {
                id: expect.any(Number),
                title: newVideo.title,
                author: newVideo.author,
                canBeDownloaded: false,
                minAgeRestriction: null,
                createdAt: expect.any(String),
                publicationDate: expect.any(String),
                availableResolutions: [Resolutions.P144],
            };

            //creating new video
            const { body: newVideoBodyResponse } = await request
                .post(SETTINGS.PATH.VIDEOS)
                .send(newVideo)
                .expect(HTTP_STATUS_CODES.CREATED_201);

            expect(newVideoBodyResponse).toEqual(createdVideo);

            //checking that the video was created
            const { body: allVideosBodyResponse } = await request
                .get(SETTINGS.PATH.VIDEOS)
                .expect(HTTP_STATUS_CODES.OK_200);

            expect(allVideosBodyResponse).toEqual([createdVideo]);
        });

        it('returns 404 status code and error object if payload for new video was incorrect', async () => {
            //creating video without providing title
            //@ts-expect-error sending bad payload
            const newVideo1: CreateVideoInputModel = {
                author: 'George Usynin',
                availableResolutions: null,
            };

            const { body: errorBody1 } = await request
                .post(SETTINGS.PATH.VIDEOS)
                .send(newVideo1)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

            expect(createErrorMessages({ title: true })).toEqual(errorBody1);

            //creating video without providing author
            //@ts-expect-error sending bad payload
            const newVideo2: CreateVideoInputModel = {
                title: 'How to learn Node',
                availableResolutions: null,
            };

            const { body: errorBody2 } = await request
                .post(SETTINGS.PATH.VIDEOS)
                .send(newVideo2)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

            expect(createErrorMessages({ author: true })).toEqual(errorBody2);

            //creating video providing bad availableResolutions
            const newVideo3: CreateVideoInputModel = {
                author: 'George Usynin',
                title: 'How to learn Node',
                availableResolutions: [],
            };

            const { body: errorBody3 } = await request
                .post(SETTINGS.PATH.VIDEOS)
                .send(newVideo3)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

            expect(createErrorMessages({ availableResolutions: true })).toEqual(errorBody3);

            //creating video providing bad availableResolutions
            const newVideo4: CreateVideoInputModel = {
                author: 'George Usynin',
                title: 'How to learn Node',
                //@ts-expect-error sending bad payload
                availableResolutions: {},
            };

            const { body: errorBody4 } = await request
                .post(SETTINGS.PATH.VIDEOS)
                .send(newVideo4)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

            expect(createErrorMessages({ availableResolutions: true })).toEqual(errorBody4);

            //creating video without providing required parameters
            //@ts-expect-error sending bad payload
            const newVideo5: CreateVideoInputModel = {};

            const { body: errorBody5 } = await request
                .post(SETTINGS.PATH.VIDEOS)
                .send(newVideo5)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

            expect(createErrorMessages({ author: true, title: true })).toEqual(errorBody5);
        });
    });

    describe('video requesting', () => {
        it('returns video by requested id', async () => {
            //populating database
            setDB(dataset);

            const requestedId = 2;
            //requesting video by id
            await request
                .get(`${SETTINGS.PATH.VIDEOS}/${requestedId}`)
                .expect(HTTP_STATUS_CODES.OK_200, dataset.videos[1]);
        });

        it('returns 404 status code if there is no requested video in database', async () => {
            const requestedId = 2;
            //requesting video by id
            await request.get(`${SETTINGS.PATH.VIDEOS}/${requestedId}`).expect(HTTP_STATUS_CODES.NOT_FOUND_404);
        });
    });

    describe('video updating', () => {
        const updatedVideoPayload: UpdateVideoInputModel = {
            author: 'George Usynin',
            title: 'How to learn Node',
            availableResolutions: [Resolutions.P1440, Resolutions.P240],
            canBeDownloaded: true,
            minAgeRestriction: 5,
            publicationDate: new Date().toISOString(),
        };

        it('updates requested video', async () => {
            //populating database
            setDB(dataset);

            const requestedId = 2;
            //updating video by id
            await request
                .put(`${SETTINGS.PATH.VIDEOS}/${requestedId}`)
                .send(updatedVideoPayload)
                .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

            //checking that requested video was updated correctly
            await request.get(`${SETTINGS.PATH.VIDEOS}/${requestedId}`).expect(HTTP_STATUS_CODES.OK_200, {
                ...updatedVideoPayload,
                id: expect.any(Number),
                createdAt: expect.any(String),
            } as VideoViewModel);
        });

        it('returns 404 status code if there is no video with provided id in database', async () => {
            //populating database
            setDB(dataset);

            const requestedId = 999;

            //updating video by id
            await request
                .put(`${SETTINGS.PATH.VIDEOS}/${requestedId}`)
                .send(updatedVideoPayload)
                .expect(HTTP_STATUS_CODES.NOT_FOUND_404);
        });

        it('returns bad request status with error object if there is a validation error', async () => {
            //populating database
            setDB(dataset);

            const requestedId = 2;

            //updating video by id
            //required author
            //@ts-expect-error bad payload
            const badUpdatedVideoPayload1: UpdateVideoInputModel = {
                title: 'How to learn Node',
                availableResolutions: [Resolutions.P1440, Resolutions.P240],
                canBeDownloaded: true,
                minAgeRestriction: 5,
                publicationDate: new Date().toISOString(),
            };
            await request
                .put(`${SETTINGS.PATH.VIDEOS}/${requestedId}`)
                .send(badUpdatedVideoPayload1)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST_400, {
                    errorsMessages: [
                        {
                            message: 'Author is required and should be a string',
                            field: 'author',
                        },
                    ],
                });

            //updating video by id
            //required title
            //@ts-expect-error bad payload
            const badUpdatedVideoPayload2: UpdateVideoInputModel = {
                author: 'George Usynin',
                availableResolutions: [Resolutions.P1440, Resolutions.P240],
                canBeDownloaded: true,
                minAgeRestriction: 5,
                publicationDate: new Date().toISOString(),
            };
            await request
                .put(`${SETTINGS.PATH.VIDEOS}/${requestedId}`)
                .send(badUpdatedVideoPayload2)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST_400, {
                    errorsMessages: [
                        {
                            message: 'Title is required and should be a string',
                            field: 'title',
                        },
                    ],
                });

            //updating video by id
            //required proper availableResolutions format
            const badUpdatedVideoPayload3: UpdateVideoInputModel = {
                title: 'How to learn Node',
                author: 'George Usynin',
                availableResolutions: [],
                canBeDownloaded: true,
                minAgeRestriction: 5,
                publicationDate: new Date().toISOString(),
            };
            await request
                .put(`${SETTINGS.PATH.VIDEOS}/${requestedId}`)
                .send(badUpdatedVideoPayload3)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST_400, {
                    errorsMessages: [
                        {
                            message: 'Available resolutions should be null or an array with at least one resolution',
                            field: 'availableResolutions',
                        },
                    ],
                });

            //updating video by id
            //required proper availableResolutions format
            const badUpdatedVideoPayload4: UpdateVideoInputModel = {
                title: 'How to learn Node',
                author: 'George Usynin',
                //@ts-expect-error bad payload
                availableResolutions: {},
                canBeDownloaded: true,
                minAgeRestriction: 5,
                publicationDate: new Date().toISOString(),
            };
            await request
                .put(`${SETTINGS.PATH.VIDEOS}/${requestedId}`)
                .send(badUpdatedVideoPayload4)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST_400, {
                    errorsMessages: [
                        {
                            message: 'Available resolutions should be null or an array with at least one resolution',
                            field: 'availableResolutions',
                        },
                    ],
                });

            //updating video by id
            //required proper minAgeRestriction
            const badUpdatedVideoPayload5 = {
                title: 'How to learn Node',
                author: 'George Usynin',
                availableResolutions: [Resolutions.P1440, Resolutions.P240],
                canBeDownloaded: true,
                minAgeRestriction: 30,
                publicationDate: new Date().toISOString(),
            };
            await request
                .put(`${SETTINGS.PATH.VIDEOS}/${requestedId}`)
                .send(badUpdatedVideoPayload5)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST_400, {
                    errorsMessages: [
                        {
                            message: 'Incorrect age value. Age should be between 1 and 18',
                            field: 'minAgeRestriction',
                        },
                    ],
                });

            //updating video by id
            //required title and author, correct minAgeRestriction
            const badUpdatedVideoPayload6 = {
                availableResolutions: [Resolutions.P1440, Resolutions.P240],
                canBeDownloaded: true,
                minAgeRestriction: 30,
                publicationDate: new Date().toISOString(),
            };
            await request
                .put(`${SETTINGS.PATH.VIDEOS}/${requestedId}`)
                .send(badUpdatedVideoPayload6)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST_400, {
                    errorsMessages: [
                        {
                            message: 'Author is required and should be a string',
                            field: 'author',
                        },
                        {
                            message: 'Title is required and should be a string',
                            field: 'title',
                        },
                        {
                            message: 'Incorrect age value. Age should be between 1 and 18',
                            field: 'minAgeRestriction',
                        },
                    ],
                });
        });
    });

    describe('video deletion', () => {
        it('deletes video from database by providing ID', async () => {
            //populating database
            setDB(dataset);

            const requestedId = 2;

            await request.delete(`${SETTINGS.PATH.VIDEOS}/${requestedId}`).expect(HTTP_STATUS_CODES.NO_CONTENT_204);

            //checking that the video was deleted
            await request.get(`${SETTINGS.PATH.VIDEOS}/${requestedId}`).expect(HTTP_STATUS_CODES.NOT_FOUND_404);

            const videos = await request.get(SETTINGS.PATH.VIDEOS).expect(HTTP_STATUS_CODES.OK_200);
            expect((videos as unknown as []).length).toBe(2);
        });

        it('returns 404 status code if the video was not founded by requested ID', async () => {
            //populating database
            setDB(dataset);

            const requestedId = 999;

            await request.delete(`${SETTINGS.PATH.VIDEOS}/${requestedId}`).expect(HTTP_STATUS_CODES.NOT_FOUND_404);
        });
    });
});
