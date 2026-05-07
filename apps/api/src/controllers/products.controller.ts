import { Request, Response } from "express";
import {
  getAllProducts,
  getProductById,
  getFiltersData,
} from "../services/products.service";

export const findAllProducts = async (req: Request, res: Response) => {
  try {
    const { category, brand, minPrice, maxPrice, sortBy, search } = req.query;

    const products = await getAllProducts({
      category: category as string | undefined,
      brand: brand as string | undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sortBy: sortBy as "price_asc" | "price_desc" | "score_desc" | "name_asc" | undefined,
      search: search as string | undefined,
    });

    res.status(200).json({ message: "Products retrieved successfully", data: products });
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({ message: "Error retrieving products", data: [] });
  }
};

export const findProductById = async (req: Request, res: Response) => {
  try {
    const product = await getProductById(Number(req.params.id));
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json({ message: "Product retrieved successfully", data: product });
  } catch (error) {
    console.error("Error retrieving product:", error);
    res.status(500).json({ message: "Error retrieving product" });
  }
};

export const findFiltersData = async (_req: Request, res: Response) => {
  try {
    const filters = await getFiltersData();
    res.status(200).json({ message: "Filters retrieved successfully", data: filters });
  } catch (error) {
    console.error("Error retrieving filters:", error);
    res.status(500).json({ message: "Error retrieving filters" });
  }
};