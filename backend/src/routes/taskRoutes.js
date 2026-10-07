import { Router } from 'express';
import * as taskController from '../controllers/taskController.js';

export const taskRouter = Router();

taskRouter.get('/', taskController.getAllTasks);
taskRouter.get('/:id', taskController.getTask);
taskRouter.get('/online', taskController.getTasks);
taskRouter.post('/task', taskController.createTask);