import { Request, Response } from "express";
import { getAllProducts } from "../services/products.service";

export const findAllProducts = async (_req: Request, res: Response) => {
  try {
    const products = await getAllProducts();

    res.status(200).json({
      message: "Products retrieved successfully",
      data: products,
    });
  } catch (error) {
    console.error("Error retrieving products:", error);

    res.status(500).json({
      message: "Error retrieving products",
      data: [],
    });
  }
};