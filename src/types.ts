import type { Request } from 'express';

// Request types
export type RequestWithBody<T> = Request<{}, {}, T>;
export type RequestWithParamsAndBody<P, T> = Request<P, {}, T>;
