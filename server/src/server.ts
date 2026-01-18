import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './db.js';
import { authenticateToken } from './middleware/auth.js';
import { enforceRLS } from './middleware/rls.js';

// Import routes
import authRoutes from './routes/auth.js';
import workRoutes from './routes/work.js';
import tasksRoutes from './routes/tasks.js';
import booksRoutes from './routes/books.js';
import expensesRoutes from './routes/expenses.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
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
app.use((err: any, req: any, res: any, next: any) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Initialize database and start server
async function startServer() {
    try {
        await initializeDatabase();

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📊 Database: ${process.env.DATABASE_PATH || './database.sqlite'}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
