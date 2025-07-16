import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bibleRouter from './controllers/bibleController.js';
import compression from 'compression';

const app = express();
app.use(compression());
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('Last-Modified', new Date().toUTCString());
    next();
});
app.use("/api/v1/bible", bibleRouter);

export default app;


