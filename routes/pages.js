const express = require("express");
const router = express.Router();
const { Pages, Users } = require("../models");

//  /wiki
router.get("/", (req, res, next) => {
  Pages.findAll()
    .then((pages) => res.send(pages))
    .catch(next);
});

router.post("/", (req, res, next) => {
  const { name, email } = req.body;
  Users.findOrCreate({
    where: { name, email },
  })
    .then((data) => {
      const user = data[0];
      Pages.create(req.body)
        .then((page) => page.setAuthor(user))
        .then((page) => res.send(page));
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/:urlTitle", (req, res, next) => {
  // Finding the Page
  Pages.findOne({
    where: {
      urlTitle: req.params.urlTitle,
    },
    include: { model: Users, as: "author" },
  })
    .then((page) => {
      if (!page) return next("No se encontro tu pagina");
      res.send(page);
    })
    .catch(next);
});

router.put("/:urlTitle", (req, res, next) => {
  Pages.update(req.body, {
    where: {
      urlTitle: req.params.urlTitle,
    },
    returning: true,
  })
    .then(([affectedRows, updated]) => {
      const page = updated[0];
      res.send(page);
    })
    .catch(next);
});

/** DELETE **/
router.delete("/:id", (req, res, next) => {
  Pages.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then(() => res.sendStatus(202))
    .catch(next);
});

router.get("/:urlTitle/similar", (req, res, next) => {
  Pages.findOne({
    where: {
      urlTitle: req.params.urlTitle,
    },
  })
    .then(function (page) {
      if (!page) next("No se encontro tu pagina");
      return page.findSimilar();
    })
    .then(function (similarPages) {
      return res.send(similarPages);
    })
    .catch(next);
});

router.get("/search/:tag", (req, res, next) => {
  Pages.findByTag(req.params.tag)
    .then((pages) => res.send(pages))
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
