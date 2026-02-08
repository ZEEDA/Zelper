import { Request, Response } from 'express';
import { eq, and, sql } from 'drizzle-orm';
import { db, workSessions } from '../../db/index.js';

export class WorkController {
    // Get user's work sessions
    async getSessions(req: Request, res: Response) {
        try {
            const userId = res.locals.userId;
            const { date } = req.query;

            let conditions = [eq(workSessions.userId, userId)];

            if (date) {
                conditions.push(sql`DATE(${workSessions.checkInTime}) = DATE(${date})`);
            }

            const sessions = await db.query.workSessions.findMany({
                where: and(...conditions),
                orderBy: (workSessions, { desc }) => [desc(workSessions.checkInTime)],
            });

            res.json({ sessions });
        } catch (error) {
            console.error('Get sessions error:', error);
            res.status(500).json({ error: 'Failed to get sessions' });
        }
    }

    // Get today's session
    async getToday(req: Request, res: Response) {
        try {
            const userId = res.locals.userId;

            const session = await db.query.workSessions.findFirst({
                where: and(
                    eq(workSessions.userId, userId),
                    sql`DATE(${workSessions.checkInTime}) = DATE('now', 'localtime')`
                ),
                orderBy: (workSessions, { desc }) => [desc(workSessions.checkInTime)],
            });

            res.json({ data: session || null });
        } catch (error) {
            console.error('Get today session error:', error);
            res.status(500).json({ error: 'Failed to get today session' });
        }
    }

    // Check in
    async checkIn(req: Request, res: Response) {
        try {
            const userId = res.locals.userId;

            const [session] = await db
                .insert(workSessions)
                .values({
                    userId,
                    checkInTime: sql`datetime('now', 'localtime')`,
                    status: 'checked_in',
                    timelineJson: '[]',
                })
                .returning();

            res.status(201).json({ data: session });
        } catch (error) {
            console.error('Check-in error:', error);
            res.status(500).json({ error: 'Failed to check in' });
        }
    }

    // Check out
    async checkOut(req: Request, res: Response) {
        try {
            const userId = res.locals.userId;
            const { sessionId } = req.params;
            const { totalWorkMinutes, totalBreakMinutes } = req.body;

            // Verify ownership
            const session = await db.query.workSessions.findFirst({
                where: eq(workSessions.id, parseInt(sessionId)),
                columns: { userId: true },
            });

            if (!session || session.userId !== userId) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            const [updatedSession] = await db
                .update(workSessions)
                .set({
                    checkOutTime: sql`datetime('now', 'localtime')`,
                    status: 'checked_out',
                    totalWorkMinutes: totalWorkMinutes || 0,
                    totalBreakMinutes: totalBreakMinutes || 0,
                })
                .where(eq(workSessions.id, parseInt(sessionId)))
                .returning();

            res.json({ data: updatedSession });
        } catch (error) {
            console.error('Check-out error:', error);
            res.status(500).json({ error: 'Failed to check out' });
        }
    }

    // Update break status
    async updateBreak(req: Request, res: Response) {
        try {
            const userId = res.locals.userId;
            const { sessionId } = req.params;
            let { status } = req.body;

            if (status === 'start') {
                status = 'on_break';
                const [updatedSession] = await db
                    .update(workSessions)
                    .set({
                        status: 'on_break',
                        lastBreakStartTime: sql`datetime('now', 'localtime')`,
                    })
                    .where(eq(workSessions.id, parseInt(sessionId)))
                    .returning();
                return res.json({ data: updatedSession });

            } else if (status === 'end') {
                status = 'checked_in';

                // Get current session to check lastBreakStartTime
                const currentSession = await db.query.workSessions.findFirst({
                    where: eq(workSessions.id, parseInt(sessionId)),
                    columns: { lastBreakStartTime: true, totalBreakMinutes: true }
                });

                let additionalBreakMinutes = 0;
                if (currentSession?.lastBreakStartTime) {
                    const breakStart = new Date(currentSession.lastBreakStartTime).getTime();
                    const now = Date.now();
                    additionalBreakMinutes = Math.max(0, Math.floor((now - breakStart) / 60000));
                }

                const [updatedSession] = await db
                    .update(workSessions)
                    .set({
                        status: 'checked_in',
                        lastBreakStartTime: null,
                        totalBreakMinutes: (currentSession?.totalBreakMinutes || 0) + additionalBreakMinutes
                    })
                    .where(eq(workSessions.id, parseInt(sessionId)))
                    .returning();
                return res.json({ data: updatedSession });
            }

            // Fallback for direct status update if needed (or error)
            return res.status(400).json({ error: 'Invalid status action' });
        } catch (error) {
            console.error('Update break error:', error);
            res.status(500).json({ error: 'Failed to update break status' });
        }
    }

    // Update timeline
    async updateTimeline(req: Request, res: Response) {
        try {
            const userId = res.locals.userId;
            const { sessionId } = req.params;
            const { timeline } = req.body;

            // Verify ownership
            const session = await db.query.workSessions.findFirst({
                where: eq(workSessions.id, parseInt(sessionId)),
                columns: { userId: true },
            });

            if (!session || session.userId !== userId) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            await db
                .update(workSessions)
                .set({ timelineJson: JSON.stringify(timeline) })
                .where(eq(workSessions.id, parseInt(sessionId)));

            res.json({ success: true });
        } catch (error) {
            console.error('Update timeline error:', error);
            res.status(500).json({ error: 'Failed to update timeline' });
        }
    }
}
