const express = require("express");
const connectDB = require("../src/config/database");

const app = express();
const cookieParser = require("cookie-parser");
const authRouter = require("./router/authRouter");
const profileRouter = require("./router/profileRouter");
const requestRouter = require("./router/requestRouter");
const userRouter = require("./router/userRouter");
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

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
