import { Resolutions } from '../constants';

/**
 * Represents the input model for updating an existing video.
 */
export type UpdateVideoInputModel = {
    /**
     * Updated title of the video.
     */
    title: string;

    /**
     * Updated author of the video.
     */
    author: string;

    /**
     * Updated list of available resolutions for the video.
     * Optional; can be `null` or omitted.
     */
    availableResolutions?: Resolutions[] | null;

    /**
     * Indicates if the video can be downloaded.
     * Optional; if not provided, defaults to current value.
     */
    canBeDownloaded?: boolean;

    /**
     * Minimum age restriction for the video.
     * Optional; can be `null` if no restriction is set.
     */
    minAgeRestriction?: number | null;

    /**
     * Updated publication date of the video.
     * Optional; if not provided, the existing publication date remains unchanged.
     */
    publicationDate?: string;
};
