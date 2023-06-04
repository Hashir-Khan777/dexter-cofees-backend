const nodemailer = require("nodemailer");

const sendMail = async (to, subject, text) => {
  let transporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    secure: true,
    auth: {
      user: "info@globalshoppingspot.com",
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: "Global Shopping Spot <info@globalshoppingspot.com>",
    to,
    subject,
    text,
  });
};

module.exports = { sendMail };