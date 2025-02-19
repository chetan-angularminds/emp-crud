import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { employeeController } from "../controllers/index.js";
const router = express.Router();

router.use(authMiddleware);

router
    .route("/")
    .get(employeeController.getAllEmployees)
    .post(employeeController.createEmployee);

router
    .route("/employee/:id")
    .get(employeeController.getEmployeeById)
    .post(employeeController.changePassword)
    .put(employeeController.updateEmployee)
    .delete(employeeController.deleteEmployee);

export default router;
