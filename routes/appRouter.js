const { Router } = require("express");
const appRouter = Router();

appRouter.get("/", (req, res) => {
  res.send("Hello Router!");
});

module.exports = appRouter;
