const express = require("express");
const { userAuth } = require("./middleware/auth");

const app = express();

// multiple route handlers

//Pass control to the next middleware using next().
app.use(
  "/abc",
  (req, res, next) => {
    console.log("Sending response 1");
    next();
  },
  (req, res) => {
    console.log("response 2");
    res.send("Response 2");
  },
);

//middleware

app.use("/admin", (req, res, next) => {
  const token = "xz";
  const isAuthenticated = token === "xyz";

  if (isAuthenticated) {
    next();
  } else {
    res.status(401).send("Unauthorised");
  }
});


//we can write middleware in middle of routehandlers also

app.get("/users", userAuth, (req, res) => {
  res.send({ firstName: "Anushka", lastName: "Nemishte" });
});

app.get("/users/:userId", userAuth, (req, res) => {
  console.log(req.params);
  res.send({ firstName: "Anushka", lastName: "Nemishtae" });
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

//admin
app.get("/admin/getAllData", (req, res) => {
  res.send("All admin data");
});

app.listen("3000", () => {
  console.log("server started successfully");
});
