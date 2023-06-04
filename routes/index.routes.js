const express = require("express");
const AuthRouter = require("./auth.routes");
const ContactRouter = require("./contact.routes");

const AppRouter = express.Router();

AppRouter.use("/auth", AuthRouter);
AppRouter.use("/contact", ContactRouter);

module.exports = AppRouter;
