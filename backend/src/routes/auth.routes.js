import express from 'express';
import { authController } from '../controllers/index.js';

const router = express.Router();

// Register endpoint
router.post('/register', authController.register);

// Login endpoint
router.post('/login', authController.login);

export default router;
