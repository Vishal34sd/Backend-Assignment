const Joi = require("joi");

const userRole = Joi.string().valid("viewer", "analyst", "admin");
const userStatus = Joi.string().valid("active", "inactive");

const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: userRole.optional(),
  status: userStatus.optional()
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  role: userRole,
  status: userStatus
}).min(1);

module.exports = {
  createUserSchema,
  updateUserSchema
};
