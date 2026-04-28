const express = require("express");
const validate = require("../../shared/middlewares/errors/validate.js");
const verifyToken = require("../../shared/middlewares/auth.middleware.js");
const { createValidator, updateValidator, idValidator } = require("./programs.validator.js");
const { getAll, getById, create, update, remove } = require("./programs.controller.js");
const router = express.Router();

router.get("/", getAll);
router.get("/:id", idValidator, validate, getById);
router.post("/", verifyToken(["admin"]), createValidator, validate, create);
router.patch("/:id", verifyToken(["admin"]), updateValidator, validate, update);
router.delete("/:id", verifyToken(["admin"]), idValidator, validate, remove);

module.exports = router;
