import { Pool } from "pg";

export const pool = process.env.DATABASE_URL
  ? new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  })
  : new Pool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || "techmatch",
    user: process.env.DB_USER || "techmatch_user",
    password: process.env.DB_PASSWORD || "techmatch_pass",
  });
