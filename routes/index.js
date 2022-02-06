const express = require("express");
const router = express.Router();
const pagesRouter = require("./pages");
const usersRouter = require("./users");

router.use("/users", usersRouter);
router.use("/pages", pagesRouter);

module.exports = router;
