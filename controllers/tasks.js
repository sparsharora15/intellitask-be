const {
  RESPONSE_MESSAGES,
  STATUS_CODE,
} = require("../constants/serverConstants");
const TaskModel = require("../models/taskModel");
const ProjectModel = require("../models/projectModel");
const UserModel = require("../models/userModel");
const { upload } = require("../services/cloudinaryServices");
const createFilter = require("../services/helper");
const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { default: mongoose } = require("mongoose");

exports.create = async (req, res) => {
  try {
    const {
      taskName,
      description,
      dueDate,
      priority,
      status,
      projectId,
      assignedTo,
    } = req.body;
    const taskToSave = {
      taskName,
      description,
      dueDate,
      priority,
      status,
      projectId,
      createdBy: req.userId,
      assignedTo,
      lastModifiedBy: req.userId,
    };
    if (req.files) {
      const attachments = await upload(req.files);
      taskToSave["attachments"] = attachments;
    }

    const saveData = new TaskModel(taskToSave);
    await UserModel.findByIdAndUpdate(req.userId, {
      $push: {
        tasks: saveData._id,
      },
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
    let { deletedAttachments, ...updateFields } = req.body;
    if (req.files && req.files.length > 0) {
      const attachments = await upload(req.files);
      await TaskModel.findByIdAndUpdate(req.params.taskId, {
        $push: { attachments: attachments },
      });
    }
    if (req.body.status) {
      const statusHistory = {
        changedBy: req.userId,
        changedFrom: req.task.status,
        changedTo: req.body.status,
      };
      updateFields = { ...updateFields, statusHistory };
    }

    if (updateFields.assignedTo === "null") {
      updateFields.$unset = { assignedTo: 1 };
      delete updateFields.assignedTo;
    }
    console.log(updateFields);
    await TaskModel.findByIdAndUpdate(req.params.taskId, updateFields);

    if (deletedAttachments && deletedAttachments.length > 0) {
      const taskFetched = await TaskModel.findById(req.params.taskId);
      const cleanedAttachments = taskFetched.attachments.filter(
        (attachment) => !deletedAttachments.includes(attachment._id.toString())
      );

      taskFetched.attachments = cleanedAttachments;
      await taskFetched.save();
    }

    return res.status(STATUS_CODE.OK).json({
      status: STATUS_CODE.OK,
      message: RESPONSE_MESSAGES.UPDATED_SUCCESSFULLY,
    });
  } catch (err) {
    console.log(err);
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      status: STATUS_CODE.INTERNAL_SERVER_ERROR,
      message: err.message,
    });
  }
};
exports.getTasksByProjectId = async (req, res) => {
  try {
    let filter = {};
    filter.projectId = req.params.projectId;
    const { userId } = req;

    const tasks = await TaskModel.find(filter)
      .populate("projectId createdBy  assignedTo lastModifiedBy")
      .exec();
    const project = await ProjectModel.findById(filter.projectId);
    return res.status(STATUS_CODE.OK).json({
      status: STATUS_CODE.OK,
      data: { statuses: project.status, tasks },
    });
  } catch (err) {
    console.log(err);
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      status: STATUS_CODE.INTERNAL_SERVER_ERROR,
      message: err.message,
    });
  }
};
exports.getAllUnassignedTaskByUserId = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);

    const unassignedTasks = await TaskModel.aggregate([
      { $match: { assignedTo: { $exists: false } } },
      {
        $lookup: {
          from: "projects",
          localField: "projectId",
          foreignField: "_id",
          as: "projectDetails",
        },
      },
      { $unwind: "$projectDetails" },

      { $match: { "projectDetails.users": userId } },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdByUserDetails",
        },
      },
      { $unwind: "$createdByUserDetails" },
      {
        $project: {
          _id: 1,
          taskName: 1,
          description: 1,
          dueDate: 1,
          priority: 1,
          status: 1,
          createdAt: 1,
          projectId: 1,
          createdBy: 1,
          lastModifiedBy: 1,
          attachments: 1,
          statusHistory: 1,
          "projectDetails._id": 1,
          "projectDetails.title": 1,
          "projectDetails.description": 1,
          "projectDetails.status": 1,
          "projectDetails.createdBy": 1,
          "createdByUserDetails._id": 1,
          "createdByUserDetails.fullName": 1,
          "createdByUserDetails.email": 1,
          "createdByUserDetails.phoneNo": 1,
        },
      },
    ]).exec();

    if (unassignedTasks.length === 0) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json({ message: RESPONSE_MESSAGES.NO_UNASSIGNED_TASK_FOUND });
    }

    return res.status(STATUS_CODE.OK).json({ data: unassignedTasks });
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      status: STATUS_CODE.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

exports.getTasksByUserId = async (req, res) => {
  try {
    let filter = {};
    if (Object.keys(req.query).length > 0) {
      filter = createFilter(req.query);
    }
    filter = {
      $or: [
        { assignedTo: req.userId.toString() },
        { createdBy: req.userId.toString() },
      ],
    };

    const tasks = await TaskModel.find(filter)
      .populate("projectId createdBy assignedTo")
      .exec();
    return res.status(STATUS_CODE.OK).json({
      status: STATUS_CODE.OK,
      data: tasks,
    });
  } catch (err) {
    console.log(err);
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      status: STATUS_CODE.INTERNAL_SERVER_ERROR,
      message: err.message,
    });
  }
};
exports.getTaskById = async (req, res) => {
  try {
    const data = await TaskModel.findById(req.params.taskId)
      .populate("projectId createdBy  assignedTo")
      .exec();

    return res.status(STATUS_CODE.OK).json({
      status: STATUS_CODE.OK,
      data,
    });
  } catch (err) {
    console.log(err);
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      status: STATUS_CODE.INTERNAL_SERVER_ERROR,
      message: err.message,
    });
  }
};
exports.delete = async (req, res) => {
  try {
    await TaskModel.findByIdAndDelete(req.params.taskId);
    return res.status(STATUS_CODE.OK).json({
      status: STATUS_CODE.OK,
      message: RESPONSE_MESSAGES.TASK_DELETED,
    });
  } catch (err) {
    console.log(err);
  }
};
exports.askAi = async (req, res) => {
  const prompt = `Given the task title: "${req.body.taskTitle}", provide a detailed and concise description for the task development activities and give the task description in html. Also keep in mind that the response format is json and I want results in {title , description} this type of object`;
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
    };
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });
    const result = await chatSession.sendMessage(prompt);
    return res.status(STATUS_CODE.OK).json({
      status: STATUS_CODE.OK,
      data: JSON.parse(result.response.candidates[0].content.parts[0].text),
    });
  } catch (err) {
    console.log(err);
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      error: err,
    });
  }
};
