import express, { Request, Response } from 'express';
import { dbRun, dbGet, dbAll } from '../db.js';

const router = express.Router();

// Get user's tasks
router.get('/', async (req: Request, res: Response) => {
    try {
        const userId = res.locals.userId;
        const { sessionId } = req.query;

        let query = 'SELECT * FROM tasks WHERE user_id = ?';
        const params: any[] = [userId];

        if (sessionId) {
            query += ' AND work_session_id = ?';
            params.push(sessionId);
        }

        query += ' ORDER BY created_at DESC';

        const tasks = await dbAll(query, params);
        res.json({ tasks });
    } catch (error) {
        console.error('Get tasks error:', error);
        res.status(500).json({ error: 'Failed to get tasks' });
    }
});

// Create task
router.post('/', async (req: Request, res: Response) => {
    try {
        const userId = res.locals.userId;
        const { title, estimatedMinutes, workSessionId } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const result = await dbRun(
            `INSERT INTO tasks (user_id, title, estimated_minutes, work_session_id)
       VALUES (?, ?, ?, ?)`,
            [userId, title, estimatedMinutes || null, workSessionId || null]
        );

        const taskId = (result as any).lastID;
        const task = await dbGet('SELECT * FROM tasks WHERE id = ?', [taskId]);

        res.status(201).json({ task });
    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// Update task
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const userId = res.locals.userId;
        const { id } = req.params;
        const { title, estimatedMinutes, actualMinutes } = req.body;

        // Verify ownership
        const task = await dbGet<any>('SELECT user_id FROM tasks WHERE id = ?', [id]);
        if (!task || task.user_id !== userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await dbRun(
            `UPDATE tasks SET title = ?, estimated_minutes = ?, actual_minutes = ? WHERE id = ?`,
            [title, estimatedMinutes, actualMinutes, id]
        );

        const updatedTask = await dbGet('SELECT * FROM tasks WHERE id = ?', [id]);
        res.json({ task: updatedTask });
    } catch (error) {
        console.error('Update task error:', error);
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// Delete task
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const userId = res.locals.userId;
        const { id } = req.params;

        // Verify ownership
        const task = await dbGet<any>('SELECT user_id FROM tasks WHERE id = ?', [id]);
        if (!task || task.user_id !== userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await dbRun('DELETE FROM tasks WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (error) {
        console.error('Delete task error:', error);
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

// Toggle complete
router.put('/:id/complete', async (req: Request, res: Response) => {
    try {
        const userId = res.locals.userId;
        const { id } = req.params;
        const { completed } = req.body;

        // Verify ownership
        const task = await dbGet<any>('SELECT user_id FROM tasks WHERE id = ?', [id]);
        if (!task || task.user_id !== userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const completedAt = completed ? "datetime('now', 'localtime')" : 'NULL';
        await dbRun(
            `UPDATE tasks SET completed = ?, completed_at = ${completedAt} WHERE id = ?`,
            [completed ? 1 : 0, id]
        );

        const updatedTask = await dbGet('SELECT * FROM tasks WHERE id = ?', [id]);
        res.json({ task: updatedTask });
    } catch (error) {
        console.error('Toggle complete error:', error);
        res.status(500).json({ error: 'Failed to toggle complete' });
    }
});

// Start/stop timer
router.put('/:id/timer', async (req: Request, res: Response) => {
    try {
        const userId = res.locals.userId;
        const { id } = req.params;
        const { started } = req.body;

        // Verify ownership
        const task = await dbGet<any>('SELECT user_id FROM tasks WHERE id = ?', [id]);
        if (!task || task.user_id !== userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const startedAt = started ? "datetime('now', 'localtime')" : 'NULL';
        await dbRun(
            `UPDATE tasks SET started_at = ${startedAt} WHERE id = ?`,
            [id]
        );

        const updatedTask = await dbGet('SELECT * FROM tasks WHERE id = ?', [id]);
        res.json({ task: updatedTask });
    } catch (error) {
        console.error('Timer error:', error);
        res.status(500).json({ error: 'Failed to update timer' });
    }
});

export default router;
