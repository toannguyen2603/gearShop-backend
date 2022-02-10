const jwt = require("jsonwebtoken");
const multer = require("multer");
const shortid = require("shortid");
const path = require("path");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");

// TODO: create file storage area image

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //The folder to which the file has been saved

        cb(null, path.join(path.dirname(__dirname), "uploads"));
    },
    filename: function (req, file, cb) {
        // Name of the file on the user’s computer

        cb(null, shortid.generate() + "-" + file.originalname);
    },
});
const upload = multer({ storage: storage });

const accessKeyId = process.env.accessKeyId;
const secretAccessKey = process.env.secretAccessKey;

const s3 = new aws.S3({
    accessKeyId,
    secretAccessKey,
});
// TODO: check authorization token when login

exports.uploadS3 = multer({
    storage: multerS3({
        s3: s3,
        bucket: "GearShop",
        acl: "public-read",
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, shortid.generate() + "-" + file.originalname);
        },
    }),
});

module.exports = {
    requireSignIn: (req, res, next) => {
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
    },

    // check role when login
    userMiddleware: (req, res, next) => {
        if (req.user.role !== "user") {
            return res.status(400).json({ message: "User access denied" });
        }
        next();
    },
    adminMiddleware: (req, res, next) => {
        if (req.user.role !== "admin") {
            return res.status(200).json({ message: "Admin access denied" });
        }
        next();
    },
};
