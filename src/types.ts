import type { Request } from 'express';
import { Resolutions } from './constants';

// Request types
export type RequestWithBody<T> = Request<{}, {}, T>;
