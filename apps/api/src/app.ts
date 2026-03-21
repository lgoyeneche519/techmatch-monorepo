import express from "express";
import cors from "cors";
import healthRoutes from "./routes/health.routes";
import productsRoutes from "./routes/products.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/health", healthRoutes);
app.use("/api/products", productsRoutes);

export default app;