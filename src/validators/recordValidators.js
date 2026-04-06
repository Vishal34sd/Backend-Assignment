const Joi = require("joi");

const createRecordSchema = Joi.object({
  amount: Joi.number().positive().required(),
  type: Joi.string().valid("income", "expense").required(),
  category: Joi.string().min(2).max(100).required(),
  date: Joi.date().required(),
  notes: Joi.string().allow("").max(500).optional()
});

const updateRecordSchema = Joi.object({
  amount: Joi.number().positive(),
  type: Joi.string().valid("income", "expense"),
  category: Joi.string().min(2).max(100),
  date: Joi.date(),
  notes: Joi.string().allow("").max(500)
}).min(1);

const listRecordQuerySchema = Joi.object({
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  type: Joi.string().valid("income", "expense").optional(),
  category: Joi.string().max(100).optional(),
  search: Joi.string().max(200).optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().valid("date", "amount", "category", "createdAt").default("date"),
  sortOrder: Joi.string().valid("asc", "desc").default("desc")
});

const dashboardQuerySchema = Joi.object({
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  category: Joi.string().max(100).optional(),
  recentLimit: Joi.number().integer().min(1).max(20).default(5)
});

module.exports = {
  createRecordSchema,
  updateRecordSchema,
  listRecordQuerySchema,
  dashboardQuerySchema
};
