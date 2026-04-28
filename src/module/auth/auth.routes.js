const express = require("express");
const validate = require("../../shared/middlewares/errors/validate.js");
const verifyToken = require("../../shared/middlewares/auth.middleware.js");
const { registerValidator, loginValidator } = require("./auth.validator.js");
const { register, login, getMe } = require("./auth.controller.js");
const router = express.Router();

router.post("/register", registerValidator, validate, register);
router.post("/login", loginValidator, validate, login);
router.get("/me", verifyToken(), getMe);
module.exports = router;
