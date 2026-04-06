const catchAsync = require("../utils/catchAsync");
const userService = require("../services/userService");

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(201).json({ message: "User created", data: user });
});

const getUsers = catchAsync(async (req, res) => {
  const users = await userService.getUsers();
  res.status(200).json({ message: "Users fetched", data: users });
});

const getUserById = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.status(200).json({ message: "User fetched", data: user });
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);
  res.status(200).json({ message: "User updated", data: user });
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUser(req.params.id);
  res.status(200).json({ message: "User deleted" });
});

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
};
