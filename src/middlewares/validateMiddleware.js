const ApiError = require("../utils/ApiError");

const validate = (schema, source = "body") => (req, res, next) => {
  const payload = req[source];
  const { error, value } = schema.validate(payload, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    return next(
      new ApiError(
        400,
        "Invalid input",
        error.details.map((detail) => detail.message)
      )
    );
  }

  req[source] = value;
  return next();
};

module.exports = validate;
