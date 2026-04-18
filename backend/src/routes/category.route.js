import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getAllcategories} from "../controllers/admin.controller.js";
import { getCategoryById } from "../controllers/category.controller.js";

const router=Router();

router.get("/",protectRoute,getAllcategories);
router.get("/:id",protectRoute,getCategoryById);

export default router;