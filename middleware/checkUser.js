const UserModel = require("../models/userModel");
const {
  RESPONSE_MESSAGES,
  STATUS_CODE,
} = require("../constants/serverConstants");

exports.checkUser = async (req, res, next) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(STATUS_CODE.BAD_REQUEST).json({
        message: RESPONSE_MESSAGES.MISSING_USER_ID,
      });
    }

    const user = await UserModel.findOne({ userId: userId });
    if (user) {
      throw new Error({
        message: RESPONSE_MESSAGES.USER_FOUND,
        user,
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
