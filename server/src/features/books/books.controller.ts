import { Request, Response } from 'express';
import { eq, sql, desc } from 'drizzle-orm';
import { db, books, readingSessions } from '../../db/index.js';

export class BooksController {
    // Get user's books
    async getBooks(req: Request, res: Response) {
        try {
            const userId = res.locals.userId;

            const userBooks = await db.query.books.findMany({
                where: eq(books.userId, userId),
                orderBy: [desc(books.lastReadAt), desc(books.createdAt)],
            });

            res.json({ books: userBooks });
        } catch (error) {
            console.error('Get books error:', error);
            res.status(500).json({ error: 'Failed to get books' });
        }
    }

    // Add book
    async addBook(req: Request, res: Response) {
        try {
            const userId = res.locals.userId;
            const { title, type, totalPages, currentPage } = req.body;

            if (!title || !type || !totalPages) {
                return res.status(400).json({ error: 'Title, type, and total pages are required' });
            }

            const [book] = await db
                .insert(books)
                .values({
                    userId,
                    title,
                    type,
                    totalPages,
                    currentPage: currentPage || 0,
                })
                .returning();

            res.status(201).json({ book });
        } catch (error) {
            console.error('Add book error:', error);
            res.status(500).json({ error: 'Failed to add book' });
        }
    }

    // Update book
    async updateBook(req: Request, res: Response) {
        try {
            const userId = res.locals.userId;
            const { id } = req.params;
            const { currentPage } = req.body;

            // Verify ownership
            const book = await db.query.books.findFirst({
                where: eq(books.id, parseInt(id)),
                columns: { userId: true },
            });

            if (!book || book.userId !== userId) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            const [updatedBook] = await db
                .update(books)
                .set({
                    currentPage,
                    lastReadAt: sql`datetime('now', 'localtime')`,
                })
                .where(eq(books.id, parseInt(id)))
                .returning();

            res.json({ book: updatedBook });
        } catch (error) {
            console.error('Update book error:', error);
            res.status(500).json({ error: 'Failed to update book' });
        }
    }

    // Delete book
    async deleteBook(req: Request, res: Response) {
        try {
            const userId = res.locals.userId;
            const { id } = req.params;

            // Verify ownership
            const book = await db.query.books.findFirst({
                where: eq(books.id, parseInt(id)),
                columns: { userId: true },
            });

            if (!book || book.userId !== userId) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            await db.delete(books).where(eq(books.id, parseInt(id)));

            res.json({ success: true });
        } catch (error) {
            console.error('Delete book error:', error);
            res.status(500).json({ error: 'Failed to delete book' });
        }
    }

    // Log reading session
    async logSession(req: Request, res: Response) {
        try {
            const userId = res.locals.userId;
            const { id } = req.params;
            const { startPage, endPage, durationMinutes } = req.body;

            // Verify ownership
            const book = await db.query.books.findFirst({
                where: eq(books.id, parseInt(id)),
                columns: { userId: true },
            });

            if (!book || book.userId !== userId) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            const [session] = await db
                .insert(readingSessions)
                .values({
                    userId,
                    bookId: parseInt(id),
                    startPage,
                    endPage,
                    durationMinutes: durationMinutes || null,
                })
                .returning();

            res.status(201).json({ session });
        } catch (error) {
            console.error('Log session error:', error);
            res.status(500).json({ error: 'Failed to log reading session' });
        }
    }
}
