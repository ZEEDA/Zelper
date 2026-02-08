import express from 'express';
import { WorkController } from './work.controller.js';

const router = express.Router();
const workController = new WorkController();

router.get('/sessions', (req, res) => workController.getSessions(req, res));
router.get('/today', (req, res) => workController.getToday(req, res));
router.post('/check-in', (req, res) => workController.checkIn(req, res));
router.put('/check-out/:sessionId', (req, res) => workController.checkOut(req, res));
router.put('/break/:sessionId', (req, res) => workController.updateBreak(req, res));
router.put('/timeline/:sessionId', (req, res) => workController.updateTimeline(req, res));

export default router;
