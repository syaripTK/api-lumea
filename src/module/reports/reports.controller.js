const {
  errorResponse,
  successResponse,
} = require("../../shared/utils/response.js");
const { getStats } = require("./reports.service.js");

const statsController = async (req, res) => {
  try {
    const stats = await getStats();
    return successResponse(res, 200, "Statistics retrieved successfully", stats);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

module.exports = {
  stats: statsController,
};
