const express = require("express");
const connectDB = require("./config/database");
const app = express();
const userRouters = require("./routers/user");
const adminRouters = require("./routers/admin");
const categoryRouters = require("./routers/category");

var bodyParser = require("body-parser");

const PORT = process.env.PORT || 8000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get("/", (req, res, next) => {
    res.status(200).json({
        message: "Create api successful",
    });
});

connectDB();

app.use("/api", userRouters);
app.use("/api", adminRouters);
app.use("/api", categoryRouters);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
