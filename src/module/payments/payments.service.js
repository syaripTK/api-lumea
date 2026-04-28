const { Payments, Pendaftar, Programs } = require("../../db/models/index.js");

const generateOrderId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ORDER-${timestamp}-${random}`;
};

const createCharge = async (pendaftarId) => {
  const sequelize = require("../../db/models/index.js").sequelize;
  const transaction = await sequelize.transaction();

  try {
    const enrollment = await Pendaftar.findByPk(pendaftarId, {
      include: [
        {
          model: Programs,
          as: "programs",
          attributes: ["id", "nama_program", "biaya_pendaftaran"],
        },
      ],
      transaction,
    });

    if (!enrollment) {
      throw new Error("Enrollment not found");
    }

    if (enrollment.status_pembayaran === "paid") {
      throw new Error("Already paid");
    }

    const orderId = generateOrderId();
    const grossAmount = enrollment.programs.biaya_pendaftaran;
    const snapToken = `SNAP-TOKEN-${orderId}-${Date.now()}`;

    const payment = await Payments.create(
      {
        pendaftar_id: pendaftarId,
        order_id: orderId,
        gross_amount: grossAmount,
        snap_token: snapToken,
        transaction_status: "pending",
      },
      { transaction },
    );

    await transaction.commit();
    return payment;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const handleWebhook = async (notificationData) => {
  const sequelize = require("../../db/models/index.js").sequelize;
  const transaction = await sequelize.transaction();

  try {
    const { order_id, transaction_status, gross_amount } = notificationData;

    const payment = await Payments.findOne({
      where: { order_id },
      include: [
        {
          model: Pendaftar,
          as: "pendaftar",
        },
      ],
      transaction,
    });

    if (!payment) {
      throw new Error("Payment not found");
    }

    await payment.update(
      {
        transaction_status,
        gross_amount: gross_amount || payment.gross_amount,
      },
      { transaction },
    );

    if (
      transaction_status === "settlement" ||
      transaction_status === "capture"
    ) {
      await payment.pendaftar.update(
        { status_pembayaran: "paid" },
        { transaction },
      );
    } else if (transaction_status === "expire") {
      await payment.pendaftar.update(
        { status_pembayaran: "expired" },
        { transaction },
      );
    }

    await transaction.commit();
    return payment;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = {
  createCharge,
  handleWebhook,
};
