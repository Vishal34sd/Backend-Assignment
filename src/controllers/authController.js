const catchAsync = require("../utils/catchAsync");
const authService = require("../services/authService");

const bootstrapAdmin = catchAsync(async (req, res) => {
  const data = await authService.bootstrapAdmin(req.body);
  res.status(201).json({ message: "Admin account created", data });
});

const login = catchAsync(async (req, res) => {
  const data = await authService.login(req.body);
  res.status(200).json({ message: "Login successful", data });
});

module.exports = {
  bootstrapAdmin,
  login
};
