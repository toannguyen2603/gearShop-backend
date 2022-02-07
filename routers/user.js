const { register, login } = require("../controller/user.controller");
const { requireSignin } = require("../middleware/auth");
const category = require("../controller/category.controller");
const express = require("express");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/profile", requireSignin, (req, res) => {
  res.status(200).json({ msg: "profile" });
});

router.post("/category", category);

module.exports = router;
