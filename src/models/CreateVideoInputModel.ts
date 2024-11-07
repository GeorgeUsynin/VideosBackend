import { Resolutions } from '../constants';

/**
 * Represents the model for creating a new video.
 */
export type CreateVideoInputModel = {
    /**
     * Title for the newly created video.
     */
    title: string;

    /**
     * Author of the newly created video.
     */
    author: string;

    /**
     * List of available resolutions for the newly created video.
     * Can be `null`.
     */
    availableResolutions: Resolutions[] | null;
};
