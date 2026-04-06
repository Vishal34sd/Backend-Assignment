import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import { signToken } from "../utils/jwt.js";
import { ROLES, USER_STATUS } from "../config/constants.js";

export const createDefaultAdmin = async (req, res, next) => {
  try {
    const email = req.body.email.toLowerCase();
    const totalUsers = await User.countDocuments();

    if (totalUsers > 0) {
      throw new ApiError(403, "Bootstrap is only allowed when no users exist");
    }

    const user = await User.create({
      name: req.body.name,
      email,
      password: req.body.password,
      role: ROLES.ADMIN,
      status: USER_STATUS.ACTIVE
    });

    const token = signToken({ userId: user._id, role: user.role });
    const result = { user: user.toSafeObject(), token };
    res.status(201).json({ message: "Admin account created", data: result });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
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
    const result = { user: user.toSafeObject(), token };
    res.status(200).json({ message: "Login successful", data: result });
  } catch (error) {
    next(error);
  }
};

