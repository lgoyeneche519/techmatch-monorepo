import { useState, useEffect } from "react";
import { fetchFiltersData } from "../api/products";
import type { FiltersData, ProductFilters } from "../api/products";

interface Props {
    filters: ProductFilters;
    onChange: (filters: ProductFilters) => void;
}

export default function FilterPanel({ filters, onChange }: Props) {
    const [data, setData] = useState<FiltersData | null>(null);
    const [localMin, setLocalMin] = useState<string>("");
    const [localMax, setLocalMax] = useState<string>("");

    useEffect(() => {
        fetchFiltersData().then(setData).catch(console.error);
    }, []);

    useEffect(() => {
        setLocalMin(filters.minPrice !== undefined ? String(filters.minPrice) : "");
        setLocalMax(filters.maxPrice !== undefined ? String(filters.maxPrice) : "");
    }, [filters.minPrice, filters.maxPrice]);

    if (!data) return <div className="filter-panel__loading">Cargando filtros...</div>;

    const update = (partial: Partial<ProductFilters>) =>
        onChange({ ...filters, ...partial });

    const applyPrice = () => {
        update({
            minPrice: localMin !== "" ? Number(localMin) : undefined,
            maxPrice: localMax !== "" ? Number(localMax) : undefined,
        });
    };

    const clearAll = () => {
        setLocalMin("");
        setLocalMax("");
        onChange({});
    };

    return (
        <aside className="filter-panel">
            <div className="filter-panel__header">
                <h3>Filtros</h3>
                <button className="filter-panel__clear" onClick={clearAll}>
                    Limpiar todo
                </button>
            </div>

            {/* Ordenar */}
            <div className="filter-panel__group">
                <label>Ordenar por</label>
                <select
                    value={filters.sortBy ?? "name_asc"}
                    onChange={(e) => update({ sortBy: e.target.value as ProductFilters["sortBy"] })}
                >
                    <option value="name_asc">Nombre A–Z</option>
                    <option value="price_asc">Menor precio</option>
                    <option value="price_desc">Mayor precio</option>
                    <option value="score_desc">Mejor calidad/precio</option>
                </select>
            </div>

            {/* Categoría — tags clicables */}
            <div className="filter-panel__group">
                <label>Categoría</label>
                <div className="filter-panel__tags">
                    <button
                        className={`filter-tag${!filters.category ? " filter-tag--active" : ""}`}
                        onClick={() => update({ category: undefined })}
                    >
                        Todas
                    </button>
                    {data.categories.map((c) => (
                        <button
                            key={c}
                            className={`filter-tag${filters.category === c ? " filter-tag--active" : ""}`}
                            onClick={() => update({ category: filters.category === c ? undefined : c })}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            {/* Marca — tags clicables */}
            <div className="filter-panel__group">
                <label>Marca</label>
                <div className="filter-panel__tags">
                    <button
                        className={`filter-tag${!filters.brand ? " filter-tag--active" : ""}`}
                        onClick={() => update({ brand: undefined })}
                    >
                        Todas
                    </button>
                    {data.brands.map((b) => (
                        <button
                            key={b}
                            className={`filter-tag${filters.brand === b ? " filter-tag--active" : ""}`}
                            onClick={() => update({ brand: filters.brand === b ? undefined : b })}
                        >
                            {b}
                        </button>
                    ))}
                </div>
            </div>

            {/* Precio */}
            <div className="filter-panel__group">
                <label>Precio (CLP)</label>
                <div className="filter-panel__price-row">
                    <input
                        type="number"
                        placeholder={`Mín`}
                        value={localMin}
                        onChange={(e) => setLocalMin(e.target.value)}
                    />
                    <span>–</span>
                    <input
                        type="number"
                        placeholder={`Máx`}
                        value={localMax}
                        onChange={(e) => setLocalMax(e.target.value)}
                    />
                </div>
                <button className="filter-panel__apply-price" onClick={applyPrice}>
                    Aplicar precio
                </button>
            </div>
        </aside>
    );
}