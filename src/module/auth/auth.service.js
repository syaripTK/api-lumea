const { Users, Profiles } = require("../../db/models/index.js");
const {
  hashPassword,
  comparePassword,
  generateToken,
} = require("../../shared/utils/helpers.js");
const { sendWelcomeEmail } = require("../../shared/utils/mailer.js");

const register = async (email, password, profileData) => {
  const { sequelize } = require("../../db/models/index.js");
  const transaction = await sequelize.transaction();

  try {
    const hashedPassword = await hashPassword(password);

    const user = await Users.create(
      {
        email,
        password: hashedPassword,
        role: "siswa",
      },
      { transaction },
    );

    await Profiles.create(
      {
        user_id: user.id,
        ...profileData,
      },
      { transaction },
    );
    await transaction.commit();

    try {
      await sendWelcomeEmail(email, profileData.nama_lengkap);
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError.message);
    }

    return user;
  } catch (error) {
    if (transaction) await transaction.rollback();
    throw error;
  }
};

const login = async (email, password) => {
  const user = await Users.findOne({
    where: { email },
  });
  if (!user) {
    throw new Error("Invalid credentials");
  }
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }
  const token = generateToken(user);
  return { token, user: { id: user.id, email: user.email, role: user.role } };
};

const getMe = async (userId) => {
  const user = await Users.findOne({
    where: { id: userId },
    attributes: { exclude: ["password"] },
    include: [
      {
        model: Profiles,
        as: "profiles",
        attributes: [
          "nama_lengkap",
          "nisn",
          "telepon",
          "alamat",
          "provinsi_id",
          "kota_id",
          "kecamatan_id",
        ],
      },
    ],
  });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

module.exports = {
  register,
  login,
  getMe,
};
