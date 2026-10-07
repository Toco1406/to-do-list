import { Router } from 'express';
import * as taskController from '../controllers/taskController.js';
import {authenticateToken} from "../middlewares/auth.middleware.js";

export const taskRouter = Router();

taskRouter.use(authenticateToken);
taskRouter.get('/', taskController.getAllTasks);
taskRouter.get('/my', taskController.getTasks);
taskRouter.get('/:id', taskController.getTask);
taskRouter.post('/', taskController.createTask);
taskRouter.patch('/:id', taskController.updateTask);
taskRouter.delete('/:id', taskController.deleteTask);