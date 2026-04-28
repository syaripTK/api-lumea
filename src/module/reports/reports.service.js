const {
  Pendaftar,
  Programs,
  Profiles,
  Payments,
} = require("../../db/models/index.js");
const { Op } = require("sequelize");

const getStats = async () => {
  try {
    const totalRegistrations = await Pendaftar.count({
      where: { status_pendaftaran: "terverifikasi" },
    });

    const totalRevenueResult = await Payments.findAll({
      attributes: [
        [
          require("sequelize").fn("SUM", require("sequelize").col("gross_amount")),
          "total",
        ],
      ],
      include: [
        {
          model: Pendaftar,
          as: "pendaftar",
          where: { status_pembayaran: "paid" },
          attributes: [],
        },
      ],
      raw: true,
    });
    const totalRevenue = totalRevenueResult[0]?.total || 0;

    const registrationsByProgram = await Pendaftar.findAll({
      attributes: [
        "program_id",
        [
          require("sequelize").fn(
            "COUNT",
            require("sequelize").col("Pendaftar.id"),
          ),
          "count",
        ],
      ],
      include: [
        {
          model: Programs,
          as: "programs",
          attributes: ["id", "nama_program"],
        },
      ],
      where: { status_pendaftaran: "terverifikasi" },
      group: ["program_id", "programs.id", "programs.nama_program"],
      raw: true,
    });

    const registrationsByProvince = await Pendaftar.findAll({
      attributes: [
        [
          require("sequelize").fn(
            "COUNT",
            require("sequelize").col("Pendaftar.id"),
          ),
          "count",
        ],
      ],
      include: [
        {
          model: Profiles,
          as: "profiles",
          attributes: ["provinsi_id"],
        },
      ],
      where: { status_pendaftaran: "terverifikasi" },
      group: ["profiles.provinsi_id"],
      raw: true,
    });

    return {
      totalRegistrations: totalRegistrations || 0,
      totalRevenue: totalRevenue,
      registrationsByProgram: registrationsByProgram.map((item) => ({
        program_id: item.program_id,
        program_name: item["programs.nama_program"],
        count: parseInt(item.count),
      })),
      registrationsByProvince: registrationsByProvince.map((item) => ({
        provinsi_id: item["profiles.provinsi_id"],
        count: parseInt(item.count),
      })),
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getStats,
};
