import { Router } from "express";
import { addAddress,getAddresses,updateAddress,deleteAddress,addToWhishlist,removeFromWhishlist,getWhishlist } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protectRoute);

//address routes
router.post("/addresses",addAddress);
router.get("/addresses",getAddresses);
router.put("/addresses/:addressId",updateAddress);
router.delete("/addresses/:addressId",deleteAddress);


//wishlist routes
router.post("/whishlist",addToWhishlist);
router.delete("/whishlist/:productId",removeFromWhishlist);
router.get("/whishlist",getWhishlist);


export default router