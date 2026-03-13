import type { Product } from "../models/product.model";

const products: Product[] = [
    {
        id: "1",
        name: "iPhone 15",
        brand: "Apple",
        category: "Celular",
        price: 4500000,
        imageUrl: "",
        description: "Celular Apple de última generación"
    },
    {
        id: "2",
        name: "Galaxy S24",
        brand: "Samsung",
        category: "Celular",
        price: 4200000,
        imageUrl: "",
        description: "Celular Samsung de alta gama"
    }
];

export const getAllProducts = (): Product[] => {
    return products;
};