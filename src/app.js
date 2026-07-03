const express = require("express");
const connectDB = require("../src/config/database");
const User = require("./models/user");
const { getSignUpValidation } = require("./utils/validation");
const app = express();
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middleware/auth");
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    getSignUpValidation(req);

    const { firstName, lastName, emailId, password } = req.body;

    //encrypt pass
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send("User Added Successfully");
  } catch (error) {
    console.log(error);
    res.status(400).send(`Something went wrong : ${error.message}`);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credientials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const token = await jwt.sign({ id: user._id }, "DEVTinder@23", {
        expiresIn: "7d",
      });
      res.cookie("token", token);
      res.send("Login successfull");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(`Something went wrong : ${error.message}`);
  }
});

//profile

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(400).send(`Something went wrong : ${error.message}`);
  }
});

//sendconnectionrequest

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(`Connection request send successfully by ${user.firstName}`);
  } catch (error) {
    console.log(error);
    res.status(400).send(`Something went wrong : ${error.message}`);
  }
});

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
