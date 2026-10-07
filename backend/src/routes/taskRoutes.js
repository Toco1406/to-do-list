import { Router } from 'express';
import * as taskController from '../controllers/taskController.js';

export const taskRouter = Router();

taskRouter.get('/', taskController.getAllTasks);
taskRouter.patch('/:id', taskController.updateTask);
taskRouter.delete('/:id', taskController.deleteTask);