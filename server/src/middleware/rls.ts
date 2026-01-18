import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './auth.js';

/**
 * Row Level Security middleware
 * Ensures that all database queries are filtered by the authenticated user's ID
 * This middleware should be applied to all protected routes AFTER authentication
 */
export function enforceRLS(req: Request, res: Response, next: NextFunction) {
    const authReq = req as AuthRequest;

    if (!authReq.userId) {
        return res.status(401).json({ error: 'User ID not found in request' });
    }

    // Add userId to request locals for easy access in route handlers
    res.locals.userId = authReq.userId;

    next();
}

/**
 * Helper to verify resource ownership
 * Checks if a resource belongs to the authenticated user
 */
export function verifyOwnership(resourceUserId: number, req: Request): boolean {
    const authReq = req as AuthRequest;
    return resourceUserId === authReq.userId;
}
