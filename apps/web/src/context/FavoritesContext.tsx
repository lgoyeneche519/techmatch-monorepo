import { createContext, useContext, useState, ReactNode } from "react";
import type { CatalogProduct } from "../api/products";

interface FavoritesContextType {
    favorites: CatalogProduct[];
    toggleFavorite: (product: CatalogProduct) => void;
    isFavorite: (id: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
    const [favorites, setFavorites] = useState<CatalogProduct[]>([]);

    const toggleFavorite = (product: CatalogProduct) => {
        setFavorites((prev) =>
            prev.find((p) => p.id === product.id)
                ? prev.filter((p) => p.id !== product.id)
                : [...prev, product]
        );
    };

    const isFavorite = (id: number) => favorites.some((p) => p.id === id);

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    const ctx = useContext(FavoritesContext);
    if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
    return ctx;
};