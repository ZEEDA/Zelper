import express, { Request, Response } from 'express';
import { dbRun, dbGet, dbAll } from '../db.js';

const router = express.Router();

// Get user's work sessions
router.get('/sessions', async (req: Request, res: Response) => {
    try {
        const userId = res.locals.userId;
        const { date } = req.query;

        let query = 'SELECT * FROM work_sessions WHERE user_id = ?';
        const params: any[] = [userId];

        if (date) {
            query += ' AND DATE(check_in_time) = DATE(?)';
            params.push(date);
        }

        query += ' ORDER BY check_in_time DESC';

        const sessions = await dbAll(query, params);
        res.json({ sessions });
    } catch (error) {
        console.error('Get sessions error:', error);
        res.status(500).json({ error: 'Failed to get sessions' });
    }
});

// Get today's session
router.get('/today', async (req: Request, res: Response) => {
    try {
        const userId = res.locals.userId;

        const session = await dbGet<any>(
            `SELECT * FROM work_sessions 
       WHERE user_id = ? AND DATE(check_in_time) = DATE('now', 'localtime')
       ORDER BY check_in_time DESC LIMIT 1`,
            [userId]
        );

        res.json({ session: session || null });
    } catch (error) {
        console.error('Get today session error:', error);
        res.status(500).json({ error: 'Failed to get today session' });
    }
});

// Check in
router.post('/check-in', async (req: Request, res: Response) => {
    try {
        const userId = res.locals.userId;

        const result = await dbRun(
            `INSERT INTO work_sessions (user_id, check_in_time, status, timeline_json)
       VALUES (?, datetime('now', 'localtime'), 'checked_in', '[]')`,
            [userId]
        );

        const sessionId = (result as any).lastID;

        const session = await dbGet(
            'SELECT * FROM work_sessions WHERE id = ?',
            [sessionId]
        );

        res.status(201).json({ session });
    } catch (error) {
        console.error('Check-in error:', error);
        res.status(500).json({ error: 'Failed to check in' });
    }
});

// Check out
router.put('/check-out/:sessionId', async (req: Request, res: Response) => {
    try {
        const userId = res.locals.userId;
        const { sessionId } = req.params;
        const { totalWorkMinutes, totalBreakMinutes } = req.body;

        // Verify ownership
        const session = await dbGet<any>(
            'SELECT user_id FROM work_sessions WHERE id = ?',
            [sessionId]
        );

        if (!session || session.user_id !== userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await dbRun(
            `UPDATE work_sessions 
       SET check_out_time = datetime('now', 'localtime'), 
           status = 'checked_out',
           total_work_minutes = ?,
           total_break_minutes = ?
       WHERE id = ?`,
            [totalWorkMinutes || 0, totalBreakMinutes || 0, sessionId]
        );

        const updatedSession = await dbGet(
            'SELECT * FROM work_sessions WHERE id = ?',
            [sessionId]
        );

        res.json({ session: updatedSession });
    } catch (error) {
        console.error('Check-out error:', error);
        res.status(500).json({ error: 'Failed to check out' });
    }
});

// Update break status
router.put('/break/:sessionId', async (req: Request, res: Response) => {
    try {
        const userId = res.locals.userId;
        const { sessionId } = req.params;
        const { status } = req.body; // 'on_break' or 'checked_in'

        // Verify ownership
        const session = await dbGet<any>(
            'SELECT user_id FROM work_sessions WHERE id = ?',
            [sessionId]
        );

        if (!session || session.user_id !== userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await dbRun(
            'UPDATE work_sessions SET status = ? WHERE id = ?',
            [status, sessionId]
        );

        const updatedSession = await dbGet(
            'SELECT * FROM work_sessions WHERE id = ?',
            [sessionId]
        );

        res.json({ session: updatedSession });
    } catch (error) {
        console.error('Update break error:', error);
        res.status(500).json({ error: 'Failed to update break status' });
    }
});

// Update timeline
router.put('/timeline/:sessionId', async (req: Request, res: Response) => {
    try {
        const userId = res.locals.userId;
        const { sessionId } = req.params;
        const { timeline } = req.body;

        // Verify ownership
        const session = await dbGet<any>(
            'SELECT user_id FROM work_sessions WHERE id = ?',
            [sessionId]
        );

        if (!session || session.user_id !== userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await dbRun(
            'UPDATE work_sessions SET timeline_json = ? WHERE id = ?',
            [JSON.stringify(timeline), sessionId]
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Update timeline error:', error);
        res.status(500).json({ error: 'Failed to update timeline' });
    }
});

export default router;
