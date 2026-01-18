import express, { Request, Response } from 'express';
import { dbRun, dbGet, dbAll } from '../db.js';

const router = express.Router();

// Get user's books
router.get('/', async (req: Request, res: Response) => {
    try {
        const userId = res.locals.userId;
        const books = await dbAll(
            'SELECT * FROM books WHERE user_id = ? ORDER BY last_read_at DESC, created_at DESC',
            [userId]
        );
        res.json({ books });
    } catch (error) {
        console.error('Get books error:', error);
        res.status(500).json({ error: 'Failed to get books' });
    }
});

// Add book
router.post('/', async (req: Request, res: Response) => {
    try {
        const userId = res.locals.userId;
        const { title, type, totalPages, currentPage } = req.body;

        if (!title || !type || !totalPages) {
            return res.status(400).json({ error: 'Title, type, and total pages are required' });
        }

        const result = await dbRun(
            `INSERT INTO books (user_id, title, type, total_pages, current_page)
       VALUES (?, ?, ?, ?, ?)`,
            [userId, title, type, totalPages, currentPage || 0]
        );

        const bookId = (result as any).lastID;
        const book = await dbGet('SELECT * FROM books WHERE id = ?', [bookId]);

        res.status(201).json({ book });
    } catch (error) {
        console.error('Add book error:', error);
        res.status(500).json({ error: 'Failed to add book' });
    }
});

// Update book
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const userId = res.locals.userId;
        const { id } = req.params;
        const { currentPage } = req.body;

        // Verify ownership
        const book = await dbGet<any>('SELECT user_id FROM books WHERE id = ?', [id]);
        if (!book || book.user_id !== userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await dbRun(
            `UPDATE books SET current_page = ?, last_read_at = datetime('now', 'localtime') WHERE id = ?`,
            [currentPage, id]
        );

        const updatedBook = await dbGet('SELECT * FROM books WHERE id = ?', [id]);
        res.json({ book: updatedBook });
    } catch (error) {
        console.error('Update book error:', error);
        res.status(500).json({ error: 'Failed to update book' });
    }
});

// Delete book
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const userId = res.locals.userId;
        const { id } = req.params;

        // Verify ownership
        const book = await dbGet<any>('SELECT user_id FROM books WHERE id = ?', [id]);
        if (!book || book.user_id !== userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await dbRun('DELETE FROM books WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (error) {
        console.error('Delete book error:', error);
        res.status(500).json({ error: 'Failed to delete book' });
    }
});

// Log reading session
router.post('/:id/session', async (req: Request, res: Response) => {
    try {
        const userId = res.locals.userId;
        const { id } = req.params;
        const { startPage, endPage, durationMinutes } = req.body;

        // Verify ownership
        const book = await dbGet<any>('SELECT user_id FROM books WHERE id = ?', [id]);
        if (!book || book.user_id !== userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const result = await dbRun(
            `INSERT INTO reading_sessions (user_id, book_id, start_page, end_page, duration_minutes)
       VALUES (?, ?, ?, ?, ?)`,
            [userId, id, startPage, endPage, durationMinutes || null]
        );

        const sessionId = (result as any).lastID;
        const session = await dbGet('SELECT * FROM reading_sessions WHERE id = ?', [sessionId]);

        res.status(201).json({ session });
    } catch (error) {
        console.error('Log session error:', error);
        res.status(500).json({ error: 'Failed to log reading session' });
    }
});

export default router;
