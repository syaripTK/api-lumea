const { Pendaftar, Users, Programs, Profiles } = require("../../db/models/index.js");

const createEnrollment = async (userId, programId, ijazahPath) => {
  const sequelize = require("../../db/models/index.js").sequelize;
  const transaction = await sequelize.transaction();

  try {
    const existingEnrollment = await Pendaftar.findOne({
      where: { user_id: userId, program_id: programId },
      transaction,
    });

    if (existingEnrollment) {
      throw new Error("Already enrolled in this program");
    }

    const enrollment = await Pendaftar.create(
      {
        user_id: userId,
        program_id: programId,
        ijazah_path: ijazahPath,
        status_pendaftaran: "pending",
        status_pembayaran: "unpaid",
      },
      { transaction }
    );

    await transaction.commit();
    return enrollment;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getMyEnrollment = async (userId) => {
  return await Pendaftar.findAll({
    where: { user_id: userId },
    include: [
      {
        model: Programs,
        as: "programs",
        attributes: ["id", "nama_program", "deskripsi", "biaya_pendaftaran"],
      },
    ],
    attributes: ["id", "ijazah_path", "status_pendaftaran", "status_pembayaran", "catatan_admin"],
  });
};

const getAllEnrollments = async () => {
  return await Pendaftar.findAll({
    include: [
      {
        model: Users,
        as: "users",
        attributes: ["id", "email", "role"],
      },
      {
        model: Programs,
        as: "programs",
        attributes: ["id", "nama_program", "biaya_pendaftaran"],
      },
      {
        model: Profiles,
        as: "profiles",
        attributes: ["nama_lengkap", "nisn", "telepon", "provinsi_id", "kota_id"],
      },
    ],
    attributes: ["id", "ijazah_path", "status_pendaftaran", "status_pembayaran", "catatan_admin", "createdAt"],
  });
};

const updateStatus = async (id, status, catatanAdmin = null) => {
  const sequelize = require("../../db/models/index.js").sequelize;
  const transaction = await sequelize.transaction();

  try {
    const enrollment = await Pendaftar.findByPk(id, { transaction });
    if (!enrollment) {
      throw new Error("Enrollment not found");
    }

    const updateData = { status_pendaftaran: status };
    if (catatanAdmin) {
      updateData.catatan_admin = catatanAdmin;
    }

    await enrollment.update(updateData, { transaction });
    await transaction.commit();
    return enrollment;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = {
  createEnrollment,
  getMyEnrollment,
  getAllEnrollments,
  updateStatus,
};
