const {
  errorResponse,
  successResponse,
} = require("../../shared/utils/response.js");
const { createEnrollment, getMyEnrollment, getAllEnrollments, updateStatus } = require("./pendaftar.service.js");

const createController = async (req, res) => {
  try {
    if (!req.body) {
      return errorResponse(res, 400, "Body is required");
    }
    const { program_id } = req.body;
    const userId = req.user.id;
    const ijazahPath = req.file?.path;

    if (!ijazahPath) {
      return errorResponse(res, 400, "Ijazah file is required");
    }

    const enrollment = await createEnrollment(userId, program_id, ijazahPath);
    return successResponse(res, 201, "Enrollment created successfully", enrollment);
  } catch (error) {
    if (error.message === "Already enrolled in this program") {
      return errorResponse(res, 400, "Already enrolled in this program");
    }
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return errorResponse(res, 400, "Invalid program_id");
    }
    return errorResponse(res, 500, error.message);
  }
};

const getMyController = async (req, res) => {
  try {
    const userId = req.user.id;
    const enrollments = await getMyEnrollment(userId);
    return successResponse(res, 200, "Enrollments retrieved successfully", enrollments);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const getAllController = async (req, res) => {
  try {
    const enrollments = await getAllEnrollments();
    return successResponse(res, 200, "All enrollments retrieved successfully", enrollments);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const updateStatusController = async (req, res) => {
  try {
    if (!req.body) {
      return errorResponse(res, 400, "Body is required");
    }
    const { id } = req.params;
    const { status, catatan_admin } = req.body;

    if (!["terverifikasi", "ditolak"].includes(status)) {
      return errorResponse(res, 400, "Status must be 'terverifikasi' or 'ditolak'");
    }

    const enrollment = await updateStatus(id, status, catatan_admin);
    return successResponse(res, 200, "Enrollment status updated successfully", enrollment);
  } catch (error) {
    if (error.message === "Enrollment not found") {
      return errorResponse(res, 404, "Enrollment not found");
    }
    return errorResponse(res, 500, error.message);
  }
};

module.exports = {
  create: createController,
  getMy: getMyController,
  getAll: getAllController,
  updateStatus: updateStatusController,
};
