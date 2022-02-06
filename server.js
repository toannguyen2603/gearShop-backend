const express = require("express");
const connectDB = require("./config/database");
const app = express();

const PORT = process.env.PORT || 8000;

app.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Create api successful",
  });
});

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
