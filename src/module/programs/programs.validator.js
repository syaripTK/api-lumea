const { body, param } = require("express-validator");

const createValidator = [
  body("nama_program")
    .trim()
    .notEmpty()
    .withMessage("Nama program wajib diisi")
    .isLength({ max: 50 })
    .withMessage("Nama program maksimal 50 karakter"),
  body("deskripsi")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Deskripsi tidak boleh kosong"),
  body("biaya_pendaftaran")
    .isInt({ min: 0 })
    .withMessage("Biaya pendaftaran harus berupa angka positif"),
  body("kuota")
    .isInt({ min: 1 })
    .withMessage("Kuota harus berupa angka positif"),
];

const updateValidator = [
  param("id")
    .toInt()
    .notEmpty()
    .withMessage("ID wajib diisi")
    .bail()
    .isInt({ min: 1 })
    .withMessage("ID harus berupa angka positif"),
  body("nama_program")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Nama program tidak boleh kosong")
    .isLength({ max: 50 })
    .withMessage("Nama program maksimal 50 karakter"),
  body("deskripsi")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Deskripsi tidak boleh kosong"),
  body("biaya_pendaftaran")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Biaya pendaftaran harus berupa angka positif"),
  body("kuota")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Kuota harus berupa angka positif"),
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
  updateValidator,
  idValidator,
};
