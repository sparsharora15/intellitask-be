const mongoose = require("mongoose");

const statusHistory = new mongoose.Schema(
  {
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    changedFrom: {
      type: String,
      required: true,
    },
    changedTo: {
      type: String,
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

const taskSchema = new mongoose.Schema(
  {
    taskName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: false,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    priority: {
      type: String,
      required: false,
      default: "low",
      enum: ["high", "medium", "low"],
    },
    status: {
      type: String,
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "project",
      require: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "user",
    },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "user",
    },
    statusHistory: {
      type: [statusHistory],
      default: [],
      require: false,
    },
    attachments: {
      type: [
        {
          url: { type: String, required: true },
          fileName: { type: String, required: true },
        },
      ],
      default: [],
      require: false,
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);
const TaskModel = mongoose.model("task", taskSchema);
module.exports = TaskModel;
