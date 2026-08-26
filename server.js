import "dotenv/config";
import express from "express";
import cors from "cors";
import {connectDB} from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import {errorHandler, notFound} from "./middleware/error.js";

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(cors({origin: process.env.CLIENT_URL || "http://localhost:5173"}));
app.use(express.json({limit: "1mb"}));
app.get("/api/health", (req, res) => res.json({status: "ok"}));
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/user", userRoutes);
app.use("/api/orders", orderRoutes);
app.use(notFound);
app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  connectDB()
    .then(() => app.listen(port, () => console.log(`ShopEase API listening on port ${port}`)))
    .catch(error => { console.error(`Database connection failed: ${error.message}`); process.exit(1); });
}

export default app;
