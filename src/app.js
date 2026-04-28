process.env.TZ = "Asia/Jakarta";
const express = require("express");
const sequelize = require("./config/sequelize.js");
const path = require("path");
const cors = require("cors");
const notFound = require("./shared/middlewares/errors/notFound.js");
const errorHandler = require("./shared/middlewares/errors/errorHandler.js");
const authRouter = require("./module/auth/auth.routes.js");
const programsRouter = require("./module/programs/programs.routes.js");
const pendaftarRouter = require("./module/pendaftar/pendaftar.routes.js");
const paymentsRouter = require("./module/payments/payments.routes.js");
const reportsRouter = require("./module/reports/reports.routes.js");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/programs", programsRouter);
app.use("/api/v1/pendaftar", pendaftarRouter);
app.use("/api/v1/payments", paymentsRouter);
app.use("/api/v1/reports", reportsRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
