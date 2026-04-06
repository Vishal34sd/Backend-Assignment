const express = require("express");

const recordController = require("../controllers/recordController");
const authenticate = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");
const validate = require("../middlewares/validateMiddleware");
const { ROLES } = require("../config/constants");
const {
  createRecordSchema,
  updateRecordSchema,
  listRecordQuerySchema
} = require("../validators/recordValidators");

const router = express.Router();

router.use(authenticate);

router.get(
  "/",
  authorize(ROLES.VIEWER, ROLES.ANALYST, ROLES.ADMIN),
  validate(listRecordQuerySchema, "query"),
  recordController.getRecords
);

router.get("/:id", authorize(ROLES.VIEWER, ROLES.ANALYST, ROLES.ADMIN), recordController.getRecordById);

router.post("/", authorize(ROLES.ADMIN), validate(createRecordSchema), recordController.createRecord);
router.patch("/:id", authorize(ROLES.ADMIN), validate(updateRecordSchema), recordController.updateRecord);
router.delete("/:id", authorize(ROLES.ADMIN), recordController.deleteRecord);

module.exports = router;
