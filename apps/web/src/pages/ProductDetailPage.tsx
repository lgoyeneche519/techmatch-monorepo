import { useEffect, useState } from "react";
import { fetchProductById } from "../api/products";
import { useComparator } from "../context/ComparatorContext";
import type { ProductDetail } from "../api/products";

interface Props {
    productId: number;
    onClose: () => void;
}

const formatPrice = (price: number, currency = "CLP") =>
    new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
    }).format(price);

const SPEC_LABELS: Record<string, string> = {
    "5g": "5G",
    color: "Color",
    ram_gb: "RAM (GB)",
    storage: "Almacenamiento",
    weight_g: "Peso (g)",
    battery_mah: "Batería (mAh)",
    main_camera: "Cámara principal",
    screen_size: "Tamaño pantalla",
    operating_system: "Sistema operativo",
    processor: "Procesador",
    cores: "Núcleos",
    gpu: "GPU",
    usb: "USB",
    bluetooth: "Bluetooth",
    wifi: "Wi-Fi",
    nfc: "NFC",
    resolution: "Resolución",
    refresh_rate: "Tasa de refresco",
};

const getAvailabilityClass = (availability: string | null) => {
    if (!availability) return "";
    const v = availability.toLowerCase();
    if (v === "disponible") return "availability-badge--available";
    if (v.includes("pocas") || v.includes("few")) return "availability-badge--few";
    return "availability-badge--out";
};

export default function ProductDetailPage({ productId, onClose }: Props) {
    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const { addProduct, removeProduct, isSelected, selected } = useComparator();
    const checked = product ? isSelected(product.id) : false;

    useEffect(() => {
        setLoading(true);
        fetchProductById(productId)
            .then(setProduct)
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [productId]);

    // Cerrar con Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    const handleCompare = () => {
        if (!product) return;
        if (checked) {
            removeProduct(product.id);
        } else {
            const ok = addProduct(product);
            if (!ok) alert("Solo puedes comparar hasta 3 productos.");
        }
    };

    return (
        <div className="product-modal-overlay" onClick={onClose}>
            <div className="product-modal" onClick={(e) => e.stopPropagation()}>
                <button className="product-modal__close" onClick={onClose}>✕</button>

                <div className="product-modal__content">
                    {loading && <p style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>Cargando producto...</p>}
                    {error && <p style={{ textAlign: "center", padding: "3rem", color: "#dc2626" }}>No se pudo cargar el producto.</p>}

                    {!loading && !error && product && (
                        <>
                            <div className="detail-page__content">
                                <div className="detail-page__image-col">
                                    {product.image_url ? (
                                        <img src={product.image_url} alt={product.name} />
                                    ) : (
                                        <div className="detail-page__no-image">Sin imagen</div>
                                    )}
                                </div>

                                <div className="detail-page__info-col">
                                    <span className="detail-page__category">{product.category}</span>
                                    <h1>{product.brand} {product.name}</h1>
                                    {product.model && <p className="detail-page__model">Modelo: {product.model}</p>}
                                    {product.description && <p className="detail-page__desc">{product.description}</p>}

                                    {product.min_price && (
                                        <p className="detail-page__price">Desde {formatPrice(product.min_price)}</p>
                                    )}

                                    {product.score !== null && (
                                        <div className="score-tooltip-wrapper" style={{ marginBottom: "1.25rem" }}>
                                            <span className="detail-page__score" style={{ margin: 0 }}>
                                                Score calidad/precio: {product.score}/100
                                            </span>
                                            <span className="score-tooltip-icon">?</span>
                                            <div className="score-tooltip-box">
                                                El score calidad/precio se calcula dividiendo una constante entre el precio mínimo del producto. A menor precio, mayor score. Rango: 0–100.
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        className={`detail-page__compare-btn${checked ? " active" : ""}${!checked && selected.length >= 3 ? " disabled" : ""}`}
                                        onClick={handleCompare}
                                        disabled={!checked && selected.length >= 3}
                                    >
                                        {checked ? "✓ En comparador" : "+ Agregar al comparador"}
                                    </button>
                                </div>
                            </div>

                            {product.prices.length > 0 && (
                                <div className="detail-page__prices">
                                    <h3>Precios por tienda</h3>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Tienda</th>
                                                <th>
                                                    Precio actual
                                                    <span className="score-tooltip-wrapper" style={{ marginLeft: 4 }}>
                                                        <span className="score-tooltip-icon">?</span>
                                                        <span className="score-tooltip-box">Precio vigente en la tienda al momento de la última actualización.</span>
                                                    </span>
                                                </th>
                                                <th>
                                                    Precio original
                                                    <span className="score-tooltip-wrapper" style={{ marginLeft: 4 }}>
                                                        <span className="score-tooltip-icon">?</span>
                                                        <span className="score-tooltip-box">Precio antes del descuento, si aplica.</span>
                                                    </span>
                                                </th>
                                                <th>Disponibilidad</th>
                                                <th>Ver oferta</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {product.prices.map((pp) => (
                                                <tr key={pp.store_id}>
                                                    <td>{pp.store_name}</td>
                                                    <td><strong>{formatPrice(pp.price, pp.currency)}</strong></td>
                                                    <td style={{ color: "#9ca3af", textDecoration: "line-through" }}>
                                                        {pp.original_price ? formatPrice(pp.original_price, pp.currency) : "—"}
                                                    </td>
                                                    <td>
                                                        <span className={`availability-badge ${getAvailabilityClass(pp.availability)}`}>
                                                            {pp.availability ?? "—"}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {pp.url ? (
                                                            <a href={pp.url} target="_blank" rel="noopener noreferrer">Ver oferta →</a>
                                                        ) : "—"}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {product.specifications && Object.keys(product.specifications).length > 0 && (
                                <div className="detail-page__specs">
                                    <h3>Especificaciones técnicas</h3>
                                    <table>
                                        <tbody>
                                            {Object.entries(product.specifications).map(([k, v]) => (
                                                <tr key={k}>
                                                    <td>{SPEC_LABELS[k] ?? k}</td>
                                                    <td>{String(v)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}