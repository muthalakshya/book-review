import express from 'express';
import { loginUser, registerUser, adminLogin, getUserProfile, updateUserProfile } from '../controllers/userControler.js';
import upload from '../middleware/multers.js';
import authUser from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/register', upload.single('profilePhoto'),registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin', adminLogin)
userRouter.get('/profile', authUser, getUserProfile);
userRouter.put('/profile', authUser, upload.single('profilePhoto'), updateUserProfile);


export default userRouter;