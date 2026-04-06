import express from "express";

import { createDefaultAdmin, login } from "../controllers/authController.js";
import validate from "../middlewares/validateMiddleware.js";
import { loginSchema, createDefaultAdminSchema } from "../validators/authValidators.js";

const router = express.Router();

router.post("/create-default-admin", validate(createDefaultAdminSchema), createDefaultAdmin);
router.post("/login", validate(loginSchema), login);

export default router;
