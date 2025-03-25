import express from 'express'
import upload from '../middleware/multers.js';
import adminAuth from '../middleware/adminAuth.js';
import {addBook, getAllBooks, getBookById, addReview, deleteBook, reviewBuEmail} from '../controllers/bookController.js';
import authUser from '../middleware/auth.js';

const bookRouter = express.Router();

bookRouter.post('/add', adminAuth, upload.single('bookImage'), addBook);
bookRouter.get('/all', getAllBooks);
bookRouter.get('/:id', getBookById);
bookRouter.post('/:id/review',authUser, addReview);
bookRouter.delete('/:id', adminAuth, deleteBook);
bookRouter.post("/review",authUser, reviewBuEmail)

export default bookRouter