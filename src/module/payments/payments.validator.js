const { body } = require("express-validator");

const chargeValidator = [
  body("pendaftar_id")
    .toInt()
    .notEmpty()
    .withMessage("Pendaftar ID wajib diisi")
    .bail()
    .isInt({ min: 1 })
    .withMessage("Pendaftar ID harus berupa angka positif"),
];

module.exports = {
  chargeValidator,
};
