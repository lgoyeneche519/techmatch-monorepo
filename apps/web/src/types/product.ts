export interface Product {
    id: number;
    name: string;
    model: string | null;
    description: string | null;
    image_url: string | null;
    brand: string;
    category: string;
    min_price: number | null;
}