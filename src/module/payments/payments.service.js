const { Payments, Pendaftar, Programs } = require("../../db/models/index.js");
const { snap } = require("../../shared/utils/midtrans.js");

const generateOrderId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ORDER-${timestamp}-${random}`;
};

const createCharge = async (pendaftarId) => {
  const sequelize = require("../../db/models/index.js").sequelize;
  const dbTransaction = await sequelize.transaction();

  try {
    const enrollment = await Pendaftar.findByPk(pendaftarId, {
      include: [
        {
          model: Programs,
          as: "programs",
          attributes: ["id", "nama_program", "biaya_pendaftaran"],
        },
      ],
      transaction: dbTransaction,
    });

    if (!enrollment) {
      throw new Error("Enrollment not found");
    }

    if (enrollment.status_pembayaran === "paid") {
      throw new Error("Already paid");
    }

    const orderId = generateOrderId();
    const grossAmount = enrollment.programs.biaya_pendaftaran;

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
      customer_details: {
        first_name: "Student",
        last_name: "Name",
        email: "student@example.com",
        phone: "081234567890",
      },
      item_details: [
        {
          id: enrollment.programs.id,
          price: grossAmount,
          quantity: 1,
          name: enrollment.programs.nama_program,
        },
      ],
    };

    const midtransTransaction = await snap.createTransaction(parameter);

    const payment = await Payments.create(
      {
        pendaftar_id: pendaftarId,
        order_id: orderId,
        gross_amount: grossAmount,
        snap_token: midtransTransaction.token,
        transaction_status: "pending",
      },
      { transaction: dbTransaction },
    );

    await dbTransaction.commit();
    return {
      order_id: orderId,
      gross_amount: grossAmount,
      snap_token: midtransTransaction.token,
      redirect_url: midtransTransaction.redirect_url,
    };
  } catch (error) {
    await dbTransaction.rollback();
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
