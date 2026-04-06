import ApiError from "../utils/ApiError.js";
import { ZodError } from "zod";

const validate = (schema, source = "body") => (req, res, next) => {
  const payload = req[source];
  const parsedResult = schema.safeParse(payload);

  if (parsedResult.success) {
    req[source] = parsedResult.data;
    return next();
  }

  if (parsedResult.error instanceof ZodError) {
    const details = parsedResult.error.issues.map((issue) => {
      if (issue.path.length > 0) {
        return `${issue.path.join(".")}: ${issue.message}`;
      }

      return issue.message;
    });

    return next(
      new ApiError(400, "Invalid input", details)
    );
  }

  return next(new ApiError(400, "Invalid input"));
};

export default validate;
