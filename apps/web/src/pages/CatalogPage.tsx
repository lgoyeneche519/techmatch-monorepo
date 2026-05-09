import { useState, useEffect, useCallback } from "react";
import { fetchProducts } from "../api/products";
import type { CatalogProduct, ProductFilters } from "../api/products";
import ProductCard from "../components/ProductCard";
import FilterPanel from "../components/FilterPanel";
import ProductDetailPage from "./ProductDetailPage";

interface Props {
    searchQuery: string;
}

export default function CatalogPage({ searchQuery }: Props) {
    const [products, setProducts] = useState<CatalogProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [filters, setFilters] = useState<ProductFilters>({});
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

    const load = useCallback(
        async (f: ProductFilters) => {
            setLoading(true);
            setError(false);
            try {
                const data = await fetchProducts({ ...f, search: searchQuery || f.search });
                setProducts(data);
                window.scrollTo({ top: 0, behavior: "smooth" });
            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        },
        [searchQuery]
    );

    useEffect(() => {
        load(filters);
    }, [filters, load]);

    return (
        <>
            <div className="catalog-layout">
                <FilterPanel filters={filters} onChange={setFilters} />

                <main className="catalog-main">
                    <h1 className="catalog-title">Catálogo de productos</h1>
                    <p className="catalog-subtitle">
                        {loading ? "Cargando..." : `${products.length} productos disponibles`}
                    </p>

                    {error && (
                        <div className="catalog-error">
                            <span>⚠ No fue posible cargar el catálogo.</span>
                            <button onClick={() => load(filters)}>Reintentar</button>
                        </div>
                    )}

                    {!loading && !error && products.length === 0 && (
                        <div className="catalog-empty">
                            No se encontraron productos con los filtros seleccionados.
                        </div>
                    )}

                    <div className="catalog-grid">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onViewDetail={setSelectedProductId}
                            />
                        ))}
                    </div>
                </main>
            </div>

            {selectedProductId !== null && (
                <ProductDetailPage
                    productId={selectedProductId}
                    onClose={() => setSelectedProductId(null)}
                />
            )}
        </>
    );
}