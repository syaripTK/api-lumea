const {
  errorResponse,
  successResponse,
} = require("../../shared/utils/response.js");
const { getAll, getById, create, update, remove } = require("./programs.service.js");

const getAllController = async (req, res) => {
  try {
    const programs = await getAll();
    return successResponse(res, 200, "Programs retrieved successfully", programs);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const getByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const program = await getById(id);
    if (!program) {
      return errorResponse(res, 404, "Program not found");
    }
    return successResponse(res, 200, "Program retrieved successfully", program);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const createController = async (req, res) => {
  try {
    if (!req.body) {
      return errorResponse(res, 400, "Body is required");
    }
    const { nama_program, deskripsi, biaya_pendaftaran, kuota } = req.body;
    const programData = { nama_program, deskripsi, biaya_pendaftaran, kuota };
    const program = await create(programData);
    return successResponse(res, 201, "Program created successfully", program);
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      return errorResponse(res, 400, error.message);
    }
    return errorResponse(res, 500, error.message);
  }
};

const updateController = async (req, res) => {
  try {
    if (!req.body) {
      return errorResponse(res, 400, "Body is required");
    }
    const { id } = req.params;
    const { nama_program, deskripsi, biaya_pendaftaran, kuota } = req.body;
    const programData = { nama_program, deskripsi, biaya_pendaftaran, kuota };
    const program = await update(id, programData);
    return successResponse(res, 200, "Program updated successfully", program);
  } catch (error) {
    if (error.message === "Program not found") {
      return errorResponse(res, 404, "Program not found");
    }
    if (error.name === "SequelizeValidationError") {
      return errorResponse(res, 400, error.message);
    }
    return errorResponse(res, 500, error.message);
  }
};

const removeController = async (req, res) => {
  try {
    const { id } = req.params;
    const program = await remove(id);
    return successResponse(res, 200, "Program deleted successfully", program);
  } catch (error) {
    if (error.message === "Program not found") {
      return errorResponse(res, 404, "Program not found");
    }
    return errorResponse(res, 500, error.message);
  }
};

module.exports = {
  getAll: getAllController,
  getById: getByIdController,
  create: createController,
  update: updateController,
  remove: removeController,
};
