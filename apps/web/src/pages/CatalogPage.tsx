import { useState, useEffect, useCallback } from "react";
import { fetchProducts } from "../api/products";
import type { CatalogProduct, ProductFilters } from "../api/products";
import ProductCard from "../components/ProductCard";
import FilterPanel from "../components/FilterPanel";
import CategoryBar from "../components/CategoryBar";

interface Props {
    searchQuery: string;
    onViewDetail: (id: number) => void;
}

const PAGE_SIZE = 12;

export default function CatalogPage({ searchQuery, onViewDetail }: Props) {
    const [products, setProducts] = useState<CatalogProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [filters, setFilters] = useState<ProductFilters>({});
    const [categories, setCategories] = useState<string[]>([]);
    const [page, setPage] = useState(1);

    const load = useCallback(
        async (f: ProductFilters) => {
            setLoading(true);
            setError(false);
            try {
                const data = await fetchProducts({ ...f, search: searchQuery || f.search });
                setProducts(data);
                setPage(1);
                window.scrollTo({ top: 0, behavior: "smooth" });
            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        },
        [searchQuery]
    );

    useEffect(() => { load(filters); }, [filters, load]);

    const handleCategoryChange = (partial: Partial<ProductFilters>) => {
        setFilters((prev) => ({ ...prev, ...partial }));
    };

    const totalPages = Math.ceil(products.length / PAGE_SIZE);
    const paginated = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const goToPage = (p: number) => {
        setPage(p);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <>
            <CategoryBar
                categories={categories}
                activeCategory={filters.category}
                onChange={handleCategoryChange}
            />

            <div className="catalog-layout">
                <FilterPanel
                    filters={filters}
                    onChange={setFilters}
                    onCategoriesLoaded={setCategories}
                />

                <main className="catalog-main">
                    <h1 className="catalog-title">Catálogo de productos</h1>
                    <p className="catalog-subtitle">
                        {loading
                            ? "Cargando..."
                            : `${products.length} productos disponibles — Página ${page} de ${totalPages}`}
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
                        {paginated.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onViewDetail={onViewDetail}
                            />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                className="pagination__btn"
                                onClick={() => goToPage(page - 1)}
                                disabled={page === 1}
                            >
                                <i className="ti ti-chevron-left" aria-hidden="true" />
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                                .reduce<(number | string)[]>((acc, p, idx, arr) => {
                                    if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
                                    acc.push(p);
                                    return acc;
                                }, [])
                                .map((p, idx) =>
                                    p === "..." ? (
                                        <span key={`dots-${idx}`} className="pagination__dots">…</span>
                                    ) : (
                                        <button
                                            key={p}
                                            className={`pagination__btn${page === p ? " pagination__btn--active" : ""}`}
                                            onClick={() => goToPage(p as number)}
                                        >
                                            {p}
                                        </button>
                                    )
                                )}

                            <button
                                className="pagination__btn"
                                onClick={() => goToPage(page + 1)}
                                disabled={page === totalPages}
                            >
                                <i className="ti ti-chevron-right" aria-hidden="true" />
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}