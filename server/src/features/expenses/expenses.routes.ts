import express from 'express';
import { ExpensesController } from './expenses.controller.js';

const router = express.Router();
const expensesController = new ExpensesController();

router.get('/', (req, res) => expensesController.getExpenses(req, res));
router.get('/today', (req, res) => expensesController.getTodayTotal(req, res));
router.post('/', (req, res) => expensesController.addExpense(req, res));
router.delete('/:id', (req, res) => expensesController.deleteExpense(req, res));

export default router;
