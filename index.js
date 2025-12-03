require("dotenv").config();
const express = require("express");
const app = express();
const appRouter = require("./routes/appRouter");
const port = process.env.PORT;

app.use("/", appRouter);

app.listen(port, () => {
  console.log(`Inventory App listening at http://localhost:${port}`);
});

module.exports = app;
