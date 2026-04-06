const express = require("express");

const authController = require("../controllers/authController");
const validate = require("../middlewares/validateMiddleware");
const { loginSchema, bootstrapAdminSchema } = require("../validators/authValidators");

const router = express.Router();

router.post("/bootstrap-admin", validate(bootstrapAdminSchema), authController.bootstrapAdmin);
router.post("/login", validate(loginSchema), authController.login);

module.exports = router;
