const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const { requireSignIn, adminMiddleware, uploadS3 } = require("../middleware/auth");
const { createProduct, getProductBySlug } = require("../controller/product.controller");

router.post("/product/create", upload.single("productImage"), createProduct);

module.exports = router;
