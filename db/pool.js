require("dotenv").config;
const { Pool } = require("pg");

modules.exports = new Pool({
  connectionString: process.env.DATABASE_URL,
});
