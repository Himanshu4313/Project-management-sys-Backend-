import { Router } from "express";
import healthcheckroutes from "./healthcheck.routes.js";

const router = Router();

router
    .use("/v1/healthcheck",healthcheckroutes);


export default router;