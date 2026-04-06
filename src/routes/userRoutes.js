const express = require("express");

const userController = require("../controllers/userController");
const authenticate = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");
const validate = require("../middlewares/validateMiddleware");
const { ROLES } = require("../config/constants");
const { createUserSchema, updateUserSchema } = require("../validators/userValidators");

const router = express.Router();

router.use(authenticate);
router.use(authorize(ROLES.ADMIN));

router.post("/", validate(createUserSchema), userController.createUser);
router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);
router.patch("/:id", validate(updateUserSchema), userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
