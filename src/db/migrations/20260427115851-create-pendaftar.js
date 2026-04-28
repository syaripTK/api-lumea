"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("pendaftars", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      program_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "programs",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      ijazah_path: {
        type: Sequelize.STRING,
      },
      status_pendaftaran: {
        type: Sequelize.ENUM("pending", "terverifikasi", "ditolak"),
        defaultValue: "pending",
      },
      status_pembayaran: {
        type: Sequelize.ENUM("unpaid", "paid", "expired"),
        defaultValue: "unpaid",
      },
      catatan_admin: {
        type: Sequelize.TEXT,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("pendaftars");
  },
};
