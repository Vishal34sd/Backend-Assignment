import express from "express";

import { createUser, getUsers, getUserById, updateUser, deleteUser } from "../controllers/userController.js";
import authenticate from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/roleMiddleware.js";
import validate from "../middlewares/validateMiddleware.js";
import { createUserSchema, updateUserSchema } from "../validators/userValidators.js";

const router = express.Router();

router.use(authenticate);
router.use(authorize("admin"));

router.post("/", validate(createUserSchema), createUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.patch("/:id", validate(updateUserSchema), updateUser);
router.delete("/:id", deleteUser);

export default router;
