import express from 'express';
import { authenticateToken } from '../../middleware/auth.js';
import { AuthController } from './auth.controller.js';
import { enforceRLS } from '../../middleware/rls.js';

const router = express.Router();
const authController = new AuthController();

// Public routes
router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.post('/forgot-password', (req, res) => authController.forgotPassword(req, res));
router.post('/reset-password', (req, res) => authController.resetPassword(req, res));

// Protected routes
router.get('/me', authenticateToken, enforceRLS, (req, res) => authController.me(req, res));

export default router;
