const express = require("express");
const verifyToken = require("../../shared/middlewares/auth.middleware.js");
const { stats } = require("./reports.controller.js");
const router = express.Router();

router.get("/stats", verifyToken(["admin"]), stats);

module.exports = router;
