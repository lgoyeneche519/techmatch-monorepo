const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

export interface CatalogProduct {
    id: number;
    name: string;
    model: string | null;
    description: string | null;
    image_url: string | null;
    brand: string;
    category: string;
    min_price: number | null;
    score: number | null;
}

export interface PriceEntry {
    store_id: number;
    store_name: string;
    store_url: string | null;
    price: number;
    original_price: number | null;
    currency: string;
    availability: string | null;
    url: string | null;
}

export interface ProductDetail extends CatalogProduct {
    specifications: Record<string, unknown> | null;
    prices: PriceEntry[];
}

export interface FiltersData {
    categories: string[];
    brands: string[];
    priceRange: { min: number; max: number };
}

export interface ProductFilters {
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: "price_asc" | "price_desc" | "score_desc" | "name_asc";
    search?: string;
}

export const fetchProducts = async (
    filters: ProductFilters = {}
): Promise<CatalogProduct[]> => {
    const params = new URLSearchParams();
    if (filters.category) params.set("category", filters.category);
    if (filters.brand) params.set("brand", filters.brand);
    if (filters.minPrice !== undefined) params.set("minPrice", String(filters.minPrice));
    if (filters.maxPrice !== undefined) params.set("maxPrice", String(filters.maxPrice));
    if (filters.sortBy) params.set("sortBy", filters.sortBy);
    if (filters.search) params.set("search", filters.search);

    const res = await fetch(`${API_URL}/api/products?${params.toString()}`);
    if (!res.ok) throw new Error("Error fetching products");
    const json = await res.json();
    return json.data;
};

export const fetchProductById = async (id: number): Promise<ProductDetail> => {
    const res = await fetch(`${API_URL}/api/products/${id}`);
    if (!res.ok) throw new Error("Product not found");
    const json = await res.json();
    return json.data;
};

export const fetchFiltersData = async (): Promise<FiltersData> => {
    const res = await fetch(`${API_URL}/api/products/filters`);
    if (!res.ok) throw new Error("Error fetching filters");
    const json = await res.json();
    return json.data;
};