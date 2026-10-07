import express from 'express';
import cors from 'cors';
import helmet from "helmet";
import { config } from './config/env.js';
import { taskRouter } from './routes/taskRoutes.js';
import cookieParser from "cookie-parser";
import {authRouter} from "./routes/auth.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors({
  origin: config.corsOrigin
}));

app.get('/', (_request, response) => {
  response.status(200).json({ status: 'API - Cours Dev Full stack' });
});
app.get('/api/health', (_request, response) => {
  response.status(200).json({ status: 'ok' });
});

app.use('/api/tasks', taskRouter);

app.use('/api/auth', authRouter);

export default app;
