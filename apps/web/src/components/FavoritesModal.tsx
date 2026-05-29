import { useFavorites } from "../context/FavoritesContext";

const formatPrice = (price: number | null) => {
    if (!price) return "—";
    return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0,
    }).format(price);
};

interface Props {
    onClose: () => void;
    onViewDetail: (id: number) => void;
}

export default function FavoritesModal({ onClose, onViewDetail }: Props) {
    const { favorites, toggleFavorite } = useFavorites();

    return (
        <div className="product-modal-overlay" onClick={onClose}>
            <div
                className="product-modal"
                style={{ maxWidth: 700 }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="favorites-modal__header">
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <i className="ti ti-heart-filled" style={{ color: "#ef4444", fontSize: "1.2rem" }} aria-hidden="true" />
                        <h2>Mis favoritos</h2>
                        <span className="favorites-modal__count">{favorites.length}</span>
                    </div>
                    <button className="product-modal__close" onClick={onClose}>✕</button>
                </div>

                <div className="favorites-modal__body">
                    {favorites.length === 0 ? (
                        <div className="favorites-modal__empty">
                            <i className="ti ti-heart" aria-hidden="true" />
                            <p>Aún no tienes productos favoritos.</p>
                            <span>Haz clic en el corazón de cualquier producto para guardarlo aquí.</span>
                        </div>
                    ) : (
                        <div className="favorites-modal__grid">
                            {favorites.map((product) => (
                                <div key={product.id} className="favorites-modal__card">
                                    <div
                                        className="favorites-modal__card-img"
                                        onClick={() => { onViewDetail(product.id); onClose(); }}
                                    >
                                        {product.image_url ? (
                                            <img src={product.image_url} alt={product.name} />
                                        ) : (
                                            <div className="favorites-modal__no-img">
                                                <i className="ti ti-device-mobile" aria-hidden="true" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="favorites-modal__card-body">
                                        <span className="favorites-modal__brand">{product.brand}</span>
                                        <p
                                            className="favorites-modal__name"
                                            onClick={() => { onViewDetail(product.id); onClose(); }}
                                        >
                                            {product.name}
                                        </p>
                                        <p className="favorites-modal__price">{formatPrice(product.min_price)}</p>
                                        {product.score !== null && (
                                            <p className="favorites-modal__score">Score: {product.score}/100</p>
                                        )}
                                    </div>
                                    <button
                                        className="favorites-modal__remove"
                                        onClick={() => toggleFavorite(product)}
                                        aria-label="Quitar de favoritos"
                                    >
                                        <i className="ti ti-heart-filled" aria-hidden="true" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}