const { successResponse, errorResponse } = require("../../shared/utils/response.js");
const { getStudentStats, getAdminAnalytics } = require("./dashboard.service.js");

const studentStatsController = async (req, res) => {
  try {
    const userId = req.user.id;
    const stats = await getStudentStats(userId);
    return successResponse(res, 200, "Student stats fetched successfully", stats);
  } catch (error) {
    console.error("Student Stats Error:", error);
    return errorResponse(res, 500, error.message);
  }
};

const adminAnalyticsController = async (req, res) => {
  try {
    const analytics = await getAdminAnalytics();
    return successResponse(res, 200, "Admin analytics fetched successfully", analytics);
  } catch (error) {
    console.error("Admin Analytics Error:", error);
    return errorResponse(res, 500, error.message);
  }
};

module.exports = {
  getStudentStats: studentStatsController,
  getAdminAnalytics: adminAnalyticsController,
};
