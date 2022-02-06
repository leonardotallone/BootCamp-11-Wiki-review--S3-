const express = require("express");
const router = express.Router();

const { Pages, Users } = require("../models");

// /users
router.get("/", (req, res, next) => {
  Users.findAll()
    .then((users) => {
      return res.send(users);
    })
    .catch(next);
});

// /users/5
router.get("/:id", (req, res, next) => {
  const { id } = req.params;
  Pages.findAll({ where: { authorId: id } })
    .then((pages) => {
      res.send(pages);
    })
    .catch(next);
});

module.exports = router;
