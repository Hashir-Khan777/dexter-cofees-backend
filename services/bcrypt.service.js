const bcrypt = require("bcrypt");

const bcryptPassword = (password) => bcrypt.hash(password, 16);

const comparePassword = (userPassword, databaseUserPassword) =>
  bcrypt.compare(userPassword, databaseUserPassword);

module.exports = { bcryptPassword, comparePassword };
