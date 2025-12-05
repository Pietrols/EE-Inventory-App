require("dotenv").config();
const express = require("express");
const app = express();
const appRouter = require("./routes/appRouter");
const port = process.env.PORT;
const path = require("node:path");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));

app.use("/", appRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .render("error", { title: "Error", message: "Something went wrong!" });
});

app.listen(port, () => {
  console.log(`Inventory App listening at http://localhost:${port}`);
});

module.exports = app;
