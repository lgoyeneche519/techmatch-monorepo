import express from "express";
import cors from "cors";
import healthRoutes from "./routes/health.routes";
import productsRoutes from "./routes/products.routes";
import authRoutes from "./routes/auth.routes";

const app = express();

const allowedOrigins = [
    process.env.CORS_ORIGIN || "http://localhost:5173",
    "http://localhost:5173",
    "http://localhost:3000",
];

app.use(cors({
    origin: (origin, callback) => {
        // Permitir requests sin origin (Postman, curl, server-to-server)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error(`CORS bloqueado para: ${origin}`));
    },
    credentials: true,
}));

app.use(express.json());

app.use("/health", healthRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/auth", authRoutes);

export default app;
