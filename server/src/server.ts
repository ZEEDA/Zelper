import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authenticateToken } from './middleware/auth.js';
import { enforceRLS } from './middleware/rls.js';

// Import feature routes
import authRoutes from './features/auth/auth.routes.js';
import workRoutes from './features/work/work.routes.js';
import tasksRoutes from './features/tasks/tasks.routes.js';
import booksRoutes from './features/books/books.routes.js';
import expensesRoutes from './features/expenses/expenses.routes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes (require authentication + RLS)
app.use('/api/work', authenticateToken, enforceRLS, workRoutes);
app.use('/api/tasks', authenticateToken, enforceRLS, tasksRoutes);
app.use('/api/books', authenticateToken, enforceRLS, booksRoutes);
app.use('/api/expenses', authenticateToken, enforceRLS, expensesRoutes);
app.use('/api/analytics', authenticateToken, enforceRLS); // TODO: implement
app.use('/api/sync', authenticateToken, enforceRLS); // TODO: implement

// Error handling middleware
app.use((err: any, _req: any, res: any, _next: any) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Database: ${process.env.DATABASE_PATH || './database.sqlite'}`);
});
