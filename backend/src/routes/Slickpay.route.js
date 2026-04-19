import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createSlickPayInvoice,
  getSlickPayInvoiceStatus,
  slickPayWebhook,
} from "../controllers/slickpay.controller.js";

const router = Router();


router.post("/webhook", slickPayWebhook);

router.use(protectRoute);
router.post("/create-invoice", createSlickPayInvoice);
router.get("/status/:invoiceId", getSlickPayInvoiceStatus);

export default router;