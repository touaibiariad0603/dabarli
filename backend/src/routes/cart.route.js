import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getCart,addToCart,updateCartItem,removeFromCart,clearCart } from "../controllers/cart.controller.js";

const router = new Router();

router.use(protectRoute)

router.get("/",getCart)
router.post("/",addToCart)
router.put("/:productId",updateCartItem)
router.put("/:productId",removeFromCart)
router.delete("/",clearCart)

export default router;