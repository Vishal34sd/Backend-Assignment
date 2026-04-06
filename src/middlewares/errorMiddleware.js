const ApiError = require("../utils/ApiError");

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed",
      errors: Object.values(err.errors).map((e) => e.message)
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid resource id" });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || "field";
    return res.status(409).json({ message: `${field} already exists` });
  }

  if (err instanceof ApiError) {
    return res.status(statusCode).json({ message, details: err.details });
  }

  return res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV !== "production" ? { stack: err.stack } : {})
  });
};

module.exports = errorHandler;
