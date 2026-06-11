const express = require("express");

const app = express();

app.get("/users", (req, res) => {
  res.send({ firstName: "Anushka", lastName: "Nemishte" });
});

app.post("/users", (req, res) => {
  //logic
  res.send("Added User in DB successfully");
});

app.patch("/users", (req, res) => {
  //logic
  res.send("Edited user successfully");
});

app.delete("/users", (req, res) => {
  //logic
  res.send("Deleted User successfully");
});
app.listen("3000", () => {
  console.log("server started successfully");
});
