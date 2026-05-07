import { useComparator } from "../context/ComparatorContext";
import type { CatalogProduct } from "../api/products";

interface Props {
    product: CatalogProduct;
    onViewDetail: (id: number) => void;
}

const formatPrice = (price: number | null, currency = "CLP") => {
    if (price == null) return "Sin precio";
    return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
    }).format(price);
};

export default function ProductCard({ product, onViewDetail }: Props) {
    const { addProduct, removeProduct, isSelected, selected } = useComparator();
    const checked = isSelected(product.id);

    const handleCompare = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (checked) {
            removeProduct(product.id);
        } else {
            const ok = addProduct(product);
            if (!ok) {
                alert("Solo puedes comparar hasta 3 productos.");
            }
        }
    };

    return (
        <div
            className="product-card"
            onClick={() => onViewDetail(product.id)}
            style={{ cursor: "pointer" }}
        >
            <div className="product-card__image-wrapper">
                <span className="product-card__category">{product.category}</span>
                {product.image_url ? (
                    <img
                        src={product.image_url}
                        alt={product.name}
                        className="product-card__image"
                    />
                ) : (
                    <div className="product-card__no-image">Sin imagen</div>
                )}
            </div>
            <div className="product-card__body">
                <p className="product-card__brand">{product.brand}</p>
                <h3 className="product-card__name">{product.name}</h3>
                {product.model && (
                    <p className="product-card__model">{product.model}</p>
                )}
                <p className="product-card__price">{formatPrice(product.min_price)}</p>
                {product.score !== null && (
                    <p className="product-card__score">Score: {product.score}/100</p>
                )}
                <button
                    className={`product-card__compare-btn${checked ? " active" : ""}${!checked && selected.length >= 3 ? " disabled" : ""
                        }`}
                    onClick={handleCompare}
                >
                    {checked ? "✓ En comparador" : "+ Comparar"}
                </button>
            </div>
        </div>
    );
}