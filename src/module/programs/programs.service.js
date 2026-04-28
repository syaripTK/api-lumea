const { Programs } = require("../../db/models/index.js");

const getAll = async () => {
  return await Programs.findAll({
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
};

const getById = async (id) => {
  return await Programs.findByPk(id, {
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
};

const create = async (data) => {
  const sequelize = require("../../db/models/index.js").sequelize;
  const transaction = await sequelize.transaction();

  try {
    const program = await Programs.create(data, { transaction });
    await transaction.commit();
    return program;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const update = async (id, data) => {
  const sequelize = require("../../db/models/index.js").sequelize;
  const transaction = await sequelize.transaction();

  try {
    const program = await Programs.findByPk(id, { transaction });
    if (!program) {
      throw new Error("Program not found");
    }
    await program.update(data, { transaction });
    await transaction.commit();
    return program;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const remove = async (id) => {
  const sequelize = require("../../db/models/index.js").sequelize;
  const transaction = await sequelize.transaction();

  try {
    const program = await Programs.findByPk(id, { transaction });
    if (!program) {
      throw new Error("Program not found");
    }
    await program.destroy({ transaction });
    await transaction.commit();
    return program;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
