const mongoose = require("mongoose");

const connectionRequestSchema = mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },

    status: {
      type: String,
      enum: {
        values: ["intrested", "ignored", "accepted", "rejected"],
      },
      require: true,
    },
    fromUserName: {
      type: String,
    },
    toUserName: {
      type: String,
    },
  },
  { timestamps: true },
);

//indexes

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

//mangoose pre

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Cannot send request to yourself");
  }
  next;
});
const ConnectionRequestModel = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema,
);

module.exports = ConnectionRequestModel;
