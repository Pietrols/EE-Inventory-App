require("dotenv").config();
const express = require("express");
const app = express();
const appRouter = require("./routes/appRouter");
const port = process.env.PORT || 3000;
const path = require("node:path");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", appRouter);

// Error handling middleware (must be last)
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).render("error", {
    title: "Error",
    message: err.message || "Something went wrong!",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render("error", {
    title: "Not Found",
    message: "Page not found",
  });
});

app.listen(port, () => {
  console.log(`Inventory App listening at http://localhost:${port}`);
});

module.exports = app;
