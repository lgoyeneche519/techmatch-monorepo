import { Request, Response } from "express";
import { pool } from "../config/database";

export const healthCheck = (_req: Request, res: Response) => {
    res.json({
        status: "ok",
        service: "techmatch-api",
    });
};

export const dbHealthCheck = async (_req: Request, res: Response) => {
    try {
        const result = await pool.query("SELECT NOW() as current_time");
        res.json({
            status: "ok",
            database: "connected",
            data: result.rows[0],
        });
    } catch (error) {
        console.error("Database connection error:", error);
        res.status(500).json({
            status: "error",
            database: "disconnected",
            message: "No fue posible conectar a la base de datos",
        });
    }
};