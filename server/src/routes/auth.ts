import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { dbRun, dbGet } from '../db.js';
import { generateToken, authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// Register
router.post('/register', async (req: Request, res: Response) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Check if user exists
        const existingUser = await dbGet('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user
        const result = await dbRun(
            'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)',
            [email, passwordHash, name || null]
        );

        console.log('Success:', result);


        const user = await dbGet<{ id: number }>('SELECT id FROM users WHERE email = ?', [email]);

        if (!user) {
            throw new Error('User creation failed');
        }

        const userId = user.id;

        // Generate token
        const token = generateToken({ userId, email });

        res.status(201).json({
            token,
            user: { id: userId, email, name }
        });
    } catch (error: any) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        const user = await dbGet<any>(
            'SELECT id, email, password_hash, name FROM users WHERE email = ?',
            [email]
        );

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken({ userId: user.id, email: user.email });

        res.json({
            token,
            user: { id: user.id, email: user.email, name: user.name }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Get current user
router.get('/me', authenticateToken, async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthRequest).userId;

        const user = await dbGet<any>(
            'SELECT id, email, name, daily_budget FROM users WHERE id = ?',
            [userId]
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to get user' });
    }
});

export default router;
