import type { Request } from 'express';

// Request types
export type RequestWithBody<T> = Request<{}, {}, T>;
