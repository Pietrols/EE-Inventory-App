const { Router } = require("express");
const appRouter = Router();
const disciplineController = require("../controllers/userController");

appRouter.get("/", (req, res) => {
  res.redirect("/discplines");
  res.send("Hello Router!");
});
appRouter.get("/disciplines", disciplineController.disciplineList);

module.exports = appRouter;
