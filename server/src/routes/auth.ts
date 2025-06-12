import express from 'express';
import { register, login, logout, getMe, updateProfile, changePassword } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.post('/logout', logout);
router.get('/me', getMe);
router.put('/profile', updateProfile);
router.put('/password', changePassword);

export default router;
