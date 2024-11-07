import { app } from '../app';
import { agent } from 'supertest';

export const request = agent(app);
