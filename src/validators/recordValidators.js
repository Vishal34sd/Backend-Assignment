const { z } = require("zod");

const createRecordSchema = z
  .object({
    amount: z.number().positive(),
    type: z.enum(["income", "expense"]),
    category: z.string().min(2).max(100),
    date: z.coerce.date(),
    notes: z.string().max(500).optional()
  });

const updateRecordSchema = z
  .object({
    amount: z.number().positive().optional(),
    type: z.enum(["income", "expense"]).optional(),
    category: z.string().min(2).max(100).optional(),
    date: z.coerce.date().optional(),
    notes: z.string().max(500).optional()
  })
  .refine(
    (value) => {
      if (value.amount !== undefined) {
        return true;
      }

      if (value.type !== undefined) {
        return true;
      }

      if (value.category !== undefined) {
        return true;
      }

      if (value.date !== undefined) {
        return true;
      }

      if (value.notes !== undefined) {
        return true;
      }

      return false;
    },
    {
      message: "At least one field is required"
    }
  );

const listRecordQuerySchema = z
  .object({
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    type: z.enum(["income", "expense"]).optional(),
    category: z.string().max(100).optional(),
    search: z.string().max(200).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    sortBy: z.enum(["date", "amount", "category", "createdAt"]).default("date"),
    sortOrder: z.enum(["asc", "desc"]).default("desc")
  });

const dashboardQuerySchema = z
  .object({
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    category: z.string().max(100).optional(),
    recentLimit: z.coerce.number().int().min(1).max(20).default(5)
  });

module.exports = {
  createRecordSchema,
  updateRecordSchema,
  listRecordQuerySchema,
  dashboardQuerySchema
};
