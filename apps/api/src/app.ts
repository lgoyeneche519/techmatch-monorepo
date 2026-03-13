import express from "express";
import cors from "cors";
import productsRoutes from "./routes/products.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
    res.json({
        status: "ok",
        service: "techmatch-api"
    });
});

app.use("/api/products", productsRoutes);

export default app;