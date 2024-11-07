import type { Resolutions } from './constants';

export type TVideo = {
    id: number;
    title: string;
    author: string;
    canBeDownloaded: boolean;
    minAgeRestriction: number | null;
    createdAt: string;
    publicationDate: string;
    availableResolutions: Resolutions[] | null;
};

export type DBType = {
    videos: TVideo[];
};

export const db: DBType = {
    videos: [],
};

export const setDB = (dataset?: DBType) => {
    if (!dataset) {
        db.videos = [];
        return;
    }

    db.videos = dataset.videos;
};
