import { Router } from "express";
import {
    findAllProducts,
    findProductById,
    findFiltersData,
} from "../controllers/products.controller";

const router = Router();

router.get("/", findAllProducts);
router.get("/filters", findFiltersData);
router.get("/:id", findProductById);

export default router;