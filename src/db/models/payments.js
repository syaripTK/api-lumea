"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Payments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Payments.belongsTo(models.Pendaftar, {
        foreignKey: "pendaftar_id",
        as: "pendaftar",
      });
    }
  }
  Payments.init(
    {
      pendaftar_id: {
        type: DataTypes.INTEGER,
      },
      order_id: {
        type: DataTypes.STRING,
        unique: true,
      },
      gross_amount: {
        type: DataTypes.DECIMAL,
      },
      snap_token: {
        type: DataTypes.STRING,
      },
      transaction_status: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Payments",
      tableName: "payments",
      timestamps: true,
    },
  );
  return Payments;
};
