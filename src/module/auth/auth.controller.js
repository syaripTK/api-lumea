const {
  errorResponse,
  successResponse,
  loginResponse,
} = require("../../shared/utils/response.js");
const { register, login, getMe } = require("./auth.service.js");

const registerController = async (req, res) => {
  try {
    if (!req.body) {
      return errorResponse(res, 400, "Body is required");
    }
    const {
      email,
      password,
      nama_lengkap,
      nisn,
      telepon,
      alamat,
      provinsi_id,
      kota_id,
      kecamatan_id,
    } = req.body;
    const profileData = {
      nama_lengkap,
      nisn,
      telepon,
      alamat,
      provinsi_id,
      kota_id,
      kecamatan_id,
    };
    await register(email, password, profileData);
    return successResponse(res, 201, "Registration successful");
  } catch (error) {
    console.error("Registration error:", error);
    if (error.name === "SequelizeUniqueConstraintError") {
      const field = error.errors[0]?.path;
      if (field === "email") {
        return errorResponse(res, 400, "Email already registered");
      }
      if (field === "nisn") {
        return errorResponse(res, 400, "NISN already registered");
      }
      return errorResponse(res, 400, "Duplicate entry detected");
    }
    if (error.name === "SequelizeValidationError") {
      return errorResponse(res, 400, error.message);
    }
    return errorResponse(res, 500, error.message);
  }
};

const loginController = async (req, res) => {
  try {
    if (!req.body) {
      return errorResponse(res, 400, "Body is required");
    }
    const { email, password } = req.body;

    const result = await login(email, password);
    return loginResponse(
      res,
      200,
      "Login successful",
      result.token,
      result.user,
    );
  } catch (error) {
    return errorResponse(res, 401, "Invalid credentials");
  }
};

const getMeController = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await getMe(userId);
    return successResponse(
      res,
      200,
      "User profile retrieved successfully",
      user,
    );
  } catch (error) {
    return errorResponse(res, 404, error.message);
  }
};

module.exports = {
  register: registerController,
  login: loginController,
  getMe: getMeController,
};
