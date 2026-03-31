import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createOrders,getUserOrders } from "../controllers/order.controller.js";

const router =Router();

export default router;
router.use("/",protectRoute)
router.post("/",createOrders);
router.get("/",getUserOrders);