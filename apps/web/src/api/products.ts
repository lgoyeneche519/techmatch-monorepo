import type { Product } from "../types/product";

interface ProductsResponse {
    message: string;
    data: Product[];
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const getProducts = async (search?: string): Promise<Product[]> => {
    const url = search
        ? `${API_URL}/api/products?search=${encodeURIComponent(search)}`
        : `${API_URL}/api/products`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("No fue posible obtener los productos");
    }

    const result: ProductsResponse = await response.json();
    return result.data;
};