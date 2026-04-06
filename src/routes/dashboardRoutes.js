const express = require("express");

const dashboardController = require("../controllers/dashboardController");
const authenticate = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");
const validate = require("../middlewares/validateMiddleware");
const { ROLES } = require("../config/constants");
const { dashboardQuerySchema } = require("../validators/recordValidators");

const router = express.Router();

router.get(
  "/summary",
  authenticate,
  authorize(ROLES.ANALYST, ROLES.ADMIN),
  validate(dashboardQuerySchema, "query"),
  dashboardController.getDashboardSummary
);

module.exports = router;
