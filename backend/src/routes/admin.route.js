import { Router } from "express";
import { createProduct ,getAllProducts,updateProduct,getAllOrders,updateOrderStatus,getAllCustomers,getDashboardStats, deleteProduct, createCategory, deleteCategory, updateCategory, createSubCategory,getAllSubCategories, updateSubCategory, deleteSubCategory, getAllcategories} from "../controllers/admin.controller.js";
import { adminOnly,protectRoute } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.use(protectRoute,adminOnly);

router.post("/products",upload.array("images",3),createProduct);
router.get("/products",getAllProducts);
router.put("/products/:id",upload.array("images",3),updateProduct);
router.delete("/products/:id", deleteProduct);




router.post("/categories",upload.array("images",1),createCategory);
router.get("/categories",getAllcategories);
router.put("/categories/:id",upload.array("images",1),updateCategory);
router.delete("/categories/:id", deleteCategory);


router.post("/subcategories",upload.array(),createSubCategory);
router.get("/subcategories",getAllSubCategories);
router.put("/subcategories/:id",upload.array(),updateSubCategory);
router.delete("/subcategories/:id", deleteSubCategory);



router.get("/orders",getAllOrders);
router.patch("/orders/:orderId/status",updateOrderStatus);


router.get("/customers",getAllCustomers);

router.get("/stats",getDashboardStats);






export default router;
