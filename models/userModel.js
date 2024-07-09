const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  tasks: {
    type: [mongoose.Schema.Types.ObjectId],
    require: false,
    ref: "task",
  },
  notifications: {
    type: {
      notificationTitle: String,
      notificationDescription: String
    },
    require: false,

  }
});
const UserModel = mongoose.model("user", UserSchema);
module.exports = UserModel;
