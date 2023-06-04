const nodemailer = require("nodemailer");

const sendMail = async (to, subject, text) => {
  let transporter = nodemailer.createTransport({
    // service: process.env.NODEMAILER_HOST,
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    secure: true,
    auth: {
      user: "dextercoffees23@gmail.com",
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: "Dexter Coffees <dextercoffees23@gmail.com>",
    to,
    subject,
    text,
  });
};

module.exports = { sendMail };