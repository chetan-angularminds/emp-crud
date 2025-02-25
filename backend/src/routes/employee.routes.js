import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { employeeController } from "../controllers/index.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = express.Router();

router.use(authMiddleware);

router
    .route("/")
    .get(employeeController.getAllEmployees)
    .post(upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
    ]),employeeController.createEmployee);

router
    .route("/employee/:id")
    .get(employeeController.getEmployeeById)
    .post(employeeController.changePassword)
    .put(employeeController.updateEmployee)
    .delete(employeeController.deleteEmployee);

router
    .route("/employee/:id/profile-picture")
    .put(upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
    ]),employeeController.changeProfilePic)
    .delete(employeeController.deleteProfilePicture)
export default router;
