const express = require("express");
const router = express.Router();

const { signUp, signIn, logOut } = require("../controller/admin/isAuth");

const { validateSignUpRequest, validateSignInRequest, isRequestValidated } = require("../validators/auth");

router.post("/admin/signUp", validateSignUpRequest, isRequestValidated, signUp);
router.post("/admin/signIn", validateSignInRequest, isRequestValidated, signIn);
router.post("/admin/signOut", logOut);

module.exports = router;
