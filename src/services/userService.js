const User = require("../models/User");
const ApiError = require("../utils/ApiError");

const createUser = async (payload) => {
  const existing = await User.findOne({ email: payload.email.toLowerCase() });

  if (existing) {
    throw new ApiError(409, "Email already exists");
  }

  const user = await User.create({ ...payload, email: payload.email.toLowerCase() });
  return user.toSafeObject();
};

const getUsers = async () => {
  const users = await User.find().sort({ createdAt: -1 });
  return users.map((user) => user.toSafeObject());
};

const getUserById = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user.toSafeObject();
};

const updateUser = async (userId, payload) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (payload.name !== undefined) user.name = payload.name;
  if (payload.role !== undefined) user.role = payload.role;
  if (payload.status !== undefined) user.status = payload.status;

  await user.save();
  return user.toSafeObject();
};

const deleteUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  await user.deleteOne();
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
};
