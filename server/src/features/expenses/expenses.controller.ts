import { Request, Response } from 'express';
import { eq, and, sql } from 'drizzle-orm';
import { db, expenses } from '../../db/index.js';

export class ExpensesController {
    // Get user's expenses
    async getExpenses(req: Request, res: Response) {
        try {
            const userId = res.locals.userId;
            const { date, startDate, endDate } = req.query;

            let conditions = [eq(expenses.userId, userId)];

            if (date) {
                conditions.push(sql`DATE(${expenses.createdAt}) = DATE(${date})`);
            } else if (startDate && endDate) {
                conditions.push(
                    sql`DATE(${expenses.createdAt}) BETWEEN DATE(${startDate}) AND DATE(${endDate})`
                );
            }

            const userExpenses = await db.query.expenses.findMany({
                where: and(...conditions),
                orderBy: (expenses, { desc }) => [desc(expenses.createdAt)],
            });

            res.json({ expenses: userExpenses });
        } catch (error) {
            console.error('Get expenses error:', error);
            res.status(500).json({ error: 'Failed to get expenses' });
        }
    }

    // Get today's total
    async getTodayTotal(req: Request, res: Response) {
        try {
            const userId = res.locals.userId;

            const result = await db
                .select({ total: sql<number>`SUM(${expenses.amount})` })
                .from(expenses)
                .where(
                    and(
                        eq(expenses.userId, userId),
                        sql`DATE(${expenses.createdAt}) = DATE('now', 'localtime')`
                    )
                );

            res.json({ total: result[0]?.total || 0 });
        } catch (error) {
            console.error('Get today total error:', error);
            res.status(500).json({ error: 'Failed to get today total' });
        }
    }

    // Add expense
    async addExpense(req: Request, res: Response) {
        try {
            const userId = res.locals.userId;
            const { amount, category, note } = req.body;

            if (!amount || !category) {
                return res.status(400).json({ error: 'Amount and category are required' });
            }

            const [expense] = await db
                .insert(expenses)
                .values({
                    userId,
                    amount,
                    category,
                    note: note || null,
                })
                .returning();

            res.status(201).json({ expense });
        } catch (error) {
            console.error('Add expense error:', error);
            res.status(500).json({ error: 'Failed to add expense' });
        }
    }

    // Delete expense
    async deleteExpense(req: Request, res: Response) {
        try {
            const userId = res.locals.userId;
            const { id } = req.params;

            // Verify ownership
            const expense = await db.query.expenses.findFirst({
                where: eq(expenses.id, parseInt(id)),
                columns: { userId: true },
            });

            if (!expense || expense.userId !== userId) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            await db.delete(expenses).where(eq(expenses.id, parseInt(id)));

            res.json({ success: true });
        } catch (error) {
            console.error('Delete expense error:', error);
            res.status(500).json({ error: 'Failed to delete expense' });
        }
    }
}
