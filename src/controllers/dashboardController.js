const catchAsync = require("../utils/catchAsync");
const dashboardService = require("../services/dashboardService");

const getDashboardSummary = catchAsync(async (req, res) => {
  const summary = await dashboardService.getDashboardSummary(req.query);
  res.status(200).json({ message: "Dashboard summary fetched", data: summary });
});

module.exports = {
  getDashboardSummary
};
