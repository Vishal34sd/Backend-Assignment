import express from "express";

import { createRecord, getRecords, getRecordById, updateRecord, deleteRecord } from "../controllers/recordController.js";
import authenticate from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/roleMiddleware.js";
import validate from "../middlewares/validateMiddleware.js";
import { ROLES } from "../config/constants.js";
import {
  createRecordSchema,
  updateRecordSchema,
  listRecordQuerySchema
} from "../validators/recordValidators.js";

const router = express.Router();

router.use(authenticate);

router.get(
  "/",
  authorize(ROLES.VIEWER, ROLES.ANALYST, ROLES.ADMIN),
  validate(listRecordQuerySchema, "query"),
  getRecords
);

router.get("/:id", authorize(ROLES.VIEWER, ROLES.ANALYST, ROLES.ADMIN), getRecordById);

router.post("/", authorize(ROLES.ADMIN), validate(createRecordSchema), createRecord);
router.patch("/:id", authorize(ROLES.ADMIN), validate(updateRecordSchema), updateRecord);
router.delete("/:id", authorize(ROLES.ADMIN), deleteRecord);

export default router;
