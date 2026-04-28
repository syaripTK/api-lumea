const express = require("express");
const validate = require("../../shared/middlewares/errors/validate.js");
const verifyToken = require("../../shared/middlewares/auth.middleware.js");
const { chargeValidator } = require("./payments.validator.js");
const { charge, webhook } = require("./payments.controller.js");
const router = express.Router();

router.post("/charge", verifyToken(["siswa", "admin"]), chargeValidator, validate, charge);
router.post("/notification", webhook);

module.exports = router;
