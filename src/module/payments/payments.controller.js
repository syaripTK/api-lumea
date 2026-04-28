const {
  errorResponse,
  successResponse,
} = require("../../shared/utils/response.js");
const { createCharge, handleWebhook } = require("./payments.service.js");

const chargeController = async (req, res) => {
  try {
    if (!req.body) {
      return errorResponse(res, 400, "Body is required");
    }
    const { pendaftar_id } = req.body;
    const userId = req.user.id;

    const payment = await createCharge(pendaftar_id);
    return successResponse(res, 201, "Payment charge created successfully", {
      order_id: payment.order_id,
      gross_amount: payment.gross_amount,
      snap_token: payment.snap_token,
    });
  } catch (error) {
    if (error.message === "Enrollment not found") {
      return errorResponse(res, 404, "Enrollment not found");
    }
    if (error.message === "Already paid") {
      return errorResponse(res, 400, "Already paid");
    }
    if (error.message === "Program not associated with this enrollment") {
      return errorResponse(res, 400, "Program not associated with this enrollment");
    }

    console.error("Payment Charge Error:", error);
    return errorResponse(res, 500, error.message);
  }
};

const webhookController = async (req, res) => {
  try {
    if (!req.body) {
      return errorResponse(res, 400, "Body is required");
    }

    const notificationData = req.body;
    console.log("Webhook received:", notificationData);
    await handleWebhook(notificationData);
    return successResponse(res, 200, "Webhook processed successfully");
  } catch (error) {
    console.error("Webhook error:", error);
    return errorResponse(res, 500, error.message);
  }
};

module.exports = {
  charge: chargeController,
  webhook: webhookController,
};
