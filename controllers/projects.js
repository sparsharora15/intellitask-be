const {
  RESPONSE_MESSAGES,
  STATUS_CODE,
} = require("../constants/serverConstants");
const ProjectModel = require("../models/projectModel");
const TaskModel = require("../models/taskModel");

exports.create = async (req, res) => {
  try {
    const { title, description, status, users } = req.body;
    console.log(req.userId);
    console.log(users);
    const saveData = new ProjectModel({
      title,
      description,
      status,
      users: [req.userId.toString(), ...users],
      createdBy: req.userId,
    });
    await saveData.save();
    return res.status(STATUS_CODE.CREATED).json({
      status: STATUS_CODE.CREATED,
      message: RESPONSE_MESSAGES.SAVED_SUCCESSFULLY,
    });
  } catch (err) {
    console.log(err);
  }
};
exports.update = async (req, res) => {
  try {
    await ProjectModel.findByIdAndUpdate(req.params.projectId, req.body);
    if (req.body.removedUsers && req.body.removedUsers.length > 0) {
      await ProjectModel.findByIdAndUpdate(req.params.projectId, {
        $pull: {
          users: { $in: req.body.removedUsers },
        },
      });
    }
    return res.status(STATUS_CODE.OK).json({
      status: STATUS_CODE.OK,
      message: RESPONSE_MESSAGES.UPDATED_SUCCESSFULLY,
    });
  } catch (err) {
    console.log(err);
  }
};
exports.delete = async (req, res) => {
  try {
    await ProjectModel.findByIdAndDelete(req.params.projectId);
    return res.status(STATUS_CODE.OK).json({
      status: STATUS_CODE.OK,
      message: RESPONSE_MESSAGES.PROJECT_DELETED,
    });
  } catch (err) {
    console.log(err);
  }
};
exports.getAllProjectsByUserId = async (req, res) => {
  try {
    console.log(req.userId);
    const data = await ProjectModel.find({
      users: { $in: [req.userId.toString()] },
    })
      .populate("users")
      .populate("createdBy")
      .exec();
    return res.status(STATUS_CODE.OK).json({
      status: STATUS_CODE.OK,
      data,
    });
  } catch (err) {
    console.log(err);
  }
};
exports.getProjectById = async (req, res) => {
  try {
    const data = await ProjectModel.findById(req.params.projectId)
      .populate("users createdBy")
      .exec();
    return res.status(STATUS_CODE.OK).json({
      status: STATUS_CODE.OK,
      data,
    });
  } catch (err) {
    console.log(err);
  }
};
