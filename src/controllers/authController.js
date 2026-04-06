const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const { signToken } = require("../utils/jwt");
const { ROLES, USER_STATUS } = require("../config/constants");

const bootstrapAdmin = async (req, res, next) => {
  try {
    const normalizedEmail = req.body.email.toLowerCase();
    const userCount = await User.countDocuments();

    if (userCount > 0) {
      throw new ApiError(403, "Bootstrap is only allowed when no users exist");
    }

    const user = await User.create({
      name: req.body.name,
      email: normalizedEmail,
      password: req.body.password,
      role: ROLES.ADMIN,
      status: USER_STATUS.ACTIVE
    });

    const token = signToken({ userId: user._id, role: user.role });
    const data = { user: user.toSafeObject(), token };
    res.status(201).json({ message: "Admin account created", data });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }

    if (user.status !== USER_STATUS.ACTIVE) {
      throw new ApiError(403, "User account is inactive");
    }

    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      throw new ApiError(401, "Invalid credentials");
    }

    const token = signToken({ userId: user._id, role: user.role });
    const data = { user: user.toSafeObject(), token };
    res.status(200).json({ message: "Login successful", data });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  bootstrapAdmin,
  login
};
