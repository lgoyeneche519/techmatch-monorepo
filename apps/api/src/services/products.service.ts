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
}

export const getAllProducts = async (): Promise<CatalogProduct[]> => {
  const result = await pool.query(`
    SELECT
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
    GROUP BY
      p.id,
      p.name,
      p.model,
      p.description,
      p.image_url,
      b.name,
      c.name
    ORDER BY p.name ASC;
  `);

  return result.rows;
};