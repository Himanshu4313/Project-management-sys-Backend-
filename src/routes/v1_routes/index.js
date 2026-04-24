import { Router } from "express";
import healthcheckroutes from "./healthcheck.routes.js";
import authRoutes from "./auth.routes.js";

const router = Router();

router.use("/v1/healthcheck", healthcheckroutes);

router.use("/v1/users", authRoutes);

export default router;