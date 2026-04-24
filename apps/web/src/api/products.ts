import type { Product } from "../types/product";

interface ProductsResponse {
    message: string;
    data: Product[];
}

export const getProducts = async (): Promise<Product[]> => {
    const response = await fetch("http://localhost:3001/api/products");

    if (!response.ok) {
        throw new Error("No fue posible obtener los productos");
    }

    const result: ProductsResponse = await response.json();
    return result.data;
};