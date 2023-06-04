const express = require("express");
const { UserModel } = require("../models/index.models");
const {
  JwtService,
  MailService,
  BcryptService,
} = require("../services/index.service");

const AuthRouter = express.Router();

AuthRouter.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const isUserAlreadyExist = await UserModel.findOne({
      email,
      verified: true,
    });
    if (isUserAlreadyExist) {
      return res.status(403).send({ message: "You are already registered" });
    }
    req.body.password = await BcryptService.bcryptPassword(password);
    const code = Math.round(100000 + Math.random() * 999999).toString();
    const user = await UserModel.create({ ...req.body, role: ["user"] });
    const text = `Thank you to register in Global Shopping Spot. Your verification code is ${code.slice(
      0,
      6
    )}. Please enter this code to verify your email`;
    await MailService.sendMail(email, "Verification Code", text);
    res.status(200).send({
      ...user._doc,
      token: JwtService.generateToken(
        { ...user._doc, code: code.slice(0, 6) },
        "1h"
      ),
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

AuthRouter.post("/verify/email", JwtService.isAuth, async (req, res) => {
  try {
    const { code } = req.body;
    const { user } = req;
    if (code.toString() === user.code.toString()) {
      const userVerified = await UserModel.findOneAndUpdate(
        { _id: user._id },
        { verified: true },
        { new: true }
      );
      return res.status(200).send({
        ...userVerified._doc,
        token: JwtService.generateToken(userVerified._doc, "30d"),
      });
    }
    return res.status(400).send({ message: "Invalid code" });
  } catch (err) {
    res.status(500).send(err);
  }
});

AuthRouter.get("/verify/user", JwtService.isAuth, async (req, res) => {
  try {
    const { user } = req;
    if (user) {
      const userModel = await UserModel.findOne({ _id: user?._id }).populate(
        "details"
      );
      return res.status(200).send(userModel);
    }
    return res.status(404).send({ message: "Please register yourself" });
  } catch (err) {
    res.status(500).send(err);
  }
});

AuthRouter.get("/user/:userId", JwtService.isAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserModel.findOne({ _id: userId });
    return res.status(200).send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

AuthRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email, verified: true });
    if (user) {
      const isPasswordGoogle = await BcryptService.comparePassword(
        "google",
        user.password
      );
      if (isPasswordGoogle) {
        return res.status(200).send({
          ...user._doc,
          token: JwtService.generateToken(user._doc, "30d"),
        });
      } else {
        const isPasswordCorrect = await BcryptService.comparePassword(
          password,
          user.password
        );
        if (isPasswordCorrect) {
          return res.status(200).send({
            ...user._doc,
            token: JwtService.generateToken(user._doc, "30d"),
          });
        }
        return res.status(403).send({ message: "Incorrect password" });
      }
    }
    return res.status(404).send({ message: "Please register yourself" });
  } catch (err) {
    res.status(500).send(err);
  }
});

AuthRouter.post("/forgot/password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email, verified: true });
    if (user) {
      const token = JwtService.generateToken({ email }, "1h");
      return res.status(200).send({ token });
    }
    return res.status(404).send({ message: "Please register yourself" });
  } catch (err) {
    res.status(500).send(err);
  }
});

AuthRouter.post("/reset/password", JwtService.isAuth, async (req, res) => {
  try {
    const { password } = req.body;
    const { email } = req.user;
    const user = await UserModel.findOne({ email, verified: true });
    if (user) {
      const hashedPassword = await BcryptService.bcryptPassword(password);
      await UserModel.findOneAndUpdate(
        { email },
        { password: hashedPassword },
        { new: true }
      );
      return res.status(200).send({ message: "Password has been reset" });
    }
    return res.status(404).send({ message: "Please register yourself" });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = AuthRouter;
