import { z } from "zod";

const userRole = z.enum(["viewer", "analyst", "admin"]);
const userStatus = z.enum(["active", "inactive"]);

export const createUserSchema = z
  .object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(8),
    role: userRole.optional(),
    status: userStatus.optional()
  });

export const updateUserSchema = z
  .object({
    name: z.string().min(2).max(100).optional(),
    role: userRole.optional(),
    status: userStatus.optional()
  })
  .refine(
    (value) => {
      if (value.name !== undefined) {
        return true;
      }

      if (value.role !== undefined) {
        return true;
      }

      if (value.status !== undefined) {
        return true;
      }

      return false;
    },
    {
      message: "At least one field is required"
    }
  );
