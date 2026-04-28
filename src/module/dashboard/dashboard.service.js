const { Pendaftar, Programs, Users, Payments, sequelize } = require("../../db/models/index.js");
const { Op } = require("sequelize");

const getStudentStats = async (userId) => {
  const total_enrollments = await Pendaftar.count({
    where: { user_id: userId },
  });

  const latestEnrollment = await Pendaftar.findOne({
    where: { user_id: userId },
    order: [["createdAt", "DESC"]],
  });

  return {
    total_enrollments,
    active_status: latestEnrollment ? latestEnrollment.status_pendaftaran : null,
    payment_status: latestEnrollment ? latestEnrollment.status_pembayaran : null,
  };
};

const getAdminAnalytics = async () => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const monthlyTrend = await Pendaftar.findAll({
    attributes: [
      [sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%Y-%m"), "month"],
      [sequelize.fn("COUNT", sequelize.col("id")), "count"],
    ],
    where: {
      createdAt: { [Op.gte]: sixMonthsAgo },
    },
    group: ["month"],
    order: [["month", "ASC"]],
    raw: true,
  });

  const programDistribution = await Pendaftar.findAll({
    attributes: [
      [sequelize.col("programs.nama_program"), "name"],
      [sequelize.fn("COUNT", sequelize.col("Pendaftar.id")), "count"],
    ],
    include: [
      {
        model: Programs,
        as: "programs",
        attributes: [],
      },
    ],
    group: ["programs.nama_program"],
    raw: true,
  });

  const paymentRatio = await Pendaftar.findAll({
    attributes: [
      "status_pembayaran",
      [sequelize.fn("COUNT", sequelize.col("id")), "count"],
    ],
    group: ["status_pembayaran"],
    raw: true,
  });

  const totalRegisteredUsers = await Users.count({ where: { role: "siswa" } });
  
  const totalRevenueResult = await Pendaftar.findOne({
    attributes: [
      [sequelize.fn("SUM", sequelize.col("programs.biaya_pendaftaran")), "total"],
    ],
    include: [
      {
        model: Programs,
        as: "programs",
        attributes: [],
      },
    ],
    where: { status_pembayaran: "paid" },
    raw: true,
  });

  const pendingReviews = await Pendaftar.count({
    where: { status_pendaftaran: "pending" },
  });

  return {
    monthly_registration_trend: monthlyTrend,
    program_distribution: programDistribution,
    payment_ratio: paymentRatio,
    kpi_cards: {
      total_registered_users: totalRegisteredUsers,
      total_revenue: parseFloat(totalRevenueResult.total || 0),
      pending_document_reviews: pendingReviews,
    },
  };
};

module.exports = {
  getStudentStats,
  getAdminAnalytics,
};
