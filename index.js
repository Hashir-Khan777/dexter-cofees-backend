const express = require("express");
const AppRouter = require("./routes/index.routes");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

app.use(cors({ origin: process.env.ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  "/api",
  (req, res, next) => {
    if (req.headers.origin) {
      next();
    } else {
      res.send({ message: "You are not allowed to call this action" });
    }
  },
  AppRouter
);

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
