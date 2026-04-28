const { Pendaftar, Programs, Profiles, Payments } = require("./src/db/models/index.js");

async function run() {
  try {
    const registrationsByProvince = await Pendaftar.findAll({
      attributes: [
        [
          require("sequelize").fn("COUNT", require("sequelize").col("Pendaftar.id")),
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
    console.log("registrationsByProvince", registrationsByProvince);

  } catch(e) {
    console.error(e);
  } finally {
    process.exit();
  }
}

run();
