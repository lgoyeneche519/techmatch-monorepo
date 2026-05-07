import { useEffect, useState } from "react";
import { fetchProductById } from "../api/products";
import { useComparator } from "../context/ComparatorContext";
import type { ProductDetail } from "../api/products";

interface Props {
    productId: number;
    onBack: () => void;
}

const formatPrice = (price: number, currency = "CLP") =>
    new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
    }).format(price);

export default function ProductDetailPage({ productId, onBack }: Props) {
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

    if (loading) return <div className="detail-page__loading">Cargando producto...</div>;
    if (error || !product)
        return (
            <div className="detail-page__error">
                <p>No se pudo cargar el producto.</p>
                <button onClick={onBack}>Volver al catálogo</button>
            </div>
        );

    const handleCompare = () => {
        if (checked) {
            removeProduct(product.id);
        } else {
            const ok = addProduct(product);
            if (!ok) alert("Solo puedes comparar hasta 3 productos.");
        }
    };

    return (
        <div className="detail-page">
            <button className="detail-page__back" onClick={onBack}>
                ← Volver al catálogo
            </button>

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
                        <p className="detail-page__price">
                            Desde {formatPrice(product.min_price)}
                        </p>
                    )}
                    {product.score !== null && (
                        <p className="detail-page__score">Score calidad/precio: {product.score}/100</p>
                    )}

                    <button
                        className={`detail-page__compare-btn${checked ? " active" : ""}${!checked && selected.length >= 3 ? " disabled" : ""
                            }`}
                        onClick={handleCompare}
                        disabled={!checked && selected.length >= 3}
                    >
                        {checked ? "✓ En comparador" : "+ Agregar al comparador"}
                    </button>

                    {product.prices.length > 0 && (
                        <div className="detail-page__prices">
                            <h3>Precios por tienda</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Tienda</th>
                                        <th>Precio</th>
                                        <th>Precio original</th>
                                        <th>Disponibilidad</th>
                                        <th>Ver</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {product.prices.map((pp) => (
                                        <tr key={pp.store_id}>
                                            <td>{pp.store_name}</td>
                                            <td>{formatPrice(pp.price, pp.currency)}</td>
                                            <td>
                                                {pp.original_price
                                                    ? formatPrice(pp.original_price, pp.currency)
                                                    : "—"}
                                            </td>
                                            <td>{pp.availability ?? "—"}</td>
                                            <td>
                                                {pp.url ? (
                                                    <a href={pp.url} target="_blank" rel="noopener noreferrer">
                                                        Ver oferta
                                                    </a>
                                                ) : (
                                                    "—"
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {product.specifications && (
                        <div className="detail-page__specs">
                            <h3>Especificaciones técnicas</h3>
                            <table>
                                <tbody>
                                    {Object.entries(product.specifications).map(([k, v]) => (
                                        <tr key={k}>
                                            <td>{k}</td>
                                            <td>{String(v)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}