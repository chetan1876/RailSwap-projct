const nodemailer = require("nodemailer");

console.log("EMAIL_USER =", process.env.EMAIL_USER);
console.log("EMAIL_PASS =", process.env.EMAIL_PASS ? "Loaded" : "Not Loaded");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,

  port: parseInt(process.env.EMAIL_PORT, 10) || 587,
  secure: false, // true for 465, false for 587 (STARTTLS)


  port: Number(process.env.EMAIL_PORT),
  secure: false,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  tls: {
    rejectUnauthorized: false,
  },
});

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

// Verify SMTP connection at startup
transporter.verify((error, success) => {
  if (error) {
    console.error("[SMTP] Transporter verification FAILED:", error.message);
    console.error("[SMTP] Check EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS in .env");
  } else {
    console.log("[SMTP] Transporter is ready to send emails.");
  }
});



const sendEmail = async ({
  to,
  subject,
  html,
  text,
}) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,

      to,

      subject,

      text,

      html,
    });

    console.log(
      `Email Sent Successfully: ${info.messageId}`
    );

    return info;
  } catch (error) {
    console.error(
      "[Email] Sending Failed:",
      error.message,
      error.code || "",
      error.response || ""
    );

    // Re-throw original error so callers can see the real reason
    throw error;
  }
};

module.exports = {
  transporter,
  sendEmail,
};