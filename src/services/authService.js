const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const { signToken } = require("../utils/jwt");
const { ROLES, USER_STATUS } = require("../config/constants");

const bootstrapAdmin = async (payload) => {
  const userCount = await User.countDocuments();

  if (userCount > 0) {
    throw new ApiError(403, "Bootstrap is only allowed when no users exist");
  }

  const user = await User.create({
    ...payload,
    role: ROLES.ADMIN,
    status: USER_STATUS.ACTIVE
  });

  const token = signToken({ userId: user._id, role: user.role });
  return { user: user.toSafeObject(), token };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  if (user.status !== USER_STATUS.ACTIVE) {
    throw new ApiError(403, "User account is inactive");
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = signToken({ userId: user._id, role: user.role });
  return { user: user.toSafeObject(), token };
};

module.exports = {
  bootstrapAdmin,
  login
};
