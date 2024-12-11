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
const { where } = require("sequelize");

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
  Article.findAll({ order: [["id", "DESC"]], limit: 4 }).then((articles) => {
    Category.findAll().then((categorias) => {
      res.render("index", { articles: articles, categorias: categorias });
    });
  });
});

//rota que exibe os artigos
app.get("/:slug", (req, res) => {
  const slug = req.params.slug;
  Article.findOne({
    where: {
      slug: slug,
    },
  })
    .then((article) => {
      if (article != undefined) {
        Category.findAll().then((categorias) => {
          res.render("article", { article: article, categorias: categorias });
        });
      } else {
        res.redirect("/");
      }
    })
    .catch((err) => {
      res.redirect("/");
    });
});

app.get("/category/:slug", (req, res) => {
  const slug = req.params.slug;
  Category.findOne({
    where: {
      slug: slug,
    },
    include: [{ model: Article }],
  }).then((categoria) => {
    if (categoria != undefined) {
      //achou uma categoria
      Category.findAll().then((categorias) => {
        res.render("index", {
          articles: categoria.articles,
          categorias: categorias,
        });
      });
    } else {
      res.redirect("/");
    }
  });
});

//abrindo servidor
app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
});
