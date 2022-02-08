const { register, login } = require("../controller/user.controller");
const { requireSignin } = require("../middleware/auth");
const category = require("../controller/category.controller");
const express = require("express");
const { signup, signin, logout } = require("../controller/admin/isAuth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/profile", requireSignin, (req, res) => {
  res.status(200).json({ msg: "profile" });
});

router.post("/admin/signup", signup);
router.post("/admin/signin", signin);

router.post("/category", category);

module.exports = router;
