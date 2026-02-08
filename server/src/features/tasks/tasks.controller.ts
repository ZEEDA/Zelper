import { Request, Response } from 'express';
import { eq, and, sql } from 'drizzle-orm';
import { db, tasks } from '../../db/index.js';

export class TasksController {
    // Get user's tasks
    async getTasks(req: Request, res: Response) {
        try {
            const userId = res.locals.userId;
            const { sessionId } = req.query;

            let conditions = [eq(tasks.userId, userId)];

            if (sessionId) {
                conditions.push(eq(tasks.workSessionId, parseInt(sessionId as string)));
            }

            const userTasks = await db.query.tasks.findMany({
                where: and(...conditions),
                orderBy: (tasks, { desc }) => [desc(tasks.createdAt)],
            });

            res.json({ tasks: userTasks });
        } catch (error) {
            console.error('Get tasks error:', error);
            res.status(500).json({ error: 'Failed to get tasks' });
        }
    }

    // Create task
    async createTask(req: Request, res: Response) {
        try {
            const userId = res.locals.userId;
            const { title, estimatedMinutes, workSessionId } = req.body;

            if (!title) {
                return res.status(400).json({ error: 'Title is required' });
            }

            const [task] = await db
                .insert(tasks)
                .values({
                    userId,
                    title,
                    estimatedMinutes: estimatedMinutes || null,
                    workSessionId: workSessionId || null,
                })
                .returning();

            res.status(201).json({ task });
        } catch (error) {
            console.error('Create task error:', error);
            res.status(500).json({ error: 'Failed to create task' });
        }
    }

    // Update task
    async updateTask(req: Request, res: Response) {
        try {
            const userId = res.locals.userId;
            const { id } = req.params;
            const { title, estimatedMinutes, actualMinutes } = req.body;

            // Verify ownership
            const task = await db.query.tasks.findFirst({
                where: eq(tasks.id, parseInt(id)),
                columns: { userId: true },
            });

            if (!task || task.userId !== userId) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            const [updatedTask] = await db
                .update(tasks)
                .set({
                    title,
                    estimatedMinutes,
                    actualMinutes,
                })
                .where(eq(tasks.id, parseInt(id)))
                .returning();

            res.json({ task: updatedTask });
        } catch (error) {
            console.error('Update task error:', error);
            res.status(500).json({ error: 'Failed to update task' });
        }
    }

    // Delete task
    async deleteTask(req: Request, res: Response) {
        try {
            const userId = res.locals.userId;
            const { id } = req.params;

            // Verify ownership
            const task = await db.query.tasks.findFirst({
                where: eq(tasks.id, parseInt(id)),
                columns: { userId: true },
            });

            if (!task || task.userId !== userId) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            await db.delete(tasks).where(eq(tasks.id, parseInt(id)));

            res.json({ success: true });
        } catch (error) {
            console.error('Delete task error:', error);
            res.status(500).json({ error: 'Failed to delete task' });
        }
    }

    // Toggle complete
    async toggleComplete(req: Request, res: Response) {
        try {
            const userId = res.locals.userId;
            const { id } = req.params;
            const { completed } = req.body;

            // Verify ownership
            const task = await db.query.tasks.findFirst({
                where: eq(tasks.id, parseInt(id)),
                columns: { userId: true },
            });

            if (!task || task.userId !== userId) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            const [updatedTask] = await db
                .update(tasks)
                .set({
                    completed,
                    completedAt: completed ? sql`datetime('now', 'localtime')` : null,
                })
                .where(eq(tasks.id, parseInt(id)))
                .returning();

            res.json({ task: updatedTask });
        } catch (error) {
            console.error('Toggle complete error:', error);
            res.status(500).json({ error: 'Failed to toggle complete' });
        }
    }

    // Start/stop timer
    async updateTimer(req: Request, res: Response) {
        try {
            const userId = res.locals.userId;
            const { id } = req.params;
            const { status } = req.body;

            // Verify ownership
            const task = await db.query.tasks.findFirst({
                where: eq(tasks.id, parseInt(id)),
                columns: { userId: true },
            });

            if (!task || task.userId !== userId) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            const [updatedTask] = await db
                .update(tasks)
                .set({
                    startedAt: status === 'start' ? sql`datetime('now', 'localtime')` : null,
                    completedAt: status === 'stop' ? sql`datetime('now', 'localtime')` : null,
                })
                .where(eq(tasks.id, parseInt(id)))
                .returning();

            res.json({ task: updatedTask });
        } catch (error) {
            console.error('Timer error:', error);
            res.status(500).json({ error: 'Failed to update timer' });
        }
    }
}
