const { body, param } = require("express-validator");

const registerValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email wajib diisi")
    .bail()
    .isEmail()
    .withMessage("Format email tidak valid"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password wajib diisi")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Password minimal 6 karakter"),

  body("nama_lengkap")
    .trim()
    .notEmpty()
    .withMessage("Nama lengkap wajib diisi"),

  body("nisn").trim().notEmpty().withMessage("NISN wajib diisi"),
];

const loginValidator = [
  body("email").trim().notEmpty().withMessage("Email wajib diisi"),
  body("password").trim().notEmpty().withMessage("Password wajib diisi"),
];

const idParamsValidator = [
  param("id")
    .toInt()
    .notEmpty()
    .withMessage("Id param wajib diisi")
    .bail()
    .isInt({ min: 1 })
    .withMessage("Id param harus berupa angka positif"),
];

module.exports = {
  registerValidator,
  loginValidator,
  idParamsValidator,
};
