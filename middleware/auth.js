const jwt = require("jsonwebtoken");

//  check authorization token when login
exports.requireSignIn = (req, res, next) => {
    if (req.headers.authorization) {
        const accessToken = req.headers?.authorization?.split(" ")[1];
        const user = jwt.verify(accessToken, process.env.JWT_SECRET);
        req.user = user;
    } else {
        return res.status(400).json({
            msg: "Authorization required",
        });
    }

    //  Next when success
    next();
};

// check role when login
exports.userMiddleware = (req, res, next) => {
    if (req.user.role !== "user") {
        return res.status(400).json({ message: "User access denied" });
    }
    next();
};
