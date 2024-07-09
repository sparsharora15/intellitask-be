const mongoose = require("mongoose");
const connectionUrl = process.env.CONNECTION_URL;

exports.connect = async () => {
  try {
    await mongoose.connect(connectionUrl, {
      writeConcern: {
        w: "majority",
        wtimeout: 10000,
      },
    });
    console.log("connnected to db");
  } catch (e) {
    console.log(e);
  }
};
