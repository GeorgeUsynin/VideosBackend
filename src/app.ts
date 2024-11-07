import cors from 'cors';
import express, { Request, Response } from 'express';
import { TestRouter, VideosRouter } from './routers';
import { SETTINGS } from './settings';
import { HTTP_STATUS_CODES } from './constants';

export const app = express(); // создать приложение

app.use(express.json()); // создание свойств-объектов body и query во всех реквестах
app.use(cors()); // разрешить любым фронтам делать запросы на наш бэк

app.use(SETTINGS.PATH.TESTING, TestRouter);
app.use(SETTINGS.PATH.VIDEOS, VideosRouter);

app.get('/', (req: Request, res: Response) => {
    res.status(HTTP_STATUS_CODES.OK_200).json({ version: '1.0' });
});
