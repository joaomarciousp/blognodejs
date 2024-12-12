const Sequelize = require("sequelize");
const conn = require("../database/db");

const User = conn.define("users", {
  nome: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

User.sync({ force: false }).then(() => {
  console.log("Tabela Usuarios Criada");
});

module.exports = User;
