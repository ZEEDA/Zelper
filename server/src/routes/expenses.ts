import express, { Request, Response } from 'express';
import { dbRun, dbGet, dbAll } from '../db.js';

const router = express.Router();

// Get user's expenses
router.get('/', async (req: Request, res: Response) => {
    try {
        const userId = res.locals.userId;
        const { date, startDate, endDate } = req.query;

        let query = 'SELECT * FROM expenses WHERE user_id = ?';
        const params: any[] = [userId];

        if (date) {
            query += ' AND DATE(created_at) = DATE(?)';
            params.push(date);
        } else if (startDate && endDate) {
            query += ' AND DATE(created_at) BETWEEN DATE(?) AND DATE(?)';
            params.push(startDate, endDate);
        }

        query += ' ORDER BY created_at DESC';

        const expenses = await dbAll(query, params);
        res.json({ expenses });
    } catch (error) {
        console.error('Get expenses error:', error);
        res.status(500).json({ error: 'Failed to get expenses' });
    }
});

// Get today's total
router.get('/today', async (req: Request, res: Response) => {
    try {
        const userId = res.locals.userId;

        const result = await dbGet<any>(
            `SELECT SUM(amount) as total FROM expenses 
       WHERE user_id = ? AND DATE(created_at) = DATE('now', 'localtime')`,
            [userId]
        );

        res.json({ total: result?.total || 0 });
    } catch (error) {
        console.error('Get today total error:', error);
        res.status(500).json({ error: 'Failed to get today total' });
    }
});

// Add expense
router.post('/', async (req: Request, res: Response) => {
    try {
        const userId = res.locals.userId;
        const { amount, category, note } = req.body;

        if (!amount || !category) {
            return res.status(400).json({ error: 'Amount and category are required' });
        }

        const result = await dbRun(
            `INSERT INTO expenses (user_id, amount, category, note)
       VALUES (?, ?, ?, ?)`,
            [userId, amount, category, note || null]
        );

        const expenseId = (result as any).lastID;
        const expense = await dbGet('SELECT * FROM expenses WHERE id = ?', [expenseId]);

        res.status(201).json({ expense });
    } catch (error) {
        console.error('Add expense error:', error);
        res.status(500).json({ error: 'Failed to add expense' });
    }
});

// Delete expense
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const userId = res.locals.userId;
        const { id } = req.params;

        // Verify ownership
        const expense = await dbGet<any>('SELECT user_id FROM expenses WHERE id = ?', [id]);
        if (!expense || expense.user_id !== userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await dbRun('DELETE FROM expenses WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (error) {
        console.error('Delete expense error:', error);
        res.status(500).json({ error: 'Failed to delete expense' });
    }
});

export default router;
