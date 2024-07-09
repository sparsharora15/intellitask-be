const TaskModel = require("../models/taskModel");
const {
    RESPONSE_MESSAGES,
    STATUS_CODE,
} = require("../constants/serverConstants");

exports.checkTaskExists = async (req, res, next) => {
    try {
        const task = await TaskModel.findById(req.params.taskId)
        if (task) {
            req.task = task
            next()
        } else {
            return res.status(STATUS_CODE.NOT_FOUND).json({
                message: RESPONSE_MESSAGES.TASK_NOT_FOUND,
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: RESPONSE_MESSAGES.SERVER_ERROR,
        });
    }
};
