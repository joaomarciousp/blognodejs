const { Router } = require("express");
const router = Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify");

router.get("/admin/articles", (req, res) => {
  Article.findAll({
    include: [{ model: Category }],
  }).then((articles) => {
    res.render("admin/articles/index", { articles: articles });
  });
});

router.get("/admin/articles/new", (req, res) => {
  Category.findAll().then((categorias) => {
    res.render("admin/articles/new", { categorias: categorias });
  });
});

router.post("/articles/save", (req, res) => {
  const title = req.body.title;
  const body = req.body.body;
  const categoria = req.body.categoria;

  Article.create({
    title: title,
    slug: slugify(title).toLowerCase(),
    body: body,
    categoryId: categoria,
  }).then(() => {
    res.redirect("/admin/articles");
  });
});

router.post("/articles/delete", (req, res) => {
  const id = req.body.id;

  if (id != undefined) {
    if (!isNaN(id)) {
      Article.destroy({
        where: {
          id: id,
        },
      }).then(() => {
        res.redirect("/admin/articles");
      });
    } else {
      //Não é um numero
      res.redirect("/admin/articles");
    }
  } else {
    //NUL
    res.redirect("/admin/articles");
  }
});

module.exports = router;
