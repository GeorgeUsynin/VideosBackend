type TError = {
    message: string | null;
    field: string | null;
};

/**
 * Represents the error view model for creating or updating a video.
 */
export type CreateUpdateVideoErrorViewModel = {
    /**
     * List of error messages encountered during video creation or update.
     * Can be `null` if there are no errors.
     */
    errorsMessages: TError[] | null;
};
