import { createContext, useContext, useState, ReactNode } from "react";
import type { CatalogProduct } from "../api/products";

interface ComparatorContextType {
    selected: CatalogProduct[];
    addProduct: (product: CatalogProduct) => boolean;
    removeProduct: (id: number) => void;
    isSelected: (id: number) => boolean;
    clearAll: () => void;
}

const ComparatorContext = createContext<ComparatorContextType | null>(null);

export const ComparatorProvider = ({ children }: { children: ReactNode }) => {
    const [selected, setSelected] = useState<CatalogProduct[]>([]);

    const addProduct = (product: CatalogProduct): boolean => {
        if (selected.length >= 3) return false;
        if (selected.find((p) => p.id === product.id)) return true;
        setSelected((prev) => [...prev, product]);
        return true;
    };

    const removeProduct = (id: number) => {
        setSelected((prev) => prev.filter((p) => p.id !== id));
    };

    const isSelected = (id: number) => selected.some((p) => p.id === id);

    const clearAll = () => setSelected([]);

    return (
        <ComparatorContext.Provider
            value={{ selected, addProduct, removeProduct, isSelected, clearAll }}
        >
            {children}
        </ComparatorContext.Provider>
    );
};

export const useComparator = () => {
    const ctx = useContext(ComparatorContext);
    if (!ctx) throw new Error("useComparator must be used within ComparatorProvider");
    return ctx;
};