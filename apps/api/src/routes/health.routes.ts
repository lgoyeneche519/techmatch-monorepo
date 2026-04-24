import { Router } from "express";
import { healthCheck, dbHealthCheck } from "../controllers/health.controller";

const router = Router();

router.get("/", healthCheck);
router.get("/db", dbHealthCheck);

export default router;