const midtransClient = require("midtrans-client");

const midtransConfig = {
  isProduction: process.env.MIDTRANS_IS_SANDBOX === "false",
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
};

const snap = new midtransClient.Snap({
  isProduction: midtransConfig.isProduction,
  serverKey: midtransConfig.serverKey,
  clientKey: midtransConfig.clientKey,
});

module.exports = {
  snap,
  midtransConfig,
};
