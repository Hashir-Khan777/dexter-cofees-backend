const express = require("express");
const { MailService } = require("../services/index.service");

const ContactRouter = express.Router();

ContactRouter.post("/", async (req, res) => {
  try {
    const { name, lastname, email, subject, message } = req.body;
    const text = `
    Name: ${name}
    Last Name: ${lastname}
    Email: ${email}
    Subject: ${subject}
    Message: ${message}
    `;
    await MailService.sendMail("customercare@dextercoffees.com", subject, text);
    return res.status(200).send({ message: "Thanks for your message" });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = ContactRouter;
