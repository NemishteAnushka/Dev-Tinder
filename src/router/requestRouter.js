const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth");

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(`Connection request send successfully by ${user.firstName}`);
  } catch (error) {
    console.log(error);
    res.status(400).send(`Something went wrong : ${error.message}`);
  }
});

module.exports = requestRouter;
