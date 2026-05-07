import { useState } from "react";
import { useComparator } from "../context/ComparatorContext";

const formatPrice = (price: number | null) => {
  if (price == null) return "—";
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(price);
};

export default function ComparatorDrawer() {
  const { selected, removeProduct, clearAll } = useComparator();
  const [open, setOpen] = useState(false);

  if (selected.length === 0) return null;

  const minPrice = Math.min(...selected.map((p) => p.min_price ?? Infinity));
  const maxScore = Math.max(...selected.map((p) => p.score ?? 0));

  return (
    <>
      <button className="comparator-fab" onClick={() => setOpen(true)}>
        ⚖ Comparar ({selected.length}/3)
      </button>

      {open && (
        <div className="comparator-overlay" onClick={() => setOpen(false)}>
          <div className="comparator-modal" onClick={(e) => e.stopPropagation()}>
            <div className="comparator-modal__header">
              <h2>Comparador de productos</h2>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <button className="comparator-modal__clear" onClick={clearAll}>
                  Limpiar todo
                </button>
                <button className="comparator-modal__close" onClick={() => setOpen(false)}>
                  ✕
                </button>
              </div>
            </div>

            <div className="comparator-modal__scroll">
              <table className="comparator-table">
                <thead>
                  <tr>
                    <th className="comparator-table__label-col">Característica</th>
                    {selected.map((p) => (
                      <th key={p.id}>
                        <div className="comparator-table__product-header">
                          {p.image_url && (
                            <img src={p.image_url} alt={p.name} />
                          )}
                          <span className="comparator-table__product-brand">{p.brand}</span>
                          <strong className="comparator-table__product-name">{p.name}</strong>
                          {p.model && (
                            <span className="comparator-table__product-model">{p.model}</span>
                          )}
                          <button
                            className="comparator-table__remove"
                            onClick={() => removeProduct(p.id)}
                          >
                            ✕ Eliminar
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="comparator-table__row-label">Categoría</td>
                    {selected.map((p) => (
                      <td key={p.id}>
                        <span className="comparator-table__category-badge">{p.category}</span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="comparator-table__row-label">Precio mínimo</td>
                    {selected.map((p) => {
                      const isBest = p.min_price === minPrice;
                      return (
                        <td key={p.id} className={isBest ? "comparator-table__best" : ""}>
                          <strong>{formatPrice(p.min_price)}</strong>
                          {isBest && (
                            <span className="comparator-table__badge">🏆 Mejor precio</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="comparator-table__row-label">Score calidad/precio</td>
                    {selected.map((p) => {
                      const isBest = p.score !== null && p.score === maxScore;
                      return (
                        <td key={p.id} className={isBest ? "comparator-table__best" : ""}>
                          <strong>{p.score ?? "—"}/100</strong>
                          {isBest && (
                            <span className="comparator-table__badge">⭐ Mejor score</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="comparator-table__row-label">Marca</td>
                    {selected.map((p) => <td key={p.id}>{p.brand}</td>)}
                  </tr>
                  <tr>
                    <td className="comparator-table__row-label">Modelo</td>
                    {selected.map((p) => <td key={p.id}>{p.model ?? "—"}</td>)}
                  </tr>
                  <tr>
                    <td className="comparator-table__row-label">Descripción</td>
                    {selected.map((p) => (
                      <td key={p.id} style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                        {p.description ?? "—"}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}