import {Router} from "express";
import {toggleWishlist} from "../controllers/userController.js";
import {protect} from "../middleware/auth.js";

const router = Router();
router.post("/wishlist", protect, toggleWishlist);
export default router;
