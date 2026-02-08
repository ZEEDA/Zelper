import express from 'express';
import { TasksController } from './tasks.controller.js';

const router = express.Router();
const tasksController = new TasksController();

router.get('/', (req, res) => tasksController.getTasks(req, res));
router.post('/', (req, res) => tasksController.createTask(req, res));
router.put('/:id', (req, res) => tasksController.updateTask(req, res));
router.delete('/:id', (req, res) => tasksController.deleteTask(req, res));
router.put('/:id/complete', (req, res) => tasksController.toggleComplete(req, res));
router.put('/:id/timer', (req, res) => tasksController.updateTimer(req, res));

export default router;
