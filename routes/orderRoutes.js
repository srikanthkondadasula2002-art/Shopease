import {Router} from "express";
import {createOrder, myOrders} from "../controllers/orderController.js";
import {protect} from "../middleware/auth.js";

const router = Router();
router.post("/", protect, createOrder);
router.get("/myorders", protect, myOrders);
export default router;
