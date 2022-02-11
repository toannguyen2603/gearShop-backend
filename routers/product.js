const express = require("express");
const router = express.Router();

const shortid = require("shortid");
const multer = require("multer");
const path = require("path");

const { requireSignIn, adminMiddleware, uploadS3 } = require("../middleware/auth");
const { createProduct, getProductBySlug } = require("../controller/product.controller");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(path.dirname(__dirname), "uploads"));
    },
    filename: function (req, file, cb) {
        cb(null, shortid.generate() + "-" + file.originalname);
    },
});
const upload = multer({ storage });

router.post("/product/create", requireSignIn, adminMiddleware, upload.array("productImages"), createProduct);

module.exports = router;
