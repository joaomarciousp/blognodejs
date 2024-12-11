const { Router } = require("express");
const router = Router();
const slugify = require("slugify");
const Category = require("./Category");
const { where } = require("sequelize");

router.get("/admin/categories/new", (req, res) => {
  res.render("admin/categories/new");
});

router.post("/categories/save", (req, res) => {
  const title = req.body.title;

  if (title != undefined) {
    //tem um titulo

    Category.create({
      title: title,
      slug: slugify(title).toLowerCase(),
    }).then(() => {
      res.redirect("/admin/categories");
    });
  } else {
    res.redirect("/admin/categories/new");
  }
});

router.get("/admin/categories", (req, res) => {
  Category.findAll({ order: [["title", "ASC"]] }).then((categorias) => {
    res.render("admin/categories/index", { categorias: categorias });
  });
});

router.post("/categories/delete", (req, res) => {
  const id = req.body.id;

  if (id != undefined) {
    if (!isNaN(id)) {
      Category.destroy({
        where: {
          id: id,
        },
      }).then(() => {
        res.redirect("/admin/categories");
      });
    } else {
      //Não é um numero
      res.redirect("/admin/categories");
    }
  } else {
    //NUL
    res.redirect("/admin/categories");
  }
});

router.get("/admin/categories/edit/:id", (req, res) => {
  const id = req.params.id;

  Category.findByPk(id).then((categoria) => {
    if (categoria != undefined) {
      //achou categoria
      res.render("admin/categories/edit", { categoria: categoria });
    } else {
      res.redirect("/admin/categories");
    }
  });
});

router.post("/categories/update", (req, res) => {
  const id = req.body.id;
  const title = req.body.title;

  Category.update(
    {
      title: title,
      slug: slugify(title).toLowerCase(),
    },
    {
      where: {
        id: id,
      },
    }
  ).then(() => {
    res.redirect("/admin/categories");
  });
});

module.exports = router;
