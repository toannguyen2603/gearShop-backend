const express = require("express");
const router = express.Router();

const { register, login } = require("../controller/user.controller");
const { requireSignIn } = require("../middleware/auth");
const category = require("../controller/category.controller");

router.post("/register", register);
router.post("/login", login);
router.post("/profile", requireSignIn, (req, res) => {
    res.status(200).json({ msg: "profile" });
});

router.post("/category", category);

module.exports = router;
