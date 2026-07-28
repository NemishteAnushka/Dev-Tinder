const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const user = require("../models/user");
userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const userRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser.id,
      status: "intrested",
    }).populate("fromUserId", ["firstName", "lastName"]);
    res.json({ message: "Fetched data successfully", data: userRequests });
  } catch (error) {
    res.status(400).send(`Something went wrong ${error.message}`);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const userConnections = await ConnectionRequestModel.find({
      $or: [
        { toUserId: loggedInUser.id, status: "accepted" },
        { fromUserId: loggedInUser.id, status: "accepted" },
      ],
    })
      .populate("fromUserId", ["firstName", "lastName"])
      .populate("toUserId", ["firstName", "lastName"]);
    const data = userConnections.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser.id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    console.log(data);
    res.json({ data });
  } catch (error) {
    res.status(400).send(`Something went wrong ${error.message}`);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser.id }, { toUserId: loggedInUser.id }],
    }).select("fromUserId toUserId");

    const hideUserRequests = new Set();
    connectionRequest.forEach((row) => {
      hideUserRequests.add(row.fromUserId.toString());
      hideUserRequests.add(row.toUserId.toString());
    });

    console.log(hideUserRequests);

    const userFeed = await user.find({
      _id: { $nin: Array.from(hideUserRequests) },
    }).select("firstName lastName age gender skills");
    res.json({ data: userFeed });
  } catch (error) {
    res.status(400).send(`Something Went Wrong ${error.message}`);
  }
});
module.exports = userRouter;
