const express = require("express");
const { userAuth } = require("../middleware/auth");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(400).send(`Something went wrong : ${error.message}`);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  const loggedIn = req.user;
  console.log("before", loggedIn);

  Object.keys(req.body).forEach((key) => (loggedIn[key] = req.body[key]));

  await loggedIn.save();
  console.log("after", loggedIn);
  res.json(loggedIn);
});

profileRouter.patch("/profile/update-password", userAuth, async (req, res) => {
  try {
    const { newPassword, currentPassword } = req.body;

    const user = req.user;
    const compareOldPass = await bcrypt.compare(currentPassword, user.password);

    if (!compareOldPass) {
      throw new Error("Old password is not correct");
    }

    const compareNewPass = await bcrypt.compare(newPassword, user.password);

    if (compareNewPass) {
      throw new Error("New password cannot be same as old password");
    }

    const hashNewPass = await bcrypt.hash(newPassword, 10);

    user.password = hashNewPass;

    await user.save();

    res.send("Password updated successfully");
  } catch (error) {
    console.log(error);
    res.status(400).send(`Something went wrong : ${error.message}`);
  }
});

module.exports = profileRouter;
