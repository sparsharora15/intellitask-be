const ProjectModel = require("../models/projectModel");
const {
  RESPONSE_MESSAGES,
  STATUS_CODE,
} = require("../constants/serverConstants");

exports.checkStatusValidity = async (req, res, next) => {
  try {
    const { status , projectId } = req.body;
    if (!projectId) {
      return res.status(STATUS_CODE.BAD_REQUEST).json({
        message: RESPONSE_MESSAGES.PROJECT_ID_REQUIRED,
      });
    }
    if (!status) {
      next()
    }

    const project = await ProjectModel.findById(projectId);
    const statusFound = project.status.findIndex(status => status === status)
    if (statusFound === -1) {
      throw new Error({
        message: RESPONSE_MESSAGES.STATUS_NOT_FOUND,
      });
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      message: RESPONSE_MESSAGES.SERVER_ERROR,
    });
  }
};
