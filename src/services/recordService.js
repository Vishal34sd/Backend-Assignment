const FinancialRecord = require("../models/FinancialRecord");
const ApiError = require("../utils/ApiError");

const buildRecordFilter = (query = {}) => {
  const filter = { isDeleted: false };

  if (query.type) filter.type = query.type;
  if (query.category) filter.category = query.category;

  if (query.startDate || query.endDate) {
    filter.date = {};
    if (query.startDate) filter.date.$gte = new Date(query.startDate);
    if (query.endDate) filter.date.$lte = new Date(query.endDate);
  }

  if (query.search) {
    filter.$text = { $search: query.search };
  }

  return filter;
};

const createRecord = async (payload, currentUserId) => {
  const record = await FinancialRecord.create({
    ...payload,
    createdBy: currentUserId
  });

  return record;
};

const getRecords = async (query) => {
  const filter = buildRecordFilter(query);
  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;
  const sortDirection = query.sortOrder === "asc" ? 1 : -1;

  const sort = { [query.sortBy || "date"]: sortDirection };

  const [items, total] = await Promise.all([
    FinancialRecord.find(filter)
      .populate("createdBy", "name email role")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    FinancialRecord.countDocuments(filter)
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

const getRecordById = async (recordId) => {
  const record = await FinancialRecord.findOne({ _id: recordId, isDeleted: false }).populate(
    "createdBy",
    "name email role"
  );

  if (!record) {
    throw new ApiError(404, "Financial record not found");
  }

  return record;
};

const updateRecord = async (recordId, payload) => {
  const record = await FinancialRecord.findOne({ _id: recordId, isDeleted: false });

  if (!record) {
    throw new ApiError(404, "Financial record not found");
  }

  Object.assign(record, payload);
  await record.save();

  return getRecordById(recordId);
};

const deleteRecord = async (recordId) => {
  const record = await FinancialRecord.findOne({ _id: recordId, isDeleted: false });

  if (!record) {
    throw new ApiError(404, "Financial record not found");
  }

  record.isDeleted = true;
  await record.save();
};

module.exports = {
  buildRecordFilter,
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord
};
