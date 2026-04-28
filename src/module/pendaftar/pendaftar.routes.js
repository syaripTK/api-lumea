const express = require("express");
const validate = require("../../shared/middlewares/errors/validate.js");
const verifyToken = require("../../shared/middlewares/auth.middleware.js");
const uploadPhoto = require("../../shared/middlewares/upload.middlware.js");
const { createValidator, updateStatusValidator, idValidator } = require("./pendaftar.validator.js");
const { create, getMy, getAll, updateStatus } = require("./pendaftar.controller.js");
const router = express.Router();

router.post("/", verifyToken(["siswa"]), uploadPhoto("ijazah"), createValidator, validate, create);
router.get("/me", verifyToken(["siswa"]), getMy);
router.get("/", verifyToken(["admin"]), getAll);
router.patch("/:id/status", verifyToken(["admin"]), updateStatusValidator, validate, updateStatus);

module.exports = router;
