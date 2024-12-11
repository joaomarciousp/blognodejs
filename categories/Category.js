const Sequelize = require("sequelize");
const conn = require("../database/db");

const Category = conn.define("categories", {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

Category.sync({ force: false }).then(() => {
  console.log("Tabela Categorias Criada");
});

module.exports = Category;
