import { useState } from "react";
import type { Product } from "../types/product";

interface ProductCardProps {
    product: Product;
}

const formatPrice = (price: number | null) => {
    if (price === null) return "Precio no disponible";
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
    }).format(price);
};

const ProductCard = ({ product }: ProductCardProps) => {
    const [imgError, setImgError] = useState(false);
    const [hovered, setHovered] = useState(false);

    return (
        <article
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                backgroundColor: "white",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                overflow: "hidden",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                transform: hovered ? "translateY(-4px)" : "translateY(0)",
                boxShadow: hovered
                    ? "0 4px 12px rgba(0,0,0,0.10), 0 8px 32px rgba(0,0,0,0.09)"
                    : "0 1px 3px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.06)",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
            }}
        >
            {/* Imagen */}
            <div style={{ position: "relative", height: "200px", overflow: "hidden", background: "#f9fafb" }}>
                <img
                    src={imgError
                        ? "https://placehold.co/400x200/f3f4f6/9ca3af?text=Sin+imagen"
                        : (product.image_url ?? "")}
                    alt={product.name}
                    onError={() => setImgError(true)}
                    style={{
                        width: "100%", height: "100%", objectFit: "cover",
                        transition: "transform 0.3s ease",
                        transform: hovered ? "scale(1.04)" : "scale(1)",
                    }}
                />
                <span style={{
                    position: "absolute", top: "10px", left: "10px",
                    background: "rgba(255,255,255,0.92)",
                    borderRadius: "999px",
                    fontSize: "11px", fontWeight: 500,
                    color: "#6b7280",
                    padding: "3px 10px",
                    border: "1px solid #e5e7eb",
                }}>
                    {product.category}
                </span>
            </div>

            {/* Contenido */}
            <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                <p style={{
                    fontSize: "12px", color: "#9ca3af", fontWeight: 500,
                    textTransform: "uppercase", letterSpacing: "0.5px",
                }}>
                    {product.brand}
                </p>
                <h3 style={{
                    fontSize: "15px", fontWeight: 600,
                    color: "#111827", lineHeight: "1.4", flex: 1,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                }}>
                    {product.name}
                </h3>
                <p style={{
                    fontSize: "18px", fontWeight: 700,
                    color: "#7c3aed", marginTop: "4px",
                }}>
                    {formatPrice(product.min_price)}
                </p>
            </div>
        </article>
    );
};

export default ProductCard;
