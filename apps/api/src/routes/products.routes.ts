import { Router } from "express";
import { findAllProducts } from "../controllers/products.controller";

const router = Router();

router.get("/", findAllProducts);

export default router;