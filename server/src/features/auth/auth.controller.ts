import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { eq, and, gt } from 'drizzle-orm';
import crypto from 'crypto';
import { db, users } from '../../db/index.js';
import { generateToken } from '../../middleware/auth.js';

export class AuthController {
    // Register new user
    async register(req: Request, res: Response) {
        try {
            const { email, password, name } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }

            // Check if user exists
            const existingUser = await db.query.users.findFirst({
                where: eq(users.email, email),
            });

            if (existingUser) {
                return res.status(409).json({ error: 'User already exists' });
            }

            // Hash password
            const passwordHash = await bcrypt.hash(password, 10);

            // Create user
            const [newUser] = await db
                .insert(users)
                .values({
                    email,
                    passwordHash,
                    name: name || null,
                })
                .returning({ id: users.id, email: users.email, name: users.name });

            // Generate token
            const token = generateToken({ userId: newUser.id, email: newUser.email });

            res.status(201).json({
                token,
                user: { id: newUser.id, email: newUser.email, name: newUser.name },
            });
        } catch (error: any) {
            console.error('Register error:', error);
            res.status(500).json({ error: 'Registration failed' });
        }
    }

    // Login user
    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }

            // Find user
            const user = await db.query.users.findFirst({
                where: eq(users.email, email),
            });

            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Verify password
            const isValid = await bcrypt.compare(password, user.passwordHash);
            if (!isValid) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Generate token
            const token = generateToken({ userId: user.id, email: user.email });

            res.json({
                token,
                user: { id: user.id, email: user.email, name: user.name },
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Login failed' });
        }
    }

    // Get current user
    async me(req: Request, res: Response) {
        try {
            const userId = res.locals.userId;

            const user = await db.query.users.findFirst({
                where: eq(users.id, userId),
                columns: {
                    id: true,
                    email: true,
                    name: true,
                    dailyBudget: true,
                },
            });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json({ user });
        } catch (error) {
            console.error('Get user error:', error);
            res.status(500).json({ error: 'Failed to get user' });
        }
    }

    // Forgot password
    async forgotPassword(req: Request, res: Response) {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({ error: 'Email is required' });
            }

            const user = await db.query.users.findFirst({
                where: eq(users.email, email),
            });

            if (!user) {
                // Return success even if user not found to prevent enumeration
                return res.json({ message: 'If an account exists, a reset email has been sent.' });
            }

            // Generate token
            const token = crypto.randomBytes(32).toString('hex');
            const tokenExpiry = new Date(Date.now() + 3600000); // 1 hour

            await db
                .update(users)
                .set({
                    resetToken: token,
                    resetTokenExpiry: tokenExpiry,
                })
                .where(eq(users.id, user.id));

            // In production, send email here
            console.log(`[DEV] Password reset link: http://localhost:5173/reset-password?token=${token}`);

            res.json({ message: 'If an account exists, a reset email has been sent.' });
        } catch (error) {
            console.error('Forgot password error:', error);
            res.status(500).json({ error: 'Failed to process request' });
        }
    }

    // Reset password
    async resetPassword(req: Request, res: Response) {
        try {
            const { token, password } = req.body;

            if (!token || !password) {
                return res.status(400).json({ error: 'Token and password are required' });
            }

            const user = await db.query.users.findFirst({
                where: and(
                    eq(users.resetToken, token),
                    gt(users.resetTokenExpiry, new Date())
                ),
            });

            if (!user) {
                return res.status(400).json({ error: 'Invalid or expired token' });
            }

            const passwordHash = await bcrypt.hash(password, 10);

            await db
                .update(users)
                .set({
                    passwordHash,
                    resetToken: null,
                    resetTokenExpiry: null,
                })
                .where(eq(users.id, user.id));

            res.json({ message: 'Password reset successfully' });
        } catch (error) {
            console.error('Reset password error:', error);
            res.status(500).json({ error: 'Failed to reset password' });
        }
    }
}
