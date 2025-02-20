import { userController } from "../controllers/index.js";
import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router
    .route("/")
    .get(userController.getUserdetails)
    .put(userController.updateUser)
    .delete(userController.deleteAccount)

export default router;