"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Programs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Programs.hasMany(models.Pendaftar, {
        foreignKey: "program_id",
        as: "pendaftar",
      });
    }
  }
  Programs.init(
    {
      nama_program: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      deskripsi: {
        type: DataTypes.TEXT,
      },
      biaya_pendaftaran: {
        type: DataTypes.INTEGER,
      },
      kuota: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "Programs",
      tableName: "programs",
      timestamps: true
    },
  );
  return Programs;
};
