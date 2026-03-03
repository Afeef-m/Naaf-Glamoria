import express from "express";
import cors from "cors";
import productRoutes from "./modules/products/product.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/products", productRoutes);

export default app;