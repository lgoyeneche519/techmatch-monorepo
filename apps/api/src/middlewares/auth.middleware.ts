import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface JwtPayload {
    sub: number;
    username: string;
    email: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No autorizado. Token requerido." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "dev-secret-change-in-prod"
        ) as { sub: unknown; username: string; email: string };

        req.user = {
            sub: Number(decoded.sub),
            username: decoded.username,
            email: decoded.email,
        };

        return next();
    } catch {
        return res.status(401).json({ message: "Token inválido o expirado." });
    }
};