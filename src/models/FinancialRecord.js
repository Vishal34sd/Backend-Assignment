import mongoose from "mongoose";

const recordSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
      index: true
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      index: true
    },
    date: {
      type: Date,
      required: true,
      index: true
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

recordSchema.index({ date: -1, category: 1 });
recordSchema.index({ type: 1, date: -1 });
recordSchema.index({ notes: "text", category: "text" });

const FinancialRecord = mongoose.model("FinancialRecord", recordSchema);

export default FinancialRecord;
