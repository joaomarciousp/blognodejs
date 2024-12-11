const dotenv = require("dotenv");
dotenv.config();

const Sequelize = require("sequelize");
const conn = new Sequelize(
  `${process.env.DB_NAME}`,
  `${process.env.DB_USER}`,
  `${process.env.DB_PASSWORD}`,
  {
    host: "localhost",
    dialect: "mysql",
    timezone: "-03:00",
  }
);

module.exports = conn;
