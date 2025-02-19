import { orgController } from "../controllers/index.js";
import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router
    .route("/")
    .get(orgController.getOrganisationDetails)
    .post(orgController.createOrganisation)
    .put(orgController.updateOrganisation)
    .delete(orgController.deleteOrganisation);


export default router;