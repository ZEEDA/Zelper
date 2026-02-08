import express from 'express';
import { BooksController } from './books.controller.js';

const router = express.Router();
const booksController = new BooksController();

router.get('/', (req, res) => booksController.getBooks(req, res));
router.post('/', (req, res) => booksController.addBook(req, res));
router.put('/:id', (req, res) => booksController.updateBook(req, res));
router.delete('/:id', (req, res) => booksController.deleteBook(req, res));
router.post('/:id/session', (req, res) => booksController.logSession(req, res));

export default router;
