import { pool } from "../config/database";

export interface CatalogProduct {
  id: number;
  name: string;
  model: string | null;
  description: string | null;
  image_url: string | null;
  brand: string;
  category: string;
  min_price: number | null;
  score: number | null;
}

export interface ProductDetail extends CatalogProduct {
  specifications: Record<string, unknown> | null;
  prices: PriceEntry[];
}

export interface PriceEntry {
  store_id: number;
  store_name: string;
  store_url: string | null;
  price: number;
  original_price: number | null;
  currency: string;
  availability: string | null;
  url: string | null;
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "price_asc" | "price_desc" | "score_desc" | "name_asc";
  search?: string;
}

// Calcula score: relación especificaciones/precio (0-100)
const calcScore = (minPrice: number | null): number | null => {
  if (!minPrice || minPrice <= 0) return null;
  // Score base invertido por precio; se puede refinar con specs en el futuro
  const score = Math.max(0, Math.min(100, Math.round(10000000 / minPrice)));
  return score;
};

export const getAllProducts = async (
  filters: ProductFilters = {}
): Promise<CatalogProduct[]> => {
  const conditions: string[] = [];
  const params: unknown[] = [];
  let idx = 1;

  if (filters.category) {
    conditions.push(`LOWER(c.name) = LOWER($${idx++})`);
    params.push(filters.category);
  }
  if (filters.brand) {
    conditions.push(`LOWER(b.name) = LOWER($${idx++})`);
    params.push(filters.brand);
  }
  if (filters.minPrice !== undefined) {
    conditions.push(`MIN(pp.price) >= $${idx++}`);
    params.push(filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    conditions.push(`MIN(pp.price) <= $${idx++}`);
    params.push(filters.maxPrice);
  }
  if (filters.search) {
    conditions.push(
      `(LOWER(p.name) LIKE LOWER($${idx}) OR LOWER(b.name) LIKE LOWER($${idx}) OR LOWER(p.model) LIKE LOWER($${idx}))`
    );
    params.push(`%${filters.search}%`);
    idx++;
  }

  const having =
    conditions.length > 0 ? `HAVING ${conditions.join(" AND ")}` : "";

  const orderMap: Record<string, string> = {
    price_asc: "min_price ASC NULLS LAST",
    price_desc: "min_price DESC NULLS LAST",
    score_desc: "min_price ASC NULLS LAST", // menor precio = mejor score
    name_asc: "p.name ASC",
  };
  const orderClause = orderMap[filters.sortBy ?? "name_asc"];

  const result = await pool.query(
    `SELECT
      p.id,
      p.name,
      p.model,
      p.description,
      p.image_url,
      b.name AS brand,
      c.name AS category,
      MIN(pp.price) AS min_price
    FROM products p
    INNER JOIN brands b ON b.id = p.brand_id
    INNER JOIN categories c ON c.id = p.category_id
    LEFT JOIN product_prices pp ON pp.product_id = p.id
    GROUP BY p.id, p.name, p.model, p.description, p.image_url, b.name, c.name
    ${having}
    ORDER BY ${orderClause};`,
    params
  );

  return result.rows.map((row) => ({
    ...row,
    score: calcScore(row.min_price),
  }));
};

export const getProductById = async (
  id: number
): Promise<ProductDetail | null> => {
  const productRes = await pool.query(
    `SELECT
      p.id, p.name, p.model, p.description, p.image_url, p.specifications,
      b.name AS brand, c.name AS category,
      MIN(pp.price) AS min_price
    FROM products p
    INNER JOIN brands b ON b.id = p.brand_id
    INNER JOIN categories c ON c.id = p.category_id
    LEFT JOIN product_prices pp ON pp.product_id = p.id
    WHERE p.id = $1
    GROUP BY p.id, p.name, p.model, p.description, p.image_url, p.specifications, b.name, c.name`,
    [id]
  );

  if (productRes.rows.length === 0) return null;

  const pricesRes = await pool.query(
    `SELECT
      pp.store_id, s.name AS store_name, s.url AS store_url,
      pp.price, pp.original_price, pp.currency, pp.availability, pp.url
    FROM product_prices pp
    INNER JOIN stores s ON s.id = pp.store_id
    WHERE pp.product_id = $1
    ORDER BY pp.price ASC`,
    [id]
  );

  const row = productRes.rows[0];
  return {
    ...row,
    score: calcScore(row.min_price),
    prices: pricesRes.rows,
  };
};

export const getFiltersData = async () => {
  const [categories, brands, priceRange] = await Promise.all([
    pool.query(`SELECT DISTINCT name FROM categories ORDER BY name ASC`),
    pool.query(`SELECT DISTINCT name FROM brands ORDER BY name ASC`),
    pool.query(
      `SELECT MIN(price) AS min_price, MAX(price) AS max_price FROM product_prices`
    ),
  ]);

  return {
    categories: categories.rows.map((r) => r.name),
    brands: brands.rows.map((r) => r.name),
    priceRange: {
      min: priceRange.rows[0].min_price ?? 0,
      max: priceRange.rows[0].max_price ?? 10000000,
    },
  };
};