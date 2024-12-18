const { Router } = require("express");
const router = Router();
const User = require("./User");
const bcrypt = require("bcryptjs");
const adminAuth = require("../middlewares/adminAuth");

router.get("/admin/users", adminAuth, (req, res) => {
  User.findAll().then((users) => {
    res.render("users/index", { users: users });
  });
});

router.get("/admin/users/create", adminAuth, (req, res) => {
  res.render("users/create");
});

router.post("/users/save", (req, res) => {
  const nome = req.body.nome;
  const email = req.body.email;
  const password = req.body.password;

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  User.findOne({
    where: {
      email: email,
    },
  }).then((usuarioexistente) => {
    if (usuarioexistente != undefined) {
      res.redirect("/admin/users/create");
    } else {
      User.create({
        nome: nome,
        email: email,
        password: hash,
      }).then(() => {
        res.redirect("/admin/users");
      });
    }
  });
});

router.get("/admin/users/edit/:id", (req, res) => {
  const id = req.params.id;

  User.findByPk(id).then((user) => {
    res.render("users/edit", { user: user });
  });
});

router.post("/users/update", (req, res) => {
  const nome = req.body.nome;
  const email = req.body.email;
  const id = req.body.id;
  User.update(
    {
      nome: nome,
      email: email,
    },
    {
      where: {
        id: id,
      },
    }
  ).then(() => {
    res.redirect("/admin/users");
  });
});

router.post("/users/delete", (req, res) => {
  const id = req.body.id;
  User.destroy({
    where: {
      id: id,
    },
  }).then(() => {
    res.redirect("/admin/users");
  });
});

router.get("/admin/login", (req, res) => {
  res.render("users/login");
});

router.post("/authenticate", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({
    where: {
      email: email,
    },
  }).then((user) => {
    if (user != undefined) {
      //existe

      const correct = bcrypt.compareSync(password, user.password);

      if (correct) {
        req.session.user = {
          id: user.id,
          nome: user.nome,
        };

        res.redirect("/admin/articles");
      } else {
        res.redirect("/admin/login");
      }
    } else {
      res.redirect("/admin/login");
    }
  });
});

router.get("/logout", (req, res) => {
  req.session.user = undefined;

  res.redirect("/");
});

module.exports = router;
