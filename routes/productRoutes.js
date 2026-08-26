import {Router} from "express";
import {createProduct, getProduct, listProducts} from "../controllers/productController.js";
import {adminOnly, protect} from "../middleware/auth.js";

const router = Router();
router.get("/", listProducts);
router.get("/:id", getProduct);
router.post("/", protect, adminOnly, createProduct);
export default router;
