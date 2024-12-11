const Sequelize = require("sequelize");
const conn = require("../database/db");
const Category = require("../categories/Category");

const Article = conn.define("articles", {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  body: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
});

Article.belongsTo(Category);
Category.hasMany(Article);

Article.sync({ force: false }).then(() => {
  console.log("Tabela Artigos Criada");
});

module.exports = Article;
