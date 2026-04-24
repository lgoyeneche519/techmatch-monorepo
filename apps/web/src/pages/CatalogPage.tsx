import { useEffect, useState, useCallback } from "react";
import { getProducts } from "../api/products";
import ProductCard from "../components/ProductCard";
import type { Product } from "../types/product";

interface CatalogPageProps {
    searchQuery: string;
}

const CatalogPage = ({ searchQuery }: CatalogPageProps) => {
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [filtered, setFiltered] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getProducts();
            setAllProducts(data);
            setFiltered(data);
        } catch {
            setError("No fue posible cargar el catálogo. Verifica tu conexión.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadProducts(); }, [loadProducts]);

    // Filtro client-side — SCRUM-6 y SCRUM-27
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFiltered(allProducts);
        } else {
            const q = searchQuery.toLowerCase();
            setFiltered(allProducts.filter((p) =>
                p.name.toLowerCase().includes(q)
            ));
        }
    }, [searchQuery, allProducts]);

    return (
        <main style={{
            flex: 1,
            maxWidth: "1280px",
            margin: "0 auto",
            width: "100%",
            padding: "32px 24px",
        }}>
            {/* Header */}
            <div style={{ marginBottom: "28px" }}>
                {searchQuery ? (
                    <div>
                        <h1 style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)" }}>
                            Resultados para "{searchQuery}"
                        </h1>
                        {!loading && (
                            <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
                                {filtered.length} {filtered.length === 1 ? "producto encontrado" : "productos encontrados"}
                            </p>
                        )}
                    </div>
                ) : (
                    <div>
                        <h1 style={{ fontSize: "26px", fontWeight: 700, color: "var(--text-primary)" }}>
                            Catálogo de productos
                        </h1>
                        {!loading && (
                            <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
                                {allProducts.length} productos disponibles
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Error */}
            {error && !loading && (
                <div style={{
                    background: "#fef2f2", border: "1px solid #fecaca",
                    borderRadius: "12px", padding: "20px 24px",
                    display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px",
                }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <div>
                        <p style={{ fontSize: "14px", fontWeight: 500, color: "#b91c1c" }}>{error}</p>
                        <button onClick={loadProducts} style={{
                            fontSize: "13px", color: "#dc2626", background: "none",
                            border: "none", cursor: "pointer", padding: 0,
                            marginTop: "4px", textDecoration: "underline",
                        }}>
                            Reintentar
                        </button>
                    </div>
                </div>
            )}

            {/* Skeleton loader */}
            {loading && (
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                    gap: "20px",
                }}>
                    {Array.from({ length: 9 }).map((_, i) => (
                        <div key={i} style={{
                            backgroundColor: "white",
                            borderRadius: "12px",
                            border: "1px solid #e5e7eb",
                            overflow: "hidden",
                        }}>
                            <div style={{
                                height: "200px",
                                background: "linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)",
                                backgroundSize: "200% 100%",
                                animation: "shimmer 1.5s infinite",
                            }} />
                            <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                                <div style={{ height: "12px", width: "40%", borderRadius: "4px", background: "#e5e7eb" }} />
                                <div style={{ height: "16px", width: "85%", borderRadius: "4px", background: "#e5e7eb" }} />
                                <div style={{ height: "16px", width: "65%", borderRadius: "4px", background: "#e5e7eb" }} />
                                <div style={{ height: "20px", width: "45%", borderRadius: "4px", background: "#e5e7eb", marginTop: "4px" }} />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Sin resultados de búsqueda — SCRUM-27 */}
            {!loading && !error && searchQuery && filtered.length === 0 && (
                <div style={{
                    textAlign: "center", padding: "80px 24px",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: "16px",
                }}>
                    <div style={{
                        width: "64px", height: "64px", borderRadius: "50%",
                        background: "var(--brand-light)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                    </div>
                    <div>
                        <p style={{ fontSize: "18px", fontWeight: 600, color: "var(--text-primary)" }}>
                            No se encontraron resultados
                        </p>
                        <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "6px" }}>
                            No hay productos que coincidan con "<strong>{searchQuery}</strong>"
                        </p>
                    </div>
                </div>
            )}

            {/* Catálogo vacío */}
            {!loading && !error && !searchQuery && allProducts.length === 0 && (
                <div style={{ textAlign: "center", padding: "80px 24px" }}>
                    <p style={{ fontSize: "16px", color: "var(--text-secondary)" }}>
                        No hay productos disponibles en este momento.
                    </p>
                </div>
            )}

            {/* Grid de productos */}
            {!loading && filtered.length > 0 && (
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                    gap: "20px",
                }}>
                    {filtered.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}

            <style>{`
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
        </main>
    );
};

export default CatalogPage;
