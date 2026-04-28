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
    const payment = await createCharge(pendaftar_id);
    return successResponse(res, 201, "Payment charge created successfully", {
      order_id: payment.order_id,
      gross_amount: payment.gross_amount,
      snap_token: payment.snap_token,
      redirect_url: payment.redirect_url,
    });
  } catch (error) {
    if (error.message === "Enrollment not found") {
      return errorResponse(res, 404, "Enrollment not found");
    }
    if (error.message === "Already paid") {
      return errorResponse(res, 400, "Already paid");
    }
    if (error.message === "Program not associated with this enrollment") {
      return errorResponse(
        res,
        400,
        "Program not associated with this enrollment",
      );
    }
    console.error("Payment Charge Error:", error);
    return errorResponse(res, 500, error.message);
  }
};

const webhookController = async (req, res) => {
  try {
    if (!req.body) {
      console.error("Webhook: No body received");
      return res.status(200).send("OK");
    }
    console.log("Webhook received:", JSON.stringify(req.body));
    await handleWebhook(req.body);
    return res.status(200).send("OK");
  } catch (error) {
    console.error("Webhook processing error:", error.message);
    return res.status(200).send("OK");
  }
};

module.exports = {
  charge: chargeController,
  webhook: webhookController,
};
