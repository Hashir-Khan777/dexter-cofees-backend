const jwt = require("jsonwebtoken");

const generateToken = (user, expiresIn) =>
  jwt.sign({ ...user }, process.env.JWT_SECRET, { expiresIn });

const isAuth = (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization?.slice(7, authorization.length);
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        res.status(401).send({ message: "Please login" });
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    res.status(401).send({ message: "Please login" });
  }
};

module.exports = { generateToken, isAuth };
