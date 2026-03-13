import { Request, Response } from "express";
import { getAllProducts } from "../services/products.service";

export const findAllProducts = (_req: Request, res: Response) => {
    const products = getAllProducts();

    res.json({
        message: "Products retrieved successfully",
        data: products
    });
};