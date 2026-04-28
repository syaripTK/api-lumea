const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendWelcomeEmail = async (to, name) => {
  try {
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">Welcome to Education Service</h1>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px;">Dear <strong>${name}</strong>,</p>
          <p style="font-size: 16px;">Thank you for registering with our Education Service Application. Your account has been successfully created.</p>
          <p style="font-size: 16px;">You can now access all features of our platform using your registered email address.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Get Started</a>
          </div>
          <p style="font-size: 14px; color: #666;">If you have any questions, please contact our support team.</p>
          <p style="font-size: 14px; color: #666;">Best regards,<br>Education Service Team</p>
        </div>
      </div>
    </body>
    </html>
  `;

    const info = await transporter.sendMail({
      from: `"Lumea Education" <${process.env.SMTP_USER}>`,
      to,
      subject: "Welcome to Education Service",
      html: htmlContent,
    });

    console.log("Email sent: " + info.messageId);
    return info;
  } catch (error) {
    console.error("Email send failed:", error);
    return null;
  }
};

module.exports = { sendWelcomeEmail };
