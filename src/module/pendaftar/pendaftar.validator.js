const { body, param } = require("express-validator");

const createValidator = [
  body("program_id")
    .toInt()
    .notEmpty()
    .withMessage("Program ID wajib diisi")
    .bail()
    .isInt({ min: 1 })
    .withMessage("Program ID harus berupa angka positif"),
];

const updateStatusValidator = [
  param("id")
    .toInt()
    .notEmpty()
    .withMessage("ID wajib diisi")
    .bail()
    .isInt({ min: 1 })
    .withMessage("ID harus berupa angka positif"),
  body("status")
    .trim()
    .notEmpty()
    .withMessage("Status wajib diisi")
    .bail()
    .isIn(["terverifikasi", "ditolak"])
    .withMessage("Status harus 'terverifikasi' atau 'ditolak'"),
  body("catatan_admin")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Catatan admin tidak boleh kosong"),
];

const idValidator = [
  param("id")
    .toInt()
    .notEmpty()
    .withMessage("ID wajib diisi")
    .bail()
    .isInt({ min: 1 })
    .withMessage("ID harus berupa angka positif"),
];

module.exports = {
  createValidator,
  updateStatusValidator,
  idValidator,
};
