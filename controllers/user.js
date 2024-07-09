const UserModel = require("../models/userModel");
const {
  RESPONSE_MESSAGES,
  STATUS_CODE,
} = require("../constants/serverConstants");

exports.syncUserDetails = async (req, res) => {
  try {
    const { fullName, userId, phoneNo, email } = req.body;
    if (
      (!fullName || fullName.trim === "" || !userId || userId.trim === "",
        !email || email === "")
    )
      return res.status(STATUS_CODE.BAD_REQUEST).json({
        status: STATUS_CODE.BAD_REQUEST,
        message: RESPONSE_MESSAGES.VALIDATION_ERROR,
      });
    const saveData = new UserModel({
      fullName: fullName ?? email,
      userId,
      phoneNo,
      email,
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
exports.getAllUsers = async (req, res) => {
  try {
    // const { search } = req.search;

    // if (!search) {
    //   return res.status(400).json({ message: "search parameter is required" });
    // }

    // Using a regular expression to perform a case-insensitive search
    // const users = await UserModel.find({
    //   $or: [
    //     { name: { $regex: search, $options: 'i' } },
    //     { email: { $regex: search, $options: 'i' } }
    //   ]
    // });
    const users = await UserModel.find({});

    res.status(200).json({data:users});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred while searching for users" });
  }
};
