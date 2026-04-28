const express = require("express");
const verifyToken = require("../../shared/middlewares/auth.middleware.js");
const { getStudentStats, getAdminAnalytics } = require("./dashboard.controller.js");
const router = express.Router();

router.get("/siswa/stats", verifyToken(["siswa"]), getStudentStats);
router.get("/admin/analytics", verifyToken(["admin"]), getAdminAnalytics);

module.exports = router;
