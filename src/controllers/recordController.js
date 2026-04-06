const FinancialRecord = require("../models/FinancialRecord");
const ApiError = require("../utils/ApiError");

const buildRecordFilter = (query = {}) => {
  const filter = { isDeleted: false };

  if (query.type) {
    filter.type = query.type;
  }

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

  if (query.search) {
    filter.$text = { $search: query.search };
  }

  return filter;
};

const createRecord = async (req, res, next) => {
  try {
    const record = await FinancialRecord.create({
      amount: req.body.amount,
      type: req.body.type,
      category: req.body.category,
      date: req.body.date,
      notes: req.body.notes,
      createdBy: req.user.id
    });

    res.status(201).json({ message: "Record created", data: record });
  } catch (error) {
    next(error);
  }
};

const getRecords = async (req, res, next) => {
  try {
    const filter = buildRecordFilter(req.query);
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;

    let sortDirection = -1;
    if (req.query.sortOrder === "asc") {
      sortDirection = 1;
    }

    const sortField = req.query.sortBy;
    const sort = { [sortField]: sortDirection };

    const [items, total] = await Promise.all([
      FinancialRecord.find(filter)
        .populate("createdBy", "name email role")
        .sort(sort)
        .skip(skip)
        .limit(limit),
      FinancialRecord.countDocuments(filter)
    ]);

    const result = {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };

    res.status(200).json({ message: "Records fetched", data: result });
  } catch (error) {
    next(error);
  }
};

const getRecordById = async (req, res, next) => {
  try {
    const record = await FinancialRecord.findOne({
      _id: req.params.id,
      isDeleted: false
    }).populate("createdBy", "name email role");

    if (!record) {
      throw new ApiError(404, "Financial record not found");
    }

    res.status(200).json({ message: "Record fetched", data: record });
  } catch (error) {
    next(error);
  }
};

const updateRecord = async (req, res, next) => {
  try {
    const record = await FinancialRecord.findOne({
      _id: req.params.id,
      isDeleted: false
    });

    if (!record) {
      throw new ApiError(404, "Financial record not found");
    }

    if (req.body.amount !== undefined) {
      record.amount = req.body.amount;
    }

    if (req.body.type !== undefined) {
      record.type = req.body.type;
    }

    if (req.body.category !== undefined) {
      record.category = req.body.category;
    }

    if (req.body.date !== undefined) {
      record.date = req.body.date;
    }

    if (req.body.notes !== undefined) {
      record.notes = req.body.notes;
    }

    await record.save();

    const updatedRecord = await FinancialRecord.findOne({
      _id: req.params.id,
      isDeleted: false
    }).populate("createdBy", "name email role");

    if (!updatedRecord) {
      throw new ApiError(404, "Financial record not found");
    }

    const responseRecord = updatedRecord;
    res.status(200).json({ message: "Record updated", data: responseRecord });
  } catch (error) {
    next(error);
  }
};

const deleteRecord = async (req, res, next) => {
  try {
    const record = await FinancialRecord.findOne({
      _id: req.params.id,
      isDeleted: false
    });

    if (!record) {
      throw new ApiError(404, "Financial record not found");
    }

    record.isDeleted = true;
    await record.save();

    res.status(200).json({ message: "Record deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord
};
