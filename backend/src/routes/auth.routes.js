import express from "express";
import { authController } from "../controllers/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// Register endpoint
router.post("/register", authController.register);

// Login endpoint
router.post("/login", authController.login);

router.use(authMiddleware);
// Change password endpoint
router.post("/change-password", authController.changePassword);

router.get("/verify-user", authController.verifyUser);

router.get("/verify-admin", authController.isAdmin);

export default router;
