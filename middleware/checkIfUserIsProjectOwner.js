const ProjectModel = require("../models/projectModel");
const {
    RESPONSE_MESSAGES,
    STATUS_CODE,
} = require("../constants/serverConstants");

exports.isUserProjectOwner = async (req, res, next) => {
    try {
        const project = await ProjectModel.findById(req.params.projectId)
        if (project) {
            req.project = project
            next()
        } else {
            return res.status(STATUS_CODE.NOT_FOUND).json({
                message: RESPONSE_MESSAGES.PROJECT_NOT_FOUND,
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: RESPONSE_MESSAGES.SERVER_ERROR,
        });
    }
};
