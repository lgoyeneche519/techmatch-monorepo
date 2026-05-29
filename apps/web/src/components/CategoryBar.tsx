import type { ProductFilters } from "../api/products";

interface Props {
    categories: string[];
    activeCategory?: string;
    onChange: (filters: Partial<ProductFilters>) => void;
}

const CATEGORY_ICONS: Record<string, string> = {
    "Todas": "ti-stack-2",
    "Celulares": "ti-device-mobile",
    "Computadores": "ti-device-laptop",
    "Tablets": "ti-device-tablet",
    "Componentes": "ti-cpu",
    "Periféricos": "ti-mouse",
    "Audio": "ti-headphones",
};

export default function CategoryBar({ categories, activeCategory, onChange }: Props) {
    const all = ["Todas", ...categories];

    return (
        <nav className="category-bar" aria-label="Filtro por categoría">
            {all.map((cat) => {
                const isActive = cat === "Todas" ? !activeCategory : activeCategory === cat;
                const icon = CATEGORY_ICONS[cat] ?? "ti-tag";
                return (
                    <button
                        key={cat}
                        className={`category-bar__chip${isActive ? " category-bar__chip--active" : ""}`}
                        onClick={() =>
                            onChange({ category: cat === "Todas" ? undefined : cat })
                        }
                        aria-pressed={isActive}
                    >
                        <i className={`ti ${icon}`} aria-hidden="true" />
                        <span>{cat}</span>
                    </button>
                );
            })}
        </nav>
    );
}