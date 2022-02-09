const express = require("express");
const router = express.Router();

const shortid = require("shortid");
const path = require("path");
const multer = require("multer");

// PATH

const { addCategory, getCategories, updateCategories, deleteCategories } = require("../controller/category.controller");
const { requireSignIn, adminMiddleware } = require("../middleware/auth");

// SET STORAGE
// TODO: Determine storage locations for files

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(path.dirname(__dirname), "uploads"));
    },
    filename: function (req, file, cb) {
        cb(null, shortid.generate() + "-" + file.originalname);
    },
});
const upload = multer({ storage });

// ROUTER

router.post("/category/create", requireSignIn, adminMiddleware, upload.single("categoryImage"), addCategory);
router.get("/category/getCategory", getCategories);
router.post("/category/update", requireSignIn, adminMiddleware, upload.array("categoryImage"), updateCategories);
router.post("/category/delete", requireSignIn, adminMiddleware, deleteCategories);

module.exports = router;
