import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getAllSubCategorys} from "../controllers/admin.controller.js";
import { getSubCategoryById} from "../controllers/SubCategory.controler.js";

const router=Router();

router.get("/",protectRoute,getAllSubCategorys);
router.get("/:id",protectRoute, getSubCategoryById);

export default router;