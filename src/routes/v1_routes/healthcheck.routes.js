import { Router } from "express";
import { healthCheckStatus } from "../../controllers/healthcheck.controllers.js";

const router = Router();

router
    .get("/",healthCheckStatus);

export default router;