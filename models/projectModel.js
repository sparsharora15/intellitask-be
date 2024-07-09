const mongoose = require("mongoose");
const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  users: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    required: true,
    ref: "user",
  },
  status: {
    type: [String],
    default: [],
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "user",
  },
}, { timestamps: { createdAt: true, updatedAt: true } });
const ProjectModel = mongoose.model("project", ProjectSchema);
module.exports = ProjectModel;
