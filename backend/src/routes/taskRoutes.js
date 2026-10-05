import { Router } from 'express';
import * as taskController from '../controllers/taskController.js';

export const taskRouter = Router();

taskRouter.get('/', taskController.getAllTasks);