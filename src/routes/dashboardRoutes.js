import express from "express";

import { getDashboardSummary } from "../controllers/dashboardController.js";
import authenticate from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/roleMiddleware.js";
import validate from "../middlewares/validateMiddleware.js";
import { ROLES } from "../config/constants.js";
import { dashboardQuerySchema } from "../validators/recordValidators.js";

const router = express.Router();

router.get(
  "/summary",
  authenticate,
  authorize(ROLES.ANALYST, ROLES.ADMIN),
  validate(dashboardQuerySchema, "query"),
  getDashboardSummary
);

export default router;
