const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user.id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const fromUserName = req.user.firstName
      //allowed status
      const allowedStatus = ["intrested", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).send("Invalid Status type");
      }

      //check if touserId is present in userlist or not
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "User Not Found" });
      }

      //existing request
      const existingRequest = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingRequest) {
        return res.status(400).send("Connection Request already exists");
      }
      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
        fromUserName,
        toUserName:toUser.firstName
      });

      const data = await connectionRequest.save();

      const message =
        status === "intrested"
          ? "Connection request sent successfully."
          : "User ignored successfully.";

      res.json({ message, data });
    } catch (error) {
      console.log(error);
      res.status(400).send(`Something went wrong : ${error.message}`);
    }
  },
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    //edge cases
    //status only accepted and rejected should be allowed
    //loggedinid and touserid should be equal
    //valid request id should be input
    //only intrested status can be accepted or rejected
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).send("Invalid status type");
      }

      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUser.id,
        status: "intrested",
      });
      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection Request Not found" });
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({ message: `Connection Request ${status} successfully`, data });
    } catch (error) {
      res.status(400).send("Something went wrong : " + error.message);
    }
  },
);

module.exports = requestRouter;
