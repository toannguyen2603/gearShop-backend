require("dotenv").config();

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGOOSE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connecting .......");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;
