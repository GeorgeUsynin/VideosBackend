import { Resolutions } from '../constants';

/**
 * Represents the view model for a video.
 */
export type VideoViewModel = {
    /**
     * ID of the requested video.
     */
    id: number;

    /**
     * Title of the video.
     */
    title: string;

    /**
     * Author of the video.
     */
    author: string;

    /**
     * Indicates if the video can be downloaded.
     */
    canBeDownloaded: boolean;

    /**
     * Minimum age restriction for viewing the video.
     * If `null`, there is no age restriction.
     */
    minAgeRestriction: number | null;

    /**
     * Date and time when the video was created.
     */
    createdAt: string;

    /**
     * Date and time when the video was published.
     */
    publicationDate: string;

    /**
     * List of available resolutions for the video.
     * If `null`, no specific resolutions are available.
     */
    availableResolutions: Resolutions[] | null;
};
