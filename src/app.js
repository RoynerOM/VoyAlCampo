import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bibleRouter from './controllers/bibleController.js';

const app = express();

app.use(helmet())
app.use(cors());
app.use(express.json())
app.use("/api/v1/bible",bibleRouter)

export default app;


