import {Router} from 'express';
import {protectRoute} from '../middleware/auth.middleware.js';

import { createDiagnosticScan, getMyDiagnosticScans, getDiagnosticScanById ,createDiagnosticCode,getDiagnosticCodes } from '../controllers/diagnostic.controller.js';

const router = Router();

//router.use(protectRoute);

router.post("/scan", createDiagnosticScan);
router.get("/scans", getMyDiagnosticScans);
router.get("/scan/:id", getDiagnosticScanById);


router.post("/codes", createDiagnosticCode);
router.get("/codes", getDiagnosticCodes);

export default router;