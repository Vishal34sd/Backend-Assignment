const User = require("../models/User");
const { verifyToken } = require("../utils/jwt");
const ApiError = require("../utils/ApiError");
const { USER_STATUS } = require("../config/constants");

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "Authentication required"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return next(new ApiError(401, "User not found"));
    }

    if (user.status !== USER_STATUS.ACTIVE) {
      return next(new ApiError(403, "User account is inactive"));
    }

    req.user = {
      id: user._id.toString(),
      role: user.role,
      email: user.email,
      name: user.name
    };

    return next();
  } catch (error) {
    return next(new ApiError(401, "Invalid or expired token"));
  }
};

module.exports = authenticate;
