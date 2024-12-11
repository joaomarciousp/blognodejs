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

router.get("/admin/articles/edit/:id", (req, res) => {
  const id = req.params.id;

  Article.findByPk(id)
    .then((article) => {
      if (article != undefined) {
        Category.findAll().then((categorias) => {
          res.render("admin/articles/edit", {
            article: article,
            categorias: categorias,
          });
        });
      } else {
        res.redirect("/");
      }
    })
    .catch((err) => {
      res.redirect("/");
    });
});

router.post("/articles/update", (req, res) => {
  const id = req.body.id;
  const title = req.body.title;
  const body = req.body.body;
  const categoria = req.body.categoria;

  if (id != undefined) {
    if (!isNaN(id)) {
      Article.update(
        {
          title: title,
          body: body,
          categoryId: categoria,
          slug: slugify(title).toLowerCase(),
        },
        {
          where: {
            id: id,
          },
        }
      ).then(() => {
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

router.get("/articles/page/:num", (req, res) => {
  const page = req.params.num;
  var offset = 0;

  if (isNaN(page) || page == 0 || page == 1) {
    offset = 0;
  } else {
    offset = (parseInt(page) - 1) * 4;
  }

  Article.findAndCountAll({
    limit: 4,
    offset: offset,
    order: [["id", "DESC"]],
  }).then((articles) => {
    var next;
    if (offset + 4 >= articles.count) {
      next = false;
    } else {
      next = true;
    }
    var result = {
      page: parseInt(page),
      next: next,
      articles: articles,
    };
    Category.findAll().then((categorias) => {
      res.render("admin/articles/page", {
        result: result,
        categorias: categorias,
      });
    });
  });
});

module.exports = router;
