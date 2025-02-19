import express from 'express';
import { authController } from '../controllers/index.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// Register endpoint
router.post('/register', authController.register);

// Login endpoint
router.post('/login', authController.login);

// Change password endpoint
router.post('/change-password',authMiddleware, authController.changePassword);

export default router;
