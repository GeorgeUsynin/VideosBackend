import type { TVideo, DBType } from '../db';
import { Resolutions } from '../constants';

const video1: TVideo = {
    id: 1,
    title: 'Learning TypeScript',
    author: 'John Doe',
    canBeDownloaded: true,
    minAgeRestriction: 12,
    createdAt: '2024-01-15T10:00:00Z',
    publicationDate: '2024-01-20T12:00:00Z',
    availableResolutions: [Resolutions.P720, Resolutions.P1080],
};

const video2: TVideo = {
    id: 2,
    title: 'JavaScript Basics',
    author: 'Jane Smith',
    canBeDownloaded: false,
    minAgeRestriction: null,
    createdAt: '2024-02-10T14:30:00Z',
    publicationDate: '2024-02-15T16:00:00Z',
    availableResolutions: [Resolutions.P360, Resolutions.P720],
};

const video3: TVideo = {
    id: 3,
    title: 'Advanced React',
    author: 'Alice Cooper',
    canBeDownloaded: true,
    minAgeRestriction: 16,
    createdAt: '2024-03-05T09:00:00Z',
    publicationDate: '2024-03-10T11:00:00Z',
    availableResolutions: [Resolutions.P1080, Resolutions.P2160],
};

export const dataset: DBType = {
    videos: [video1, video2, video3],
};
