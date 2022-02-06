const mongoose = require("mongoose");
const userSchema = require("./userSchema");

module.exports = userModel = mongoose.model("users", userSchema);
