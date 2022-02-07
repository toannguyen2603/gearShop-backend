const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true,
    },
    type: {
      type: String,
    },
    slug: {
      type: String,
      require: true,
      unique: true,
    },
    categoryImage: {
      type: String,
    },
    parentId: {
      type: String,
    },
    createBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
  },
  { timestamps: true }
);

const categoryModel = mongoose.model("Category", categorySchema);

module.exports = categoryModel;
