import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getAllCategorys} from "../controllers/admin.controller.js";
import { getCategoryById } from "../controllers/category.controller.js";

const router=Router();

router.get("/",protectRoute,getAllCategorys);
router.get("/:id",protectRoute,getCategoryById);

export default router;