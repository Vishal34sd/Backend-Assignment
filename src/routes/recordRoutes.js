import express from "express";

import { createRecord, getRecords, getRecordById, updateRecord, deleteRecord } from "../controllers/recordController.js";
import authenticate from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/roleMiddleware.js";
import validate from "../middlewares/validateMiddleware.js";
import {
  createRecordSchema,
  updateRecordSchema,
  listRecordQuerySchema
} from "../validators/recordValidators.js";

const router = express.Router();

router.use(authenticate);

router.get(
  "/",
  authorize("viewer", "analyst", "admin"),
  validate(listRecordQuerySchema, "query"),
  getRecords
);

router.get("/:id", authorize("viewer", "analyst", "admin"), getRecordById);

router.post("/", authorize("admin"), validate(createRecordSchema), createRecord);
router.patch("/:id", authorize("admin"), validate(updateRecordSchema), updateRecord);
router.delete("/:id", authorize("admin"), deleteRecord);

export default router;
