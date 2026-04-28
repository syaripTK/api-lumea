"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Pendaftar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Pendaftar.hasMany(models.Payments, {
        foreignKey: "pendaftar_id",
        as: "payments",
      });
      Pendaftar.belongsTo(models.Users, {
        foreignKey: "user_id",
        as: "users",
      });
      Pendaftar.belongsTo(models.Programs, {
        foreignKey: "program_id",
        as: "programs",
      });
      Pendaftar.belongsTo(models.Profiles, {
        foreignKey: "user_id",
        targetKey: "user_id",
        as: "profiles",
      });
    }
  }
  Pendaftar.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
      },
      program_id: {
        type: DataTypes.INTEGER,
      },
      ijazah_path: {
        type: DataTypes.STRING,
      },
      status_pendaftaran: {
        type: DataTypes.ENUM("pending", "terverifikasi", "ditolak"),
        defaultValue: "pending",
      },
      status_pembayaran: {
        type: DataTypes.ENUM("unpaid", "paid", "expired"),
        defaultValue: "unpaid",
      },
      catatan_admin: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      modelName: "Pendaftar",
      tableName: "pendaftars",
      timestamps: true,
    },
  );
  return Pendaftar;
};
