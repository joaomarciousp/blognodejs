const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const conn = require("./database/db");
const CategoriesController = require("./categories/CategoriesController");
const ArticlesController = require("./articles/ArticlesController");

const Category = require("./categories/Category");
const Article = require("./articles/Article");

//view engine
app.set("view engine", "ejs");

//static
app.use(express.static("public"));

//bodyparser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//conectando banco de dados
conn
  .authenticate()
  .then(() => {
    console.log("Banco conectado com sucesso!");
  })
  .catch((error) => {
    console.log(error);
  });

//rotas controllers
app.use("/", CategoriesController);
app.use("/", ArticlesController);

//rota principal
app.get("/", (req, res) => {
  res.render("index");
});

//abrindo servidor
app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
});
