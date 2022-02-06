require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGOOSE_USER}:${process.env.MONGOOSE_PASSWORD}@tutorials.wpyym.mongodb.net/${process.env.MONGOOSE_DATABASE}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("MongoDB connecting .......");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;
