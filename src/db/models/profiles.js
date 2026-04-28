'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profiles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profiles.belongsTo(models.Users, {
        foreignKey: "user_id",
        as: "users",
      });
    }
  }
  Profiles.init({
    user_id: {
        type: DataTypes.INTEGER,
      },
      nama_lengkap: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      nisn: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      telepon: {
        type: DataTypes.STRING,
      },
      alamat: {
        type: DataTypes.TEXT,
      },
      provinsi_id: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      kota_id: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      kecamatan_id: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
  }, {
    sequelize,
    modelName: 'Profiles',
    tableName: "profiles",
    timestamps: true
  });
  return Profiles;
};