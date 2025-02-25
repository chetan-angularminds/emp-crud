import { userController } from "../controllers/index.js";
import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router
    .route("/")
    .get(userController.getUserdetails)
    .put(userController.updateUser)
    .delete(userController.deleteAccount);

router.route("/profile-picture").put(upload.fields([{
    name: "avatar",
    maxCount: 1
},]), userController.changeProfilePicture)
.delete(userController.deleteProfilePicture)
export default router;