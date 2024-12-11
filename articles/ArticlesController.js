const { Router } = require("express");
const router = Router();

router.get("/articles", (req, res) => {
  res.send("Artigos");
});

module.exports = router;
