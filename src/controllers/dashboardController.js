import FinancialRecord from "../models/FinancialRecord.js";

const buildRecordFilter = (query = {}) => {
  const filter = { isDeleted: false };

  if (query.category) {
    filter.category = query.category;
  }

  if (query.startDate || query.endDate) {
    filter.date = {};

    if (query.startDate) {
      filter.date.$gte = query.startDate;
    }

    if (query.endDate) {
      filter.date.$lte = query.endDate;
    }
  }

  return filter;
};

export const getDashboardSummary = async (req, res, next) => {
  try {
    const baseMatch = buildRecordFilter(req.query);
    const recentLimit = req.query.recentLimit;

    const pipeline = [
      { $match: baseMatch },
      {
        $facet: {
          totals: [
            {
              $group: {
                _id: null,
                totalIncome: {
                  $sum: {
                    $cond: [{ $eq: ["$type", "income"] }, "$amount", 0]
                  }
                },
                totalExpenses: {
                  $sum: {
                    $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0]
                  }
                }
              }
            }
          ],
          categoryWise: [
            {
              $group: {
                _id: { category: "$category", type: "$type" },
                total: { $sum: "$amount" },
                transactions: { $sum: 1 }
              }
            },
            { $sort: { total: -1 } }
          ],
          monthlyTrends: [
            {
              $group: {
                _id: {
                  year: { $year: "$date" },
                  month: { $month: "$date" }
                },
                income: {
                  $sum: {
                    $cond: [{ $eq: ["$type", "income"] }, "$amount", 0]
                  }
                },
                expenses: {
                  $sum: {
                    $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0]
                  }
                }
              }
            },
            {
              $project: {
                _id: 0,
                year: "$_id.year",
                month: "$_id.month",
                income: 1,
                expenses: 1,
                net: { $subtract: ["$income", "$expenses"] }
              }
            },
            { $sort: { year: 1, month: 1 } }
          ],
          recentTransactions: [
            { $sort: { date: -1, createdAt: -1 } },
            { $limit: recentLimit },
            {
              $project: {
                amount: 1,
                type: 1,
                category: 1,
                date: 1,
                notes: 1,
                createdBy: 1,
                createdAt: 1
              }
            }
          ]
        }
      }
    ];

    const [result] = await FinancialRecord.aggregate(pipeline);
    const totals = result.totals[0] || { totalIncome: 0, totalExpenses: 0 };

    const summary = {
      totalIncome: totals.totalIncome,
      totalExpenses: totals.totalExpenses,
      netBalance: totals.totalIncome - totals.totalExpenses,
      categoryWise: result.categoryWise,
      monthlyTrends: result.monthlyTrends,
      recentTransactions: result.recentTransactions
    };

    res.status(200).json({ message: "Dashboard summary fetched", data: summary });
  } catch (error) {
    next(error);
  }
};



