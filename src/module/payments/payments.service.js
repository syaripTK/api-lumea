const {
  Payments,
  Pendaftar,
  Programs,
  sequelize,
} = require("../../db/models/index.js");
const { snap } = require("../../shared/utils/midtrans.js");

const generateOrderId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ORDER-${timestamp}-${random}`;
};

const createCharge = async (pendaftarId) => {
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

    if (!enrollment.programs) {
      throw new Error("Program not associated with this enrollment");
    }

    const orderId = generateOrderId();
    const grossAmount = enrollment.programs.biaya_pendaftaran;

    if (!process.env.MIDTRANS_SERVER_KEY || !process.env.MIDTRANS_CLIENT_KEY) {
      throw new Error(
        "Midtrans credentials not configured. Please add MIDTRANS_SERVER_KEY and MIDTRANS_CLIENT_KEY to .env file",
      );
    }

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

    let midtransTransaction;
    try {
      midtransTransaction = await snap.createTransaction(parameter);
    } catch (midtransError) {
      console.error("Midtrans API Error:", midtransError.message);
      throw new Error(
        `Midtrans payment gateway error: ${midtransError.message}`,
      );
    }

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
  const crypto = require("crypto");
  const {
    order_id,
    transaction_status,
    gross_amount,
    status_code,
    signature_key,
  } = notificationData;

  if (!order_id || !status_code || !gross_amount || !signature_key) {
    console.error("Webhook: Missing required fields");
    throw new Error("Missing required webhook fields");
  }

  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) {
    console.error("Webhook: Midtrans server key not configured");
    throw new Error("Midtrans server key not configured");
  }

  const inputString = order_id + status_code + gross_amount + serverKey;
  const hashed = crypto.createHash("sha512").update(inputString).digest("hex");

  console.log("Webhook signature verification:", {
    inputString,
    calculatedHash: hashed,
    receivedHash: signature_key,
    isValid: hashed === signature_key,
  });

  if (hashed !== signature_key) {
    console.error("Webhook: Invalid signature key");
    throw new Error("Invalid signature key");
  }

  const transaction = await sequelize.transaction();

  try {
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
      console.error("Webhook: Payment not found for order_id:", order_id);
      throw new Error("Payment not found");
    }

    await payment.update(
      {
        transaction_status,
        gross_amount: gross_amount || payment.gross_amount,
      },
      { transaction },
    );

    let status_pembayaran;
    if (
      transaction_status === "capture" ||
      transaction_status === "settlement"
    ) {
      status_pembayaran = "paid";
    } else if (
      transaction_status === "deny" ||
      transaction_status === "cancel" ||
      transaction_status === "expire"
    ) {
      status_pembayaran = "expired";
    }

    if (status_pembayaran && payment.pendaftar) {
      await payment.pendaftar.update({ status_pembayaran }, { transaction });
      console.log("Webhook: Updated enrollment status to:", status_pembayaran);
    }

    await transaction.commit();
    console.log("Webhook: Payment processed successfully for order:", order_id);
    return payment;
  } catch (error) {
    await transaction.rollback();
    console.error("Webhook: Database error:", error.message);
    throw error;
  }
};

module.exports = {
  createCharge,
  handleWebhook,
};
