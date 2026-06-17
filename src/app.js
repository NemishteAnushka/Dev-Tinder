const express = require("express");
const connectDB = require("../src/config/database");

const app = express();

connectDB()
  .then(() => {
    console.log("DB connected successfully");
    app.listen("3000", () => {
      console.log("server started successfully");
    });
  })
  .catch((err) => {
    console.error(err);
  });
